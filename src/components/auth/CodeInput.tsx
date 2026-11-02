'use client';

import { useRef } from 'react';
import { cn } from '@/utils/cn';

/** One box per digit; typing advances, Backspace goes back, paste fills all. */
export function CodeInput({
  value,
  onChange,
  length = 6,
  error,
  label,
  autoFocus = true,
}: {
  value: string;
  onChange: (code: string) => void;
  length?: number;
  error?: boolean;
  label: string;
  autoFocus?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const setAt = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join('').slice(0, length));
  };

  return (
    <div className="flex justify-between gap-2" role="group" aria-label={label}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => {
            refs.current[i] = el;
          }}
          value={d}
          autoFocus={autoFocus && i === 0}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={`${label} ${i + 1}`}
          onChange={e => {
            const digit = e.target.value.replace(/\D/g, '').slice(-1);
            setAt(i, digit);
            if (digit && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={e => {
            if (e.key === 'Backspace' && !d && i > 0) {
              setAt(i - 1, '');
              refs.current[i - 1]?.focus();
            }
            if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
            if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onPaste={e => {
            const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
            if (!pasted) return;
            e.preventDefault();
            onChange(pasted);
            refs.current[Math.min(pasted.length, length - 1)]?.focus();
          }}
          className={cn(
            'aspect-square w-full min-w-0 max-w-14 rounded-xl border-2 bg-surface text-center font-display text-2xl font-bold text-text outline-none transition-[border,box-shadow] focus:border-primary focus:ring-4 focus:ring-primary/15',
            error ? 'border-error' : d ? 'border-primary/50' : 'border-border',
          )}
        />
      ))}
    </div>
  );
}
