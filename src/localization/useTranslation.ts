'use client';

import { useContext } from 'react';
import { LocalizationContext } from './LocalizationContext';

export { fmt, fmtParts, plural } from './format';

export const useTranslation = () => {
  const context = useContext(LocalizationContext);

  if (context === undefined) {
    throw new Error('useTranslation must be used within a LocalizationProvider');
  }

  return context;
};
