import { useCountryStore } from '@/store/countryStore';
import { WHEELS } from '@/data/wheels';
import { formatNumber } from '@/utils/format';

function renderValue(value: unknown): string {
  if (Array.isArray(value)) return (value as string[]).join(' · ');
  if (typeof value === 'number') return formatNumber(value);
  return String(value);
}

/**
 * Vertical list of the 20 wheel results, three states per row:
 * pending (greyed), current (highlighted), filled (with value).
 */
export function ProfilePanel(): JSX.Element {
  const results = useCountryStore((s) => s.results);
  const currentWheelIndex = useCountryStore((s) => s.currentWheelIndex);
  return (
    <ol
      className="panel max-h-[640px] overflow-y-auto space-y-1.5 text-sm"
      aria-label="Profil du pays"
    >
      <span className="corner-bl" />
      <span className="corner-br" />
      {WHEELS.map((w, idx) => {
        const r = results[w.id];
        const isCurrent = idx === currentWheelIndex && !r;
        const filled = Boolean(r);
        return (
          <li
            key={w.id}
            className={[
              'flex items-center gap-3 px-2 py-1.5 border-l-4 font-mono leading-tight',
              filled && 'border-yellow bg-yellow/5',
              isCurrent && 'border-cyan bg-cyan/10 animate-pulse',
              !filled && !isCurrent && 'border-border/60 opacity-50',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="w-6 text-text-dim text-[0.7rem]">{String(w.id).padStart(2, '0')}</span>
            <span className="flex-1 text-[0.75rem] uppercase tracking-wider text-text-dim">
              {w.label}
            </span>
            <span className="text-right text-white font-bold text-[0.85rem] truncate max-w-[160px]">
              {r ? renderValue(r.value) : '—'}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
