/**
 * A pseudo-random number generator returning floats in [0, 1).
 * Match the shape of Math.random for drop-in interchangeability.
 */
export type RNG = () => number;

/**
 * Mulberry32 — fast, deterministic, 2^32 period. Suitable for procedural
 * map seeding and reproducible tests. Not cryptographic.
 */
export function mulberry32(seed: number): RNG {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Default RNG backed by Math.random. */
export const defaultRng: RNG = () => Math.random();

/** Hash a string to a 32-bit integer suitable as a Mulberry32 seed. */
export function hashSeed(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
