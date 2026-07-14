'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AudioWaveform, Mic, Plane, LayoutDashboard, Plus, Camera,
  CheckCircle2, Link as LinkIcon, Calendar, TrendingUp, ArrowLeft,
} from 'lucide-react';
import SideNav from '../components/SideNav';
import { useRouter } from 'next/navigation';
import LightSwitch from '../components/LightSwitch';
import Link from 'next/link';
import RotatingTitle from '../components/RotatingTitle';


/* ------------------------------------------------------------------ *
 *  STACK NOTE: the pile works because the cards are packed direct
 *  children (no margins) of .stack, and the scroll room comes from a
 *  real <div class="stack-spacer"> INSIDE .stack. CSS sticky ignores a
 *  container's padding-bottom, so the spacer must be an element.
 *
 *  FUN PROJECTS: same Project shape, same detail view — they just
 *  render as small icon tiles under the stack instead of full cards.
 * ------------------------------------------------------------------ */

type Info = { icon: 'scale' | 'cal' | 'link'; label: string; href?: string };
type Project = {
  id: string;
  name: string;
  icon: keyof typeof ICONS;
  grad: string;
  tag: string;
  short: string;
  about: string;
  features: string[];
  info: Info[];
  tech: { name: string; color: string }[];
};

const ICONS = {
  wave: AudioWaveform,
  mic: Mic,
  plane: Plane,
  dashboard: LayoutDashboard,
  camera: Camera,
  plus: Plus,
};

// sticky-stack tuning
// STACK_STEP must be COMFORTABLY LARGER than the card's border-radius (20px),
// otherwise the visible peek falls entirely inside the corner arc and the cards
// read as flat wedges instead of rounded rectangles.
const STACK_TOP = 140; // where the first card pins (just below the fixed name)
const STACK_STEP = 32; // vertical offset per pinned card (the peek height)

