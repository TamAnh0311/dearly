"use client";

/**
 * Glass gallery layout — indigo gradient background with frosted glass
 * heading panel, delegating to shared gallery components.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

const layoutMap = { masonry: MasonryGrid, albums: AlbumView, timeline: TimelineGallery };

export default function GlassGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const LayoutComponent = layoutMap[layout];

  return (
    <div
      className="min-h-screen px-6 py-20"
      style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)` }}
    >
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="mb-12 text-center">
          <h2
            className="text-3xl font-bold text-white"
            style={{ fontFamily: `'${theme.fonts.display}', sans-serif` }}
          >
            Gallery
          </h2>
          <div className="mx-auto mt-3 h-px w-24 bg-white/30" />
        </div>
        <LayoutComponent photos={photos} theme={theme} weddingId={wedding.id} />
      </motion.div>
    </div>
  );
}
