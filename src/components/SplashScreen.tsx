
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
      <div className="relative flex flex-col items-center justify-center min-h-[90vh] w-full">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute z-0 rounded-full bg-brand-blue/5 w-[300px] h-[300px] md:w-[600px] md:h-[600px]"
        />
        
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute z-0 rounded-full bg-brand-red/5 w-[200px] h-[200px] md:w-[400px] md:h-[400px]"
        />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Анимация логотипа */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.5,
              duration: 1, 
              ease: "easeInOut" 
            }}
            className="mb-8"
          >
            <img 
              src="/lovable-uploads/8db8d2d1-17f6-4423-853f-8f7ae7e1b4c1.png" 
              alt="Alfa Diagnostic Logo" 
              className="h-24 w-24 md:h-32 md:w-32 rounded bg-white object-contain drop-shadow-lg"
            />
          </motion.div>
          
          <div className="flex items-center mb-6">
            {/* Анимация букв слова "Alfa" */}
            <div className="flex">
              {["A", "l", "f", "a"].map((letter, index) => (
                <motion.span
                  key={`alfa-${index}`}
                  className="text-5xl md:text-7xl font-bold text-brand-blue"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 1 + index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            
            {/* Пробел */}
            <div className="w-4"></div>
            
            {/* Анимация букв слова "Diagnostic" */}
            <div className="flex">
              {["D", "i", "a", "g", "n", "o", "s", "t", "i", "c"].map((letter, index) => (
                <motion.span
                  key={`diagnostic-${index}`}
                  className="text-5xl md:text-7xl font-bold text-brand-red"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 1.4 + index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>
          
          {/* Дополнительная анимация - пульсирующая линия */}
          <motion.div
            className="mt-4 h-0.5 bg-gradient-to-r from-brand-blue via-brand-red to-brand-blue"
            initial={{ width: 0 }}
            animate={{ width: 350 }}
            transition={{ delay: 2.5, duration: 0.8 }}
          ></motion.div>
          
          <motion.p
            className="mt-4 text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 0.4 }}
          >
            Клиника в Ташкенте
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
