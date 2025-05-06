import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight } from "lucide-react";
// Импортируем CacheType и другие нужные типы/функции
import { adminService, Doctor, NewsItem, Service, CacheType, isMemoryCacheValid } from "@/services/adminService";
import EmptyState from "@/components/EmptyState"; // Убрали импорт EmptyStateProps
import { Skeleton } from "@/components/ui/skeleton";
import YandexMap from "@/components/YandexMap";
import { toast } from "@/components/ui/use-toast";

// --- Компоненты-заглушки (Skeletons) ---
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
            <Skeleton className="h-4 w-32 mt-4" />
        </div>
    </div>
);

// --- Карточка локации ---
const LocationCard = ({ title, address }: { title: string; address: string }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="font-medium text-lg text-brand-blue">{title}</h3>
    <p className="text-gray-600">{address}</p>
  </div>
);


// --- Основной компонент HomePage ---
const HomePage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    console.log("HomePage: Mounting and setting up subscriptions.");
    let isMounted = true;
    let loadedCount = 0;
    const totalToLoad = 3;
    let initialError = false; // Флаг для отслеживания ошибки на начальной загрузке

    const checkLoadingComplete = (isError: boolean = false) => {
        if (!isMounted) return; // Не обновлять состояние, если компонент размонтирован
        loadedCount++;
        if (isError) {
            initialError = true; // Запоминаем, что была ошибка
            setHasError(true);
        }
        // Завершаем загрузку, если все получено ИЛИ была ошибка
        if (loadedCount >= totalToLoad || initialError) {
             setIsLoading(false);
             console.log(`HomePage: Initial loading sequence complete (Errors: ${initialError}).`);
        }
    };

    // Подписка на врачей
    const unsubscribeDoctors = adminService.subscribeDoctors((updatedDoctors) => {
      if (isMounted) {
        setDoctors(updatedDoctors);
        // Если isLoading еще true, значит это часть начальной загрузки
        if (isLoading && loadedCount < totalToLoad) checkLoadingComplete();
      }
    });

    // Подписка на новости
    const unsubscribeNews = adminService.subscribeNews((updatedNews) => {
      if (isMounted) {
        setNews(updatedNews);
        if (isLoading && loadedCount < totalToLoad) checkLoadingComplete();
      }
    });

    // Подписка на услуги
    const unsubscribeServices = adminService.subscribeServices((updatedServices) => {
      if (isMounted) {
        setServices(updatedServices);
        if (isLoading && loadedCount < totalToLoad) checkLoadingComplete();
      }
    });

    // Инициируем загрузку через сервис, если кэш невалиден
    // Promise.allSettled для обработки ошибок каждой загрузки
    if (!isMemoryCacheValid('doctors') || !isMemoryCacheValid('news') || !isMemoryCacheValid('services')) {
        Promise.allSettled([
            adminService.getDoctors(),
            adminService.getNews(),
            adminService.getServices()
        ]).then(results => {
            let hadFetchError = false;
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    const type = ['doctors', 'news', 'services'][index] as CacheType; // Используем импортированный CacheType
                    console.error(`HomePage: Initial fetch failed for ${type}`, result.reason);
                    hadFetchError = true;
                }
            });
            // Если были ошибки при загрузке из сети, вызываем checkLoadingComplete с флагом ошибки
            if (hadFetchError) {
                 checkLoadingComplete(true);
            } else if (loadedCount < totalToLoad) {
                // Если ошибок не было, но checkLoadingComplete еще не завершил загрузку
                // (например, все данные пришли из валидного кэша памяти без подписки)
                checkLoadingComplete(false);
            }
        });
    } else {
         // Если весь кэш валиден, завершаем загрузку сразу
         setIsLoading(false);
         console.log("HomePage: Initial loading complete (all data from valid memory cache).");
    }


    return () => {
      console.log("HomePage: Unmounting.");
      isMounted = false;
      unsubscribeDoctors();
      unsubscribeNews();
      unsubscribeServices();
    };
  }, []);

  // --- Рендеринг ---
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-blue/90 to-brand-blue h-[80vh] min-h-[500px] flex items-center">
         {/* ... код секции ... */}
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
             <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">О клинике Alfa Diagnostic</h2>
             <p className="text-gray-600 mb-6">
               Клиника Alfa Diagnostic — современный медицинский центр в Ташкенте, оснащённый передовым оборудованием и высококвалифицированными специалистами.
             </p>
             <ul className="space-y-3 mb-6">
               <li className="flex items-start"><ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5 flex-shrink-0" /> Современное диагностическое оборудование</li>
               <li className="flex items-start"><ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5 flex-shrink-0" /> Врачи высшей категории</li>
               <li className="flex items-start"><ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5 flex-shrink-0" /> Комфортные условия</li>
               <li className="flex items-start"><ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5 flex-shrink-0" /> Точные результаты анализов</li>
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Наши врачи</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            В нашей клинике работают высококвалифицированные специалисты с многолетним опытом.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(4).fill(0).map((_, index) => <DoctorSkeleton key={`doctor-skeleton-${index}`} />)
            ) : hasError ? (
               <div className="col-span-4"><EmptyState message="Не удалось загрузить список врачей." /></div>
            ) : doctors.length > 0 ? (
              doctors.slice(0, 4).map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 text-left">
                  <Link to={`/doctors/${doctor.id}`} className="block">
                    <div className="h-64 overflow-hidden bg-gray-200">
                      {doctor.image ? (
                         <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" loading="lazy" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-400">Нет фото</div>
                       )}
                    </div>
                    <div className="p-4 md:p-6">
                      <h3 className="font-semibold text-lg">{doctor.name}</h3>
                      <p className="text-brand-blue text-sm">{doctor.specialization}</p>
                      <p className="text-gray-500 text-xs mt-1">{doctor.experience}</p>
                      <div className="inline-flex items-center mt-4 text-brand-blue hover:text-brand-red text-sm">
                        Подробнее <ArrowRight className="ml-1.5 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-4">
                <EmptyState message="Врачи пока не добавлены" />
              </div>
            )}
          </div>
          {!isLoading && !hasError && doctors.length > 0 && (
             <div className="mt-12">
               <Button asChild size="lg" className="bg-brand-blue hover:bg-blue-700">
                 <Link to="/doctors">Все врачи</Link>
               </Button>
             </div>
           )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-gray-50">
         <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Наши услуги</h2>
           <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
             Мы предлагаем широкий спектр медицинских услуг.
           </p>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {isLoading ? (
               Array(6).fill(0).map((_, index) => <ServiceSkeleton key={`service-skeleton-${index}`} />)
             ): hasError ? (
                 <div className="col-span-full"><EmptyState message="Не удалось загрузить список услуг." /></div>
             ) : services.length > 0 ? (
               services.slice(0, 6).map((service) => (
                 <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 text-left">
                   <h3 className="text-xl font-semibold mb-2 text-gray-800">{service.name}</h3>
                   <p className="text-gray-600 text-sm">{service.category}</p>
                   <p className="font-medium mt-2 text-brand-red">{service.price.toLocaleString()} сум</p>
                 </div>
               ))
             ) : (
               <div className="col-span-full">
                 <EmptyState message="Услуги пока не добавлены" />
               </div>
             )}
           </div>
           {!isLoading && !hasError && services.length > 0 && (
              <div className="mt-12">
                <Button asChild size="lg" className="bg-brand-red hover:bg-red-700 text-white">
                  <Link to="/prices">Показать все цены</Link>
                </Button>
              </div>
            )}
         </div>
      </section>

      {/* News Section */}
      <section className="py-16 md:py-24 bg-white">
         <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Новости</h2>
           <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
             Следите за нашими новостями.
           </p>
           <div className="grid md:grid-cols-3 gap-6">
             {isLoading ? (
               Array(3).fill(0).map((_, index) => <NewsSkeleton key={`news-skeleton-${index}`} />)
             ) : hasError ? (
                 <div className="col-span-full"><EmptyState message="Не удалось загрузить новости." /></div>
             ) : news.length > 0 ? (
               news.slice(0, 3).map((item) => ( // Отображаем полные NewsItem, но без content
                 <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 text-left flex flex-col">
                   <div className="h-48 overflow-hidden bg-gray-200">
                     {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">Нет изображения</div>
                      )}
                   </div>
                   <div className="p-4 md:p-6 flex flex-col flex-grow">
                     <div className="text-xs text-gray-500 mb-1">{item.date}</div>
                     <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">{item.title}</h3>
                     <p className="text-gray-500 text-sm line-clamp-3 flex-grow italic">Полный текст доступен по ссылке...</p>
                     <div className="mt-auto pt-3">
                        <Link to={`/news/${item.id}`} className="inline-flex items-center text-brand-blue hover:text-brand-red text-sm font-medium">
                          Читать далее <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                      </div>
                   </div>
                 </div>
               ))
             ) : (
               <div className="col-span-full">
                 <EmptyState message="Новости пока не добавлены" />
               </div>
             )}
           </div>
            {!isLoading && !hasError && news.length > 0 && (
              <div className="mt-12">
                <Button asChild size="lg" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                  <Link to="/news">Все новости</Link>
                </Button>
              </div>
            )}
         </div>
      </section>

      {/* Locations Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Наши филиалы</h2>
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

// Удалена ненужная декларация global и функция isMemoryCacheValid (она импортируется)