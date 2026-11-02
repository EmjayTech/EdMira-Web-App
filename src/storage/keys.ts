/**
 * Every localStorage key the web app uses, in one place. Names match the
 * mobile app's AsyncStorage keys so both apps describe the same data.
 *
 * Don't change a value without a migration, or students get logged out /
 * lose data saved in their browser.
 */
export const STORAGE_KEYS = {
  // ── Session (cleared on logout) ────────────────────────────────────────────
  accessToken: 'token',
  refreshToken: 'refreshToken',
  /** Cached profile of the logged-in user (app `User` shape). */
  user: 'user',
  /** When this browser session logged in (ms), for the 8-hour session limit. */
  sessionStartedAt: 'sessionStartedAt',

  // ── Device preferences (kept across logouts) ───────────────────────────────
  hasSeenOnboarding: 'hasSeenOnboarding',
  themeMode: '@app_theme_mode',
  language: '@app_language',
  rememberEmail: 'saveEmailToggle',
  savedEmail: 'savedEmail',
  /** Shown once per device, before the first Home visit. */
  medicalDisclaimerSeen: 'medicalDisclaimerSeen.v1',

  // ── Per-account (always used through scopedStorage.scopedKey) ─────────────
  appTourSeen: 'appTourSeen.v1',
  quizAttempts: 'learning.attempts.v1',
  questionReports: 'learning.reports.v1',
  feedback: 'learning.feedback.v1',
  outbox: 'learning.outbox.v1',
  /** Study materials saved for offline reading (files live in documents/downloads). */
  downloads: 'learning.downloads.v1',
} as const;

/** Keys removed on logout. */
export const SESSION_KEYS = [
  STORAGE_KEYS.accessToken,
  STORAGE_KEYS.refreshToken,
  STORAGE_KEYS.user,
  STORAGE_KEYS.sessionStartedAt,
];

/**
 * Keys from older builds that must not linger on the device. The biometric
 * login used to keep the password here in plain text; it now lives in the
 * Keychain / Keystore (see secureCredentials.ts).
 */
export const LEGACY_KEYS = ['biometric_email', 'biometric_password', 'biometrics_enabled'];
