"use client";

/**
 * Nordic gallery layout — delegates to shared gallery components
 * with clean Scandinavian styling, geometric accents, and crisp borders.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

/** Geometric diamond divider in Nordic style. */
function GeometricDivider({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 300 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-10"
      style={{ width: 200, height: 16 }}
    >
      <line x1="0" y1="10" x2="120" y2="10" stroke={color} strokeWidth="0.5" opacity={0.3} />
      <polygon points="150,2 158,10 150,18 142,10" fill="none" stroke={color} strokeWidth="1" />
      <polygon points="150,5 155,10 150,15 145,10" fill={color} opacity={0.15} />
      <line x1="180" y1="10" x2="300" y2="10" stroke={color} strokeWidth="0.5" opacity={0.3} />
    </svg>
  );
}

export default function NordicGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const layoutComponents = {
    masonry: MasonryGrid,
    albums: AlbumView,
    timeline: TimelineGallery,
  };

  const LayoutComponent = layoutComponents[layout];

  return (
    <div
      className="min-h-screen px-6 py-20"
      style={{ backgroundColor: theme.colors.secondary }}
    >
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2
          className="mb-4 text-center text-3xl font-medium tracking-wide"
          style={{ fontFamily: `'${theme.fonts.display}', sans-serif`, color: theme.colors.primary }}
        >
          Our Gallery
        </h2>
        <GeometricDivider color={theme.colors.accent} />
        <LayoutComponent photos={photos} theme={theme} weddingId={wedding.id} />
      </motion.div>
    </div>
  );
}
