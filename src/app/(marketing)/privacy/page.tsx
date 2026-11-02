import type { Metadata } from 'next';
import { PageHero, Prose } from '@/components/marketing/PageHero';
import { SITE } from '@/config/site';

export const metadata: Metadata = { title: 'Privacy Policy', description: 'How EdMira collects and uses your data.' };

// TODO: plain-language draft based on what the app actually does — have it
// reviewed against the Nigeria Data Protection Act (NDPA) 2023 before launch.
export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" intro="What we collect, why we collect it, and the choices you have." />
      <Prose>
        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Account details</strong> — your name, username, email address and phone number.
          </li>
          <li>
            <strong>Academic details</strong> — your institution, faculty, department, programme and level, so we can
            show the courses for you first.
          </li>
          <li>
            <strong>Learning activity</strong> — the quizzes you take, your answers and scores, so we can show your
            progress, history and focus areas.
          </li>
          <li>
            <strong>Reports and feedback</strong> you choose to send us.
          </li>
        </ul>

        <h2>How we use it</h2>
        <p>
          We use your data to run your account, tailor courses to your level and school, grade quizzes, show your
          progress, send verification and password-reset codes by email, and improve EdMira. We do not sell your
          personal data.
        </p>

        <h2>What stays in your browser</h2>
        <p>
          The web app stores your login tokens and preferences (language, light or dark mode) in your browser&apos;s
          local storage so you stay signed in. Logging out removes your session from the browser. For your security,
          sessions end after a period of inactivity and after 8 hours.
        </p>

        <h2>Who we share it with</h2>
        <p>
          We use trusted service providers to host our servers and send emails. They process data only on our behalf.
          We may disclose information if required by law.
        </p>

        <h2>Your choices</h2>
        <p>
          You can update your name and academic details from your profile at any time. To access, correct or delete
          your account and data, email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy? Email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
        </p>
      </Prose>
    </>
  );
}
