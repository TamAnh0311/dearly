"use client";

/**
 * PhotoGrid — grid of approved photos with hover overlay for delete/caption edit.
 */

import { useState } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";
import type { GalleryPhotoRow } from "@/types/database";

interface PhotoGridProps {
  /** Approved photos to display. */
  photos: GalleryPhotoRow[];
  /** Called to delete a photo by ID. */
  onDelete: (photoId: string) => Promise<void>;
  /** Called to update caption or other photo fields. */
  onUpdate: (photoId: string, updates: Partial<GalleryPhotoRow>) => Promise<void>;
}

interface EditState {
  id: string;
  caption: string;
}

/**
 * Responsive photo grid with inline caption editing and delete controls.
 */
export default function PhotoGrid({ photos, onDelete, onUpdate }: PhotoGridProps) {
  const [editing, setEditing] = useState<EditState | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  if (photos.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-dearly-text-secondary">
        No approved photos yet. Upload some above.
      </p>
    );
  }

  /**
   * Saves a caption edit for the given photo ID.
   */
  async function saveCaption(id: string) {
    if (!editing || editing.id !== id) return;
    setBusy(id);
    try {
      await onUpdate(id, { caption: editing.caption || null });
    } finally {
      setBusy(null);
      setEditing(null);
    }
  }

  /**
   * Triggers deletion for a photo ID.
   */
  async function handleDelete(id: string) {
    setBusy(id);
    try {
      await onDelete(id);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group relative aspect-square overflow-hidden rounded-xl bg-dearly-border"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.thumbnail_url ?? photo.url}
            alt={photo.caption ?? "Wedding photo"}
            className="h-full w-full object-cover transition group-hover:brightness-75"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-0 transition group-hover:opacity-100">
            {/* Top-right controls */}
            <div className="flex justify-end gap-1">
              <button
                onClick={() => setEditing({ id: photo.id, caption: photo.caption ?? "" })}
                disabled={busy === photo.id}
                className="rounded-lg bg-white/90 p-1.5 text-dearly-text transition hover:bg-white"
                aria-label="Edit caption"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(photo.id)}
                disabled={busy === photo.id}
                className="rounded-lg bg-white/90 p-1.5 text-red-600 transition hover:bg-white"
                aria-label="Delete photo"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Caption area */}
            {photo.caption && (
              <p className="line-clamp-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
                {photo.caption}
              </p>
            )}
          </div>

          {/* Busy overlay */}
          {busy === photo.id && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>
      ))}

      {/* Caption edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-dearly-card p-5 shadow-xl">
            <h3 className="mb-3 text-sm font-semibold text-dearly-text">Edit Caption</h3>
            <textarea
              value={editing.caption}
              onChange={(e) => setEditing({ ...editing, caption: e.target.value })}
              rows={3}
              placeholder="Add a caption…"
              className="w-full resize-none rounded-lg border border-dearly-border bg-dearly-card px-3 py-2 text-sm text-dearly-text focus:outline-none focus:ring-2 focus:ring-dearly-accent"
              autoFocus
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-dearly-text-secondary hover:bg-dearly-border"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={() => saveCaption(editing.id)}
                className="flex items-center gap-1 rounded-lg bg-dearly-accent px-3 py-1.5 text-xs text-white hover:bg-dearly-accent/90"
              >
                <Check size={14} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
