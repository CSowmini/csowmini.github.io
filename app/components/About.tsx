'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gray-800/60 light-mode:bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-700/30 light-mode:border-gray-200 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-10 h-10 bg-gray-700/50 light-mode:bg-gray-200 rounded-lg flex items-center justify-center group-hover:bg-blue-900/30 light-mode:group-hover:bg-blue-100 transition-colors">
          <User className="w-5 h-5 text-gray-300 light-mode:text-gray-700" />
        </div>
      </div>
      
      <h2 className="text-base font-semibold text-white light-mode:text-gray-900 mb-1">About</h2>
      <p className="text-xs text-gray-400 light-mode:text-gray-600 leading-relaxed">
        A bit about myself.
      </p>
    </motion.div>
  );
}
