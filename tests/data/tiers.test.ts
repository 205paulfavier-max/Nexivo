import { describe, expect, it } from 'vitest';
import { TIERS, getTierById, getTierForScore } from '@/data/tiers';

describe('data / TIERS', () => {
  it('is ordered by ascending minScore', () => {
    for (let i = 1; i < TIERS.length; i += 1) {
      expect(TIERS[i]!.minScore).toBeGreaterThan(TIERS[i - 1]!.minScore);
    }
  });

  it('starts at 0', () => {
    expect(TIERS[0]!.minScore).toBe(0);
  });
});

describe('data / getTierForScore', () => {
  it('maps 0 to BRO IS COOKED', () => {
    expect(getTierForScore(0).id).toBe('cooked');
  });

  it('maps 30 to L tier', () => {
    expect(getTierForScore(30).id).toBe('L');
  });

  it('maps 50 to mid', () => {
    expect(getTierForScore(50).id).toBe('mid');
  });

  it('maps 60 to solid', () => {
    expect(getTierForScore(60).id).toBe('solid');
  });

  it('maps 75 to gigachad', () => {
    expect(getTierForScore(75).id).toBe('gigachad');
  });

  it('maps 95 to legendary', () => {
    expect(getTierForScore(95).id).toBe('legendary');
  });
});

describe('data / getTierById', () => {
  it('returns the requested tier', () => {
    expect(getTierById('gigachad').label).toContain('GIGACHAD');
  });
});
