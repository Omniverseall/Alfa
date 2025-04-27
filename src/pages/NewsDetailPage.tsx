
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for a single news article (same as in NewsPage)
const newsData = [
  {
    id: 1,
    title: "Новое оборудование в нашей клинике",
    date: "15.04.2025",
    excerpt: "Мы рады сообщить о поступлении нового диагностического оборудования. Теперь наши специалисты смогут проводить более точную диагностику и выявлять заболевания на ранних стадиях.",
    content: "Мы рады сообщить о поступлении нового диагностического оборудования в нашу клинику. Современный аппарат МРТ последнего поколения позволяет получать изображения высокого разрешения и обнаруживать патологические изменения на самых ранних стадиях. Благодаря новейшим технологиям, исследование проходит быстрее и комфортнее для пациента. \n\nКроме того, мы установили новое оборудование для ультразвуковой диагностики, которое обеспечивает высокую точность исследований сердечно-сосудистой системы, органов брюшной полости и малого таза. \n\nНаши специалисты прошли дополнительное обучение и готовы применять новое оборудование для диагностики различных заболеваний. Записаться на обследование можно по телефону или через форму на нашем сайте.",
    image: "/placeholder.svg",
    category: "Оборудование",
  },
  {
    id: 2,
    title: "Акция на комплексное обследование",
    date: "10.04.2025",
    excerpt: "До конца месяца действует скидка 20% на комплексную диагностику организма. Воспользуйтесь возможностью проверить своё здоровье по выгодной цене.",
    content: "Уважаемые пациенты! \n\nС 10 апреля по 30 апреля 2025 года в нашей клинике действует специальное предложение - скидка 20% на комплексное обследование организма. \n\nВ программу обследования входят: \n- Консультация терапевта \n- Общий и биохимический анализ крови \n- ЭКГ \n- УЗИ органов брюшной полости \n- УЗИ щитовидной железы \n- Флюорография \n\nКомплексная диагностика позволяет выявить различные заболевания на ранней стадии и своевременно начать лечение. Регулярные профилактические осмотры - залог вашего здоровья! \n\nДля записи на обследование обращайтесь по телефону или через форму на нашем сайте. Количество мест ограничено!",
    image: "/placeholder.svg",
    category: "Акции",
  },
  {
    id: 3,
    title: "К нам присоединился новый специалист",
    date: "05.04.2025",
    excerpt: "В нашей команде пополнение - ведущий кардиохирург с международным опытом. Теперь доступны новые виды диагностики и лечения сердечно-сосудистых заболеваний.",
    content: "Мы рады сообщить, что к команде Alfa Diagnostic присоединился новый специалист - Петров Михаил Алексеевич, кардиохирург высшей категории с 15-летним опытом работы. \n\nМихаил Алексеевич является выпускником Первого Московского государственного медицинского университета им. И.М. Сеченова, прошел стажировку в ведущих клиниках Европы и США. \n\nСпециализация доктора включает: \n- Диагностику и лечение ишемической болезни сердца \n- Лечение врожденных и приобретенных пороков сердца \n- Аритмологию \n- Малоинвазивные вмешательства \n\nБлагодаря опыту и знаниям нового специалиста, мы расширяем спектр услуг в области кардиологии и предлагаем нашим пациентам современные методы диагностики и лечения сердечно-сосудистых заболеваний. \n\nЗаписаться на консультацию к Михаилу Алексеевичу можно по телефону или через форму на нашем сайте.",
    image: "/placeholder.svg",
    category: "Специалисты",
  },
  {
    id: 4,
    title: "Внимание! Изменение графика работы в праздничные дни",
    date: "01.04.2025",
    excerpt: "Уважаемые пациенты, обратите внимание на изменение графика работы нашей клиники в период майских праздников.",
    content: "Уважаемые пациенты! \n\nОбращаем ваше внимание на изменение графика работы клиники Alfa Diagnostic в период майских праздников: \n\n1 мая - выходной день \n2-3 мая - с 9:00 до 18:00 \n4-5 мая - с 9:00 до 15:00 \n6-8 мая - обычный график (8:00 - 20:00) \n9 мая - выходной день \n10-11 мая - с 9:00 до 18:00 \n\nС 12 мая клиника работает в обычном режиме. \n\nПриносим извинения за возможные неудобства и желаем вам приятных праздничных дней! \n\nВ экстренных случаях вы можете обратиться в дежурные медицинские учреждения города.",
    image: "/placeholder.svg",
    category: "Объявления",
  },
  {
    id: 5,
    title: "Профилактика сезонных заболеваний",
    date: "25.03.2025",
    excerpt: "С наступлением весны повышается риск сезонных заболеваний. Наши специалисты делятся рекомендациями по укреплению иммунитета и профилактике простудных заболеваний.",
    content: "С наступлением весны многие сталкиваются с сезонными заболеваниями, связанными с перепадами температуры и ослабленным после зимы иммунитетом. Специалисты клиники Alfa Diagnostic подготовили рекомендации по профилактике простудных заболеваний: \n\n1. Укрепляйте иммунитет: \n- Включите в рацион свежие фрукты и овощи \n- Принимайте витаминные комплексы после консультации с врачом \n- Обеспечьте достаточный сон (7-8 часов) \n- Регулярно занимайтесь физической активностью \n\n2. Соблюдайте правила гигиены: \n- Регулярно мойте руки \n- Используйте средства для дезинфекции при необходимости \n- Избегайте контакта с больными людьми \n\n3. Одевайтесь по погоде, избегайте переохлаждения \n\n4. Регулярно проветривайте помещения \n\n5. Пейте достаточное количество воды \n\nПри появлении первых симптомов простуды обращайтесь к врачу! Своевременное обращение за медицинской помощью поможет избежать осложнений и ускорит выздоровление. \n\nБудьте здоровы!",
    image: "/placeholder.svg",
    category: "Советы врачей",
  },
  {
    id: 6,
    title: "Открытие нового филиала клиники",
    date: "15.03.2025",
    excerpt: "Мы расширяемся! Скоро открытие нового филиала клиники Alfa Diagnostic в центральном районе города.",
    content: "Дорогие пациенты! \n\nМы рады сообщить о скором открытии нового филиала клиники Alfa Diagnostic в центральном районе города по адресу: ул. Навои, 45. \n\nНовый филиал будет оснащен самым современным оборудованием и предложит полный спектр медицинских услуг: \n- Консультации специалистов различного профиля \n- Диагностические исследования \n- Лабораторные анализы \n- Процедурный кабинет \n- Дневной стационар \n\nВ новом филиале будут работать опытные врачи, которые обеспечат высокое качество медицинских услуг. \n\nТоржественное открытие состоится 1 июня 2025 года. В день открытия для всех посетителей будут действовать специальные предложения и скидки на услуги. \n\nСледите за нашими новостями, чтобы узнать больше деталей! \n\nМы стремимся быть ближе к вам и делать качественную медицинскую помощь более доступной!",
    image: "/placeholder.svg",
    category: "Развитие",
  },
];

