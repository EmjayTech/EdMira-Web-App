import { Heartbeat } from '@/components/brand/Heartbeat';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-4 text-center">
      <div>
        <Heartbeat className="mx-auto h-12 max-w-sm text-primary" />
        <p className="mt-6 font-display text-7xl font-extrabold text-primary">404</p>
        <h1 className="mt-3 text-2xl font-bold">This page flatlined.</h1>
        <p className="mt-2 text-text-muted">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/">Go home</ButtonLink>
          <ButtonLink href="/app" variant="secondary">
            Open EdMira
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
