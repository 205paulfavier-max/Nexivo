export interface SubScores {
  readonly stability: number;
  readonly economy: number;
  readonly military: number;
}

export interface PowerScore extends SubScores {
  readonly total: number;
  readonly tier: Tier;
  readonly worldRank: WorldRank;
}

export type TierId = 'cooked' | 'L' | 'mid' | 'solid' | 'gigachad' | 'legendary';

export interface Tier {
  readonly id: TierId;
  readonly label: string;
  readonly emoji: string;
  readonly minScore: number;
  /** Tailwind colour class (text) applied to titles and accent text. */
  readonly accentClass: string;
  /** Verdict line displayed at the bottom of the country summary. */
  readonly verdict: string;
}

export interface WorldRank {
  /** Free-form descriptor, e.g. "Top 10 (Superpuissance)". */
  readonly label: string;
  /** Lower bound estimate of the rank (smaller = better). */
  readonly approxRank: number;
}
