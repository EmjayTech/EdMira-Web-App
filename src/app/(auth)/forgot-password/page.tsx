import type { Metadata } from 'next';
import { ForgotPasswordFlow } from './ForgotPasswordFlow';

export const metadata: Metadata = { title: 'Reset your password', robots: { index: false } };

export default function ForgotPasswordPage() {
  return <ForgotPasswordFlow />;
}
