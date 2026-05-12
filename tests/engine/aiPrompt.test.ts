import { describe, expect, it } from 'vitest';
import { generateAiPrompt } from '@/engine/aiPrompt';
import type { Country } from '@/types';

const base: Country = {
  biome: 'Volcanique',
  areaKm2: 2_500_000,
  regime: 'Théocratie',
  economies: ['Géothermie', 'Tourisme culturel'],
  population: 60_000_000,
  hdi: 0.65,
  ideology: 'Théocratie morale',
  system: "Religion d'État",
  animal: 'Dragon',
  geopolitics: 'Isolationniste',
  leader: {
    intelligence: 'Bon',
    charisma: 'Bon',
    background: 'Religieux',
    style: 'Idéologue',
    age: 60,
    health: 'Bonne santé',
    economicSkill: 'Moyen',
    militarySkill: 'Moyen',
    legitimacy: 'Désigné prédécesseur',
    weakness: 'Aucune faiblesse',
  },
  seed: 'volc|2.5M|60M|theo|geo,tour',
  generatedAt: new Date('2025-01-01').toISOString(),
};

describe('aiPrompt / generateAiPrompt', () => {
  it('mentions the biome visuals', () => {
    expect(generateAiPrompt(base).toLowerCase()).toContain('volcano');
  });

  it('mentions the national animal', () => {
    expect(generateAiPrompt(base).toLowerCase()).toContain('dragon');
  });

  it('mentions both economy visuals', () => {
    const text = generateAiPrompt(base).toLowerCase();
    expect(text).toContain('geothermal');
  });

  it('ends with Midjourney parameters', () => {
    expect(generateAiPrompt(base)).toContain('--ar 16:9');
    expect(generateAiPrompt(base)).toContain('--v 6.1');
  });

  it('adapts the size descriptor to the country area', () => {
    const tiny = { ...base, areaKm2: 200 };
    const huge = { ...base, areaKm2: 10_000_000 };
    expect(generateAiPrompt(tiny).toLowerCase()).toContain('tiny');
    expect(generateAiPrompt(huge).toLowerCase()).toContain('colossal');
  });
});
