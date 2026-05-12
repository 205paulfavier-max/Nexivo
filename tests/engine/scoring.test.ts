import { describe, expect, it } from 'vitest';
import type { Country } from '@/types';
import {
  computeEconomy,
  computeMilitary,
  computeStability,
  computeWorldRank,
  scoreCountry,
} from '@/engine/scoring';

const FAILED_STATE: Country = {
  biome: 'Désert',
  areaKm2: 5000,
  regime: 'État failli',
  economies: ['Contrefaçon'],
  population: 200_000,
  hdi: 0.25,
  ideology: 'Pacifisme constitutionnel',
  system: 'Corruption tolérée',
  animal: 'Serpent',
  geopolitics: 'État paria',
  leader: {
    intelligence: 'Ultra nul',
    charisma: 'Faible',
    background: 'Sans formation',
    style: 'Populiste',
    age: 80,
    health: 'Espérance < 2 ans',
    economicSkill: 'Ultra nul',
    militarySkill: 'Ultra nul',
    legitimacy: 'Imposé par étranger',
    weakness: 'Corruption documentée',
  },
  seed: 'desert|5000|200000|pacifisme|contrefaçon',
  generatedAt: new Date('2025-01-01').toISOString(),
};

const SUPERPOWER: Country = {
  biome: 'Forêt tempérée',
  areaKm2: 8_000_000,
  regime: 'Démocratie parlementaire',
  economies: ['Semi-conducteurs', 'IA', 'Aéronautique'],
  population: 800_000_000,
  hdi: 0.95,
  ideology: 'Capitalisme libéral',
  system: 'État-providence',
  animal: 'Aigle',
  geopolitics: 'Alliance occidentale',
  leader: {
    intelligence: 'Légendaire',
    charisma: 'Excellent',
    background: 'Économiste',
    style: 'Visionnaire',
    age: 50,
    health: 'Excellente santé',
    economicSkill: 'Légendaire',
    militarySkill: 'Très bon',
    legitimacy: 'Élu démocratiquement',
    weakness: 'Aucune faiblesse',
  },
  seed: 'foret|8000000|800000000|capitalisme|semi,ia,aero',
  generatedAt: new Date('2025-01-01').toISOString(),
};

describe('scoring / computeStability', () => {
  it('penalises a failed state heavily', () => {
    const s = computeStability(FAILED_STATE, FAILED_STATE.hdi);
    expect(s).toBeLessThan(15);
  });

  it('rewards a healthy democratic legitimate leader', () => {
    const s = computeStability(SUPERPOWER, SUPERPOWER.hdi);
    expect(s).toBeGreaterThan(70);
  });

  it('is clamped to [0, 100]', () => {
    expect(computeStability(FAILED_STATE, 0)).toBeGreaterThanOrEqual(0);
    expect(computeStability(SUPERPOWER, 1)).toBeLessThanOrEqual(100);
  });
});

describe('scoring / computeEconomy', () => {
  it('returns a low score for a failed state', () => {
    const eco = computeEconomy(FAILED_STATE, FAILED_STATE.hdi);
    expect(eco).toBeLessThan(30);
  });

  it('returns a high score for a tech superpower', () => {
    const eco = computeEconomy(SUPERPOWER, SUPERPOWER.hdi);
    expect(eco).toBeGreaterThan(75);
  });

  it('rewards economy diversification', () => {
    const mono = computeEconomy({ ...SUPERPOWER, economies: ['IA'] }, SUPERPOWER.hdi);
    const tri = computeEconomy(SUPERPOWER, SUPERPOWER.hdi);
    expect(tri).toBeGreaterThan(mono);
  });
});

describe('scoring / computeMilitary', () => {
  it('returns near-zero for tiny pacifist pariah states', () => {
    const m = computeMilitary(FAILED_STATE, 5);
    expect(m).toBeLessThan(15);
  });

  it('returns high for a populated, well-allied, militarised power', () => {
    const m = computeMilitary(SUPERPOWER, 90);
    expect(m).toBeGreaterThan(55);
  });

  it('penalises Pacifisme constitutionnel heavily', () => {
    const pacifist = { ...SUPERPOWER, ideology: 'Pacifisme constitutionnel' };
    const militarist = { ...SUPERPOWER, ideology: 'Militarisme expansionniste' };
    expect(computeMilitary(pacifist, 80)).toBeLessThan(computeMilitary(militarist, 80));
  });
});

describe('scoring / computeWorldRank', () => {
  it('labels a score of 90 as Top 3', () => {
    expect(computeWorldRank(90).approxRank).toBeLessThanOrEqual(3);
  });

  it('labels a score of 50 as Top 90', () => {
    expect(computeWorldRank(50).approxRank).toBe(90);
  });

  it('labels a sub-15 score as last', () => {
    expect(computeWorldRank(5).label.toLowerCase()).toContain('failli');
  });
});

describe('scoring / scoreCountry', () => {
  it('aggregates total = economy*0.4 + military*0.35 + stability*0.25', () => {
    const power = scoreCountry(SUPERPOWER);
    const expected = Math.round(
      power.economy * 0.4 + power.military * 0.35 + power.stability * 0.25,
    );
    expect(power.total).toBe(expected);
  });

  it('assigns the BRO IS COOKED tier to a failed state', () => {
    expect(scoreCountry(FAILED_STATE).tier.id).toBe('cooked');
  });

  it('assigns a top-tier label to the superpower', () => {
    const t = scoreCountry(SUPERPOWER).tier;
    expect(['gigachad', 'legendary']).toContain(t.id);
  });

  it('returns a tier whose label is non-empty', () => {
    const t = scoreCountry(SUPERPOWER).tier;
    expect(t.label.length).toBeGreaterThan(0);
    expect(t.emoji.length).toBeGreaterThan(0);
  });
});
