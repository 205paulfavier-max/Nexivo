import { useCountryStore } from '@/store/countryStore';
import { WHEELS } from '@/data/wheels';
import { Wheel } from './Wheel/Wheel';
import { ControlBar } from './Controls/ControlBar';
import { ResultPanel } from './ResultPanel/ResultPanel';
import { ProfilePanel } from './ResultPanel/ProfilePanel';
import { PowerScore } from './Scoring/PowerScore';
import { SubScores } from './Scoring/SubScores';
import { CountrySummary } from './Scoring/CountrySummary';
import { CountryMap } from './Map/CountryMap';
import { AIPromptPanel } from './AIPrompt/AIPromptPanel';
import { HistoryPanel } from './History/HistoryPanel';

export function CountrySpinner(): JSX.Element {
  const currentWheelIndex = useCountryStore((s) => s.currentWheelIndex);
  const country = useCountryStore((s) => s.country);
  const wheel = WHEELS[Math.min(currentWheelIndex, WHEELS.length - 1)];
  const wheelLabel = country ? 'Pays généré' : `Roue ${currentWheelIndex + 1} / 20`;

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-8 max-w-[1400px] mx-auto relative z-10">
      <header className="text-center mb-6 pb-4 border-b border-border">
        <h1 className="font-display text-4xl md:text-6xl tracking-wider leading-none title-gradient">
          Country Spinner
        </h1>
        <p className="font-accent italic text-lg md:text-xl text-text-dim mt-1">
          Le générateur procédural de pays fictifs
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <main className="space-y-5">
          {!country && wheel && (
            <>
              <p className="font-mono text-sm text-text-dim text-center uppercase tracking-widest">
                {wheelLabel} · {wheel.label}
              </p>
              <Wheel wheel={wheel} />
            </>
          )}
          <ResultPanel />
          <ControlBar />
          {country && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5">
                <PowerScore />
                <SubScores />
              </div>
              <CountrySummary />
              <CountryMap />
              <AIPromptPanel />
            </>
          )}
        </main>
        <aside className="space-y-5">
          <ProfilePanel />
          <HistoryPanel />
        </aside>
      </div>

      <footer className="mt-10 pt-6 border-t border-border text-center font-mono text-xs text-text-dim">
        v1.0 · 20 roues · scoring conditionnel · carte procédurale · prompt IA
      </footer>
    </div>
  );
}
