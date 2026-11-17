'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Mic } from 'lucide-react';
import Link from 'next/link';
import RotatingTitle from '../components/RotatingTitle';

/* palette */
const ACCENT = '#8A5C50';      // deep terracotta — user bubble + send button
const BOT_BG_LIGHT = '#F7E9E2'; // warm cream bot bubble (light mode)
const BOT_BG_DARK = '#2A211E';  // warm dark bot bubble (dark mode)

/* ---- your links: edit these ---- */
const EMAIL = 'chandrikasowminid@gmail.com';
const LINKEDIN = 'https://linkedin.com/in/chandrikasowmini-d19';

const QUICK_QUESTIONS = [
  'Who is Chandrika?',
  'What is her experience?',
  'Which tools does she use?',
  'What are her specialties?',
  'How can I contact her?',
];

/** Detects whether the page is currently dark by sampling actual rendered colors. */
function detectDark(): boolean {
  if (typeof window === 'undefined') return false;

  const parseRGB = (value: string): number[] | null => {
    const nums = value.match(/[\d.]+/g);
    if (!nums || nums.length < 3) return null;
    return nums.map(Number);
  };

  for (const el of [document.body, document.documentElement]) {
    const bg = window.getComputedStyle(el).backgroundColor;
    const rgb = parseRGB(bg);
    if (rgb) {
      const alpha = rgb.length > 3 ? rgb[3] : 1;
      if (alpha > 0.1) {
        const luminance = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
        return luminance < 128;
      }
    }
  }

  const color = parseRGB(window.getComputedStyle(document.body).color);
  if (color) {
    const luminance = 0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2];
    return luminance > 128;
  }

  return false;
}

/** Renders bot text, converting [label](url) into real links. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);

  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

        if (!match) {
          return <span key={i}>{part}</span>;
        }

        const label = match[1];
        const url = match[2];
        const external = url.startsWith('http');

        return (
          <a
            key={i}
            href={url}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="underline underline-offset-2 font-medium hover:opacity-75 transition-opacity"
            style={{ color: ACCENT }}
          >
            {label}
          </a>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ *
 * QuestionPills and InputCard live OUTSIDE ChatBot on purpose. If they
 * were declared inside, React would see a new component type on every
 * render (every keystroke), remounting the <input> and losing focus.
 * ------------------------------------------------------------------ */

function QuestionPills({
  isDark,
  onAsk,
}: {
  isDark: boolean;
  onAsk: (q: string) => void;
}) {
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-2 justify-center">
      {QUICK_QUESTIONS.map((question) => (
        <button
          key={question}
          onClick={() => onAsk(question)}
          className={`px-3.5 py-1.5 whitespace-nowrap rounded-full text-xs transition-colors border ${
            isDark
              ? 'bg-transparent text-gray-300 border-gray-700 hover:bg-[#D4A59A]/20 hover:border-[#D4A59A]/40'
              : 'bg-transparent text-gray-600 border-gray-300 hover:bg-[#D4A59A]/20 hover:border-[#D4A59A]/50'
          }`}
        >
          {question}
        </button>
      ))}
    </div>
  );
}

