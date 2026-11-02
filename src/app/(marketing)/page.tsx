import Image from 'next/image';
import {
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Flame,
  Globe2,
  Languages,
  LineChart,
  Moon,
  Newspaper,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Target,
  Users,
} from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Heartbeat } from '@/components/brand/Heartbeat';
import { ProductPreview } from '@/components/marketing/ProductPreview';
import { FAQ, FaqList } from '@/components/marketing/Faq';
import { SITE } from '@/config/site';
import { DEFAULT_ACADEMIC_OPTIONS } from '@/data/reference/mock/academicOptions';

const SCHOOLS = DEFAULT_ACADEMIC_OPTIONS.institutions.map(i => i.name);

export default function HomePage() {
  return (
    <>
      <Hero />
      <SchoolsMarquee />
      <Features />
      <HowItWorks />
      <Quality />
      <AppGallery />
      <Everywhere />
      <section id="faq" className="scroll-mt-24 bg-bg py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:px-8">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Questions, answered.</h2>
            <p className="mt-4 text-lg text-text-muted">
              Can&apos;t find what you need?{' '}
              <a href={`mailto:${SITE.contactEmail}`} className="font-semibold text-link hover:underline">
                Email the team
              </a>
              .
            </p>
          </div>
          <FaqList items={FAQ} />
        </div>
      </section>
      <FinalCta />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }),
        }}
      />
    </>
  );
}

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`text-sm font-bold uppercase tracking-[0.18em] ${light ? 'text-mint' : 'text-primary'}`}>{children}</p>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 pb-24 pt-32 text-white sm:pt-40 lg:pb-32">
      {/* Background: brand gradient + grid + heartbeat */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_20%_0%,#1a3fd6_0%,#0a1a66_45%,#040820_100%)]" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at 30% 20%, black 30%, transparent 75%)',
        }}
      />
      <Heartbeat className="absolute inset-x-0 top-[58%] -z-10 h-16 text-mint/25" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm text-white/80 backdrop-blur">
            <Stethoscope className="size-4 text-mint" /> Built for Nigerian medical students
          </p>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Study smarter
            <br />
            for <span className="bg-gradient-to-r from-mint to-[#8aa8ff] bg-clip-text text-transparent">med school.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
            Clear study notes, topic-by-topic MCQs with explained answers, and focus areas that show exactly what to
            revise next — on the web and on Android.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/signup" variant="hero" size="lg" icon={null}>
              Create your account <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/login" variant="heroOutline" size="lg">
              I already have an account
            </ButtonLink>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              [String(SITE.foundingTesters), 'founding testers'],
              [String(SCHOOLS.length), 'medical schools'],
              ['3', 'languages'],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl font-extrabold text-white">{n}</dd>
                <dd className="mt-1 text-sm text-white/60">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="animate-fade-up [animation-delay:150ms]">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}

// ── Schools ──────────────────────────────────────────────────────────────────

