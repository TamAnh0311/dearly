"use client";

/**
 * ArtSpray — one transparent botanical cut-out anchored inside a section.
 * Renders nothing for templates that have no art collection, so sections can
 * opt in without branching their whole layout.
 */

import Image from "next/image";
import { getArtCollection, type ArtCollection } from "../art";
import type { InvitationPalette } from "../utils";

type SprayKey = keyof ArtCollection["sprays"];

export default function ArtSpray({
  palette,
  asset,
  className = "",
  rotate = 0,
  opacity = 1,
}: {
  palette: InvitationPalette;
  asset: SprayKey;
  /** Positioning + width classes (the wrapper is absolutely positioned). */
  className?: string;
  rotate?: number;
  opacity?: number;
}) {
  const art = getArtCollection(palette.style.art);
  if (!art) return null;
  const image = art.sprays[asset];
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`} style={{ opacity }}>
      <Image
        src={image.src}
        alt=""
        width={image.width}
        height={image.height}
        sizes="(max-width: 768px) 40vw, 24vw"
        className="h-auto w-full"
        style={{
          transform: `rotate(${rotate}deg)`,
          filter: palette.isDark ? "brightness(0.78) saturate(0.9)" : "saturate(0.98)",
        }}
      />
    </div>
  );
}