function InputCard({
  isDark,
  input,
  setInput,
  onSubmit,
  autoFocus = false,
}: {
  isDark: boolean;
  input: string;
  setInput: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  autoFocus?: boolean;
}) {
  return (
    <form onSubmit={onSubmit}>
      <div
        className={`rounded-2xl border px-5 pt-4 pb-3 transition-colors ${
          isDark ? 'bg-[#151515] border-gray-800' : 'bg-white border-gray-200'
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What would you like to know?"
          autoFocus={autoFocus}
          className={`w-full bg-transparent focus:outline-none text-[15px] ${
            isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
          }`}
        />

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            className={`transition-colors ${
              isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Mic className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <button
            type="submit"
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-opacity hover:opacity-85"
            style={{ background: ACCENT }}
          >
            <Send className="w-4 h-4 text-white" strokeWidth={2} />
          </button>
        </div>
      </div>
    </form>
  );
}

export default function ChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot'; text: string }>>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setIsDark(detectDark());
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const answerFor = (question: string) => {
    const q = question.toLowerCase();

    if (q.includes('hello') || q === 'hi' || q.includes('hi ') || q.includes('hey')) {
      return "Hi there! 👋 I'm Chandrika's assistant. Ask me anything about her background, experience, projects, or how to get in touch.";
    }
    if (
      q.includes('contact') ||
      q.includes('reach') ||
      q.includes('email') ||
      q.includes('touch') ||
      q.includes('linkedin') ||
      q.includes('hire')
    ) {
      return `I'd love to hear from you! Here's how to reach me:\n\n📧 [${EMAIL}](mailto:${EMAIL})\n💼 [Connect on LinkedIn](${LINKEDIN})\n📄 [Visit my contact page](/contact)`;
    }
    if (q.includes('who') || q.includes('chandrika')) {
      return "I'm Chandrika Sowmini, a Data Engineer based in Texas. I hold an MS in Data Science from Indiana University and specialize in building data platforms, ETL pipelines, and analytics that teams actually act on.\n\nI can tell you more about my background, my projects, or my work experience — just let me know where you'd like to start.";
    }
    if (q.includes('experience') || q.includes('work')) {
      return 'I have 4+ years of experience and currently build data solutions at Delineate. Along the way I have worked with Pacers Sports & Entertainment, the Indiana Department of Health, MISO, and Deloitte.';
    }
    if (q.includes('project')) {
      return 'My projects include a Spotify streaming analytics pipeline (Kafka, Kinesis, Snowflake), AI-HireVue — a real-time GenAI candidate evaluation tool that won 1st place at the Deloitte hackathon — a flight price forecasting engine, and an Oregon State utility Power BI dashboard.\n\n[See all my projects](/projects)';
    }
    if (q.includes('tool') || q.includes('skill') || q.includes('stack')) {
      return 'I work with Python, SQL, and R, plus Azure and Databricks for cloud and big data. For visualization I use Tableau and Power BI, and I build ETL pipelines with PySpark and Delta Lake.';
    }
    if (q.includes('special')) {
      return 'My specialties include data platform architecture, ETL/ELT pipelines, dimensional modeling, statistical analysis, and dashboard development — with recent work in LLM-powered and agentic analytics.';
    }
    if (q.includes('education') || q.includes('school') || q.includes('degree') || q.includes('stud')) {
      return 'I hold an MS in Data Science from Indiana University Bloomington with a 3.87 GPA. My coursework covered data mining, machine learning, statistical methods, applied algorithms, and distributed systems.';
    }

    return "That's a great question! I can tell you about my background, work experience, the tools I use, my projects, or how to get in touch. Which would you like to hear about?";
  };

  const handleQuickQuestion = (question: string) => {
    setIsFullScreen(true);
    setMessages((prev) => [...prev, { type: 'user' as const, text: question }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { type: 'bot' as const, text: answerFor(question) }]);
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleQuickQuestion(input);
    setInput('');
  };

  return (
    <>
      {/* ---------- Full screen chat ---------- */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex flex-col ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#faf9f7]'}`}
          >
            {/* Header */}
            <div className="pt-10 pb-6 px-6 relative">
              <button
                onClick={() => setIsFullScreen(false)}
                className={`absolute left-6 top-10 p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'
                }`}
                aria-label="Close"
              >
                <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>

              <div className="text-center">
                <Link href="/" onClick={() => setIsFullScreen(false)}>
                  <h1
                    className={`text-4xl md:text-5xl font-serif cursor-pointer hover:opacity-70 transition-opacity ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Chandrika Sowmini
                  </h1>
                </Link>
                <p className={`mt-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Data Engineer
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6">
              <div className="max-w-4xl mx-auto space-y-5 pb-6">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'user' ? (
                      <div
                        className="max-w-xl px-5 py-3 rounded-2xl text-[15px] text-white"
                        style={{ background: ACCENT }}
                      >
                        {message.text}
                      </div>
                    ) : (
                      <div
                        className={`max-w-3xl px-6 py-5 rounded-2xl text-[15px] leading-relaxed whitespace-pre-line ${
                          isDark ? 'text-gray-100' : 'text-gray-900'
                        }`}
                        style={{ background: isDark ? BOT_BG_DARK : BOT_BG_LIGHT }}
                      >
                        <RichText text={message.text} />
                      </div>
                    )}
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div
                      className="px-6 py-5 rounded-2xl flex gap-1.5"
                      style={{ background: isDark ? BOT_BG_DARK : BOT_BG_LIGHT }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ background: ACCENT }}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>

            {/* Suggestions + input pinned at bottom */}
            <div className="px-6 pb-8 pt-2">
              <div className="max-w-5xl mx-auto">
                <div className="mb-3">
                  <QuestionPills isDark={isDark} onAsk={handleQuickQuestion} />
                </div>
                <InputCard
                  isDark={isDark}
                  input={input}
                  setInput={setInput}
                  onSubmit={handleSubmit}
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Inline section on the home page ---------- */}
      <section className="w-full py-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2
            className={`text-lg font-serif font-normal text-center mb-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Ask ChandrikaGPT
          </h2>

          <div className="mb-5">
            <QuestionPills isDark={isDark} onAsk={handleQuickQuestion} />
          </div>

          <InputCard
            isDark={isDark}
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </>
  );
}