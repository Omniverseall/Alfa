import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight } from "lucide-react";
import { adminService, Doctor, NewsItem, GeneralService, CacheType, isMemoryCacheValid } from "@/services/adminService";
import EmptyState from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import YandexMap from "@/components/YandexMap";

const DoctorSkeleton = () => ( 
    <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col h-full"> 
        <Skeleton className="w-full aspect-[3/4]" /> 
        <div className="p-6 flex flex-col flex-grow"> 
            <div className="flex-grow"> 
                <Skeleton className="h-5 w-3/4 mb-2" /> 
                <Skeleton className="h-4 w-1/2 mb-2" /> 
                <Skeleton className="h-3 w-1/3 mb-1" />
                <Skeleton className="h-3 w-2/3 mb-1" />
                <Skeleton className="h-3 w-1/2 mb-3" />
            </div> 
            <Skeleton className="h-3 w-full mb-3 mt-2"/>
            <Skeleton className="h-10 w-full" /> 
        </div> 
    </div> 
);
const ServiceSkeleton = () => ( <div className="bg-white rounded-lg shadow-md p-6"> <Skeleton className="h-6 w-3/4 mb-2" /> <Skeleton className="h-4 w-1/2 mb-2" /> <Skeleton className="h-5 w-1/3" /> </div> );
const NewsSkeleton = () => ( <div className="bg-white rounded-lg overflow-hidden shadow-md"> <Skeleton className="h-48 w-full" /> <div className="p-6"> <Skeleton className="h-4 w-24 mb-2" /> <Skeleton className="h-6 w-3/4 mb-2" /> <Skeleton className="h-4 w-32 mt-4" /> </div> </div> );
const LocationCard = ({ title, address }: { title: string; address: string }) => ( <div className="bg-white p-4 rounded-lg shadow-md"> <h3 className="font-medium text-lg text-brand-blue">{title}</h3> <p className="text-gray-600">{address}</p> </div> );

