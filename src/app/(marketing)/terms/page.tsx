import type { Metadata } from 'next';
import { PageHero, Prose } from '@/components/marketing/PageHero';
import { SITE } from '@/config/site';

export const metadata: Metadata = { title: 'Terms of Service', description: 'The terms for using EdMira.' };

// TODO: plain-language draft — have it reviewed by a lawyer before launch.
export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" intro="The rules for using EdMira on the web and on Android." />
      <Prose>
        <h2>Using EdMira</h2>
        <p>
          EdMira is an educational platform for medical and health-sciences students. By creating an account you agree
          to these terms and to our <a href="/privacy">Privacy Policy</a>.
        </p>

        <h2>Your account</h2>
        <ul>
          <li>Give accurate information when you sign up and keep your password secret.</li>
          <li>You are responsible for activity on your account. Tell us straight away if you think it has been misused.</li>
          <li>One person per account — don&apos;t share your login.</li>
        </ul>

        <h2>Acceptable use</h2>
        <ul>
          <li>Don&apos;t copy, resell or republish EdMira&apos;s notes, questions or explanations.</li>
          <li>Don&apos;t try to access other students&apos; data, bypass grading or disrupt the service.</li>
          <li>Use the report and feedback tools in good faith.</li>
        </ul>

        <h2>Educational use only</h2>
        <p>
          EdMira does not replace professional medical training, hospital protocols, licensed clinical supervision or
          direct healthcare consultation. See the <a href="/disclaimer">medical disclaimer</a>.
        </p>

        <h2>Content and availability</h2>
        <p>
          We work hard to keep content accurate and reviewed, but we can&apos;t guarantee it is free of errors. We may
          change, add or remove features and content, and the service may sometimes be unavailable.
        </p>

        <h2>Ending your account</h2>
        <p>
          You can stop using EdMira at any time and ask us to delete your account. We may suspend accounts that break
          these terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms? Email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
        </p>
      </Prose>
    </>
  );
}
