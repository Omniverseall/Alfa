
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
    // Немедленно показываем подготовленный UI
    const fetchData = async () => {
      try {
        // Попытка получить данные из localStorage для немедленного показа
        const cachedNews = localStorage.getItem('cached_news');
        if (cachedNews) {
          setNews(JSON.parse(cachedNews));
          setLoading(false);
        }
        
        // Затем загружаем свежие данные с сервера
        const freshNews = await adminService.getNews();
        
        // Сохраняем в кэш и обновляем состояние
        localStorage.setItem('cached_news', JSON.stringify(freshNews));
        setNews(freshNews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchData();
    
    // Подписываемся на обновления
    const unsubscribe = adminService.subscribeNews((updatedNews) => {
      setNews(updatedNews);
      localStorage.setItem('cached_news', JSON.stringify(updatedNews));
    });
    
    // Возвращаем функцию очистки напрямую
    return unsubscribe;
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
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Новости и акции</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Актуальная информация о новостях клиники, акциях и специальных предложениях
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category ? "bg-brand-blue hover:bg-blue-700" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            renderSkeletons()
          ) : (
            filteredNews.map((news) => (
              <div 
                key={news.id} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {news.date}
                    <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">{news.category}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{news.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{news.content}</p>
                  <Link 
                    to={`/news/${news.id}`} 
                    className="inline-flex items-center text-brand-blue hover:text-brand-red transition-colors font-medium"
                  >
                    Читать далее <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
