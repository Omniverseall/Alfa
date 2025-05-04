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

// Cache duration in milliseconds (1 minute - reduced from 5 minutes for faster refreshes)
const CACHE_DURATION = 1 * 60 * 1000;

const isCacheValid = (type: 'doctors' | 'news' | 'services') => {
  return Date.now() - cache.lastFetch[type] < CACHE_DURATION;
};

// Subscribers for real-time updates
const subscribers = {
  doctors: new Set<Function>(),
  news: new Set<Function>(),
  services: new Set<Function>()
};

export const adminService = {
  // Doctors
  getDoctors: async (): Promise<Doctor[]> => {
    if (isCacheValid('doctors') && cache.doctors.length > 0) {
      console.log("Using cached doctors data");
      return cache.doctors;
    }

    try {
      console.log("Fetching fresh doctors data");
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      cache.doctors = data || [];
      cache.lastFetch.doctors = Date.now();
      console.log(`Fetched ${cache.doctors.length} doctors from database`);
      return cache.doctors;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return cache.doctors;
    }
  },

  addDoctor: async (doctor: Omit<Doctor, 'id'>): Promise<Doctor | null> => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .insert([doctor])
        .select()
        .single();

      if (error) throw error;

      cache.doctors = [...cache.doctors, data];
      subscribers.doctors.forEach(callback => callback(cache.doctors));
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

      cache.doctors = cache.doctors.map(d => d.id === id ? { ...d, ...doctor } : d);
      subscribers.doctors.forEach(callback => callback(cache.doctors));
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

      cache.doctors = cache.doctors.filter(d => d.id !== id);
      subscribers.doctors.forEach(callback => callback(cache.doctors));
      return true;
    } catch (error) {
      console.error('Error deleting doctor:', error);
      return false;
    }
  },

  // News
  getNews: async (): Promise<NewsItem[]> => {
    if (isCacheValid('news') && cache.news.length > 0) {
      console.log("Using cached news data");
      return cache.news;
    }

    try {
      console.log("Fetching fresh news data");
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      cache.news = data || [];
      cache.lastFetch.news = Date.now();
      console.log(`Fetched ${cache.news.length} news items from database`);
      return cache.news;
    } catch (error) {
      console.error('Error fetching news:', error);
      return cache.news;
    }
  },

  addNews: async (news: Omit<NewsItem, 'id'>): Promise<NewsItem | null> => {
    try {
      const { data, error } = await supabase
        .from('news')
        .insert([{ ...news, date: new Date().toLocaleDateString() }])
        .select()
        .single();

      if (error) throw error;

      cache.news = [data, ...cache.news];
      subscribers.news.forEach(callback => callback(cache.news));
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

      cache.news = cache.news.map(n => n.id === id ? { ...n, ...news } : n);
      subscribers.news.forEach(callback => callback(cache.news));
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

      cache.news = cache.news.filter(n => n.id !== id);
      subscribers.news.forEach(callback => callback(cache.news));
      return true;
    } catch (error) {
      console.error('Error deleting news:', error);
      return false;
    }
  },

  // Services
  getServices: async (): Promise<Service[]> => {
    if (isCacheValid('services') && cache.services.length > 0) {
      console.log("Using cached services data");
      return cache.services;
    }

    try {
      console.log("Fetching fresh services data");
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      cache.services = data || [];
      cache.lastFetch.services = Date.now();
      console.log(`Fetched ${cache.services.length} services from database`);
      return cache.services;
    } catch (error) {
      console.error('Error fetching services:', error);
      return cache.services;
    }
  },

  addService: async (service: Omit<Service, 'id'>): Promise<Service | null> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single();

      if (error) throw error;

      cache.services = [...cache.services, data];
      subscribers.services.forEach(callback => callback(cache.services));
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

      cache.services = cache.services.map(s => s.id === id ? { ...s, ...service } : s);
      subscribers.services.forEach(callback => callback(cache.services));
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

      cache.services = cache.services.filter(s => s.id !== id);
      subscribers.services.forEach(callback => callback(cache.services));
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      return false;
    }
  },

  // Subscription handlers
  subscribeDoctors: (callback: (doctors: Doctor[]) => void) => {
    subscribers.doctors.add(callback);
    return () => subscribers.doctors.delete(callback);
  },

  subscribeNews: (callback: (news: NewsItem[]) => void) => {
    subscribers.news.add(callback);
    return () => subscribers.news.delete(callback);
  },

  subscribeServices: (callback: (services: Service[]) => void) => {
    subscribers.services.add(callback);
    return () => subscribers.services.delete(callback);
  }
};
