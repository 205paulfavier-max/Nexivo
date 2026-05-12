export interface Point {
  readonly x: number;
  readonly y: number;
}

export function isPointInPolygon(point: Point, polygon: readonly Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i]!;
    const b = polygon[j]!;
    const intersect =
      a.y > point.y !== b.y > point.y &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function polygonToSvgPath(points: readonly Point[]): string {
  if (points.length === 0) return '';
  const head = points[0]!;
  let path = `M ${head.x.toFixed(1)} ${head.y.toFixed(1)}`;
  for (let i = 1; i < points.length; i += 1) {
    const p = points[i]!;
    path += ` L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }
  return `${path} Z`;
}
