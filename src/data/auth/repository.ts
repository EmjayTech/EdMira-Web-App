import {
  AuthTokens,
  Credentials,
  PasswordReset,
  ProfileUpdate,
  SignupInput,
  User,
} from './types';

/**
 * Everything the auth + profile screens need from a data source.
 *
 * Two implementations exist:
 *   - mock/mockRepository.ts — local stand-in (works with no server)
 *   - api/apiRepository.ts   — the real EdMira backend
 *
 * authService.ts picks one per area based on src/config/backend.ts.
 * Screens never import a repository directly.
 */

export interface AuthRepository {
  /** Returns tokens; the profile is fetched separately with getProfile(). */
  login(credentials: Credentials): Promise<AuthTokens>;
  getProfile(): Promise<User>;
  logout(): Promise<void>;
  /** Tokens only if the backend logs the student straight in. */
  signup(input: SignupInput): Promise<AuthTokens | null>;
  /** Creates the account; returns tokens so the student is logged straight in. */
  verifyEmail(email: string, code: string): Promise<AuthTokens | null>;
  resendVerificationCode(email: string): Promise<void>;
  /** Emails a reset code. */
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(reset: PasswordReset): Promise<void>;
}

export interface ProfileRepository {
  /** `current` lets the mock merge edits; the API returns the updated user. */
  updateProfile(update: ProfileUpdate, current: User | null): Promise<User>;
}
