import { describe, expect, it, beforeEach } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import { useCountryStore } from '@/store/countryStore';
import { ProfilePanel } from '@/components/ResultPanel/ProfilePanel';
import { WHEELS } from '@/data/wheels';

beforeEach(() => {
  localStorage.clear();
  useCountryStore.getState().reset();
});

describe('<ProfilePanel>', () => {
  it('renders all 20 wheel labels in order', () => {
    render(<ProfilePanel />);
    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(20);
    WHEELS.forEach((w, i) => {
      expect(items[i]).toHaveTextContent(w.label);
    });
  });

  it('shows em-dash placeholders for not-yet-rolled wheels', () => {
    render(<ProfilePanel />);
    const items = screen.getAllByRole('listitem');
    expect(items[5]).toHaveTextContent('—');
  });

  it('fills in the value for a rolled wheel', () => {
    render(<ProfilePanel />);
    act(() => {
      useCountryStore.getState().startSpin();
      useCountryStore.getState().commitSpin();
    });
    const items = screen.getAllByRole('listitem');
    // First wheel (biome) is now filled.
    expect(items[0]).not.toHaveTextContent('—');
  });
});
