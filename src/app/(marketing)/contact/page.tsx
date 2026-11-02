import type { Metadata } from 'next';
import { Bug, Mail, MessageSquareHeart, School } from 'lucide-react';
import { PageHero } from '@/components/marketing/PageHero';
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the EdMira team.',
};

const mail = (subject: string) => `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}`;

const CHANNELS = [
  {
    icon: <Mail />,
    title: 'General questions',
    body: 'Anything about your account, courses or the app.',
    href: mail('Question about EdMira'),
    cta: 'Email us',
  },
  {
    icon: <Bug />,
    title: 'Report a problem',
    body: 'Something not working? Tell us what happened and on which device.',
    href: mail('Problem report'),
    cta: 'Report a problem',
  },
  {
    icon: <School />,
    title: 'Schools & partners',
    body: 'Lecturers, departments and student bodies who want to work with us.',
    href: mail('Partnership enquiry'),
    cta: 'Start a conversation',
  },
  {
    icon: <MessageSquareHeart />,
    title: 'Product feedback',
    body: 'Already a student on EdMira? Send feedback from inside the app — it goes straight to the team.',
    href: '/app/feedback',
    cta: 'Send feedback',
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We’d love to hear from you."
        intro={`The EdMira team reads every message. Email ${SITE.contactEmail} or pick the option that fits best.`}
      />
      <section className="mx-auto grid max-w-5xl gap-5 px-4 py-20 sm:grid-cols-2 sm:px-6 lg:px-8">
        {CHANNELS.map(c => (
          <a
            key={c.title}
            href={c.href}
            className="group rounded-3xl border border-border bg-surface p-7 transition-[box-shadow,border] hover:border-primary/40 hover:shadow-card">
            <div className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary [&_svg]:size-6">{c.icon}</div>
            <h2 className="mt-5 text-xl font-bold">{c.title}</h2>
            <p className="mt-2 text-text-muted">{c.body}</p>
            <p className="mt-5 font-semibold text-link group-hover:underline">{c.cta} →</p>
          </a>
        ))}
      </section>
    </>
  );
}
