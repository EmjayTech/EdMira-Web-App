'use client';

import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '@/storage/keys';
import { webStorage } from '@/storage/webStorage';
import { LanguageCode, LanguageInfo, TranslationKeys } from '@/types/localization';
import { translations, languages, defaultLanguage, fallbackLanguage } from './languages';
import { webEn, WebStrings } from './web';

interface LocalizationContextValue {
  /** Strings for the active language, e.g. `t.auth.login.title`. */
  t: TranslationKeys;
  /** Web-only strings (English until translated). */
  w: WebStrings;
  language: LanguageCode;
  languageInfo: LanguageInfo;
  setLanguage: (code: LanguageCode) => void;
  availableLanguages: LanguageInfo[];
}

export const LocalizationContext = createContext<LocalizationContextValue | undefined>(
  undefined,
);

let activeStrings: TranslationKeys = translations[defaultLanguage];

/**
 * Strings for the current language, for non-React code (data services, error
 * mappers). Components should use `useTranslation()` so they re-render.
 */
export const currentStrings = (): TranslationKeys => activeStrings;

const isLanguageCode = (code: string | null | undefined): code is LanguageCode =>
  !!code && languages.some(lang => lang.code === code);

/**
 * First visit: use the browser's language if it is Hausa or Yorùbá, otherwise
 * English. After that the user's own choice always wins.
 */
const getBrowserLanguage = (): LanguageCode => {
  const match = (navigator.languages ?? [navigator.language])
    .map(tag => tag.split('-')[0])
    .find(isLanguageCode);
  return match ?? defaultLanguage;
};

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(defaultLanguage);

  useEffect(() => {
    webStorage
      .getItem(STORAGE_KEYS.language)
      .then(saved => setLanguageState(isLanguageCode(saved) ? saved : getBrowserLanguage()));
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    webStorage.setItem(STORAGE_KEYS.language, code);
  }, []);

  const strings = translations[language] ?? translations[fallbackLanguage];

  // For non-React code (error messages in services).
  useEffect(() => {
    activeStrings = strings;
  }, [strings]);

  const value = useMemo<LocalizationContextValue>(() => {
    const languageInfo = languages.find(l => l.code === language) ?? languages[0];
    return {
      t: strings,
      w: webEn,
      language,
      languageInfo,
      setLanguage,
      availableLanguages: languages,
    };
  }, [language, strings, setLanguage]);

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}
