import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Clock, Stethoscope, HeartPulse, FlaskConical, ChevronRight, ArrowRight } from "lucide-react";
import { adminService } from "@/services/adminService";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";

const HomePage = () => {
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const [news, setNews] = React.useState<any[]>([]);
  const [services, setServices] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsData, newsData, servicesData] = await Promise.all([
          adminService.getDoctors(),
          adminService.getNews(),
          adminService.getServices()
        ]);
        setDoctors(doctorsData);
        setNews(newsData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const unsubscribeDoctors = adminService.subscribeDoctors(async () => {
      setDoctors(await adminService.getDoctors());
    });

    const unsubscribeNews = adminService.subscribeNews(async () => {
      setNews(await adminService.getNews());
    });

    const unsubscribeServices = adminService.subscribeServices(async () => {
      setServices(await adminService.getServices());
    });

    return () => {
      unsubscribeDoctors();
      unsubscribeNews();
      unsubscribeServices();
    };
  }, []);

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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Современная клиника Alfa Diagnostic в Ташкенте</h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8">
              Комплексная диагностика и лечение с использованием современного оборудования и опыта квалифицированных специалистов
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-brand-red hover:bg-red-700 text-white w-full sm:w-auto">
                <Link to="/appointment">Записаться на приём</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20 w-full sm:w-auto">
                <Link to="/prices">Прайс-лист</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
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
            <Button asChild className="bg-brand-blue hover:bg-blue-700 w-full sm:w-auto">
              <Link to="/feedback">Узнать больше</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Наши врачи</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            В нашей клинике работают высококвалифицированные специалисты с многолетним опытом.
          </p>
          {doctors.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.slice(0, 4).map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="h-48 sm:h-64 overflow-hidden">
                    <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <p className="text-brand-blue">{doctor.specialization}</p>
                    <p className="text-gray-500 text-sm">{doctor.experience}</p>
                    <Link to="/doctors" className="inline-flex items-center mt-4 text-brand-blue hover:text-brand-red">
                      Подробнее <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Врачи пока не добавлены" />
          )}
          <div className="mt-12">
            <Button asChild size="lg" className="bg-brand-blue hover:bg-blue-700 w-full sm:w-auto">
              <Link to="/doctors">Все врачи</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Наши услуги</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Мы предлагаем широкий спектр медицинских услуг.
          </p>
          {services.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600">{service.category}</p>
                  <p className="font-medium mt-2">{service.price.toLocaleString()} сум</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Услуги пока не добавлены" />
          )}
          <div className="mt-12">
            <Button asChild size="lg" className="bg-brand-red hover:bg-red-700 text-white w-full sm:w-auto">
              <Link to="/prices">Показать все цены</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Новости и акции</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Следите за нашими акциями и новостями.
          </p>
          {news.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {news.slice(0, 3).map((item) => (
                <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="text-sm text-gray-500">{item.date}</div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{item.content}</p>
                    <Link to={`/news/${item.id}`} className="inline-flex items-center mt-4 text-brand-blue hover:text-brand-red">
                      Читать далее <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Новости пока не добавлены" />
          )}
          <div className="mt-12">
            <Button asChild size="lg" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white w-full sm:w-auto">
              <Link to="/news">Все новости</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;