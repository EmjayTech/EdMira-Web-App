'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { useTranslation } from '@/localization/useTranslation';
import { cn } from '@/utils/cn';

/** Compact language switcher (English · Hausa · Yorùbá). */
export function LanguageMenu({ className }: { className?: string }) {
  const { language, setLanguage, availableLanguages, languageInfo, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t.language.title}: ${languageInfo.nativeName}`}
        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-sm font-medium text-text-body hover:bg-surface-muted">
        <Globe className="size-4" />
        {languageInfo.nativeName}
      </button>
      {open ? (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-border bg-surface p-1.5 shadow-lift">
          {availableLanguages.map(lang => (
            <button
              key={lang.code}
              role="menuitemradio"
              aria-checked={lang.code === language}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-surface-muted">
              <span>
                <span className="font-medium">{lang.nativeName}</span>
                {lang.nativeName !== lang.name ? <span className="ml-1.5 text-text-faint">{lang.name}</span> : null}
              </span>
              {lang.code === language ? <Check className="size-4 text-primary" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
