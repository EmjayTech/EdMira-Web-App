import { mockApiError, mockDelay } from '@/api/mock';
import { AuthRepository, ProfileRepository } from '../repository';
import { User } from '../types';

/**
 * Local stand-in for auth while the server is unavailable (dev builds only —
 * see BACKEND.useMock.auth).
 *
 * - Any email + password logs in as the demo student.
 * - Any 6-digit code verifies, except 000000 (to test the error state).
 */

export const MOCK_USER: User = {
  id: 'mock-user-1',
  firstName: 'Demo',
  lastName: 'User',
  username: 'demouser',
  email: 'demo@edmira.com',
  userType: 'STUDENT',
  studentProfile: {
    institution: 'University of Lagos',
    faculty: 'College of Medicine',
    department: 'Medicine and Surgery',
    levelType: 'Undergraduate',
    level: '300',
  },
};

const MOCK_TOKENS = { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };

let lastLoginEmail = MOCK_USER.email;

const checkCode = (code: string) =>
  code === '000000'
    ? Promise.reject(mockApiError(400, 'That code is invalid or has expired.'))
    : mockDelay(undefined, 500);

export const mockAuthRepository: AuthRepository & ProfileRepository = {
  login: ({ email }) => {
    lastLoginEmail = email;
    return mockDelay(MOCK_TOKENS, 500);
  },

  getProfile: () => mockDelay({ ...MOCK_USER, email: lastLoginEmail }),

  logout: () => mockDelay(undefined),

  signup: () => mockDelay(null, 500),

  verifyEmail: async (email, code) => {
    await checkCode(code);
    lastLoginEmail = email;
    return MOCK_TOKENS;
  },

  resendVerificationCode: () => mockDelay(undefined, 500),

  requestPasswordReset: () => mockDelay(undefined, 500),

  resetPassword: ({ code }) => checkCode(code),

  updateProfile: (update, current) => {
    const base = current ?? MOCK_USER;
    return mockDelay({
      ...base,
      ...update,
      studentProfile: {
        ...(base.studentProfile ?? { institution: '', department: '', level: '' }),
        ...update.studentProfile,
      },
    });
  },
};
