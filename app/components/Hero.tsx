'use client';

import { motion } from 'framer-motion';
import RotatingTitle from './RotatingTitle';

export default function Hero() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet" />
      <section className="pt-20 pb-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 
              style={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 400 }}
              className="text-5xl md:text-6xl text-white light-mode:text-gray-900 mb-2 transition-colors tracking-tight"
            >
              Chandrika Sowmini
            </h1>
           <p
              style={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 300, minHeight: '1.5em' }}
              className="text-base text-white light-mode:text-black transition-colors"
            >
              <RotatingTitle />
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
