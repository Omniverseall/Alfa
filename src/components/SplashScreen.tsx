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
    }, 3333);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!showSplash) {
    return null;
  }

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-white h-screen w-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: showSplash ? 1 : 0 }}
      transition={{ duration: 0.5 }} // Reduced from 0.8
    >
      <div className="relative flex flex-col items-center justify-center min-h-screen w-full">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }} // Reduced from 1.2
          className="absolute z-0 rounded-full bg-brand-blue/5 w-[400px] h-[400px] md:w-[800px] md:h-[800px]"
        />
        
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.4, opacity: 0.7 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} // Reduced from 1.5, delay from 0.3
          className="absolute z-0 rounded-full bg-brand-red/5 w-[300px] h-[300px] md:w-[600px] md:h-[600px]"
        />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: -80 }}
            animate={{ scale: 1.3, opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.4, // Reduced from 0.7
              duration: 0.8, // Reduced from 1.2
              ease: "easeInOut" 
            }}
            className="mb-10"
          >
            <img 
              src="/lovable-uploads/8db8d2d1-17f6-4423-853f-8f7ae7e1b4c1.png" 
              alt="Alfa Diagnostic Logo" 
              className="h-28 w-28 md:h-40 md:w-40 rounded bg-white object-contain drop-shadow-xl"
            />
          </motion.div>
          
          <div className="flex items-center mb-8">
            {/* Animation for "Alfa" */}
            <div className="flex">
              {["A", "l", "f", "a"].map((letter, index) => (
                <motion.span
                  key={`alfa-${index}`}
                  className="text-6xl md:text-8xl font-bold text-brand-blue"
                  initial={{ opacity: 0, y: -80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.2, // Уменьшено с 0.4
                    delay: 0.2 + index * 0.05, // Уменьшено с 0.4 + index * 0.08
                    ease: "easeOut"
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            
            {/* Space */}
            <div className="w-6"></div>
            
            {/* Animation for "Diagnostic" */}
            <div className="flex">
              {["D", "i", "a", "g", "n", "o", "s", "t", "i", "c"].map((letter, index) => (
                <motion.span
                  key={`diagnostic-${index}`}
                  className="text-6xl md:text-8xl font-bold text-brand-red"
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.2, // Уменьшено с 0.3
                    delay: 0.4 + index * 0.03, // Уменьшено с 0.6 + index * 0.05
                    ease: "easeOut"
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>
          
          {/* Pulsating line */}
          <motion.div
            className="mt-6 h-1 bg-gradient-to-r from-brand-blue via-brand-red to-brand-blue"
            initial={{ width: 0 }}
            animate={{ width: 500, scale: [1, 1.05, 1] }}
            transition={{ 
              delay: 1.5, // Уменьшено с 2
              duration: 0.5, // Уменьшено с 0.7
              scale: {
                repeat: Infinity,
                duration: 1, // Уменьшено с 1.5
              }
            }}
          ></motion.div>
          
          <motion.p
            className="mt-6 text-gray-600 text-xl font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.4 }} // Уменьшено с 2.2, 0.5
          >
            Клиника в Ташкенте
          </motion.p>
          
          {/* Additional animation element - dots */}
          <motion.div 
            className="flex mt-8 space-x-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.4 }} // Уменьшено с 2.5, 0.5
          >
            {[1, 2, 3].map((dot, i) => (
              <motion.div
                key={`dot-${i}`}
                className="h-3 w-3 rounded-full bg-brand-blue"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.5, // Уменьшено с 0.6
                  delay: i * 0.1, // Уменьшено с i * 0.15
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
