"use client";

/**
 * ColorPicker — three colour inputs for primary, secondary, accent.
 * Uses native <input type="color"> with a hex value display beside each.
 */

interface Colors {
  primary?: string;
  secondary?: string;
  accent?: string;
}

interface ColorPickerProps {
  /** Current colour values. */
  colors: Colors;
  /** Called with the full updated colors object on any change. */
  onChange: (colors: Colors) => void;
}

const COLOR_FIELDS: { key: keyof Colors; label: string; fallback: string }[] = [
  { key: "primary", label: "Primary", fallback: "#f5f0e8" },
  { key: "secondary", label: "Secondary", fallback: "#e8ddd0" },
  { key: "accent", label: "Accent", fallback: "#c4956a" },
];

/**
 * Renders three labelled colour pickers — primary, secondary, and accent.
 */
export default function ColorPicker({ colors, onChange }: ColorPickerProps) {
  /**
   * Handles a colour input change for the given field key.
   */
  function handleChange(key: keyof Colors, value: string) {
    onChange({ ...colors, [key]: value });
  }

  return (
    <div className="space-y-3">
      {COLOR_FIELDS.map(({ key, label, fallback }) => {
        const value = colors[key] ?? fallback;
        return (
          <div key={key} className="flex items-center gap-3">
            <input
              type="color"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="h-9 w-9 cursor-pointer rounded border border-dearly-border bg-transparent p-0.5"
              aria-label={`${label} colour`}
            />
            <div className="flex-1">
              <p className="text-xs font-medium text-dearly-text">{label}</p>
              <p className="font-mono text-xs text-dearly-text-secondary">{value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
