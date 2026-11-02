'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookOpenText, Clock, HelpCircle, Play, RotateCcw } from 'lucide-react';
import { getResources, getTopic } from '@/data/learning/learningService';
import { topicNotesResource } from '@/data/learning/notesResources';
import { BACKEND } from '@/config/backend';
import { fmt, plural, useTranslation } from '@/localization/useTranslation';
import { useAsync } from '@/hooks/useAsync';
import { useFormatDate } from '@/hooks/useFormatDate';
import { useProgress } from '@/hooks/useProgress';
import { BackLink } from '@/components/app/BackLink';
import { MaterialsList } from '@/components/app/MaterialsList';
import { ButtonLink } from '@/components/ui/Button';
import { CourseBadge } from '@/components/ui/CourseBadge';
import { ProgressBar, scoreText } from '@/components/ui/ProgressBar';
import { ErrorState, LoadingState } from '@/components/ui/States';
import { cn } from '@/utils/cn';

/** Study notes for a topic + the practice call-to-action (mobile TopicScreen). */
export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const { t, w } = useTranslation();
  const { short } = useFormatDate();
  const { data, loading, error, reload } = useAsync(() => getTopic(topicId), [topicId]);
  const courseId = data?.course.id;
  const resources = useAsync(() => (courseId ? getResources(courseId) : Promise.resolve([])), [courseId]);
  const { attempts } = useProgress();
  const [activeSection, setActiveSection] = useState(0);

  // Highlight the section being read in the outline.
  useEffect(() => {
    if (!data) return;
    const headings = [...document.querySelectorAll<HTMLElement>('[data-section]')];
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSection(Number((visible.target as HTMLElement).dataset.section));
      },
      { rootMargin: '-80px 0px -60% 0px' },
    );
    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, [data]);

  if (loading) return <LoadingState />;
  if (error || !data)
    return <ErrorState title={t.errors.title} message={error ?? t.errors.notFound} onRetry={reload} retryLabel={t.common.tryAgain} />;

  const { topic, course, questionCount } = data;
  const topicAttempts = attempts.filter(a => a.topicId === topicId);
  const best = topicAttempts.length ? Math.max(...topicAttempts.map(a => a.score)) : null;
  const materials = [
    ...(!BACKEND.useMock.content && topic.material.length ? [topicNotesResource(topic, course.id, t.materials.topicNotesPdf)] : []),
    ...(resources.data ?? []).filter(r => r.topicId === topicId),
  ];

  const practiceCard = (
    <div className="rounded-3xl bg-hero p-6 text-on-hero">
      <div className="grid size-11 place-items-center rounded-xl bg-white/10 text-accent">
        <HelpCircle className="size-5" />
      </div>
      <h2 className="mt-4 text-xl font-bold">{t.topic.readyTitle}</h2>
      <p className="mt-2 text-sm text-white/75">
        {questionCount ? plural(questionCount, t.topic.readyBody) : t.quiz.noQuestionsBody}
      </p>
      {questionCount ? (
        <ButtonLink href={`/app/quiz/${topic.id}`} variant="hero" block className="mt-5" icon={topicAttempts.length ? <RotateCcw className="size-4" /> : <Play className="size-4 fill-current" />}>
          {topicAttempts.length ? t.topic.practiseAgain : plural(questionCount, t.topic.startPractice)}
        </ButtonLink>
      ) : null}
      {topicAttempts.length && best !== null ? (
        <div className="mt-5 border-t border-white/15 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/60">{t.topic.yourPractice}</p>
          <p className="mt-1 text-sm text-white/85">
            {fmt(t.topic.attemptsLast, {
              attempts: plural(topicAttempts.length, t.learn.attempts),
              date: short(topicAttempts[0].submittedAt),
            })}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <ProgressBar value={best} className="bg-white/15" />
            <span className="text-sm font-bold">{best}%</span>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <div>
      <BackLink href={`/app/courses/${course.id}`}>{course.title}</BackLink>

      <header className="flex items-start gap-4">
        <CourseBadge code={course.code} color={course.color} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">{course.title}</p>
          <h1 className="mt-0.5 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{topic.title}</h1>
          <p className="mt-2 max-w-2xl text-text-muted">{topic.summary}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" /> {fmt(t.learn.minRead, { count: topic.readMinutes })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <HelpCircle className="size-4" /> {plural(questionCount, t.topic.practiceQuestions)}
            </span>
            {best !== null ? <span className={cn('font-semibold', scoreText(best))}>{fmt(t.courseDetail.best, { score: best })}</span> : null}
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0">
          <div className="lg:hidden">{practiceCard}</div>
          <div className="mt-8 flex flex-col gap-6 lg:mt-0">
            {topic.material.map((section, i) => (
              <section key={i} data-section={i} id={`section-${i}`} className="scroll-mt-24 rounded-3xl border border-border bg-surface p-6 sm:p-8">
                <h2 className="text-xl font-bold tracking-tight">{section.heading}</h2>
                {section.body.split(/\n\s*\n/).map((para, j) => (
                  <p key={j} className="mt-3 text-[16.5px] leading-[1.75] text-text-body">
                    {para}
                  </p>
                ))}
                {section.keyPoints?.length ? (
                  <div className="mt-5 rounded-2xl bg-primary-soft p-5">
                    <p className="text-xs font-bold tracking-[0.14em] text-primary">{t.topic.keyPoints}</p>
                    <ul className="mt-3 space-y-2">
                      {section.keyPoints.map((point, k) => (
                        <li key={k} className="flex gap-2.5 text-[15px] text-text-body">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>
            ))}
          </div>
          {materials.length ? (
            <section className="mt-10">
              <h2 className="mb-3 text-lg font-bold">{t.materials.forTopic}</h2>
              <MaterialsList resources={materials} />
            </section>
          ) : null}
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-6">
            {practiceCard}
            {topic.material.length > 1 ? (
              <nav aria-label={topic.title} className="rounded-3xl border border-border bg-surface p-5">
                <p className="flex items-center gap-2 text-sm font-bold">
                  <BookOpenText className="size-4 text-primary" /> {w.app.studyThenPractise}
                </p>
                <ol className="mt-3 space-y-1">
                  {topic.material.map((section, i) => (
                    <li key={i}>
                      <a
                        href={`#section-${i}`}
                        className={cn(
                          'block rounded-lg border-l-2 px-3 py-1.5 text-sm transition-colors',
                          activeSection === i ? 'border-primary bg-primary-soft font-semibold text-primary' : 'border-transparent text-text-muted hover:text-text',
                        )}>
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
