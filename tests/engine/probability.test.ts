import { describe, expect, it } from 'vitest';
import { getPrimaryEconomy, getWeights, spinWheel, weightedRandom } from '@/engine/probability';
import { mulberry32 } from '@/engine/rng';
import { getWheelById } from '@/data/wheels';
import type { ResultsByWheel, SegmentValue, SpinResult } from '@/types';

function makeResult(wheelId: number, value: SegmentValue | SegmentValue[]): SpinResult {
  const wheel = getWheelById(wheelId);
  const seg = Array.isArray(value) ? value[0] : value;
  const chosenIndex = Math.max(
    0,
    wheel.segments.findIndex((s) => s === seg),
  );
  return { wheelId, label: wheel.label, value, chosenIndex };
}

function state(map: Record<number, SegmentValue | SegmentValue[]>): ResultsByWheel {
  const out: Record<number, SpinResult> = {};
  for (const key of Object.keys(map)) {
    const id = Number(key);
    const v = map[id]!;
    out[id] = makeResult(id, v);
  }
  return out;
}

describe('probability / getPrimaryEconomy', () => {
  it('returns the first economy when several are rolled', () => {
    const r = state({ 4: ['Café', 'Or', 'IA'] });
    expect(getPrimaryEconomy(r)).toBe('Café');
  });

  it('returns the single economy when only one is rolled', () => {
    const r = state({ 4: 'Pétrole' });
    expect(getPrimaryEconomy(r)).toBe('Pétrole');
  });

  it('returns undefined when no economy is rolled', () => {
    expect(getPrimaryEconomy({})).toBeUndefined();
  });
});

describe('probability / getWeights — uniform wheels', () => {
  it('returns a flat 1-weight vector for HDI (wheel 6)', () => {
    const wheel = getWheelById(6);
    const w = getWeights(wheel, {});
    expect(w).toHaveLength(100);
    expect(w.every((x) => x === 1)).toBe(true);
  });
});

describe('probability / getWeights — biome-conditioned (wheel 2, area)', () => {
  it('boosts large areas in Désert / Steppe / Toundra', () => {
    const wheel = getWheelById(2);
    const w = getWeights(wheel, state({ 1: 'Désert' }));
    const idx = wheel.segments.findIndex((s) => s === 1_200_000);
    const idxSmall = wheel.segments.findIndex((s) => s === 1000);
    expect(w[idx]!).toBeGreaterThan(w[idxSmall]!);
  });

  it('penalises huge areas for Archipel', () => {
    const wheel = getWheelById(2);
    const w = getWeights(wheel, state({ 1: 'Archipel' }));
    const big = wheel.segments.findIndex((s) => s === 8_000_000);
    expect(w[big]!).toBeLessThan(1);
  });
});

describe('probability / getWeights — area-conditioned (wheel 3, regime)', () => {
  it('forbids République fédérale / Empire colonial under 100 km²', () => {
    const wheel = getWheelById(3);
    const w = getWeights(wheel, state({ 2: 50 }));
    const fed = wheel.segments.findIndex((s) => s === 'République fédérale');
    const emp = wheel.segments.findIndex((s) => s === 'Empire colonial');
    expect(w[fed]!).toBe(0);
    expect(w[emp]!).toBe(0);
  });

  it('boosts monarchies in tiny states', () => {
    const wheel = getWheelById(3);
    const w = getWeights(wheel, state({ 2: 500 }));
    const monAbs = wheel.segments.findIndex((s) => s === 'Monarchie absolue');
    expect(w[monAbs]!).toBeGreaterThan(1);
  });
});

describe('probability / getWeights — biome-conditioned (wheel 4, economy)', () => {
  it('forbids sea-based economies in desert biomes', () => {
    const wheel = getWheelById(4);
    const w = getWeights(wheel, state({ 1: 'Désert' }));
    const banned = ['Pêche industrielle', 'Aquaculture', 'Caviar', 'Coraux', 'Perles'];
    for (const seg of banned) {
      const idx = wheel.segments.findIndex((s) => s === seg);
      expect(w[idx]!).toBe(0);
    }
  });

  it('forbids tropical agriculture in Arctique / Toundra', () => {
    const wheel = getWheelById(4);
    for (const biome of ['Arctique', 'Toundra']) {
      const w = getWeights(wheel, state({ 1: biome }));
      const banned = ['Café', 'Cacao', 'Bananes', 'Vin', 'Riz', 'Tourisme balnéaire'];
      for (const seg of banned) {
        const idx = wheel.segments.findIndex((s) => s === seg);
        expect(w[idx]!).toBe(0);
      }
    }
  });

  it('boosts oil/gas/solar in desert biomes', () => {
    const wheel = getWheelById(4);
    const w = getWeights(wheel, state({ 1: 'Désert' }));
    const idx = wheel.segments.findIndex((s) => s === 'Pétrole');
    expect(w[idx]!).toBeGreaterThanOrEqual(3);
  });
});

