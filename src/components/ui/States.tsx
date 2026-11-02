import { ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn('animate-spin', className ?? 'size-5')} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-surface-muted', className)} aria-hidden />;
}

export function LoadingState({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-text-muted" role="status">
      <Spinner className="size-7 text-primary" />
      {label ? <p className="text-sm">{label}</p> : <span className="sr-only">Loading</span>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center',
        className,
      )}>
      {icon ? (
        <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">{icon}</div>
      ) : null}
      <h3 className="text-lg font-bold text-text">{title}</h3>
      {body ? <p className="mt-2 max-w-md text-sm leading-relaxed text-text-muted">{body}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title,
  message,
  onRetry,
  retryLabel,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-surface px-6 py-12 text-center" role="alert">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-danger-soft text-danger">
        <AlertCircle className="size-7" />
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-text-muted">{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-action px-5 py-2.5 text-sm font-semibold text-on-action hover:bg-action-hover">
          <RefreshCw className="size-4" /> {retryLabel}
        </button>
      ) : null}
    </div>
  );
}

export function ErrorBanner({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-danger/25 bg-danger-soft px-4 py-3 text-sm text-danger">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <p className="whitespace-pre-line">{message}</p>
    </div>
  );
}

export function InfoBanner({ children, tone = 'warning' }: { children: ReactNode; tone?: 'warning' | 'info' }) {
  return (
    <div
      className={cn(
        'rounded-xl px-4 py-3 text-sm',
        tone === 'warning' ? 'bg-warning-soft text-on-warning-soft' : 'bg-primary-soft text-primary',
      )}>
      {children}
    </div>
  );
}
