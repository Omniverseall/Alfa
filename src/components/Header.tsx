import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Главная", path: "/" },
    { name: "Прайс-лист", path: "/prices" },
    { name: "Наши врачи", path: "/doctors" },
    { name: "Новости", path: "/news" },
    // { name: "Запись на приём", path: "/appointment" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on location change
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? "bg-white shadow-md" : "bg-white/95"}`}>
      <div className="bg-brand-blue text-white py-2">
        <div className="container mx-auto flex flex-wrap justify-between items-center px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <a href="tel:+998712345678" className="text-sm hover:underline whitespace-nowrap">+998 71 234-56-78</a>
            </div>
            <div className="hidden sm:flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <a href="mailto:info@alfadiagnostic.uz" className="text-sm hover:underline">info@alfadiagnostic.uz</a>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
            <img
              src="/lovable-uploads/8db8d2d1-17f6-4423-853f-8f7ae7e1b4c1.png"
              alt="Alfa Diagnostic Logo"
              className="h-[57px] w-[120px] rounded object-contain" // Добавлен object-contain для лучшего отображения
            />
          </Link>

          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-gray-700 hover:text-brand-red transition-colors relative group ${
                  location.pathname === link.path ? "text-brand-red font-medium" : ""
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover:w-full ${
                  location.pathname === link.path ? "w-full" : ""
                }`}></span>
              </Link>
            ))}
          </nav>
          <div className="hidden lg:block">
          </div>
          <button
            className="lg:hidden text-gray-700 hover:text-brand-red z-50" // z-50 чтобы кнопка была поверх меню
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white z-40 lg:hidden transform transition-transform duration-300 ease-in-out flex flex-col
                    ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="overflow-y-auto pt-24 pb-8 px-4"> {/* Отступ сверху для хедера и лого */}
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xl py-3 px-3 rounded-md transition-colors ${
                  location.pathname === link.path 
                    ? "text-white bg-brand-red font-medium" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-brand-blue"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {/* Кнопка Записаться на приём в мобильном меню, если нужна */}
            {/* <Button asChild className="bg-brand-red hover:bg-red-700 text-white mt-6 w-full py-3 text-lg"> */}
              {/* <Link to="/appointment" onClick={() => setIsMobileMenuOpen(false)}>Записаться на приём</Link> */}
            {/* </Button> */}
          </nav>
          <div className="mt-8 border-t pt-6 space-y-3">
             <div className="flex items-center text-gray-700">
              <Phone className="h-5 w-5 mr-3 text-brand-blue" />
              <a href="tel:+998712345678" className="hover:underline">+998 71 234-56-78</a>
            </div>
            <div className="flex items-center text-gray-700">
              <Mail className="h-5 w-5 mr-3 text-brand-blue" />
              <a href="mailto:info@alfadiagnostic.uz" className="hover:underline">info@alfadiagnostic.uz</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;