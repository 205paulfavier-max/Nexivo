import { motion } from 'framer-motion';
import { useCountryStore } from '@/store/countryStore';
import { computeGdpPerCapita } from '@/data/economies';
import { formatNumber } from '@/utils/format';

interface MetricProps {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  readonly accent?: string;
  readonly delay?: number;
}

function Metric({
  label,
  value,
  hint,
  accent = 'text-yellow',
  delay = 0,
}: MetricProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="flex flex-col items-center text-center p-2 bg-bg/40 border border-border"
    >
      <span className="font-mono text-[0.6rem] uppercase tracking-widest text-text-dim">
        {label}
      </span>
      <span className={`font-display text-2xl leading-none mt-1 ${accent}`}>{value}</span>
      {hint && <span className="font-mono text-[0.6rem] text-text-dim mt-1">{hint}</span>}
    </motion.div>
  );
}

function formatGdpShort(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)} T$`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} Md$`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} M$`;
  return `${formatNumber(n)} $`;
}

/**
 * Key economic indicators: GDP total, GDP per capita, HDI, population density.
 * Visible only once the country is generated.
 */
export function EconomicPanel(): JSX.Element | null {
  const country = useCountryStore((s) => s.country);
  if (!country) return null;

  const gdpPerCapita = computeGdpPerCapita(country.hdi, country.economies) ?? 0;
  const totalGdp = gdpPerCapita * country.population;
  const density = country.areaKm2 > 0 ? country.population / country.areaKm2 : 0;

  let hdiLabel: string;
  if (country.hdi >= 0.9) hdiLabel = 'Très élevé';
  else if (country.hdi >= 0.7) hdiLabel = 'Élevé';
  else if (country.hdi >= 0.55) hdiLabel = 'Moyen';
  else if (country.hdi >= 0.4) hdiLabel = 'Faible';
  else hdiLabel = 'Très faible';

  return (
    <section className="panel space-y-3">
      <span className="corner-bl" />
      <span className="corner-br" />
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-text-dim">
        Indicateurs économiques
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Metric label="PIB total" value={formatGdpShort(totalGdp)} accent="text-yellow" delay={0} />
        <Metric
          label="PIB / habitant"
          value={`${formatNumber(gdpPerCapita)} $`}
          accent="text-cyan"
          delay={0.05}
        />
        <Metric
          label="HDI"
          value={country.hdi.toFixed(2)}
          hint={hdiLabel}
          accent="text-green-bright"
          delay={0.1}
        />
        <Metric
          label="Densité"
          value={`${formatNumber(Math.round(density))} hab/km²`}
          accent="text-pink"
          delay={0.15}
        />
        <Metric
          label="Territoire"
          value={`${formatNumber(country.areaKm2)} km²`}
          accent="text-orange"
          delay={0.2}
        />
        <Metric
          label="Population"
          value={formatNumber(country.population)}
          accent="text-purple"
          delay={0.25}
        />
      </div>
      <div className="pt-2 border-t border-border space-y-1.5 font-mono text-xs">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-text-dim uppercase tracking-widest text-[0.6rem]">Économies</span>
          <span className="text-white text-right break-words">{country.economies.join(' · ')}</span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-text-dim uppercase tracking-widest text-[0.6rem]">Position</span>
          <span className="text-white text-right">{country.geopolitics}</span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-text-dim uppercase tracking-widest text-[0.6rem]">Régime</span>
          <span className="text-white text-right">{country.regime}</span>
        </div>
      </div>
    </section>
  );
}
