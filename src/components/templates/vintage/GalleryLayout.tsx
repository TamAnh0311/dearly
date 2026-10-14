"use client";

/**
 * Vintage gallery layout — delegates to the shared gallery components
 * (masonry, albums, timeline) with Old Hollywood sepia-toned borders.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

export default function VintageGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const layoutComponents = {
    masonry: MasonryGrid,
    albums: AlbumView,
    timeline: TimelineGallery,
  };

  const LayoutComponent = layoutComponents[layout];

  return (
    <div
      className="relative min-h-screen px-6 py-20"
      style={{ backgroundColor: theme.colors.secondary }}
    >
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Ornate filigree header */}
        <div className="mx-auto mb-12 flex flex-col items-center">
          <svg viewBox="0 0 300 20" fill="none" className="mb-6" style={{ width: 260, height: 18 }}>
            <line x1="0" y1="10" x2="100" y2="10" stroke={theme.colors.accent} strokeWidth="0.5" opacity={0.5} />
            <path
              d="M100 10 Q115 0 130 6 Q140 10 150 6 Q160 2 170 6 Q185 12 200 10"
              stroke={theme.colors.primary}
              strokeWidth="1"
              fill="none"
            />
            <circle cx="150" cy="6" r="2" fill={theme.colors.primary} />
            <line x1="200" y1="10" x2="300" y2="10" stroke={theme.colors.accent} strokeWidth="0.5" opacity={0.5} />
          </svg>
          <h2
            className="text-center text-3xl"
            style={{
              fontFamily: `'${theme.fonts.display}', serif`,
              color: theme.colors.primary,
            }}
          >
            Our Gallery
          </h2>
        </div>

        <LayoutComponent photos={photos} theme={theme} weddingId={wedding.id} />
      </motion.div>
    </div>
  );
}
