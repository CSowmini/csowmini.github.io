'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SideNav from '../components/SideNav';
import LightSwitch from '../components/LightSwitch';


/* ---- Hand-drawn animated annotations ---- */
/* Drawn via native SVG pathLength + CSS keyframes — reload-proof */

type AnnotationProps = { children: React.ReactNode; delay?: number };

const drawStyle = (duration: number, delay: number): React.CSSProperties => ({
  strokeDasharray: 1,
  strokeDashoffset: 1,
  opacity: 0,
  animation: `draw-stroke ${duration}s ease-in-out ${delay}s forwards`,
});

// Blue double underline — two strokes weaving across each other
function Underlined({ children, delay = 0 }: AnnotationProps) {
  return (
    <span className="relative inline-block">
      {children}
      <svg
        className="absolute -bottom-2 left-0 w-full pointer-events-none"
        height="12"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
      >
        {/* First stroke: starts high, dips low, rises again */}
        <path
          d="M3 4 Q 60 6.5, 120 4.5 Q 165 3, 197 5"
          pathLength={1}
          stroke="#3b82f6"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          style={drawStyle(0.5, delay)}
        />
        {/* Second stroke: opposite phase — crosses the first around x≈55 and x≈150 */}
        <path
          d="M5 7 Q 60 5, 120 7.5 Q 165 8.5, 195 6"
          pathLength={1}
          stroke="#3b82f6"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          style={drawStyle(0.5, delay + 0.55)}
        />
      </svg>
    </span>
  );
}

// Orange scratchy rectangle — two thin overlapping passes, sharp corners
function Circled({ children, delay = 0 }: AnnotationProps) {
  return (
    <span className="relative inline-block px-1">
      {children}
      <svg
        className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] -left-1.5 -top-1.5 pointer-events-none"
        viewBox="0 0 120 44"
        preserveAspectRatio="none"
      >
        {/* First pass */}
        <path
          d="M10 12 L 114 7 L 116 36 L 5 38 L 4 10 L 14 9.5"
          pathLength={1}
          stroke="#f97316"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="square"
          strokeLinejoin="miter"
          style={drawStyle(0.7, delay)}
        />
        {/* Second pass: same box redrawn slightly off, crossing over the first */}
        <path
          d="M16 8.5 L 117 10 L 113 39 L 3 35 L 6 8 L 20 11"
          pathLength={1}
          stroke="#f97316"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="square"
          strokeLinejoin="miter"
          style={drawStyle(0.7, delay + 0.75)}
        />
      </svg>
    </span>
  );
}

// Green marker highlight — two overlapping swipes, like highlighting twice
function Highlighted({ children, delay = 0 }: AnnotationProps) {
  return (
    <span className="relative inline-block px-1">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 200 30"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* First swipe: left to right */}
        <path
          d="M0 20 Q 60 13, 110 18 Q 160 22, 196 16"
          pathLength={1}
          stroke="#bab540"
          strokeWidth="24"
          strokeOpacity="0.8"
          fill="none"
          strokeLinecap="butt"
          style={drawStyle(0.5, delay)}
        />
        {/* Second swipe: right to left, slightly offset */}
        <path
          d="M190 10 Q 140 17, 90 12 Q 45 8, 4 15"
          pathLength={1}
          stroke="#bab540"
          strokeWidth="24"
          strokeOpacity="0.8"
          fill="none"
          strokeLinecap="butt"
          style={drawStyle(0.5, delay + 0.55)}
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

/* ---- Page ---- */

export default function AboutPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(!document.documentElement.classList.contains('light-mode'));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const heading = isDark ? 'text-white' : 'text-gray-900';
  const body = isDark ? 'text-gray-300' : 'text-gray-600';

  return (
    <main className="min-h-screen transition-colors duration-500">
      <SideNav />
      <LightSwitch />


      {/* Header - same as home */}
      <header className="pt-12 pb-10 text-center">
        <h1 className={`text-4xl md:text-5xl font-serif ${heading}`}>
          Chandrika Sowmini
        </h1>
        <p className={`mt-3 text-sm ${body}`}>Data Engineer</p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-6 pb-24"
      >
        {/* About Me */}
        <h2 className={`text-2xl font-bold mb-4 ${heading}`}>About Me</h2>

        <div className={`space-y-3 leading-normal text-[15px] ${body}`} style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
          <p>
            I am a Data Engineer with a passion for turning complex data into{' '}
            <Underlined delay={1.0}>actionable insights</Underlined> that drive real
            business decisions.
          </p>

          <p>
            I hold an MS in Data Science from Indiana University. Along the
            way I&apos;ve worked with Pacers Sports &amp; Entertainment, the
            Indiana Department of Health, MISO, and Deloitte — and today I
            build <Circled delay={2.3}>data solutions</Circled> at Delineate, backed by{' '}
            <Highlighted delay={3.5}>4+ years of experience</Highlighted>. I don&apos;t
            just crunch numbers, I ship insights that people act on.
          </p>

          <p>
            When I&apos;m not building pipelines or dashboards, you&apos;ll
            find me exploring new places, experimenting in the kitchen, and
            enjoying a good series.
          </p>
        </div>

        {/* The Specs */}
        <h2 className={`text-2xl font-bold mt-10 mb-4 ${heading}`}>
          The Specs
        </h2>
        <ul className={`space-y-1 list-disc list-inside marker:text-gray-400 text-[15px] pl-6 ${body}`} style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
          <li>Location: Texas, USA</li>
          <li>Languages: English (Fluent), Telugu (Native)</li>
          <li>Education: MS in Data Science, Indiana University</li>
        </ul>

        {/* Tech Stack */}
        <h2 className={`text-2xl font-bold mt-10 mb-4 ${heading}`}>
          Tech Stack
        </h2>
        <ul className={`space-y-1 list-disc list-inside marker:text-gray-400 text-[15px] pl-6 ${body}`} style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
          <li>Core Languages: Python, SQL, R</li>
          <li>Cloud &amp; Big Data: Azure, Databricks</li>
          <li>Data Engineering: ETL Pipelines, Data Modeling</li>
          <li>Visualization: Tableau, Power BI</li>
          <li>ML &amp; Stats: scikit-learn, Predictive Analytics, Statistical Modeling</li>
          <li>Currently Exploring: dbt, Snowflake, LLM-powered analytics</li>
        </ul>
      </motion.div>
    </main>
  );
}