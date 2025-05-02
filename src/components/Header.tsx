
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Убрали "Обратная связь"
  const navLinks = [
    { name: "Главная", path: "/" },
    { name: "Прайс-лист", path: "/prices" },
    { name: "Наши врачи", path: "/doctors" },
    { name: "Новости", path: "/news" },
    { name: "Запись на приём", path: "/appointment" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-white/95"}`}>
      <div className="bg-brand-blue text-white py-2">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <a href="tel:+998712345678" className="text-sm hover:underline">+998 71 234-56-78</a>
            </div>
            <div className="hidden md:flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <a href="mailto:info@alfadiagnostic.uz" className="text-sm hover:underline">info@alfadiagnostic.uz</a>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="text-sm px-2 py-1 rounded hover:bg-brand-blue-dark">РУС</button>
            <button className="text-sm px-2 py-1 rounded hover:bg-brand-blue-dark">UZB</button>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/8db8d2d1-17f6-4423-853f-8f7ae7e1b4c1.png"
              alt="Alfa Diagnostic Logo"
              className="h-12 w-12 rounded bg-white object-contain"
            />
            <div>
              <h1 className="font-bold text-xl text-brand-blue">Alfa Diagnostic</h1>
              <p className="text-xs text-gray-600">Клиника в Ташкенте</p>
            </div>
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
            <Button asChild className="bg-brand-red hover:bg-red-700 text-white">
              <Link to="/appointment">Записаться на приём</Link>
            </Button>
          </div>

          <button
            className="lg:hidden text-gray-700 hover:text-brand-red"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-white z-40 lg:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="container mx-auto p-4 mt-20">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-lg p-2 border-b border-gray-100 ${
                  location.pathname === link.path ? "text-brand-red font-medium" : "text-gray-700"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button asChild className="bg-brand-red hover:bg-red-700 text-white mt-4 w-full">
              <Link to="/appointment">Записаться на приём</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
