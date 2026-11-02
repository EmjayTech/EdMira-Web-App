'use client';

import { useParams } from 'next/navigation';
import { ExternalLink, Info } from 'lucide-react';
import { getNewsArticle } from '@/data/news/newsService';
import { fmt, useTranslation } from '@/localization/useTranslation';
import { useAsync } from '@/hooks/useAsync';
import { useFormatDate } from '@/hooks/useFormatDate';
import { BackLink } from '@/components/app/BackLink';
import { NEWS_STYLE, NewsCover } from '@/components/app/NewsCard';
import { ButtonLink } from '@/components/ui/Button';
import { ErrorState, LoadingState } from '@/components/ui/States';

/** One campus news story (mobile NewsArticleScreen). */
export default function NewsArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { t, w } = useTranslation();
  const { withTime } = useFormatDate();
  const { data: article, loading, error, reload } = useAsync(() => getNewsArticle(id), [id]);

  if (loading) return <LoadingState />;
  if (error || !article)
    return <ErrorState title={t.errors.title} message={error ?? t.errors.notFound} onRetry={reload} retryLabel={t.common.tryAgain} />;

  const Icon = NEWS_STYLE[article.category].icon;
  return (
    <article className="mx-auto max-w-3xl">
      <BackLink href="/app/news">{w.app.allNews}</BackLink>
      <NewsCover article={article} large className="aspect-[16/8] w-full rounded-3xl" />
      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 font-semibold text-primary">
          <Icon className="size-4" /> {t.news.categories[article.category]}
        </span>
        {article.institution ? <span className="text-text-muted">{article.institution}</span> : null}
      </div>
      <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{article.title}</h1>
      <p className="mt-3 text-sm text-text-muted">
        {article.source} · {withTime(article.publishedAt)}
      </p>
      {article.isSample ? (
        <p className="mt-5 flex gap-2 rounded-xl bg-warning-soft px-4 py-3 text-sm text-on-warning-soft">
          <Info className="mt-0.5 size-4 shrink-0" /> {t.news.sampleNotice}
        </p>
      ) : null}
      <p className="mt-6 text-lg font-medium leading-relaxed text-text">{article.summary}</p>
      {article.body
        .filter(p => p !== article.summary)
        .map((para, i) => (
          <p key={i} className="mt-4 text-[16.5px] leading-[1.75] text-text-body">
            {para}
          </p>
        ))}
      {article.sourceUrl ? (
        <ButtonLink href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-8" icon={<ExternalLink className="size-4" />}>
          {fmt(t.news.readFullStory, { source: article.source })}
        </ButtonLink>
      ) : null}
    </article>
  );
}
