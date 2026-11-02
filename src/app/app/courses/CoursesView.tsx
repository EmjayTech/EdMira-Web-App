'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronRight, GraduationCap, Search, X } from 'lucide-react';
import { searchContent } from '@/data/learning/learningService';
import type { CourseWithTopics } from '@/data/learning/types';
import { fmt, plural, useTranslation } from '@/localization/useTranslation';
import { useSession } from '@/session/SessionProvider';
import { levelNumber } from '@/utils/format';
import { useAsync } from '@/hooks/useAsync';
import { useLevelLabel } from '@/hooks/useLevelLabel';
import { useProgress } from '@/hooks/useProgress';
import { CourseBadge } from '@/components/ui/CourseBadge';
import { Chip } from '@/components/ui/Chip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';
import { Button } from '@/components/ui/Button';

/** The web version of the mobile CoursesScreen (search, For you / All). */
export function CoursesView() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useSession();
  const levelLabel = useLevelLabel();
  const { performance } = useProgress();
  const [input, setInput] = useState(params.get('q') ?? '');
  const [query, setQuery] = useState(input);
  const [scope, setScope] = useState<'forYou' | 'all'>('forYou');

  // Debounce typing, and keep ?q= in the URL so results can be shared / reloaded.
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(input);
      const q = input.trim();
      router.replace(q ? `/app/courses?q=${encodeURIComponent(q)}` : '/app/courses', { scroll: false });
    }, 250);
    return () => clearTimeout(id);
  }, [input, router]);

  // A new ?q= from elsewhere (e.g. the top-bar search) replaces what's typed.
  const urlQuery = params.get('q') ?? '';
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery);
  if (urlQuery !== lastUrlQuery) {
    setLastUrlQuery(urlQuery);
    if (input.trim() !== urlQuery) setInput(urlQuery);
  }

  const { data, loading, error, reload } = useAsync(() => searchContent(query), [query]);
  const searching = !!query.trim();
  const level = user?.studentProfile?.level;
  const isPostgrad = !!level && !levelNumber(level);
  const practisedIds = useMemo(() => new Set(performance.map(p => p.topicId)), [performance]);

  const courses = data?.courses ?? [];
  const showScope = !searching && !isPostgrad && courses.some(c => c.forYou) && courses.some(c => !c.forYou);
  const noneForYou = isPostgrad || !courses.some(c => c.forYou);
  const visible: CourseWithTopics[] =
    searching || scope === 'all' || noneForYou
      ? [...courses].sort((a, b) => Number(b.forYou) - Number(a.forYou))
      : courses.filter(c => c.forYou);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{t.courses.title}</h1>
        <p className="mt-1.5 text-text-muted">{t.courses.subtitle}</p>
      </header>

      <label className="flex h-13 items-center gap-3 rounded-2xl border border-border bg-surface px-4 shadow-card focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
        <Search className="size-5 text-text-faint" />
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t.courses.searchPlaceholder}
          aria-label={t.home.searchA11y}
          className="h-full flex-1 bg-transparent text-[15px] outline-none placeholder:text-text-faint"
        />
        {input ? (
          <button onClick={() => setInput('')} aria-label={t.courses.clearSearch} className="grid size-8 place-items-center rounded-lg text-text-muted hover:bg-surface-muted">
            <X className="size-4" />
          </button>
        ) : null}
      </label>

      {showScope ? (
        <div className="mt-5 flex gap-2">
          <Chip selected={scope === 'forYou'} onClick={() => setScope('forYou')}>
            {t.courses.forYouTab}
          </Chip>
          <Chip selected={scope === 'all'} onClick={() => setScope('all')}>
            {t.courses.allTab}
          </Chip>
        </div>
      ) : null}

      {!searching && !loading && noneForYou && courses.length ? (
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-primary-soft p-4 text-sm">
          <GraduationCap className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-text">{isPostgrad ? t.courses.postgradSoonTitle : t.courses.noneForYouTitle}</p>
            <p className="mt-0.5 text-text-muted">
              {isPostgrad ? t.courses.postgradSoonBody : fmt(t.courses.noneForYouBody, { level: levelLabel(level) || t.courses.otherLevel })}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map(i => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
        ) : error ? (
          <ErrorState title={t.errors.title} message={error} onRetry={reload} retryLabel={t.common.tryAgain} />
        ) : searching && !courses.length && !data?.topics.length ? (
          <EmptyState icon={<Search className="size-7" />} title={fmt(t.courses.noResultsTitle, { query: query.trim() })} body={t.courses.noResultsBody} />
        ) : (
          <div className="flex flex-col gap-8">
            {searching && data?.topics.length ? (
              <section>
                <h2 className="mb-3 text-xs font-bold tracking-[0.14em] text-text-faint">{t.courses.topicsLabel}</h2>
                <ul className="divide-y divide-divider overflow-hidden rounded-2xl border border-border bg-surface">
                  {data.topics.map(({ topic, course }) => (
                    <li key={topic.id}>
                      <Link href={`/app/topics/${topic.id}`} className="flex items-center gap-4 px-4 py-3.5 hover:bg-surface-muted">
                        <CourseBadge code={course.code} color={course.color} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold">{topic.title}</span>
                          <span className="block truncate text-sm text-text-muted">
                            {course.title} · {fmt(t.learn.minRead, { count: topic.readMinutes })}
                          </span>
                        </span>
                        <ChevronRight className="size-5 text-text-faint" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {visible.length ? (
              <section>
                {searching ? <h2 className="mb-3 text-xs font-bold tracking-[0.14em] text-text-faint">{t.courses.coursesLabel}</h2> : null}
                <div className="grid gap-4 md:grid-cols-2">
                  {visible.map(course => {
                    const practised = course.topics.filter(tp => practisedIds.has(tp.id)).length;
                    return (
                      <Link
                        key={course.id}
                        href={`/app/courses/${course.id}`}
                        className="group flex gap-4 rounded-2xl border border-border bg-surface p-5 transition-[box-shadow,border] hover:border-primary/30 hover:shadow-card">
                        <CourseBadge code={course.code} color={course.color} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-text">{course.title}</h3>
                            <ChevronRight className="size-5 shrink-0 text-text-faint transition-transform group-hover:translate-x-0.5" />
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-text-muted">{course.description}</p>
                          <p className="mt-3 text-xs font-medium text-text-muted">
                            {fmt(t.courses.cardMeta, {
                              topics: plural(course.topics.length, t.courses.topicCount),
                              practised: `${practised}/${course.topics.length}`,
                            })}
                          </p>
                          <ProgressBar
                            value={course.topics.length ? (practised / course.topics.length) * 100 : 0}
                            tone="bg-primary"
                            className="mt-2 h-1.5"
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ) : !searching ? (
              <EmptyState
                icon={<BookOpen className="size-7" />}
                title={t.courses.noCoursesTitle}
                body={t.courses.noCoursesBody}
                action={<Button variant="secondary" onClick={reload}>{t.home.checkAgain}</Button>}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
