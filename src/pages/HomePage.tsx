
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Clock, Stethoscope, HeartPulse, FlaskConical, ChevronRight, ArrowRight } from "lucide-react";
import { adminService } from "@/services/adminService";
import EmptyState from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import YandexMap from "@/components/YandexMap";

const LocationCard = ({ title, address }: { title: string; address: string }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="font-medium text-lg text-brand-blue">{title}</h3>
    <p className="text-gray-600">{address}</p>
  </div>
);

const HomePage = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Try to use cached data for fast loading
      const cachedDoctors = localStorage.getItem('cached_doctors');
      const cachedNews = localStorage.getItem('cached_news');
      const cachedServices = localStorage.getItem('cached_services');
      
      if (cachedDoctors) setDoctors(JSON.parse(cachedDoctors));
      if (cachedNews) setNews(JSON.parse(cachedNews));
      if (cachedServices) setServices(JSON.parse(cachedServices));
      
      // If we have any cached data, we can show it immediately
      if (cachedDoctors || cachedNews || cachedServices) {
        setIsLoading(false);
      }
      
      try {
        // Load fresh data in parallel
        const [doctorsData, newsData, servicesData] = await Promise.all([
          adminService.getDoctors(),
          adminService.getNews(),
          adminService.getServices()
        ]);
        
        // Update cache and state
        localStorage.setItem('cached_doctors', JSON.stringify(doctorsData));
        localStorage.setItem('cached_news', JSON.stringify(newsData));
        localStorage.setItem('cached_services', JSON.stringify(servicesData));
        
        setDoctors(doctorsData);
        setNews(newsData);
        setServices(servicesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up subscriptions for data updates
    const unsubscribeDoctors = adminService.subscribeDoctors((updatedDoctors) => {
      setDoctors(updatedDoctors);
      localStorage.setItem('cached_doctors', JSON.stringify(updatedDoctors));
    });

    const unsubscribeNews = adminService.subscribeNews((updatedNews) => {
      setNews(updatedNews);
      localStorage.setItem('cached_news', JSON.stringify(updatedNews));
    });

    const unsubscribeServices = adminService.subscribeServices((updatedServices) => {
      setServices(updatedServices);
      localStorage.setItem('cached_services', JSON.stringify(updatedServices));
    });

    return () => {
      unsubscribeDoctors();
      unsubscribeNews();
      unsubscribeServices();
    };
  }, []);

  // Components for loading display
  const DoctorSkeleton = () => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <Skeleton className="h-64 w-full" />
      <div className="p-6">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-3 w-1/3 mb-4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
  
  const ServiceSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  );
  
  const NewsSkeleton = () => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <Skeleton className="h-48 w-full" />
      <div className="p-6">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-blue/90 to-brand-blue h-[80vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="w-full h-full bg-[url('https://i.ibb.co/Q3F0qC66/Chat-GPT-Image-28-2025-15-30-31.png')] bg-center bg-cover"></div>
        </div>
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Современная клиника Alfa Diagnostic в Ташкенте</h1>
            <p className="text-xl text-white/90 mb-8">
              Комплексная диагностика и лечение с использованием современного оборудования и опыта квалифицированных специалистов
            </p>
            <div className="flex flex-wrap gap-4">
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
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src="https://www.shutterstock.com/image-photo/attractive-female-doctor-front-medical-600nw-291144536.jpg"
              alt="О клинике Alfa Diagnostic"
              className="w-full h-auto object-cover"
            />
          </div>
          <div>
            <h2 className="section-title">О клинике Alfa Diagnostic</h2>
            <p className="text-gray-600 mb-6">
              Клиника Alfa Diagnostic — современный медицинский центр в Ташкенте, оснащённый передовым оборудованием и высококвалифицированными специалистами.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start"><ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5" /> Современное диагностическое оборудование</li>
              <li className="flex items-start"><ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5" /> Врачи высшей категории</li>
              <li className="flex items-start"><ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5" /> Комфортные условия</li>
              <li className="flex items-start"><ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5" /> Точные результаты анализов</li>
            </ul>
            <Button asChild className="bg-brand-blue hover:bg-blue-700">
              <Link to="/feedback">Узнать больше</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Наши врачи</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            В нашей клинике работают высококвалифицированные специалисты с многолетним опытом.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Skeletons for loading
              Array(4).fill(0).map((_, index) => <DoctorSkeleton key={`doctor-skeleton-${index}`} />)
            ) : doctors.length > 0 ? (
              doctors.slice(0, 4).map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <Link to={`/doctors/${doctor.id}`} className="block">
                    <div className="h-64 overflow-hidden">
                      <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg">{doctor.name}</h3>
                      <p className="text-brand-blue">{doctor.specialization}</p>
                      <p className="text-gray-500 text-sm">{doctor.experience}</p>
                      <div className="inline-flex items-center mt-4 text-brand-blue hover:text-brand-red">
                        Подробнее <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <EmptyState message="Врачи пока не добавлены" />
            )}
          </div>
          <div className="mt-12">
            <Button asChild size="lg" className="bg-brand-blue hover:bg-blue-700">
              <Link to="/doctors">Все врачи</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Наши услуги</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Мы предлагаем широкий спектр медицинских услуг.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Skeletons for loading
              Array(6).fill(0).map((_, index) => <ServiceSkeleton key={`service-skeleton-${index}`} />)
            ) : services.length > 0 ? (
              services.slice(0, 6).map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600">{service.category}</p>
                  <p className="font-medium mt-2">{service.price.toLocaleString()} сум</p>
                </div>
              ))
            ) : (
              <EmptyState message="Услуги пока не добавлены" />
            )}
          </div>
          <div className="mt-12">
            <Button asChild size="lg" className="bg-brand-red hover:bg-red-700 text-white">
              <Link to="/prices">Показать все цены</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Новости</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Следите за нашими новостями.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {isLoading ? (
              // Skeletons for loading
              Array(3).fill(0).map((_, index) => <NewsSkeleton key={`news-skeleton-${index}`} />)
            ) : news.length > 0 ? (
              news.slice(0, 3).map((item) => (
                <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img src={item.image || '/placeholder.svg'} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-gray-500">{item.date}</div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{item.content}</p>
                    <Link to={`/news/${item.id}`} className="inline-flex items-center mt-4 text-brand-blue hover:text-brand-red">
                      Читать далее <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState message="Новости пока не добавлены" />
            )}
          </div>
          <div className="mt-12">
            <Button asChild size="lg" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
              <Link to="/news">Все новости</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Наши филиалы</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Мы находимся в двух удобных локациях в Ташкенте
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <LocationCard 
                title="Медицинская лаборатория" 
                address="ул. Корасув, 4, Ташкент" 
              />
              <LocationCard 
                title="Медцентр, клиника" 
                address="Ташкент, Мирзо-Улугбекский район, массив Карасу, 4-й квартал, 2" 
              />
            </div>
          </div>
          <YandexMap />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
