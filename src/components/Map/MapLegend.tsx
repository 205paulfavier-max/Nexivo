import { useCountryStore } from '@/store/countryStore';
import { getResourceById } from '@/data/resources';

export function MapLegend(): JSX.Element | null {
  const map = useCountryStore((s) => s.mapModel);
  const revealed = useCountryStore((s) => s.revealedResources);
  if (!map) return null;
  const uniqueBiomes = Array.from(new Set(map.zones.map((z) => z.biome)));

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="flex flex-wrap gap-3">
        {uniqueBiomes.map((biome) => {
          const fill = map.zones.find((z) => z.biome === biome)?.fill ?? '#888';
          return (
            <div key={biome} className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-4 border border-border"
                style={{ background: fill }}
              />
              <span className="text-text-dim">{biome}</span>
            </div>
          );
        })}
      </div>
      {revealed.size > 0 && (
        <ul className="space-y-1.5">
          {Array.from(revealed).map((id) => {
            const r = getResourceById(id);
            return (
              <li
                key={id}
                className={`flex items-start gap-2 border-l-4 pl-2 py-1 ${
                  r.kind === 'malus' ? 'border-red bg-red/10' : 'border-yellow bg-yellow/10'
                }`}
              >
                <span className="text-lg leading-none">{r.icon}</span>
                <div>
                  <div className="font-bold text-white">{r.label}</div>
                  <div className="text-text-dim text-[0.7rem]">{r.description}</div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
