"use client";

/**
 * Luxe gallery layout — marble-textured background with gold heading
 * and thin gold divider, delegating to shared gallery components.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

const layoutMap = { masonry: MasonryGrid, albums: AlbumView, timeline: TimelineGallery };

export default function LuxeGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const LayoutComponent = layoutMap[layout];

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
        <div className="mb-12 text-center">
          <h2
            className="text-3xl font-light tracking-[0.15em]"
            style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.accent }}
          >
            Our Gallery
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-2" style={{ width: 180 }}>
            <div className="h-px flex-1" style={{ backgroundColor: theme.colors.primary, opacity: 0.4 }} />
            <div
              className="h-2 w-2 rotate-45"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div className="h-px flex-1" style={{ backgroundColor: theme.colors.primary, opacity: 0.4 }} />
          </div>
        </div>
        <LayoutComponent photos={photos} theme={theme} weddingId={wedding.id} />
      </motion.div>
    </div>
  );
}
