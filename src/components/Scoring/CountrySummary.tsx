import { useCountryStore } from '@/store/countryStore';

export function CountrySummary(): JSX.Element | null {
  const narrative = useCountryStore((s) => s.narrative);
  const power = useCountryStore((s) => s.power);
  if (!narrative || !power) return null;
  return (
    <article className="panel space-y-3">
      <span className="corner-bl" />
      <span className="corner-br" />
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-text-dim">Dossier du pays</p>
      <p className="font-mono text-sm leading-relaxed text-white">{narrative.country}</p>
      <p className="font-mono text-sm leading-relaxed text-white">{narrative.leader}</p>
      <p className={`font-accent text-xl italic ${power.tier.accentClass}`}>{narrative.verdict}</p>
    </article>
  );
}
