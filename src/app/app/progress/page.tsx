'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, Flame, Info, LineChart, PartyPopper, Target } from 'lucide-react';
import { WEAK_TOPIC_THRESHOLD } from '@/data/learning/progressMath';
import { fmt, plural, useTranslation } from '@/localization/useTranslation';
import { useFormatDate } from '@/hooks/useFormatDate';
import { useProgress } from '@/hooks/useProgress';
import { StatTile } from '@/components/app/Stats';
import { ButtonLink, Button } from '@/components/ui/Button';
import { SectionTitle } from '@/components/ui/Card';
import { ProgressBar, scoreText } from '@/components/ui/ProgressBar';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';
import { cn } from '@/utils/cn';

const HISTORY_PAGE = 10;

/** The web version of the mobile ProgressScreen. */
export default function ProgressPage() {
  const { t } = useTranslation();
  const { withTime } = useFormatDate();
  const { attempts, performance, weakTopics, summary, loading, error, reload } = useProgress();
  const [historyCount, setHistoryCount] = useState(HISTORY_PAGE);

  const header = (
    <header className="mb-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{t.progress.title}</h1>
      <p className="mt-1.5 text-text-muted">{t.progress.subtitle}</p>
    </header>
  );

  if (loading)
    return (
      <div>
        {header}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map(i => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  if (error)
    return (
      <div>
        {header}
        <ErrorState title={t.errors.title} message={error} onRetry={reload} retryLabel={t.common.tryAgain} />
      </div>
    );
  if (!attempts.length)
    return (
      <div>
        {header}
        <EmptyState
          icon={<LineChart className="size-7" />}
          title={t.progress.emptyTitle}
          body={t.progress.emptyBody}
          action={<ButtonLink href="/app/courses">{t.progress.browseCourses}</ButtonLink>}
        />
      </div>
    );

  const byTopic = [...performance].sort((a, b) => b.lastAttemptAt.localeCompare(a.lastAttemptAt));

  return (
    <div className="flex flex-col gap-10">
      <div>
        {header}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatTile value={String(summary.quizzesTaken)} label={t.progress.quizzesTaken} />
          <StatTile value={summary.averageScore === null ? '—' : `${summary.averageScore}%`} label={t.progress.averageScore} />
          <StatTile value={String(summary.questionsAnswered)} label={t.progress.questionsAnswered} />
          <StatTile
            value={String(summary.streakDays)}
            label={plural(summary.streakDays, t.progress.dayStreak)}
            icon={<Flame className={cn('size-6', summary.streakDays ? 'text-orange-500' : 'text-text-faint')} />}
          />
        </div>
      </div>

      <section id="focus" className="scroll-mt-24">
        <SectionTitle>{t.progress.focusAreas}</SectionTitle>
        <p className="-mt-1 mb-4 flex gap-2 text-sm text-text-muted">
          <Info className="mt-0.5 size-4 shrink-0" />
          {fmt(t.progress.focusExplainer, { threshold: WEAK_TOPIC_THRESHOLD })}
        </p>
        {weakTopics.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {weakTopics.map(p => (
              <Link
                key={p.topicId}
                href={`/app/topics/${p.topicId}`}
                aria-label={fmt(t.progress.weakTopicA11y, { topic: p.topicTitle, score: p.averageScore })}
                className="group rounded-2xl border border-warning/30 bg-warning-soft p-5 transition-transform hover:-translate-y-0.5">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 size-5 shrink-0 text-warning" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-on-warning-soft">{p.topicTitle}</p>
                    <p className="text-sm text-on-warning-soft/75">{p.courseTitle}</p>
                  </div>
                  <span className="font-display text-xl font-extrabold text-warning">{p.averageScore}%</span>
                </div>
                <ProgressBar value={p.averageScore} tone="bg-warning" className="mt-3 bg-black/10 dark:bg-white/10" />
                <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-on-warning-soft">
                  {t.progress.revisitCta} <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-4 rounded-2xl bg-success-soft p-5">
            <PartyPopper className="size-6 shrink-0 text-success" />
            <div>
              <p className="font-bold text-text">{t.progress.noWeakTitle}</p>
              <p className="text-sm text-text-muted">{fmt(t.progress.noWeakBody, { threshold: WEAK_TOPIC_THRESHOLD })}</p>
            </div>
          </div>
        )}
      </section>

      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <SectionTitle>{t.progress.byTopic}</SectionTitle>
          <ul className="divide-y divide-divider overflow-hidden rounded-2xl border border-border bg-surface">
            {byTopic.map(p => (
              <li key={p.topicId}>
                <Link href={`/app/topics/${p.topicId}`} className="block px-5 py-4 hover:bg-surface-muted">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-semibold">{p.topicTitle}</p>
                    <span className={cn('font-bold tabular-nums', scoreText(p.averageScore))}>{p.averageScore}%</span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-text-muted">
                    {fmt(t.progress.topicMeta, { course: p.courseTitle, best: p.bestScore, attempts: plural(p.attempts, t.learn.attempts) })}
                  </p>
                  <ProgressBar value={p.averageScore} className="mt-2 h-1.5" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-text-faint">{t.progress.footnote}</p>
        </section>

        <section>
          <SectionTitle>{t.progress.history}</SectionTitle>
          <ul className="divide-y divide-divider overflow-hidden rounded-2xl border border-border bg-surface">
            {attempts.slice(0, historyCount).map(a => (
              <li key={a.id}>
                <Link href={`/app/attempts/${a.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-muted">
                  <span className={cn('grid size-12 shrink-0 place-items-center rounded-xl bg-surface-muted font-display text-sm font-extrabold', scoreText(a.score))}>
                    {a.score}%
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{a.topicTitle}</span>
                    <span className="block truncate text-sm text-text-muted">
                      {fmt(t.progress.correctOf, { correct: a.correctCount, total: a.total })} · {withTime(a.submittedAt)}
                    </span>
                  </span>
                  <ChevronRight className="size-5 text-text-faint" />
                </Link>
              </li>
            ))}
          </ul>
          {attempts.length > historyCount ? (
            <Button variant="ghost" block className="mt-2" onClick={() => setHistoryCount(c => c + HISTORY_PAGE)}>
              {t.progress.showMore}
            </Button>
          ) : null}
        </section>
      </div>
    </div>
  );
}
