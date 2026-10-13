"use client";

/**
 * Deco gallery layout — dark navy background with gold geometric heading,
 * delegating to shared gallery components.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

const layoutMap = { masonry: MasonryGrid, albums: AlbumView, timeline: TimelineGallery };

export default function DecoGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const LayoutComponent = layoutMap[layout];

  return (
    <div className="min-h-screen px-6 py-20" style={{ backgroundColor: theme.colors.secondary }}>
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-6">
            <div className="h-px w-16" style={{ backgroundColor: theme.colors.primary, opacity: 0.5 }} />
            <div className="h-3 w-3 rotate-45" style={{ backgroundColor: theme.colors.primary }} />
            <div className="h-px w-16" style={{ backgroundColor: theme.colors.primary, opacity: 0.5 }} />
          </div>
          <h2
            className="text-4xl font-light uppercase tracking-[0.3em]"
            style={{ fontFamily: `'${theme.fonts.display}', sans-serif`, color: theme.colors.primary }}
          >
            Gallery
          </h2>
        </div>
        <LayoutComponent photos={photos} theme={theme} weddingId={wedding.id} />
      </motion.div>
    </div>
  );
}
