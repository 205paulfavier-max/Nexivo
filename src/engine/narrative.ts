import type { Country, PowerScore } from '@/types';
import { STAT_VALUES, type StatLabel } from '@/types';
import { formatNumber, joinFr } from '@/utils/format';

export interface Narrative {
  /** First sentence — country at a glance. Plain text, no HTML. */
  readonly country: string;
  /** Second sentence — leader portrait. Plain text. */
  readonly leader: string;
  /** Short one-liner verdict matching the tier. */
  readonly verdict: string;
}

function sizeDescriptor(km2: number): string {
  if (km2 < 1000) return 'minuscule';
  if (km2 < 50_000) return 'petit';
  if (km2 < 500_000) return 'moyen';
  if (km2 < 5_000_000) return 'vaste';
  return 'immense';
}

function populationDescriptor(pop: number): string {
  if (pop < 1_000_000) return 'sous-peuplé';
  if (pop < 50_000_000) return 'à la démographie modérée';
  if (pop < 500_000_000) return 'densément peuplé';
  return 'surpeuplé';
}

function hdiDescriptor(hdi: number): string {
  if (hdi < 0.4) return 'misérable';
  if (hdi < 0.6) return 'en développement';
  if (hdi < 0.8) return 'aux conditions de vie correctes';
  if (hdi < 0.9) return 'au niveau de vie élevé';
  return 'parmi les plus prospères au monde';
}

function statLadder(label: string): number {
  // 1..10 ladder for the avg leader competence
  const map: Record<StatLabel, number> = {
    'Ultra nul': 1,
    Nul: 2,
    Faible: 3,
    Médiocre: 4,
    Moyen: 5,
    Correct: 6,
    Bon: 7,
    'Très bon': 8,
    Excellent: 9,
    Légendaire: 10,
  };
  return map[label as StatLabel] ?? 5;
}

function leaderDescriptor(avg: number): string {
  if (avg <= 2.5) return 'incompétent';
  if (avg <= 4) return 'limité';
  if (avg <= 6) return 'correct';
  if (avg <= 8) return 'redoutable';
  return 'légendaire';
}

function strengthLabel(country: Country): string {
  const { intelligence, charisma, economicSkill, militarySkill } = country.leader;
  const stats: Array<[string, number]> = [
    ['stratège', STAT_VALUES[intelligence as StatLabel] ?? 45],
    ['charismatique', STAT_VALUES[charisma as StatLabel] ?? 45],
    ['gestionnaire économique', STAT_VALUES[economicSkill as StatLabel] ?? 45],
    ['chef militaire', STAT_VALUES[militarySkill as StatLabel] ?? 45],
  ];
  stats.sort((a, b) => b[1] - a[1]);
  return stats[0]![0];
}

function verdictFor(score: number, tierLabel: string): string {
  let core: string;
  if (score < 20) core = 'ce pays est cuit';
  else if (score < 35) core = 'nation en grande difficulté';
  else if (score < 50) core = 'pays moyen sans grande envergure';
  else if (score < 65) core = 'puissance régionale crédible';
  else if (score < 78) core = 'poids lourd géopolitique';
  else core = 'superpuissance générationnelle';
  return `→ Verdict : ${core}. ${tierLabel}`;
}

export function generateNarrative(country: Country, power: PowerScore): Narrative {
  const economyText = joinFr(country.economies.map((e) => e.toLowerCase()));
  const size = sizeDescriptor(country.areaKm2);
  const pop = populationDescriptor(country.population);
  const hdiDesc = hdiDescriptor(country.hdi);

  const sentence1 =
    `Pays ${size} de ${formatNumber(country.areaKm2)} km² au climat ` +
    `${country.biome.toLowerCase()}, ${pop} avec ${formatNumber(country.population)} habitants, ` +
    `gouverné en ${country.regime.toLowerCase()} sous l'idéologie ${country.ideology.toLowerCase()}, ` +
    `son économie repose sur ${economyText} et son développement est ${hdiDesc} ` +
    `(HDI ${country.hdi.toFixed(2)}).`;

  const ladderAvg =
    (statLadder(country.leader.intelligence) +
      statLadder(country.leader.charisma) +
      statLadder(country.leader.economicSkill) +
      statLadder(country.leader.militarySkill)) /
    4;
  const leaderTier = leaderDescriptor(ladderAvg);
  const strength = strengthLabel(country);

  let healthMention = '';
  if (
    ['Démence précoce', 'Espérance < 2 ans', 'Cancer rémission', 'Maladie cardiaque'].includes(
      country.leader.health,
    )
  ) {
    healthMention = `, miné par ${country.leader.health.toLowerCase()}`;
  } else if (country.leader.health === 'Excellente santé') {
    healthMention = ', en pleine forme';
  }

  const weaknessMention =
    country.leader.weakness === 'Aucune faiblesse'
      ? ', sans faiblesse exploitable'
      : `, fragilisé par ${country.leader.weakness.toLowerCase()}`;

  const sentence2 =
    `À sa tête, un ${country.leader.background.toLowerCase()} de ${country.leader.age} ans ` +
    `au style ${country.leader.style.toLowerCase()}, ${leaderTier} sur l'ensemble de ses compétences ` +
    `avec une force notable comme ${strength}${healthMention}${weaknessMention}, ` +
    `son pouvoir étant issu de « ${country.leader.legitimacy.toLowerCase()} ».`;

  return {
    country: sentence1,
    leader: sentence2,
    verdict: verdictFor(power.total, `${power.tier.label} ${power.tier.emoji}`),
  };
}
