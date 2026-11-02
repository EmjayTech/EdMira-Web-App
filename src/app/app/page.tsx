'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { BookOpen, ChevronRight, Flame, Search } from 'lucide-react';
import { getCourses } from '@/data/learning/learningService';
import { WEAK_TOPIC_THRESHOLD } from '@/data/learning/progressMath';
import type { Course, Topic } from '@/data/learning/types';
import { getLatestNews } from '@/data/news/newsService';
import { fmt, plural, useTranslation } from '@/localization/useTranslation';
import { useSession } from '@/session/SessionProvider';
import { useAsync } from '@/hooks/useAsync';
import { useLevelLabel } from '@/hooks/useLevelLabel';
import { useProgress } from '@/hooks/useProgress';
import { Avatar } from '@/components/app/Avatar';
import { NewsCard } from '@/components/app/NewsCard';
import { ContinueCard, RecommendedCard, TopicCardData } from '@/components/app/TopicRow';
import { FocusBanner, StatTile } from '@/components/app/Stats';
import { MedicalDisclaimerModal } from '@/components/app/MedicalDisclaimerModal';
import { SectionTitle } from '@/components/ui/Card';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';
import { Button } from '@/components/ui/Button';

/** The web version of the mobile HomeScreen. */
export default function HomePage() {
  const { t, w } = useTranslation();
  const { user } = useSession();
  const levelLabel = useLevelLabel();
  const courses = useAsync(getCourses, []);
  const news = useAsync(() => getLatestNews(), []);
  const { attempts, performance, weakTopics, summary, loading: progressLoading } = useProgress();

  /** Courses for the student's level etc.; everything if none match yet. */
  const myCourses = useMemo(() => {
    const all = courses.data ?? [];
    const mine = all.filter(c => c.forYou);
    return mine.length ? mine : all;
  }, [courses.data]);

  const topicIndex = useMemo(() => {
    const map = new Map<string, { topic: Topic; course: Course }>();
    (courses.data ?? []).forEach(course => course.topics.forEach(topic => map.set(topic.id, { topic, course })));
    return map;
  }, [courses.data]);

  const perfById = useMemo(() => new Map(performance.map(p => [p.topicId, p])), [performance]);

  /** Recently practised topics, or the first topic of each course for new students. */
  const continueItems: TopicCardData[] = useMemo(() => {
    const recent: TopicCardData[] = [];
    [...performance]
      .sort((a, b) => b.lastAttemptAt.localeCompare(a.lastAttemptAt))
      .forEach(p => {
        const entry = topicIndex.get(p.topicId);
        if (entry) recent.push({ ...entry, bestScore: p.bestScore, lastScore: p.lastScore, attempts: p.attempts });
      });
    if (recent.length) return recent.slice(0, 2);
    return myCourses
      .filter(c => c.topics.length)
      .slice(0, 2)
      .map(course => ({ topic: course.topics[0], course }));
  }, [performance, topicIndex, myCourses]);

  /** Weak topics first (to revisit), then topics not yet practised. */
  const recommended: TopicCardData[] = useMemo(() => {
    const continueIds = new Set(continueItems.map(i => i.topic.id));
    const weak: TopicCardData[] = [];
    weakTopics.forEach(wt => {
      const entry = topicIndex.get(wt.topicId);
      if (entry) weak.push({ ...entry, weak: true, bestScore: wt.averageScore });
    });
    const mine = new Set(myCourses.map(c => c.id));
    const fresh = [...topicIndex.values()].filter(e => mine.has(e.course.id) && !perfById.has(e.topic.id));
    return [...weak, ...fresh].filter(e => !continueIds.has(e.topic.id)).slice(0, 6);
  }, [weakTopics, topicIndex, perfById, continueItems, myCourses]);

  const academic = [levelLabel(user?.studentProfile?.level), user?.studentProfile?.department].filter(Boolean).join(', ');

  return (
    <div className="flex flex-col gap-10">
      <MedicalDisclaimerModal />

      {/* Welcome hero — same layout as the mobile header */}
      <section className="relative overflow-hidden rounded-3xl bg-hero p-6 text-on-hero sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(70%_120%_at_100%_0%,rgba(126,223,178,0.18),transparent_60%)]" />
        <div className="relative flex items-center gap-4">
          <Avatar user={user} className="size-14 border-2 border-white/40 bg-white/10 text-lg text-white" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-2xl font-extrabold sm:text-3xl">
              {user?.firstName ? fmt(t.home.welcomeName, { name: user.firstName }) : t.home.welcome}
            </h1>
            {academic ? <p className="mt-0.5 truncate text-sm font-medium text-accent sm:text-base">{academic}</p> : null}
          </div>
          <div
            className="flex items-center gap-1.5 rounded-2xl border border-hero-control-border bg-hero-control px-3.5 py-2 font-display text-lg font-extrabold"
            aria-label={plural(summary.streakDays, t.home.streakA11y)}
            title={plural(summary.streakDays, t.home.streakA11y)}>
            <Flame className="size-5 text-orange-400" /> {summary.streakDays}
          </div>
        </div>
        <Link
          href="/app/courses"
          className="relative mt-6 flex h-12 items-center gap-3 rounded-2xl border border-hero-control-border bg-hero-control px-4 text-white/70 transition-colors hover:text-white md:hidden">
          <Search className="size-4.5" /> {t.home.searchPlaceholder}
        </Link>
      </section>

      {/* Stats + focus */}
      <section className="grid gap-4">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {progressLoading ? (
            [0, 1, 2].map(i => <Skeleton key={i} className="h-24" />)
          ) : (
            <>
              <StatTile value={String(summary.quizzesTaken)} label={t.home.statQuizzes} />
              <StatTile value={summary.averageScore === null ? '—' : `${summary.averageScore}%`} label={t.home.statAverage} />
              <StatTile value={String(summary.topicsPractised)} label={t.home.statTopics} />
            </>
          )}
        </div>
        {weakTopics.length ? (
          <FocusBanner
            href="/app/progress#focus"
            title={plural(weakTopics.length, t.home.focusTitle)}
            body={fmt(t.home.focusBody, { threshold: WEAK_TOPIC_THRESHOLD })}
          />
        ) : null}
      </section>

      {/* Continue learning */}
      <section>
        <SectionTitle>{attempts.length ? t.home.continueLearning : t.home.startLearning}</SectionTitle>
        {courses.loading ? (
          <div className="grid gap-3 md:grid-cols-2">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : courses.error ? (
          <ErrorState title={t.errors.title} message={courses.error} onRetry={courses.reload} retryLabel={t.common.tryAgain} />
        ) : continueItems.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {continueItems.map(item => (
              <ContinueCard key={item.topic.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen className="size-7" />}
            title={t.home.coursesEmptyTitle}
            body={t.home.coursesEmptyBody}
            action={
              <Button variant="secondary" onClick={courses.reload}>
                {t.home.checkAgain}
              </Button>
            }
          />
        )}
      </section>

      {/* Recommended */}
      {recommended.length ? (
        <section>
          <SectionTitle
            action={
              <Link href="/app/courses" className="inline-flex items-center text-sm font-semibold text-link hover:underline">
                {t.home.seeMore} <ChevronRight className="size-4" />
              </Link>
            }>
            {t.home.recommended}
          </SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {recommended.map(item => (
              <RecommendedCard key={item.topic.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Campus news — hidden if it fails, like mobile */}
      {news.error ? null : (
        <section>
          <SectionTitle
            action={
              <Link href="/app/news" className="inline-flex items-center text-sm font-semibold text-link hover:underline">
                {w.app.viewAll} <ChevronRight className="size-4" />
              </Link>
            }>
            {t.news.campusNews} <span className="ml-1 text-sm font-medium text-text-muted">{t.news.nigerianUniversities}</span>
          </SectionTitle>
          {news.loading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[0, 1, 2].map(i => (
                <Skeleton key={i} className="h-52" />
              ))}
            </div>
          ) : news.data?.length ? (
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
              {news.data.slice(0, 3).map(article => (
                <NewsCard key={article.id} article={article} className="w-[80vw] max-w-sm shrink-0 snap-start md:w-auto md:max-w-none" />
              ))}
            </div>
          ) : (
            <EmptyState title={t.home.newsEmptyTitle} body={t.home.newsEmptyBody} />
          )}
        </section>
      )}
    </div>
  );
}
