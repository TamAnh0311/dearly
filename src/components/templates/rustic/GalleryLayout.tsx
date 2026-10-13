"use client";

/**
 * Rustic gallery layout — earthy parchment background with hand-drawn
 * title ornament, delegating to shared gallery components.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

const layoutMap = { masonry: MasonryGrid, albums: AlbumView, timeline: TimelineGallery };

export default function RusticGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const LayoutComponent = layoutMap[layout];

  return (
    <div className="min-h-screen px-6 py-20" style={{ backgroundColor: theme.colors.secondary }}>
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="mb-12 text-center">
          <div className="mb-3 flex items-center justify-center gap-4">
            <div className="h-px w-12" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
            <span style={{ color: theme.colors.accent }}>✦</span>
            <div className="h-px w-12" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
          </div>
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
