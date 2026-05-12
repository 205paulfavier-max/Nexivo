import type { ResourceOnMap } from './country.types';

export interface BiomeZone {
  /** Polygon points in SVG units, "x,y x,y …". */
  readonly polygon: string;
  readonly biome: string;
  readonly fill: string;
}

export interface CountryMapData {
  /** Country outline polygon points. */
  readonly outline: string;
  readonly zones: readonly BiomeZone[];
  readonly resources: readonly ResourceOnMap[];
  /** Viewport size for the SVG. */
  readonly width: number;
  readonly height: number;
}
