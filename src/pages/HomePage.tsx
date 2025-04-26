import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight, User, Calendar, HeartPulse, Stethoscope, FlaskConical, Search } from "lucide-react";

// Mock data
const services = [
  {
    id: 1,
    title: "Диагностика",
    description: "Комплексное обследование с использованием современного оборудования",
    icon: Search,
  },
  {
    id: 2,
    title: "Консультации врачей",
    description: "Приём высококвалифицированных специалистов разных направлений",
    icon: User,
  },
  {
    id: 3,
    title: "Лабораторные анализы",
    description: "Широкий спектр лабораторных исследований с точными результатами",
    icon: FlaskConical,
  },
  {
    id: 4,
    title: "Кардиология",
    description: "Диагностика и лечение заболеваний сердечно-сосудистой системы",
    icon: HeartPulse,
  },
  {
    id: 5,
    title: "Терапия",
    description: "Лечение и профилактика внутренних заболеваний",
    icon: Stethoscope,
  },
  {
    id: 6,
    title: "Плановые осмотры",
    description: "Регулярные медицинские осмотры для поддержания здоровья",
    icon: Calendar,
  },
];

const doctors = [
  {
    id: 1,
    name: "Иванов Иван Иванович",
    specialization: "Кардиолог",
    experience: "15 лет опыта",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Петрова Мария Сергеевна",
    specialization: "Терапевт",
    experience: "10 лет опыта",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Сидоров Алексей Петрович",
    specialization: "Невролог",
    experience: "12 лет опыта",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Козлова Анна Владимировна",
    specialization: "Эндокринолог",
    experience: "8 лет опыта",
    image: "/placeholder.svg",
  },
];

const news = [
  {
    id: 1,
    title: "Новое оборудование в нашей клинике",
    date: "15.04.2025",
    excerpt: "Мы рады сообщить о поступлении нового диагностического оборудования...",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Акция на комплексное обследование",
    date: "10.04.2025",
    excerpt: "До конца месяца действует скидка 20% на комплексную диагностику организма...",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "К нам присоединился новый специалист",
    date: "05.04.2025",
    excerpt: "В нашей команде пополнение - ведущий кардиохирург с международным опытом...",
    image: "/placeholder.svg",
  },
];

// Animation wrapper component
const AnimateOnScroll = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    });

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const HomePage = () => {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-brand-blue/90 to-brand-blue h-[80vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="w-full h-full bg-[url('/placeholder.svg')] bg-center bg-cover"></div>
        </div>

        <div className="container mx-auto px-4 z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
              Современная клиника Alfa Diagnostic в Ташкенте
            </h1>
            <p className="text-xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
              Комплексная диагностика и лечение с использованием современного оборудования и опытом квалифицированных специалистов
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <Button asChild size="lg" className="bg-brand-red hover:bg-red-700 text-white">
                <Link to="/appointment">Записаться на приём</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20">
                <Link to="/prices">Прайс-лист</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <AnimateOnScroll className="">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src="/placeholder.svg"
                  alt="О клинике Alfa Diagnostic"
                  className="w-full h-auto object-cover"
                />
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll className="" delay={200}>
              <div>
                <h2 className="section-title">О клинике Alfa Diagnostic</h2>
                <p className="text-gray-600 mb-6">
                  Клиника Alfa Diagnostic — это современный медицинский центр в Ташкенте,
                  оснащенный передовым оборудованием и укомплектованный высококвалифицированными
                  специалистами. Мы предлагаем полный спектр медицинских услуг, от диагностики
                  до лечения и профилактики заболеваний.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5" />
                    <span>Современное диагностическое оборудование</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5" />
                    <span>Врачи высшей категории с многолетним опытом</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5" />
                    <span>Комфортные условия для пациентов</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5" />
                    <span>Точные результаты анализов в кратчайшие сроки</span>
                  </li>
                </ul>
                <Button asChild className="bg-brand-blue hover:bg-blue-700">
                  <Link to="/feedback">Узнать больше</Link>
                </Button>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title inline-block">Наши услуги</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              Мы предлагаем широкий спектр медицинских услуг для диагностики,
              лечения и профилактики различных заболеваний
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <AnimateOnScroll
                key={service.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 hover-scale"
                delay={index * 100}
              >
                <div className="p-4 bg-brand-blue/10 rounded-full inline-block mb-4">
                  <service.icon className="h-8 w-8 text-brand-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link
                  to="/prices"
                  className="inline-flex items-center text-brand-blue hover:text-brand-red transition-colors font-medium"
                >
                  Подробнее <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </AnimateOnScroll>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-brand-red hover:bg-red-700">
              <Link to="/prices">Смотреть все услуги</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title inline-block">Наши врачи</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              В нашей клинике работают высококвалифицированные специалисты
              с многолетним опытом работы
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor, index) => (
              <AnimateOnScroll
                key={doctor.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group hover-scale"
                delay={index * 100}
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-1">{doctor.name}</h3>
                  <p className="text-brand-blue font-medium">{doctor.specialization}</p>
                  <p className="text-gray-500 text-sm mt-1">{doctor.experience}</p>
                  <Link
                    to="/doctors"
                    className="mt-4 inline-flex items-center text-brand-blue hover:text-brand-red transition-colors font-medium"
                  >
                    Подробнее <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-brand-blue hover:bg-blue-700">
              <Link to="/doctors">Все врачи</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title inline-block">Новости и акции</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              Актуальная информация о новостях клиники, акциях и специальных предложениях
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <AnimateOnScroll
                key={item.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover-scale"
                delay={index * 100}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{item.date}</div>
                  <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.excerpt}</p>
                  <Link
                    to={`/news/${item.id}`}
                    className="inline-flex items-center text-brand-blue hover:text-brand-red transition-colors font-medium"
                  >
                    Читать далее <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
              <Link to="/news">Все новости</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-brand-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimateOnScroll className="">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Позаботьтесь о своем здоровье сегодня</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Запишитесь на консультацию к нашим высококвалифицированным специалистам прямо сейчас
            </p>
            <Button asChild size="lg" className="bg-brand-red hover:bg-red-700 text-white">
              <Link to="/appointment">Записаться на приём</Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
