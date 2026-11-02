'use client';

import Link from 'next/link';
import { Play, Target } from 'lucide-react';
import type { Course, Topic } from '@/data/learning/types';
import { fmt, useTranslation } from '@/localization/useTranslation';
import { CourseBadge } from '@/components/ui/CourseBadge';
import { ProgressBar, scoreText } from '@/components/ui/ProgressBar';
import { cn } from '@/utils/cn';

export interface TopicCardData {
  topic: Topic;
  course: Course;
  bestScore?: number;
  lastScore?: number;
  attempts?: number;
  weak?: boolean;
}

/** "Continue learning" card: open the notes, or press play to start the quiz. */
export function ContinueCard({ item }: { item: TopicCardData }) {
  const { t } = useTranslation();
  const score = item.bestScore;
  return (
    <div className="group relative flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-shadow hover:shadow-card">
      <CourseBadge code={item.course.code} color={item.course.color} />
      <Link href={`/app/topics/${item.topic.id}`} className="min-w-0 flex-1 after:absolute after:inset-0">
        <p className="truncate font-bold text-text">{item.topic.title}</p>
        <p className="truncate text-sm text-text-muted">{item.course.title}</p>
        {score !== undefined ? (
          <div className="mt-2 flex items-center gap-2">
            <ProgressBar value={score} className="h-1.5" />
            <span className={cn('text-xs font-bold tabular-nums', scoreText(score))}>{score}%</span>
          </div>
        ) : (
          <p className="mt-1 text-xs font-medium text-primary">{fmt(t.learn.minRead, { count: item.topic.readMinutes })}</p>
        )}
      </Link>
      <Link
        href={`/app/quiz/${item.topic.id}`}
        aria-label={fmt(t.home.startPractice, { topic: item.topic.title })}
        className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full bg-action text-on-action shadow-[0_8px_20px_-8px_var(--action)] transition-transform hover:scale-105">
        <Play className="size-5 fill-current" />
      </Link>
    </div>
  );
}

/** Compact recommendation tile. */
export function RecommendedCard({ item }: { item: TopicCardData }) {
  const { t } = useTranslation();
  return (
    <Link
      href={`/app/topics/${item.topic.id}`}
      className="flex h-full flex-col rounded-2xl border border-border bg-surface p-4 transition-[box-shadow,border] hover:border-primary/30 hover:shadow-card">
      <div className="flex items-center justify-between">
        <CourseBadge code={item.course.code} color={item.course.color} size="sm" />
        {item.weak ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-semibold text-on-warning-soft">
            <Target className="size-3" /> {fmt(t.home.revisitAvg, { score: item.bestScore ?? 0 })}
          </span>
        ) : (
          <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">{t.learn.new}</span>
        )}
      </div>
      <p className="mt-4 line-clamp-2 font-bold leading-snug text-text">{item.topic.title}</p>
      <p className="mt-1 truncate text-sm text-text-muted">{item.course.title}</p>
      <p className="mt-auto pt-3 text-xs text-text-faint">{fmt(t.learn.minRead, { count: item.topic.readMinutes })}</p>
    </Link>
  );
}
