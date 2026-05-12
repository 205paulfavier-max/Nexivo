import type { Country } from '@/types';
import { getBiomeInfo } from '@/data/biomes';
import { getEconomyVisual } from '@/data/economies';

const SIZE_DESCRIPTOR: Array<readonly [number, string]> = [
  [1000, 'tiny island nation'],
  [100_000, 'small compact territory'],
  [1_000_000, 'medium-sized country'],
  [5_000_000, 'vast continental nation'],
  [Infinity, 'colossal empire spanning multiple climate zones'],
];

function sizeDescriptor(km2: number): string {
  for (const [limit, desc] of SIZE_DESCRIPTOR) {
    if (km2 < limit) return desc;
  }
  return 'unknown territory';
}

function populationVisual(population: number, km2: number): string {
  const density = km2 > 0 ? population / km2 : 0;
  if (density > 500) return 'densely packed cities with skyscrapers and crowded streets';
  if (density > 100) return 'medium-sized cities connected by infrastructure';
  if (density > 10) return 'small towns scattered across the landscape';
  return 'mostly empty wilderness with rare settlements';
}

const IDEO_ATMOSPHERE: Readonly<Record<string, string>> = {
  'Nationalisme dur': 'imposing nationalist monuments and flags everywhere',
  'Communisme orthodoxe': 'soviet-style brutalist architecture, red banners',
  'Théocratie morale': 'massive religious temples dominating the skyline',
  'Militarisme expansionniste': 'fortified cities, military parades visible',
  'Techno-progressisme': 'futuristic glass towers, neon lights, drones',
  'Écologisme radical': 'vertical gardens, solar panels, restored ecosystems',
  'Capitalisme libéral': 'glittering business districts, corporate logos',
  'Anarcho-capitalisme': 'wild west aesthetic, private security everywhere',
  'Socialisme démocratique': 'cooperative urban planning and public parks',
  'Conservatisme traditionaliste': 'heritage architecture and well-kept old quarters',
  'Populisme identitaire': 'huge nationalist murals and political rallies',
  'Pacifisme constitutionnel': 'peace gardens and disarmament monuments',
  'Tribalisme clanique': 'traditional clan compounds and ceremonial circles',
  'Transhumanisme officiel': 'biotech spires and augmented citizens visible from above',
  'Méritocratie pure': 'meritocratic academies and high-rise testing centers',
};

const MIDJOURNEY_TAIL =
  'Aspect ratio: 16:9. Quality: ultra-detailed, 8K, IMAX-quality, hyperrealistic textures. ' +
  'No text or labels on the map itself. --ar 16:9 --v 6.1 --style raw --q 2';

/** Build a Midjourney/Flux/DALL-E prompt describing the country visually. */
export function generateAiPrompt(country: Country): string {
  const biome = country.biome ? getBiomeInfo(country.biome).visual : 'mysterious landscape';
  const size = sizeDescriptor(country.areaKm2);
  const ecoVisuals = country.economies
    .slice(0, 2)
    .map((e) => getEconomyVisual(e))
    .filter(Boolean)
    .join(', ');
  const pop = populationVisual(country.population, country.areaKm2);
  const atmosphere = IDEO_ATMOSPHERE[country.ideology] ?? 'neutral civic atmosphere';
  const animal = (country.animal || 'mysterious creature').toLowerCase();

  return (
    `A breathtaking aerial cinematic view of a fictional ${size} with ${biome}. ` +
    (ecoVisuals ? `Across the territory: ${ecoVisuals}. ` : '') +
    `${pop.charAt(0).toUpperCase()}${pop.slice(1)}. ${atmosphere}. ` +
    `National emblem features a ${animal}, subtly visible on flags or monuments. ` +
    'Style: stylized fantasy world map blended with photorealistic aerial photography, ' +
    'top-down or 3/4 isometric perspective, hand-painted texture with modern game cinematic quality. ' +
    'Reference: Civilization VI meets Studio Ghibli landscape painting meets National Geographic aerial photography. ' +
    'Lighting: golden hour cinematic, dramatic shadows, atmospheric depth, volumetric fog in valleys. ' +
    'Composition: balanced with clear focal points, vast scale visible. ' +
    'Color palette: rich saturated biome colors with cohesive harmony. ' +
    'Hidden details: subtle visual hints of secret resources beneath the landscape ' +
    '(faint glows, crystalline patterns in rocks, mysterious circular formations) — ' +
    'these should be visible only to careful viewers, never labeled. ' +
    MIDJOURNEY_TAIL
  );
}
