import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyEmailForm } from './VerifyEmailForm';

export const metadata: Metadata = { title: 'Verify your email', robots: { index: false } };

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
