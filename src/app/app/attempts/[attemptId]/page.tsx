'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookOpenText, CheckCircle2, Clock, MinusCircle, RotateCcw, Target, X, XCircle } from 'lucide-react';
import { getAttemptReview } from '@/data/learning/learningService';
import { WEAK_TOPIC_THRESHOLD } from '@/data/learning/progressMath';
import { fmt, plural, useTranslation } from '@/localization/useTranslation';
import type { TranslationKeys } from '@/types/localization';
import { useAsync } from '@/hooks/useAsync';
import { ButtonLink } from '@/components/ui/Button';
import { ScoreRing } from '@/components/ui/ProgressBar';
import { ErrorState, LoadingState } from '@/components/ui/States';

const verdict = (score: number, r: TranslationKeys['quizResult']) => {
  if (score >= 80) return { title: r.excellentTitle, text: r.excellentText };
  if (score >= WEAK_TOPIC_THRESHOLD) return { title: r.goodTitle, text: r.goodText };
  return { title: r.keepGoingTitle, text: r.keepGoingText };
};

/** Quiz results (mobile QuizResultScreen). */
export default function AttemptResultPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { t } = useTranslation();
  const { data, loading, error, reload } = useAsync(() => getAttemptReview(attemptId), [attemptId]);

  if (loading) return <LoadingState />;
  if (error || !data)
    return <ErrorState title={t.errors.title} message={error ?? t.errors.notFound} onRetry={reload} retryLabel={t.common.tryAgain} />;

  const { attempt } = data;
  const skipped = attempt.total - attempt.answeredCount;
  const incorrect = attempt.total - attempt.correctCount - skipped;
  const seconds = Math.max(0, Math.round((Date.parse(attempt.submittedAt) - Date.parse(attempt.startedAt)) / 1000));
  const time = seconds >= 60 ? fmt(t.quizResult.minSec, { m: Math.floor(seconds / 60), s: seconds % 60 }) : fmt(t.quizResult.sec, { s: seconds });
  const v = verdict(attempt.score, t.quizResult);
  const missed = attempt.total - attempt.correctCount;

  const stats = [
    { label: t.quizResult.correct, value: attempt.correctCount, icon: <CheckCircle2 className="size-5 text-success" /> },
    { label: t.quizResult.incorrect, value: incorrect, icon: <XCircle className="size-5 text-danger" /> },
    { label: t.quizResult.skipped, value: skipped, icon: <MinusCircle className="size-5 text-text-faint" /> },
    { label: t.quizResult.time, value: time, icon: <Clock className="size-5 text-primary" /> },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex justify-end">
        <Link href={`/app/topics/${attempt.topicId}`} aria-label={t.quizResult.close} className="grid size-10 place-items-center rounded-xl text-text-muted hover:bg-surface-muted">
          <X className="size-5" />
        </Link>
      </div>

      <section className="flex flex-col items-center text-center">
        <p className="text-sm font-semibold text-primary">{attempt.courseTitle}</p>
        <h1 className="mt-1 text-xl font-bold">{attempt.topicTitle}</h1>
        <div className="relative mt-8 grid place-items-center">
          <ScoreRing score={attempt.score} size={190} />
          <div className="absolute text-center">
            <p className="font-display text-5xl font-extrabold tabular-nums">{attempt.score}%</p>
            <p className="text-sm text-text-muted">{t.quizResult.yourScore}</p>
          </div>
        </div>
        <h2 className="mt-8 font-display text-3xl font-extrabold tracking-tight">{v.title}</h2>
        <p className="mt-2 text-text-muted">{v.text}</p>
      </section>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface p-4 text-center">
            <div className="flex justify-center">{s.icon}</div>
            <dd className="mt-2 font-display text-xl font-extrabold tabular-nums">{s.value}</dd>
            <dt className="text-xs text-text-muted">{s.label}</dt>
          </div>
        ))}
      </dl>

      {attempt.score < WEAK_TOPIC_THRESHOLD ? (
        <div className="mt-5 flex gap-3 rounded-2xl bg-warning-soft p-4 text-sm text-on-warning-soft">
          <Target className="mt-0.5 size-5 shrink-0 text-warning" />
          {fmt(t.quizResult.focusNote, { threshold: WEAK_TOPIC_THRESHOLD })}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3">
        <ButtonLink href={`/app/attempts/${attempt.id}/review`} size="lg" block>
          {t.quizResult.reviewAll}
        </ButtonLink>
        {missed > 0 && missed < attempt.total ? (
          <ButtonLink href={`/app/attempts/${attempt.id}/review?filter=missed`} variant="secondary" size="lg" block>
            {plural(missed, t.quizResult.reviewMissed)}
          </ButtonLink>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          <ButtonLink href={`/app/quiz/${attempt.topicId}`} variant="secondary" icon={<RotateCcw className="size-4" />}>
            {t.topic.practiseAgain}
          </ButtonLink>
          <ButtonLink href={`/app/topics/${attempt.topicId}`} variant="secondary" icon={<BookOpenText className="size-4" />}>
            {t.quizResult.studyNotes}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
