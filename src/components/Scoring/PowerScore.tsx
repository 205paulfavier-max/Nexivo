import { motion } from 'framer-motion';
import { useCountryStore } from '@/store/countryStore';

export function PowerScore(): JSX.Element | null {
  const power = useCountryStore((s) => s.power);
  if (!power) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="panel text-center"
    >
      <span className="corner-bl" />
      <span className="corner-br" />
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-text-dim">Power score</p>
      <div className="font-display text-7xl md:text-8xl leading-none my-2 title-gradient">
        {power.total}
      </div>
      <div className={`font-display text-2xl ${power.tier.accentClass}`}>
        {power.tier.label} {power.tier.emoji}
      </div>
      <p className="font-mono text-xs text-text-dim mt-2">{power.worldRank.label}</p>
    </motion.div>
  );
}