describe('probability / getWeights — physical caps (wheel 5, population)', () => {
  it('forbids populations above 25 000 hab/km²', () => {
    const wheel = getWheelById(5);
    const w = getWeights(wheel, state({ 1: 'Tropical', 2: 100 }));
    // 100 km² × 25 000 hab/km² = 2 500 000 max → all entries > 2.5M must be 0
    const tooLarge = wheel.segments
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => Number(s) > 2_500_000);
    for (const { i } of tooLarge) {
      expect(w[i]!).toBe(0);
    }
  });
});

describe('probability / getWeights — stat ladders use Gaussian', () => {
  it('returns the Gaussian distribution for intelligence (wheel 11)', () => {
    const wheel = getWheelById(11);
    const w = getWeights(wheel, {});
    expect(w).toEqual([2, 5, 10, 15, 20, 20, 15, 8, 4, 1]);
  });

  it('boosts upper tiers under Technocratie for intelligence', () => {
    const wheel = getWheelById(11);
    const w = getWeights(wheel, state({ 3: 'Technocratie' }));
    expect(w[8]!).toBeGreaterThan(4);
    expect(w[9]!).toBeGreaterThan(1);
  });

  it('boosts upper tiers under Dictature militaire for military skill', () => {
    const wheel = getWheelById(18);
    const w = getWeights(wheel, state({ 3: 'Dictature militaire' }));
    expect(w[7]!).toBeGreaterThan(8);
  });
});

describe('probability / getWeights — leader background', () => {
  it('boosts Militaire under a Dictature militaire', () => {
    const wheel = getWheelById(13);
    const w = getWeights(wheel, state({ 3: 'Dictature militaire' }));
    const idx = wheel.segments.findIndex((s) => s === 'Militaire');
    expect(w[idx]!).toBeGreaterThanOrEqual(10);
  });

  it('boosts Religieux under a Théocratie', () => {
    const wheel = getWheelById(13);
    const w = getWeights(wheel, state({ 3: 'Théocratie' }));
    const idx = wheel.segments.findIndex((s) => s === 'Religieux');
    expect(w[idx]!).toBeGreaterThanOrEqual(10);
  });
});

describe('probability / getWeights — leader health depends on age', () => {
  it('penalises severe illnesses for young leaders', () => {
    const wheel = getWheelById(16);
    const w = getWeights(wheel, state({ 15: 30 }));
    const young = wheel.segments.findIndex((s) => s === 'Espérance < 2 ans');
    const healthy = wheel.segments.findIndex((s) => s === 'Excellente santé');
    expect(w[young]!).toBeLessThan(1);
    expect(w[healthy]!).toBeGreaterThan(1);
  });

  it('boosts severe illnesses for very old leaders', () => {
    const wheel = getWheelById(16);
    const w = getWeights(wheel, state({ 15: 80 }));
    const idx = wheel.segments.findIndex((s) => s === 'Espérance < 2 ans');
    expect(w[idx]!).toBeGreaterThan(1);
  });
});

describe('probability / weightedRandom', () => {
  it('returns an index in range', () => {
    const idx = weightedRandom([1, 1, 1, 1], mulberry32(5));
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(idx).toBeLessThan(4);
  });

  it('falls back to the middle when all weights are zero', () => {
    const idx = weightedRandom([0, 0, 0, 0, 0], mulberry32(5));
    expect(idx).toBe(2);
  });

  it('picks the only non-zero option', () => {
    const idx = weightedRandom([0, 0, 1, 0, 0], mulberry32(5));
    expect(idx).toBe(2);
  });

  it('approximates a 70/30 distribution over many trials', () => {
    const rng = mulberry32(2024);
    let zeros = 0;
    const TRIALS = 5000;
    for (let i = 0; i < TRIALS; i += 1) {
      if (weightedRandom([7, 3], rng) === 0) zeros += 1;
    }
    expect(zeros / TRIALS).toBeGreaterThan(0.65);
    expect(zeros / TRIALS).toBeLessThan(0.75);
  });
});

describe('probability / spinWheel', () => {
  it('returns a result whose value matches the chosen segment', () => {
    const wheel = getWheelById(1);
    const result = spinWheel(wheel, {}, mulberry32(11));
    expect(result.wheelId).toBe(1);
    expect(wheel.segments).toContain(result.value);
    expect(wheel.segments[result.chosenIndex]).toEqual(result.value);
  });
});
