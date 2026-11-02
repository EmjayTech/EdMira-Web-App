'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '@/session/SessionProvider';
import { AppShell } from '@/components/app/AppShell';
import { Heartbeat } from '@/components/brand/Heartbeat';

/** Sends logged-out visitors to /login (and back here afterwards). */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, ready } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, user, router, pathname]);

  if (!ready || !user) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg">
        <Heartbeat className="h-10 w-56 text-primary" />
      </div>
    );
  }
  return <AppShell>{children}</AppShell>;
}
