import { supabase } from './supabaseClient';
import { getAllNews, addNews, updateNews, deleteNews } from '../lib/localDatabase';

// --- Интерфейсы данных с UUID ---
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  education?: string;
  description?: string;
  image: string | null;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  image: string | null;
  date: string;
}

// Урезанный интерфейс для кэша новостей в localStorage
export interface NewsItemCache {
    id: string;
    title: string;
    category: string;
    image: string | null;
    date: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
}

// Типы кэшируемых данных (ЭКСПОРТИРУЕМ)
export type CacheType = 'doctors' | 'news' | 'services';

// Внутренний кэш в памяти
const memoryCache: { [key in CacheType]: any[] } = {
  doctors: [],
  news: [],
  services: [],
};

const memoryCacheLastFetch: { [key in CacheType]: number } = {
    doctors: 0,
    news: 0,
    services: 0
};

// Длительность валидности кэша в памяти (1 минута)
const CACHE_DURATION = 60 * 1000;

// Проверка валидности кэша в памяти (ЭКСПОРТИРУЕМ)
export const isMemoryCacheValid = (type: CacheType): boolean => {
  return Date.now() - memoryCacheLastFetch[type] < CACHE_DURATION;
};

// Подписчики на обновления
const subscribers = {
  doctors: new Set<(data: Doctor[]) => void>(),
  news: new Set<(data: NewsItem[]) => void>(),
  services: new Set<(data: Service[]) => void>()
};

// Уведомление подписчиков
const notifySubscribers = (type: CacheType, data: any[]) => {
  (subscribers[type] as Set<(data: any[]) => void>).forEach((callback) => {
    try {
        callback(Array.isArray(data) ? [...data] : []);
    } catch (error) {
        console.error(`Error in subscriber for ${type}:`, error);
    }
  });
};


// Безопасная работа с localStorage
const safeLocalStorage = {
  setItem: (key: string, value: string): boolean => {
    try {
      const approxLimit = 4 * 1024 * 1024; // 4MB
      if (value.length > approxLimit) {
        console.warn(`Data for key "${key}" might be too large for localStorage (${(value.length / 1024 / 1024).toFixed(2)}MB). Skipping save.`);
        return false;
      }
      localStorage.setItem(key, value);
      return true;
    } catch (error: any) {
      if (error.name === 'QuotaExceededError') {
        console.warn(`Quota exceeded when trying to save "${key}".`);
      } else {
        console.error(`Failed to save "${key}" to localStorage:`, error);
      }
      return false;
    }
  },
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to retrieve "${key}" from localStorage:`, error);
      return null;
    }
  },
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove "${key}" from localStorage:`, error);
      return false;
    }
  },
};

// Оптимизация данных новостей ДЛЯ localStorage кэша
const optimizeNewsDataForLocalStorage = (news: NewsItem[]): NewsItemCache[] => {
  return news.map(item => ({
    id: item.id,
    title: item.title,
    category: item.category,
    date: item.date,
    image: item.image,
  }));
};

// Ограничение размера массива для кэша localStorage
const limitDataSize = <T>(data: T[], limit: number): T[] => {
  return data.slice(0, limit);
};

// Добавлена функция validateDataFormat для проверки формата данных
const validateDataFormat = (type: 'doctors' | 'news' | 'services', data: any[]): boolean => {
    if (!Array.isArray(data)) {
        console.warn(`Invalid ${type} data format: not an array`);
        return false;
    }

    const isValid = data.every(item => {
        switch (type) {
            case 'doctors':
                return 'id' in item && 'name' in item && 'specialization' in item;
            case 'news':
                return 'id' in item && 'title' in item && 'content' in item;
            case 'services':
                return 'id' in item && 'name' in item && 'price' in item;
            default:
                return false;
        }
    });

    if (!isValid) {
        console.warn(`Invalid ${type} data format: missing required fields`);
    }

    return isValid;
};

// Добавлена функция optimizeNewsData для оптимизации данных новостей
const optimizeNewsData = (news: any[]): any[] => {
    return news.map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        date: item.date,
        image: item.image,
        content: item.content?.substring(0, 50) + (item.content?.length > 50 ? '...' : ''),
    }));
};

