
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import SplashScreen from "./SplashScreen";

const Layout = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Show splash screen for longer to ensure animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000); // Increased from 3000ms to 5000ms

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
