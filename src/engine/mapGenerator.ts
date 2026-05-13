import type { Country, HiddenResource, ResourceOnMap } from '@/types';
import { BIOMES, getBiomeInfo } from '@/data/biomes';
import { HIDDEN_RESOURCES } from '@/data/resources';
import { mulberry32, type RNG } from './rng';
import { isPointInPolygon, polygonToSvgPath, type Point } from '@/utils/geometry';

export interface CountryMapZone {
  readonly x: number;
  readonly y: number;
  readonly radius: number;
  readonly biome: string;
  readonly fill: string;
}

export interface CountryMapModel {
  /** SVG `d` attribute for the country outline. */
  readonly outlinePath: string;
  readonly outlinePoints: readonly Point[];
  readonly zones: readonly CountryMapZone[];
  readonly resources: readonly ResourceOnMap[];
  readonly width: number;
  readonly height: number;
  /** Center of the country, useful for compass placement. */
  readonly center: Point;
}

const WIDTH = 800;
const HEIGHT = 500;
const CENTER: Point = { x: 400, y: 250 };
const BASE_RADIUS = 200;

function numZonesFor(km2: number): 3 | 5 | 7 | 9 {
  if (km2 < 10_000) return 3;
  if (km2 < 500_000) return 5;
  if (km2 < 5_000_000) return 7;
  return 9;
}

function numHiddenFor(km2: number): 3 | 4 | 5 | 6 {
  if (km2 < 10_000) return 3;
  if (km2 < 1_000_000) return 4;
  if (km2 < 5_000_000) return 5;
  return 6;
}

function seedFromCountry(country: Country): number {
  let h = 0x811c9dc5;
  for (const ch of country.seed) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function buildOutline(rng: RNG): Point[] {
  const numVertices = 14 + Math.floor(rng() * 6);
  const points: Point[] = [];
  for (let i = 0; i < numVertices; i += 1) {
    const angle = (i / numVertices) * Math.PI * 2;
    const variation = 0.65 + rng() * 0.55;
    const rx = BASE_RADIUS * variation * 1.4;
    const ry = BASE_RADIUS * variation * 0.9;
    points.push({
      x: CENTER.x + Math.cos(angle) * rx,
      y: CENTER.y + Math.sin(angle) * ry,
    });
  }
  return points;
}

function pickZoneBiomes(primary: string, count: number, rng: RNG): string[] {
  const info = BIOMES[primary];
  const secondaries = info?.secondaries ?? ['Forêt tempérée', 'Montagneux'];
  const zones: string[] = [];
  for (let i = 0; i < count; i += 1) {
    if (i < Math.ceil(count * 0.5)) {
      zones.push(primary);
    } else {
      const idx = Math.floor(rng() * secondaries.length);
      zones.push(secondaries[idx]!);
    }
  }
  for (let i = zones.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [zones[i], zones[j]] = [zones[j]!, zones[i]!];
  }
  return zones;
}

function placeInside(
  rng: RNG,
  outline: readonly Point[],
  spread: { sx: number; sy: number },
): Point {
  let p: Point = CENTER;
  for (let tries = 0; tries < 20; tries += 1) {
    const candidate: Point = {
      x: CENTER.x + (rng() - 0.5) * BASE_RADIUS * spread.sx,
      y: CENTER.y + (rng() - 0.5) * BASE_RADIUS * spread.sy,
    };
    if (isPointInPolygon(candidate, outline)) {
      return candidate;
    }
    p = candidate;
  }
  return p;
}

function pickHiddenResources(rng: RNG, count: number): HiddenResource[] {
  const pool = [...HIDDEN_RESOURCES];
  const picked: HiddenResource[] = [];
  for (let i = 0; i < count && pool.length > 0; i += 1) {
    const idx = Math.floor(rng() * pool.length);
    picked.push(pool.splice(idx, 1)[0]!);
  }
  return picked;
}

/**
 * Generate a fully-deterministic country map from a Country state.
 *
 * Determinism: the seed is derived from `country.seed` (biome, area, population,
 * ideology, economies). Re-running with the same country yields the same map.
 */
export function generateMap(country: Country): CountryMapModel {
  const rng = mulberry32(seedFromCountry(country));
  const outline = buildOutline(rng);
  const zoneCount = numZonesFor(country.areaKm2);
  const biomeOrder = pickZoneBiomes(country.biome, zoneCount, rng);

  const zones: CountryMapZone[] = biomeOrder.map((biome) => {
    const p = placeInside(rng, outline, { sx: 2.5, sy: 1.6 });
    const radius = 80 + rng() * 40;
    const fill = getBiomeInfo(biome).fill;
    return { x: p.x, y: p.y, radius, biome, fill };
  });

  const hiddenCount = numHiddenFor(country.areaKm2);
  const picked = pickHiddenResources(rng, hiddenCount);
  const resources: ResourceOnMap[] = picked.map((resource) => {
    const p = placeInside(rng, outline, { sx: 2.3, sy: 1.5 });
    return { resource, x: p.x / WIDTH, y: p.y / HEIGHT };
  });

  return {
    outlinePath: polygonToSvgPath(outline),
    outlinePoints: outline,
    zones,
    resources,
    width: WIDTH,
    height: HEIGHT,
    center: CENTER,
  };
}
