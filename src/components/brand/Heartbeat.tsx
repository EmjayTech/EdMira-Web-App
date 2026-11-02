import { cn } from '@/utils/cn';

/**
 * The mint ECG line from the EdMira artwork. `animate` draws it on a loop.
 */
export function Heartbeat({ className, animate = true }: { className?: string; animate?: boolean }) {
  return (
    <svg viewBox="0 0 600 60" fill="none" className={cn('w-full', className)} aria-hidden preserveAspectRatio="none">
      <path
        d="M0 34 H190 L205 34 L216 22 L228 46 L246 6 L262 54 L276 30 L290 34 H410 L420 28 L430 36 L440 34 H600"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1200"
        className={animate ? 'animate-pulse-line' : undefined}
      />
    </svg>
  );
}
