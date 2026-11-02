import type { Metadata } from 'next';
import { AuthGuard } from './AuthGuard';

export const metadata: Metadata = {
  title: { default: 'Home', template: '%s · EdMira' },
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
