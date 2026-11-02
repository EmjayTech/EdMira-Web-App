import { LanguageCode, LanguageInfo, TranslationKeys } from '@/types/localization';
import { en } from './en';
import { ha } from './ha';
import { yo } from './yo';

export const translations: Record<LanguageCode, TranslationKeys> = { en, ha, yo };

export const languages: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', locale: 'en-NG', isRTL: false },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', locale: 'ha-NG', isRTL: false },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', locale: 'yo-NG', isRTL: false },
];

export const defaultLanguage: LanguageCode = 'en';
export const fallbackLanguage: LanguageCode = 'en';
