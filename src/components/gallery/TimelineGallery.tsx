"use client";

/**
 * Timeline gallery — photos arranged chronologically with captions and date markers.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Lightbox from "./Lightbox";
import type { GalleryPhotoRow } from "@/types/database";
import type { ResolvedTheme } from "@/components/templates/types";

interface TimelineGalleryProps {
  photos: GalleryPhotoRow[];
  theme: ResolvedTheme;
  weddingId: string;
}

export default function TimelineGallery({ photos, theme }: TimelineGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /** Sort photos chronologically. */
  const sorted = [...photos].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  if (sorted.length === 0) {
    return (
      <p className="py-12 text-center text-sm" style={{ color: theme.colors.accent }}>
        No photos yet.
      </p>
    );
  }

  return (
    <>
      <div className="relative mx-auto max-w-3xl">
        {/* Center line */}
        <div
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
          style={{ backgroundColor: `${theme.colors.primary}30` }}
        />

        <div className="flex flex-col gap-12">
          {sorted.map((photo, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={photo.id}
                className={`flex items-start gap-6 ${isLeft ? "" : "flex-row-reverse"}`}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className={`w-1/2 ${isLeft ? "text-right" : "text-left"}`}>
                  <div
                    className="inline-block cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => setLightboxIndex(i)}
                  >
                    <Image
                      src={photo.thumbnail_url ?? photo.url}
                      alt={photo.caption ?? "Wedding photo"}
                      width={500}
                      height={350}
                      className="w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  {photo.caption && (
                    <p className="mt-2 text-sm" style={{ color: theme.colors.accent }}>
                      {photo.caption}
                    </p>
                  )}
                </div>

                {/* Center dot */}
                <div
                  className="mt-4 h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                />

                {/* Date side */}
                <div className={`w-1/2 pt-4 ${isLeft ? "text-left" : "text-right"}`}>
                  <p className="text-xs uppercase tracking-wider" style={{ color: theme.colors.accent, opacity: 0.6 }}>
                    {new Date(photo.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={sorted}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
