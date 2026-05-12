import type { Tier, TierId } from '@/types';

/** Tiers ordered from worst to best. Find by iterating in REVERSE for first match >= minScore. */
export const TIERS: readonly Tier[] = [
  {
    id: 'cooked',
    label: 'BRO IS COOKED',
    emoji: '💀',
    minScore: 0,
    accentClass: 'text-red',
    verdict: "Ce pays n'aurait jamais dû voir le jour. Game over avant le tutoriel.",
  },
  {
    id: 'L',
    label: 'L tier · Skill issue',
    emoji: '🥲',
    minScore: 25,
    accentClass: 'text-orange',
    verdict: 'Ça part mal. Il faudra plus que du courage pour relever ce tas de cendres.',
  },
  {
    id: 'mid',
    label: 'Mid country',
    emoji: '😐',
    minScore: 40,
    accentClass: 'text-yellow',
    verdict: 'Un pays normal. Personne n’en parlera jamais aux infos internationales.',
  },
  {
    id: 'solid',
    label: 'Solid W',
    emoji: '🔥',
    minScore: 55,
    accentClass: 'text-cyan',
    verdict: 'Ce pays joue dans la cour des grands. Voisins jaloux garantis.',
  },
  {
    id: 'gigachad',
    label: 'GIGACHAD nation',
    emoji: '💪',
    minScore: 70,
    accentClass: 'text-green-bright',
    verdict: 'Une nation taillée pour dominer son continent. Les rivaux baissent les yeux.',
  },
  {
    id: 'legendary',
    label: 'LEGENDARY · Built different',
    emoji: '👑',
    minScore: 82,
    accentClass: 'text-pink',
    verdict: 'On parle d’un pays qui réécrit la carte du monde. Les manuels d’Histoire l’attendent.',
  },
];

export function getTierForScore(score: number): Tier {
  for (let i = TIERS.length - 1; i >= 0; i -= 1) {
    const t = TIERS[i];
    if (t && score >= t.minScore) return t;
  }
  return TIERS[0]!;
}

export function getTierById(id: TierId): Tier {
  const t = TIERS.find((tt) => tt.id === id);
  if (!t) throw new Error(`Unknown tier id: ${id}`);
  return t;
}
