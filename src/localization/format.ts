/**
 * Fill `{{name}}` placeholders in a translated string.
 *   fmt(t.quiz.questionOf, { current: 2, total: 10 }) → "Question 2 of 10"
 * Placeholders keep word order inside the translation, which differs between
 * English, Hausa and Yorùbá – never build sentences by concatenation.
 */
export const fmt = (
  template: string,
  vars: Record<string, string | number | undefined | null>,
): string =>
  template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    const value = vars[key];
    return value === undefined || value === null ? match : String(value);
  });

/**
 * Pick the singular or plural form, then fill placeholders. `{{count}}` is
 * always available. Hausa and Yorùbá don't inflect nouns for number, so their
 * files usually give the same text for both forms.
 */
export const plural = (
  count: number,
  forms: { one: string; other: string },
  vars: Record<string, string | number | undefined | null> = {},
): string => fmt(count === 1 ? forms.one : forms.other, { count, ...vars });

/**
 * Like `fmt`, but values may be React elements (a bold email, a link), so a
 * translator can put them anywhere in the sentence:
 *   <Text>{fmtParts(t.x.codeSent, { email: <Text style={bold}>{email}</Text> })}</Text>
 * Returns an array ready to render as Text children; give elements a `key`.
 */
export const fmtParts = <T,>(
  template: string,
  vars: Record<string, T | string | number>,
): (string | T)[] =>
  template
    .split(/(\{\{\s*\w+\s*\}\})/)
    .filter(part => part !== '')
    .map(part => {
      const key = part.match(/^\{\{\s*(\w+)\s*\}\}$/)?.[1];
      if (!key || !(key in vars)) return part;
      const value = vars[key];
      return typeof value === 'number' ? String(value) : (value as T | string);
    });
