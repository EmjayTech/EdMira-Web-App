'use client';

import { fmt, useTranslation } from '@/localization/useTranslation';
import { levelNumber } from '@/utils/format';

/**
 * Display text for a study level: "300 Level" → "300 level" (translated),
 * postgraduate values ("Master of Science (M.Sc.)") are shown as they are.
 */
export const useLevelLabel = () => {
  const { t } = useTranslation();
  return (level?: string, template: string = t.profile.level) => {
    if (!level) return '';
    const n = levelNumber(level);
    return n ? fmt(template, { level: n }) : level;
  };
};
