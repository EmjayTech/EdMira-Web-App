/**
 * Promise-based localStorage with the same shape as React Native's
 * AsyncStorage, so the storage modules read like the mobile app's.
 *
 * Every call is wrapped: storage can be unavailable (private windows,
 * blocked site data, server rendering) and must never crash a page.
 */
const store = () => (typeof window === 'undefined' ? null : window.localStorage);

export const webStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return store()?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },

  setItem: async (key: string, value: string) => {
    try {
      store()?.setItem(key, value);
    } catch {
      // Quota exceeded or storage blocked — nothing useful to do.
    }
  },

  multiRemove: async (keys: readonly string[]) => {
    try {
      keys.forEach(key => store()?.removeItem(key));
    } catch {
      // Storage blocked.
    }
  },
};
