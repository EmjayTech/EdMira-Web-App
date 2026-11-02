import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CoursesView } from './CoursesView';

export const metadata: Metadata = { title: 'Courses' };

export default function CoursesPage() {
  return (
    <Suspense>
      <CoursesView />
    </Suspense>
  );
}
