
import { useEffect, useRef } from "react";

const YandexMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create the script for the map
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.charset = "utf-8";
    script.async = true;
    script.src = "https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A00586ac6cc06cba50b2c728a224f75cddd8ec3a2d92a3eea55d8e2818baeff35&amp;width=100%25&amp;height=471&amp;lang=ru_RU&amp;scroll=true";
    
    // Clear the container and add the script
    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = '';
      mapContainerRef.current.appendChild(script);
    }
    
    // Cleanup when unmounting
    return () => {
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = '';
      }
    };
  }, []);
  
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainerRef} className="w-full h-[471px]"></div>
    </div>
  );
};

export default YandexMap;
