import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { unwrap } from '@/api/envelope';
import { BACKEND } from '@/config/backend';
import { AcademicOptionsDTO, toAcademicOptions } from './dto';
import { DEFAULT_ACADEMIC_OPTIONS } from './mock/academicOptions';
import { AcademicOptions } from './types';

/**
 * ─── Reference service (sign-up option lists) ────────────────────────────────
 *
 * Switch: BACKEND.useMock.reference. The lists rarely change, so the result
 * is cached for the app session, and the bundled lists are used if the
 * server can't be reached.
 */

let cached: AcademicOptions | null = null;

export const getAcademicOptions = async (): Promise<AcademicOptions> => {
  if (BACKEND.useMock.reference) return DEFAULT_ACADEMIC_OPTIONS;
  if (cached) return cached;
  try {
    const res = await apiClient.get(ENDPOINTS.academicOptions);
    cached = toAcademicOptions(unwrap<AcademicOptionsDTO>(res.data));
    return cached;
  } catch {
    return DEFAULT_ACADEMIC_OPTIONS;
  }
};

export { DEFAULT_ACADEMIC_OPTIONS };
export { COUNTRIES, DEFAULT_COUNTRY } from './countries';
export type { Country } from './countries';
