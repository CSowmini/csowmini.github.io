'use client';

import { useEffect, useState } from 'react';

const skills = [
  'Python', 'SQL', 'PySpark', 'Databricks', 'Azure', 'Delta Lake',
  'Airflow', 'Kafka', 'Snowflake', 'ADF', 'Azure Synapse', 'Power BI',
  'Tableau', 'Spark', 'Azure Purview', 'MLflow', 'Unity Catalog'
];

export default function SkillMarquee() {
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

  const textColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const doubled = [...skills, ...skills];

  return (
    <section className="w-full pt-2 pb-10 overflow-hidden">
      <style>{`
        @keyframes skillScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .skill-track {
          display: inline-flex;
          flex-wrap: nowrap;
          width: max-content;
          animation: skillScroll 60s linear infinite;
        }
        .skill-track:hover { animation-play-state: paused; }
        .skill-mask {
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
      `}</style>

      <p
        className={`text-center text-[13px] mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
        style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
      >
        &gt; the stack I build with
      </p>

      <div className="skill-mask overflow-hidden">
        <div className="skill-track">
          {doubled.map((skill, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-2 px-5 whitespace-nowrap text-sm ${textColor}`}
              style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
            >
              {skill}
              <span className="text-amber-500">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}