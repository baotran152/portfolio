'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const TRACK = 'relative h-8 w-16 shrink-0 overflow-hidden rounded-full';

// Fixed positions so the field does not reshuffle on every render.
const STARS = [
  { top: '22%', left: '14%', size: 2, opacity: 0.9 },
  { top: '55%', left: '22%', size: 1.5, opacity: 0.6 },
  { top: '32%', left: '34%', size: 1, opacity: 0.8 },
  { top: '70%', left: '42%', size: 1.5, opacity: 0.5 },
  { top: '18%', left: '52%', size: 1, opacity: 0.7 },
  { top: '62%', left: '58%', size: 2, opacity: 0.85 },
  { top: '40%', left: '68%', size: 1, opacity: 0.5 },
  { top: '76%', left: '78%', size: 1.5, opacity: 0.7 },
];

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The server cannot know the stored theme, so the real state is only rendered
  // after mount. The placeholder keeps the same footprint to avoid a layout shift.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={`${TRACK} bg-neutral-200 dark:bg-neutral-700`} />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`${TRACK} focus-visible:ring-ring cursor-pointer border border-black/10 shadow-inner focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-white/15`}
    >
      {/* Day sky */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-200"
        animate={{ opacity: isDark ? 0 : 1 }}
        transition={{ duration: 0.35 }}
      >
        <span className="absolute top-[55%] left-[45%] h-2.5 w-5 rounded-full bg-white/90" />
        <span className="absolute top-[42%] left-[56%] h-3 w-6 rounded-full bg-white/80" />
        <span className="absolute top-[62%] left-[70%] h-2 w-4 rounded-full bg-white/70" />
      </motion.span>

      {/* Night sky */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-b from-slate-900 to-indigo-950"
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      >
        {STARS.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              height: star.size,
              width: star.size,
              opacity: star.opacity,
            }}
          />
        ))}
      </motion.span>

      {/* Sun / moon knob */}
      <motion.span
        className="absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full"
        animate={{
          x: isDark ? 32 : 0,
          backgroundColor: isDark ? '#e5e7eb' : '#fbbf24',
          boxShadow: isDark
            ? '0 0 10px 2px rgba(226,232,240,0.5)'
            : '0 0 10px 2px rgba(251,191,36,0.6)',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      >
        {/* Craters, faded out while the knob is the sun. */}
        <motion.span
          className="relative block h-full w-full rounded-full"
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <span className="absolute top-[28%] left-[24%] h-1.5 w-1.5 rounded-full bg-neutral-400/60" />
          <span className="absolute top-[55%] left-[55%] h-1 w-1 rounded-full bg-neutral-400/50" />
        </motion.span>
      </motion.span>
    </button>
  );
}
