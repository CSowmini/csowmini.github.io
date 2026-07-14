'use client';

import { useEffect, useState } from 'react';

const RAY_COUNT = 12;
const BULB_X = 24;
const BULB_Y = 19; // centre of the glass — the origin of everything
const REST_R = 24; // where a dot settles when lit
const TUCK_R = 9; // where it starts, buried in the glass

/* round to 3dp — raw Math.cos output serializes differently on server vs client,
   which trips React's hydration check */
const px = (n: number) => Number(n.toFixed(3));

const RAYS = Array.from({ length: RAY_COUNT }, (_, i) => {
  const angle = (i * 30 - 90) * (Math.PI / 180);
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const pull = REST_R - TUCK_R;
  return {
    i,
    cx: px(BULB_X + REST_R * ux),
    cy: px(BULB_Y + REST_R * uy),
    tuckX: px(-pull * ux),
    tuckY: px(-pull * uy),
  };
});

const DOT_R = 1.35; // uniform, small — every dot identical
const TRAVEL = 700;
const JITTER = 40;

export default function LightSwitch() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pulse, setPulse] = useState(0); // bumps on each switch-on to retrigger the shockwave

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light-mode'));
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) setPulse((p) => p + 1);
    document.documentElement.classList.toggle('light-mode', next);
    try {
      localStorage.setItem('theme', next ? 'light' : 'dark');
    } catch {
      /* private mode — theme just won't persist */
    }
  };

  const track = isLight ? '#ffffff' : '#3a3835';
  const knob = '#d9a066';
  const bulb = isLight ? '#6f5c4a' : '#a28c76';

  // The server has no idea which theme is active, so every colour/position below
  // would mismatch on hydration. Hold a same-sized blank until we've read <html>.
  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="fixed top-6 right-6 z-50 flex items-center gap-3 p-2"
        style={{ width: 105, height: 42 }}
      />
    );
  }

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className="fixed top-6 right-6 z-50 flex items-center gap-3 p-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
    >
      <style>{`
        @keyframes ls-shock {
          0%   { r: 8;  opacity: 0.55; stroke-width: 2.4; }
          100% { r: 30; opacity: 0;    stroke-width: 0.2; }
        }
        @keyframes ls-breathe {
          0%, 100% { transform: translate(0,0) scale(1);    opacity: 1;    }
          50%      { transform: translate(0,0) scale(1.22); opacity: 0.72; }
        }
        @keyframes ls-filament {
          0%, 100% { opacity: 0.9; }
          45%      { opacity: 0.45; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ls-dot, .ls-shock, .ls-filament { animation: none !important; }
        }
      `}</style>

      {/* pill */}
      <span
        className="relative block w-[52px] h-[26px] rounded-full transition-colors duration-500 shrink-0"
        style={{
          backgroundColor: track,
          boxShadow: isLight
            ? '0 2px 10px rgba(0,0,0,0.12)'
            : 'inset 0 1px 3px rgba(0,0,0,0.5)',
        }}
      >
        <span
          className="absolute top-1/2 w-[19px] h-[19px] rounded-full"
          style={{
            backgroundColor: knob,
            left: isLight ? '3.5px' : '29.5px',
            transform: 'translateY(-50%)',
            transition: mounted ? 'left 420ms cubic-bezier(.34,1.56,.64,1)' : 'none',
          }}
        />
      </span>

      <svg
        width="34"
        height="34"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        className="shrink-0 overflow-visible"
      >
        {/* shockwave — one ring kicked off the glass each time it's switched on */}
        {isLight && (
          <circle
            key={pulse}
            className="ls-shock"
            cx={BULB_X}
            cy={BULB_Y}
            fill="none"
            stroke="#e0c060"
            style={{ animation: 'ls-shock 900ms ease-out forwards' }}
          />
        )}

        {/* the whole ring twists as it expands, then holds */}
        <g
          style={{
            transform: isLight ? 'rotate(0deg)' : 'rotate(-32deg)',
            transformOrigin: `${BULB_X}px ${BULB_Y}px`,
            transition: `transform ${TRAVEL}ms cubic-bezier(.22,.9,.3,1)`,
          }}
        >
          {RAYS.map(({ i, cx, cy, tuckX, tuckY }) => {
            const delay = (i % 3) * JITTER;
            return (
              <circle
                key={i}
                className="ls-dot"
                cx={cx}
                cy={cy}
                r={DOT_R}
                fill={bulb}
                style={{
                  opacity: isLight ? 1 : 0,
                  transform: isLight
                    ? 'translate(0px, 0px) scale(1)'
                    : `translate(${tuckX}px, ${tuckY}px) scale(0.3)`,
                  transformOrigin: `${cx}px ${cy}px`,
                  transition: [
                    `opacity ${TRAVEL * 0.7}ms ease ${delay}ms`,
                    `transform ${TRAVEL}ms cubic-bezier(.22,.9,.3,1) ${delay}ms`,
                    'fill 500ms ease',
                  ].join(', '),
                  // once settled, each dot breathes on its own clock
                  ...(isLight && mounted
                    ? {
                        animation: `ls-breathe ${2600 + i * 90}ms ease-in-out ${
                          TRAVEL + i * 70
                        }ms infinite`,
                      }
                    : {}),
                }}
              />
            );
          })}
        </g>

        {/* glow */}
        <circle
          cx={BULB_X}
          cy={BULB_Y}
          r="9"
          fill="#e0c060"
          style={{
            opacity: isLight ? 0.22 : 0,
            transition: `opacity ${TRAVEL}ms ease`,
          }}
        />

        {/* filament — flickers to life inside the glass */}
        <path
          className="ls-filament"
          d="M21 20.5 L22.5 17 L24 20.5 L25.5 17 L27 20.5"
          stroke="#e0c060"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            opacity: isLight ? 0.9 : 0,
            transition: `opacity 300ms ease ${isLight ? 120 : 0}ms`,
            ...(isLight && mounted
              ? { animation: 'ls-filament 3200ms ease-in-out 900ms infinite' }
              : {}),
          }}
        />

        {/* glass */}
        <path
          d="M24 6c-6 0-10.5 4.5-10.5 10 0 3.6 1.9 6 3.5 8 1.2 1.5 1.9 2.6 1.9 4h10.2c0-1.4.7-2.5 1.9-4 1.6-2 3.5-4.4 3.5-8C34.5 10.5 30 6 24 6Z"
          stroke={bulb}
          strokeWidth="2.2"
          strokeLinejoin="round"
          className="transition-[stroke] duration-500"
        />
        {/* base */}
        <path
          d="M18.9 28h10.2M20 32h8l-2.2 3.4a2 2 0 0 1-3.6 0L20 32Z"
          stroke={bulb}
          strokeWidth="2.2"
          strokeLinejoin="round"
          className="transition-[stroke] duration-500"
        />
      </svg>
    </button>
  );
}