/** "1:05", or "01:05" with `padMinutes`. */
export const formatDuration = (totalSeconds: number, { padMinutes = false } = {}) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${padMinutes ? String(minutes).padStart(2, '0') : minutes}:${seconds}`;
};

/** "ada lovelace" → "Ada Lovelace". */
export const capitalizeWords = (text?: string) =>
  (text ?? '').replace(/\b\w/g, char => char.toUpperCase());

/** "300 Level" / "300L" / "300" → "300"; anything else (e.g. "M.Sc.") → null. */
export const levelNumber = (level?: string) =>
  level?.trim().match(/^(\d{3})\s*(l|level)?$/i)?.[1] ?? null;
