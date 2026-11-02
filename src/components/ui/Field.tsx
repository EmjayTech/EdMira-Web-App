'use client';

import { ComponentProps, ReactNode, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';

export const fieldBox =
  'flex h-12 w-full items-center gap-2 rounded-xl border bg-surface px-3.5 text-[15px] transition-[border,box-shadow] focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15';

export function FieldShell({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string;
  label?: ReactNode;
  error?: string;
  hint?: ReactNode;
  optional?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-text-body">
          {label}
          {optional ? <span className="ml-1 font-normal text-text-faint">({optional})</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] text-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13px] text-text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = Omit<ComponentProps<'input'>, 'prefix'> & {
  label?: ReactNode;
  error?: string;
  hint?: ReactNode;
  optional?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function TextField({ label, error, hint, optional, leading, trailing, id, className, ...rest }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <FieldShell id={inputId} label={label} error={error} hint={hint} optional={optional}>
      <div className={cn(fieldBox, error ? 'border-error' : 'border-border', className)}>
        {leading ? <span className="shrink-0 text-text-faint">{leading}</span> : null}
        <input
          id={inputId}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-text outline-none placeholder:text-text-faint"
          {...rest}
        />
        {trailing}
      </div>
    </FieldShell>
  );
}

export function PasswordField({
  showLabel,
  hideLabel,
  ...rest
}: TextFieldProps & { showLabel: string; hideLabel: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          aria-label={visible ? hideLabel : showLabel}
          className="-mr-1 grid size-9 place-items-center rounded-lg text-text-muted hover:bg-surface-muted">
          {visible ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
        </button>
      }
      {...rest}
    />
  );
}

export function TextArea({
  label,
  error,
  hint,
  id,
  className,
  ...rest
}: ComponentProps<'textarea'> & { label?: ReactNode; error?: string; hint?: ReactNode }) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <FieldShell id={inputId} label={label} error={error} hint={hint}>
      <textarea
        id={inputId}
        aria-invalid={!!error || undefined}
        className={cn(
          'min-h-28 w-full rounded-xl border bg-surface px-3.5 py-3 text-[15px] text-text outline-none transition-[border,box-shadow] placeholder:text-text-faint focus:border-primary focus:ring-4 focus:ring-primary/15',
          error ? 'border-error' : 'border-border',
          className,
        )}
        {...rest}
      />
    </FieldShell>
  );
}

export function Checkbox({
  checked,
  onChange,
  children,
  error,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  error?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-text-body">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="mt-0.5 size-4.5 shrink-0 cursor-pointer accent-[var(--action)]"
        />
        <span>{children}</span>
      </label>
      {error ? <p className="mt-1.5 text-[13px] text-error">{error}</p> : null}
    </div>
  );
}
