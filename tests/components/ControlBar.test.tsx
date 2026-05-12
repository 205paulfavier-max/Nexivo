import { describe, expect, it, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCountryStore } from '@/store/countryStore';
import { ControlBar } from '@/components/Controls/ControlBar';

beforeEach(() => {
  localStorage.clear();
  useCountryStore.getState().reset();
});

describe('<ControlBar>', () => {
  it('renders Spin / Auto / Reset and the speed selector', () => {
    render(<ControlBar />);
    expect(screen.getByRole('button', { name: /spin/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /auto/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /normal/i })).toBeInTheDocument();
  });

  it('triggers a spin when clicked', async () => {
    render(<ControlBar />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /^▶ SPIN$/ }));
    expect(useCountryStore.getState().isSpinning).toBe(true);
  });

  it('disables Spin while a spin is in flight', () => {
    render(<ControlBar />);
    act(() => {
      useCountryStore.getState().startSpin();
    });
    expect(screen.getByRole('button', { name: /^▶ SPIN$/ })).toBeDisabled();
  });

  it('updates the speed preset when a speed button is clicked', async () => {
    render(<ControlBar />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /epic/i }));
    expect(useCountryStore.getState().speedPreset).toBe('epic');
  });

  it('reflects auto-spin state via aria-pressed', async () => {
    render(<ControlBar />);
    const user = userEvent.setup();
    const auto = screen.getByRole('button', { name: /auto/i });
    expect(auto).toHaveAttribute('aria-pressed', 'false');
    await user.click(auto);
    expect(useCountryStore.getState().autoSpinActive).toBe(true);
  });

  it('Reset returns to wheel 0', async () => {
    render(<ControlBar />);
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
