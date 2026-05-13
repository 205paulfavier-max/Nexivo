import { describe, expect, it } from 'vitest';
import { formatLabel, formatNumber, joinFr } from '@/utils/format';

describe('utils / formatNumber', () => {
  it('groups thousands with non-breaking spaces', () => {
    expect(formatNumber(1234567)).toBe('1 234 567');
  });

  it('keeps small numbers unchanged', () => {
    expect(formatNumber(42)).toBe('42');
  });

  it('handles negative numbers', () => {
    expect(formatNumber(-12345)).toBe('-12 345');
  });

  it('falls back to em-dash for non-finite numbers', () => {
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('—');
    expect(formatNumber(Number.NaN)).toBe('—');
  });
});

describe('utils / formatLabel', () => {
  it('returns the input untouched when shorter than max', () => {
    expect(formatLabel('Hello', 30)).toBe('Hello');
  });

  it('truncates with ellipsis past the max length', () => {
    const out = formatLabel('a very long label that should be truncated', 10);
    expect(out.endsWith('…')).toBe(true);
    expect(out.length).toBeLessThanOrEqual(11);
  });

  it('breaks on word boundaries when possible', () => {
    const out = formatLabel('one two three four', 14);
    expect(out).toBe('one two three…');
  });
});

describe('utils / joinFr', () => {
  it('returns empty string for empty input', () => {
    expect(joinFr([])).toBe('');
  });

  it('returns the single element as-is', () => {
    expect(joinFr(['unique'])).toBe('unique');
  });

  it('joins two elements with "et"', () => {
    expect(joinFr(['a', 'b'])).toBe('a et b');
  });

  it('joins three+ elements with commas and final "et"', () => {
    expect(joinFr(['a', 'b', 'c'])).toBe('a, b et c');
  });
});
