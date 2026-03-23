'use client';

import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function Contact() {
  const bubbles = [
    { color: 'bg-blue-500', textColor: 'text-white', dotColor: 'bg-white', align: 'right', moveDirection: 1 },
    { color: 'bg-blue-100 light-mode:bg-blue-200', textColor: '', dotColor: 'bg-blue-500', align: 'left', moveDirection: -1 },
    { color: 'bg-green-500', textColor: 'text-white', dotColor: 'bg-white', align: 'right', moveDirection: 1 },
    { color: 'bg-green-100 light-mode:bg-green-200', textColor: '', dotColor: 'bg-green-500', align: 'left', moveDirection: -1 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-gray-800/60 light-mode:bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-700/30 light-mode:border-gray-200 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Messaging bubbles - smaller */}
      <div className="absolute top-4 right-4 space-y-1 w-20">
        {bubbles.map((bubble, index) => (
          <motion.div
            key={index}
            animate={{ 
              x: bubble.moveDirection * 2.5
            }}
            transition={{ 
              duration: 1.2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: index * 0.15
            }}
            className={`${bubble.color} ${bubble.textColor} px-2 py-0.5 rounded-md ${bubble.align === 'right' ? 'rounded-tr-sm ml-auto' : 'rounded-tl-sm mr-auto'} text-xs w-fit`}
          >
            <div className="flex gap-0.5">
              <div className={`w-0.5 h-0.5 ${bubble.dotColor} rounded-full`} />
              <div className={`w-0.5 h-0.5 ${bubble.dotColor} rounded-full`} />
              <div className={`w-0.5 h-0.5 ${bubble.dotColor} rounded-full`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-10 h-10 bg-gray-700/50 light-mode:bg-gray-200 rounded-lg flex items-center justify-center group-hover:bg-blue-900/30 light-mode:group-hover:bg-blue-100 transition-colors">
            <Send className="w-5 h-5 text-gray-300 light-mode:text-gray-700" />
          </div>
        </div>
        
        <h2 className="text-base font-semibold text-white light-mode:text-gray-900 mb-1">Contact</h2>
        <p className="text-xs text-gray-400 light-mode:text-gray-600">Email, LinkedIn, carrier pigeon...</p>
      </div>
    </motion.div>
  );
}
