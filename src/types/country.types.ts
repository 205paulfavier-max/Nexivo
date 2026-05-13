import type { SegmentValue } from './wheel.types';

/**
 * Result of a single wheel spin, indexed by wheel id (1..20).
 * Wheel 4 (economy) can yield 1 to 3 values (based on country size).
 */
export interface SpinResult {
  readonly wheelId: number;
  readonly label: string;
  readonly value: SegmentValue | SegmentValue[];
  /** Index of the chosen segment, used for animation positioning. */
  readonly chosenIndex: number;
}

export type ResultsByWheel = Readonly<Record<number, SpinResult | undefined>>;

/**
 * Snapshot of a fully-spun country: aggregated, structured, and serializable
 * for LocalStorage. All keys are mandatory once generated.
 */
export interface Country {
  readonly biome: string;
  readonly areaKm2: number;
  readonly regime: string;
  readonly economies: readonly string[];
  readonly population: number;
  readonly hdi: number;
  readonly ideology: string;
  readonly system: string;
  readonly animal: string;
  readonly geopolitics: string;
  readonly leader: Leader;
  /** Free-form id derived from biome/area/population/ideology for map seeding. */
  readonly seed: string;
  /** ISO timestamp at generation time. */
  readonly generatedAt: string;
}

export interface Leader {
  readonly intelligence: string;
  readonly charisma: string;
  readonly background: string;
  readonly style: string;
  readonly age: number;
  readonly health: string;
  readonly economicSkill: string;
  readonly militarySkill: string;
  readonly legitimacy: string;
  readonly weakness: string;
}

export type ResourceKind = 'bonus' | 'malus';

export interface HiddenResource {
  readonly id: string;
  readonly icon: string;
  readonly label: string;
  readonly kind: ResourceKind;
  /** Mid-sentence French description of the find. */
  readonly description: string;
  readonly economyBonus?: number;
  readonly militaryBonus?: number;
  readonly hdiBonus?: number;
}

export interface ResourceOnMap {
  readonly resource: HiddenResource;
  /** Normalised coordinates within the map viewBox (0..1 on each axis). */
  readonly x: number;
  readonly y: number;
}
