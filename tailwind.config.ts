/**
 * Tailwind CSS configuration.
 * Extends the default theme with the Dearly wedding design system —
 * custom colors, fonts, and shadows for an elegant wedding aesthetic.
 */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        dearly: {
          cream: "rgb(var(--dearly-cream) / <alpha-value>)",
          card: "rgb(var(--dearly-card) / <alpha-value>)",
          text: "rgb(var(--dearly-text) / <alpha-value>)",
          "text-secondary": "rgb(var(--dearly-text-secondary) / <alpha-value>)",
          "text-muted": "rgb(var(--dearly-text-muted) / <alpha-value>)",
          accent: "rgb(var(--dearly-accent) / <alpha-value>)",
          "accent-soft": "rgb(var(--dearly-accent-soft) / <alpha-value>)",
          gold: "rgb(var(--dearly-gold) / <alpha-value>)",
          "gold-soft": "rgb(var(--dearly-gold-soft) / <alpha-value>)",
          rose: "rgb(var(--dearly-rose) / <alpha-value>)",
          "rose-soft": "rgb(var(--dearly-rose-soft) / <alpha-value>)",
          border: "rgb(var(--dearly-border) / <alpha-value>)",
        },
      },
      borderRadius: {
        "2.5xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(26,23,20,0.04), 0 8px 24px rgba(26,23,20,0.06)",
        "card-hover": "0 4px 12px rgba(26,23,20,0.08), 0 16px 40px rgba(26,23,20,0.10)",
        soft: "0 2px 16px rgba(26,23,20,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
