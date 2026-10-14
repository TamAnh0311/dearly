"use client";

/**
 * Whimsical gallery layout — delegates to the shared gallery components
 * (masonry, albums, timeline) with enchanted fairy-tale styling.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

export default function WhimsicalGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const layoutComponents = {
    masonry: MasonryGrid,
    albums: AlbumView,
    timeline: TimelineGallery,
  };

  const LayoutComponent = layoutComponents[layout];

  return (
    <div
      className="relative min-h-screen px-6 py-20 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${theme.colors.secondary} 0%, ${theme.colors.primary}10 50%, ${theme.colors.secondary} 100%)`,
      }}
    >
      {/* Floating stardust particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              left: `${((i * 19 + 7) % 90) + 5}%`,
              top: `${((i * 29 + 13) % 80) + 10}%`,
              backgroundColor: theme.colors.accent,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 3 + (i % 3),
              delay: i * 0.4,
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
        {/* Swirl decoration above title */}
        <div className="mx-auto mb-4 flex justify-center">
          <svg viewBox="0 0 120 40" fill="none" style={{ width: 100, height: 32 }}>
            <path
              d="M10 30 Q30 5 60 20 Q90 35 110 10"
              stroke={theme.colors.primary}
              strokeWidth="1.2"
              fill="none"
              opacity={0.5}
            />
            <circle cx="60" cy="20" r="2" fill={theme.colors.accent} />
          </svg>
        </div>

        <h2
          className="mb-12 text-center text-3xl"
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
