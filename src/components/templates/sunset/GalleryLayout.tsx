"use client";

/**
 * Sunset gallery layout — warm cream background with coral heading,
 * delegating to shared gallery components.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

const layoutMap = { masonry: MasonryGrid, albums: AlbumView, timeline: TimelineGallery };

export default function SunsetGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const LayoutComponent = layoutMap[layout];

  return (
    <div className="min-h-screen px-6 py-20" style={{ backgroundColor: theme.colors.secondary }}>
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-1 w-16 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
          <h2
            className="text-3xl"
            style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
          >
            Our Gallery
          </h2>
        </div>
        <LayoutComponent photos={photos} theme={theme} weddingId={wedding.id} />
      </motion.div>
    </div>
  );
}
