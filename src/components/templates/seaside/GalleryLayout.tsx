"use client";

/**
 * Seaside gallery layout — delegates to shared gallery components
 * with coastal styling, wave border accents, and sand-colored backdrop.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

/** Decorative wave divider above the gallery. */
function WaveDivider({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 1200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-8 w-full max-w-3xl"
      style={{ height: 32 }}
      preserveAspectRatio="none"
    >
      <path
        d="M0 30 Q150 0 300 30 T600 30 T900 30 T1200 30 V60 H0 Z"
        fill={color}
        opacity={0.12}
      />
      <path
        d="M0 35 Q150 10 300 35 T600 35 T900 35 T1200 35"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity={0.3}
      />
    </svg>
  );
}

export default function SeasideGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const layoutComponents = {
    masonry: MasonryGrid,
    albums: AlbumView,
    timeline: TimelineGallery,
  };

  const LayoutComponent = layoutComponents[layout];

  return (
    <div
      className="min-h-screen px-6 py-20"
      style={{ backgroundColor: "#F5E6D3" }}
    >
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2
          className="mb-4 text-center text-3xl"
          style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
        >
          Our Gallery
        </h2>
        <WaveDivider color={theme.colors.primary} />
        <LayoutComponent photos={photos} theme={theme} weddingId={wedding.id} />
      </motion.div>
    </div>
  );
}
