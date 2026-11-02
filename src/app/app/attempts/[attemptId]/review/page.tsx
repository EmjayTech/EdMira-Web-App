import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ReviewView } from './ReviewView';

export const metadata: Metadata = { title: 'Review answers' };

export default function ReviewPage() {
  return (
    <Suspense>
      <ReviewView />
    </Suspense>
  );
}
