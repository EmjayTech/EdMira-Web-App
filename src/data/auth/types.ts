/** Account types for auth, sign-up and the student's profile. */

export type UserType = 'STUDENT' | 'PROFESSIONAL';

export interface StudentProfile {
  institution: string;
  faculty?: string;
  department: string;
  /** "Undergraduate" | "Postgraduate" */
  levelType?: string;
  /** e.g. "300" or "300 Level" for undergraduates, a degree for postgraduates. */
  level: string;
}

export interface ProfessionalProfile {
  title: string;
  fieldOfSpecialization: string;
  organization: string;
  yearsOfExperience: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  userType: UserType;
  avatarUrl?: string;
  countryCode?: string;
  phoneNumber?: string;
  studentProfile?: StudentProfile;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface SignupInput {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  userType: UserType;
  countryCode: string;
  phoneNumber: string;
  studentProfile?: Required<StudentProfile>;
  professionalProfile?: ProfessionalProfile;
  referralCode?: string;
}

export interface PasswordReset {
  email: string;
  code: string;
  newPassword: string;
}

/** Fields a student can edit on the Edit profile screen (US-03, US-04). Omitted fields are unchanged. */
export interface ProfileUpdate {
  firstName: string;
  lastName: string;
  studentProfile: Partial<Pick<StudentProfile, 'institution' | 'department' | 'level'>>;
}
