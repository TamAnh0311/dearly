"use client";

/**
 * PhotoCarousel — an auto-playing hero slideshow for wedding invitation pages.
 * Images crossfade with a Ken Burns zoom effect, dot navigation, and hover-pause.
 * Children are overlaid centered on the carousel (e.g., couple names).
 */

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface PhotoCarouselProps {
  /** Array of photo URLs to display. */
  images: string[];
  /** Auto-advance interval in ms. Default: 5000. */
  interval?: number;
  /** Container height CSS value. Default: "70vh". */
  height?: string;
  /** Dark gradient overlay for text readability. Default: true. */
  overlay?: boolean;
  /** Content overlaid centered on the carousel (e.g., couple names). */
  children?: React.ReactNode;
}

/**
 * Returns the index of the next image, wrapping around.
 */
function nextIndex(current: number, total: number): number {
  return (current + 1) % total;
}

export default function PhotoCarousel({
  images,
  interval = 5000,
  height = "70vh",
  overlay = true,
  children,
}: PhotoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    setCurrent((prev) => nextIndex(prev, images.length));
  }, [images.length]);

  /** Restart the interval whenever the index changes or pause state changes. */
  useEffect(() => {
    if (paused || images.length <= 1) return;

    timerRef.current = setInterval(advance, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advance, interval, paused, images.length, current]);

  if (images.length === 0) return null;

  const nextImageSrc = images[nextIndex(current, images.length)];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Wedding photo carousel"
    >
      {/* Hidden preload for next image */}
      {images.length > 1 && (
        <div className="sr-only" aria-hidden>
          <Image
            src={nextImageSrc}
            alt=""
            fill
            sizes="1px"
            priority={false}
          />
        </div>
      )}

      {/* Slides */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* Ken Burns zoom */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: interval / 1000 + 1.2, ease: "linear" }}
          >
            <Image
              src={images[current]}
              alt={`Wedding photo ${current + 1}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority={current === 0}
              quality={90}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      {overlay && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      )}

      {/* Overlaid children (couple names, etc.) */}
      {children && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => {
                setCurrent(i);
                // Reset timer by toggling pause momentarily
                if (timerRef.current) clearInterval(timerRef.current);
              }}
              className="pointer-events-auto transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 9999,
                backgroundColor: i === current ? "white" : "rgba(255,255,255,0.45)",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
