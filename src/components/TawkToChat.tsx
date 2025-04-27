import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdminPage) {
      // Don't show Tawk.to on admin pages
      return;
    }

    // Remove any existing Tawk.to script
    const existingScript = document.querySelector('script[src*="embed.tawk.to"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Reset Tawk_API
    window.Tawk_API = {};
    window.Tawk_LoadStart = new Date();

    // Add custom CSS to adjust widget position
    const style = document.createElement('style');
    style.innerHTML = `
      .tawk-min-container {
        bottom: 120px !important;
      }
    `;
    document.head.appendChild(style);

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
      // Cleanup on unmount
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [propertyId, widgetId, isAdminPage]);

  return null;
};

export default TawkToChat;