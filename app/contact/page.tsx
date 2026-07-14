'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef, useId } from 'react';
import { Send, Linkedin, Github, Mail, Check, AlertTriangle } from 'lucide-react';
import SideNav from '../components/SideNav';
import LightSwitch from '../components/LightSwitch';

/* Formspree endpoint — public by design, safe to commit */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mjgnvzdo';

const EMAIL = 'chandrikasowminid@gmail.com';

/* Typewriter hook — types `text` out once `start` is true */
function useTyped(text: string, start: boolean, speed = 55) {
  const [out, setOut] = useState('');
  useEffect(() => {
    if (!start) {
      setOut('');
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [start, text, speed]);
  return out;
}

/* A single sticky-note field with reactive underline, focus packet, and valid checkmark */
function NoteField({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  multiline = false,
  validateEmail = false,
  disabled = false,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  validateEmail?: boolean;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const valid = validateEmail && value.includes('@') && value.includes('.');

  const shared =
    'w-full bg-transparent outline-none py-2 text-[#3a2e22] placeholder-[#a89f6f] text-sm pr-6 disabled:opacity-60';

  const common = {
    id,
    name,
    placeholder,
    value,
    disabled,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };

  return (
    <div className="relative mb-5">
      {/* visually hidden label — placeholders are not labels */}
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      {multiline ? (
        <textarea rows={4} {...common} className={`${shared} resize-none`} />
      ) : (
        <input type={type} {...common} className={shared} />
      )}

      {/* underline: base + animated fill that draws in on focus */}
      <div className="relative h-0.5 w-full bg-[#c9c088]">
        <div
          className="absolute inset-y-0 left-0 bg-[#5c4a3a] transition-transform duration-300 origin-left w-full"
          style={{ transform: focused ? 'scaleX(1)' : 'scaleX(0)' }}
        />
      </div>

      {/* packet arriving on focus */}
      {focused && (
        <span
          className="absolute -left-3 top-2 w-2 h-2 rounded-full bg-[#e0c060]"
          style={{ animation: 'field-ping 0.6s ease-out' }}
          aria-hidden="true"
        />
      )}

      {/* checkmark once email is valid */}
      {valid && (
        <span
          className="absolute right-0 top-1.5 text-emerald-600"
          style={{ animation: 'check-pop 0.4s ease-out' }}
          aria-hidden="true"
        >
          <Check className="w-4 h-4" strokeWidth={3} />
        </span>
      )}
    </div>
  );
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactPage() {
  const [isDark, setIsDark] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [flight, setFlight] = useState<{ path: string } | null>(null);
  const [phase, setPhase] = useState(0); // 0: terminal, 1: heading, 2: content
  const buttonRef = useRef<HTMLButtonElement>(null);

  // theme detection
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

  // boot sequence: terminal -> heading -> content
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1100);
    const t2 = setTimeout(() => setPhase(2), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const termText = useTyped('> establishing connection...', true, 30);
  const headText = useTyped('Get in touch', phase >= 1, 30);

  const heading = isDark ? 'text-white' : 'text-gray-900';
  const body = isDark ? 'text-gray-300' : 'text-gray-600';

  const ready = Boolean(
    form.name.trim() && form.email.includes('@') && form.message.trim()
  );
  const sending = status === 'sending';

  const mailtoFallback = `mailto:${EMAIL}?subject=${encodeURIComponent(
    `Message from ${form.name}`
  )}&body=${encodeURIComponent(
    `${form.message}\n\nFrom: ${form.name} (${form.email})`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || sending) return;

    // honeypot: bots fill hidden fields, humans don't
    if (form.website) return;

    setStatus('sending');
    setErrorMsg('');

    // launch the plane immediately — animation runs while the POST is in flight
    const rect = buttonRef.current?.getBoundingClientRect();
    const startX = rect ? rect.left + rect.width / 2 : window.innerWidth * 0.7;
    const startY = rect ? rect.top + rect.height / 2 : window.innerHeight * 0.6;
    const endX = window.innerWidth * 0.85;
    const endY = window.innerHeight * 0.2;
    const ctrlX = startX + (endX - startX) * 0.35;
    const ctrlY = endY - 140;
    setFlight({ path: `M ${startX} ${startY} Q ${ctrlX} ${ctrlY}, ${endX} ${endY}` });

    // let the plane finish its arc even if the network is instant
    const minFlight = new Promise((r) => setTimeout(r, 1700));

    try {
      const [res] = await Promise.all([
        fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            message: form.message,
            _subject: `Portfolio contact — ${form.name}`,
          }),
        }),
        minFlight,
      ]);

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.errors?.map((x: { message: string }) => x.message).join(', ') ||
            'Formspree rejected the submission.'
        );
      }

      setStatus('sent');
      setForm({ name: '', email: '', message: '', website: '' });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    } finally {
      setFlight(null);
    }
  };

  const socials = [
    { icon: Linkedin, href: 'https://linkedin.com/in/chandrikasowmini-d19', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/CSowmini', label: 'GitHub' },
    { icon: Mail, href: `mailto:${EMAIL}`, label: 'Email' },
  ];

  const supportsOffsetPath =
    typeof CSS !== 'undefined' && CSS.supports?.('offset-path', "path('M0 0 L1 1')");

  return (
    <main className="min-h-screen transition-colors duration-500 flex items-center overflow-hidden">
      {/* Flying plane + contrail overlay */}
      {flight && (
        <div className="fixed inset-0 pointer-events-none z-[60]">
          <svg className="absolute inset-0 w-full h-full">
            <path
              d={flight.path}
              fill="none"
              stroke="#e0c060"
              strokeWidth="2"
              strokeDasharray="2 9"
              strokeLinecap="round"
              style={{
                strokeDashoffset: 400,
                animation: 'draw-trail 1.7s ease-out forwards',
              }}
            />
          </svg>
          {supportsOffsetPath && (
            <div
              style={{
                position: 'absolute',
                offsetPath: `path('${flight.path}')`,
                animation: 'plane-travel 1.7s ease-in-out forwards',
              }}
            >
              <Send className="w-6 h-6" style={{ color: '#e0c060' }} strokeWidth={2} />
            </div>
          )}
        </div>
      )}

      <SideNav />
      <LightSwitch />

      <div className="max-w-5xl mx-auto px-6 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
          {/* Left column */}
          <div>
            {/* terminal line */}
            <p
              className="text-emerald-500 text-sm mb-3 h-5"
              style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
            >
              {termText}
              {phase === 0 && <span className="terminal-cursor">▋</span>}
            </p>

            {/* typed heading */}
            <h1 className={`text-5xl md:text-6xl font-serif ${heading} min-h-[3.5rem]`}>
              {headText}
              {phase === 1 && <span className={`terminal-cursor ${heading}`}>▋</span>}
            </h1>

            <div
              className={`transition-opacity duration-700 ${
                phase >= 2 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <h2 className={`mt-6 text-xl font-semibold leading-snug ${heading}`}>
                Got a messy pipeline, a dashboard that lies,
                <br />
                or a role with my name on it?
              </h2>

              <blockquote
                className={`mt-6 pl-4 border-l-2 ${
                  isDark ? 'border-amber-500' : 'border-amber-400'
                } text-[15px] leading-relaxed ${body}`}
                style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
              >
                I turn scattered data into decisions people actually trust.
                Tell me what you&apos;re building — I reply fast, and I don&apos;t ghost.
              </blockquote>

              <div className="mt-8 flex gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isDark
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </a>
                ))}
              </div>

              {/* signature quote */}
              <div
                className={`mt-10 text-[12px] leading-relaxed ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
                style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
              >
                <p className="mb-2 text-emerald-500">&gt; my motto.txt</p>
                <p className="pl-3 border-l-2 border-amber-400/50 max-w-md">
                  If I have the belief that I can do it, I shall surely acquire the
                  capacity to do it, even if I may not have it at the beginning!
                </p>
                <p className="pl-3 mt-2 text-amber-500/80">
                  Thanks for connecting.
                </p>
              </div>
            </div>
          </div>

          {/* Right column — sticky note form */}
          <div
            className={`flex justify-center transition-all duration-700 ${
              phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="relative" style={{ transform: 'rotate(-2deg)' }}>
              {/* torn tape */}
              <div
                className="absolute -top-11 left-1/2 z-20"
                style={{ transform: 'translateX(-50%) rotate(-4deg)' }}
                aria-hidden="true"
              >
                <svg width="100" height="100">
                  <defs>
                    <linearGradient id="tapeSheen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
                      <stop offset="45%" stopColor="#fff" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#fff" stopOpacity="0.42" />
                    </linearGradient>
                    <filter id="tapeTorn" x="-20%" y="-20%" width="140%" height="140%">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.012 0.45"
                        numOctaves="3"
                        seed="7"
                        result="n"
                      />
                      <feDisplacementMap in="SourceGraphic" in2="n" scale="8" />
                    </filter>
                  </defs>
                  <rect
                    x="10"
                    y="10"
                    width="90"
                    height="60"
                    fill="url(#tapeSheen)"
                    filter="url(#tapeTorn)"
                  />
                </svg>
              </div>

              <div
                className="relative w-[380px] max-w-full bg-[#fdf6b2] px-8 pt-10 pb-8"
                style={{ boxShadow: '6px 8px 24px rgba(0,0,0,0.4)' }}
              >
                {/* torn top edge */}
                <svg
                  className="absolute -top-2 left-0 w-full"
                  height="10"
                  viewBox="0 0 380 10"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 8 L20 3 L40 7 L60 2 L80 6 L100 3 L120 7 L140 2 L160 6 L180 3 L200 7 L220 2 L240 6 L260 3 L280 7 L300 2 L320 6 L340 3 L360 7 L380 3 L380 10 L0 10 Z"
                    fill="#fdf6b2"
                  />
                </svg>

                <AnimatePresence mode="wait">
                  {status !== 'sent' ? (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      exit={{ opacity: 0 }}
                      className={sending ? 'opacity-40 transition-opacity duration-500' : ''}
                    >
                      <p className="text-[#5c4a3a] text-sm mb-5 font-bold">
                        📌 Leave me a note
                      </p>

                      <NoteField
                        name="name"
                        label="Your name"
                        placeholder="your name"
                        value={form.name}
                        onChange={(v) => setForm({ ...form, name: v })}
                        disabled={sending}
                      />
                      <NoteField
                        name="email"
                        label="Your email"
                        type="email"
                        placeholder="your email"
                        value={form.email}
                        onChange={(v) => setForm({ ...form, email: v })}
                        validateEmail
                        disabled={sending}
                      />
                      <NoteField
                        name="message"
                        label="Your message"
                        placeholder="what's on your mind?"
                        value={form.message}
                        onChange={(v) => setForm({ ...form, message: v })}
                        multiline
                        disabled={sending}
                      />

                      {/* honeypot — hidden from humans, catnip for bots */}
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        className="absolute left-[-9999px] opacity-0 h-0 w-0"
                      />

                      {status === 'error' && (
                        <div
                          role="alert"
                          className="mb-4 flex items-start gap-2 text-[12px] text-red-700"
                        >
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2} />
                          <span>
                            {errorMsg || "Couldn't send that."}{' '}
                            <a href={mailtoFallback} className="underline font-semibold">
                              Email me directly
                            </a>
                            .
                          </span>
                        </div>
                      )}

                      <button
                        ref={buttonRef}
                        type="submit"
                        disabled={!ready || sending}
                        className={`w-full py-3 rounded flex items-center justify-center gap-2 transition-all ${
                          ready && !sending
                            ? 'bg-[#5c4a3a] hover:bg-[#4a3a2a] cursor-pointer button-wake'
                            : 'bg-[#c9c088] cursor-not-allowed'
                        }`}
                      >
                        <span
                          className={`text-sm font-bold ${
                            ready && !sending ? 'text-white' : 'text-[#8a825a]'
                          }`}
                        >
                          {sending ? 'sending…' : status === 'error' ? 'try again' : 'send it'}
                        </span>
                        {!sending && (
                          <Send
                            className="w-4 h-4"
                            style={{ color: ready ? '#ffffff' : '#8a825a' }}
                            strokeWidth={2}
                          />
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-10 text-center"
                    >
                      <div className="text-4xl mb-3 check-pop text-[#5c4a3a]">✓</div>
                      <p className="text-[#5c4a3a] font-bold">Message sent!</p>
                      <p className="text-[#8a7a5a] text-xs mt-2">
                        I&apos;ll get back to you soon.
                      </p>
                      <button
                        onClick={() => setStatus('idle')}
                        className="mt-5 text-[11px] text-[#8a7a5a] underline hover:text-[#5c4a3a]"
                      >
                        send another
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}