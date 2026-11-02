/**
 * ─── Backend switchboard ─────────────────────────────────────────────────────
 *
 * The ONE place to point the web app at a backend. Mirrors
 * EdMira-MobileApp/src/config/backend.ts; see docs/BACKEND_INTEGRATION.md in
 * the mobile repo for the API contract.
 */

/**
 * Where data comes from — like the mobile app, the deployed backend by default:
 *   'production' — https://edmira-backend.onrender.com (default, dev and live)
 *   'local'      — the backend running on this computer
 *                  (EdMira-Backend: `yarn dev:memory` or `yarn start:dev`)
 *   'mock'       — sample data in the browser; only if explicitly set
 *
 * Override with NEXT_PUBLIC_API_TARGET in .env.local.
 */
export type ApiTarget = 'mock' | 'local' | 'production';

/** True in `next dev` — the web equivalent of React Native's `__DEV__`. */
export const IS_DEV = process.env.NODE_ENV !== 'production';

const fromEnv = process.env.NEXT_PUBLIC_API_TARGET as ApiTarget | undefined;

export const API_TARGET: ApiTarget =
  fromEnv === 'mock' || fromEnv === 'local' || fromEnv === 'production'
    ? fromEnv
    : 'production';

const API_URLS = {
  production: process.env.NEXT_PUBLIC_API_URL || 'https://edmira-backend.onrender.com',
  local: process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:4000',
};

const mock = API_TARGET === 'mock';

export const BACKEND = {
  baseURL: API_TARGET === 'local' ? API_URLS.local : API_URLS.production,

  /** 60s — Render free instances can take a while to wake up. */
  timeoutMs: 60000,

  /**
   * Per-area override: set one to `true` to keep that area on sample data
   * while the rest uses the server.
   */
  useMock: {
    /** Login, sign-up, email verification, password reset, profile, logout. */
    auth: mock,
    /** Editing profile + academic info. */
    profile: mock,
    /** Institution / faculty / department / level lists used at sign-up. */
    reference: mock,
    /** Courses, topics, study material, search. */
    content: mock,
    /** Quiz questions, submission/grading, attempt history. */
    quizzes: mock,
    /** Question reports + product feedback. */
    feedback: mock,
    /** Campus news. */
    news: mock,
  },

  /**
   * Access tokens last 15 minutes. On a 401 the app refreshes once with
   * POST /auth/refresh before logging the student out.
   */
  refreshTokens: true,
};
