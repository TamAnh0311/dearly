"use client";

/**
 * Garden gallery layout — soft garden-green background with serif heading,
 * delegating to shared gallery components.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

const layoutMap = { masonry: MasonryGrid, albums: AlbumView, timeline: TimelineGallery };

export default function GardenGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const LayoutComponent = layoutMap[layout];

  return (
    <div className="min-h-screen px-6 py-20" style={{ backgroundColor: theme.colors.secondary }}>
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="h-px w-12" style={{ backgroundColor: theme.colors.primary, opacity: 0.4 }} />
            <span>🌿</span>
            <div className="h-px w-12" style={{ backgroundColor: theme.colors.primary, opacity: 0.4 }} />
          </div>
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
