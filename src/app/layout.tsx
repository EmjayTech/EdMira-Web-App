import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { SITE } from '@/config/site';
import { themeBootScript } from '@/theme/ThemeContext';
import { Providers } from './providers';
import './globals.css';

/** Inter — the same font files as the mobile app. */
const inter = localFont({
  variable: '--font-inter',
  display: 'swap',
  src: [
    { path: '../fonts/Inter-Regular.ttf', weight: '400' },
    { path: '../fonts/Inter-Medium.ttf', weight: '500' },
    { path: '../fonts/Inter-SemiBold.ttf', weight: '600' },
    { path: '../fonts/Inter-Bold.ttf', weight: '700' },
  ],
});

/** Display face for marketing headlines (close to the Play Store artwork). */
const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'EdMira',
    'medical students Nigeria',
    'MBBS study app',
    'medical MCQs',
    'anatomy questions',
    'physiology practice',
    'Nigerian medical school',
  ],
  icons: { icon: '/brand/app-icon-512.png', apple: '/brand/app-icon-512.png' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: '/brand/feature-graphic.png', width: 1024, height: 500, alt: SITE.tagline }],
    locale: 'en_NG',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ['/brand/feature-graphic.png'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0A369D' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1115' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
