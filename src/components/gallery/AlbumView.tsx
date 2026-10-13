"use client";

/**
 * Album-based gallery — photos organized into albums (pre-wedding, ceremony, reception).
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Lightbox from "./Lightbox";
import type { GalleryPhotoRow } from "@/types/database";
import type { ResolvedTheme } from "@/components/templates/types";

interface AlbumViewProps {
  photos: GalleryPhotoRow[];
  theme: ResolvedTheme;
  weddingId: string;
}

const ALBUM_LABELS: Record<string, string> = {
  "pre-wedding": "Pre-Wedding",
  ceremony: "Ceremony",
  reception: "Reception",
  other: "Other Moments",
};

export default function AlbumView({ photos, theme }: AlbumViewProps) {
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /** Group photos by album. */
  const albums = photos.reduce<Record<string, GalleryPhotoRow[]>>((acc, photo) => {
    const key = photo.album;
    if (!acc[key]) acc[key] = [];
    acc[key].push(photo);
    return acc;
  }, {});

  const albumKeys = Object.keys(albums);
  const displayedPhotos = activeAlbum ? albums[activeAlbum] ?? [] : photos;

  return (
    <>
      {/* Album tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveAlbum(null)}
          className="rounded-full px-4 py-1.5 text-sm font-medium transition"
          style={{
            backgroundColor: activeAlbum === null ? theme.colors.primary : "transparent",
            color: activeAlbum === null ? theme.colors.secondary : theme.colors.accent,
            border: `1px solid ${theme.colors.primary}30`,
          }}
        >
          All
        </button>
        {albumKeys.map((key) => (
          <button
            key={key}
            onClick={() => setActiveAlbum(key)}
            className="rounded-full px-4 py-1.5 text-sm font-medium transition"
            style={{
              backgroundColor: activeAlbum === key ? theme.colors.primary : "transparent",
              color: activeAlbum === key ? theme.colors.secondary : theme.colors.accent,
              border: `1px solid ${theme.colors.primary}30`,
            }}
          >
            {ALBUM_LABELS[key] ?? key} ({albums[key].length})
          </button>
        ))}
      </div>

      {/* Photo grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeAlbum ?? "all"}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {displayedPhotos.map((photo, i) => (
            <motion.div
              key={photo.id}
              className="aspect-square cursor-pointer overflow-hidden rounded-lg"
              whileHover={{ scale: 1.02 }}
              onClick={() => setLightboxIndex(i)}
            >
              <Image
                src={photo.thumbnail_url ?? photo.url}
                alt={photo.caption ?? "Wedding photo"}
                width={300}
                height={300}
                className="h-full w-full object-cover"
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {lightboxIndex !== null && (
        <Lightbox
          photos={displayedPhotos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
