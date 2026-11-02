'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpenText, BrainCircuit, CheckCircle2, Target } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Heartbeat } from '@/components/brand/Heartbeat';
import { LanguageMenu } from '@/components/app/LanguageMenu';
import { useSession } from '@/session/SessionProvider';
import { useTranslation } from '@/localization/useTranslation';

/**
 * Split screen for every auth page: brand panel on the left (desktop),
 * the form on the right. Logged-in students are sent to the app unless
 * `allowSignedIn` (e.g. the verify page right after signing in).
 */
export function AuthLayout({ children, allowSignedIn }: { children: ReactNode; allowSignedIn?: boolean }) {
  const { user, ready } = useSession();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (ready && user && !allowSignedIn) router.replace('/app');
  }, [ready, user, allowSignedIn, router]);

  const points = [
    { icon: <BookOpenText />, text: t.onboarding.slides.learn.body },
    { icon: <BrainCircuit />, text: t.quizResult.reviewAll },
    { icon: <Target />, text: t.progress.focusAreas },
    { icon: <CheckCircle2 />, text: t.onboarding.slides.track.body },
  ];

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <aside className="relative isolate hidden overflow-hidden bg-brand-950 p-12 text-white lg:flex lg:flex-col">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(100%_70%_at_0%_0%,#1a3fd6_0%,#0a1a66_50%,#040820_100%)]" />
        <Heartbeat className="absolute inset-x-0 top-1/2 -z-10 h-16 text-mint/25" />
        <Logo light />
        <div className="mt-auto max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight">
            Study smarter
            <br />
            for med school.
          </h2>
          <ul className="mt-8 space-y-4">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-white/80">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-mint [&_svg]:size-4">{p.icon}</span>
                <span className="pt-1">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-12 text-sm text-white/40">© {new Date().getFullYear()} EdMira</p>
      </aside>

      <div className="flex flex-col bg-background">
        <div className="flex items-center justify-between px-5 py-5 sm:px-8">
          <div className="lg:invisible">
            <Logo className="h-8" />
          </div>
          <LanguageMenu />
        </div>
        <main id="main" className="flex flex-1 items-start justify-center px-5 pb-16 pt-4 sm:items-center sm:px-8">
          <div className="w-full max-w-[440px] animate-fade-up">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function AuthHeader({ title, subtitle }: { title: string; subtitle?: ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-[34px]">{title}</h1>
      {subtitle ? <p className="mt-2.5 leading-relaxed text-text-muted">{subtitle}</p> : null}
    </div>
  );
}
