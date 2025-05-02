
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { adminService, NewsItem } from "@/services/adminService";

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Все категории");

  useEffect(() => {
    const load = async () => {
      const data = await adminService.getNews();
      setNews(data);
    };
    load();
    
    // Return the unsubscribe function directly
    return adminService.subscribeNews(setNews);
  }, []);

  const filteredNews = news.filter(
    (item) => selectedCategory === "Все категории" || item.category === selectedCategory
  );

  const categories = ["Все категории", ...Array.from(new Set(news.map(item => item.category)))];

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
          {filteredNews.map((news) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
