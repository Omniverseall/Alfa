
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { adminService, NewsItem } from "@/services/adminService";
import { Skeleton } from "@/components/ui/skeleton";

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Все категории");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        // Попытка использовать кэшированные данные для быстрого отображения
        const cachedNews = localStorage.getItem('cached_news');
        if (cachedNews && isMounted) {
          setNews(JSON.parse(cachedNews));
          setLoading(false);
        }
        
        // Загрузка свежих данных
        const data = await adminService.getNews();
        if (isMounted) {
          setNews(data);
          localStorage.setItem('cached_news', JSON.stringify(data));
          setLoading(false);
        }
      } catch (error) {
         console.error("Failed to load news:", error);
         setLoading(false);
      }
    };

    load();

    const unsubscribe = adminService.subscribeNews((updatedNews) => {
        if (isMounted) {
            setNews(updatedNews);
            localStorage.setItem('cached_news', JSON.stringify(updatedNews));
        }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const filteredNews = news.filter(
    (item) => selectedCategory === "Все категории" || item.category === selectedCategory
  );

  const categories = ["Все категории", ...Array.from(new Set(news.map(item => item.category)))];

  // Функция для рендеринга скелетона при загрузке
  const renderSkeletons = () => (
    <>
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
          <Skeleton className="h-48 w-full" />
          <div className="p-6">
            <div className="flex items-center mb-2">
              <Skeleton className="h-4 w-4 mr-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16 ml-2" />
            </div>
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Новости</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Актуальная информация о новостях клиники и специальных предложениях
          </p>
        </div>

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

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            renderSkeletons()
          ) : filteredNews.length > 0 ? (
            filteredNews.map((newsItem) => (
              <div
                key={newsItem.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {newsItem.image && (
                   <div className="h-48 w-full overflow-hidden">
                    <img
                      src={newsItem.image}
                      alt={newsItem.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span className="flex items-center">
                       <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
                       {newsItem.date}
                    </span>
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-brand-blue rounded text-xs font-medium truncate">
                        {newsItem.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">{newsItem.title}</h3>
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
            ))
          ) : (
             <div className="text-center py-10 text-gray-500 col-span-3">
                  Нет новостей в выбранной категории.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