const PROJECTS: Project[] = [
  {
    id: 'spotify',
    name: 'Spotify Streaming Analytics',
    icon: 'wave',
    grad: 'linear-gradient(135deg,#2ebd6b 0%,#158a43 100%)',
    tag: 'Personal Project',
    short: 'Real-time event streaming into Snowflake on AWS.',
    about:
      'A real-time streaming pipeline using Apache NiFi, Kafka, and Kinesis Firehose to ingest streaming events into Snowflake via S3, deployed on AWS EC2 with Docker. A hands-on exploration of distributed data processing and S3-based data-lake design patterns.',
    features: [
      'Real-time event ingestion',
      'Kafka + Kinesis Firehose + NiFi',
      'Snowflake warehouse via S3 data lake',
      'Containerized on EC2 with Docker',
    ],
    info: [
      { icon: 'link', label: 'github.com', href: '#' },
      { icon: 'cal', label: '2024' },
    ],
    tech: [
      { name: 'Kafka', color: '#231f20' },
      { name: 'AWS Kinesis', color: '#ff9900' },
      { name: 'Snowflake', color: '#29b5e8' },
      { name: 'Apache NiFi', color: '#728e9b' },
      { name: 'Docker', color: '#2496ed' },
      { name: 'EC2 / S3', color: '#ff9900' },
    ],
  },
  {
    id: 'hirevue',
    name: 'AI-HireVue',
    icon: 'mic',
    grad: 'linear-gradient(135deg,#7c4dc4 0%,#552a9c 100%)',
    tag: 'Hackathon · 1st Place',
    short: 'Real-time GenAI candidate evaluation. 1st place, Deloitte hackathon.',
    about:
      'An end-to-end AI scoring pipeline that performs real-time NLP sentiment and speech analysis on interview responses, reaching 92% alignment with human evaluator benchmarks at sub-second latency. Awarded 1st place at the Deloitte hackathon out of 50+ teams.',
    features: [
      'Real-time NLP + speech analysis',
      '92% alignment with human evaluators',
      'Sub-second latency',
      'Scalable serverless inference',
    ],
    info: [
      { icon: 'scale', label: '1st of 50+ teams' },
      { icon: 'cal', label: '2021' },
    ],
    tech: [
      { name: 'Python', color: '#3776ab' },
      { name: 'NLP', color: '#7c4dc4' },
      { name: 'LLMs', color: '#7c4dc4' },
      { name: 'Databricks', color: '#ff3621' },
      { name: 'MLflow', color: '#0194e2' },
      { name: 'CosmosDB', color: '#0078d4' },
    ],
  },
  {
    id: 'flight',
    name: 'Flight Price Forecasting',
    icon: 'plane',
    grad: 'linear-gradient(135deg,#d3663d 0%,#b03c28 100%)',
    tag: 'Personal Project',
    short: 'Regression engine benchmarking Random Forest vs. Gradient Boosting.',
    about:
      'A regression forecasting pipeline with end-to-end feature engineering across temporal, categorical, and route-level dimensions. Random Forest and Gradient Boosting were benchmarked via GridSearchCV to minimize RMSE across held-out test sets, using Snowflake as the analytical data store.',
    features: [
      'Temporal / categorical / route-level features',
      'RF vs. Gradient Boosting comparison',
      'GridSearchCV hyperparameter tuning',
      'RMSE reduced by 22%',
    ],
    info: [
      { icon: 'link', label: 'github.com', href: '#' },
      { icon: 'cal', label: '2023' },
    ],
    tech: [
      { name: 'Python', color: '#3776ab' },
      { name: 'PySpark', color: '#e25a1c' },
      { name: 'Scikit-learn', color: '#f7931e' },
      { name: 'Snowflake', color: '#29b5e8' },
      { name: 'SQL', color: '#4479a1' },
    ],
  },
  {
    // TODO: fill in your real Oregon State Utility details (numbers, links, exact scope)
    id: 'oregon',
    name: 'Oregon State Utility Dashboard',
    icon: 'dashboard',
    grad: 'linear-gradient(135deg,#0e8a9e 0%,#0a5c74 100%)',
    tag: 'Personal Project',
    short: 'Power BI reporting dashboard for utility usage and operations.',
    about:
      'An interactive Power BI dashboard analyzing utility usage, consumption trends, and operational metrics for Oregon State. Built end-to-end from data modeling and DAX measures through published reports, giving stakeholders a self-serve view of key utility KPIs.',
    features: [
      'Interactive Power BI reports with drill-through',
      'DAX measures for usage & cost KPIs',
      'Star-schema data model for fast slicing',
      'Scheduled refresh for up-to-date data',
    ],
    info: [
      { icon: 'link', label: 'github.com', href: '#' },
      { icon: 'cal', label: '2023' },
    ],
    tech: [
      { name: 'Power BI', color: '#f2c811' },
      { name: 'DAX', color: '#f2c811' },
      { name: 'Power Query', color: '#008272' },
      { name: 'SQL', color: '#4479a1' },
      { name: 'Excel', color: '#217346' },
    ],
  },
];

/* Fun projects — same shape, but rendered as small icon tiles at the bottom.
   Add more here and the row grows on its own. */
const FUN: Project[] = [
  {
    id: 'polaroid',
    name: 'Polaroid Studio',
    icon: 'camera',
    grad: 'linear-gradient(135deg,#e0a24d 0%,#c2703a 100%)',
    tag: 'Fun Project',
    short: 'A retro browser app that turns photos into downloadable Polaroids.',
    about:
      'A retro browser app for turning photos into Polaroid-style memories. Upload a photo or shoot one with your camera, pick a frame, add a handwritten caption, and download the finished Polaroid as a high-resolution PNG. Everything happens client-side — the photo is processed in the browser using the Canvas and MediaDevices APIs, so nothing is ever uploaded to a server. No backend, no database.',
    features: [
      'Photo upload and live camera capture',
      'JPG, PNG, WebP, HEIC, and HEIF support',
      'Six frames: Classic, Mono, Floral, Hearts, Party, Glitter',
      'Live caption and frame preview',
      'High-resolution PNG download',
      'Fully client-side — photos never leave the browser',
    ],
    info: [
      {
        icon: 'link',
        label: 'Live demo',
        href: 'https://csowmini.github.io/polaroid-studio/',
      },
      {
        icon: 'link',
        label: 'github.com/CSowmini',
        href: 'https://github.com/CSowmini/polaroid-studio',
      },
      { icon: 'cal', label: '2025' },
    ],
    tech: [
      { name: 'JavaScript', color: '#f7df1e' },
      { name: 'Canvas API', color: '#e0a24d' },
      { name: 'MediaDevices API', color: '#c2703a' },
      { name: 'HEIC2Any', color: '#8a6d3b' },
      { name: 'HTML', color: '#e34f26' },
      { name: 'CSS', color: '#1572b6' },
    ],
  },
];

