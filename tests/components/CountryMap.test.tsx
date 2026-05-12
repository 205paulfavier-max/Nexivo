import { describe, expect, it, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCountryStore } from '@/store/countryStore';
import { CountryMap } from '@/components/Map/CountryMap';
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

describe('<CountryMap>', () => {
  it('renders nothing until a country is generated', () => {
    const { container } = render(<CountryMap />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the SVG country map for a generated country', () => {
    render(<CountryMap />);
    act(rollFullCountry);
    expect(screen.getByTestId('country-map')).toBeInTheDocument();
  });

  it('shows hidden resource markers with role=button and ?', () => {
    render(<CountryMap />);
    act(rollFullCountry);
    const markers = screen.getAllByRole('button', { name: /ressource cachée/i });
    expect(markers.length).toBeGreaterThan(0);
  });

  it('reveals a resource when its marker is clicked', async () => {
    render(<CountryMap />);
    act(rollFullCountry);
    const user = userEvent.setup();
    const before = useCountryStore.getState().revealedResources.size;
    const markers = screen.getAllByRole('button', { name: /ressource cachée/i });
    await user.click(markers[0]!);
    expect(useCountryStore.getState().revealedResources.size).toBeGreaterThan(before);
  });
});
