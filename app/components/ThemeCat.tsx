'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AnimationState = 'sleeping' | 'waking' | 'stretching' | 'climbing' | 'pulling' | 'descending';

export default function ThemeCat() {
  const [isDark, setIsDark] = useState(true);
  const [animationState, setAnimationState] = useState<AnimationState>('sleeping');

  useEffect(() => {
    // Set initial theme to dark
    document.documentElement.classList.remove('light-mode');
  }, []);

  const handleClick = () => {
    if (animationState !== 'sleeping') return;
    
    // Animation sequence
    setAnimationState('waking');
    setTimeout(() => setAnimationState('stretching'), 800);
    setTimeout(() => setAnimationState('climbing'), 2000);
    setTimeout(() => setAnimationState('pulling'), 4000);
    setTimeout(() => {
      // Toggle theme
      const newTheme = !isDark;
      setIsDark(newTheme);
      if (newTheme) {
        document.documentElement.classList.remove('light-mode');
      } else {
        document.documentElement.classList.add('light-mode');
      }
      setAnimationState('descending');
    }, 5000);
    setTimeout(() => setAnimationState('sleeping'), 7000);
  };

  const isSleeping = animationState === 'sleeping';
  const isStretching = animationState === 'stretching';
  const isClimbing = animationState === 'climbing';
  const isPulling = animationState === 'pulling';
  const isDescending = animationState === 'descending';

  return (
    <>
      {/* Light switch cord */}
      <motion.div 
        className="fixed top-0 right-32 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-0.5 h-40 bg-gradient-to-b from-gray-700 to-amber-800" />
        <motion.div 
          className="absolute top-36 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full shadow-lg border-2 border-amber-900"
          animate={isPulling ? {
            y: [0, 20, -5, 0],
            rotate: [0, -15, 10, 0],
            scale: [1, 0.95, 1.05, 1]
          } : {}}
          transition={{ duration: 0.8 }}
        />
      </motion.div>

      {/* Cat */}
      <motion.div
        className="fixed bottom-12 right-12 z-50 cursor-pointer"
        onClick={handleClick}
        animate={
          isClimbing ? {
            y: [0, -650],
            transition: { duration: 2.5, ease: "easeInOut" }
          } : isDescending ? {
            y: [-650, 0],
            transition: { duration: 2.5, ease: "easeInOut" }
          } : {}
        }
        whileHover={isSleeping ? { scale: 1.08 } : {}}
      >
        <div className="relative">
          {/* Hint text */}
          {isSleeping && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: [0.6, 1, 0.6], y: [-45, -50, -45] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-base font-medium text-orange-400 drop-shadow-lg"
            >
              💡 Click me!
            </motion.div>
          )}

          {/* Cat Container */}
          <motion.div 
            className="relative w-36 h-36 bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 rounded-full shadow-2xl"
            animate={isStretching ? {
              scale: [1, 1.1, 0.95, 1.05, 1],
              rotate: [0, -5, 5, -3, 0]
            } : {}}
            transition={{ duration: 1 }}
          >
            <svg viewBox="0 0 140 140" className="w-full h-full">
              {/* Main body - curled when sleeping */}
              <motion.ellipse
                cx="70"
                cy="80"
                rx="50"
                ry="40"
                fill="url(#catGradient)"
                animate={!isSleeping ? {
                  ry: 35,
                  cy: 75
                } : {}}
              />

              {/* Belly */}
              <motion.ellipse
                cx="70"
                cy="85"
                rx="35"
                ry="28"
                fill="#fef3c7"
                animate={!isSleeping ? {
                  ry: 25,
                  cy: 80
                } : {}}
              />

              {/* Tail - curled over when sleeping */}
              <motion.path
                d="M 110 75 Q 130 50 125 25"
                stroke="url(#tailGradient)"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                animate={!isSleeping ? {
                  d: "M 110 85 Q 135 85 140 65"
                } : isStretching ? {
                  d: ["M 110 75 Q 130 50 125 25", "M 110 75 Q 140 40 145 20", "M 110 75 Q 130 50 125 25"]
                } : {}}
                transition={{ duration: 0.8 }}
              />

              {/* Tail stripes */}
              <motion.path
                d="M 115 65 Q 125 55 123 40"
                stroke="#ea580c"
                strokeWidth="4"
                fill="none"
                opacity="0.6"
                animate={!isSleeping ? {
                  d: "M 115 82 Q 130 80 135 70"
                } : {}}
              />

              {/* Head */}
              <motion.circle
                cx="55"
                cy="60"
                r="28"
                fill="url(#catGradient)"
                animate={!isSleeping ? { cy: 55 } : {}}
              />

              {/* Cheeks */}
              <motion.ellipse
                cx="50"
                cy="68"
                rx="18"
                ry="15"
                fill="#fef3c7"
                animate={!isSleeping ? { cy: 63 } : {}}
              />

              {/* Ears */}
              <motion.path
                d="M 35 45 L 25 25 L 45 40 Z"
                fill="url(#catGradient)"
                animate={!isSleeping ? {
                  d: "M 35 40 L 25 20 L 45 35 Z"
                } : isStretching ? {
                  d: ["M 35 45 L 25 25 L 45 40 Z", "M 32 42 L 20 22 L 42 37 Z", "M 35 45 L 25 25 L 45 40 Z"]
                } : {}}
              />
              <motion.path
                d="M 70 45 L 80 25 L 60 40 Z"
                fill="url(#catGradient)"
                animate={!isSleeping ? {
                  d: "M 70 40 L 80 20 L 60 35 Z"
                } : isStretching ? {
                  d: ["M 70 45 L 80 25 L 60 40 Z", "M 73 42 L 85 22 L 63 37 Z", "M 70 45 L 80 25 L 60 40 Z"]
                } : {}}
              />

              {/* Inner ears - pink */}
              <path d="M 37 42 L 30 30 L 42 38 Z" fill="#fca5a5" />
              <path d="M 68 42 L 75 30 L 63 38 Z" fill="#fca5a5" />

              {/* Stripes */}
              <motion.path
                d="M 42 52 Q 48 50 54 52"
                stroke="#ea580c"
                strokeWidth="2.5"
                fill="none"
                opacity="0.7"
                animate={!isSleeping ? { d: "M 42 47 Q 48 45 54 47" } : {}}
              />
              <motion.path
                d="M 45 58 Q 50 56 55 58"
                stroke="#ea580c"
                strokeWidth="2.5"
                fill="none"
                opacity="0.7"
                animate={!isSleeping ? { d: "M 45 53 Q 50 51 55 53" } : {}}
              />

              {/* Eyes */}
              <AnimatePresence mode="wait">
                {isSleeping ? (
                  <motion.g key="sleeping">
                    <path d="M 42 58 Q 47 60 52 58" stroke="#422006" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M 58 58 Q 63 60 68 58" stroke="#422006" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </motion.g>
                ) : (
                  <motion.g 
                    key="awake"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                  >
                    <circle cx="47" cy="58" r="5" fill="#422006" />
                    <circle cx="63" cy="58" r="5" fill="#422006" />
                    <circle cx="48" cy="56.5" r="2" fill="white" />
                    <circle cx="64" cy="56.5" r="2" fill="white" />
                  </motion.g>
                )}
              </AnimatePresence>

              {/* Nose */}
              <motion.path 
                d="M 55 66 L 52 70 L 58 70 Z" 
                fill="#dc2626"
                animate={!isSleeping ? { d: "M 55 61 L 52 65 L 58 65 Z" } : {}}
              />

              {/* Mouth */}
              <motion.g>
                <motion.path
                  d="M 55 70 Q 50 73 47 71"
                  stroke="#422006"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  animate={!isSleeping ? { d: "M 55 65 Q 50 68 47 66" } : {}}
                />
                <motion.path
                  d="M 55 70 Q 60 73 63 71"
                  stroke="#422006"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  animate={!isSleeping ? { d: "M 55 65 Q 60 68 63 66" } : {}}
                />
              </motion.g>

              {/* Whiskers */}
              <motion.g
                animate={isStretching ? {
                  rotate: [0, 3, -3, 0]
                } : {}}
                style={{ transformOrigin: '55px 60px' }}
              >
                <line x1="20" y1="56" x2="38" y2="54" stroke="#422006" strokeWidth="1.5" opacity="0.8" />
                <line x1="20" y1="62" x2="38" y2="62" stroke="#422006" strokeWidth="1.5" opacity="0.8" />
                <line x1="20" y1="68" x2="38" y2="66" stroke="#422006" strokeWidth="1.5" opacity="0.8" />
                
                <line x1="90" y1="56" x2="72" y2="54" stroke="#422006" strokeWidth="1.5" opacity="0.8" />
                <line x1="90" y1="62" x2="72" y2="62" stroke="#422006" strokeWidth="1.5" opacity="0.8" />
                <line x1="90" y1="68" x2="72" y2="66" stroke="#422006" strokeWidth="1.5" opacity="0.8" />
              </motion.g>

              {/* Paws - visible when awake */}
              {!isSleeping && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <ellipse cx="60" cy="105" rx="10" ry="7" fill="#fb923c" />
                  <ellipse cx="80" cy="105" rx="10" ry="7" fill="#fb923c" />
                  {/* Paw pads */}
                  <ellipse cx="60" cy="107" rx="7" ry="5" fill="#fef3c7" />
                  <ellipse cx="80" cy="107" rx="7" ry="5" fill="#fef3c7" />
                </motion.g>
              )}

              {/* Zzz when sleeping */}
              {isSleeping && (
                <motion.g
                  animate={{ opacity: [0, 1, 0.7, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <text x="90" y="45" fill="#94a3b8" fontSize="14" fontWeight="bold" fontFamily="Arial">Z</text>
                  <text x="98" y="35" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="Arial">z</text>
                  <text x="104" y="28" fill="#94a3b8" fontSize="7" fontWeight="bold" fontFamily="Arial">z</text>
                </motion.g>
              )}

              {/* Gradients */}
              <defs>
                <linearGradient id="catGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="tailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#fdba74" />
                </linearGradient>
              </defs>
            </svg>

            {/* Paw reaching for rope when climbing */}
            {(isClimbing || isPulling) && (
              <motion.div
                className="absolute -top-12 left-1/2 -translate-x-1/2"
                animate={{
                  y: isPulling ? [0, 5, 0] : [0, -3, 0],
                  rotate: isPulling ? [0, -10, 10, 0] : 0
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <svg viewBox="0 0 40 40" className="w-12 h-12">
                  <ellipse cx="20" cy="20" rx="12" ry="8" fill="#fb923c" />
                  <ellipse cx="20" cy="22" rx="9" ry="6" fill="#fef3c7" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
