import type { Metadata } from 'next';
import { PageHero, Prose } from '@/components/marketing/PageHero';
import { en } from '@/localization/languages/en';
import { fmt } from '@/localization/format';

export const metadata: Metadata = { title: 'Medical disclaimer', description: 'EdMira is for academic learning only.' };

export default function DisclaimerPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Medical disclaimer" />
      <Prose>
        {/* Same wording as the disclaimer shown in the app. */}
        <p className="text-lg">{fmt(en.disclaimer.body, { app: 'EdMira' })}</p>
      </Prose>
    </>
  );
}
