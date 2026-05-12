import { describe, expect, it } from 'vitest';
import { generateMap } from '@/engine/mapGenerator';
import type { Country } from '@/types';

const baseCountry: Country = {
  biome: 'Tropical',
  areaKm2: 250_000,
  regime: 'Démocratie parlementaire',
  economies: ['Café'],
  population: 5_000_000,
  hdi: 0.7,
  ideology: 'Capitalisme libéral',
  system: 'État-providence',
  animal: 'Tigre',
  geopolitics: 'Non-aligné influent',
  leader: {
    intelligence: 'Bon',
    charisma: 'Bon',
    background: 'Économiste',
    style: 'Pragmatique froid',
    age: 50,
    health: 'Bonne santé',
    economicSkill: 'Bon',
    militarySkill: 'Moyen',
    legitimacy: 'Élu démocratiquement',
    weakness: 'Aucune faiblesse',
  },
  seed: 'tropical|250000|5000000|capitalisme|cafe',
  generatedAt: new Date('2025-01-01').toISOString(),
};

describe('mapGenerator', () => {
  it('produces a deterministic map for a given seed', () => {
    const a = generateMap(baseCountry);
    const b = generateMap(baseCountry);
    expect(a.outlinePath).toBe(b.outlinePath);
    expect(a.zones).toEqual(b.zones);
    expect(a.resources).toEqual(b.resources);
  });

  it('changes the map when the seed changes', () => {
    const a = generateMap(baseCountry);
    const b = generateMap({ ...baseCountry, seed: 'different-seed-here' });
    expect(a.outlinePath).not.toBe(b.outlinePath);
  });

  it('returns 3 zones for tiny countries', () => {
    const tiny = { ...baseCountry, areaKm2: 500, seed: 'tiny' };
    expect(generateMap(tiny).zones.length).toBe(3);
  });

  it('returns 5 zones for medium countries', () => {
    const mid = { ...baseCountry, areaKm2: 100_000, seed: 'mid' };
    expect(generateMap(mid).zones.length).toBe(5);
  });

  it('returns 9 zones for immense countries', () => {
    const huge = { ...baseCountry, areaKm2: 15_000_000, seed: 'huge' };
    expect(generateMap(huge).zones.length).toBe(9);
  });

  it('returns 3 hidden resources for tiny countries', () => {
    const tiny = { ...baseCountry, areaKm2: 500, seed: 'tiny-res' };
    expect(generateMap(tiny).resources.length).toBe(3);
  });

  it('returns 6 hidden resources for huge countries', () => {
    const huge = { ...baseCountry, areaKm2: 15_000_000, seed: 'huge-res' };
    expect(generateMap(huge).resources.length).toBe(6);
  });

  it('places all resources at normalised coordinates in [0, 1]', () => {
    const map = generateMap(baseCountry);
    for (const r of map.resources) {
      expect(r.x).toBeGreaterThanOrEqual(0);
      expect(r.x).toBeLessThanOrEqual(1);
      expect(r.y).toBeGreaterThanOrEqual(0);
      expect(r.y).toBeLessThanOrEqual(1);
    }
  });

  it('always uses the primary biome on at least half the zones', () => {
    const map = generateMap(baseCountry);
    const primaryCount = map.zones.filter((z) => z.biome === baseCountry.biome).length;
    expect(primaryCount).toBeGreaterThanOrEqual(Math.ceil(map.zones.length * 0.5));
  });
});
