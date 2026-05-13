import type { Country, PowerScore, SubScores, Tier, WorldRank } from '@/types';
import { STAT_VALUES, type StatLabel } from '@/types';
import { computeGdpPerCapita } from '@/data/economies';
import { getTierForScore } from '@/data/tiers';

const STABILITY_BASE = 40;
const ECONOMY_WEIGHT = 0.4;
const MILITARY_WEIGHT = 0.35;
const STABILITY_WEIGHT = 0.25;

const LEGITIMACY_DELTA: Readonly<Record<string, number>> = {
  'Élu démocratiquement': 18,
  'Héritage royal': 12,
  'Élu sans opposition': 3,
  'Désigné prédécesseur': 5,
  "Coup d'État accepté": -3,
  'Fraude soupçonnée': -12,
  'Vainqueur guerre civile': -8,
  "Coup d'État contesté": -20,
  'Imposé par étranger': -22,
  'Auto-proclamé': -17,
};

const HEALTH_DELTA: Readonly<Record<string, number>> = {
  'Excellente santé': 6,
  'Bonne santé': 3,
  'Santé moyenne': 0,
  Diabète: -3,
  'Maladie cardiaque': -7,
  'Cancer rémission': -10,
  'Dépression chronique': -8,
  Paranoïa: -14,
  'Démence précoce': -20,
  'Espérance < 2 ans': -22,
};

const COHERENT_PAIRS: Readonly<Record<string, string>> = {
  'Régime communiste': 'Communisme orthodoxe',
  'Monarchie absolue': 'Conservatisme traditionaliste',
  'Démocratie parlementaire': 'Capitalisme libéral',
  Théocratie: 'Théocratie morale',
  'Dictature militaire': 'Nationalisme dur',
  Technocratie: 'Techno-progressisme',
};

function stat(name: string): number {
  return STAT_VALUES[name as StatLabel] ?? 45;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

export function computeStability(country: Country, hdi: number): number {
  const { leader, regime, ideology, system } = country;
  let s = STABILITY_BASE;
  s += LEGITIMACY_DELTA[leader.legitimacy] ?? 0;
  s += HEALTH_DELTA[leader.health] ?? 0;
  s += leader.weakness === 'Aucune faiblesse' ? 6 : -8;
  s += (stat(leader.charisma) - 50) * 0.18;
  if (COHERENT_PAIRS[regime] === ideology) s += 6;
  if (
    ['Corruption tolérée', 'Apartheid économique', 'Castes rigides', 'Quotas ethniques'].includes(
      system,
    )
  )
    s -= 10;
  if (['État-providence', 'Coopératives citoyennes', 'Santé universelle'].includes(system)) s += 4;
  if (regime === 'État failli') s -= 30;
  if (regime === 'Anarchie organisée') s -= 12;
  if (regime === 'Régence transitoire') s -= 8;
  s += (hdi - 0.5) * 25;
  return clamp(Math.round(s));
}

export function computeEconomy(country: Country, hdi: number): number {
  const { population, economies, leader, geopolitics, system } = country;
  const gdpPerCapita = computeGdpPerCapita(hdi, economies) ?? 5000;
  const totalGdp = gdpPerCapita * population;
  let s = 0;
  s += Math.min(40, Math.max(0, (Math.log10(totalGdp + 1) - 8) * 5));
  s += Math.min(20, Math.max(0, (Math.log10(gdpPerCapita + 1) - 3) * 6));
  s += stat(leader.economicSkill) * 0.18;
  s += hdi * 18;
  s += (economies.length - 1) * 4;
  if (geopolitics === 'État paria') s -= 18;
  if (['Alliance occidentale', 'Allié USA'].includes(geopolitics)) s += 5;
  if (geopolitics === 'Leader régional') s += 3;
  if (geopolitics === 'Vassal') s -= 6;
  if (system === 'Capitalisme dérégulé') s += 3;
  if (system === 'Économie planifiée') s -= 5;
  if (system === 'Bureaucratie kafkaïenne') s -= 7;
  if (system === 'Corruption tolérée') s -= 5;
  return clamp(Math.round(s));
}

export function computeMilitary(country: Country, economyScore: number): number {
  const { population, areaKm2, leader, ideology, geopolitics, regime, system } = country;
  let s = 0;
  s += Math.min(30, Math.max(0, (Math.log10(population + 1) - 6) * 4));
  s += Math.min(12, Math.max(0, (Math.log10(areaKm2 + 1) - 4) * 3));
  s += stat(leader.militarySkill) * 0.32;
  s += economyScore * 0.18;
  if (ideology === 'Militarisme expansionniste') s += 10;
  if (ideology === 'Pacifisme constitutionnel') s -= 18;
  if (ideology === 'Nationalisme dur') s += 4;
  if (['Alliance occidentale', 'Alliance BRICS+'].includes(geopolitics)) s += 6;
  if (['Allié USA', 'Allié Chine', 'Allié Russie'].includes(geopolitics)) s += 4;
  if (geopolitics === 'Vassal') s -= 10;
  if (geopolitics === 'État paria') s -= 6;
  if (['Dictature militaire', 'Junte révolutionnaire'].includes(regime)) s += 6;
  if (system === 'Service militaire 5 ans') s += 5;
  return clamp(Math.round(s));
}

export function computeWorldRank(score: number): WorldRank {
  if (score >= 88) return { label: 'Top 3 — Hégémon mondial incontesté', approxRank: 3 };
  if (score >= 80) return { label: 'Top 10 — Superpuissance générationnelle', approxRank: 10 };
  if (score >= 72) return { label: 'Top 20 — Puissance mondiale majeure', approxRank: 20 };
  if (score >= 64) return { label: 'Top 40 — Puissance régionale dominante', approxRank: 40 };
  if (score >= 56) return { label: 'Top 60 — Acteur régional crédible', approxRank: 60 };
  if (score >= 48) return { label: 'Top 90 — Nation moyenne stable', approxRank: 90 };
  if (score >= 40) return { label: 'Top 130 — Pays sans grande influence', approxRank: 130 };
  if (score >= 32) return { label: 'Top 160 — Pays en développement fragile', approxRank: 160 };
  if (score >= 24) return { label: 'Top 180 — État fragile en difficulté', approxRank: 180 };
  if (score >= 15) return { label: 'Bottom 15 — Pays oublié du monde', approxRank: 190 };
  return { label: 'Dernier — État failli en perdition', approxRank: 195 };
}

export function scoreCountry(country: Country): PowerScore {
  const stability = computeStability(country, country.hdi);
  const economy = computeEconomy(country, country.hdi);
  const military = computeMilitary(country, economy);
  const total = Math.round(
    economy * ECONOMY_WEIGHT + military * MILITARY_WEIGHT + stability * STABILITY_WEIGHT,
  );
  const tier: Tier = getTierForScore(total);
  const worldRank = computeWorldRank(total);
  return { stability, economy, military, total, tier, worldRank };
}

export function pickSubScoreTone(subs: SubScores): keyof SubScores {
  const ordered: Array<[keyof SubScores, number]> = [
    ['stability', subs.stability],
    ['economy', subs.economy],
    ['military', subs.military],
  ];
  ordered.sort((a, b) => b[1] - a[1]);
  return ordered[0]![0];
}
