'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, ChevronRight, Circle } from 'lucide-react';
import { getCourse, getResources } from '@/data/learning/learningService';
import { courseNotesResource } from '@/data/learning/notesResources';
import { BACKEND } from '@/config/backend';
import { fmt, useTranslation } from '@/localization/useTranslation';
import { useAsync } from '@/hooks/useAsync';
import { useProgress } from '@/hooks/useProgress';
import { BackLink } from '@/components/app/BackLink';
import { MaterialsList } from '@/components/app/MaterialsList';
import { CourseBadge } from '@/components/ui/CourseBadge';
import { SectionTitle } from '@/components/ui/Card';
import { ProgressBar, scoreText } from '@/components/ui/ProgressBar';
import { ErrorState, LoadingState } from '@/components/ui/States';
import { cn } from '@/utils/cn';
import { lighten } from '@/utils/color';

/** The web version of the mobile CourseDetailScreen. */
export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { t } = useTranslation();
  const { data: course, loading, error, reload } = useAsync(() => getCourse(courseId), [courseId]);
  const resources = useAsync(() => getResources(courseId), [courseId]);
  const { performance } = useProgress();

  if (loading) return <LoadingState />;
  if (error || !course)
    return <ErrorState title={t.errors.title} message={error ?? t.errors.notFound} onRetry={reload} retryLabel={t.common.tryAgain} />;

  const perfById = new Map(performance.map(p => [p.topicId, p]));
  const practised = course.topics.filter(topic => perfById.has(topic.id)).length;
  const topicTitles = new Map(course.topics.map(tp => [tp.id, tp.title]));
  const materials = [
    // Server-built PDF of the course notes (needs the live backend).
    ...(!BACKEND.useMock.content && course.topics.length ? [courseNotesResource(course, t.materials.courseNotesPdf)] : []),
    ...[...(resources.data ?? [])].sort((a, b) => Number(!!a.topicId) - Number(!!b.topicId)),
  ];

  return (
    <div>
      <BackLink href="/app/courses">{t.courses.title}</BackLink>

      <header
        className="relative overflow-hidden rounded-3xl p-6 text-white sm:p-8"
        style={{ background: `linear-gradient(135deg, ${course.color} 0%, ${course.color} 45%, #0a1a44 100%)` }}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="self-start rounded-3xl ring-4 ring-white/20 sm:self-auto">
            <CourseBadge code={course.code} color={lighten(course.color, 0.15)} size="lg" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{course.title}</h1>
            <p className="mt-2 max-w-2xl text-white/80">{course.description}</p>
          </div>
        </div>
        <div className="mt-6 max-w-md">
          <div className="flex justify-between text-sm font-medium text-white/80">
            <span>{t.courseDetail.topicsPractised}</span>
            <span>{fmt(t.courseDetail.xOfY, { x: practised, y: course.topics.length })}</span>
          </div>
          <ProgressBar
            value={course.topics.length ? (practised / course.topics.length) * 100 : 0}
            tone="bg-mint"
            className="mt-2 bg-white/20"
          />
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="min-w-0">
          <SectionTitle>{t.courseDetail.topics}</SectionTitle>
          <ol className="flex flex-col gap-3">
            {course.topics.map(topic => {
              const perf = perfById.get(topic.id);
              return (
                <li key={topic.id}>
                  <Link
                    href={`/app/topics/${topic.id}`}
                    aria-label={fmt(t.courseDetail.topicA11y, { order: topic.order, title: topic.title })}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-[box-shadow,border] hover:border-primary/30 hover:shadow-card">
                    <span
                      className={cn(
                        'grid size-10 shrink-0 place-items-center rounded-xl font-display font-extrabold',
                        perf ? 'bg-success-soft text-success' : 'bg-surface-muted text-text-muted',
                      )}>
                      {perf ? <CheckCircle2 className="size-5" /> : topic.order}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-text">{topic.title}</span>
                      <span className="mt-0.5 block truncate text-sm text-text-muted">{topic.summary}</span>
                      <span className="mt-1.5 flex items-center gap-3 text-xs">
                        <span className="text-text-faint">{fmt(t.learn.minRead, { count: topic.readMinutes })}</span>
                        {perf ? (
                          <span className={cn('font-semibold', scoreText(perf.bestScore))}>
                            {fmt(t.courseDetail.best, { score: perf.bestScore })}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-text-faint">
                            <Circle className="size-2.5" /> {t.courseDetail.notStarted}
                          </span>
                        )}
                      </span>
                    </span>
                    <ChevronRight className="size-5 shrink-0 text-text-faint transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        {materials.length ? (
          <section className="min-w-0">
            <SectionTitle>{t.materials.title}</SectionTitle>
            <MaterialsList resources={materials} topicTitles={topicTitles} />
          </section>
        ) : null}
      </div>
    </div>
  );
}