// --- Основная функция загрузки данных с кэшированием ---
const fetchWithCache = async (type: 'doctors' | 'news' | 'services', fetchFunction: () => Promise<{ data: any[]; error: any }>) => {
    if (isMemoryCacheValid(type)) {
        console.log(`${type} data loaded from cache`);
        return memoryCache[type]; // Return cached data
    }

    try {
        const { data, error } = await fetchFunction();
        console.log(`Raw ${type} data from fetch:`, data); // Log raw data
        if (error) {
            console.error(`Error during fetch for ${type}:`, error);
            throw error; // Throw fetch error
        }

        if (data === null || data === undefined) { // Handle null/undefined data explicitly
             console.log(`Null or undefined ${type} data received from fetch.`);
             memoryCache[type] = [];
             memoryCacheLastFetch[type] = Date.now();
             notifySubscribers(type, []);
             return [];
        }

        if (!Array.isArray(data)) { // Ensure data is an array before checking length
            console.error(`Invalid ${type} data format: not an array. Raw data:`, data);
            throw new Error(`Invalid ${type} data format: expected array`);
        }

        if (data.length > 0) {
            if (!validateDataFormat(type, data)) {
                console.error(`Invalid ${type} data format detected by validation. Raw data:`, data); // Log invalid data
                throw new Error(`Invalid ${type} data format after validation`);
            }

            let optimizedData = type === 'news' ? optimizeNewsData(data) : data;
            optimizedData = limitDataSize(optimizedData, 50); // Сохраняем только 50 записей
            memoryCache[type] = optimizedData;
            memoryCacheLastFetch[type] = Date.now();

            notifySubscribers(type, optimizedData);
            return optimizedData; // Explicitly return the fetched and processed data
        } else {
            console.log(`Empty array for ${type} data received from fetch.`); // Log if empty array received
            memoryCache[type] = []; // Clear cache if empty array received
            memoryCacheLastFetch[type] = Date.now(); // Update timestamp
            notifySubscribers(type, []);
            return []; // Return empty array
        }
    } catch (error) {
        console.error(`Failed to fetch or process ${type} data:`, error);
        // Ensure subscribers are notified even in case of error
        notifySubscribers(type, []);
        throw error; // Re-throw the error so the caller knows about the failure
    }
};


