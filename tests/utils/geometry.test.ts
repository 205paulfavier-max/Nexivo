import { describe, expect, it } from 'vitest';
import { isPointInPolygon, polygonToSvgPath, type Point } from '@/utils/geometry';

const square: Point[] = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 10 },
  { x: 0, y: 10 },
];

describe('utils / isPointInPolygon', () => {
  it('detects a point clearly inside', () => {
    expect(isPointInPolygon({ x: 5, y: 5 }, square)).toBe(true);
  });

  it('detects a point clearly outside', () => {
    expect(isPointInPolygon({ x: 20, y: 5 }, square)).toBe(false);
    expect(isPointInPolygon({ x: -1, y: 5 }, square)).toBe(false);
  });
});

describe('utils / polygonToSvgPath', () => {
  it('produces a closed M/L/Z path', () => {
    const path = polygonToSvgPath(square);
    expect(path.startsWith('M ')).toBe(true);
    expect(path.endsWith(' Z')).toBe(true);
    expect(path.split('L')).toHaveLength(square.length);
  });

  it('returns empty string for an empty polygon', () => {
    expect(polygonToSvgPath([])).toBe('');
  });
});
