import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { unwrap, unwrapList } from '@/api/envelope';
import { mockDelay } from '@/api/mock';
import { BACKEND } from '@/config/backend';
import { NewsDTO, toNewsArticle } from './dto';
import { MOCK_NEWS } from './mockNews';
import { NewsArticle } from './types';

/**
 * ─── News service (the ONLY news entry point for screens) ────────────────────
 *
 * Runs on MOCK_NEWS while BACKEND.useMock.news is true. Flip it to false once
 * GET /api/v1/news is live; JSON mapping lives in ./dto.ts.
 */

const HOME_LIMIT = 6;
const delay = <T>(value: T) => mockDelay(value, 300);

const newestFirst = (a: NewsArticle, b: NewsArticle) =>
  b.publishedAt.localeCompare(a.publishedAt);

/** Latest stories for the Home carousel, newest first. */
export const getLatestNews = async (limit = HOME_LIMIT): Promise<NewsArticle[]> => {
  if (BACKEND.useMock.news) return delay(MOCK_NEWS.slice(0, limit));
  const res = await apiClient.get(ENDPOINTS.news, { params: { limit } });
  return unwrapList<NewsDTO>(res.data).map(toNewsArticle).sort(newestFirst);
};

export const getNewsArticle = async (articleId: string): Promise<NewsArticle> => {
  if (BACKEND.useMock.news) {
    const article = MOCK_NEWS.find(a => a.id === articleId);
    if (!article) throw new Error('Article not found');
    return delay(article);
  }
  const res = await apiClient.get(ENDPOINTS.newsArticle(articleId));
  return toNewsArticle(unwrap<NewsDTO>(res.data));
};
