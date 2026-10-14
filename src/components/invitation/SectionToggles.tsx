"use client";

/**
 * SectionToggles — switch list letting couples choose which invitation
 * sections are shown. Used in the dashboard editor and the template preview.
 */

import { BLESSING_STYLES, SECTION_TOGGLES, resolveBlessingStyle, resolveSections, type BlessingStyle, type SectionKey } from "./sections-config";
import type { WeddingCustomization } from "@/types/database";

type Sections = WeddingCustomization["sections"];

interface SectionTogglesProps {
  sections?: Partial<Sections> | null;
  onChange: (sections: Sections) => void;
  /** Visual style: dashboard (light) or preview banner popover (dark). */
  variant?: "light" | "dark";
  /** How blessings appear on page load; the picker shows when both props are given. */
  blessingStyle?: BlessingStyle | null;
  onBlessingStyle?: (style: BlessingStyle) => void;
}

/** Accessible on/off switch. */
function Switch({ on, label, dark }: { on: boolean; label: string; dark: boolean }) {
  return (
    <span
      aria-hidden
      title={label}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        on ? "bg-dearly-accent" : dark ? "bg-white/20" : "bg-dearly-border"
      }`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`} />
    </span>
  );
}

export default function SectionToggles({ sections, onChange, variant = "light", blessingStyle, onBlessingStyle }: SectionTogglesProps) {
  const style = resolveBlessingStyle(blessingStyle);
  const dark = variant === "dark";
  const current = resolveSections(sections);

  /** Flips one section and emits a complete sections object. */
  function toggle(key: SectionKey) {
    onChange({ ...current, [key]: !current[key] });
  }

  return (
    <ul className="space-y-1">
      {SECTION_TOGGLES.map(({ key, label, description }) => (
        <li key={key}>
          <button
            type="button"
            role="switch"
            aria-checked={current[key]}
            onClick={() => toggle(key)}
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition ${dark ? "hover:bg-white/10" : "hover:bg-dearly-accent-soft/60"}`}
          >
            <Switch on={current[key]} label={label} dark={dark} />
            <span className="min-w-0">
              <span className={`block text-sm font-medium ${dark ? "text-white" : "text-dearly-text"}`}>{label}</span>
              <span className={`block truncate text-[11px] ${dark ? "text-white/60" : "text-dearly-text-secondary"}`}>{description}</span>
            </span>
          </button>
          {key === "blessingShower" && current.blessingShower && onBlessingStyle && (
            <div className="mb-1 ml-14 mr-2 grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="Blessing style">
              {BLESSING_STYLES.map((opt) => {
                const active = opt.value === style;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    title={opt.description}
                    onClick={() => onBlessingStyle(opt.value)}
                    className={`rounded-md border px-2 py-1.5 text-[11px] font-semibold transition ${
                      active
                        ? "border-dearly-accent bg-dearly-accent text-white"
                        : dark
                          ? "border-white/20 text-white/80 hover:bg-white/10"
                          : "border-dearly-border text-dearly-text-secondary hover:border-dearly-accent/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
