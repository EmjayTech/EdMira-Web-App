import Link from 'next/link';
import { ChevronRight, Target } from 'lucide-react';
import { cn } from '@/utils/cn';

export function StatTile({ value, label, icon, className }: { value: string; label: string; icon?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-border bg-surface p-4 sm:p-5', className)}>
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl font-extrabold tabular-nums text-primary sm:text-3xl">{value}</p>
        {icon}
      </div>
      <p className="mt-1 whitespace-pre-line text-sm leading-tight text-text-muted">{label}</p>
    </div>
  );
}

export function FocusBanner({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <Link href={href} className="group flex items-center gap-4 rounded-2xl bg-warning-soft p-4 transition-transform hover:-translate-y-0.5 sm:p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-black/5 text-warning dark:bg-black/25">
        <Target className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-on-warning-soft">{title}</span>
        <span className="block text-sm text-on-warning-soft/80">{body}</span>
      </span>
      <ChevronRight className="size-5 text-on-warning-soft/60 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
