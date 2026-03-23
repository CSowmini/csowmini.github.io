'use client';

import { motion } from 'framer-motion';
import { Folder, Database, BarChart3, Brain, TrendingUp } from 'lucide-react';

export default function Projects() {
  const projectIcons = [
    { Icon: Database, color: 'bg-blue-500', name: 'ETL Pipeline' },
    { Icon: BarChart3, color: 'bg-purple-500', name: 'Dashboards' },
    { Icon: Brain, color: 'bg-green-500', name: 'ML Models' },
    { Icon: TrendingUp, color: 'bg-orange-600', name: 'Forecasting' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gray-800/60 light-mode:bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-700/30 light-mode:border-gray-200 backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-10 h-10 bg-gray-700/50 light-mode:bg-gray-200 rounded-lg flex items-center justify-center group-hover:bg-blue-900/30 light-mode:group-hover:bg-blue-100 transition-colors">
          <Folder className="w-5 h-5 text-gray-300 light-mode:text-gray-700" />
        </div>
      </div>
      
      <h2 className="text-base font-semibold text-white light-mode:text-gray-900 mb-1">Projects</h2>
      <p className="text-xs text-gray-400 light-mode:text-gray-600 mb-3">Personal projects I&apos;ve been working on.</p>
      
      <div className="flex gap-1.5 flex-wrap">
        {projectIcons.map(({ Icon, color, name }, index) => (
          <motion.div
            key={name}
            animate={{ 
              x: [-8, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.3
            }}
            className={`w-11 h-11 ${color} rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
            title={name}
            whileHover={{ scale: 1.05 }}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
