import { supabase } from "@/services/supabaseClient";
import { format } from "date-fns";

// --- Типы ---
export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: string;
  education: string;
  description: string;
  image: string;
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  category: string;
  content: string;
  image: string;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  category: string;
}

// --- Listeners ---
type Listener<T = any> = (items: T[]) => void;

let doctorListeners: Listener<Doctor>[] = [];
let newsListeners: Listener<NewsItem>[] = [];
let serviceListeners: Listener<Service>[] = [];

const notifyListeners = <T>(listeners: Listener<T>[], items: T[]) => {
  listeners.forEach(listener => listener(items));
};

// --- adminService ---
export const adminService = {
  // Doctors
  getDoctors: async () => {
    const { data, error } = await supabase.from("doctors").select("*");
    if (error) {
      console.error("Ошибка загрузки докторов:", error);
      return [];
    }
    return data as Doctor[];
  },
  subscribeDoctors: (listener: Listener<Doctor>) => {
    doctorListeners.push(listener);
    return () => {
      doctorListeners = doctorListeners.filter(l => l !== listener);
    };
  },
  addDoctor: async (doctor: Doctor) => {
    const newDoctor = { ...doctor, id: Date.now(), image: doctor.image || "/placeholder.svg" };
    await supabase.from("doctors").insert([newDoctor]);
    const updated = await adminService.getDoctors();
    notifyListeners(doctorListeners, updated);
  },
  updateDoctor: async (id: number, doctor: Partial<Doctor>) => {
    await supabase.from("doctors").update(doctor).eq("id", id);
    const updated = await adminService.getDoctors();
    notifyListeners(doctorListeners, updated);
  },
  deleteDoctor: async (id: number) => {
    await supabase.from("doctors").delete().eq("id", id);
    const updated = await adminService.getDoctors();
    notifyListeners(doctorListeners, updated);
  },

  // News
  getNews: async () => {
    const { data, error } = await supabase.from("news").select("*");
    if (error) {
      console.error("Ошибка загрузки новостей:", error);
      return [];
    }
    return data as NewsItem[];
  },
  subscribeNews: (listener: Listener<NewsItem>) => {
    newsListeners.push(listener);
    return () => {
      newsListeners = newsListeners.filter(l => l !== listener);
    };
  },
  addNews: async (newsItem: NewsItem) => {
    const dateString = format(new Date(), "dd.MM.yyyy");
    const newNews = { ...newsItem, id: Date.now(), date: dateString, image: newsItem.image || "/placeholder.svg" };
    await supabase.from("news").insert([newNews]);
    const updated = await adminService.getNews();
    notifyListeners(newsListeners, updated);
  },
  updateNews: async (id: number, newsItem: Partial<NewsItem>) => {
    await supabase.from("news").update(newsItem).eq("id", id);
    const updated = await adminService.getNews();
    notifyListeners(newsListeners, updated);
  },
  deleteNews: async (id: number) => {
    await supabase.from("news").delete().eq("id", id);
    const updated = await adminService.getNews();
    notifyListeners(newsListeners, updated);
  },

  // Services
  getServices: async () => {
    const { data, error } = await supabase.from("services").select("*");
    if (error) {
      console.error("Ошибка загрузки услуг:", error);
      return [];
    }
    return data as Service[];
  },
  subscribeServices: (listener: Listener<Service>) => {
    serviceListeners.push(listener);
    return () => {
      serviceListeners = serviceListeners.filter(l => l !== listener);
    };
  },
  addService: async (service: Service) => {
    const newService = { ...service, id: Date.now() };
    await supabase.from("services").insert([newService]);
    const updated = await adminService.getServices();
    notifyListeners(serviceListeners, updated);
  },
  updateService: async (id: number, service: Partial<Service>) => {
    await supabase.from("services").update(service).eq("id", id);
    const updated = await adminService.getServices();
    notifyListeners(serviceListeners, updated);
  },
  deleteService: async (id: number) => {
    await supabase.from("services").delete().eq("id", id);
    const updated = await adminService.getServices();
    notifyListeners(serviceListeners, updated);
  },
};
