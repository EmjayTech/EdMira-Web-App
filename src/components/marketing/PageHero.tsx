import { Heartbeat } from '@/components/brand/Heartbeat';

/** Dark brand header used by every secondary marketing page. */
export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 pb-20 pt-36 text-white sm:pt-44">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(90%_80%_at_10%_0%,#1a3fd6_0%,#0a1a66_50%,#040820_100%)]" />
      <Heartbeat className="absolute inset-x-0 bottom-6 -z-10 h-12 text-mint/25" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">{eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">{title}</h1>
        {intro ? <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{intro}</p> : null}
      </div>
    </section>
  );
}

/** Readable long-form text (legal pages, about). */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 [&_a]:font-semibold [&_a]:text-link [&_a:hover]:underline [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2:first-child]:mt-0 [&_li]:mt-2 [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-text-body [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-text-body">
      {children}
    </div>
  );
}
