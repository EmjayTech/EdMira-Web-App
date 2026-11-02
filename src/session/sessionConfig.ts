/**
 * Session timeout settings — the same rules as the mobile app
 * (EdMira-MobileApp/src/session/sessionConfig.ts).
 *
 * Idle timeout: after `idleTimeoutMs` with no activity, the student sees an
 * "Are you still there?" modal. If they don't respond within
 * `warningDurationMs`, they're logged out.
 *
 * Absolute timeout: `maxSessionMs` after login the session ends even if the
 * student is active, and they must log in again.
 */
export const SESSION_CONFIG = {
  idleTimeoutMs: 5 * 60 * 1000, // 5 minutes
  warningDurationMs: 60 * 1000, // 60-second countdown in the modal
  maxSessionMs: 8 * 60 * 60 * 1000, // 8 hours

  /** Path prefix that requires a logged-in session. */
  authenticatedPrefix: '/app',

  /** Where to send the student after logout. */
  loggedOutRoute: '/login',
};
