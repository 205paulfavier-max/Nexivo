import { describe, expect, it, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { useCountryStore } from '@/store/countryStore';
import { PowerScore } from '@/components/Scoring/PowerScore';
import { SubScores } from '@/components/Scoring/SubScores';
import { CountrySummary } from '@/components/Scoring/CountrySummary';
import { WHEELS } from '@/data/wheels';

beforeEach(() => {
  localStorage.clear();
  useCountryStore.getState().reset();
});

function rollFullCountry(): void {
  while (useCountryStore.getState().currentWheelIndex < WHEELS.length) {
    useCountryStore.getState().startSpin();
    useCountryStore.getState().commitSpin();
  }
}

describe('<PowerScore>', () => {
  it('renders nothing before a country is generated', () => {
    const { container } = render(<PowerScore />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the score after generation', () => {
    render(<PowerScore />);
    act(rollFullCountry);
    expect(screen.getByText(/POWER SCORE/i)).toBeInTheDocument();
    // Score is rendered as plain text — at least one digit must be present.
    expect(screen.getByText(/^\d+$/)).toBeInTheDocument();
  });
});

describe('<SubScores>', () => {
  it('renders nothing before generation', () => {
    const { container } = render(<SubScores />);
    expect(container.firstChild).toBeNull();
  });

  it('renders Stabilité / Économie / Militaire after generation', () => {
    render(<SubScores />);
    act(rollFullCountry);
    expect(screen.getByText(/Stabilité/i)).toBeInTheDocument();
    expect(screen.getByText(/Économie/i)).toBeInTheDocument();
    expect(screen.getByText(/Militaire/i)).toBeInTheDocument();
  });
});

describe('<CountrySummary>', () => {
  it('renders nothing before generation', () => {
    const { container } = render(<CountrySummary />);
    expect(container.firstChild).toBeNull();
  });

  it('renders narrative sentences and verdict after generation', () => {
    render(<CountrySummary />);
    act(rollFullCountry);
    expect(screen.getByText(/Pays /)).toBeInTheDocument();
    expect(screen.getByText(/Verdict/)).toBeInTheDocument();
  });
});
