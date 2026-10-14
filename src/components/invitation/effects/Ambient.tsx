"use client";

/**
 * AmbientLayer — renders the template's ambient effects (butterflies, petals,
 * leaves, confetti, snow, gold dust, stars, bokeh) inside a relative parent.
 */

import { BokehLights, Butterflies, FallingPetals, GoldDust, TwinklingStars } from "./Particles";
import { alpha, mix, type InvitationPalette } from "../utils";

/** Draws each ambient effect listed in the palette's style, with density scaled by `intensity`. */
export default function AmbientLayer({ palette, intensity = 1 }: { palette: InvitationPalette; intensity?: number }) {
  const n = (base: number) => Math.max(1, Math.round(base * intensity));
  const leafColors = [palette.leaf, mix(palette.leaf, palette.accent, 0.4), mix(palette.accent, "#c98b4a", 0.3)];
  const confetti = [palette.primary, palette.accent, ...palette.petals];

  return (
    <>
      {palette.style.ambient.map((fx) => {
        switch (fx) {
          case "bokeh":
            return (
              <BokehLights
                key={fx}
                count={n(7)}
                color={alpha(palette.isDark ? palette.primary : "#ffffff", palette.isDark ? 0.5 : 0.9)}
              />
            );
          case "petals":
            return <FallingPetals key={fx} colors={palette.petals} count={n(16)} />;
          case "leaves":
            return <FallingPetals key={fx} colors={leafColors} count={n(12)} shape="leaf" />;
          case "confetti":
            return <FallingPetals key={fx} colors={confetti} count={n(22)} shape="confetti" />;
          case "snow":
            return <FallingPetals key={fx} colors={[palette.accent]} count={n(40)} shape="snow" />;
          case "gold-dust":
            return <GoldDust key={fx} color={palette.primary} count={n(28)} />;
          case "stars":
            return <TwinklingStars key={fx} color={mix(palette.primary, "#ffffff", 0.5)} count={n(80)} />;
          case "butterflies":
            return (
              <Butterflies
                key={fx}
                colors={[palette.petals[0], palette.accent, palette.petals[2]]}
                accent={palette.primary}
                count={intensity < 1 ? 1 : 3}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
