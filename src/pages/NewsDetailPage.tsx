import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { adminService, NewsItem } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";

const NewsDetailPage = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);

  useEffect(() => {
    const load = async () => {
      const newsList = await adminService.getNews();
      const found = newsList.find((n) => n.id === Number(id));
      setNewsItem(found || null);
    };
    load();
  }, [id]);

  if (!newsItem) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p>Новость не найдена. Вернитесь к списку новостей.</p>
          <Button asChild className="mt-4 bg-brand-blue hover:bg-blue-700">
            <Link to="/news">К списку новостей</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button asChild variant="outline" className="flex items-center">
            <Link to="/news">
              <ArrowLeft className="h-4 w-4 mr-2" /> К списку новостей
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="h-[300px] md:h-[400px] relative">
            <img
              src={newsItem.image}
              alt={newsItem.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-center text-white/80 mb-2">
                <Calendar className="h-4 w-4 mr-1" />
                {newsItem.date}
                <span className="ml-2 px-2 py-1 bg-white/20 rounded text-xs">{newsItem.category}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{newsItem.title}</h1>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="prose prose-lg max-w-none">
            {newsItem.content.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
