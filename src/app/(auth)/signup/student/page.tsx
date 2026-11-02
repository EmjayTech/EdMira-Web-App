import type { Metadata } from 'next';
import { RegistrationForm } from './RegistrationForm';

export const metadata: Metadata = { title: 'Student sign-up' };

export default function StudentSignupPage() {
  return <RegistrationForm />;
}