function SchoolsMarquee() {
  return (
    <section className="border-b border-border bg-background py-10" aria-label="Supported medical schools">
      <p className="text-center text-sm font-medium text-text-muted">
        Tailored to your school, faculty and level — choose from {SCHOOLS.length} Nigerian universities at sign-up
      </p>
      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-10 pr-10">
          {[...SCHOOLS, ...SCHOOLS].map((name, i) => (
            <span key={i} className="whitespace-nowrap font-display text-lg font-bold text-text-faint" aria-hidden={i >= SCHOOLS.length}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ─────────────────────────────────────────────────────────────────

function Features() {
  return (
    <section id="features" className="scroll-mt-24 bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Everything in one place</Eyebrow>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            From first read to exam-ready.
          </h2>
          <p className="mt-5 text-lg text-text-muted">
            EdMira follows how you actually study: read a topic, test yourself, learn from your mistakes, and come back
            to what&apos;s weak.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-6">
          {/* Big: MCQs */}
          <article className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-8 md:col-span-4">
            <FeatureIcon><BrainCircuit /></FeatureIcon>
            <h3 className="mt-5 text-2xl font-bold tracking-tight">Practice questions with explained answers</h3>
            <p className="mt-3 max-w-lg text-text-muted">
              Topic-by-topic MCQs graded the moment you submit. Review every answer with an explanation, or just the ones
              you missed — then practise again.
            </p>
            <div className="mt-8 grid gap-2.5 sm:max-w-md">
              {[
                ['A', 'Left atrium', false],
                ['B', 'Right atrium', true],
                ['C', 'Interventricular septum', false],
              ].map(([letter, text, correct]) => (
                <div
                  key={String(letter)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                    correct ? 'border-success/40 bg-success-soft font-semibold text-success' : 'border-border bg-bg text-text-body'
                  }`}>
                  <span className={`grid size-7 place-items-center rounded-lg text-xs font-bold ${correct ? 'bg-success text-white dark:text-[#052e16]' : 'bg-surface-muted'}`}>
                    {letter}
                  </span>
                  {text}
                  {correct ? <CheckCircle2 className="ml-auto size-4" /> : null}
                </div>
              ))}
              <p className="mt-1 rounded-xl bg-primary-soft px-4 py-3 text-sm text-text-body">
                <span className="font-semibold text-primary">Explanation · </span>
                The SA node lies in the wall of the right atrium, near the opening of the superior vena cava.
              </p>
            </div>
          </article>

          {/* Focus areas */}
          <article className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#78350f] to-[#3a2c0b] p-8 text-white md:col-span-2">
            <div className="grid size-12 place-items-center rounded-2xl bg-white/10 text-[#fbbf24]">
              <Target className="size-6" />
            </div>
            <h3 className="mt-5 text-2xl font-bold tracking-tight">Focus areas</h3>
            <p className="mt-3 text-white/75">
              Any topic averaging under 60% is flagged automatically, so you always know what to revisit before exams.
            </p>
            <div className="mt-8 space-y-3">
              {[
                ['Enzymes & Kinetics', 42],
                ['Cranial Nerves', 55],
              ].map(([t, s]) => (
                <div key={String(t)} className="rounded-xl bg-black/20 p-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{t}</span>
                    <span className="text-[#fbbf24]">{s}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#fbbf24]" style={{ width: `${s}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <SmallFeature icon={<BookOpenText />} title="Study notes by topic" className="md:col-span-2">
            Concise, structured notes with key points for every topic — read in minutes, revise in seconds.
          </SmallFeature>
          <SmallFeature icon={<LineChart />} title="Progress you can see" className="md:col-span-2">
            Quizzes taken, average score, topics practised and your full quiz history, updated after every quiz.
          </SmallFeature>
          <SmallFeature icon={<Flame />} title="Daily streaks" className="md:col-span-2">
            Practise once a day to grow your streak. Small, steady sessions beat last-minute cramming.
          </SmallFeature>
          <SmallFeature icon={<FileText />} title="Slides, videos & textbooks" className="md:col-span-3">
            Lecture slides, videos, textbooks and downloadable PDF notes, attached to the exact course and topic —
            including materials from your own school.
          </SmallFeature>
          <SmallFeature icon={<Newspaper />} title="Campus news" className="md:col-span-3">
            Admissions, exams, scholarships and calendar updates from Nigerian universities, right on your dashboard.
          </SmallFeature>
        </div>
      </div>
    </section>
  );
}

function FeatureIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary [&_svg]:size-6">{children}</div>
  );
}

function SmallFeature({
  icon,
  title,
  children,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={`rounded-3xl border border-border bg-surface p-7 transition-shadow hover:shadow-card ${className}`}>
      <FeatureIcon>{icon}</FeatureIcon>
      <h3 className="mt-5 text-lg font-bold tracking-tight">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-text-muted">{children}</p>
    </article>
  );
}

// ── How it works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Tell us your school and level',
      body: 'Sign up with your institution, faculty, department and level. EdMira puts the courses for you first — every other course stays one click away.',
    },
    {
      n: '02',
      title: 'Study a topic',
      body: 'Pick a course, open a topic and read its notes and key points. Attached slides, videos and textbooks are right there too.',
    },
    {
      n: '03',
      title: 'Practise, review, repeat',
      body: 'Take the topic quiz, see your score instantly, read the explanations and come back to your focus areas until they’re strong.',
    },
  ];
  return (
    <section id="how-it-works" className="relative scroll-mt-24 overflow-hidden bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Three steps. Every topic.</h2>
        </div>
        <div className="relative mt-16">
          <Heartbeat className="absolute left-0 right-0 top-6 hidden h-12 text-primary/25 lg:block" />
          <ol className="relative grid gap-10 lg:grid-cols-3 lg:gap-8">
            {steps.map(step => (
              <li key={step.n} className="relative">
                <div className="grid size-14 place-items-center rounded-2xl bg-action font-display text-lg font-extrabold text-on-action shadow-[0_10px_30px_-10px_var(--action)]">
                  {step.n}
                </div>
                <h3 className="mt-6 text-xl font-bold tracking-tight">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ── Medical review ───────────────────────────────────────────────────────────

function Quality() {
  const pipeline = [
    { icon: <FileText />, title: 'Written', body: 'Notes and questions are prepared for each course and topic.' },
    { icon: <Stethoscope />, title: 'Medically reviewed', body: 'A medical reviewer checks every question and explanation.' },
    { icon: <ShieldCheck />, title: 'Published', body: 'Only approved content ever reaches students.' },
    { icon: <ClipboardCheck />, title: 'Reported & improved', body: 'Spot a problem? Flag any question and the team reviews it.' },
  ];
  return (
    <section id="quality" className="relative scroll-mt-24 overflow-hidden bg-brand-950 py-24 text-white sm:py-32">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(80%_60%_at_100%_0%,rgba(26,63,214,0.45),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <Eyebrow light>Content you can trust</Eyebrow>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Reviewed before it reaches you.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70">
            Questions can&apos;t be published until they pass medical review. Answers are graded on the server and never
            sent to your device before you submit — so every score is honest.
          </p>
          <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/60">
            EdMira is an educational platform. It does not replace professional medical training, hospital protocols or
            licensed clinical supervision.{' '}
            <a href="/disclaimer" className="font-semibold text-mint hover:underline">
              Read the medical disclaimer
            </a>
          </p>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2">
          {pipeline.map((step, i) => (
            <li key={step.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="grid size-11 place-items-center rounded-xl bg-mint/15 text-mint [&_svg]:size-5">{step.icon}</div>
                <span className="font-display text-sm font-bold text-white/30">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-[15px] text-white/60">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ── App gallery ──────────────────────────────────────────────────────────────

function AppGallery() {
  return (
    <section className="overflow-hidden bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Eyebrow>On Android</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Take EdMira to class.</h2>
            <p className="mt-4 text-lg text-text-muted">
              The same courses, quizzes and progress in your pocket — with downloads for offline reading.
            </p>
          </div>
          <ButtonLink href={SITE.playStoreUrl} target="_blank" rel="noopener noreferrer" variant="secondary" icon={<Smartphone className="size-4" />}>
            Get it on Google Play
          </ButtonLink>
        </div>
      </div>
      <div className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] [scrollbar-width:thin]">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Image
            key={i}
            src={`/screens/screen-${i}.png`}
            alt={`EdMira Android app screenshot ${i}`}
            width={1080}
            height={1920}
            sizes="(min-width: 640px) 270px, 70vw"
            className="w-[70vw] max-w-[270px] shrink-0 snap-start rounded-[28px] shadow-lift sm:w-[270px]"
          />
        ))}
      </div>
    </section>
  );
}

// ── Everywhere ───────────────────────────────────────────────────────────────

function Everywhere() {
  const items = [
    { icon: <Globe2 />, title: 'Web & Android', body: 'Log in anywhere. Your quiz history and progress live on your account.' },
    { icon: <Languages />, title: 'English, Hausa & Yorùbá', body: 'Use EdMira in the language you’re most comfortable with.' },
    { icon: <Moon />, title: 'Light & dark mode', body: 'Easy on the eyes for late-night revision.' },
    { icon: <Users />, title: `Shaped by ${SITE.foundingTesters} testers`, body: 'Built with feedback from our founding student testers.' },
  ];
  return (
    <section className="bg-background py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map(item => (
          <div key={item.title} className="rounded-3xl bg-bg p-7">
            <div className="text-primary [&_svg]:size-7">{item.icon}</div>
            <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
            <p className="mt-2 text-[15px] text-text-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Final CTA ────────────────────────────────────────────────────────────────

function FinalCta() {
  return (
    <section className="bg-bg px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-brand-800 px-6 py-16 text-center text-white sm:px-16 sm:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_90%_at_50%_0%,#1a3fd6,transparent)]" />
        <Heartbeat className="absolute inset-x-0 bottom-10 -z-10 h-14 text-mint/30" />
        <h2 className="mx-auto max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
          Your next exam starts with one topic.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">
          Create your account in under two minutes and take your first quiz today.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/signup" variant="hero" size="lg">
            Create your account <ArrowRight className="size-4" />
          </ButtonLink>
          <ButtonLink href="/login" variant="heroOutline" size="lg">
            Log in
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
