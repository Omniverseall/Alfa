
import { useState } from "react";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const CallButton = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
    window.location.href = "tel:+998712345678";
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="relative">
        <div className={cn(
          "absolute inset-0 bg-brand-red rounded-full",
          isAnimating ? "animate-ping" : "",
          "opacity-75"
        )}></div>
        <button 
          onClick={handleClick}
          className="relative bg-brand-red hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Позвонить нам"
        >
          <Phone className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default CallButton;
