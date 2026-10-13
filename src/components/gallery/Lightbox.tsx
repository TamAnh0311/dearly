"use client";

/**
 * Lightbox — fullscreen photo viewer with swipe and keyboard navigation.
 * Used by all gallery layouts across all templates.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import Image from "next/image";
import type { GalleryPhotoRow } from "@/types/database";

interface LightboxProps {
  photos: GalleryPhotoRow[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ photos, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const photo = photos[currentIndex];

  /** Navigate to the previous photo. */
  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : photos.length - 1));
  }, [photos.length]);

  /** Navigate to the next photo. */
  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i < photos.length - 1 ? i + 1 : 0));
  }, [photos.length]);

  /** Handle keyboard navigation. */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goPrev, goNext]);

  /** Prevent body scroll while lightbox is open. */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Controls */}
        <div className="absolute right-4 top-4 z-10 flex gap-2" onClick={(e) => e.stopPropagation()}>
          <a
            href={photo.url}
            download
            className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label="Download photo"
          >
            <Download size={20} />
          </a>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation arrows */}
        {photos.length > 1 && (
          <>
            <button
              className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next photo"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Photo */}
        <motion.div
          key={photo.id}
          className="relative max-h-[85vh] max-w-[90vw]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={photo.url}
            alt={photo.caption ?? "Wedding photo"}
            width={1200}
            height={800}
            className="max-h-[85vh] w-auto rounded-lg object-contain"
            priority
          />
          {photo.caption && (
            <p className="mt-3 text-center text-sm text-white/70">{photo.caption}</p>
          )}
        </motion.div>

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/50">
          {currentIndex + 1} / {photos.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
