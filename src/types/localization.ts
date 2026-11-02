import type { en } from '@/localization/languages/en';

/** Nigerian languages supported by the app. English is the default. */
export type LanguageCode = 'en' | 'ha' | 'yo';

export interface LanguageInfo {
  code: LanguageCode;
  /** Name in English, e.g. "Hausa". */
  name: string;
  /** Name in the language itself, e.g. "Yorùbá" – what the picker shows first. */
  nativeName: string;
  /** BCP-47 tag used for number/date formatting. */
  locale: string;
  isRTL: boolean;
}

type DeepStrings<T> = { [K in keyof T]: T[K] extends string ? string : DeepStrings<T[K]> };

/**
 * Shape of a language file. English (en.ts) is the source of truth; every other
 * language must provide exactly the same keys, which TypeScript enforces.
 */
export type TranslationKeys = DeepStrings<typeof en>;
