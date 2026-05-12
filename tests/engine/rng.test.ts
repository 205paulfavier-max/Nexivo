import { describe, expect, it } from 'vitest';
import { hashSeed, mulberry32 } from '@/engine/rng';

describe('rng / mulberry32', () => {
  it('returns floats in [0, 1)', () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 100; i += 1) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('is deterministic for the same seed', () => {
    const a = mulberry32(12345);
    const b = mulberry32(12345);
    for (let i = 0; i < 10; i += 1) {
      expect(a()).toBeCloseTo(b(), 12);
    }
  });

  it('produces different sequences for different seeds', () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    let sameInARow = 0;
    for (let i = 0; i < 50; i += 1) {
      if (a() === b()) sameInARow += 1;
    }
    expect(sameInARow).toBeLessThan(3);
  });
});

describe('rng / hashSeed', () => {
  it('returns a stable hash for the same string', () => {
    expect(hashSeed('hello')).toBe(hashSeed('hello'));
  });

  it('returns different hashes for nearby inputs', () => {
    expect(hashSeed('a')).not.toBe(hashSeed('b'));
    expect(hashSeed('foo')).not.toBe(hashSeed('foo ')); // trailing space matters
  });
});
