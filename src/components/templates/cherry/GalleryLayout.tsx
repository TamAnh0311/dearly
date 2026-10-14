"use client";

/**
 * Cherry gallery layout — delegates to shared gallery components
 * with sakura-pink accents and delicate blossom frame styling.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

/** Single cherry blossom SVG used as section accent. */
function BlossomAccent({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 28, height: 28 }}
    >
      <ellipse cx="20" cy="12" rx="4" ry="8" fill={color} opacity={0.5} transform="rotate(0 20 20)" />
      <ellipse cx="20" cy="12" rx="4" ry="8" fill={color} opacity={0.5} transform="rotate(72 20 20)" />
      <ellipse cx="20" cy="12" rx="4" ry="8" fill={color} opacity={0.5} transform="rotate(144 20 20)" />
      <ellipse cx="20" cy="12" rx="4" ry="8" fill={color} opacity={0.5} transform="rotate(216 20 20)" />
      <ellipse cx="20" cy="12" rx="4" ry="8" fill={color} opacity={0.5} transform="rotate(288 20 20)" />
      <circle cx="20" cy="20" r="3" fill="#F7E1C6" />
    </svg>
  );
}

export default function CherryGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const layoutComponents = {
    masonry: MasonryGrid,
    albums: AlbumView,
    timeline: TimelineGallery,
  };

  const LayoutComponent = layoutComponents[layout];

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
        <div className="mb-12 flex items-center justify-center gap-3">
          <BlossomAccent color={theme.colors.primary} />
          <h2
            className="text-center text-3xl"
            style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.accent }}
          >
            Our Gallery
          </h2>
          <BlossomAccent color={theme.colors.primary} />
        </div>
        <LayoutComponent photos={photos} theme={theme} weddingId={wedding.id} />
      </motion.div>
    </div>
  );
}
