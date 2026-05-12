import { describe, expect, it } from 'vitest';
import { buildCountry, isComplete } from '@/engine/buildCountry';
import type { ResultsByWheel, SegmentValue, SpinResult } from '@/types';
import { getWheelById } from '@/data/wheels';

function r(wheelId: number, value: SegmentValue | SegmentValue[]): SpinResult {
  const wheel = getWheelById(wheelId);
  const seg = Array.isArray(value) ? value[0] : value;
  return {
    wheelId,
    label: wheel.label,
    value,
    chosenIndex: Math.max(0, wheel.segments.findIndex((s) => s === seg)),
  };
}

const FULL: ResultsByWheel = {
  1: r(1, 'Tropical'),
  2: r(2, 250_000),
  3: r(3, 'Démocratie parlementaire'),
  4: r(4, ['Café', 'Cacao']),
  5: r(5, 5_000_000),
  6: r(6, '0.72'),
  7: r(7, 'Capitalisme libéral'),
  8: r(8, 'État-providence'),
  9: r(9, 'Tigre'),
  10: r(10, 'Non-aligné influent'),
  11: r(11, 'Bon'),
  12: r(12, 'Très bon'),
  13: r(13, 'Économiste'),
  14: r(14, 'Pragmatique froid'),
  15: r(15, 50),
  16: r(16, 'Bonne santé'),
  17: r(17, 'Bon'),
  18: r(18, 'Moyen'),
  19: r(19, 'Élu démocratiquement'),
  20: r(20, 'Aucune faiblesse'),
};

describe('buildCountry / isComplete', () => {
  it('returns true when all 20 wheels are present', () => {
    expect(isComplete(FULL)).toBe(true);
  });

  it('returns false when any wheel is missing', () => {
    const partial: ResultsByWheel = { ...FULL };
    delete (partial as Record<number, SpinResult | undefined>)[7];
    expect(isComplete(partial)).toBe(false);
  });
});

describe('buildCountry / buildCountry', () => {
  it('aggregates wheel results into a Country snapshot', () => {
    const c = buildCountry(FULL);
    expect(c.biome).toBe('Tropical');
    expect(c.areaKm2).toBe(250_000);
    expect(c.regime).toBe('Démocratie parlementaire');
    expect(c.economies).toEqual(['Café', 'Cacao']);
    expect(c.population).toBe(5_000_000);
    expect(c.hdi).toBeCloseTo(0.72, 3);
    expect(c.leader.age).toBe(50);
    expect(c.leader.legitimacy).toBe('Élu démocratiquement');
  });

  it('normalises a single-value economy to a one-element array', () => {
    const single: ResultsByWheel = { ...FULL, 4: r(4, 'Pétrole') };
    expect(buildCountry(single).economies).toEqual(['Pétrole']);
  });

  it('builds a deterministic seed string from the same inputs', () => {
    const a = buildCountry(FULL).seed;
    const b = buildCountry(FULL).seed;
    expect(a).toBe(b);
  });

  it('records the current ISO timestamp', () => {
    const c = buildCountry(FULL);
    expect(() => new Date(c.generatedAt)).not.toThrow();
    expect(c.generatedAt).toMatch(/T\d{2}:\d{2}/);
  });
});
