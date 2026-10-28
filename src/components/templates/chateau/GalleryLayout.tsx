"use client";

/**
 * Chateau gallery layout — French estate aesthetic with golden ornate
 * dividers, Playfair Display headings, and a small SVG flourish.
 */

import { motion } from "framer-motion";
import type { GalleryLayoutProps } from "../types";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import AlbumView from "@/components/gallery/AlbumView";
import TimelineGallery from "@/components/gallery/TimelineGallery";

const layoutMap = { masonry: MasonryGrid, albums: AlbumView, timeline: TimelineGallery };

/** Small ornate SVG flourish replacing the Bloom ✿ symbol. */
function GoldFlourish({ color }: { color: string }) {
  return (
    <svg width="28" height="18" viewBox="0 0 28 18" fill="none" aria-hidden>
      <path
        d="M4 9 C8 3, 12 3, 14 9 S20 15, 24 9"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="14" cy="9" rx="3" ry="5" stroke={color} strokeWidth="1" fill="none" transform="rotate(-12 14 9)" />
      <ellipse cx="14" cy="9" rx="3" ry="5" stroke={color} strokeWidth="1" fill="none" transform="rotate(12 14 9)" />
      <circle cx="14" cy="9" r="1.5" fill={color} />
    </svg>
  );
}

export default function ChateauGalleryLayout({ wedding, photos, layout, theme }: GalleryLayoutProps) {
  const LayoutComponent = layoutMap[layout];
  const gold = theme.colors.primary;

  return (
    <div className="min-h-screen px-6 py-20" style={{ backgroundColor: theme.colors.secondary }}>
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-12 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <div className="h-px w-16" style={{ backgroundColor: gold, opacity: 0.5 }} />
            <GoldFlourish color={gold} />
            <div className="h-px w-16" style={{ backgroundColor: gold, opacity: 0.5 }} />
          </div>
          <h2
            className="text-3xl font-light"
            style={{ fontFamily: "'Playfair Display', serif", color: gold }}
          >
            Our Gallery
          </h2>
        </div>
        <LayoutComponent photos={photos} theme={theme} weddingId={wedding.id} />
      </motion.div>
    </div>
  );
}
