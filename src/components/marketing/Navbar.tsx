'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { useSession } from '@/session/SessionProvider';
import { cn } from '@/utils/cn';

const LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#quality', label: 'Medical review' },
  { href: '/about', label: 'About' },
  { href: '/#faq', label: 'FAQ' },
];

const subscribeToScroll = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
};

/**
 * Sits transparent over the dark hero on the home page, then turns into a
 * frosted bar once the page scrolls.
 */
export function Navbar() {
  const pathname = usePathname();
  const { user, ready } = useSession();
  const scrolled = useSyncExternalStore(subscribeToScroll, () => window.scrollY > 24, () => false);
  const [open, setOpen] = useState(false);
  const overHero = pathname === '/' && !scrolled && !open;

  // Close the mobile menu after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,border] duration-300',
        overHero
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-border/70 bg-background/80 shadow-[0_1px_0_var(--shadow)] backdrop-blur-xl',
      )}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2">
        Skip to content
      </a>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-18 lg:px-8">
        <Logo light={overHero} className="h-8 lg:h-9" />

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'rounded-lg px-3.5 py-2 text-[15px] font-medium transition-colors',
                  overHero ? 'text-white/80 hover:text-white' : 'text-text-secondary hover:text-text',
                )}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          {ready && user ? (
            <ButtonLink href="/app" variant={overHero ? 'hero' : 'primary'} icon={<ArrowRight className="size-4" />}>
              Open EdMira
            </ButtonLink>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  'rounded-xl px-4 py-2.5 text-[15px] font-semibold',
                  overHero ? 'text-white hover:bg-white/10' : 'text-text hover:bg-surface-muted',
                )}>
                Log in
              </Link>
              <ButtonLink href="/signup" variant={overHero ? 'hero' : 'primary'}>
                Get started
              </ButtonLink>
            </>
          )}
        </div>

        <button
          className={cn('grid size-10 place-items-center rounded-xl lg:hidden', overHero ? 'text-white' : 'text-text')}
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-border bg-background px-4 pb-6 pt-2 lg:hidden">
          <ul className="flex flex-col">
            {LINKS.map(link => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3.5 text-base font-medium text-text hover:bg-surface-muted">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {user ? (
              <ButtonLink href="/app" className="col-span-2">
                Open EdMira
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/login" variant="secondary">
                  Log in
                </ButtonLink>
                <ButtonLink href="/signup">Get started</ButtonLink>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
