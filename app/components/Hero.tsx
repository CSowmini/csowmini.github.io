'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="pt-16 pb-6 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-serif font-normal text-white light-mode:text-gray-900 mb-2 transition-colors tracking-tight">
            Chandrika
          </h1>
          <p className="text-base text-gray-400 light-mode:text-gray-600 transition-colors">
            Data Analyst
          </p>
        </motion.div>
      </div>
    </section>
  );
}
