import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { unwrap } from '@/api/envelope';
import { AuthResponseDTO, UserDTO, toAuthTokens, toUser } from '../dto';
import { AuthRepository, ProfileRepository } from '../repository';

/**
 * Real-backend implementation of auth + profile. Endpoint paths live in
 * src/api/endpoints.ts; JSON mapping lives in ../dto.ts.
 */
export const apiAuthRepository: AuthRepository & ProfileRepository = {
  login: async credentials => {
    const res = await apiClient.post(ENDPOINTS.login, credentials);
    const tokens = toAuthTokens(unwrap<AuthResponseDTO>(res.data));
    if (!tokens) throw new Error('The server did not return an access token.');
    return tokens;
  },

  getProfile: async () => {
    const res = await apiClient.get(ENDPOINTS.profile);
    return toUser(unwrap<UserDTO>(res.data));
  },

  logout: async () => {
    await apiClient.post(ENDPOINTS.logout);
  },

  signup: async input => {
    const res = await apiClient.post(ENDPOINTS.signup, input);
    return toAuthTokens(unwrap<AuthResponseDTO>(res.data));
  },

  verifyEmail: async (email, code) => {
    const res = await apiClient.post(ENDPOINTS.verifyEmail, { email, code });
    return toAuthTokens(unwrap<AuthResponseDTO>(res.data));
  },

  resendVerificationCode: async email => {
    await apiClient.post(ENDPOINTS.resendOtp, { email });
  },

  requestPasswordReset: async email => {
    await apiClient.post(ENDPOINTS.forgotPassword, { email });
  },

  resetPassword: async reset => {
    await apiClient.post(ENDPOINTS.resetPassword, reset);
  },

  updateProfile: async update => {
    const res = await apiClient.patch(ENDPOINTS.profile, update);
    return toUser(unwrap<UserDTO>(res.data));
  },
};
