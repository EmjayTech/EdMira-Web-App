/**
 * ─── News JSON shape (DTO) and mapper ────────────────────────────────────────
 *
 * `NewsDTO` is the JSON the app EXPECTS from GET /api/v1/news (see
 * docs/BACKEND_INTEGRATION.md §3.5). If the backend names things differently,
 * adapt THIS FILE ONLY.
 */

import { idOf } from '@/api/envelope';
import { NewsArticle, NewsCategory } from './types';

export interface NewsDTO {
  id?: string | number;
  _id?: string;
  title: string;
  summary?: string;
  excerpt?: string;
  /** Either paragraphs or one string with blank lines between paragraphs. */
  body?: string[] | string;
  content?: string;
  category?: string;
  institution?: string;
  source?: string;
  sourceUrl?: string;
  url?: string;
  imageUrl?: string;
  image?: string;
  publishedAt?: string;
  createdAt?: string;
}

const CATEGORIES: NewsCategory[] = [
  'admissions',
  'exams',
  'scholarships',
  'calendar',
  'clinical',
  'general',
];

const toParagraphs = (text?: string[] | string): string[] => {
  if (Array.isArray(text)) return text.filter(Boolean);
  return (text ?? '')
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);
};

export const toNewsArticle = (dto: NewsDTO): NewsArticle => {
  const category = (dto.category ?? '').toLowerCase() as NewsCategory;
  const body = toParagraphs(dto.body ?? dto.content);
  return {
    id: idOf(dto),
    title: dto.title,
    summary: dto.summary ?? dto.excerpt ?? body[0] ?? '',
    body,
    category: CATEGORIES.includes(category) ? category : 'general',
    institution: dto.institution,
    source: dto.source ?? 'EdMira',
    sourceUrl: dto.sourceUrl ?? dto.url,
    imageUrl: dto.imageUrl ?? dto.image,
    publishedAt: dto.publishedAt ?? dto.createdAt ?? new Date().toISOString(),
  };
};
