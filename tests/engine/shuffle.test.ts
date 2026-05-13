import { describe, expect, it } from 'vitest';
import { mulberry32 } from '@/engine/rng';
import { shuffle, shuffleIndices } from '@/engine/shuffle';

describe('shuffle', () => {
  it('returns a permutation of the input', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const out = shuffle(input, mulberry32(7));
    expect(out).toHaveLength(input.length);
    expect([...out].sort((a, b) => a - b)).toEqual([...input].sort((a, b) => a - b));
  });

  it('does not mutate the original input', () => {
    const input = [1, 2, 3, 4];
    const copy = [...input];
    shuffle(input, mulberry32(99));
    expect(input).toEqual(copy);
  });

  it('is deterministic with a seeded RNG', () => {
    const a = shuffle([1, 2, 3, 4, 5], mulberry32(123));
    const b = shuffle([1, 2, 3, 4, 5], mulberry32(123));
    expect(a).toEqual(b);
  });

  it('actually shuffles for non-trivial input lengths', () => {
    const input = Array.from({ length: 20 }, (_, i) => i);
    const out = shuffle(input, mulberry32(33));
    expect(out).not.toEqual(input);
  });
});

describe('shuffleIndices', () => {
  it('returns indices [0..n-1] permuted', () => {
    const out = shuffleIndices(8, mulberry32(1));
    expect([...out].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });
});
