'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/theme/ThemeContext';
import { useTranslation } from '@/localization/useTranslation';
import type { ThemeMode } from '@/types/theme';
import { cn } from '@/utils/cn';

const MODES: { mode: ThemeMode; icon: typeof Sun }[] = [
  { mode: 'light', icon: Sun },
  { mode: 'dark', icon: Moon },
  { mode: 'system', icon: Monitor },
];

/** Light / dark / system, the same three options as the mobile Appearance picker. */
export function ThemeToggle({ withLabels, className }: { withLabels?: boolean; className?: string }) {
  const { mode, setMode } = useTheme();
  const { t } = useTranslation();
  return (
    <div role="radiogroup" aria-label={t.appearance.title} className={cn('inline-flex rounded-xl border border-border bg-surface p-1', className)}>
      {MODES.map(({ mode: m, icon: Icon }) => (
        <button
          key={m}
          role="radio"
          aria-checked={mode === m}
          title={t.appearance[m]}
          aria-label={t.appearance[m]}
          onClick={() => setMode(m)}
          className={cn(
            'inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition-colors',
            mode === m ? 'bg-primary-soft text-primary' : 'text-text-muted hover:text-text',
          )}>
          <Icon className="size-4" />
          {withLabels ? t.appearance[m] : null}
        </button>
      ))}
    </div>
  );
}
