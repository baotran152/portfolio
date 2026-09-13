'use client';

import { cn } from '@/lib/utils';

type StatusBadgeProps = {
  isOpen: boolean;
  /** Positioning override. The chat page needs a higher layer than its fixed header. */
  className?: string;
};

// A badge, not a control: it reports state and does nothing when clicked, so it is
// marked up as a status region rather than a button. Declared at module scope so it
// is not rebuilt on every render of Home.
export function StatusBadge({ isOpen, className }: StatusBadgeProps) {
  return (
    <div className={cn('absolute top-6 left-6 z-20', className)}>
      <span
        role="status"
        className={`relative flex items-center gap-2.5 rounded-full border-2 px-5 py-2.5 text-sm font-semibold shadow-lg backdrop-blur-lg md:text-base
          ${isOpen
            ? 'border-emerald-500/50 bg-emerald-50/80 text-emerald-900 dark:border-emerald-400/50 dark:bg-emerald-950/70 dark:text-emerald-50'
            : 'border-rose-500/50 bg-rose-50/80 text-rose-900 dark:border-rose-400/50 dark:bg-rose-950/70 dark:text-rose-50'}
        `}
      >
        {/* Pulse dot. Decorative - the label already states the status. */}
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          {isOpen ? (
            <>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
            </>
          ) : (
            <>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
            </>
          )}
        </span>
        {isOpen
          ? 'I am OPEN for new opportunity'
          : 'Currently NOT open for new opportunity'}
      </span>
    </div>
  );
}
