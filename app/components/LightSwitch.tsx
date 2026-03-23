'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LightSwitch() {
  const [isPulling, setIsPulling] = useState(false);

  const handleClick = () => {
    console.log('Light switch clicked!'); // Debug
    setIsPulling(true);
    
    // Toggle the theme
    document.documentElement.classList.toggle('light-mode');
    
    setTimeout(() => {
      setIsPulling(false);
    }, 500);
  };

  return (
    <div 
      className="fixed top-0 right-24 z-50 cursor-pointer group"
      onClick={handleClick}
    >
      {/* Cord */}
      <div className="w-1 h-32 bg-gradient-to-b from-gray-600 to-amber-800 mx-auto" />
      
      {/* Light bulb pull */}
      <motion.div 
        className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-xl border-2 border-amber-900 mx-auto relative group-hover:scale-110 transition-transform"
        animate={isPulling ? {
          y: [0, 15, 0],
          scale: [1, 0.95, 1]
        } : {}}
        transition={{ duration: 0.5 }}
      >
        {/* Shine effect */}
        <div className="absolute top-2 left-2 w-4 h-4 bg-white/40 rounded-full blur-sm" />
      </motion.div>

      {/* Hint text */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-amber-500"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Pull me! 💡
      </motion.div>
    </div>
  );
}
