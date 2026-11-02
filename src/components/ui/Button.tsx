import Link from 'next/link';
import { ComponentProps, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Spinner } from './States';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'hero' | 'heroOutline';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-[background,color,box-shadow,transform] duration-150 active:scale-[0.98] disabled:opacity-55 disabled:active:scale-100 select-none whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary: 'bg-action text-on-action hover:bg-action-hover shadow-[0_6px_16px_-6px_var(--action)]',
  secondary: 'bg-surface text-text border border-border hover:bg-surface-muted',
  ghost: 'text-link hover:bg-primary-soft',
  danger: 'bg-danger text-white hover:opacity-90 dark:text-[#450a0a]',
  hero: 'bg-white text-brand-800 hover:bg-white/90 shadow-[0_10px_30px_-10px_rgba(126,223,178,0.6)]',
  heroOutline: 'border border-white/30 text-white hover:bg-white/10 backdrop-blur',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-7 text-base',
};

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', className?: string) =>
  cn(base, variants[variant], sizes[size], className);

type ButtonProps = ComponentProps<'button'> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  block?: boolean;
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  block,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass(variant, size, cn(block && 'w-full', className))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}>
      {loading ? <Spinner className="size-4" /> : icon}
      {children}
    </button>
  );
}

type LinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  block?: boolean;
};

export function ButtonLink({ variant, size, icon, block, className, children, ...rest }: LinkProps) {
  return (
    <Link className={buttonClass(variant, size, cn(block && 'w-full', className))} {...rest}>
      {icon}
      {children}
    </Link>
  );
}
