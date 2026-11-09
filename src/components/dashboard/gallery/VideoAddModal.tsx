"use client";

/**
 * VideoAddModal — modal for adding a YouTube or Vimeo video to the gallery.
 * Validates the URL client-side, shows a live preview, then calls onAdd.
 */

import { useEffect, useRef, useState } from "react";
import { X, Video, ExternalLink } from "lucide-react";
import { parseVideoUrl, getEmbedUrl, getOEmbedThumbnail } from "@/lib/video";

interface VideoAddModalProps {
  /** Called with the original URL and resolved thumbnail when the user confirms. */
  onAdd: (videoUrl: string, thumbnailUrl: string) => void;
  onClose: () => void;
}

/**
 * Renders a full-screen backdrop modal with URL input, live embed preview,
 * and confirm / cancel actions.
 */
export default function VideoAddModal({ onAdd, onClose }: VideoAddModalProps) {
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const parsed = url.trim() ? parseVideoUrl(url.trim()) : null;
  const embedUrl = parsed ? getEmbedUrl(parsed.provider, parsed.videoId) : null;
  const thumbnailUrl = parsed ? getOEmbedThumbnail(parsed.provider, parsed.videoId) : null;

  /** Focus the input when the modal mounts. */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /** Close on Escape key. */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleAdd() {
    if (!parsed || !thumbnailUrl) return;
    onAdd(url.trim(), thumbnailUrl);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-dearly-cream shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dearly-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Video size={18} className="text-dearly-accent" />
            <h2 className="text-sm font-semibold text-dearly-text">Add Video</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-dearly-text-secondary transition hover:bg-dearly-border"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-5 py-5">
          {/* URL input */}
          <div className="space-y-1.5">
            <label htmlFor="video-url" className="text-xs font-medium text-dearly-text">
              YouTube or Vimeo URL
            </label>
            <input
              ref={inputRef}
              id="video-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=…"
              className="w-full rounded-xl border border-dearly-border bg-white px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-secondary focus:outline-none focus:ring-2 focus:ring-dearly-accent/40"
            />
            {url.trim() && !parsed && (
              <p className="text-xs text-red-500">
                Only YouTube and Vimeo URLs are supported.
              </p>
            )}
            {parsed && (
              <p className="flex items-center gap-1 text-xs text-dearly-text-secondary">
                <ExternalLink size={12} />
                {parsed.provider === "youtube" ? "YouTube" : "Vimeo"} · ID {parsed.videoId}
              </p>
            )}
          </div>

          {/* Live preview */}
          {embedUrl && (
            <div className="overflow-hidden rounded-xl border border-dearly-border">
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={embedUrl}
                  title="Video preview"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-dearly-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm text-dearly-text-secondary transition hover:bg-dearly-border"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!parsed}
            className="rounded-xl bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add to gallery
          </button>
        </div>
      </div>
    </div>
  );
}
