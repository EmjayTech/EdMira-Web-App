'use client';

import { ReactNode, useId, useMemo, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import { FieldShell, fieldBox } from './Field';
import { Modal } from './Modal';

export interface SelectOption {
  value: string;
  label: string;
  group?: string;
}

/**
 * A pick-list that opens a searchable sheet — the web version of the mobile
 * SelectField + OptionSheet. Values are sent as-is (English); only labels
 * may be translated.
 */
export function SelectField({
  label,
  placeholder,
  value,
  options,
  onChange,
  error,
  disabled,
  searchPlaceholder,
  sheetTitle,
}: {
  label?: ReactNode;
  placeholder: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  sheetTitle?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find(o => o.value === value);
  const searchable = options.length > 8;

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle ? options.filter(o => o.label.toLowerCase().includes(needle)) : options;
    const map = new Map<string, SelectOption[]>();
    filtered.forEach(o => map.set(o.group ?? '', [...(map.get(o.group ?? '') ?? []), o]));
    return [...map.entries()];
  }, [options, query]);

  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
    setQuery('');
  };

  return (
    <FieldShell id={id} label={label} error={error}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(fieldBox, 'justify-between text-left disabled:opacity-60', error ? 'border-error' : 'border-border')}>
        <span className={cn('truncate', selected ? 'text-text' : 'text-text-faint')}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className="size-4 shrink-0 text-text-muted" />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={sheetTitle ?? placeholder}>
        {searchable ? (
          <div className={cn(fieldBox, 'mb-3 border-border')}>
            <Search className="size-4 text-text-faint" />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-full flex-1 bg-transparent outline-none placeholder:text-text-faint"
            />
          </div>
        ) : null}
        <div className="-mx-2 max-h-[55vh] overflow-y-auto" role="listbox" aria-label={typeof label === 'string' ? label : undefined}>
          {groups.map(([group, items]) => (
            <div key={group} className="mb-2">
              {group ? (
                <p className="sticky top-0 bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-faint">
                  {group}
                </p>
              ) : null}
              {items.map(o => (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={o.value === value}
                  onClick={() => choose(o.value)}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-[15px] hover:bg-surface-muted',
                    o.value === value && 'bg-primary-soft font-semibold text-primary',
                  )}>
                  {o.label}
                  {o.value === value ? <Check className="size-4 shrink-0" /> : null}
                </button>
              ))}
            </div>
          ))}
        </div>
      </Modal>
    </FieldShell>
  );
}
