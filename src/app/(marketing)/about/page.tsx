import type { Metadata } from 'next';
import { ArrowRight, HeartPulse, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { PageHero } from '@/components/marketing/PageHero';
import { ButtonLink } from '@/components/ui/Button';
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  title: 'About',
  description: 'Why we are building EdMira, the study app for Nigerian medical students.',
};

const VALUES = [
  {
    icon: <HeartPulse />,
    title: 'Made for how med students study',
    body: 'Topic by topic, with practice straight after reading — because testing yourself is how knowledge sticks.',
  },
  {
    icon: <ShieldCheck />,
    title: 'Accuracy over volume',
    body: 'Every question passes medical review before it is published, and students can flag anything that looks wrong.',
  },
  {
    icon: <Sparkles />,
    title: 'Honest feedback',
    body: 'Scores are graded on the server and focus areas come from your own results, so you see exactly where you stand.',
  },
  {
    icon: <Users />,
    title: 'Built with students',
    body: `${SITE.foundingTesters} founding testers used EdMira before launch and shaped what it is today.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About EdMira"
        title="Helping Nigerian medical students study with confidence."
        intro="Medical school is demanding. Notes are scattered, past questions rarely explain the answer, and it’s hard to know what to revise next. EdMira brings it together in one place."
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Our mission</h2>
            <p className="mt-5 text-lg leading-relaxed text-text-body">{SITE.description}</p>
            <p className="mt-4 text-lg leading-relaxed text-text-body">
              We start with the courses every medical student takes — anatomy, physiology, biochemistry, pharmacology and
              more — and tailor them to your school, department and level. Content is created and medically reviewed by
              our team before students ever see it.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {VALUES.map(v => (
              <div key={v.title} className="rounded-3xl border border-border bg-surface p-6">
                <div className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary [&_svg]:size-5">{v.icon}</div>
                <h3 className="mt-4 font-bold">{v.title}</h3>
                <p className="mt-2 text-[15px] text-text-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary-soft p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Ready to try it?</h2>
            <p className="mt-2 text-text-muted">Create your account and take your first topic quiz today.</p>
          </div>
          <ButtonLink href="/signup" size="lg">
            Get started <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
