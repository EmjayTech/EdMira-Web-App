/* Colour maths works on packed 0xRRGGBB integers. */
/* eslint-disable no-bitwise */

/** Lightens a #RRGGBB colour towards white by `amount` (0–1). */
export const lighten = (hex: string, amount: number) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

/** Stable 32-bit hash of a string, e.g. to pick a palette colour for an id. */
export const hashString = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(hash);
};
