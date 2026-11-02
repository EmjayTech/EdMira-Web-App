import type { MetadataRoute } from 'next';
import { SITE } from '@/config/site';

const PAGES = ['', '/about', '/contact', '/signup', '/login', '/terms', '/privacy', '/disclaimer'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(path => ({
    url: `${SITE.url}${path}`,
    changeFrequency: path ? 'monthly' : 'weekly',
    priority: path ? 0.6 : 1,
  }));
}
