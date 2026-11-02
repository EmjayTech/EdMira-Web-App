'use client';

import { ReactNode } from 'react';
import { LocalizationProvider } from '@/localization/LocalizationContext';
import { SessionProvider } from '@/session/SessionProvider';
import { ThemeProvider } from '@/theme/ThemeContext';
import { ToastProvider } from '@/components/ui/Toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocalizationProvider>
        <ToastProvider>
          <SessionProvider>{children}</SessionProvider>
        </ToastProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
