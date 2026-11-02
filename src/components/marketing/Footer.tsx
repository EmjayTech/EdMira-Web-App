import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Heartbeat } from '@/components/brand/Heartbeat';
import { SITE } from '@/config/site';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/#features', label: 'Features' },
      { href: '/#how-it-works', label: 'How it works' },
      { href: '/signup', label: 'Create an account' },
      { href: '/login', label: 'Log in' },
      { href: SITE.playStoreUrl, label: 'Android app', external: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About EdMira' },
      { href: '/contact', label: 'Contact' },
      { href: '/#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/terms', label: 'Terms of Service' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/disclaimer', label: 'Medical disclaimer' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-950 text-white/70">
      <Heartbeat className="absolute inset-x-0 top-0 h-10 text-mint/30" animate={false} />
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Logo light />
            <p className="mt-5 text-[15px] leading-relaxed">{SITE.description}</p>
            <a href={`mailto:${SITE.contactEmail}`} className="mt-5 inline-block text-sm font-semibold text-mint hover:underline">
              {SITE.contactEmail}
            </a>
          </div>
          {COLUMNS.map(col => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map(link => (
                  <li key={link.href}>
                    {'external' in link ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-[15px] hover:text-white">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-[15px] hover:text-white">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} EdMira. Made in Nigeria for medical students.</p>
          <p className="text-white/50">For education only — not a substitute for clinical training or supervision.</p>
        </div>
      </div>
    </footer>
  );
}
