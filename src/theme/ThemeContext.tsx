'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/storage/keys';
import { webStorage } from '@/storage/webStorage';
import type { ThemeMode } from '@/types/theme';

/**
 * Light / dark / system, like the mobile app's Appearance setting. The
 * colours themselves are CSS variables in app/globals.css (copied from the
 * mobile palettes); this only sets `data-theme` on <html>.
 */
interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({ mode: 'system', setMode: () => {} });

const isMode = (value: string | null): value is ThemeMode =>
  value === 'light' || value === 'dark' || value === 'system';

const apply = (mode: ThemeMode) => {
  const root = document.documentElement;
  if (mode === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', mode);
};

/**
 * Runs before first paint (inlined in <head>) so a saved dark mode doesn't
 * flash light. Keep the key in sync with STORAGE_KEYS.themeMode.
 */
export const themeBootScript = `try{var m=localStorage.getItem('${STORAGE_KEYS.themeMode}');if(m==='light'||m==='dark')document.documentElement.setAttribute('data-theme',m)}catch(e){}`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    webStorage.getItem(STORAGE_KEYS.themeMode).then(saved => {
      if (isMode(saved)) setModeState(saved);
    });
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    apply(next);
    webStorage.setItem(STORAGE_KEYS.themeMode, next);
  }, []);

  return <ThemeContext.Provider value={{ mode, setMode }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
