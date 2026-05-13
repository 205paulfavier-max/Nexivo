import { describe, expect, it } from 'vitest';
import { SEGMENT_COLORS, getTextColor, pickSegmentColor } from '@/data/colors';

describe('data / SEGMENT_COLORS', () => {
  it('contains 12 vibrant colors', () => {
    expect(SEGMENT_COLORS).toHaveLength(12);
  });
});

describe('data / getTextColor', () => {
  it('returns black on yellow / cyan / lime backgrounds', () => {
    expect(getTextColor('#FFD60A')).toBe('#000000');
    expect(getTextColor('#00E5FF')).toBe('#000000');
    expect(getTextColor('#C1FF00')).toBe('#000000');
  });

  it('returns white on pink / purple / red', () => {
    expect(getTextColor('#FF2D87')).toBe('#FFFFFF');
    expect(getTextColor('#9D4EDD')).toBe('#FFFFFF');
    expect(getTextColor('#FF1744')).toBe('#FFFFFF');
  });
});

describe('data / pickSegmentColor', () => {
  it('cycles through the palette', () => {
    expect(pickSegmentColor(0)).toBe(SEGMENT_COLORS[0]);
    expect(pickSegmentColor(SEGMENT_COLORS.length)).toBe(SEGMENT_COLORS[0]);
    expect(pickSegmentColor(SEGMENT_COLORS.length + 1)).toBe(SEGMENT_COLORS[1]);
  });
});
