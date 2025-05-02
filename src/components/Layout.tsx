
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import SplashScreen from "./SplashScreen";
import { Skeleton } from "@/components/ui/skeleton";

const Layout = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Проверка, является ли это первым посещением
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (hasVisited) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem("hasVisited", "true");
    }
  }, []);

  useEffect(() => {
    if (!showSplash) {
      setIsLoaded(true);
    }
  }, [showSplash]);

  return (
    <>
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <div className={`min-h-screen flex flex-col ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
          <Header />
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      )}
    </>
  );
};

export default Layout;
