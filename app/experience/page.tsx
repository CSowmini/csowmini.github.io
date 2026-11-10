'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import SideNav from '../components/SideNav';
import LightSwitch from '../components/LightSwitch';
import SkillMarquee from '../components/SkillMarquee';
import Link from 'next/link';
import RotatingTitle from '../components/RotatingTitle';


type Node = {
  text: React.ReactNode;
  flow?: string[]; // mini architecture diagram steps; last item is the "output"
};

type Role = {
  period: string;
  company: string;
  logoLight: string;
  logoDark: string;
  logoWidth: string;
  title: string;
  nodes: Node[];
};

const roles: Role[] = [
  {
    period: 'Jul 2024 – Present',
    company: 'Delineate',
    logoLight: '/delineate-light.png',
    logoDark: '/delineate-dark.png',
    logoWidth: 'w-32',
    title: 'Software Engineer (Backend / Distributed Systems)',
    nodes: [
      {
        text: (
          <>
            <b>Pacers Sports &amp; Entertainment</b> — led a Java event-processing
            service that unifies ticketing, commerce, and mobile activity from 8
            systems (100K+ events a day). Bounded queues, thread pools, and
            idempotent writes absorb spikes and retries, and nightly reconciliation
            discrepancies dropped <b>~80–85%</b>.
          </>
        ),
        flow: ['8 Source Systems', 'Bounded Queues', 'Thread Pool Workers', 'Idempotent Writes', 'Unified Events'],
      },
      {
        text: (
          <>
            Also built Python REST APIs that answer plain-English questions across
            5 business domains, with MLflow evaluations checking the quality of
            every response.
          </>
        ),
        flow: ['NL Query', 'REST API', 'Validation', 'Service Routing', 'Evaluated Answer'],
      },
      {
        text: (
          <>
            <b>Indiana Dept. of Health</b> — hardened Python services processing
            500K+ health records a day. Retries, circuit breakers, and dead-letter
            queue recovery took production failures from <b>~3% to ~0.3%</b>, and
            alerts now catch issues in under 5 minutes.
          </>
        ),
        flow: ['Health Feeds', 'Python Services', 'Retry + Circuit Breaker', 'DLQ Recovery', '~0.3% Failures'],
      },
      {
        text: (
          <>
            <b>MISO</b> — modernized 30+ Oracle-backed components to Azure in five
            phased migrations, with p95 latency rollback gates on every cutover.
            <b> ~70%</b> less break/fix work and <b>~40%</b> faster releases.
          </>
        ),
        flow: ['Oracle Components', 'Phased Migration', 'CI/CD + Rollback Gates', 'Azure Services'],
      },
    ],
  },
  {
    period: 'Jan 2020 – Aug 2022',
    company: 'Deloitte',
    logoLight: '/deloitte-light.png',
    logoDark: '/deloitte-dark.png',
    logoWidth: 'w-32',
    title: 'Software Engineer',
    nodes: [
      {
        text: (
          <>
            Shipped an employee lifecycle app for <b>5,000 users</b> — React
            workflows on Java/Spring Boot REST APIs and SQL Server, holding up to
            400 concurrent sessions.
          </>
        ),
        flow: ['React UI', 'Spring Boot APIs', 'Business Logic', 'SQL Server'],
      },
      {
        text: (
          <>
            Made a race-prone C#/.NET cache thread-safe, and cut latency <b>~30%</b>{' '}
            on Python/SQL services processing 50M+ financial records a day.
          </>
        ),
      },
      {
        text: (
          <>
            Won 1st place at the FY’21 Hackathon out of 50+ teams, mentored 2
            junior engineers, and picked up a few <b>awards</b> along the way —
            Rockstar Rookie, Spot Award, Applause. 🥇
          </>
        ),
      },
    ],
  },
];

function Bullet({
  node,
  isDark,
  showMeta,
}: {
  node: Node;
  isDark: boolean;
  showMeta: boolean;
}) {
  const body = isDark ? 'text-gray-300' : 'text-gray-600';
  const flowBox = isDark
    ? 'bg-gray-800 text-gray-200 border-gray-700'
    : 'bg-gray-100 text-gray-700 border-gray-200';
  const flowOut = isDark
    ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700'
    : 'bg-emerald-50 text-emerald-700 border-emerald-300';

  return (
    <li className="flex gap-3">
      <span className="text-amber-500 select-none mt-0.5">▹</span>
      <div className="flex-1">
        <p
          className={`text-[14px] leading-relaxed ${body}`}
          style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          {node.text}
        </p>

        {/* mini architecture flow — only when metadata is toggled on */}
        <AnimatePresence initial={false}>
          {showMeta && node.flow && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div
                className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px]"
                style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
              >
                {node.flow.map((step, k) => {
                  const isLast = k === node.flow!.length - 1;
                  return (
                    <span key={k} className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded border ${isLast ? flowOut : flowBox}`}
                      >
                        {step}
                      </span>
                      {!isLast && <span className="text-amber-500">→</span>}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </li>
  );
}

export default function ExperiencePage() {
  const [isDark, setIsDark] = useState(false);
  const [showMeta, setShowMeta] = useState(false);

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
  const rule = isDark ? 'border-gray-800' : 'border-gray-200';

  return (
    <main className="min-h-screen transition-colors duration-500">
      <SideNav />
      <LightSwitch />

      {/* Header */}
      <header className="pt-16 pb-4 text-center">
        <Link href="/">
          <h1 className={`text-4xl md:text-5xl font-serif cursor-pointer hover:opacity-70 transition-opacity ${heading}`}>
            Chandrika Sowmini
          </h1>
        </Link>
        <p className={`mt-3 text-sm ${body}`}>
          <RotatingTitle />
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-6 pb-10"
      >
        <div className="flex items-start justify-between mb-10">
          <div style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
            <p className={`text-sm ${heading}`}>
              <span className="text-emerald-500">chandrika@career</span>
              <span className={body}>:~$ </span>
              <span className={heading}>git log --oneline</span>
            </p>
            <p className={`text-[13px] mt-2 ${body}`}>
              <span className="text-amber-500">*</span> 4+ years, 2 companies, 3 clients — every commit shipped to prod.
            </p>
          </div>

          {/* architecture toggle */}
          <button
            onClick={() => setShowMeta((v) => !v)}
            className="text-[12px] transition-colors shrink-0 mt-1"
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              color: showMeta ? '#22c55e' : isDark ? '#888' : '#999',
            }}
          >
            {showMeta ? '[hide_architecture]' : '[view_architecture]'}
          </button>
        </div>

        <div className="space-y-6">
          {roles.map((role, i) => (
            <motion.div
              key={role.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`grid grid-cols-1 md:grid-cols-[210px_1fr] gap-4 md:gap-10 ${
                i > 0 ? `border-t pt-6 ${rule}` : ''
              }`}
            >
              {/* Left: logo + period */}
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={isDark ? role.logoDark : role.logoLight}
                  alt={role.company}
                  className={`${role.logoWidth} h-auto object-contain`}
                />
                <p
                  className={`mt-2 text-sm ${body}`}
                  style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
                >
                  {role.period}
                </p>
              </div>

              {/* Right: role + bullets */}
              <div>
                <p className={`text-lg font-semibold mb-4 ${heading}`}>
                  {role.title}
                </p>

                <ul className="space-y-3">
                  {role.nodes.map((node, j) => (
                    <Bullet key={j} node={node} isDark={isDark} showMeta={showMeta} />
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <SkillMarquee />
    </main>
  );
}