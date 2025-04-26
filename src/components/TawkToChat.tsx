
import { useEffect } from "react";

interface TawkToChatProps {
  propertyId: string;
  widgetId: string;
}

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const TawkToChat = ({ propertyId, widgetId }: TawkToChatProps) => {
  useEffect(() => {
    // Если скрипт уже загружен, не загружаем повторно
    if (window.Tawk_API) return;

    // Инициализация Tawk.to
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }

    return () => {
      // Очищаем скрипт при unmount компонента
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
    };
  }, [propertyId, widgetId]);

  return null; // Компонент не рендерит никакой UI
};

export default TawkToChat;
