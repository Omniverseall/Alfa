
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 3000); // Полная длительность анимации
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!showSplash) {
    return null;
  }

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: showSplash ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex flex-col items-center">
        <div className="flex items-center mb-4">
          {/* Анимация букв слова "Alfa" */}
          <div className="flex">
            {["A", "l", "f", "a"].map((letter, index) => (
              <motion.span
                key={`alfa-${index}`}
                className="text-4xl md:text-6xl font-bold text-brand-blue"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          
          {/* Пробел */}
          <div className="w-3"></div>
          
          {/* Анимация букв слова "Diagnostic" */}
          <div className="flex">
            {["D", "i", "a", "g", "n", "o", "s", "t", "i", "c"].map((letter, index) => (
              <motion.span
                key={`diagnostic-${index}`}
                className="text-4xl md:text-6xl font-bold text-brand-red"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.4 + index * 0.1,
                  ease: "easeOut"
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>
        
        {/* Анимация логотипа */}
        <motion.div
          className="absolute -top-2 opacity-0"
          initial={{ scale: 3, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: -80 }}
          transition={{ 
            delay: 1.5,
            duration: 0.8, 
            ease: "easeInOut" 
          }}
        >
          <img 
            src="/lovable-uploads/8db8d2d1-17f6-4423-853f-8f7ae7e1b4c1.png" 
            alt="Alfa Diagnostic Logo" 
            className="h-16 w-16 rounded bg-white object-contain drop-shadow-lg"
          />
        </motion.div>
        
        {/* Дополнительная анимация - пульсирующая линия */}
        <motion.div
          className="mt-8 h-0.5 bg-gradient-to-r from-brand-blue via-brand-red to-brand-blue"
          initial={{ width: 0 }}
          animate={{ width: 280 }}
          transition={{ delay: 2, duration: 0.6 }}
        ></motion.div>
        
        <motion.p
          className="mt-2 text-gray-600 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.4 }}
        >
          Клиника в Ташкенте
        </motion.p>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
