import { BACKEND, IS_DEV } from '@/config/backend';
import { sessionStore } from '@/storage/sessionStore';
import { apiAuthRepository } from './api/apiRepository';
import { mockAuthRepository } from './mock/mockRepository';
import { AuthRepository, ProfileRepository } from './repository';
import { Credentials, PasswordReset, ProfileUpdate, SignupInput, User } from './types';

/**
 * ─── Auth service (the ONLY auth/profile entry point for screens) ────────────
 *
 * Each area picks its data source from src/config/backend.ts → BACKEND.useMock.
 * Auth is never mocked in release builds.
 */

const auth: AuthRepository =
  IS_DEV && BACKEND.useMock.auth ? mockAuthRepository : apiAuthRepository;
const profile: ProfileRepository = BACKEND.useMock.profile
  ? mockAuthRepository
  : apiAuthRepository;

/** How long logout waits for the server before clearing the session anyway. */
const LOGOUT_TIMEOUT_MS = 3000;

// ── Session ──────────────────────────────────────────────────────────────────

/** Logs in, stores the tokens and caches the profile. */
export const login = async (credentials: Credentials): Promise<User> => {
  const tokens = await auth.login(credentials);
  await sessionStore.setTokens(tokens);
  const user = await auth.getProfile();
  await sessionStore.setUser(user);
  return user;
};

/**
 * Tells the server (without holding the student up if it's slow), then
 * clears the local session. Never throws.
 */
export const logout = async () => {
  // The token must still be in storage when the request is sent.
  let timer: ReturnType<typeof setTimeout> | undefined;
  await Promise.race([
    auth.logout().catch(() => {}),
    new Promise<void>(resolve => {
      timer = setTimeout(resolve, LOGOUT_TIMEOUT_MS);
    }),
  ]);
  if (timer) clearTimeout(timer);
  await sessionStore.clear();
};

/** The cached profile of the logged-in student, or null. */
export const getCurrentUser = () => sessionStore.getUser();

/** Re-fetches the profile from the server and updates the cache. */
export const refreshProfile = async () => {
  const user = await auth.getProfile();
  await sessionStore.setUser(user);
  return user;
};

// ── Sign-up & verification ───────────────────────────────────────────────────

export const signup = async (input: SignupInput) => {
  const tokens = await auth.signup(input);
  if (tokens) await sessionStore.setTokens(tokens);
};

/**
 * Verifies the sign-up code. The backend creates the account and returns
 * tokens, so the student is logged in. Returns the profile, or null if the
 * backend didn't log them in (they'll go to Login instead).
 */
export const verifyEmail = async (email: string, code: string): Promise<User | null> => {
  const tokens = await auth.verifyEmail(email, code);
  if (!tokens) return null;
  await sessionStore.setTokens(tokens);
  return refreshProfile();
};

export const resendVerificationCode = (email: string) => auth.resendVerificationCode(email);

// ── Password reset ───────────────────────────────────────────────────────────

/** Emails a reset code (also used for "resend code"). */
export const requestPasswordReset = (email: string) => auth.requestPasswordReset(email);

export const resetPassword = (reset: PasswordReset) => auth.resetPassword(reset);

// ── Profile ──────────────────────────────────────────────────────────────────

/** Saves profile + academic info (US-03, US-04) and updates the cache. */
export const updateProfile = async (update: ProfileUpdate): Promise<User> => {
  const updated = await profile.updateProfile(update, await sessionStore.getUser());
  await sessionStore.setUser(updated);
  return updated;
};
