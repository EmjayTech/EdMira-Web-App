import { Plus } from 'lucide-react';

export const FAQ = [
  {
    q: 'Who is EdMira for?',
    a: 'EdMira is built for medical and health-sciences students in Nigerian universities — MBBS, dentistry, nursing, pharmacy, physiotherapy, medical laboratory science and more. You choose your school, faculty, department and level when you sign up, and the courses for you come first.',
  },
  {
    q: 'Can I use EdMira on my laptop and my phone?',
    a: 'Yes. Log in on the web at edmira.org or with the Android app using the same account. Your quiz attempts are saved to your account, so your progress and focus areas follow you.',
  },
  {
    q: 'Who writes and checks the questions?',
    a: 'Content is prepared for each course and topic and must pass medical review before it is published. If you spot a problem, use “Report this question” and the content team will review it.',
  },
  {
    q: 'How are focus areas worked out?',
    a: 'Any topic where your average practice score is below 60% is flagged as a focus area. It stays there until your average reaches 60%. It reflects your EdMira quiz results only, not your overall knowledge.',
  },
  {
    q: 'Which languages does EdMira support?',
    a: 'The app works in English, Hausa and Yorùbá. Medical terms and course titles stay in English, as they are taught that way.',
  },
  {
    q: 'Is EdMira a substitute for clinical training?',
    a: 'No. EdMira is for academic learning only. Never apply information from EdMira directly to real patient care without proper professional authorisation and clinical supervision.',
  },
];

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-border rounded-3xl border border-border bg-surface">
      {items.map(item => (
        <details key={item.q} className="group px-6 py-1 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[17px] font-semibold">
            {item.q}
            <Plus className="size-5 shrink-0 text-primary transition-transform duration-200 group-open:rotate-45" />
          </summary>
          <p className="pb-6 pr-10 leading-relaxed text-text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
