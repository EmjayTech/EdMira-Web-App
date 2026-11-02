'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Check, Flag, RotateCcw, X } from 'lucide-react';
import { getAttemptReview } from '@/data/learning/learningService';
import { fmt, useTranslation } from '@/localization/useTranslation';
import { useAsync } from '@/hooks/useAsync';
import { BackLink } from '@/components/app/BackLink';
import { ReportQuestionModal } from '@/components/app/ReportQuestionModal';
import { ButtonLink } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { cn } from '@/utils/cn';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/** Every question with the student's answer, the correct one and the explanation (mobile QuizReviewScreen). */
export function ReviewView() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'missed'>(useSearchParams().get('filter') === 'missed' ? 'missed' : 'all');
  const [reportTarget, setReportTarget] = useState<{ questionId: string; topicId: string } | null>(null);
  const { data, loading, error, reload } = useAsync(() => getAttemptReview(attemptId), [attemptId]);

  if (loading) return <LoadingState />;
  if (error || !data)
    return <ErrorState title={t.errors.title} message={error ?? t.errors.notFound} onRetry={reload} retryLabel={t.common.tryAgain} />;

  const { attempt, questions } = data;
  const answerById = new Map(attempt.answers.map(a => [a.questionId, a]));
  const items = questions.map((q, i) => ({ q, n: i + 1, answer: answerById.get(q.id) }));
  const missed = items.filter(i => !i.answer?.correct);
  const shown = filter === 'missed' ? missed : items;

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href={`/app/attempts/${attempt.id}`}>{t.quizResult.yourScore}</BackLink>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">{t.quizReview.title}</h1>
      <p className="mt-1 text-text-muted">
        {attempt.topicTitle} · {attempt.score}%
      </p>

      <div className="mt-5 flex gap-2">
        <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>
          {fmt(t.quizReview.all, { count: items.length })}
        </Chip>
        <Chip selected={filter === 'missed'} onClick={() => setFilter('missed')}>
          {fmt(t.quizReview.missed, { count: missed.length })}
        </Chip>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {!shown.length ? (
          <EmptyState title={t.quizReview.nothingMissedTitle} body={t.quizReview.nothingMissedBody} />
        ) : (
          shown.map(({ q, n, answer }) => {
            const selected = answer?.selectedIndex ?? null;
            return (
              <article key={q.id} className="rounded-3xl border border-border bg-surface p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold',
                      answer?.correct ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
                    )}>
                    {answer?.correct ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                    {fmt(t.quizReview.question, { n })}
                  </span>
                  <button
                    onClick={() => setReportTarget({ questionId: q.id, topicId: q.topicId })}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-text-muted hover:bg-surface-muted hover:text-text"
                    aria-label={t.quizReview.reportIssue}>
                    <Flag className="size-3.5" /> <span className="hidden sm:inline">{t.quizReview.reportIssue}</span>
                  </button>
                </div>
                <h2 className="mt-4 text-lg font-semibold leading-snug">{q.stem}</h2>
                <ul className="mt-4 flex flex-col gap-2">
                  {q.options.map((option, i) => {
                    const isCorrect = i === q.answerIndex;
                    const isMine = i === selected;
                    return (
                      <li
                        key={i}
                        className={cn(
                          'flex items-center gap-3 rounded-xl border px-4 py-3 text-[15px]',
                          isCorrect
                            ? 'border-success/40 bg-success-soft font-semibold text-success'
                            : isMine
                            ? 'border-danger/40 bg-danger-soft text-danger'
                            : 'border-border text-text-body',
                        )}>
                        <span
                          className={cn(
                            'grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold',
                            isCorrect ? 'bg-success text-white dark:text-[#052e16]' : isMine ? 'bg-danger text-white dark:text-[#450a0a]' : 'bg-surface-muted text-text-muted',
                          )}>
                          {LETTERS[i]}
                        </span>
                        <span className="flex-1">{option}</span>
                        {isCorrect ? <span className="text-xs font-semibold">{t.quizReview.correctAnswer}</span> : null}
                        {isMine && !isCorrect ? <span className="text-xs font-semibold">{t.quizReview.yourAnswer}</span> : null}
                      </li>
                    );
                  })}
                </ul>
                {selected === null ? <p className="mt-3 text-sm font-medium text-text-muted">{t.quizResult.skipped}</p> : null}
                {q.explanation ? (
                  <div className="mt-4 rounded-2xl bg-primary-soft p-4">
                    <p className="text-xs font-bold tracking-[0.14em] text-primary">{t.quizReview.explanation}</p>
                    <p className="mt-2 leading-relaxed text-text-body">{q.explanation}</p>
                  </div>
                ) : null}
              </article>
            );
          })
        )}
      </div>

      <ButtonLink href={`/app/quiz/${attempt.topicId}`} size="lg" block className="mt-8" icon={<RotateCcw className="size-4" />}>
        {t.quizReview.practiseAgain}
      </ButtonLink>

      <ReportQuestionModal target={reportTarget} onClose={() => setReportTarget(null)} />
    </div>
  );
}
