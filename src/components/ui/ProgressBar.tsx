import { cn } from '@/utils/cn';
import { WEAK_TOPIC_THRESHOLD } from '@/data/learning/progressMath';

/** Colour by score: under the weak-topic threshold is amber, 80+ is green. */
export const scoreTone = (score: number) =>
  score < WEAK_TOPIC_THRESHOLD ? 'bg-warning' : score >= 80 ? 'bg-success' : 'bg-primary';

export const scoreText = (score: number) =>
  score < WEAK_TOPIC_THRESHOLD ? 'text-warning' : score >= 80 ? 'text-success' : 'text-primary';

export function ProgressBar({ value, className, tone }: { value: number; className?: string; tone?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-surface-muted', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}>
      <div className={cn('h-full rounded-full transition-[width] duration-500', tone ?? scoreTone(pct))} style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Circular score, used on quiz results. */
export function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const r = 45;
  const c = 2 * Math.PI * r;
  const stroke = score < WEAK_TOPIC_THRESHOLD ? 'var(--warning)' : score >= 80 ? 'var(--success)' : 'var(--primary)';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90" aria-hidden>
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--surface-muted)" strokeWidth="8" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - score / 100)}
        style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.22,1,.36,1)' }}
      />
    </svg>
  );
}
