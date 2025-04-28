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
      // If already on admin page or navigating to it, try to hide widget if API exists
       if (window.Tawk_API && window.Tawk_API.hideWidget) {
         try {
            window.Tawk_API.hideWidget();
         } catch (e) {
            console.warn("Tawk_API.hideWidget failed:", e);
         }
       }
      return; // Don't load script on admin pages
    }

    // --- Load Tawk.to Script ---
    // Check if script already exists to avoid duplicates
    const scriptId = `tawk-to-script-${widgetId}`;
    if (document.getElementById(scriptId)) {
        // If script exists, ensure widget is visible (might have been hidden by admin navigation)
        if (window.Tawk_API && window.Tawk_API.showWidget) {
             try {
                window.Tawk_API.showWidget();
             } catch (e) {
                console.warn("Tawk_API.showWidget failed:", e);
             }
        }
        return;
    }


    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.id = scriptId; // Add ID for checking existence
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script); // Append to body usually safer

    // Basic cleanup - attempt to hide widget on component unmount if API available
    // Note: Tawk.to script manages its own lifecycle mostly.
    return () => {
       if (window.Tawk_API && window.Tawk_API.hideWidget) {
         // Optional: Hide widget when navigating away from non-admin pages
         // This might cause flickering if navigating between non-admin pages.
         // Consider if this behavior is desired.
         // try { window.Tawk_API.hideWidget(); } catch (e) {}
       }
       // Avoid removing the script itself, let Tawk.to manage it.
       // If issues persist, script removal might be needed, but can cause problems.
       // const existingScript = document.getElementById(scriptId);
       // if (existingScript && existingScript.parentNode) {
       //   existingScript.parentNode.removeChild(existingScript);
       // }
    };
    // Re-run effect if path changes (to handle admin/non-admin transitions)
  }, [propertyId, widgetId, isAdminPage, location.pathname]);

  return null; // Component doesn't render anything itself
};

export default TawkToChat;