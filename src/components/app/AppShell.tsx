'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Home,
  LineChart,
  LogOut,
  MessageSquareHeart,
  Newspaper,
  Search,
  Smartphone,
  User as UserIcon,
} from 'lucide-react';
import { useTranslation } from '@/localization/useTranslation';
import { useSession } from '@/session/SessionProvider';
import { SITE } from '@/config/site';
import { BACKEND } from '@/config/backend';
import { Logo } from '@/components/brand/Logo';
import { cn } from '@/utils/cn';
import { Avatar } from './Avatar';
import { LanguageMenu } from './LanguageMenu';
import { ThemeToggle } from './ThemeToggle';

/**
 * The logged-in frame: sidebar on desktop, bottom tabs on phones (the same
 * four tabs as the mobile app), and a top bar with search.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { t, w } = useTranslation();
  const { user, signOut } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const tabs = [
    { href: '/app', label: t.tabs.Home, icon: Home, exact: true },
    { href: '/app/courses', label: t.tabs.Courses, icon: BookOpen },
    { href: '/app/progress', label: t.tabs.Progress, icon: LineChart },
    { href: '/app/profile', label: t.tabs.Profile, icon: UserIcon },
  ];
  const extras = [
    { href: '/app/news', label: w.nav.news, icon: Newspaper },
    { href: '/app/feedback', label: w.nav.feedback, icon: MessageSquareHeart },
  ];
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  // The quiz is full-screen focus mode.
  const focusMode = /^\/app\/quiz\//.test(pathname);

  const search = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/app/courses?q=${encodeURIComponent(q)}` : '/app/courses');
  };

  if (focusMode) return <div className="min-h-dvh bg-bg">{children}</div>;

  return (
    <div className="min-h-dvh bg-bg lg:pl-68">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2">
        {w.nav.skipToContent}
      </a>

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-68 flex-col border-r border-border bg-surface px-4 py-6 lg:flex">
        <div className="px-3">
          <Logo href="/app" className="h-8" />
        </div>
        <nav className="mt-8 flex flex-col gap-1" aria-label="Main">
          {tabs.map(tab => (
            <SideLink key={tab.href} {...tab} active={isActive(tab.href, tab.exact)} />
          ))}
          <div className="my-3 h-px bg-divider" />
          {extras.map(tab => (
            <SideLink key={tab.href} {...tab} active={isActive(tab.href)} />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <a
            href={SITE.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-4 text-white">
            <Smartphone className="size-5 text-mint" />
            <p className="mt-2 text-sm font-bold">{w.nav.getApp}</p>
            <p className="mt-0.5 text-xs text-white/70">{w.nav.getAppBody}</p>
            <ExternalLink className="absolute right-3 top-3 size-4 text-white/40 group-hover:text-white" />
          </a>
          <ThemeToggle className="w-full justify-between" />
          <Link href="/" className="px-3 text-xs text-text-faint hover:text-text-muted">
            ← {w.nav.backToSite}
          </Link>
        </div>
      </aside>

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div className="lg:hidden">
            <Logo href="/app" className="h-7" />
          </div>
          <form onSubmit={search} className="ml-auto hidden max-w-md flex-1 md:block lg:ml-0" role="search">
            <label className="flex h-10 items-center gap-2 rounded-xl border border-border bg-bg px-3 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
              <Search className="size-4 text-text-faint" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t.home.searchPlaceholder}
                aria-label={t.home.searchA11y}
                className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-text-faint"
              />
              <kbd className="hidden rounded-md border border-border px-1.5 text-[11px] text-text-faint xl:inline">/</kbd>
            </label>
          </form>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/app/courses" className="grid size-10 place-items-center rounded-xl text-text-muted hover:bg-surface-muted md:hidden" aria-label={t.home.searchA11y}>
              <Search className="size-5" />
            </Link>
            <LanguageMenu className="hidden sm:block" />
            <UserMenu onLogout={() => signOut(null)} />
          </div>
        </div>
      </header>

      {BACKEND.useMock.content ? (
        <div className="border-b border-warning/20 bg-warning-soft px-4 py-2 text-center text-xs text-on-warning-soft">{w.app.sampleContent}</div>
      ) : null}

      <main id="main" className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
        {user ? children : null}
      </main>

      {/* Bottom tabs (phones) */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        {tabs.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn('flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium', active ? 'text-primary' : 'text-text-muted')}>
              <Icon className={cn('size-5.5', active && 'stroke-[2.4]')} />
              {label}
            </Link>
          );
        })}
      </nav>
      <SlashToSearch />
    </div>
  );
}

function SideLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors',
        active ? 'bg-primary-soft text-primary' : 'text-text-secondary hover:bg-surface-muted hover:text-text',
      )}>
      <Icon className={cn('size-5', active && 'stroke-[2.4]')} />
      {label}
    </Link>
  );
}

function UserMenu({ onLogout }: { onLogout: () => void }) {
  const { user } = useSession();
  const { t, w } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={w.nav.account}
        className="flex items-center gap-2 rounded-xl p-1 hover:bg-surface-muted">
        <Avatar user={user} />
      </button>
      {open ? (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-border bg-surface p-1.5 shadow-lift">
          <div className="px-3 py-3">
            <p className="truncate font-semibold">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-sm text-text-muted">{user?.email}</p>
          </div>
          <div className="my-1 h-px bg-divider" />
          <MenuLink href="/app/profile" onClick={() => setOpen(false)} icon={<UserIcon className="size-4" />}>
            {t.tabs.Profile}
          </MenuLink>
          <MenuLink href="/app/feedback" onClick={() => setOpen(false)} icon={<MessageSquareHeart className="size-4" />}>
            {w.nav.feedback}
          </MenuLink>
          <div className="px-3 py-2 sm:hidden">
            <LanguageMenu />
          </div>
          <div className="my-1 h-px bg-divider" />
          <button
            role="menuitem"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-danger hover:bg-danger-soft">
            <LogOut className="size-4" /> {t.profile.logout}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({ href, icon, children, onClick }: { href: string; icon: ReactNode; children: ReactNode; onClick: () => void }) {
  return (
    <Link role="menuitem" href={href} onClick={onClick} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-surface-muted">
      {icon} {children}
    </Link>
  );
}

/** Press "/" anywhere to jump to the search box. */
function SlashToSearch() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key !== '/' || /input|textarea|select/i.test(target.tagName) || target.isContentEditable) return;
      const input = document.querySelector<HTMLInputElement>('form[role=search] input');
      if (input && input.offsetParent) {
        e.preventDefault();
        input.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return null;
}
