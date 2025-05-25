// src/pages/NewsPage.tsx
// No changes needed. The provided code already implements Swiper logic
// (loop condition, slidesPerView, centeredSlides, modules) for mobile view
// consistently with DoctorsPage.tsx.
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { adminService, NewsItem } from "@/services/adminService";
import { Skeleton } from "@/components/ui/skeleton";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PLACEHOLDER_IMAGE = "/placeholder.svg";

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Все категории");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = adminService.subscribeNews((updatedNews) => {
        setNews(updatedNews);
        setLoading(false);
    });
    adminService.getNews().catch(e => {
        console.error("Error fetching news on page load:", e);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredNews = news.filter(
    (item) => selectedCategory === "Все категории" || item.category === selectedCategory
  );

  const categories = ["Все категории", ...Array.from(new Set(news.map(item => item.category)))];

  const NewsCard = ({ newsItem }: { newsItem: NewsItem }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full mx-1">
        <div className="h-48 w-full overflow-hidden relative bg-gray-100 flex items-center justify-center">
            {newsItem.image && newsItem.image !== PLACEHOLDER_IMAGE && (
                <img 
                    src={newsItem.image} 
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-md scale-105"
                />
            )}
            {newsItem.image && newsItem.image !== PLACEHOLDER_IMAGE && <div className="absolute inset-0 bg-black/10"></div>}
            <img
              src={newsItem.image || PLACEHOLDER_IMAGE}
              alt={newsItem.title}
              className="relative z-10 max-w-full max-h-full object-contain"
              loading="lazy"
            />
            {(!newsItem.image || newsItem.image === PLACEHOLDER_IMAGE) && (
                 <div className="absolute inset-0 flex items-center justify-center z-0">
                    <img src={PLACEHOLDER_IMAGE} alt={newsItem.title} className="w-1/3 h-1/3 object-contain opacity-30" />
                 </div>
            )}
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>{new Date(newsItem.date).toLocaleDateString()}</span>
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-brand-blue rounded text-xs font-medium truncate">
                  {newsItem.category}
              </span>
          </div>
          <h3 className="font-semibold text-lg mb-3 text-gray-800 line-clamp-2">{newsItem.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{newsItem.content}</p>
          <div className="mt-auto">
             <Link
                to={`/news/${newsItem.id}`}
                className="inline-flex items-center text-brand-blue hover:text-brand-red transition-colors duration-200 font-medium group"
              >
               Читать далее
               <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
          </div>
        </div>
    </div>
  );

  const renderNewsSkeletons = (count = 6) => (
    Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col h-full mx-1">
            <Skeleton className="h-48 w-full" />
            <div className="p-6 flex flex-col flex-grow">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-auto" />
                <Skeleton className="h-4 w-32 mt-4" />
            </div>
        </div>
    ))
  );
  
  const mobileSwiperParams = {
    modules: [Navigation, Pagination],
    spaceBetween: 10,
    slidesPerView: 1.5, 
    centeredSlides: true,
    navigation: true,
    pagination: { clickable: true },
    className: "py-4 mobile-swiper-news"
  };
  
  const mobileSkeletonSwiperParams = {
    modules: [Navigation, Pagination],
    spaceBetween: 10,
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: false, 
    navigation: true,
    pagination: { clickable: true },
    className: "py-4 mobile-swiper-news"
  };

  return (
    <div className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Новости</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Актуальная информация о новостях клиники и специальных предложениях
          </p>
        </div>

        {(!loading || news.length > 0) && (
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`transition-colors duration-200 ${
                  selectedCategory === category
                    ? "bg-brand-blue hover:bg-blue-700 text-white"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        )}
        
        {loading ? (
            isMobile ? (
                <Swiper {...mobileSkeletonSwiperParams} >
                  {renderNewsSkeletons(3).map((skeleton, index) => <SwiperSlide key={`skel-news-${index}`} style={{height: 'auto'}}>{skeleton}</SwiperSlide>)}
                </Swiper>
            ) : (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderNewsSkeletons()}
                </div>
            )
        ) : filteredNews.length > 0 ? (
            isMobile ? (
                <Swiper {...mobileSwiperParams} loop={filteredNews.length > 2}>
                    {filteredNews.map((newsItem) => (
                        <SwiperSlide key={newsItem.id} style={{height: 'auto'}}>
                            <NewsCard newsItem={newsItem} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.map((newsItem) => <NewsCard key={newsItem.id} newsItem={newsItem} />)}
                </div>
            )
        ) : (
             <div className="text-center py-10 text-gray-500 col-span-full">
                  Новости в категории "{selectedCategory}" не найдены или еще не добавлены.
             </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;