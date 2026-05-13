import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCountryStore } from '@/store/countryStore';
import { WHEELS } from '@/data/wheels';

function freshStore() {
  const store = useCountryStore;
  store.getState().reset();
  return store;
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('countryStore / initial state', () => {
  it('starts at wheel 0 with empty results and no spin in flight', () => {
    const s = freshStore().getState();
    expect(s.currentWheelIndex).toBe(0);
    expect(s.results).toEqual({});
    expect(s.isSpinning).toBe(false);
    expect(s.country).toBeNull();
    expect(s.power).toBeNull();
  });

  it('exposes a settable speed preset', () => {
    const store = freshStore();
    store.getState().setSpeed('epic');
    expect(store.getState().speedPreset).toBe('epic');
  });
});

describe('countryStore / startSpin + commitSpin', () => {
  it('marks isSpinning true and records a pending spin', () => {
    const store = freshStore();
    store.getState().startSpin();
    const s = store.getState();
    expect(s.isSpinning).toBe(true);
    expect(s.pendingSpin).not.toBeNull();
    expect(s.pendingSpin!.targetIndex).toBeGreaterThanOrEqual(0);
  });

  it('refuses concurrent spins', () => {
    const store = freshStore();
    store.getState().startSpin();
    const before = store.getState().pendingSpin?.nonce;
    store.getState().startSpin();
    expect(store.getState().pendingSpin?.nonce).toBe(before);
  });

  it('advances to the next wheel after commitSpin', () => {
    const store = freshStore();
    store.getState().startSpin();
    store.getState().commitSpin();
    const s = store.getState();
    expect(s.isSpinning).toBe(false);
    expect(s.pendingSpin).toBeNull();
    expect(s.currentWheelIndex).toBe(1);
    expect(s.results[1]).toBeDefined();
  });
});

describe('countryStore / full spin cycle', () => {
  it('builds a Country and Power score after all 20 wheels are spun', () => {
    const store = freshStore();
    while (store.getState().currentWheelIndex < WHEELS.length) {
      store.getState().startSpin();
      store.getState().commitSpin();
    }
    const s = store.getState();
    expect(s.country).not.toBeNull();
    expect(s.power).not.toBeNull();
    expect(s.narrative).not.toBeNull();
    expect(s.aiPrompt).not.toBeNull();
    expect(s.mapModel).not.toBeNull();
    expect(s.power!.total).toBeGreaterThanOrEqual(0);
    expect(s.power!.total).toBeLessThanOrEqual(100);
  });

  it('records the generated country in history', () => {
    const store = freshStore();
    while (store.getState().currentWheelIndex < WHEELS.length) {
      store.getState().startSpin();
      store.getState().commitSpin();
    }
    expect(store.getState().history.length).toBeGreaterThan(0);
  });

  it('persists history to localStorage', () => {
    const store = freshStore();
    while (store.getState().currentWheelIndex < WHEELS.length) {
      store.getState().startSpin();
      store.getState().commitSpin();
    }
    expect(localStorage.getItem('country-spinner:history:v1')).not.toBeNull();
  });
});

describe('countryStore / reveal resource', () => {
  it('marks a resource as revealed', () => {
    const store = freshStore();
    store.getState().revealResource('diamonds');
    expect(store.getState().revealedResources.has('diamonds')).toBe(true);
  });

  it('is idempotent', () => {
    const store = freshStore();
    store.getState().revealResource('diamonds');
    store.getState().revealResource('diamonds');
    expect(store.getState().revealedResources.size).toBe(1);
  });
});

describe('countryStore / reset', () => {
  it('clears all state and returns to wheel 0', () => {
    const store = freshStore();
    store.getState().startSpin();
    store.getState().commitSpin();
    store.getState().reset();
    const s = store.getState();
    expect(s.currentWheelIndex).toBe(0);
    expect(s.results).toEqual({});
    expect(s.isSpinning).toBe(false);
  });

  it('does not erase persisted history', () => {
    const store = freshStore();
    while (store.getState().currentWheelIndex < WHEELS.length) {
      store.getState().startSpin();
      store.getState().commitSpin();
    }
    const historyBefore = store.getState().history.length;
    store.getState().reset();
    expect(store.getState().history.length).toBe(historyBefore);
  });
});

describe('countryStore / multi-economy progression', () => {
  it('stays on wheel 4 until enough economies have been picked', () => {
    const store = freshStore();
    // Spin wheel 1 (biome).
    store.getState().startSpin();
    store.getState().commitSpin();
    // Force a "large" country by manually injecting the area result. We replay
    // wheel 2 spins until the picked area is >= 100_000 km² which guarantees
    // at least 2 economies.
    let attempts = 0;
    while (Number(store.getState().results[2]?.value ?? 0) < 100_000 && attempts < 200) {
      store.getState().reset();
      store.getState().startSpin();
      store.getState().commitSpin();
      store.getState().startSpin();
      store.getState().commitSpin();
      attempts += 1;
    }
    // Now spin through wheels 3 and 4 (first economy).
    store.getState().startSpin();
    store.getState().commitSpin();
    store.getState().startSpin();
    store.getState().commitSpin();
    // After the first wheel-4 spin we should still be on wheel index 3 (still 4 in 1-based).
    const s = store.getState();
    expect(s.currentWheelIndex).toBe(3);
    expect(s.economiesNeeded).toBeGreaterThanOrEqual(2);
  });
});
