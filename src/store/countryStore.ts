import { create } from 'zustand';
import type {
  Country,
  PowerScore,
  ResultsByWheel,
  SegmentValue,
  SpeedPreset,
  SpinResult,
} from '@/types';
import { SPEED_DURATIONS } from '@/types';
import type { CountryMapModel, Narrative } from '@/engine';
import {
  buildCountry,
  generateAiPrompt,
  generateMap,
  generateNarrative,
  isComplete,
  scoreCountry,
  spinWheel,
} from '@/engine';
import { getEconomyCount } from '@/data/economies';
import { WHEELS, getWheelById } from '@/data/wheels';

const HISTORY_KEY = 'country-spinner:history:v1';
const HISTORY_MAX = 10;
const AUTOSPIN_DELAY_MS = 3000;

/** Internal mutable scratchpad for results, with a `__pending` slot used during animation. */
type MutableResults = Record<number, SpinResult | undefined> & {
  __pending?: SpinResult;
};

interface PendingSpin {
  /** Index of the target segment chosen by the engine, used by the Wheel component for animation. */
  readonly targetIndex: number;
  /** Animation duration in ms. */
  readonly durationMs: number;
  /** Counter that increments with every new pending spin — used by the Wheel to reset its transition. */
  readonly nonce: number;
}

export interface CountryState {
  // ---- progression ----
  readonly currentWheelIndex: number; // 0..19
  readonly results: ResultsByWheel;
  readonly isSpinning: boolean;
  readonly economiesNeeded: number; // 1..3
  readonly economiesSpun: number; // counter against economiesNeeded
  readonly speedPreset: SpeedPreset;
  readonly autoSpinActive: boolean;
  readonly pendingSpin: PendingSpin | null;
  // ---- derived (set on completion) ----
  readonly country: Country | null;
  readonly power: PowerScore | null;
  readonly narrative: Narrative | null;
  readonly aiPrompt: string | null;
  readonly mapModel: CountryMapModel | null;
  readonly revealedResources: ReadonlySet<string>;
  // ---- persisted history ----
  readonly history: readonly Country[];
  // ---- actions ----
  startSpin: () => void;
  commitSpin: () => void;
  reset: () => void;
  toggleAutoSpin: () => void;
  setSpeed: (preset: SpeedPreset) => void;
  revealResource: (id: string) => void;
  loadFromHistory: (country: Country) => void;
  clearHistory: () => void;
}

function loadHistory(): Country[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return (parsed as Country[]).slice(0, HISTORY_MAX);
  } catch {
    return [];
  }
}

function saveHistory(history: readonly Country[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, HISTORY_MAX)));
  } catch {
    // Quota exceeded or storage disabled — best-effort, ignore.
  }
}

let pendingSpinNonce = 0;
let autoSpinTimer: ReturnType<typeof setTimeout> | null = null;

function clearAutoSpinTimer(): void {
  if (autoSpinTimer !== null) {
    clearTimeout(autoSpinTimer);
    autoSpinTimer = null;
  }
}

