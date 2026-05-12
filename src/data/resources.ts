import type { HiddenResource } from '@/types';

/**
 * 17 hidden resources discoverable on the country map. Bonuses lift the
 * country, malus weigh it down; both modify scoring deltas via their fields.
 */
export const HIDDEN_RESOURCES: readonly HiddenResource[] = [
  {
    id: 'diamonds',
    icon: '💎',
    label: 'Gisement de diamants',
    kind: 'bonus',
    description: 'un gisement de diamants découvert sous les fondations.',
    economyBonus: 5,
  },
  {
    id: 'oil-secret',
    icon: '🛢️',
    label: 'Réserves pétrolières secrètes',
    kind: 'bonus',
    description: 'des réserves pétrolières gardées secrètes par le gouvernement.',
    economyBonus: 8,
    militaryBonus: 3,
  },
  {
    id: 'uranium',
    icon: '⚛️',
    label: "Mine d'uranium clandestine",
    kind: 'bonus',
    description: "une mine d'uranium exploitée à l'écart des observateurs internationaux.",
    militaryBonus: 10,
  },
  {
    id: 'geothermal',
    icon: '🌋',
    label: 'Faille géothermique',
    kind: 'bonus',
    description: 'une faille géothermique offrant une énergie quasi-illimitée.',
    economyBonus: 4,
    hdiBonus: 0.03,
  },
  {
    id: 'archaeological',
    icon: '⚱️',
    label: 'Trésor archéologique',
    kind: 'bonus',
    description: "un trésor archéologique qui attire les chercheurs du monde entier.",
    economyBonus: 5,
  },
  {
    id: 'rare-earths',
    icon: '⚗️',
    label: 'Terres rares',
    kind: 'bonus',
    description: 'des terres rares essentielles à la tech mondiale.',
    economyBonus: 7,
  },
  {
    id: 'fishing-miracle',
    icon: '🐟',
    label: 'Banc de pêche miraculeux',
    kind: 'bonus',
    description: 'un banc de pêche miraculeux qui régénère plus vite qu’il n’est exploité.',
    economyBonus: 3,
    hdiBonus: 0.02,
  },
  {
    id: 'fertile-soil',
    icon: '🌾',
    label: 'Sol ultra-fertile',
    kind: 'bonus',
    description: 'un sol ultra-fertile permettant trois récoltes par an.',
    hdiBonus: 0.04,
  },
  {
    id: 'lithium',
    icon: '⛏️',
    label: 'Mines de lithium inexploitées',
    kind: 'bonus',
    description: 'des mines de lithium encore intactes, convoitées par toutes les batteries du futur.',
    economyBonus: 6,
  },
  {
    id: 'lost-civilization',
    icon: '🗿',
    label: 'Civilisation perdue',
    kind: 'bonus',
    description: "les ruines d'une civilisation oubliée qui font rêver les touristes.",
    economyBonus: 6,
  },
  {
    id: 'local-legend',
    icon: '🐉',
    label: 'Légende locale',
    kind: 'bonus',
    description: 'une légende locale tenace qui attire curieux et reporters.',
    economyBonus: 4,
  },
  {
    id: 'nuclear-site',
    icon: '☢️',
    label: 'Site nucléaire abandonné',
    kind: 'malus',
    description: "un site nucléaire abandonné qui contamine encore les nappes phréatiques.",
    hdiBonus: -0.05,
  },
  {
    id: 'endemic-disease',
    icon: '🦟',
    label: 'Foyer endémique de maladie',
    kind: 'malus',
    description: "un foyer endémique de maladie tropicale que les ONG n'arrivent pas à éradiquer.",
    hdiBonus: -0.04,
  },
  {
    id: 'mass-grave',
    icon: '🪦',
    label: 'Charnier de génocide passé',
    kind: 'malus',
    description: "un charnier témoignant d'un génocide oublié par l'histoire.",
    militaryBonus: 2,
  },
  {
    id: 'tsunami-zone',
    icon: '🌊',
    label: 'Zone de tsunami récurrent',
    kind: 'malus',
    description: 'une zone de tsunami récurrent qui ravage l’économie côtière tous les dix ans.',
    economyBonus: -5,
  },
  {
    id: 'bio-lab',
    icon: '🦠',
    label: 'Laboratoire biologique secret',
    kind: 'malus',
    description: "un laboratoire biologique secret dont personne ne veut admettre l'existence.",
    militaryBonus: 3,
  },
  {
    id: 'contaminated-cemetery',
    icon: '💀',
    label: 'Cimetière contaminé',
    kind: 'malus',
    description: 'un cimetière contaminé interdit aux vivants depuis trois générations.',
    hdiBonus: -0.03,
  },
];

export function getResourceById(id: string): HiddenResource {
  const r = HIDDEN_RESOURCES.find((res) => res.id === id);
  if (!r) throw new Error(`Unknown resource id: ${id}`);
  return r;
}
