import { describe, expect, it, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Wheel } from '@/components/Wheel/Wheel';
import { liveVisualPos, nextRotation } from '@/components/Wheel/useWheelAnimation';
import { useCountryStore } from '@/store/countryStore';
import { WHEELS, getWheelById } from '@/data/wheels';

beforeEach(() => {
  localStorage.clear();
  useCountryStore.getState().reset();
});

describe('<Wheel>', () => {
  it('renders an SVG with the wheel label aria-label', () => {
    const { getByRole } = render(<Wheel wheel={getWheelById(1)} />);
    const svg = getByRole('img', { name: /BIOME/i });
    expect(svg.tagName.toLowerCase()).toBe('svg');
  });

  it('renders one path per segment plus a central hole', () => {
    const wheel = getWheelById(1);
    const { container } = render(<Wheel wheel={wheel} />);
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBe(wheel.segments.length);
  });

  it('renders text labels for short wheels', () => {
    const wheel = getWheelById(1); // 12 segments → labels shown
    const { container } = render(<Wheel wheel={wheel} />);
    const texts = container.querySelectorAll('text');
    // 1 center "SPIN" text + N segment labels at least
    expect(texts.length).toBeGreaterThanOrEqual(wheel.segments.length);
  });
});

describe('Wheel animation math', () => {
  it('nextRotation always increases by at least 6 full turns', () => {
    const target = { targetVisualPos: 5, segmentCount: 12, durationMs: 4000, nonce: 1 };
    const next = nextRotation(0, target);
    expect(next).toBeGreaterThanOrEqual(6 * 360);
  });

  it('liveVisualPos returns 0 for rotation 0', () => {
    expect(liveVisualPos(0, 12)).toBe(0);
  });

  it('liveVisualPos returns the last segment for a tiny CW rotation', () => {
    // Rotating CW by half a segment brings the previous segment under the pointer.
    expect(liveVisualPos(15, 12)).toBe(11);
  });

  it('liveVisualPos normalises rotations greater than 360', () => {
    expect(liveVisualPos(360 + 15, 12)).toBe(11);
  });
});

describe('Wheel + store integration', () => {
  it('mounts cleanly for every wheel without throwing', () => {
    for (const w of WHEELS) {
      const { unmount } = render(<Wheel wheel={w} />);
      unmount();
    }
  });
});