const NewsDetailPage = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);

  useEffect(() => {
    // Find the news item with the matching id
    const foundItem = newsData.find((item) => item.id === parseInt(id));
    setNewsItem(foundItem);

    // Find related news items (same category, excluding current)
    if (foundItem) {
      const related = newsData
        .filter((item) => item.category === foundItem.category && item.id !== foundItem.id)
        .slice(0, 3);
      setRelatedNews(related);
    }

    // Scroll to top when news item changes
    window.scrollTo(0, 0);
  }, [id]);

  // Function to format content with paragraphs
  const formatContent = (content) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph.split('\n').map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line}
            {lineIndex < paragraph.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

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

        {/* News Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 animate-fade-in">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 animate-fade-in animate-delay-200">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="prose prose-lg max-w-none">
                {formatContent(newsItem.content)}
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Поделиться:</span>
                  <button 
                    className="text-gray-400 hover:text-brand-blue transition-colors"
                    aria-label="Поделиться"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
                <Button asChild className="bg-brand-red hover:bg-red-700">
                  <Link to="/appointment">Записаться на приём</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="animate-fade-in animate-delay-300">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Похожие новости</h3>
              
              {relatedNews.length > 0 ? (
                <div className="space-y-4">
                  {relatedNews.map((related) => (
                    <div key={related.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <Link 
                        to={`/news/${related.id}`}
                        className="group"
                      >
                        <div className="flex items-center">
                          <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={related.image} 
                              alt={related.title} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium group-hover:text-brand-blue transition-colors line-clamp-2">
                              {related.title}
                            </h4>
                            <div className="text-xs text-gray-500 mt-1">{related.date}</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Нет похожих новостей.</p>
              )}

              <div className="mt-6">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/news">Смотреть все новости</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
