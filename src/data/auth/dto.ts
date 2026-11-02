/**
 * ─── Auth JSON shapes (DTOs) and mappers ─────────────────────────────────────
 *
 * If the backend's responses differ (field names, nesting, `_id` instead of
 * `id`, …), adapt THIS FILE ONLY — screens and services stay untouched.
 */

import { idOf } from '@/api/envelope';
import { AuthTokens, StudentProfile, User, UserType } from './types';

export interface StudentProfileDTO {
  institution?: string;
  faculty?: string;
  department?: string;
  levelType?: string;
  level?: string | number;
}

export interface UserDTO {
  id?: string | number;
  _id?: string | number;
  firstName?: string;
  lastName?: string;
  /** Some responses only carry a full name. */
  name?: string;
  username?: string;
  email: string;
  userType?: string;
  avatar?: string | null;
  avatarUrl?: string | null;
  profileImage?: string | null;
  countryCode?: string;
  phoneNumber?: string;
  /** How the backend stores it. */
  phone?: { countryCode?: string; number?: string } | null;
  studentProfile?: StudentProfileDTO | null;
}

/** POST /auth/login and POST /auth/signup. */
export interface AuthResponseDTO {
  accessToken?: string;
  /** Older name for the access token. */
  token?: string;
  refreshToken?: string;
  user?: UserDTO;
}

const toStudentProfile = (dto?: StudentProfileDTO | null): StudentProfile | undefined =>
  dto
    ? {
        institution: dto.institution ?? '',
        faculty: dto.faculty,
        department: dto.department ?? '',
        levelType: dto.levelType,
        level: dto.level != null ? String(dto.level) : '',
      }
    : undefined;

/** Tolerant: also accepts an already-mapped `User` (e.g. from the cache). */
export const toUser = (dto: UserDTO | User): User => {
  const raw = dto as UserDTO & Partial<User>;
  const [first = '', ...rest] = (raw.name ?? '').trim().split(/\s+/);
  return {
    id: idOf(raw),
    firstName: raw.firstName ?? first,
    lastName: raw.lastName ?? rest.join(' '),
    username: raw.username,
    email: raw.email,
    userType: (raw.userType?.toUpperCase() as UserType) ?? 'STUDENT',
    avatarUrl: raw.avatarUrl ?? raw.avatar ?? raw.profileImage ?? undefined,
    countryCode: raw.countryCode ?? raw.phone?.countryCode,
    phoneNumber: raw.phoneNumber ?? raw.phone?.number,
    studentProfile: toStudentProfile(raw.studentProfile),
  };
};

/** Null when the response carries no access token (e.g. sign-up that needs verification first). */
export const toAuthTokens = (dto: AuthResponseDTO | undefined): AuthTokens | null => {
  const accessToken = dto?.accessToken ?? dto?.token;
  return accessToken ? { accessToken, refreshToken: dto?.refreshToken } : null;
};
