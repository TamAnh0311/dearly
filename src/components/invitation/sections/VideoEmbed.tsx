"use client";

/**
 * VideoEmbed — responsive guest-facing video player.
 * Shows a thumbnail with a play button overlay. On click, swaps in the
 * embedded iframe with autoplay (unless the user prefers reduced motion).
 */

import { useReducedMotion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { parseVideoUrl, getEmbedUrl, getOEmbedThumbnail } from "@/lib/video";

interface VideoEmbedProps {
  /** The original YouTube or Vimeo URL stored on the gallery row. */
  videoUrl: string;
  /** Explicit thumbnail override; falls back to the resolved oEmbed thumbnail. */
  thumbnail?: string | null;
  caption?: string | null;
  className?: string;
}

/**
 * Lazy-loads the video embed only after the user clicks play.
 * Respects prefers-reduced-motion by omitting the autoplay parameter.
 */
export default function VideoEmbed({ videoUrl, thumbnail, caption, className }: VideoEmbedProps) {
  const prefersReducedMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  const parsed = parseVideoUrl(videoUrl);

  if (!parsed) {
    return (
      <div className={`flex aspect-video items-center justify-center rounded-xl bg-black/10 text-sm text-dearly-text-secondary ${className ?? ""}`}>
        Unsupported video URL
      </div>
    );
  }

  const resolvedThumbnail = thumbnail ?? getOEmbedThumbnail(parsed.provider, parsed.videoId);

  const baseEmbed = getEmbedUrl(parsed.provider, parsed.videoId);
  /** Add autoplay only when the user deliberately clicks play and motion is acceptable. */
  const embedWithAutoplay = prefersReducedMotion
    ? baseEmbed
    : `${baseEmbed}${baseEmbed.includes("?") ? "&" : "?"}autoplay=1`;

  return (
    <div className={className}>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        {playing ? (
          <iframe
            src={embedWithAutoplay}
            title="Embedded video"
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex items-center justify-center"
            aria-label="Play video"
          >
            <Image
              src={resolvedThumbnail}
              alt={caption ?? "Video thumbnail"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
            {/* Semi-transparent play button overlay */}
            <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-black/60 text-white shadow-lg transition group-hover:bg-black/80">
              <Play size={28} fill="currentColor" className="ml-1" />
            </span>
          </button>
        )}
      </div>

      {caption && (
        <p className="mt-2 text-center text-xs text-dearly-text-secondary">{caption}</p>
      )}
    </div>
  );
}
