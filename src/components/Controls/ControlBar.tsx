import type { SpeedPreset } from '@/types';
import { useCountryStore } from '@/store/countryStore';
import { WHEELS } from '@/data/wheels';

const SPEEDS: ReadonlyArray<{ preset: SpeedPreset; label: string }> = [
  { preset: 'short', label: 'Quick' },
  { preset: 'medium', label: 'Normal' },
  { preset: 'long', label: 'Dramatic' },
  { preset: 'epic', label: 'Epic' },
];

/**
 * Primary action bar: spin / auto-spin / reset, plus the speed selector.
 * Disabled buttons reflect the current store state so the UI stays consistent.
 */
export function ControlBar(): JSX.Element {
  const isSpinning = useCountryStore((s) => s.isSpinning);
  const currentWheelIndex = useCountryStore((s) => s.currentWheelIndex);
  const autoSpinActive = useCountryStore((s) => s.autoSpinActive);
  const speedPreset = useCountryStore((s) => s.speedPreset);
  const startSpin = useCountryStore((s) => s.startSpin);
  const toggleAutoSpin = useCountryStore((s) => s.toggleAutoSpin);
  const reset = useCountryStore((s) => s.reset);
  const setSpeed = useCountryStore((s) => s.setSpeed);

  const allDone = currentWheelIndex >= WHEELS.length;

  return (
    <div className="panel space-y-4">
      <span className="corner-bl" />
      <span className="corner-br" />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => startSpin()}
          disabled={isSpinning || allDone}
          className="px-6 py-3 font-display tracking-widest text-bg bg-yellow border-2 border-bg shadow-[3px_3px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ▶ SPIN
        </button>
        <button
          type="button"
          onClick={() => toggleAutoSpin()}
          disabled={allDone}
          aria-pressed={autoSpinActive}
          className={`px-5 py-3 font-display tracking-widest border-2 border-bg shadow-[3px_3px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform ${
            autoSpinActive ? 'bg-pink text-bg' : 'bg-cyan text-bg'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {autoSpinActive ? '⏸ STOP AUTO' : '⚡ AUTO'}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="px-5 py-3 font-display tracking-widest text-white bg-bg-elevated border-2 border-border hover:bg-red hover:text-white hover:border-red transition-colors"
        >
          ↺ RESET
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
        <span className="text-text-dim mr-2">Vitesse:</span>
        {SPEEDS.map(({ preset, label }) => (
          <button
            key={preset}
            type="button"
            onClick={() => setSpeed(preset)}
            aria-pressed={speedPreset === preset}
            className={`px-3 py-1.5 border-2 border-border tracking-wider uppercase transition-colors ${
              speedPreset === preset
                ? 'bg-yellow text-bg border-yellow'
                : 'bg-transparent text-text-dim hover:text-white hover:border-white/40'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
