/**
 * Public facts about EdMira used across the marketing site. Change them here
 * only. Values marked TODO need confirming before launch.
 */
export const SITE = {
  name: 'EdMira',
  tagline: 'The study app for Nigerian medical students',
  description:
    'EdMira helps Nigerian medical students study their courses, practise questions by topic, understand their mistakes and track what needs more attention.',
  /** Production URL of this website (used for SEO, sitemap and social cards). */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://edmira.org',
  /** TODO: confirm the public support inbox on edmira.org. */
  contactEmail: 'support@edmira.org',
  /** Android app (package com.emjaytech.edmira). */
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.emjaytech.edmira',
  /** People who tested EdMira before launch (founding tester certificates). */
  foundingTesters: 117,
} as const;
