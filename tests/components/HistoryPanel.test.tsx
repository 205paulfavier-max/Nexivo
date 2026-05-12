import { describe, expect, it, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCountryStore } from '@/store/countryStore';
import { HistoryPanel } from '@/components/History/HistoryPanel';
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

describe('<HistoryPanel>', () => {
  it('renders nothing when history is empty and no country generated', () => {
    const { container } = render(<HistoryPanel />);
    expect(container.firstChild).toBeNull();
  });

  it('appears once a country is generated', () => {
    render(<HistoryPanel />);
    act(rollFullCountry);
    expect(screen.getByText(/Historique/i)).toBeInTheDocument();
  });

  it('shows the PNG export button after generation', () => {
    render(<HistoryPanel />);
    act(rollFullCountry);
    expect(screen.getByRole('button', { name: /PNG/i })).toBeInTheDocument();
  });

  it('clears history when the trash button is clicked', async () => {
    render(<HistoryPanel />);
    act(rollFullCountry);
    expect(useCountryStore.getState().history.length).toBeGreaterThan(0);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /vider/i }));
    expect(useCountryStore.getState().history.length).toBe(0);
  });
});
