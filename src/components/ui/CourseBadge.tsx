import { cn } from '@/utils/cn';
import { lighten } from '@/utils/color';

/** "BCH 201" / "BCH201" / "BCH-201" → ["BCH", "201"]; codes without a number stay on one line. */
export const splitCourseCode = (code: string): [string, string?] => {
  const match = code.trim().match(/^([A-Za-z]+)[\s-]*(\d.*)$/);
  return match ? [match[1].toUpperCase(), match[2]] : [code.trim().toUpperCase()];
};

const TILE = {
  sm: { px: 40, radius: 'rounded-xl' },
  md: { px: 56, radius: 'rounded-2xl' },
  lg: { px: 80, radius: 'rounded-3xl' },
};

/** Approximate width of one bold Inter capital / digit, in em. */
const CHAR_EM = 0.68;

/**
 * Font size for one line: the mobile proportion of the tile (`share`), shrunk
 * so the text fits inside 78% of the tile width — the web equivalent of
 * React Native's adjustsFontSizeToFit on the mobile CourseCode.
 */
const fitSize = (text: string, tile: number, share: number) =>
  Math.min(tile * share, (tile * 0.78) / (Math.max(text.length, 1) * CHAR_EM));

/**
 * The coloured course-code tile ("BCH 201"), like the mobile CourseCode:
 * subject letters on top and the number below, each kept on one line.
 */
export function CourseBadge({
  code,
  color,
  size = 'md',
}: {
  code: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { px, radius } = TILE[size];
  const [letters, number] = splitCourseCode(code);
  const line = (text: string, share: number, weight: string) => (
    <span
      className={cn('block whitespace-nowrap leading-[1.1] tracking-[0.01em]', weight)}
      style={{ fontSize: fitSize(text, px, share) }}>
      {text}
    </span>
  );
  return (
    <div
      className={cn('flex shrink-0 flex-col items-center justify-center overflow-hidden text-center text-white', radius)}
      style={{ width: px, height: px, background: `linear-gradient(135deg, ${lighten(color, 0.25)}, ${color})` }}
      aria-hidden>
      {number ? (
        <>
          {line(letters, 0.24, 'font-bold')}
          {line(number, 0.3, 'font-extrabold')}
        </>
      ) : (
        line(letters, 0.28, 'font-extrabold')
      )}
    </div>
  );
}
