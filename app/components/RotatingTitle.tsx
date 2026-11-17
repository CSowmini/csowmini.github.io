'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TITLES = [
  'Data Engineer',
  'Analytics Engineer',
  'AI Engineer',
  'Business Intelligence Engineer',
];

export default function RotatingTitle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % TITLES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="relative inline-block overflow-hidden align-bottom" style={{ height: '1.5em' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="block whitespace-nowrap"
        >
          {TITLES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}