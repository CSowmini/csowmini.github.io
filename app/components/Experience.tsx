'use client';

import { motion } from 'framer-motion';
import { BriefcaseBusiness } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Experience() {
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      onClick={() => router.push('/experience')}
      className="bg-gray-800/60 light-mode:bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-700/30 light-mode:border-gray-200 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Bitmoji BOTTOM (body + laptop) */}
      <div className="absolute top-0 right-0 w-32 h-32">
        <Image
          src={isDark ? '/bitmoji-sleeping-bottom.png' : '/bitmoji-working-bottom.png'}
          alt="Bitmoji body"
          width={128}
          height={128}
          className="object-contain object-top-right w-full h-full"
        />
      </div>

      <div className="relative z-10">
        {/* Icon: shrinks back on hover */}
        <div className="mb-3 origin-top-left transition-all duration-300 group-hover:scale-75">
          <BriefcaseBusiness className="w-11 h-11 text-gray-300 light-mode:text-gray-700" strokeWidth={2} />
        </div>
        
        {/* Title + subtitle: come forward on hover */}
        <div className="origin-bottom-left transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          <h2 className="text-lg font-serif text-white light-mode:text-gray-400 mb-1">Work Experience</h2>
          <p className="text-xs text-gray-400 light-mode:text-gray-600">My career as a Data Analyst.</p>
        </div>
      </div>
    </motion.div>
  );
}