export const useCountryStore = create<CountryState>((set, get) => ({
  currentWheelIndex: 0,
  results: {},
  isSpinning: false,
  economiesNeeded: 1,
  economiesSpun: 0,
  speedPreset: 'medium',
  autoSpinActive: false,
  pendingSpin: null,
  country: null,
  power: null,
  narrative: null,
  aiPrompt: null,
  mapModel: null,
  revealedResources: new Set<string>(),
  history: loadHistory(),

  startSpin: () => {
    const state = get();
    if (state.isSpinning) return;
    if (state.currentWheelIndex >= WHEELS.length) return;
    const wheel = WHEELS[state.currentWheelIndex]!;
    const result = spinWheel(wheel, state.results);
    pendingSpinNonce += 1;
    const stash: MutableResults = { ...state.results, __pending: result };
    set({
      isSpinning: true,
      pendingSpin: {
        targetIndex: result.chosenIndex,
        durationMs: SPEED_DURATIONS[state.speedPreset],
        nonce: pendingSpinNonce,
      },
      results: stash as ResultsByWheel,
    });
  },

  commitSpin: () => {
    const state = get();
    if (!state.isSpinning) return;
    const stash = state.results as MutableResults;
    const pendingResult = stash['__pending'];
    if (!pendingResult) {
      set({ isSpinning: false, pendingSpin: null });
      return;
    }

    // Strip the pending marker.
    const cleanResults: MutableResults = { ...stash };
    delete cleanResults['__pending'];

    const wheelId = pendingResult.wheelId;
    const isEconomyWheel = wheelId === 4;

    if (isEconomyWheel) {
      // Aggregate multi-economy results into a single SpinResult.value (string[]).
      const previous = cleanResults[4];
      const previousValues: SegmentValue[] = previous
        ? Array.isArray(previous.value)
          ? [...previous.value]
          : [previous.value]
        : [];
      // Deduplicate to avoid the same economy appearing twice.
      const newValue = pendingResult.value as SegmentValue;
      const merged = previousValues.includes(newValue)
        ? previousValues
        : [...previousValues, newValue];
      const result: SpinResult = {
        ...pendingResult,
        value: merged.length === 1 ? merged[0]! : merged,
      };
      cleanResults[4] = result;

      const km2 = Number(cleanResults[2]?.value ?? 1);
      const needed = getEconomyCount(km2);
      const spunCount = merged.length;

      if (spunCount < needed) {
        // Stay on wheel 4 for another spin.
        set({
          results: cleanResults as ResultsByWheel,
          isSpinning: false,
          pendingSpin: null,
          economiesNeeded: needed,
          economiesSpun: spunCount,
        });
        if (state.autoSpinActive) scheduleAutoSpin(get);
        return;
      }

      // Done with economies; move on.
      set({
        results: cleanResults as ResultsByWheel,
        isSpinning: false,
        pendingSpin: null,
        economiesNeeded: needed,
        economiesSpun: spunCount,
        currentWheelIndex: state.currentWheelIndex + 1,
      });
    } else {
      cleanResults[wheelId] = pendingResult;
      const nextIndex = state.currentWheelIndex + 1;
      const isLast = nextIndex >= WHEELS.length;
      set({
        results: cleanResults as ResultsByWheel,
        isSpinning: false,
        pendingSpin: null,
        currentWheelIndex: nextIndex,
      });

      if (isLast && isComplete(cleanResults as ResultsByWheel)) {
        finalizeCountry(set, cleanResults as ResultsByWheel, state.history);
        return;
      }
    }

    if (get().autoSpinActive && get().currentWheelIndex < WHEELS.length) {
      scheduleAutoSpin(get);
    }
  },

  reset: () => {
    clearAutoSpinTimer();
    set({
      currentWheelIndex: 0,
      results: {},
      isSpinning: false,
      economiesNeeded: 1,
      economiesSpun: 0,
      autoSpinActive: false,
      pendingSpin: null,
      country: null,
      power: null,
      narrative: null,
      aiPrompt: null,
      mapModel: null,
      revealedResources: new Set<string>(),
    });
  },

  toggleAutoSpin: () => {
    const state = get();
    const next = !state.autoSpinActive;
    set({ autoSpinActive: next });
    if (next && !state.isSpinning && state.currentWheelIndex < WHEELS.length) {
      // Trigger immediately.
      get().startSpin();
    } else if (!next) {
      clearAutoSpinTimer();
    }
  },

  setSpeed: (preset) => set({ speedPreset: preset }),

  revealResource: (id) => {
    const state = get();
    if (state.revealedResources.has(id)) return;
    const next = new Set(state.revealedResources);
    next.add(id);
    set({ revealedResources: next });
  },

  loadFromHistory: (country) => {
    clearAutoSpinTimer();
    const power = scoreCountry(country);
    const narrative = generateNarrative(country, power);
    const aiPrompt = generateAiPrompt(country);
    const mapModel = generateMap(country);
    // Rebuild a synthetic ResultsByWheel so the UI can render the result list.
    const results = countryToResults(country);
    set({
      country,
      power,
      narrative,
      aiPrompt,
      mapModel,
      revealedResources: new Set<string>(),
      results,
      currentWheelIndex: WHEELS.length,
      isSpinning: false,
      pendingSpin: null,
      autoSpinActive: false,
    });
  },

  clearHistory: () => {
    saveHistory([]);
    set({ history: [] });
  },
}));

function scheduleAutoSpin(get: () => CountryState): void {
  clearAutoSpinTimer();
  autoSpinTimer = setTimeout(() => {
    if (get().autoSpinActive && !get().isSpinning) {
      get().startSpin();
    }
  }, AUTOSPIN_DELAY_MS);
}

function finalizeCountry(
  set: (partial: Partial<CountryState>) => void,
  results: ResultsByWheel,
  history: readonly Country[],
): void {
  const country = buildCountry(results);
  const power = scoreCountry(country);
  const narrative = generateNarrative(country, power);
  const aiPrompt = generateAiPrompt(country);
  const mapModel = generateMap(country);
  const newHistory = [country, ...history.filter((c) => c.seed !== country.seed)].slice(
    0,
    HISTORY_MAX,
  );
  saveHistory(newHistory);
  set({
    country,
    power,
    narrative,
    aiPrompt,
    mapModel,
    revealedResources: new Set<string>(),
    history: newHistory,
    autoSpinActive: false,
  });
  clearAutoSpinTimer();
}

function countryToResults(country: Country): ResultsByWheel {
  function r(wheelId: number, value: SegmentValue | SegmentValue[]): SpinResult {
    const wheel = getWheelById(wheelId);
    const seg = Array.isArray(value) ? value[0] : value;
    return {
      wheelId,
      label: wheel.label,
      value,
      chosenIndex: Math.max(
        0,
        wheel.segments.findIndex((s) => s === seg),
      ),
    };
  }
  return {
    1: r(1, country.biome),
    2: r(2, country.areaKm2),
    3: r(3, country.regime),
    4: r(4, country.economies.length === 1 ? country.economies[0]! : [...country.economies]),
    5: r(5, country.population),
    6: r(6, country.hdi.toFixed(2)),
    7: r(7, country.ideology),
    8: r(8, country.system),
    9: r(9, country.animal),
    10: r(10, country.geopolitics),
    11: r(11, country.leader.intelligence),
    12: r(12, country.leader.charisma),
    13: r(13, country.leader.background),
    14: r(14, country.leader.style),
    15: r(15, country.leader.age),
    16: r(16, country.leader.health),
    17: r(17, country.leader.economicSkill),
    18: r(18, country.leader.militarySkill),
    19: r(19, country.leader.legitimacy),
    20: r(20, country.leader.weakness),
  };
}
