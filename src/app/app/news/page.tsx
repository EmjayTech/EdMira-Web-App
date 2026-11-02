'use client';

import { Newspaper } from 'lucide-react';
import { getLatestNews } from '@/data/news/newsService';
import { useTranslation } from '@/localization/useTranslation';
import { useAsync } from '@/hooks/useAsync';
import { NewsCard } from '@/components/app/NewsCard';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';

const PAGE_SIZE = 24;

export default function NewsPage() {
  const { t, w } = useTranslation();
  const { data, loading, error, reload } = useAsync(() => getLatestNews(PAGE_SIZE), []);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{w.app.allNews}</h1>
        <p className="mt-1.5 text-text-muted">{t.news.nigerianUniversities}</p>
      </header>
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-52" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title={t.errors.title} message={error} onRetry={reload} retryLabel={t.common.tryAgain} />
      ) : data?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <EmptyState icon={<Newspaper className="size-7" />} title={t.home.newsEmptyTitle} body={t.home.newsEmptyBody} />
      )}
    </div>
  );
}
