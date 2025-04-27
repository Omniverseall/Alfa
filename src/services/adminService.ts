// Mock database for admin functionality
let doctors = [
  {
    id: 1,
    name: "Иванов Иван Иванович",
    specialization: "Кардиолог",
    experience: "15 лет опыта",
    education: "Ташкентская медицинская академия",
    description: "Специалист высшей категории по диагностике и лечению сердечно-сосудистых заболеваний.",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Петрова Мария Сергеевна",
    specialization: "Терапевт",
    experience: "10 лет опыта",
    education: "Самаркандский государственный медицинский институт",
    description: "Опытный терапевт с обширной практикой.",
    image: "/placeholder.svg",
  }
];

let news = [
  {
    id: 1,
    title: "Новое оборудование в нашей клинике",
    date: "15.04.2025",
    category: "Оборудование",
    content: "Мы рады сообщить о поступлении нового диагностического оборудования.",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Акция на комплексное обследование",
    date: "10.04.2025",
    category: "Акции",
    content: "До конца месяца действует скидка 20% на комплексную диагностику организма.",
    image: "/placeholder.svg",
  }
];

let services = [
  {
    id: 1,
    name: "Консультация терапевта",
    price: 100000,
    category: "Консультации специалистов",
  },
  {
    id: 2,
    name: "ЭКГ",
    price: 80000,
    category: "Диагностика",
  }
];

export const adminService = {
  // Doctors
  getDoctors: () => doctors,
  addDoctor: (doctor) => {
    const newDoctor = { ...doctor, id: Date.now() };
    doctors = [...doctors, newDoctor];
    return newDoctor;
  },
  updateDoctor: (id, doctor) => {
    doctors = doctors.map(d => d.id === id ? { ...d, ...doctor } : d);
    return doctor;
  },
  deleteDoctor: (id) => {
    doctors = doctors.filter(d => d.id !== id);
    return true;
  },

  // News
  getNews: () => news,
  addNews: (newsItem) => {
    const newNews = { ...newsItem, id: Date.now() };
    news = [...news, newNews];
    return newNews;
  },
  updateNews: (id, newsItem) => {
    news = news.map(n => n.id === id ? { ...n, ...newsItem } : n);
    return newsItem;
  },
  deleteNews: (id) => {
    news = news.filter(n => n.id !== id);
    return true;
  },

  // Services
  getServices: () => services,
  addService: (service) => {
    const newService = { ...service, id: Date.now() };
    services = [...services, newService];
    return newService;
  },
  updateService: (id, service) => {
    services = services.map(s => s.id === id ? { ...s, ...service } : s);
    return service;
  },
  deleteService: (id) => {
    services = services.filter(s => s.id !== id);
    return true;
  }
};