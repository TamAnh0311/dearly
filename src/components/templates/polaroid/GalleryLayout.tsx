"use client";

/**
 * Polaroid gallery layout — cream background with handwritten heading,
 * delegating to shared gallery components.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

const layoutMap = { masonry: MasonryGrid, albums: AlbumView, timeline: TimelineGallery };

export default function PolaroidGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const LayoutComponent = layoutMap[layout];

  return (
    <div className="min-h-screen px-6 py-20" style={{ backgroundColor: theme.colors.secondary }}>
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 14 }}
      >
        <div className="mb-12 text-center">
          <div className="mx-auto mb-2 h-4 w-20 opacity-70" style={{ backgroundColor: theme.colors.accent }} />
          <h2
            className="text-4xl"
            style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
          >
            Our Gallery
          </h2>
        </div>
        <LayoutComponent photos={photos} theme={theme} weddingId={wedding.id} />
      </motion.div>
    </div>
  );
}
