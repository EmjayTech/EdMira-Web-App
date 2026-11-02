import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-link hover:underline">
      <ArrowLeft className="size-4" /> {children}
    </Link>
  );
}