// --- Экспортируемый сервис ---
export const adminService = {
  // Doctors
  getDoctors: async (): Promise<Doctor[]> => fetchWithCache('doctors', async () => {
    const { data, error } = await supabase.from('doctors').select('*').order('id', { ascending: true });
    return { data, error };
  }),

  // News
  getNews: async (): Promise<NewsItem[]> => {
    return await getAllNews();
  },

  addNews: async (newsItem: Omit<NewsItem, 'id' | 'date'>): Promise<void> => {
    const newNewsItem = { ...newsItem, id: crypto.randomUUID() };
    await addNews(newNewsItem);
  },

  updateNews: async (newsItem: Omit<NewsItem, 'date'>): Promise<void> => {
    await updateNews(newsItem);
  },

  deleteNews: async (id: string): Promise<void> => {
    await deleteNews(id);
  },

  // Services
  getServices: async (): Promise<Service[]> => fetchWithCache('services', async () => {
    const { data, error } = await supabase.from('services').select('*').order('id', { ascending: true });
    return { data, error };
  }),

  addDoctor: async (doctor: Omit<Doctor, 'id'>): Promise<Doctor | null> => {
    try {
      const { id, ...doctorData } = doctor as any;
      const { data, error } = await supabase
        .from('doctors')
        .insert([doctorData])
        .select()
        .single();
      if (error) throw error;
      adminService.clearCache('doctors');
      adminService.getDoctors().catch(err => console.error("Failed refetch after adding doctor:", err));
      return data;
    } catch (error) {
      console.error('Error adding doctor:', error);
      return null;
    }
  },

  updateDoctor: async (id: string, doctor: Partial<Omit<Doctor, 'id'>>): Promise<Doctor | null> => {
     try {
      const { data, error } = await supabase
        .from('doctors')
        .update(doctor)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      adminService.clearCache('doctors');
      adminService.getDoctors().catch(err => console.error("Failed refetch after updating doctor:", err));
      return data;
    } catch (error) {
       console.error('Error updating doctor:', error);
       return null;
    }
  },

  deleteDoctor: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('doctors').delete().eq('id', id);
      if (error) throw error;
      adminService.clearCache('doctors');
      adminService.getDoctors().catch(err => console.error("Failed refetch after deleting doctor:", err));
      return true;
    } catch (error) {
       console.error('Error deleting doctor:', error);
       return false;
    }
  },

  // Services
  addService: async (service: Omit<Service, 'id'>): Promise<Service | null> => {
    try {
      const { id, ...serviceData } = service as any;
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select()
        .single();
      if (error) throw error;
      adminService.clearCache('services');
      adminService.getServices().catch(err => console.error("Failed refetch after adding service:", err));
      return data;
    } catch (error) {
      console.error('Error adding service:', error);
      return null;
    }
  },

  updateService: async (id: string, service: Partial<Omit<Service, 'id'>>): Promise<Service | null> => {
    try {
       const { data, error } = await supabase
        .from('services')
        .update(service)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      adminService.clearCache('services');
      adminService.getServices().catch(err => console.error("Failed refetch after updating service:", err));
      return data;
    } catch (error) {
      console.error('Error updating service:', error);
      return null;
    }
  },

  deleteService: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      adminService.clearCache('services');
      adminService.getServices().catch(err => console.error("Failed refetch after deleting service:", err));
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      return false;
    }
  },

  // Подписки
 subscribeDoctors: (callback: (doctors: Doctor[]) => void): (() => void) => {
      subscribers.doctors.add(callback);
      if (memoryCache.doctors.length > 0 && isMemoryCacheValid('doctors')) {
          callback([...memoryCache.doctors]);
      } else if (memoryCache.doctors.length === 0 && isMemoryCacheValid('doctors')) {
          callback([]);
      } else {
          adminService.getDoctors().catch(err => console.error("Initial fetch failed for doctors subscription:", err));
      }
      return () => subscribers.doctors.delete(callback);
  },
 subscribeNews: (callback: (news: NewsItem[]) => void): (() => void) => {
      subscribers.news.add(callback);
      adminService.getNews()
          .then((news) => {
              callback(news);
              notifySubscribers('news', news); // Явное уведомление подписчиков
          })
          .catch(err => console.error("Initial fetch failed for news subscription:", err));
      return () => subscribers.news.delete(callback);
  },
 subscribeServices: (callback: (services: Service[]) => void): (() => void) => {
      subscribers.services.add(callback);
      if (memoryCache.services.length > 0 && isMemoryCacheValid('services')) {
          callback([...memoryCache.services]);
      } else if (memoryCache.services.length === 0 && isMemoryCacheValid('services')) {
           callback([]);
      } else {
          adminService.getServices().catch(err => console.error("Initial fetch failed for services subscription:", err));
      }
      return () => subscribers.services.delete(callback);
  },


  // Очистка кэша
  clearCache: (type?: CacheType) => {
    const typesToClear: CacheType[] = type ? [type] : ['doctors', 'news', 'services'];
    typesToClear.forEach(t => {
      memoryCache[t] = [];
      memoryCacheLastFetch[t] = 0;
      safeLocalStorage.removeItem(`cached_${t}`);
      console.log(`[Cache] Cache cleared for ${t}.`);
      notifySubscribers(t, []);
    });
  }
};

// Добавлена предварительная загрузка данных новостей
let preloadedNews: NewsItem[] | null = null;

export const preloadNews = async () => {
  if (!preloadedNews) {
    try {
      const newsData = await adminService.getNews();
      preloadedNews = newsData;
    } catch (error) {
      console.error("Ошибка предварительной загрузки новостей:", error);
    }
  }
};

export const getPreloadedNews = (): NewsItem[] | null => {
  return preloadedNews;
};