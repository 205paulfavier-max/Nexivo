"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-nexivo-black/50 p-4 md:items-center"
      onClick={onClose}
    >
      <div
        className={
          "relative w-full rounded-xl bg-white shadow-pop " +
          (wide ? "max-w-3xl" : "max-w-lg")
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-nexivo-border px-5 py-3">
          <h2 className="text-base font-semibold text-nexivo-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-1.5 text-nexivo-gray hover:bg-nexivo-surface"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-nexivo-border bg-nexivo-surface/60 px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
