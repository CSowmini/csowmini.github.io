'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

function TypingDots() {
  return (
    <div className="flex gap-1 justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-white rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

type Message = {
  id: string;
  color: 'blue' | 'green';
};

export default function Contact() {
  const [messages, setMessages] = useState<Message[]>([]);
  const counter = useRef(1);
  const nextColorRef = useRef<'blue' | 'green'>('green'); // Start with green
  const router = useRouter();
  useEffect(() => {
    const addMessage = () => {
      const newMsg: Message = {
        id: `msg-${counter.current}`,
        color: nextColorRef.current,
      };
      counter.current += 1;
      // Alternate color
      nextColorRef.current = nextColorRef.current === 'green' ? 'blue' : 'green';
      
      setMessages((current) => {
        // If already have 4, remove top and add new at bottom
        if (current.length >= 4) {
          return [...current.slice(1), newMsg];
        }
        // Otherwise just add
        return [...current, newMsg];
      });
    };

    // First message after 500ms
    const startTimeout = setTimeout(() => {
      addMessage();
      // Then every 1.5s
      const interval = setInterval(addMessage, 1600);
      (window as any).__msgInterval = interval;
    }, 500);

    return () => {
      clearTimeout(startTimeout);
      if ((window as any).__msgInterval) {
        clearInterval((window as any).__msgInterval);
      }
    };
  }, []);

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      onClick={() => router.push('/contact')}
      className="bg-gray-800/60 light-mode:bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-700/30 light-mode:border-gray-200 backdrop-blur-sm relative overflow-hidden min-h-[260px]"
    >
      {/* Single conversation - alternating messages */}
      <div className="absolute top-4 right-4 w-35 flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.8 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                layout: { type: "spring", stiffness: 200, damping: 25 }
              }}
              className={`flex ${message.color === 'blue' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`${
                  message.color === 'blue' 
                    ? 'bg-blue-500 rounded-tl-sm' 
                    : 'bg-green-500 rounded-tr-sm'
                } px-3 py-1.75 rounded-2xl shadow-sm`}
              >
                <TypingDots />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Icon and title at BOTTOM LEFT */}
      <div className="absolute bottom-4 left-4">
        {/* Icon: shrinks back on hover */}
        <div className="mb-2 origin-top-left transition-all duration-300 group-hover:scale-75">
          <Send className="w-10 h-10 text-gray-300 light-mode:text-gray-700" strokeWidth={2} />
        </div>
        
        {/* Title + subtitle: come forward on hover */}
        <div className="origin-bottom-left transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          <h2 className="text-lg font-serif font-semibold text-white light-mode:text-gray-900 mb-1">Contact</h2>
          <p className="text-xs text-gray-400 light-mode:text-gray-600">Email, LinkedIn, carrier pigeon...</p>
        </div>
      </div>
    </motion.div>
  );
}