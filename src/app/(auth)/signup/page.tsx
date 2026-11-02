import type { Metadata } from 'next';
import { AccountTypePicker } from './AccountTypePicker';

export const metadata: Metadata = {
  title: 'Create your account',
  description: 'Join EdMira — study notes, practice questions and progress tracking for Nigerian medical students.',
};

export default function SignupPage() {
  return <AccountTypePicker />;
}
