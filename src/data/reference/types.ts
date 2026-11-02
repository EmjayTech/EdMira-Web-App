/** Option lists for the academic step of sign-up. */

export type InstitutionCategory = 'federal' | 'state' | 'private';

export interface Institution {
  name: string;
  category: InstitutionCategory;
}

/** Values are stored and sent in English; only their labels are translated. */
export type ProgrammeType = 'Undergraduate' | 'Postgraduate';

export interface Programme {
  type: ProgrammeType;
  /** e.g. "100 Level" … "600 Level", or degree names for postgraduates. */
  levels: string[];
}

export interface AcademicOptions {
  institutions: Institution[];
  faculties: string[];
  departments: string[];
  programmes: Programme[];
}
