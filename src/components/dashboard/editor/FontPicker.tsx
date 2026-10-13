"use client";

/**
 * FontPicker — two select dropdowns for display and body fonts.
 * Shows a live preview line for each selected font using inline Google Fonts.
 */

interface Fonts {
  display?: string;
  body?: string;
}

interface FontPickerProps {
  /** Current font selections. */
  fonts: Fonts;
  /** Called with the full updated fonts object on any change. */
  onChange: (fonts: Fonts) => void;
}

/** Curated Google Font pairings available in the editor. */
const DISPLAY_FONTS = [
  "Cormorant Garamond",
  "Playfair Display",
  "Libre Baskerville",
  "EB Garamond",
  "Cinzel",
  "Bodoni Moda",
  "Josefin Sans",
  "Raleway",
];

const BODY_FONTS = [
  "Lato",
  "Source Sans 3",
  "Inter",
  "Open Sans",
  "Nunito",
  "Karla",
  "Mulish",
  "Jost",
];

/**
 * Builds a Google Fonts URL for embedding a single font.
 */
function googleFontUrl(family: string): string {
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;600&display=swap`;
}

/**
 * Renders display font and body font selects with live previews.
 */
export default function FontPicker({ fonts, onChange }: FontPickerProps) {
  const displayFont = fonts.display ?? DISPLAY_FONTS[0];
  const bodyFont = fonts.body ?? BODY_FONTS[0];

  /**
   * Updates a single font key in the fonts object.
   */
  function handleChange(key: keyof Fonts, value: string) {
    onChange({ ...fonts, [key]: value });
  }

  return (
    <div className="space-y-4">
      {/* Inject both font families via link tags */}
      <link rel="stylesheet" href={googleFontUrl(displayFont)} />
      <link rel="stylesheet" href={googleFontUrl(bodyFont)} />

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-dearly-text">Display Font</label>
        <select
          value={displayFont}
          onChange={(e) => handleChange("display", e.target.value)}
          className="w-full rounded-lg border border-dearly-border bg-dearly-card px-3 py-2 text-sm text-dearly-text focus:outline-none focus:ring-2 focus:ring-dearly-accent"
        >
          {DISPLAY_FONTS.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
        <p
          className="truncate text-base text-dearly-text-secondary"
          style={{ fontFamily: `'${displayFont}', serif` }}
        >
          The most wonderful day
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-dearly-text">Body Font</label>
        <select
          value={bodyFont}
          onChange={(e) => handleChange("body", e.target.value)}
          className="w-full rounded-lg border border-dearly-border bg-dearly-card px-3 py-2 text-sm text-dearly-text focus:outline-none focus:ring-2 focus:ring-dearly-accent"
        >
          {BODY_FONTS.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
        <p
          className="truncate text-sm text-dearly-text-secondary"
          style={{ fontFamily: `'${bodyFont}', sans-serif` }}
        >
          We would love for you to join us
        </p>
      </div>
    </div>
  );
}
