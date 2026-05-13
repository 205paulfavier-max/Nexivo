import { describe, expect, it } from 'vitest';
import {
  ECONOMY_QUALITY,
  ECONOMY_QUALITY_DEFAULT,
  computeGdpPerCapita,
  getAverageQuality,
  getEconomyCount,
  getEconomyQuality,
} from '@/data/economies';

describe('data / ECONOMY_QUALITY', () => {
  it('rates top-tier tech above commodities', () => {
    expect(ECONOMY_QUALITY['Semi-conducteurs']!).toBeGreaterThan(ECONOMY_QUALITY['Charbon']!);
    expect(ECONOMY_QUALITY['IA']!).toBeGreaterThan(ECONOMY_QUALITY['Bananes']!);
  });

  it('falls back to the default for unknown economies', () => {
    expect(getEconomyQuality('ImaginaryEconomy_XYZ')).toBe(ECONOMY_QUALITY_DEFAULT);
  });
});

describe('data / getEconomyCount', () => {
  it('returns 1 economy for countries under 100 000 km²', () => {
    expect(getEconomyCount(50_000)).toBe(1);
  });

  it('returns 2 economies for mid-sized countries', () => {
    expect(getEconomyCount(500_000)).toBe(2);
  });

  it('returns 3 economies for countries 2 000 000 km² and above', () => {
    expect(getEconomyCount(2_500_000)).toBe(3);
  });
});

describe('data / getAverageQuality', () => {
  it('averages multiple economies', () => {
    const avg = getAverageQuality(['Pétrole', 'Charbon']);
    expect(avg).toBeCloseTo((3.5 + 1.8) / 2, 5);
  });

  it('returns default for empty input', () => {
    expect(getAverageQuality([])).toBe(ECONOMY_QUALITY_DEFAULT);
  });
});

describe('data / computeGdpPerCapita', () => {
  it('multiplies hdi × avg quality × 30 000', () => {
    expect(computeGdpPerCapita(0.5, ['Pétrole'])).toBe(Math.round(0.5 * 3.5 * 30000));
  });

  it('returns null when inputs are missing', () => {
    expect(computeGdpPerCapita(null, ['Pétrole'])).toBeNull();
    expect(computeGdpPerCapita(0.7, [])).toBeNull();
  });
});
