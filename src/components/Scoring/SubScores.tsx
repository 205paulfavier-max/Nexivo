import { motion } from 'framer-motion';
import { useCountryStore } from '@/store/countryStore';

interface RowProps {
  readonly label: string;
  readonly value: number;
  readonly color: string;
  readonly delay: number;
}

function ScoreRow({ label, value, color, delay }: RowProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay }}
      className="space-y-1"
    >
      <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-widest text-text-dim">
        <span>{label}</span>
        <span className="text-white font-display text-xl">{value}</span>
      </div>
      <div className="h-2 bg-bg-elevated border border-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, delay: delay + 0.15 }}
          className="h-full"
          style={{ background: color }}
        />
      </div>
    </motion.div>
  );
}

export function SubScores(): JSX.Element | null {
  const power = useCountryStore((s) => s.power);
  if (!power) return null;
  return (
    <div className="panel space-y-4">
      <span className="corner-bl" />
      <span className="corner-br" />
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-text-dim">Sub-scores</p>
      <ScoreRow label="Stabilité" value={power.stability} color="#00E676" delay={0} />
      <ScoreRow label="Économie" value={power.economy} color="#FFD60A" delay={0.1} />
      <ScoreRow label="Militaire" value={power.military} color="#FF1744" delay={0.2} />
    </div>
  );
}
