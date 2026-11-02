import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/utils/cn';

/**
 * The EdMira wordmark (heartbeat "m"). `light` turns it white for dark /
 * brand-blue backgrounds, matching the Play Store artwork.
 */
export function Logo({
  light,
  href = '/',
  className,
}: {
  light?: boolean;
  href?: string | null;
  className?: string;
}) {
  const img = (
    <Image
      src="/brand/edmira-logo.png"
      alt="EdMira"
      width={262}
      height={116}
      priority
      className={cn('h-9 w-auto', light && 'brightness-0 invert', !light && 'dark:brightness-0 dark:invert', className)}
    />
  );
  return href ? (
    <Link href={href} aria-label="EdMira home" className="inline-flex shrink-0 items-center">
      {img}
    </Link>
  ) : (
    img
  );
}
