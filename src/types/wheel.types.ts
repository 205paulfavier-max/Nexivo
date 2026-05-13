/**
 * A single segment value on a wheel. Numbers for measurements (km², population, age),
 * strings for everything else.
 */
export type SegmentValue = string | number;

export type WheelGroup = 'country' | 'leader';

export interface Wheel {
  readonly id: number;
  readonly group: WheelGroup;
  readonly label: string;
  readonly segments: readonly SegmentValue[];
}

/** Spin speed presets, durations in ms. */
export type SpeedPreset = 'short' | 'medium' | 'long' | 'epic';

export const SPEED_DURATIONS: Readonly<Record<SpeedPreset, number>> = {
  short: 4000,
  medium: 7000,
  long: 10000,
  epic: 14000,
};

/** Stat ladder used for leader skills (intelligence, charisma, etc.). */
export type StatLabel =
  | 'Ultra nul'
  | 'Nul'
  | 'Faible'
  | 'Médiocre'
  | 'Moyen'
  | 'Correct'
  | 'Bon'
  | 'Très bon'
  | 'Excellent'
  | 'Légendaire';

export const STAT_VALUES: Readonly<Record<StatLabel, number>> = {
  'Ultra nul': 5,
  Nul: 15,
  Faible: 25,
  Médiocre: 35,
  Moyen: 45,
  Correct: 55,
  Bon: 65,
  'Très bon': 75,
  Excellent: 85,
  Légendaire: 95,
};

/** Probability mass per stat rank, indexed in STAT_VALUES order. */
export const GAUSSIAN_WEIGHTS: readonly number[] = [2, 5, 10, 15, 20, 20, 15, 8, 4, 1];