const HomePage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [generalServices, setGeneralServices] = useState<GeneralService[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [errorLoading, setErrorLoading] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDataAndHandleLoading = async () => {
      if (!isMounted) return;
      const doctorsCacheValid = isMemoryCacheValid('doctors');
      const newsCacheValid = isMemoryCacheValid('news');
      const generalServicesCacheValid = isMemoryCacheValid('generalServices');

      if (!(doctorsCacheValid && newsCacheValid && generalServicesCacheValid)) {
        setIsLoadingInitial(true);
      }
      setErrorLoading(null);

      try {
        await Promise.allSettled([
          adminService.getDoctors(),
          adminService.getNews(),
          adminService.getGeneralServices()
        ]);
      } catch (e) {
        if (isMounted) {
          console.error("HomePage: Initial fetch trigger failed", e);
          setErrorLoading("Не удалось загрузить данные. Попробуйте позже.");
          setIsLoadingInitial(false);
        }
      }
    };

    let doctorDataReceived = false;
    let newsDataReceived = false;
    let generalServiceDataReceived = false;

    const checkAllDataReceived = () => {
        if (isMounted && doctorDataReceived && newsDataReceived && generalServiceDataReceived) {
            setIsLoadingInitial(false);
        }
    };

    const unsubscribeDoctors = adminService.subscribeDoctors((data) => { if(isMounted) { setDoctors(data); doctorDataReceived = true; checkAllDataReceived(); } });
    const unsubscribeNews = adminService.subscribeNews((data) => { if(isMounted) { setNews(data); newsDataReceived = true; checkAllDataReceived(); } });
    const unsubscribeGeneralServices = adminService.subscribeGeneralServices((data) => { if(isMounted) { setGeneralServices(data); generalServiceDataReceived = true; checkAllDataReceived(); } });

    fetchDataAndHandleLoading();

    return () => {
      isMounted = false;
      unsubscribeDoctors();
      unsubscribeNews();
      unsubscribeGeneralServices();
    };
  }, []);

  return (
    <div>
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
               <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20">
                 <Link to="/prices">Прайс-лист</Link>
               </Button>
             </div>
           </div>
         </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
         <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
           <div className="rounded-lg overflow-hidden shadow-xl">
             <img src="https://www.shutterstock.com/image-photo/attractive-female-doctor-front-medical-600nw-291144536.jpg" alt="О клинике Alfa Diagnostic" className="w-full h-auto object-cover"/>
           </div>
           <div>
             <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">О клинике Alfa Diagnostic</h2>
             <p className="text-gray-600 mb-6">Клиника Alfa Diagnostic — современный медицинский центр в Ташкенте, оснащённый передовым оборудованием и высококвалифицированными специалистами.</p>
             <ul className="space-y-3 mb-6">
               <li className="flex items-start"><ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5 flex-shrink-0" /> Современное диагностическое оборудование</li>
               <li className="flex items-start"><ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5 flex-shrink-0" /> Врачи высшей категории</li>
               <li className="flex items-start"><ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5 flex-shrink-0" /> Комфортные условия</li>
               <li className="flex items-start"><ChevronRight className="h-5 w-5 text-brand-red mr-2 mt-0.5 flex-shrink-0" /> Точные результаты анализов</li>
             </ul>
             <Button asChild className="bg-brand-blue hover:bg-blue-700 text-white">
               <Link to="/feedback">Узнать больше</Link>
             </Button>
           </div>
         </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Наши врачи</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">В нашей клинике работают высококвалифицированные специалисты с многолетним опытом.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingInitial ? Array(4).fill(0).map((_,i)=><DoctorSkeleton key={`docskel-${i}`}/>) : errorLoading ? <div className="col-span-full"><EmptyState message={errorLoading} /></div> : doctors.length > 0 ? (
              doctors.slice(0,4).map(d=>(
                <div key={d.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all text-left flex flex-col h-full">
                    <div className="flex flex-col flex-grow group">
                        <Link to={`/doctors/${d.id}`}>
                            <div className="w-full aspect-[3/4] overflow-hidden bg-gray-100 flex items-center justify-center">
                                {d.image ? <img src={d.image} alt={d.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"/> : <div className="w-full h-full flex items-center justify-center text-gray-400">Нет фото</div>}
                            </div>
                            <div className="p-4 md:p-6 flex-grow">
                                <h3 className="font-semibold text-lg whitespace-pre-wrap">{d.name}</h3>
                                <p className="text-brand-blue text-sm whitespace-pre-wrap">{d.specialization}</p>
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500 font-semibold">Опыт работы:</p>
                                    <p className="text-gray-600 text-sm whitespace-pre-wrap mt-0.5">{d.experience}</p>
                                </div>
                                {d.education && (
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-500 font-semibold">Образование:</p>
                                        <p className="text-gray-600 text-sm whitespace-pre-wrap mt-0.5">{d.education}</p>
                                    </div>
                                )}
                            </div>
                        </Link>
                        <div className="px-4 md:px-6 pb-3 mt-auto">
                            <p className="text-xs text-blue-600 italic">
                                Дни приёма и другие подробности - по кнопке 'Подробнее'.
                            </p>
                        </div>
                        <div className="p-4 md:p-6 pt-2">
                            <Link to={`/doctors/${d.id}`} className="block bg-brand-blue hover:bg-blue-700 text-white text-center py-3 px-4 rounded-md text-sm font-medium w-full transition-colors duration-300">
                                Подробнее
                            </Link>
                        </div>
                    </div>
                </div>
              ))
            ) : <div className="col-span-full"><EmptyState message="Врачи не добавлены"/></div>}
          </div>
          {!isLoadingInitial && !errorLoading && doctors.length > 0 && (<div className="mt-12"><Button asChild size="lg" className="bg-brand-blue hover:bg-blue-700 text-white"><Link to="/doctors">Все врачи</Link></Button></div>)}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
         <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Наши услуги</h2>
           <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Мы предлагаем широкий спектр медицинских услуг.</p>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {isLoadingInitial ? Array(6).fill(0).map((_,i)=><ServiceSkeleton key={`servskel-${i}`}/>) : errorLoading ? <div className="col-span-full"><EmptyState message={errorLoading}/></div> : generalServices.length > 0 ? (
               generalServices.slice(0,6).map(s=>(<div key={s.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all text-left"><h3 className="text-xl font-semibold mb-2 text-gray-800">{s.name}</h3><p className="font-medium mt-2 text-brand-red">{s.price.toLocaleString('uz-UZ')} сум</p></div>))
             ) : <div className="col-span-full"><EmptyState message="Услуги не добавлены"/></div>}
           </div>
           {!isLoadingInitial && !errorLoading && generalServices.length > 0 && (<div className="mt-12"><Button asChild size="lg" className="bg-brand-red hover:bg-red-700 text-white"><Link to="/prices">Показать все цены</Link></Button></div>)}
         </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
         <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Новости</h2>
           <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Следите за нашими новостями.</p>
           <div className="grid md:grid-cols-3 gap-6">
             {isLoadingInitial ? Array(3).fill(0).map((_,i)=><NewsSkeleton key={`newsskel-${i}`}/>) : errorLoading ? <div className="col-span-full"><EmptyState message={errorLoading}/></div> : news.length > 0 ? (
               news.slice(0,3).map(n=>(
                <div key={n.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all text-left flex flex-col h-full">
                    <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                        {n.image ? <img src={n.image} alt={n.title} className="max-w-full max-h-full object-contain"/> : <div className="w-full h-full flex items-center justify-center text-gray-400">Нет изображения</div>}
                    </div>
                    <div className="p-4 md:p-6 flex flex-col flex-grow">
                        <div className="text-xs text-gray-500 mb-1">{new Date(n.date).toLocaleDateString()}</div>
                        <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">{n.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-3 flex-grow italic">Полный текст доступен по ссылке...</p>
                        <div className="mt-auto pt-3">
                            <Link to={`/news/${n.id}`} className="inline-flex items-center text-brand-blue hover:text-brand-red text-sm font-medium">
                                Читать далее <ArrowRight className="ml-1.5 h-4 w-4"/>
                            </Link>
                        </div>
                    </div>
                </div>
                ))
             ) : <div className="col-span-full"><EmptyState message="Новости не добавлены"/></div>}
           </div>
            {!isLoadingInitial && !errorLoading && news.length > 0 && (<div className="mt-12"><Button asChild size="lg" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"><Link to="/news">Все новости</Link></Button></div>)}
         </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Наши филиалы</h2><p className="text-gray-600 mb-6 max-w-2xl mx-auto">Мы находимся в двух удобных локациях в Ташкенте</p><div className="grid md:grid-cols-2 gap-6 mb-12"><LocationCard title="Медицинская лаборатория" address="ул. Корасув, 4, Ташкент"/><LocationCard title="Медцентр, клиника" address="Ташкент, Мирзо-Улугбекский район, массив Карасу, 4-й квартал, 2"/></div></div>
          <YandexMap />
        </div>
      </section>
    </div>
  );
};
export default HomePage;