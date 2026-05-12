import { useCountryStore } from '@/store/countryStore';
import { CopyButton } from './CopyButton';

export function AIPromptPanel(): JSX.Element | null {
  const prompt = useCountryStore((s) => s.aiPrompt);
  if (!prompt) return null;
  return (
    <section className="panel space-y-3">
      <span className="corner-bl" />
      <span className="corner-br" />
      <header className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-text-dim">Prompt IA — Midjourney</p>
        <CopyButton text={prompt} />
      </header>
      <pre className="font-mono text-xs leading-relaxed text-white whitespace-pre-wrap break-words bg-bg-elevated border border-border p-3 max-h-[280px] overflow-y-auto">
        {prompt}
      </pre>
    </section>
  );
}
