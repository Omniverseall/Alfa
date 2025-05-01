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

// Cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getFromCache = (key: string) => {
  const item = cache.get(key);
  if (!item) return null;
  
  const isExpired = Date.now() - item.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(key);
    return null;
  }
  
  return item.data;
};

const setInCache = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
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
    const cached = getFromCache('doctors');
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      setInCache('doctors', data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return [];
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

      cache.delete('doctors');
      subscribers.doctors.forEach(callback => callback());
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

      cache.delete('doctors');
      subscribers.doctors.forEach(callback => callback());
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

      cache.delete('doctors');
      subscribers.doctors.forEach(callback => callback());
      return true;
    } catch (error) {
      console.error('Error deleting doctor:', error);
      return false;
    }
  },

  // News
  getNews: async (): Promise<NewsItem[]> => {
    const cached = getFromCache('news');
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      setInCache('news', data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
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

      cache.delete('news');
      subscribers.news.forEach(callback => callback());
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

      cache.delete('news');
      subscribers.news.forEach(callback => callback());
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

      cache.delete('news');
      subscribers.news.forEach(callback => callback());
      return true;
    } catch (error) {
      console.error('Error deleting news:', error);
      return false;
    }
  },

  // Services
  getServices: async (): Promise<Service[]> => {
    const cached = getFromCache('services');
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      setInCache('services', data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
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

      cache.delete('services');
      subscribers.services.forEach(callback => callback());
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

      cache.delete('services');
      subscribers.services.forEach(callback => callback());
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

      cache.delete('services');
      subscribers.services.forEach(callback => callback());
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      return false;
    }
  },

  // Subscription handlers
  subscribeDoctors: (callback: () => void) => {
    subscribers.doctors.add(callback);
    return () => subscribers.doctors.delete(callback);
  },

  subscribeNews: (callback: () => void) => {
    subscribers.news.add(callback);
    return () => subscribers.news.delete(callback);
  },

  subscribeServices: (callback: () => void) => {
    subscribers.services.add(callback);
    return () => subscribers.services.delete(callback);
  }
};