import { Link } from "react-router-dom";
import { Instagram, Phone, Mail, MapPin, Clock } from "lucide-react"; // Добавлены недостающие иконки

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img
                src="/lovable-uploads/8db8d2d1-17f6-4423-853f-8f7ae7e1b4c1.png"
                alt="Логотип Alfa Diagnostic"
                className="h-10 w-10 rounded bg-white object-contain"
              />
              <div>
                <h2 className="font-bold text-lg">Alfa Diagnostic</h2>
                <p className="text-xs text-gray-300">Клиника в Ташкенте</p>
              </div>
            </Link>
            <p className="text-gray-300 text-sm mb-4">
              Современная клиника с высококвалифицированными специалистами и передовым медицинским оборудованием.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/karasualfadiagnostic?igsh=aWtremEzcXI4ejM2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 text-brand-red" />
                <div>
                  <p className="font-medium">Телефон:</p>
                  <a href="tel:+998712345678" className="text-gray-300 hover:text-white">+998 71 234-56-78</a>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 text-brand-red" />
                <div>
                  <p className="font-medium">Email:</p>
                  <a href="mailto:info@alfadiagnostic.uz" className="text-gray-300 hover:text-white">info@alfadiagnostic.uz</a>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-brand-red" />
                <div>
                  <p className="font-medium">Адрес:</p>
                  <p className="text-gray-300">г. Ташкент, Мирзо-Улугбекский р-он, Карасу 4, дом 2</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-0.5 text-brand-red" />
                <div>
                  <p className="font-medium">Режим работы:</p>
                  <p className="text-gray-300">Пн-Сб: 8:00 - 20:00, Вс: 9:00 - 18:00</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">Услуги</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Диагностика</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Консультации врачей</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Лабораторные анализы</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">УЗИ диагностика</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">ЭКГ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Рентген</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Хирургические услуги</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">Информация</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Главная</Link></li>
              <li><Link to="/prices" className="text-gray-300 hover:text-white">Прайс-лист</Link></li>
              <li><Link to="/doctors" className="text-gray-300 hover:text-white">Наши врачи</Link></li>
              <li><Link to="/news" className="text-gray-300 hover:text-white">Новости</Link></li>
              <li><Link to="/appointment" className="text-gray-300 hover:text-white">Запись на приём</Link></li>
              <li><Link to="/admin/login" className="text-gray-400 hover:text-white text-sm">Вход для администратора</Link></li> {/* Added admin login link */}
              {/* Удалили "Обратная связь" */}
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Alfa Diagnostic. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
