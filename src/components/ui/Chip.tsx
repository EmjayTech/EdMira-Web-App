import { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export function Chip({
  selected,
  className,
  ...rest
}: ComponentProps<'button'> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'h-9 rounded-full border px-4 text-sm font-medium transition-colors',
        selected
          ? 'border-action bg-action text-on-action'
          : 'border-border bg-surface text-text-body hover:border-primary/40 hover:text-primary',
        className,
      )}
      {...rest}
    />
  );
}
