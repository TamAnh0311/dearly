"use client";

/**
 * Masonry grid gallery — Pinterest-style staggered layout with lightbox.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Lightbox from "./Lightbox";
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
            className="mb-4 cursor-pointer overflow-hidden rounded-lg break-inside-avoid"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
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
