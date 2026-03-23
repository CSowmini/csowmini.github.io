'use client';

import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Experience() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(!document.documentElement.classList.contains('light-mode'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-800/60 light-mode:bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-700/30 light-mode:border-gray-200 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Illustration - smaller and positioned better */}
      <div className="absolute bottom-2 right-2 w-24 h-24 opacity-90">
        {isDark ? (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="25" y="50" width="50" height="32" rx="2" fill="#374151" />
            <rect x="27" y="52" width="46" height="28" fill="#1f2937" />
            <rect x="20" y="82" width="60" height="3" rx="1" fill="#4b5563" />
            <circle cx="50" cy="40" r="13" fill="#fbbf24" />
            <ellipse cx="50" cy="58" rx="16" ry="18" fill="#60a5fa" />
            <path d="M 36 36 Q 40 28 50 28 Q 60 28 64 36" fill="#78350f" />
            <path d="M 43 39 Q 46 41 49 39" stroke="#1f2937" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 51 39 Q 54 41 57 39" stroke="#1f2937" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <motion.g animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <text x="68" y="30" fill="#94a3b8" fontSize="8" fontWeight="bold">Z</text>
            </motion.g>
            <ellipse cx="36" cy="62" rx="5" ry="10" fill="#fbbf24" transform="rotate(-25 36 62)" />
            <ellipse cx="64" cy="62" rx="5" ry="10" fill="#fbbf24" transform="rotate(25 64 62)" />
          </svg>
        ) : (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="25" y="50" width="50" height="32" rx="2" fill="#e5e7eb" />
            <rect x="27" y="52" width="46" height="28" fill="#3b82f6" />
            <rect x="20" y="82" width="60" height="3" rx="1" fill="#9ca3af" />
            <circle cx="50" cy="32" r="13" fill="#fbbf24" />
            <ellipse cx="50" cy="54" rx="16" ry="19" fill="#60a5fa" />
            <path d="M 36 28 Q 40 20 50 20 Q 60 20 64 28" fill="#78350f" />
            <circle cx="44" cy="31" r="1.8" fill="#1f2937" />
            <circle cx="56" cy="31" r="1.8" fill="#1f2937" />
            <path d="M 43 36 Q 50 39 57 36" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <motion.ellipse cx="34" cy="59" rx="5" ry="10" fill="#fbbf24" animate={{ rotate: [0, -6, 0] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ transformOrigin: '34px 59px' }} />
            <motion.ellipse cx="66" cy="59" rx="5" ry="10" fill="#fbbf24" animate={{ rotate: [0, 6, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }} style={{ transformOrigin: '66px 59px' }} />
            <rect x="72" y="68" width="10" height="13" rx="1" fill="#6b4423" />
            <ellipse cx="77" cy="68" rx="5" ry="2" fill="#8b5a3c" />
          </svg>
        )}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-10 h-10 bg-gray-700/50 light-mode:bg-gray-200 rounded-lg flex items-center justify-center group-hover:bg-blue-900/30 light-mode:group-hover:bg-blue-100 transition-colors">
            <Briefcase className="w-5 h-5 text-gray-300 light-mode:text-gray-700" />
          </div>
        </div>
        
        <h2 className="text-base font-semibold text-white light-mode:text-gray-900 mb-1">Work Experience</h2>
        <p className="text-xs text-gray-400 light-mode:text-gray-600">My career as a Data Analyst.</p>
      </div>
    </motion.div>
  );
}
