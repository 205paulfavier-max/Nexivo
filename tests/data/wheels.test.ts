import { describe, expect, it } from 'vitest';
import { WHEELS, WHEEL_COUNT, getWheelById } from '@/data/wheels';

describe('data / WHEELS', () => {
  it('exposes exactly 20 wheels', () => {
    expect(WHEEL_COUNT).toBe(20);
    expect(WHEELS).toHaveLength(20);
  });

  it('numbers wheels 1..20 in order', () => {
    WHEELS.forEach((w, i) => expect(w.id).toBe(i + 1));
  });

  it('splits wheels into country (1-10) and leader (11-20)', () => {
    WHEELS.forEach((w) => {
      if (w.id <= 10) expect(w.group).toBe('country');
      else expect(w.group).toBe('leader');
    });
  });

  it('has the expected segment counts for the key wheels', () => {
    expect(getWheelById(1).segments).toHaveLength(12); // biome
    expect(getWheelById(2).segments).toHaveLength(30); // area
    expect(getWheelById(3).segments).toHaveLength(30); // regime
    expect(getWheelById(4).segments).toHaveLength(100); // economy
    expect(getWheelById(5).segments).toHaveLength(22); // population
    expect(getWheelById(6).segments).toHaveLength(100); // hdi
    expect(getWheelById(7).segments).toHaveLength(15); // ideology
    expect(getWheelById(9).segments).toHaveLength(15); // animal
    expect(getWheelById(10).segments).toHaveLength(12); // geopolitics
    expect(getWheelById(11).segments).toHaveLength(10); // intelligence
    expect(getWheelById(15).segments).toHaveLength(10); // age
  });

  it('emits an HDI scale from 0.00 to 0.99', () => {
    const hdi = getWheelById(6).segments;
    expect(hdi[0]).toBe('0.00');
    expect(hdi[hdi.length - 1]).toBe('0.99');
  });

  it('throws on an unknown wheel id', () => {
    expect(() => getWheelById(0)).toThrow();
    expect(() => getWheelById(21)).toThrow();
  });
});
