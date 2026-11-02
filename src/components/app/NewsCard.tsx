'use client';

import Link from 'next/link';
import { Award, CalendarDays, ClipboardList, GraduationCap, Newspaper, Stethoscope, ChevronRight } from 'lucide-react';
import type { NewsArticle, NewsCategory } from '@/data/news/types';
import { useTranslation } from '@/localization/useTranslation';
import { useFormatDate } from '@/hooks/useFormatDate';
import { cn } from '@/utils/cn';

export const NEWS_STYLE: Record<NewsCategory, { icon: typeof Newspaper; gradient: string }> = {
  admissions: { icon: GraduationCap, gradient: 'from-[#1a3fd6] to-[#0a1a66]' },
  exams: { icon: ClipboardList, gradient: 'from-[#7c3aed] to-[#3b0f8a]' },
  scholarships: { icon: Award, gradient: 'from-[#0f766e] to-[#053f3a]' },
  calendar: { icon: CalendarDays, gradient: 'from-[#c2410c] to-[#6b1f05]' },
  clinical: { icon: Stethoscope, gradient: 'from-[#be123c] to-[#5c0a1f]' },
  general: { icon: Newspaper, gradient: 'from-[#0369a1] to-[#0a1a66]' },
};

/** Cover: the story's photo, or a branded gradient by category (like mobile NewsCover). */
export function NewsCover({ article, className, large }: { article: NewsArticle; className?: string; large?: boolean }) {
  const style = NEWS_STYLE[article.category];
  const Icon = style.icon;
  return (
    <div className={cn('relative overflow-hidden bg-gradient-to-br', style.gradient, className)}>
      {article.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.imageUrl} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
      ) : (
        <Icon className={cn('absolute -bottom-4 -right-4 text-white/10', large ? 'size-48' : 'size-28')} />
      )}
    </div>
  );
}

export function NewsCard({ article, className }: { article: NewsArticle; className?: string }) {
  const { t } = useTranslation();
  const { relative } = useFormatDate();
  const Icon = NEWS_STYLE[article.category].icon;
  return (
    <Link
      href={`/app/news/${article.id}`}
      className={cn(
        'group relative flex h-52 flex-col justify-end overflow-hidden rounded-2xl text-white shadow-card transition-transform hover:-translate-y-0.5',
        className,
      )}>
      <NewsCover article={article} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute left-4 top-4 flex gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur">
          <Icon className="size-3.5" /> {t.news.categories[article.category]}
        </span>
        {article.isSample ? (
          <span className="rounded-full bg-warning px-2.5 py-1 text-xs font-semibold text-white dark:text-black">{t.news.sample}</span>
        ) : null}
      </div>
      <div className="relative p-4">
        <h3 className="line-clamp-2 font-bold leading-snug">{article.title}</h3>
        <div className="mt-2 flex items-center justify-between text-xs text-white/75">
          <span className="truncate">
            {article.source} · {relative(article.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-0.5 font-semibold text-white">
            {t.news.read} <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
