import { describe, expect, it, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { useCountryStore } from '@/store/countryStore';
import { ResultPanel } from '@/components/ResultPanel/ResultPanel';
import { WHEELS } from '@/data/wheels';

beforeEach(() => {
  localStorage.clear();
  useCountryStore.getState().reset();
});

describe('<ResultPanel>', () => {
  it('shows the standby state before any spin', () => {
    render(<ResultPanel />);
    expect(screen.getByText('EN ATTENTE')).toBeInTheDocument();
  });

  it('keeps the panel exactly 160px tall', () => {
    render(<ResultPanel />);
    const wrapper = screen.getByText('EN ATTENTE').closest('div');
    expect(wrapper).toHaveStyle({ height: '160px' });
  });

  it('shows the rolling label while spinning', () => {
    render(<ResultPanel />);
    act(() => {
      useCountryStore.getState().startSpin();
    });
    expect(screen.getByText('… ROULE …')).toBeInTheDocument();
  });

  it('shows the last committed result after a spin', () => {
    render(<ResultPanel />);
    act(() => {
      useCountryStore.getState().startSpin();
      useCountryStore.getState().commitSpin();
    });
    expect(screen.getByText(WHEELS[0]!.label)).toBeInTheDocument();
  });
});
