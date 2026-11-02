import type { User } from '@/data/auth/types';
import { cn } from '@/utils/cn';

export const initialsOf = (user: Pick<User, 'firstName' | 'lastName'> | null) =>
  `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || '?';

export function Avatar({ user, className }: { user: User | null; className?: string }) {
  if (user?.avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.avatarUrl} alt="" className={cn('size-9 rounded-full object-cover', className)} />;
  }
  return (
    <span
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary',
        className,
      )}
      aria-hidden>
      {initialsOf(user)}
    </span>
  );
}
