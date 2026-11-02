import { toUser } from '@/data/auth/dto';
import type { AuthTokens, User } from '@/data/auth/types';
import { SESSION_KEYS, STORAGE_KEYS } from './keys';
import { webStorage } from './webStorage';

/**
 * Tokens and the cached profile of the logged-in student.
 *
 * Only the data layer (api/client.ts, data/auth) should write here; pages
 * read the user through data/auth/authService.ts or the useSession() hook.
 */
export const sessionStore = {
  getAccessToken: () => webStorage.getItem(STORAGE_KEYS.accessToken),

  getRefreshToken: () => webStorage.getItem(STORAGE_KEYS.refreshToken),

  setTokens: async ({ accessToken, refreshToken }: AuthTokens) => {
    await webStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
    if (refreshToken) {
      await webStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    }
    if (!(await webStorage.getItem(STORAGE_KEYS.sessionStartedAt))) {
      await webStorage.setItem(STORAGE_KEYS.sessionStartedAt, String(Date.now()));
    }
  },

  /** When this session logged in (ms since epoch), or null. */
  getStartedAt: async () => {
    const raw = await webStorage.getItem(STORAGE_KEYS.sessionStartedAt);
    return raw ? Number(raw) : null;
  },

  getUser: async (): Promise<User | null> => {
    try {
      const raw = await webStorage.getItem(STORAGE_KEYS.user);
      return raw ? toUser(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: User) => webStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user)),

  clear: () => webStorage.multiRemove(SESSION_KEYS),
};
