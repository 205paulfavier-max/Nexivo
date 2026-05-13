import { useCountryStore } from '@/store/countryStore';
import { WHEELS } from '@/data/wheels';
import { Wheel } from './Wheel/Wheel';
import { ControlBar } from './Controls/ControlBar';
import { ResultPanel } from './ResultPanel/ResultPanel';
import { ProfilePanel } from './ResultPanel/ProfilePanel';
import { PowerScore } from './Scoring/PowerScore';
import { SubScores } from './Scoring/SubScores';
import { CountrySummary } from './Scoring/CountrySummary';
import { EconomicPanel } from './Scoring/EconomicPanel';
import { CountryMap } from './Map/CountryMap';
import { AIPromptPanel } from './AIPrompt/AIPromptPanel';
import { HistoryPanel } from './History/HistoryPanel';

/**
 * 9:16 vertical layout, optimised for TikTok-format screen recording.
 * Single column, max width ~ 460px (= 9:16 framing on a 1080px-wide phone).
 */
export function CountrySpinner(): JSX.Element {
  const currentWheelIndex = useCountryStore((s) => s.currentWheelIndex);
  const country = useCountryStore((s) => s.country);
  const wheel = WHEELS[Math.min(currentWheelIndex, WHEELS.length - 1)];

  return (
    <div className="min-h-screen flex justify-center relative z-10">
      <div className="w-full max-w-[460px] px-3 py-4 space-y-4">
        <header className="text-center pb-3 border-b border-border">
          <h1 className="font-display text-4xl tracking-wider leading-none title-gradient">
            Country Spinner
          </h1>
          <p className="font-accent italic text-sm text-text-dim mt-1">
            Le générateur procédural de pays fictifs
          </p>
        </header>

        {!country && wheel && (
          <>
            <p className="font-mono text-xs text-text-dim text-center uppercase tracking-widest">
              Roue {currentWheelIndex + 1} / 20 · {wheel.label}
            </p>
            <Wheel wheel={wheel} />
          </>
        )}

        <ResultPanel />
        <ControlBar />

        {country && (
          <>
            <PowerScore />
            <SubScores />
            <EconomicPanel />
            <CountrySummary />
            <CountryMap />
            <AIPromptPanel />
          </>
        )}

        <ProfilePanel />
        <HistoryPanel />

        <footer className="pt-4 border-t border-border text-center font-mono text-[0.65rem] text-text-dim">
          v1.0 · 20 roues · scoring conditionnel · carte procédurale · prompt IA
        </footer>
      </div>
    </div>
  );
}
