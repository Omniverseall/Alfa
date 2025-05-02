
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import SplashScreen from "./SplashScreen";

const Layout = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Always show splash screen on every page load
  useEffect(() => {
    // We intentionally show splash screen on every load
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Ensure splash shows for at least 3 seconds for better UX

    return () => clearTimeout(timer);
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
