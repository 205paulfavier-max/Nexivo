import { useCountryStore } from '@/store/countryStore';
import { MapLegend } from './MapLegend';
import { HiddenResourceMarker } from './HiddenResource';

export function CountryMap(): JSX.Element | null {
  const map = useCountryStore((s) => s.mapModel);
  const country = useCountryStore((s) => s.country);
  const revealed = useCountryStore((s) => s.revealedResources);
  const reveal = useCountryStore((s) => s.revealResource);
  if (!map || !country) return null;

  return (
    <section className="panel space-y-3">
      <span className="corner-bl" />
      <span className="corner-br" />
      <header className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.3em] text-text-dim">
        <span>Carte procédurale</span>
        <span className="text-yellow">
          {map.resources.length} ressources cachées · {revealed.size} révélée
          {revealed.size > 1 ? 's' : ''}
        </span>
      </header>
      <svg
        viewBox={`0 0 ${map.width} ${map.height}`}
        className="w-full h-auto border-2 border-gold"
        role="img"
        aria-label={`Carte du pays au biome ${country.biome}`}
        data-testid="country-map"
      >
        <defs>
          <pattern id="parchment" patternUnits="userSpaceOnUse" width={20} height={20}>
            <rect width={20} height={20} fill="#2a1810" />
            <circle cx={5} cy={5} r={0.5} fill="rgba(255,200,150,0.05)" />
            <circle cx={15} cy={12} r={0.5} fill="rgba(255,200,150,0.05)" />
          </pattern>
          <clipPath id="country-clip">
            <path d={map.outlinePath} />
          </clipPath>
        </defs>
        <rect width={map.width} height={map.height} fill="url(#parchment)" />
        <path d={map.outlinePath} fill="rgba(0,0,0,0.3)" transform="translate(6 6)" />
        <path d={map.outlinePath} fill="#3a2820" stroke="#000" strokeWidth={2} />
        <g clipPath="url(#country-clip)">
          {map.zones.map((zone, i) => (
            <circle
              key={`${zone.biome}-${i}`}
              cx={zone.x}
              cy={zone.y}
              r={zone.radius}
              fill={zone.fill}
              opacity={0.85}
            />
          ))}
        </g>
        <path d={map.outlinePath} fill="none" stroke="#1a0a08" strokeWidth={3} />
        <path d={map.outlinePath} fill="none" stroke="#FFD60A" strokeWidth={0.5} opacity={0.4} />
        {map.resources.map((res, i) => {
          const cx = res.x * map.width;
          const cy = res.y * map.height;
          const isRevealed = revealed.has(res.resource.id);
          return (
            <HiddenResourceMarker
              key={`${res.resource.id}-${i}`}
              cx={cx}
              cy={cy}
              resource={res.resource}
              revealed={isRevealed}
              onReveal={() => reveal(res.resource.id)}
            />
          );
        })}
        {/* compass rose */}
        <g transform="translate(740 60)">
          <circle r={22} fill="rgba(0,0,0,0.55)" stroke="#FFD60A" />
          <polygon points="0,-18 4,0 0,18 -4,0" fill="#FFD60A" />
          <text x={0} y={-26} textAnchor="middle" fill="#FFD60A" fontFamily="Bebas Neue" fontSize={11}>
            N
          </text>
        </g>
        {/* title */}
        <g transform={`translate(${map.width / 2} 30)`}>
          <rect x={-150} y={-15} width={300} height={30} fill="rgba(0,0,0,0.7)" stroke="#FFD60A" />
          <text
            x={0}
            y={5}
            textAnchor="middle"
            fill="#FFD60A"
            fontFamily="Bebas Neue"
            fontSize={16}
            letterSpacing={2}
          >
            TERRITOIRE {country.biome.toUpperCase()}
          </text>
        </g>
      </svg>
      <MapLegend />
    </section>
  );
}
