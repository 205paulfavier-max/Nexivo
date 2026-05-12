import { describe, expect, it, beforeEach, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCountryStore } from '@/store/countryStore';
import { AIPromptPanel } from '@/components/AIPrompt/AIPromptPanel';
import { WHEELS } from '@/data/wheels';

beforeEach(() => {
  localStorage.clear();
  useCountryStore.getState().reset();
  Object.defineProperty(globalThis.navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
    writable: true,
  });
});

function rollFullCountry(): void {
  while (useCountryStore.getState().currentWheelIndex < WHEELS.length) {
    useCountryStore.getState().startSpin();
    useCountryStore.getState().commitSpin();
  }
}

describe('<AIPromptPanel>', () => {
  it('renders nothing before a country is generated', () => {
    const { container } = render(<AIPromptPanel />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the prompt once the country is complete', () => {
    render(<AIPromptPanel />);
    act(rollFullCountry);
    expect(screen.getByText(/Prompt IA/i)).toBeInTheDocument();
    expect(screen.getByText(/--ar 16:9/i)).toBeInTheDocument();
  });

  it('exposes a copy button that toggles into a "copié" state', async () => {
    render(<AIPromptPanel />);
    act(rollFullCountry);
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: /copier/i });
    await user.click(button);
    // Either the clipboard mock was used OR the textarea fallback ran — both
    // are valid copy paths. The user-visible result is the feedback flash.
    expect(screen.getByRole('button', { name: /copié/i })).toBeInTheDocument();
  });

  it('flashes a "copié" confirmation', async () => {
    render(<AIPromptPanel />);
    act(rollFullCountry);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /copier/i }));
    expect(screen.getByRole('button', { name: /copié/i })).toBeInTheDocument();
  });
});
