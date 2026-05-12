import { describe, expect, it } from 'vitest';
import type { Country, PowerScore } from '@/types';
import { generateNarrative } from '@/engine/narrative';
import { scoreCountry } from '@/engine/scoring';
import { getTierForScore } from '@/data/tiers';

const country: Country = {
  biome: 'Méditerranéen',
  areaKm2: 300_000,
  regime: 'Démocratie parlementaire',
  economies: ['Vin', 'Mode'],
  population: 30_000_000,
  hdi: 0.85,
  ideology: 'Capitalisme libéral',
  system: 'État-providence',
  animal: 'Aigle',
  geopolitics: 'Alliance occidentale',
  leader: {
    intelligence: 'Bon',
    charisma: 'Excellent',
    background: 'Économiste',
    style: 'Pragmatique froid',
    age: 55,
    health: 'Bonne santé',
    economicSkill: 'Très bon',
    militarySkill: 'Moyen',
    legitimacy: 'Élu démocratiquement',
    weakness: 'Aucune faiblesse',
  },
  seed: 'medi|300k|30M|cap|vin,mode',
  generatedAt: new Date('2025-01-01').toISOString(),
};

const power: PowerScore = scoreCountry(country);

describe('narrative / generateNarrative', () => {
  it('mentions the area in the country sentence', () => {
    expect(generateNarrative(country, power).country).toContain('300 000');
  });

  it('mentions the biome in lowercase', () => {
    expect(generateNarrative(country, power).country.toLowerCase()).toContain('méditerranéen');
  });

  it('mentions both economies', () => {
    const text = generateNarrative(country, power).country;
    expect(text).toContain('vin');
    expect(text).toContain('mode');
  });

  it('mentions the leader background and age', () => {
    const text = generateNarrative(country, power).leader;
    expect(text).toContain('économiste');
    expect(text).toContain('55');
  });

  it('flags severe health conditions with a "miné par" mention', () => {
    const sick = { ...country, leader: { ...country.leader, health: 'Espérance < 2 ans' } };
    expect(generateNarrative(sick, power).leader).toContain('miné par');
  });

  it('produces a verdict matching the country tier', () => {
    const text = generateNarrative(country, power).verdict;
    const tier = getTierForScore(power.total);
    expect(text).toContain(tier.label);
  });
});
