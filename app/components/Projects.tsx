'use client';

import { motion } from 'framer-motion';
import { FolderOpen, AudioWaveform, Mic, Plane, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Projects() {
  const router = useRouter();
  // Real projects — icons + gradients match the /projects page
  const projectsBase = [
    { Icon: AudioWaveform, grad: 'linear-gradient(135deg,#2ebd6b 0%,#158a43 100%)', name: 'Spotify Streaming Analytics' },
    { Icon: Mic,           grad: 'linear-gradient(135deg,#7c4dc4 0%,#552a9c 100%)', name: 'AI-HireVue' },
    { Icon: Plane,         grad: 'linear-gradient(135deg,#d3663d 0%,#b03c28 100%)', name: 'Flight Price Forecasting' },
    { Icon: LayoutDashboard, grad: 'linear-gradient(135deg,#0e8a9e 0%,#0a5c74 100%)', name: 'Oregon State Utility Dashboard' },
  ];

  // Repeat for seamless scroll
  const projects = [...projectsBase, ...projectsBase, ...projectsBase];

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      onClick={() => router.push('/projects')}
      style={{ cursor: 'pointer' }}
      className="bg-gray-800/60 light-mode:bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-700/30 light-mode:border-gray-200 backdrop-blur-sm overflow-hidden relative min-h-[200px]"
    >
      {/* Conveyor belt with fade edges */}
      <div className="relative overflow-hidden mt-10 mb-8" style={{
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
      }}>
        <motion.div 
          className="flex gap-5"
          animate={{
            x: [0, -336]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {projects.map((project, index) => {
            const Icon = project.Icon;
            return (
              <div
                key={index}
                className="w-16 h-16 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 text-white"
                style={{ background: project.grad }}
                title={project.name}
              >
                <Icon className="w-7 h-7" strokeWidth={1.8} />
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Folder icon and title at BOTTOM LEFT */}
      <div className="absolute bottom-4 left-4">
        {/* Icon: shrinks back on hover */}
        <div className="mb-2 origin-top-left transition-all duration-300 group-hover:scale-75">
          <FolderOpen className="w-10 h-10 text-gray-300 light-mode:text-gray-700" strokeWidth={2} />
        </div>
        
        {/* Title + subtitle: come forward on hover */}
        <div className="origin-bottom-left transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          <h2 className="text-lg font-serif font-semibold text-white light-mode:text-gray-900 mb-1">Projects</h2>
          <p className="text-xs text-gray-400 light-mode:text-gray-600">Personal projects I&apos;ve been working on.</p>
        </div>
      </div>
    </motion.div>
  );
}