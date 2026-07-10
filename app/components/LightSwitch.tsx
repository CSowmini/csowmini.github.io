'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LightSwitch() {
  const [isDark, setIsDark] = useState(false);
  const [pulling, setPulling] = useState(false);

  // On mount, read the saved theme (default light) and apply it
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const dark = saved === 'dark';
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  const toggle = () => {
    setPulling(true);
    setTimeout(() => setPulling(false), 400);

    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="fixed top-0 right-32 z-40 flex flex-col items-center">
      {/* Cord */}
      <div className="w-px h-32 bg-gradient-to-b from-gray-500 to-amber-700" />

      {/* Pull knob */}
      <motion.button
        onClick={toggle}
        aria-label="Toggle light and dark mode"
        className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg border-2 border-amber-800 cursor-pointer"
        animate={pulling ? { y: [0, 24, 0] } : {}}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1 }}
      />

      {/* Hint */}
      <motion.span
        className="mt-2 text-xs text-amber-500 whitespace-nowrap"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Pull me! 💡
      </motion.span>
    </div>
  );
}