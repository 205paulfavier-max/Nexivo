import { describe, expect, it, beforeEach } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CountrySpinner } from '@/components/CountrySpinner';
import { useCountryStore } from '@/store/countryStore';
import { WHEELS } from '@/data/wheels';

beforeEach(() => {
  localStorage.clear();
  useCountryStore.getState().reset();
});

describe('CountrySpinner integration', () => {
  it('renders the title and the initial wheel', () => {
    render(<CountrySpinner />);
    expect(screen.getByRole('heading', { name: /Country Spinner/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /BIOME/i })).toBeInTheDocument();
  });

  it('shows the full result block once 20 wheels have been spun', async () => {
    render(<CountrySpinner />);
    act(() => {
      while (useCountryStore.getState().currentWheelIndex < WHEELS.length) {
        useCountryStore.getState().startSpin();
        useCountryStore.getState().commitSpin();
      }
    });
    await waitFor(() => {
      expect(screen.getByText(/POWER SCORE/i)).toBeInTheDocument();
      expect(screen.getByText(/Dossier du pays/i)).toBeInTheDocument();
      expect(screen.getByText(/Prompt IA — Midjourney/i)).toBeInTheDocument();
      expect(screen.getByTestId('country-map')).toBeInTheDocument();
    });
  });

  it('allows the user to reset and start over', async () => {
    render(<CountrySpinner />);
    act(() => {
      useCountryStore.getState().startSpin();
      useCountryStore.getState().commitSpin();
    });
    expect(useCountryStore.getState().currentWheelIndex).toBe(1);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /reset/i }));
    expect(useCountryStore.getState().currentWheelIndex).toBe(0);
  });
});
