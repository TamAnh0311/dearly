"use client";

/**
 * HelpTip — small contextual help popover for dashboard fields.
 * Opens on click so it works on touch, closes on outside click or Escape, and
 * can link to the matching Help Center guide.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, HelpCircle } from "lucide-react";

export default function HelpTip({
  label,
  guide,
  children,
}: {
  /** Short name used for the accessible button label. */
  label: string;
  /** Optional guide slug under /help. */
  guide?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    /** Closes the popover when the pointer goes outside it. */
    function onPointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    /** Closes the popover on Escape. */
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex align-middle">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Help: ${label}`}
        aria-expanded={open}
        className="rounded-full p-0.5 text-dearly-text-muted transition hover:bg-dearly-accent-soft hover:text-dearly-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-dearly-accent/40"
      >
        <HelpCircle size={13} aria-hidden />
      </button>

      {open && (
        <span
          role="dialog"
          aria-label={`Help: ${label}`}
          className="absolute left-0 top-6 z-40 w-64 rounded-xl border border-dearly-border bg-dearly-card p-3 text-left font-body text-xs font-normal normal-case tracking-normal text-dearly-text shadow-card-hover"
        >
          <span className="block leading-relaxed text-dearly-text-secondary">{children}</span>
          {guide && (
            <Link
              href={`/help/${guide}`}
              className="mt-2 inline-flex items-center gap-1 font-semibold text-dearly-accent hover:underline"
            >
              Read the guide <ArrowUpRight size={12} aria-hidden />
            </Link>
          )}
        </span>
      )}
    </span>
  );
}
