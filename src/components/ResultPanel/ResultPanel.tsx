import { useCountryStore } from '@/store/countryStore';
import { WHEELS } from '@/data/wheels';
import { formatNumber } from '@/utils/format';

function renderValue(value: unknown): string {
  if (Array.isArray(value)) return (value as string[]).join(' · ');
  if (typeof value === 'number') return formatNumber(value);
  return String(value);
}

/**
 * Result banner — height fixed at 160px regardless of content. Shows the
 * latest wheel result with a vibrant gradient. Falls back to a "stand by"
 * state before any spin happens.
 */
export function ResultPanel(): JSX.Element {
  const currentWheelIndex = useCountryStore((s) => s.currentWheelIndex);
  const isSpinning = useCountryStore((s) => s.isSpinning);
  const results = useCountryStore((s) => s.results);

  // Find the most recent committed result.
  const latest = (() => {
    for (let id = WHEELS.length; id >= 1; id -= 1) {
      const r = results[id];
      if (r) return r;
    }
    return null;
  })();

  const currentWheel = WHEELS[currentWheelIndex];

  return (
    <div
      className="relative w-full overflow-hidden border-4 border-bg bg-gradient-to-br from-yellow via-orange to-pink shadow-[6px_6px_0_#000] flex flex-col items-center justify-center px-4 text-bg"
      style={{ height: '160px' }}
    >
      <span className="font-mono text-[0.7rem] tracking-[0.4em] uppercase font-bold text-bg/70">
        Result
      </span>
      {isSpinning && currentWheel ? (
        <>
          <span className="font-display text-2xl tracking-wide mt-1">{currentWheel.label}</span>
          <span className="font-mono text-sm mt-1 animate-pulse">… ROULE …</span>
        </>
      ) : latest ? (
        <>
          <span className="font-mono text-[0.65rem] tracking-widest opacity-70 mt-1">
            {latest.label}
          </span>
          <span
            className="font-display text-3xl md:text-4xl text-center leading-tight mt-1 line-clamp-2"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {renderValue(latest.value)}
          </span>
        </>
      ) : (
        <>
          <span className="font-display text-3xl mt-1">EN ATTENTE</span>
          <span className="font-mono text-xs opacity-75">Clique sur SPIN pour démarrer</span>
        </>
      )}
    </div>
  );
}
