"use client";

/**
 * Terracotta gallery layout — delegates to the shared gallery components
 * (masonry, albums, timeline) with warm Mediterranean arch framing.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

export default function TerracottaGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const layoutComponents = {
    masonry: MasonryGrid,
    albums: AlbumView,
    timeline: TimelineGallery,
  };

  const LayoutComponent = layoutComponents[layout];

  return (
    <div
      className="relative min-h-screen px-6 py-20"
      style={{
        backgroundColor: theme.colors.secondary,
        backgroundImage: `radial-gradient(circle at 20% 80%, ${theme.colors.primary}08, transparent 50%), radial-gradient(circle at 80% 20%, ${theme.colors.primary}06, transparent 50%)`,
      }}
    >
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Arch-shaped header frame */}
        <div className="mx-auto mb-12 flex flex-col items-center">
          <svg viewBox="0 0 200 60" fill="none" className="mb-4" style={{ width: 160, height: 48 }}>
            <path
              d="M20 58 L20 28 Q20 6 100 6 Q180 6 180 28 L180 58"
              stroke={theme.colors.primary}
              strokeWidth="1.5"
              fill="none"
              opacity={0.5}
            />
          </svg>
          <h2
            className="text-center text-3xl"
            style={{
              fontFamily: `'${theme.fonts.display}', serif`,
              color: theme.colors.accent,
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
