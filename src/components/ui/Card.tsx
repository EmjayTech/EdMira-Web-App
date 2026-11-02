import { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export function Card({ className, ...rest }: ComponentProps<'div'>) {
  return <div className={cn('rounded-2xl border border-border bg-surface', className)} {...rest} />;
}

export function SectionTitle({
  children,
  action,
  className,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-3 flex items-end justify-between gap-4', className)}>
      <h2 className="text-lg font-bold tracking-tight text-text">{children}</h2>
      {action}
    </div>
  );
}
