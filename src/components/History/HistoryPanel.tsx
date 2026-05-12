import { useCountryStore } from '@/store/countryStore';
import { useExportPng } from '@/hooks/useExportPng';
import { formatNumber } from '@/utils/format';
import { scoreCountry } from '@/engine';

export function HistoryPanel(): JSX.Element | null {
  const history = useCountryStore((s) => s.history);
  const loadFromHistory = useCountryStore((s) => s.loadFromHistory);
  const clearHistory = useCountryStore((s) => s.clearHistory);
  const country = useCountryStore((s) => s.country);
  const { exporting, exportSvg } = useExportPng();

  if (history.length === 0 && !country) return null;

  const exportCurrent = (): void => {
    if (!country) return;
    const safeName = country.biome.toLowerCase().replace(/\s+/g, '-');
    void exportSvg('[data-testid="country-map"]', `country-spinner-${safeName}-${Date.now()}.png`);
  };

  return (
    <section className="panel space-y-3">
      <span className="corner-bl" />
      <span className="corner-br" />
      <header className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-text-dim">
          Historique ({history.length}/10)
        </p>
        <div className="flex gap-2">
          {country && (
            <button
              type="button"
              onClick={exportCurrent}
              disabled={exporting}
              className="px-3 py-1.5 text-xs font-mono tracking-widest uppercase bg-yellow text-bg border-2 border-bg shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-transform disabled:opacity-50"
            >
              {exporting ? '… export' : '📥 PNG carte'}
            </button>
          )}
          {history.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="px-3 py-1.5 text-xs font-mono tracking-widest uppercase text-text-dim hover:text-red border-2 border-border hover:border-red transition-colors"
            >
              🗑 Vider
            </button>
          )}
        </div>
      </header>
      {history.length === 0 ? (
        <p className="font-mono text-xs text-text-dim italic">Aucun pays sauvegardé pour l'instant.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
          {history.map((c, i) => {
            const power = scoreCountry(c);
            return (
              <li key={c.seed + i}>
                <button
                  type="button"
                  onClick={() => loadFromHistory(c)}
                  className="w-full text-left p-2 border-l-4 border-cyan bg-cyan/10 hover:bg-cyan/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{c.biome}</span>
                    <span className={power.tier.accentClass}>{power.total}</span>
                  </div>
                  <div className="text-text-dim text-[0.65rem] mt-1">
                    {formatNumber(c.areaKm2)} km² · {c.regime}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
