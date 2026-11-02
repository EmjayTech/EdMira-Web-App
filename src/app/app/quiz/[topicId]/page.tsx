'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Flag, HelpCircle, X } from 'lucide-react';
import { friendlyError } from '@/api/errors';
import { getQuizQuestions, getTopic, submitQuiz } from '@/data/learning/learningService';
import { fmt, plural, useTranslation } from '@/localization/useTranslation';
import { useAsync } from '@/hooks/useAsync';
import { ReportQuestionModal } from '@/components/app/ReportQuestionModal';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState, ErrorBanner, ErrorState, LoadingState } from '@/components/ui/States';
import { cn } from '@/utils/cn';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * Full-screen practice quiz (mobile QuizScreen). Answers stay on this page
 * until Submit; the server grades the attempt. A failed submit keeps every
 * answer so the student can just try again.
 */
export default function QuizPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const router = useRouter();
  const { t, w } = useTranslation();
  const { data, loading, error, reload } = useAsync(
    () => Promise.all([getQuizQuestions(topicId), getTopic(topicId)]),
    [topicId],
  );
  const questions = useMemo(() => data?.[0] ?? [], [data]);
  const detail = data?.[1];

  const startedAt = useRef(new Date().toISOString());
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmUnanswered, setConfirmUnanswered] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ questionId: string; topicId: string } | null>(null);
  const submittedRef = useRef(false);

  const question = questions[index];
  const answeredCount = Object.keys(answers).length;
  const unanswered = questions.filter(q => answers[q.id] === undefined);
  const isLast = index === questions.length - 1;

  // Warn before closing the tab with answers in progress.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (answeredCount && !submittedRef.current) e.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [answeredCount]);

  const choose = useCallback(
    (optionIndex: number) => {
      if (!question || optionIndex >= question.options.length) return;
      setAnswers(prev => ({ ...prev, [question.id]: optionIndex }));
    },
    [question],
  );

  const submit = useCallback(async () => {
    setConfirmUnanswered(false);
    setSubmitting(true);
    setSubmitError(null);
    try {
      const attempt = await submitQuiz({
        topicId,
        startedAt: startedAt.current,
        answers: questions.map(q => ({ questionId: q.id, selectedIndex: answers[q.id] ?? null })),
      });
      submittedRef.current = true;
      router.replace(`/app/attempts/${attempt.id}`);
    } catch (e) {
      setSubmitError(friendlyError(e));
      setSubmitting(false);
    }
  }, [answers, questions, router, topicId]);

  const trySubmit = useCallback(() => {
    if (unanswered.length) setConfirmUnanswered(true);
    else submit();
  }, [unanswered.length, submit]);

  // Keyboard: 1–6 / A–F choose, ← → move, Enter = next / submit.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || document.querySelector('dialog[open]')) return;
      if (/input|textarea/i.test((e.target as HTMLElement).tagName)) return;
      const k = e.key.toUpperCase();
      if (/^[1-6]$/.test(k)) choose(Number(k) - 1);
      else if (LETTERS.includes(k)) choose(LETTERS.indexOf(k));
      else if (e.key === 'ArrowRight' && !isLast) setIndex(i => i + 1);
      else if (e.key === 'ArrowLeft' && index > 0) setIndex(i => i - 1);
      else if (e.key === 'Enter' && question && answers[question.id] !== undefined) {
        if (isLast) trySubmit();
        else setIndex(i => i + 1);
      } else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose, index, isLast, question, answers, trySubmit]);

  const exit = () => (answeredCount ? setConfirmLeave(true) : router.push(`/app/topics/${topicId}`));

  if (loading) return <LoadingState label={t.quiz.preparing} />;
  if (error)
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <ErrorState title={t.errors.title} message={error} onRetry={reload} retryLabel={t.common.tryAgain} />
      </div>
    );
  if (!questions.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <EmptyState
          icon={<HelpCircle className="size-7" />}
          title={t.quiz.noQuestionsTitle}
          body={t.quiz.noQuestionsBody}
          action={<ButtonLink href={`/app/topics/${topicId}`}>{t.quiz.backToTopic}</ButtonLink>}
        />
      </div>
    );

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-4">
          <button onClick={exit} aria-label={t.quiz.exit} className="grid size-10 place-items-center rounded-xl text-text-muted hover:bg-surface-muted">
            <X className="size-5" />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-xs text-text-muted">{detail?.topic.title}</p>
            <p className="text-sm font-bold">{fmt(t.quiz.questionOf, { current: index + 1, total: questions.length })}</p>
          </div>
          <button
            onClick={() => setReportTarget({ questionId: question.id, topicId })}
            aria-label={t.quiz.report}
            title={t.quiz.report}
            className="grid size-10 place-items-center rounded-xl text-text-muted hover:bg-surface-muted">
            <Flag className="size-5" />
          </button>
        </div>
        <div className="h-1 bg-surface-muted">
          <div className="h-full bg-action transition-[width] duration-300" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 pb-36 pt-6">
        {/* Question dots */}
        <nav className="flex flex-wrap justify-center gap-2" aria-label={t.quiz.questionOf}>
          {questions.map((q, i) => {
            const answered = answers[q.id] !== undefined;
            return (
              <button
                key={q.id}
                onClick={() => setIndex(i)}
                aria-label={fmt(answered ? t.quiz.dotAnswered : t.quiz.dot, { n: i + 1 })}
                aria-current={i === index ? 'step' : undefined}
                className={cn(
                  'grid size-9 place-items-center rounded-full border-2 text-sm font-semibold transition-colors',
                  i === index
                    ? 'border-action bg-action text-on-action'
                    : answered
                    ? 'border-primary/40 bg-primary-soft text-primary'
                    : 'border-border text-text-muted hover:border-primary/40',
                )}>
                {i + 1}
              </button>
            );
          })}
        </nav>

        <div key={question.id} className="mt-8 animate-fade-up">
          <h1 className="text-xl font-bold leading-snug sm:text-2xl">{question.stem}</h1>
          <div className="mt-6 flex flex-col gap-3" role="radiogroup" aria-label={question.stem}>
            {question.options.map((option, i) => {
              const selected = answers[question.id] === i;
              return (
                <button
                  key={i}
                  role="radio"
                  aria-checked={selected}
                  aria-label={fmt(t.quiz.optionA11y, { letter: LETTERS[i], option })}
                  onClick={() => choose(i)}
                  className={cn(
                    'flex items-center gap-4 rounded-2xl border-2 px-4 py-4 text-left text-[16px] transition-[border,background,transform] active:scale-[0.99]',
                    selected ? 'border-primary bg-primary-soft font-semibold text-text' : 'border-border bg-surface hover:border-primary/40',
                  )}>
                  <span
                    className={cn(
                      'grid size-9 shrink-0 place-items-center rounded-xl text-sm font-bold',
                      selected ? 'bg-action text-on-action' : 'bg-surface-muted text-text-muted',
                    )}>
                    {LETTERS[i]}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
          <p className="mt-6 hidden text-center text-xs text-text-faint sm:block">{w.app.keyboardHint}</p>
        </div>

        {submitError ? (
          <div className="mt-6">
            <ErrorBanner message={`${t.quiz.submitFailedTitle}. ${t.quiz.submitFailedBody}\n${submitError}`} />
          </div>
        ) : null}
      </main>

      {/* Footer controls */}
      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Button variant="secondary" onClick={() => setIndex(i => i - 1)} disabled={index === 0} icon={<ArrowLeft className="size-4" />}>
            <span className="hidden sm:inline">{t.quiz.previous}</span>
          </Button>
          <p className="flex-1 text-center text-xs text-text-muted">
            {answeredCount}/{questions.length}
          </p>
          {isLast ? (
            <Button onClick={trySubmit} loading={submitting} className="min-w-32">
              {t.quiz.submit}
            </Button>
          ) : (
            <Button onClick={() => setIndex(i => i + 1)} className="min-w-32">
              {t.common.next} <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </footer>

      <Modal
        open={confirmUnanswered}
        onClose={() => setConfirmUnanswered(false)}
        size="sm"
        title={plural(unanswered.length, t.quiz.unansweredTitle)}
        description={t.quiz.unansweredBody}
        closeLabel={t.common.close}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmUnanswered(false);
                setIndex(questions.findIndex(q => q.id === unanswered[0]?.id));
              }}>
              {t.quiz.goToUnanswered}
            </Button>
            <Button onClick={submit}>{t.quiz.submit}</Button>
          </>
        }
      />

      <Modal
        open={confirmLeave}
        onClose={() => setConfirmLeave(false)}
        size="sm"
        title={t.quiz.leaveTitle}
        description={t.quiz.leaveBody}
        closeLabel={t.common.close}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmLeave(false)}>
              {t.quiz.keepGoing}
            </Button>
            <Button variant="danger" onClick={() => router.push(`/app/topics/${topicId}`)}>
              {t.quiz.leave}
            </Button>
          </>
        }
      />

      <ReportQuestionModal target={reportTarget} onClose={() => setReportTarget(null)} />
    </div>
  );
}