/* one flat list for lookups — detail view and "More Projects" span both groups */
const ALL: Project[] = [...PROJECTS, ...FUN];

const NEW_CARD = {
  grad: 'linear-gradient(135deg,#4a63d6 0%,#2c3fae 100%)',
};

function InfoIcon({ type }: { type: Info['icon'] }) {
  if (type === 'link') return <LinkIcon size={16} />;
  if (type === 'cal') return <Calendar size={16} />;
  return <TrendingUp size={16} />;
}

export default function ProjectsPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = ALL.find((p) => p.id === openId) || null;
  const router = useRouter();

  // theme detection — same approach as the Experience page
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
    <main className="proj-page">
      <SideNav />
      <LightSwitch />

      {/* Header — pinned; the deck piles up under it. Identical styling to Experience. */}
      <header className="masthead">
        <Link href="/">
          <h1 className={`text-4xl md:text-5xl font-serif cursor-pointer hover:opacity-70 transition-opacity ${heading}`}>
            Chandrika Sowmini
          </h1>
        </Link>
        <p className={`mt-3 text-sm ${body}`}>
          <RotatingTitle />
        </p>
      </header>

      <div className="wrap">
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="stack">
                {PROJECTS.map((p, i) => {
                  const Icon = ICONS[p.icon];
                  return (
                    <button
                      key={p.id}
                      className="card"
                      style={{
                        background: p.grad,
                        top: STACK_TOP + i * STACK_STEP,
                        zIndex: i + 1,
                      }}
                      onClick={() => setOpenId(p.id)}
                    >
                      <span className="tile">
                        <Icon size={40} strokeWidth={1.8} />
                      </span>
                      <span className="meta">
                        <span className="c-title">{p.name}</span>
                        <span className="c-desc">{p.short}</span>
                        <span className="tag">{p.tag}</span>
                      </span>
                    </button>
                  );
                })}

                <button
                  className="card new"
                  style={{
                    background: NEW_CARD.grad,
                    top: STACK_TOP + PROJECTS.length * STACK_STEP,
                    zIndex: PROJECTS.length + 1,
                  }}
                  onClick={() => router.push('/contact')}
                >
                  <span className="tile">
                    <Plus size={40} strokeWidth={2.2} />
                  </span>
                  <span className="meta">
                    <span className="c-title">New Project</span>
                    <span className="c-desc">I&apos;m always exploring new ideas.</span>
                    <span className="connect">Let&apos;s connect →</span>
                  </span>
                </button>

                {/* scroll room so every card can reach its pinned spot and hold */}
                <div className="stack-spacer" aria-hidden />
              </div>

              {/* ---- fun projects: small icons, same detail view on click ---- */}
              <section className="fun">
                <h3 className="fun-head">For fun</h3>
                <div className="fun-row">
                  {FUN.map((p) => {
                    const Icon = ICONS[p.icon];
                    return (
                      <button
                        key={p.id}
                        className="fun-item"
                        onClick={() => setOpenId(p.id)}
                        aria-label={p.name}
                      >
                        <span className="fun-tile" style={{ background: p.grad }}>
                          <Icon size={26} strokeWidth={1.8} />
                        </span>
                        <span className="fun-name">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
            >
              <button className="back" onClick={() => setOpenId(null)}>
                <ArrowLeft size={18} /> All projects
              </button>

              <div className="hero" style={{ background: open.grad }}>
                <span className="tile">
                  {(() => {
                    const Icon = ICONS[open.icon];
                    return <Icon size={44} strokeWidth={1.8} />;
                  })()}
                </span>
                <div>
                  <h2>{open.name}</h2>
                  <p>{open.short}</p>
                </div>
              </div>

              <div className="cols">
                <div>
                  <section className="block">
                    <h3>About</h3>
                    <p className="about">{open.about}</p>
                  </section>
                  <section className="block">
                    <h3>Key Features</h3>
                    <ul className="feat">
                      {open.features.map((f) => (
                        <li key={f}>
                          <CheckCircle2 size={18} /> <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <div>
                  <section className="block">
                    <h3>Info</h3>
                    {open.info.map((row) => (
                      <div className="info-row" key={row.label}>
                        <InfoIcon type={row.icon} />
                        {row.href ? (
                          <a href={row.href} target="_blank" rel="noopener noreferrer">
                            {row.label}
                          </a>
                        ) : (
                          <span>{row.label}</span>
                        )}
                      </div>
                    ))}
                  </section>
                  <section className="block">
                    <h3>Tech</h3>
                    <div className="pills">
                      {open.tech.map((t) => (
                        <span className="pill" key={t.name}>
                          <span className="dot" style={{ background: t.color }} />
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              <div className="divider" />
              <section className="more">
                <h3>More Projects</h3>
                <div className="more-row">
                  {ALL.filter((p) => p.id !== open.id).map((o) => {
                    const Icon = ICONS[o.icon];
                    return (
                      <button
                        key={o.id}
                        className="more-tile"
                        style={{ background: o.grad }}
                        onClick={() => setOpenId(o.id)}
                        aria-label={o.name}
                      >
                        <Icon size={32} strokeWidth={1.8} />
                      </button>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .proj-page {
          min-height: 100vh;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* Name pinned to the top so it doesn't move while scrolling */
        .masthead {
          position: sticky;
          top: 0;
          z-index: 30;
          text-align: center;
          padding: 34px 24px 50px;
          background: var(--background);
        }

        .wrap {
          max-width: 700px;
          margin: 0 auto;
          padding: 6px 24px 0;
        }

        /* ---- accumulating sticky stack ---- */
        .stack {
          position: relative;
          padding-top: 48px;
        }
        .card {
          position: sticky;
          border: none;
          text-align: left;
          border-radius: 20px;
          padding: 22px 28px;
          height: 176px;
          display: flex;
          align-items: center;
          gap: 24px;
          cursor: pointer;
          overflow: hidden;
          /* the inset rim separates one card's peek from the one above it,
             so the stack reads as distinct sheets rather than a colour gradient */
          box-shadow: 0 -6px 18px -6px rgba(0, 0, 0, 0.28),
            0 16px 40px -18px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);
          width: 100%;
          box-sizing: border-box;
          transition: transform 0.2s ease;
        }
        .card:hover {
          transform: translateY(-2px);
        }
        /* small visual gap between cards before they pin */
        .card + .card {
          margin-top: 40px;
        }
        .tile {
          width: 84px;
          height: 84px;
          border-radius: 18px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: rgba(0, 0, 0, 0.22);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
        }
        .meta {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .c-title {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 600;
          font-size: 24px;
          color: #fff;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
          text-align: left;
        }
        .c-desc {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.92);
          max-width: 420px;
          text-align: left;
        }
        .tag {
          align-self: flex-start;
          margin-top: 12px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 20px;
          padding: 3px 11px;
        }
        .card.new .tile {
          background: rgba(255, 255, 255, 0.18);
        }
        .connect {
          margin-top: 12px;
          font-size: 14px;
          color: #fff;
          font-weight: 600;
        }
        /* scroll runway that lets the last card pin and hold — just enough
           to settle, not a screenful of dead space */
        .stack-spacer {
          height: 10vh;
        }

        /* ---- fun projects row ---- */
        .fun {
          padding: 20px 0 80px;
        }
        .fun-head {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 600;
          font-size: 18px;
          color: #6b6257;
          margin-bottom: 18px;
        }
        .fun-row {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }
        .fun-item {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
          width: 84px;
        }
        .fun-tile {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.4);
          transition: transform 0.2s ease;
        }
        .fun-item:hover .fun-tile {
          transform: translateY(-4px) rotate(-4deg);
        }
        .fun-name {
          font-size: 11.5px;
          line-height: 1.3;
          text-align: center;
          color: #6b6257;
        }

        /* ---- detail ---- */
        .back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 15px;
          color: #555;
          margin: 6px 0 24px;
          padding: 6px 0;
        }
        .hero {
          border-radius: 22px;
          padding: 22px 30px;
          min-height: 120px;
          display: flex;
          align-items: center;
          gap: 26px;
          margin-bottom: 30px;
          box-shadow: 0 16px 40px -18px rgba(0, 0, 0, 0.35);
          box-sizing: border-box;
        }
        .hero .tile {
          width: 100px;
          height: 100px;
        }
        .hero h2 {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 600;
          font-size: 30px;
          color: #fff;
          margin-bottom: 6px;
          text-align: left;
        }
        .hero p {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.92);
          max-width: 440px;
          text-align: left;
        }
        .cols {
          display: grid;
          grid-template-columns: 1.99fr 1fr;
          gap: 48px;
        }
        .block {
          margin-bottom: 22px;
        }
        h3 {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 600;
          font-size: 22px;
          margin-bottom: 16px;
          color: #111827;
        }
        .about {
          color: #3c3c3c;
          font-size: 15px;
          line-height: 1.65;
        }
        .feat {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 0;
        }
        .feat li {
          display: flex;
          align-items: center;
          gap: 11px;
          font-size: 15px;
          color: #2b2b2b;
        }
        .feat li :global(svg) {
          color: #7a7368;
          flex-shrink: 0;
        }
        .info-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 11px;
          font-size: 14px;
          color: #2b2b2b;
        }
        .info-row :global(svg) {
          color: #8a8a8a;
        }
        .info-row a {
          color: #2b2b2b;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          border: 1px solid #e2e0dc;
          background: #fff;
          border-radius: 20px;
          padding: 5px 12px;
          color: #2b2b2b;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .divider {
          height: 1px;
          background: #e2e0dc;
          margin: 24px 0 18px;
        }
        .more-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .more-tile {
          width: 60px;
          height: 60px;
          border: none;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.4);
          transition: transform 0.2s;
        }
        .more-tile:hover {
          transform: translateY(-4px);
        }

        /* ---- dark mode (theme toggle removes .light-mode) ---- */
        :global(html:not(.light-mode)) h3 {
          color: #ffffff;
        }
        :global(html:not(.light-mode)) .about,
        :global(html:not(.light-mode)) .feat li,
        :global(html:not(.light-mode)) .info-row,
        :global(html:not(.light-mode)) .info-row a,
        :global(html:not(.light-mode)) .pill {
          color: #d6d6d6;
        }
        :global(html:not(.light-mode)) .pill {
          background: #1a1a1a;
          border-color: #333;
        }
        :global(html:not(.light-mode)) .divider {
          background: #2a2a2a;
        }
        :global(html:not(.light-mode)) .back {
          color: #aaa;
        }
        :global(html:not(.light-mode)) .fun-head,
        :global(html:not(.light-mode)) .fun-name {
          color: #9a9188;
        }

        @media (max-width: 640px) {
          .cols {
            grid-template-columns: 1fr;
            gap: 22px;
          }
          .card {
            height: auto;
            min-height: 150px;
            padding: 20px 22px;
            gap: 18px;
          }
          .hero {
            padding: 20px 22px;
            gap: 18px;
          }
          .tile {
            width: 72px;
            height: 72px;
          }
          .c-title {
            font-size: 21px;
          }
        }
      `}</style>
    </main>
  );
}