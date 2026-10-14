"use client";

/**
 * Celestial gallery layout — delegates to the shared gallery components
 * (masonry, albums, timeline) with a deep starry-night aesthetic.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

export default function CelestialGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const layoutComponents = {
    masonry: MasonryGrid,
    albums: AlbumView,
    timeline: TimelineGallery,
  };

  const LayoutComponent = layoutComponents[layout];

  return (
    <div
      className="relative min-h-screen px-6 py-20 overflow-hidden"
      style={{ backgroundColor: theme.colors.secondary }}
    >
      {/* Background star dust */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              left: `${((i * 17 + 5) % 96) + 2}%`,
              top: `${((i * 23 + 11) % 90) + 5}%`,
              backgroundColor: theme.colors.accent,
            }}
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{
              duration: 2 + (i % 3),
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2
          className="mb-12 text-center text-3xl tracking-wide"
          style={{
            fontFamily: `'${theme.fonts.display}', serif`,
            color: theme.colors.primary,
          }}
        >
          Our Gallery
        </h2>
        <LayoutComponent photos={photos} theme={theme} weddingId={wedding.id} />
      </motion.div>
    </div>
  );
}
