
import { supabase } from './supabaseClient';

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: string;
  education?: string;
  description?: string;
  image: string | null;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  category: string;
  image: string | null;
  date: string;
}

export interface Service {
  id: number;
  name: string;
  category: string;
  price: number;
}

// Cache for storing data
const cache = {
  doctors: [] as Doctor[],
  news: [] as NewsItem[],
  services: [] as Service[],
  lastFetch: {
    doctors: 0,
    news: 0,
    services: 0
  }
};

// Cache duration in milliseconds (reduced to 10 seconds for faster refreshes)
const CACHE_DURATION = 10 * 1000;

const isCacheValid = (type: 'doctors' | 'news' | 'services') => {
  return Date.now() - cache.lastFetch[type] < CACHE_DURATION;
};

// Subscribers for real-time updates
const subscribers = {
  doctors: new Set<Function>(),
  news: new Set<Function>(),
  services: new Set<Function>()
};

// Safe localStorage handling to prevent quota issues
const safeStorage = {
  setItem: (key: string, value: string): boolean => {
    try {
      // Try to remove existing items if we're approaching storage limits
      try {
        const oldItems = ['cached_doctors', 'cached_news', 'cached_services'];
        oldItems.forEach(item => {
          if (item !== key) localStorage.removeItem(item);
        });
      } catch (e) {
        console.log("Error cleaning storage:", e);
      }
      
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to save ${key} to localStorage:`, error);
      return false;
    }
  },

  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get ${key} from localStorage:`, error);
      return null;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove ${key} from localStorage:`, error);
      return false;
    }
  }
};

// Helper to update subscribers
const notifySubscribers = <T>(type: 'doctors' | 'news' | 'services', data: T[]) => {
  subscribers[type].forEach(callback => callback(data));
};

// For compressing news content to fit in localStorage
const compressNewsData = (news: NewsItem[]): Partial<NewsItem>[] => {
  return news.map(item => ({
    id: item.id,
    title: item.title,
    category: item.category,
    date: item.date,
    image: item.image,
    // Either truncate or omit content based on size
    content: item.content?.length > 100 ? `${item.content.substring(0, 100)}...` : item.content
  }));
};

export const adminService = {
  // Doctors
  getDoctors: async (): Promise<Doctor[]> => {
    try {
      console.log("Fetching doctors data");
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        cache.doctors = data;
        cache.lastFetch.doctors = Date.now();
        console.log(`Fetched ${cache.doctors.length} doctors from database`);
        
        // Try to update localStorage but don't fail if it errors
        safeStorage.setItem('cached_doctors', JSON.stringify(data));
        
        // Notify subscribers about the fresh data
        notifySubscribers('doctors', cache.doctors);
      } else if (cache.doctors.length === 0) {
        // Try to load from cache if no data from server
        const cachedData = safeStorage.getItem('cached_doctors');
        if (cachedData) {
          try {
            const parsedData = JSON.parse(cachedData);
            cache.doctors = parsedData;
            notifySubscribers('doctors', cache.doctors);
          } catch (e) {
            console.warn("Error parsing cached doctors:", e);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      
      // Try to load from cache on error
      const cachedData = safeStorage.getItem('cached_doctors');
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          cache.doctors = parsedData;
          notifySubscribers('doctors', cache.doctors);
        } catch (e) {
          console.warn("Error parsing cached doctors:", e);
        }
      }
    }
    
    return cache.doctors;
  },

  addDoctor: async (doctor: Omit<Doctor, 'id'>): Promise<Doctor | null> => {
    try {
      // Remove the id field if it exists (it shouldn't be passed when adding a new record)
      const doctorData = { ...doctor };
      
      const { data, error } = await supabase
        .from('doctors')
        .insert([doctorData])
        .select()
        .single();

      if (error) throw error;

      // Update cache and notify subscribers
      await adminService.getDoctors(); // Refresh the entire cache
      
      return data;
    } catch (error) {
      console.error('Error adding doctor:', error);
      return null;
    }
  },

  updateDoctor: async (id: number, doctor: Partial<Doctor>): Promise<Doctor | null> => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .update(doctor)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update cache and notify subscribers by refreshing data
      await adminService.getDoctors();
      
      return data;
    } catch (error) {
      console.error('Error updating doctor:', error);
      return null;
    }
  },

  deleteDoctor: async (id: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update cache and notify subscribers by refreshing data
      await adminService.getDoctors();
      
      return true;
    } catch (error) {
      console.error('Error deleting doctor:', error);
      return false;
    }
  },

  // News
  getNews: async (): Promise<NewsItem[]> => {
    try {
      console.log("Fetching news data");
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        cache.news = data;
        cache.lastFetch.news = Date.now();
        console.log(`Fetched ${cache.news.length} news items from database`);
        
        // Try to update localStorage with compressed data
        try {
          const compressedNewsData = compressNewsData(data);
          safeStorage.setItem('cached_news', JSON.stringify(compressedNewsData));
        } catch (e) {
          console.warn("Could not save news to localStorage:", e);
        }
        
        // Notify subscribers about the fresh data
        notifySubscribers('news', cache.news);
      } else if (cache.news.length === 0) {
        // Try to load from cache if no data from server
        const cachedData = safeStorage.getItem('cached_news');
        if (cachedData) {
          try {
            const parsedData = JSON.parse(cachedData);
            cache.news = parsedData;
            notifySubscribers('news', cache.news);
          } catch (e) {
            console.warn("Error parsing cached news:", e);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      
      // Try to load from cache on error
      const cachedData = safeStorage.getItem('cached_news');
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          cache.news = parsedData;
          notifySubscribers('news', cache.news);
        } catch (e) {
          console.warn("Error parsing cached news:", e);
        }
      }
    }
    
    return cache.news;
  },

  addNews: async (news: Omit<NewsItem, 'id'>): Promise<NewsItem | null> => {
    try {
      // Ensure date is set
      const newsData = { 
        ...news,
        date: news.date || new Date().toLocaleDateString() 
      };
      
      const { data, error } = await supabase
        .from('news')
        .insert([newsData])
        .select()
        .single();

      if (error) throw error;

      // Update cache and notify subscribers by refreshing data
      await adminService.getNews();
      
      return data;
    } catch (error) {
      console.error('Error adding news:', error);
      return null;
    }
  },

  updateNews: async (id: number, news: Partial<NewsItem>): Promise<NewsItem | null> => {
    try {
      const { data, error } = await supabase
        .from('news')
        .update(news)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update cache and notify subscribers by refreshing data
      await adminService.getNews();
      
      return data;
    } catch (error) {
      console.error('Error updating news:', error);
      return null;
    }
  },

  deleteNews: async (id: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update cache and notify subscribers by refreshing data
      await adminService.getNews();
      
      return true;
    } catch (error) {
      console.error('Error deleting news:', error);
      return false;
    }
  },

  // Services
  getServices: async (): Promise<Service[]> => {
    try {
      console.log("Fetching services data");
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        cache.services = data;
        cache.lastFetch.services = Date.now();
        console.log(`Fetched ${cache.services.length} services from database`);
        
        // Try to update localStorage but don't fail if it errors
        safeStorage.setItem('cached_services', JSON.stringify(data));
        
        // Notify subscribers about the fresh data
        notifySubscribers('services', cache.services);
      } else if (cache.services.length === 0) {
        // Try to load from cache if no data from server
        const cachedData = safeStorage.getItem('cached_services');
        if (cachedData) {
          try {
            const parsedData = JSON.parse(cachedData);
            cache.services = parsedData;
            notifySubscribers('services', cache.services);
          } catch (e) {
            console.warn("Error parsing cached services:", e);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      
      // Try to load from cache on error
      const cachedData = safeStorage.getItem('cached_services');
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          cache.services = parsedData;
          notifySubscribers('services', cache.services);
        } catch (e) {
          console.warn("Error parsing cached services:", e);
        }
      }
    }
    
    return cache.services;
  },

  addService: async (service: Omit<Service, 'id'>): Promise<Service | null> => {
    try {
      // Remove the id field if it exists
      const serviceData = { ...service };
      
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select()
        .single();

      if (error) throw error;

      // Update cache and notify subscribers by refreshing data
      await adminService.getServices();
      
      return data;
    } catch (error) {
      console.error('Error adding service:', error);
      return null;
    }
  },

  updateService: async (id: number, service: Partial<Service>): Promise<Service | null> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(service)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update cache and notify subscribers by refreshing data
      await adminService.getServices();
      
      return data;
    } catch (error) {
      console.error('Error updating service:', error);
      return null;
    }
  },

  deleteService: async (id: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update cache and notify subscribers by refreshing data
      await adminService.getServices();
      
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      return false;
    }
  },

  // Subscription handlers
  subscribeDoctors: (callback: (doctors: Doctor[]) => void) => {
    subscribers.doctors.add(callback);
    // Immediately call with existing data if available
    if (cache.doctors.length > 0) {
      callback(cache.doctors);
    } else {
      // If no cached data, fetch it immediately
      adminService.getDoctors().then(doctors => {
        if (doctors.length > 0) callback(doctors);
      });
    }
    return () => subscribers.doctors.delete(callback);
  },

  subscribeNews: (callback: (news: NewsItem[]) => void) => {
    subscribers.news.add(callback);
    // Immediately call with existing data if available
    if (cache.news.length > 0) {
      callback(cache.news);
    } else {
      // If no cached data, fetch it immediately
      adminService.getNews().then(news => {
        if (news.length > 0) callback(news);
      });
    }
    return () => subscribers.news.delete(callback);
  },

  subscribeServices: (callback: (services: Service[]) => void) => {
    subscribers.services.add(callback);
    // Immediately call with existing data if available
    if (cache.services.length > 0) {
      callback(cache.services);
    } else {
      // If no cached data, fetch it immediately
      adminService.getServices().then(services => {
        if (services.length > 0) callback(services);
      });
    }
    return () => subscribers.services.delete(callback);
  },

  // Clear cache if needed
  clearCache: (type?: 'doctors' | 'news' | 'services') => {
    if (!type) {
      cache.doctors = [];
      cache.news = [];
      cache.services = [];
      cache.lastFetch.doctors = 0;
      cache.lastFetch.news = 0;
      cache.lastFetch.services = 0;
      safeStorage.removeItem('cached_doctors');
      safeStorage.removeItem('cached_news');
      safeStorage.removeItem('cached_services');
    } else {
      cache[type] = [];
      cache.lastFetch[type] = 0;
      safeStorage.removeItem(`cached_${type}`);
    }
  }
};
