import { useCallback, useRef, useState } from 'react';

const FEEDBACK_MS = 2000;

/**
 * Copies the given text to the system clipboard and flashes a "copied" state.
 * Falls back to a hidden `<textarea>` when navigator.clipboard isn't available.
 */
export function useClipboard(): {
  copied: boolean;
  copy: (text: string) => Promise<void>;
} {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), FEEDBACK_MS);
    } catch (err) {
      console.warn('clipboard write failed', err);
    }
  }, []);

  return { copied, copy };
}
