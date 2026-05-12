/** TikTok-friendly palette used for wheel segments. */
export const SEGMENT_COLORS: readonly string[] = [
  '#FF2D87', // pink
  '#00E5FF', // cyan
  '#FFD60A', // yellow
  '#9D4EDD', // purple
  '#FF6B35', // orange
  '#00E676', // green
  '#2979FF', // blue
  '#FF1744', // red
  '#C1FF00', // lime
  '#FF4081', // hot pink
  '#18FFFF', // bright cyan
  '#FFAB00', // amber
];

/** Background colours that should host DARK text for legibility. */
const LIGHT_BACKGROUNDS = new Set([
  '#FFD60A',
  '#C1FF00',
  '#00E676',
  '#18FFFF',
  '#00E5FF',
  '#FFAB00',
]);

/** Pick black or white text depending on segment background colour. */
export function getTextColor(bg: string): '#000000' | '#FFFFFF' {
  return LIGHT_BACKGROUNDS.has(bg.toUpperCase()) ? '#000000' : '#FFFFFF';
}

export function pickSegmentColor(index: number): string {
  return SEGMENT_COLORS[index % SEGMENT_COLORS.length]!;
}
