import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { BACKEND } from '@/config/backend';
import { sessionStore } from '@/storage/sessionStore';
import { unwrap } from './envelope';
import { ENDPOINTS, PUBLIC_AUTH_ENDPOINTS } from './endpoints';

/**
 * ─── The ONE HTTP client for every EdMira API call ───────────────────────────
 *
 * - Base URL + timeout come from src/config/backend.ts.
 * - The access token is attached to every request automatically.
 * - A 401 on a logged-in request means the session is over: if
 *   BACKEND.refreshTokens is on we try one refresh first, otherwise (or if
 *   that fails) every `onSessionExpired` listener is told, and the
 *   SessionManager logs the student out.
 *
 * Repositories import `apiClient`; screens never do.
 */
export const apiClient = axios.create({
  baseURL: BACKEND.baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: BACKEND.timeoutMs,
});

apiClient.interceptors.request.use(async config => {
  const token = await sessionStore.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Session expiry ───────────────────────────────────────────────────────────

type Listener = () => void;
const expiryListeners = new Set<Listener>();

/** Subscribe to "the server rejected our token". Returns an unsubscribe. */
export const onSessionExpired = (listener: Listener) => {
  expiryListeners.add(listener);
  return () => {
    expiryListeners.delete(listener);
  };
};

const notifySessionExpired = () => expiryListeners.forEach(listener => listener());

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

let refreshing: Promise<string | null> | null = null;

/** Single-flight: parallel 401s share one refresh request. */
const refreshAccessToken = () => {
  refreshing ??= (async () => {
    try {
      const refreshToken = await sessionStore.getRefreshToken();
      if (!refreshToken) return null;
      // Plain axios, so this call doesn't re-enter these interceptors.
      // The backend reads the refresh token from the Authorization header.
      const res = await axios.post(ENDPOINTS.refreshToken, undefined, {
        baseURL: BACKEND.baseURL,
        timeout: BACKEND.timeoutMs,
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      const body = unwrap<any>(res.data);
      const accessToken = body?.accessToken ?? body?.token;
      if (!accessToken) return null;
      await sessionStore.setTokens({
        accessToken,
        refreshToken: body?.refreshToken ?? refreshToken,
      });
      return accessToken as string;
    } catch {
      return null;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
};

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const isPublicAuthCall = PUBLIC_AUTH_ENDPOINTS.includes(config?.url ?? '');
    const sentToken = !!config?.headers?.Authorization;

    if (error.response?.status !== 401 || !config || isPublicAuthCall || !sentToken) {
      return Promise.reject(error);
    }

    if (BACKEND.refreshTokens && !config._retried) {
      const accessToken = await refreshAccessToken();
      if (accessToken) {
        config._retried = true;
        config.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(config);
      }
    }

    notifySessionExpired();
    return Promise.reject(error);
  },
);
