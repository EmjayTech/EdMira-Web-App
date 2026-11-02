/**
 * Validation rules shared by forms. Error *messages* live in the language
 * files; these only decide pass / fail.
 */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email: string) => EMAIL_PATTERN.test(email.trim());

/** Local number without the country code. */
export const PHONE_PATTERN = /^[0-9]{6,15}$/;

/** The password rules EdMira enforces (sign-up and password reset). Labels: t.passwordRules[key]. */
export const PASSWORD_RULES = [
  { key: 'minLength', test: (p: string) => p.length >= 8 },
  { key: 'uppercase', test: (p: string) => /[A-Z]/.test(p) },
  { key: 'lowercase', test: (p: string) => /[a-z]/.test(p) },
  { key: 'number', test: (p: string) => /[0-9]/.test(p) },
  { key: 'special', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const;

export const meetsPasswordRules = (password: string) =>
  PASSWORD_RULES.every(rule => rule.test(password));
