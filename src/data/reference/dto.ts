/**
 * ─── Reference-data JSON shape (DTO) and mapper ──────────────────────────────
 *
 * GET /api/v1/reference/academic-options (docs/BACKEND_INTEGRATION.md §3.6).
 * Lists may be plain strings or `{ name }` objects. Adapt THIS FILE ONLY if
 * the backend names things differently.
 */

import { DEFAULT_ACADEMIC_OPTIONS } from './mock/academicOptions';
import { AcademicOptions, InstitutionCategory, ProgrammeType } from './types';

type Named = string | { name: string };

export interface AcademicOptionsDTO {
  institutions?: (Named & { category?: string })[];
  faculties?: Named[];
  departments?: Named[];
  programmes?: { type: string; levels: Named[] }[];
}

const nameOf = (item: Named) => (typeof item === 'string' ? item : item.name);

const CATEGORIES: InstitutionCategory[] = ['federal', 'state', 'private'];

/** Missing lists fall back to the bundled defaults, so a partial response still works. */
export const toAcademicOptions = (dto: AcademicOptionsDTO): AcademicOptions => ({
  institutions: dto.institutions?.length
    ? dto.institutions.map(i => {
        const category = (typeof i === 'string' ? '' : i.category ?? '').toLowerCase();
        return {
          name: nameOf(i),
          category: CATEGORIES.includes(category as InstitutionCategory)
            ? (category as InstitutionCategory)
            : 'federal',
        };
      })
    : DEFAULT_ACADEMIC_OPTIONS.institutions,
  faculties: dto.faculties?.length
    ? dto.faculties.map(nameOf)
    : DEFAULT_ACADEMIC_OPTIONS.faculties,
  departments: dto.departments?.length
    ? dto.departments.map(nameOf)
    : DEFAULT_ACADEMIC_OPTIONS.departments,
  programmes: dto.programmes?.length
    ? dto.programmes.map(p => ({
        type: (/^post/i.test(p.type) ? 'Postgraduate' : 'Undergraduate') as ProgrammeType,
        levels: p.levels.map(nameOf),
      }))
    : DEFAULT_ACADEMIC_OPTIONS.programmes,
});
