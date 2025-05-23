import { supabase } from './supabaseClient';

export interface Doctor {
  id: string;
  name: string; // ФИО врача для профиля
  specialization: string; // Специализация для профиля
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

// Для общих диагностических услуг (таблица services)
export interface GeneralService {
  id: string;
  name: string; // Наименование услуги
  price: number;
}

// Для консультаций врачей с расписанием (новая таблица doctor_consultation_slots)
export interface DoctorConsultationSlot {
  id: string;
  specialization: string; // Название "Врач" из вашей таблицы (Терапевт, Эндокринолог)
  doctor_fio: string;    // ФИО врача из вашей таблицы
  reception_days?: string;
  reception_hours?: string;
  price: number;
}

export type CacheType = 'doctors' | 'news' | 'generalServices' | 'doctorConsultationSlots';

const memoryCache: { [key in CacheType]: any[] } = {
  doctors: [],
  news: [],
  generalServices: [],
  doctorConsultationSlots: [],
};
const memoryCacheLastFetch: { [key in CacheType]: number } = {
  doctors: 0, news: 0, generalServices: 0, doctorConsultationSlots: 0
};
const CACHE_DURATION = 60 * 1000;

export const isMemoryCacheValid = (type: CacheType): boolean => {
  return Date.now() - memoryCacheLastFetch[type] < CACHE_DURATION;
};

const subscribers = {
  doctors: new Set<(data: Doctor[]) => void>(),
  news: new Set<(data: NewsItem[]) => void>(),
  generalServices: new Set<(data: GeneralService[]) => void>(),
  doctorConsultationSlots: new Set<(data: DoctorConsultationSlot[]) => void>(),
};

const notifySubscribers = (type: CacheType, data: any[]) => {
  (subscribers[type] as Set<(data: any[]) => void>).forEach((cb) => {
    try { cb(Array.isArray(data) ? [...data] : []); } catch (e) { console.error(e); }
  });
};

const validateDataFormat = (type: CacheType, data: any[]): boolean => {
    if (!Array.isArray(data)) return false;
    return data.every(item => {
        if (!item || typeof item !== 'object') return false;
        switch (type) {
            case 'doctors': return 'id' in item && 'name' in item && 'specialization' in item;
            case 'news': return 'id' in item && 'title' in item && 'content' in item;
            case 'generalServices': return 'id' in item && 'name' in item && 'price' in item;
            case 'doctorConsultationSlots': return 'id' in item && 'specialization' in item && 'doctor_fio' in item && 'price' in item;
            default: return false;
        }
    });
};

const fetchWithCache = async (type: CacheType, fn: () => Promise<{data: any[]|null, error: any}>) => {
    if (memoryCache[type].length > 0 && isMemoryCacheValid(type)) return [...memoryCache[type]];
    try {
        const { data, error } = await fn();
        if (error) throw error;
        if (data === null || !Array.isArray(data) || (data.length > 0 && !validateDataFormat(type, data))) {
             memoryCache[type] = []; notifySubscribers(type, []); return [];
        }
        memoryCache[type] = [...data]; memoryCacheLastFetch[type] = Date.now();
        notifySubscribers(type, [...data]); return [...data];
    } catch (e) { console.error(e); notifySubscribers(type, []); throw e; }
};

export const adminService = {
  getDoctors: async (): Promise<Doctor[]> => fetchWithCache('doctors', async () => supabase.from('doctors').select('*').order('name')),
  addDoctor: async (d: Omit<Doctor,'id'>) => { try{const{data,error}=await supabase.from('doctors').insert(d).select().single(); if(error)throw error; adminService.clearCache('doctors'); return data;}catch(e){console.error(e);return null;}},
  updateDoctor: async (id:string, d:Partial<Omit<Doctor,'id'>>) => { try{const{data,error}=await supabase.from('doctors').update(d).eq('id',id).select().single(); if(error)throw error; adminService.clearCache('doctors'); return data;}catch(e){console.error(e);return null;}},
  deleteDoctor: async (id:string) => { try{const{error}=await supabase.from('doctors').delete().eq('id',id); if(error)throw error; adminService.clearCache('doctors'); return true;}catch(e){console.error(e);return false;}},

  getNews: async (): Promise<NewsItem[]> => fetchWithCache('news', async () => supabase.from('news').select('*').order('date', {ascending: false})),
  addNews: async (n: Omit<NewsItem,'id'>) => { try{const nd={...n,date:n.date||new Date().toISOString().split('T')[0]}; const{data,error}=await supabase.from('news').insert(nd).select().single(); if(error)throw error; adminService.clearCache('news'); return data;}catch(e){console.error(e);return null;}},
  updateNews: async (ni: NewsItem) => { try{const{id,...n}=ni; const nd={...n,date:n.date||new Date().toISOString().split('T')[0]}; const{data,error}=await supabase.from('news').update(nd).eq('id',id).select().single(); if(error)throw error; adminService.clearCache('news'); return data;}catch(e){console.error(e);return null;}},
  deleteNews: async (id:string) => { try{const{error}=await supabase.from('news').delete().eq('id',id); if(error)throw error; adminService.clearCache('news'); return true;}catch(e){console.error(e);return false;}},

  // General Services (from 'services' table)
  getGeneralServices: async (): Promise<GeneralService[]> => fetchWithCache('generalServices', async () => supabase.from('services').select('id, name, price').order('name')),
  addGeneralService: async (s: Omit<GeneralService,'id'>) => { try{const{data,error}=await supabase.from('services').insert({name:s.name,price:s.price}).select().single(); if(error)throw error; adminService.clearCache('generalServices'); return data;}catch(e){console.error(e);return null;}},
  updateGeneralService: async (id:string, s:Partial<Omit<GeneralService,'id'>>) => { try{const ud:Partial<GeneralService>={}; if(s.name!==undefined)ud.name=s.name; if(s.price!==undefined)ud.price=s.price; if(Object.keys(ud).length===0)return null; const{data,error}=await supabase.from('services').update(ud).eq('id',id).select().single(); if(error)throw error; adminService.clearCache('generalServices'); return data;}catch(e){console.error(e);return null;}},
  deleteGeneralService: async (id:string) => { try{const{error}=await supabase.from('services').delete().eq('id',id); if(error)throw error; adminService.clearCache('generalServices'); return true;}catch(e){console.error(e);return false;}},

  // Doctor Consultation Slots (from 'doctor_consultation_slots' table)
  getDoctorConsultationSlots: async (): Promise<DoctorConsultationSlot[]> => fetchWithCache('doctorConsultationSlots', async () => supabase.from('doctor_consultation_slots').select('*').order('specialization').order('doctor_fio')),
  addDoctorConsultationSlot: async (s: Omit<DoctorConsultationSlot,'id'>) => { try{const{data,error}=await supabase.from('doctor_consultation_slots').insert(s).select().single(); if(error)throw error; adminService.clearCache('doctorConsultationSlots'); return data;}catch(e){console.error(e);return null;}},
  updateDoctorConsultationSlot: async (id:string, s:Partial<Omit<DoctorConsultationSlot,'id'>>) => { try{const{data,error}=await supabase.from('doctor_consultation_slots').update(s).eq('id',id).select().single(); if(error)throw error; adminService.clearCache('doctorConsultationSlots'); return data;}catch(e){console.error(e);return null;}},
  deleteDoctorConsultationSlot: async (id:string) => { try{const{error}=await supabase.from('doctor_consultation_slots').delete().eq('id',id); if(error)throw error; adminService.clearCache('doctorConsultationSlots'); return true;}catch(e){console.error(e);return false;}},

  subscribeDoctors: (cb: (d: Doctor[])=>void)=>{subscribers.doctors.add(cb); if(memoryCache.doctors.length>0&&isMemoryCacheValid('doctors'))cb([...memoryCache.doctors]); else adminService.getDoctors().catch(console.error); return ()=>subscribers.doctors.delete(cb);},
  subscribeNews: (cb: (n: NewsItem[])=>void)=>{subscribers.news.add(cb); if(memoryCache.news.length>0&&isMemoryCacheValid('news'))cb([...memoryCache.news]); else adminService.getNews().catch(console.error); return ()=>subscribers.news.delete(cb);},
  subscribeGeneralServices: (cb: (s: GeneralService[])=>void)=>{subscribers.generalServices.add(cb); if(memoryCache.generalServices.length>0&&isMemoryCacheValid('generalServices'))cb([...memoryCache.generalServices]); else adminService.getGeneralServices().catch(console.error); return ()=>subscribers.generalServices.delete(cb);},
  subscribeDoctorConsultationSlots: (cb: (s: DoctorConsultationSlot[])=>void)=>{subscribers.doctorConsultationSlots.add(cb); if(memoryCache.doctorConsultationSlots.length>0&&isMemoryCacheValid('doctorConsultationSlots'))cb([...memoryCache.doctorConsultationSlots]); else adminService.getDoctorConsultationSlots().catch(console.error); return ()=>subscribers.doctorConsultationSlots.delete(cb);},

  clearCache: (t?:CacheType)=>{const ts:CacheType[]=t?[t]:['doctors','news','generalServices','doctorConsultationSlots']; ts.forEach(type=>{memoryCache[type]=[];memoryCacheLastFetch[type]=0;notifySubscribers(type,[]);}); console.log(`Cache cleared for: ${ts.join()}`);}
};