"use client";

/**
 * LanguagePicker — an accessible, themed dropdown for the invitation language.
 *
 * Two variants:
 *  - "dark"  sits in the preview banner over the invitation
 *  - "light" sits in the dashboard editor form
 *
 * It replaces the native <select>, which looked out of place and could not be
 * styled consistently across browsers.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Languages } from "lucide-react";
import { INVITATION_LANGUAGES, isInvitationLang, type InvitationLang } from "./i18n";
import { EASE_OUT } from "./utils";

interface LanguagePickerProps {
  value: InvitationLang;
  onChange: (lang: InvitationLang) => void;
  variant?: "dark" | "light";
  /** Hide the language label on very small screens. */
  compact?: boolean;
  className?: string;
}

export default function LanguagePicker({
  value,
  onChange,
  variant = "dark",
  compact = false,
  className = "",
}: LanguagePickerProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const current = INVITATION_LANGUAGES.find((l) => l.code === value) ?? INVITATION_LANGUAGES[0];
  const dark = variant === "dark";

  // Close on outside click / Escape so the menu never traps the page.
  useEffect(() => {
    if (!open) return;
    /** Closes the menu when the pointer lands outside the picker. */
    function onPointerDown(e: MouseEvent) {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    }
    /** Closes the menu on Escape. */
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  /** Selects a language and closes the menu. */
  function choose(lang: InvitationLang) {
    onChange(lang);
    setOpen(false);
  }

  return (
    <div ref={root} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Invitation language: ${current.label}`}
        className={
          dark
            ? "flex items-center gap-2 rounded-lg border border-white/25 px-2.5 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10"
            : "flex w-full items-center justify-between gap-2 rounded-lg border border-dearly-border bg-dearly-card px-3 py-2 text-sm text-dearly-text transition hover:border-dearly-accent/50"
        }
      >
        <span className="flex min-w-0 items-center gap-2">
          <Languages size={14} className={dark ? "text-white/70" : "text-dearly-text-secondary"} aria-hidden />
          <span className={`truncate ${compact ? "hidden sm:inline" : ""}`}>{current.nativeLabel}</span>
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} ${dark ? "text-white/60" : "text-dearly-text-secondary"}`}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Invitation language"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            className={
              dark
                ? "absolute right-0 top-11 z-50 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#1d1a17] p-1.5 shadow-2xl"
                : "absolute right-0 top-full z-50 mt-1.5 w-full min-w-[12rem] overflow-hidden rounded-lg border border-dearly-border bg-dearly-card p-1.5 shadow-xl"
            }
          >
            {INVITATION_LANGUAGES.map((lang) => {
              const active = lang.code === value;
              return (
                <li key={lang.code} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => choose(isInvitationLang(lang.code) ? lang.code : "en")}
                    className={
                      dark
                        ? `flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs transition ${
                            active ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 hover:text-white"
                          }`
                        : `flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                            active ? "bg-dearly-accent/10 text-dearly-accent" : "text-dearly-text hover:bg-dearly-cream"
                          }`
                    }
                  >
                    <span className="flex flex-col">
                      <span className="font-semibold">{lang.nativeLabel}</span>
                      {lang.nativeLabel !== lang.label && (
                        <span className={dark ? "text-[10px] text-white/50" : "text-[11px] text-dearly-text-secondary"}>
                          {lang.label}
                        </span>
                      )}
                    </span>
                    {active && <Check size={14} aria-hidden />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
