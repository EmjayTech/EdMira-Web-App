/** Joins class names, skipping falsy ones: cn('a', cond && 'b'). */
export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(' ');
