"use client";

/**
 * Boho gallery layout — warm cream background with handwritten heading
 * and organic wavy divider, delegating to shared gallery components.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

const layoutMap = { masonry: MasonryGrid, albums: AlbumView, timeline: TimelineGallery };

export default function BohoGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
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
            className="text-4xl"
            style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
          >
            Our Gallery
          </h2>
          <svg viewBox="0 0 160 8" className="mx-auto mt-3" style={{ width: 120, height: 8 }}>
            <path
              d="M0 4 Q20 0 40 4 Q60 8 80 4 Q100 0 120 4 Q140 8 160 4"
              stroke={theme.colors.primary}
              strokeWidth="1"
              fill="none"
              opacity="0.4"
            />
          </svg>
        </div>
        <LayoutComponent photos={photos} theme={theme} weddingId={wedding.id} />
      </motion.div>
    </div>
  );
}
