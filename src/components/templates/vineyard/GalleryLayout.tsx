"use client";

/**
 * Vineyard gallery layout — delegates to shared gallery components
 * with wine-country styling, vine leaf accents, and warm cream backdrop.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

/** Decorative vine leaf divider. */
function VineDivider({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 300 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-8"
      style={{ width: 240, height: 24 }}
    >
      <line x1="0" y1="15" x2="100" y2="15" stroke={color} strokeWidth="0.6" opacity={0.4} />
      <path
        d="M130 15 C135 5 140 5 145 10 C148 13 150 15 155 12 C158 10 162 5 168 15"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M140 8 Q145 2 150 8"
        stroke={color}
        strokeWidth="0.8"
        fill={color}
        opacity={0.2}
      />
      <circle cx="150" cy="15" r="2" fill={color} opacity={0.5} />
      <line x1="200" y1="15" x2="300" y2="15" stroke={color} strokeWidth="0.6" opacity={0.4} />
    </svg>
  );
}

export default function VineyardGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
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
          className="mb-4 text-center text-3xl"
          style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
        >
          Our Gallery
        </h2>
        <VineDivider color={theme.colors.primary} />
        <LayoutComponent photos={photos} theme={theme} weddingId={wedding.id} />
      </motion.div>
    </div>
  );
}
