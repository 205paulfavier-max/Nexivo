import { useClipboard } from '@/hooks/useClipboard';

interface Props {
  readonly text: string;
}

export function CopyButton({ text }: Props): JSX.Element {
  const { copied, copy } = useClipboard();
  return (
    <button
      type="button"
      onClick={() => void copy(text)}
      aria-live="polite"
      className={`px-4 py-2 font-display tracking-widest border-2 border-bg shadow-[3px_3px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform ${
        copied ? 'bg-green-bright text-bg' : 'bg-cyan text-bg'
      }`}
    >
      {copied ? '✓ COPIÉ' : '📋 COPIER'}
    </button>
  );
}
