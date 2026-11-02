'use client';

import { fmt, useTranslation } from '@/localization/useTranslation';

/** Relative / short dates in the active language ("2h ago", "Yesterday, 14:05", "3 Oct"). */
export const useFormatDate = () => {
  const { t } = useTranslation();
  const months = t.dates.monthsShort.split(',');
  const time = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  const short = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const vars = { day: d.getDate(), month: months[d.getMonth()], year: d.getFullYear() };
    return d.getFullYear() === now.getFullYear() ? fmt(t.dates.dayMonth, vars) : fmt(t.dates.dayMonthYear, vars);
  };

  const relative = (iso: string) => {
    const d = new Date(iso);
    const diffH = (Date.now() - d.getTime()) / 3_600_000;
    if (diffH < 1) return t.dates.justNow;
    if (diffH < 24) return fmt(t.dates.hoursAgo, { count: Math.floor(diffH) });
    if (diffH < 24 * 7) return fmt(t.dates.daysAgo, { count: Math.floor(diffH / 24) });
    return short(iso);
  };

  const withTime = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return fmt(t.dates.today, { time: time(d) });
    if (d.toDateString() === yesterday.toDateString()) return fmt(t.dates.yesterday, { time: time(d) });
    return `${short(iso)}, ${time(d)}`;
  };

  return { short, relative, withTime };
};
