import type { RNG } from './rng';
import { defaultRng } from './rng';

/**
 * Fisher-Yates shuffle returning a NEW array — does not mutate the input.
 * The injected RNG keeps tests deterministic.
 */
export function shuffle<T>(input: readonly T[], rng: RNG = defaultRng): T[] {
  const arr = input.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i] as T;
    arr[i] = arr[j] as T;
    arr[j] = tmp;
  }
  return arr;
}

/** Shuffled list of indices [0..n-1]. */
export function shuffleIndices(n: number, rng: RNG = defaultRng): number[] {
  const indices = Array.from({ length: n }, (_, i) => i);
  return shuffle(indices, rng);
}
