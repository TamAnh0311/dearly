"use client";

/**
 * Masonry grid gallery — Pinterest-style staggered layout with lightbox.
 * Videos render as a lazy-loaded embed; images open in a lightbox.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Lightbox from "./Lightbox";
import VideoEmbed from "@/components/invitation/sections/VideoEmbed";
import type { GalleryPhotoRow } from "@/types/database";
import type { ResolvedTheme } from "@/components/templates/types";

interface MasonryGridProps {
  photos: GalleryPhotoRow[];
  theme: ResolvedTheme;
  weddingId: string;
}

export default function MasonryGrid({ photos, theme }: MasonryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <p className="py-12 text-center text-sm" style={{ color: theme.colors.accent }}>
        No photos yet.
      </p>
    );
  }

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            className="mb-4 break-inside-avoid overflow-hidden rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            {photo.media_type === "video" && photo.video_url ? (
              <VideoEmbed
                videoUrl={photo.video_url}
                thumbnail={photo.thumbnail_url}
                caption={photo.caption}
              />
            ) : (
              <div
                className="cursor-pointer"
                onClick={() => setLightboxIndex(i)}
              >
                <Image
                  src={photo.thumbnail_url ?? photo.url}
                  alt={photo.caption ?? "Wedding photo"}
                  width={600}
                  height={400}
                  className="w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {photo.caption && (
                  <p className="px-3 py-2 text-xs" style={{ color: theme.colors.accent }}>
                    {photo.caption}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
