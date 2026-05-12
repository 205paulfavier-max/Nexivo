export interface BiomeInfo {
  readonly fill: string;
  /** Plausible adjacent biomes used to compose multi-zone maps. */
  readonly secondaries: readonly string[];
  /** One-line French descriptor used in narrative and AI prompts. */
  readonly visual: string;
}

export const BIOMES: Readonly<Record<string, BiomeInfo>> = {
  Désert: {
    fill: '#D4A24A',
    secondaries: ['Steppe', 'Montagneux', 'Méditerranéen', 'Marécages'],
    visual: "vast golden dunes under a scorching sun, sand storms in the distance",
  },
  Tropical: {
    fill: '#2E8B57',
    secondaries: ['Jungle', 'Archipel', 'Marécages', 'Volcanique'],
    visual: "lush emerald rainforests with cascading waterfalls and exotic birds",
  },
  Arctique: {
    fill: '#B8D8E8',
    secondaries: ['Toundra', 'Montagneux'],
    visual: "endless frozen tundra with crystalline ice formations and aurora borealis",
  },
  Montagneux: {
    fill: '#7A7A7A',
    secondaries: ['Forêt tempérée', 'Steppe', 'Toundra', 'Volcanique'],
    visual: "towering snow-capped peaks piercing through clouds, alpine villages",
  },
  Archipel: {
    fill: '#3DA5D9',
    secondaries: ['Tropical', 'Volcanique', 'Marécages'],
    visual: "scattered emerald islands in turquoise waters, white sand beaches",
  },
  Jungle: {
    fill: '#1A4D2E',
    secondaries: ['Tropical', 'Marécages', 'Montagneux', 'Volcanique'],
    visual: "dense canopy of ancient trees, hidden temples, vibrant wildlife",
  },
  Steppe: {
    fill: '#D4B85A',
    secondaries: ['Désert', 'Forêt tempérée', 'Montagneux'],
    visual: "rolling golden grasslands stretching to the horizon, nomadic camps",
  },
  Méditerranéen: {
    fill: '#C97B4A',
    secondaries: ['Désert', 'Montagneux', 'Forêt tempérée', 'Archipel'],
    visual: "olive groves and vineyards on terraced hills, whitewashed coastal villages",
  },
  Volcanique: {
    fill: '#5C2A1F',
    secondaries: ['Montagneux', 'Archipel', 'Jungle'],
    visual: "active volcanoes with glowing lava flows, black sand beaches, sulphur springs",
  },
  Marécages: {
    fill: '#4A5D3A',
    secondaries: ['Tropical', 'Jungle', 'Forêt tempérée'],
    visual: "misty swamplands with twisted mangroves, fireflies, hidden waterways",
  },
  Toundra: {
    fill: '#A8B5A8',
    secondaries: ['Arctique', 'Montagneux', 'Forêt tempérée'],
    visual: "endless frozen plains with herds of reindeer, ice-laden tundra moss",
  },
  'Forêt tempérée': {
    fill: '#3A6B3A',
    secondaries: ['Montagneux', 'Steppe', 'Marécages'],
    visual: "ancient temperate forests with mossy oaks, mist-filled valleys",
  },
};

export function getBiomeInfo(biome: string): BiomeInfo {
  const info = BIOMES[biome];
  if (!info) throw new Error(`Unknown biome: ${biome}`);
  return info;
}

export const BIOME_NAMES: readonly string[] = Object.keys(BIOMES);
