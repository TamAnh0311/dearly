"use client";

/**
 * ModerationQueue — displays pending guest photos with approve/reject actions.
 * Uses useGallery's approvePhoto and rejectPhoto functions.
 */

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { GalleryPhotoRow } from "@/types/database";

interface ModerationQueueProps {
  /** Pending photos awaiting moderation. */
  pendingPhotos: GalleryPhotoRow[];
  /** Approves a photo by ID. */
  onApprove: (photoId: string) => Promise<void>;
  /** Rejects a photo by ID. */
  onReject: (photoId: string) => Promise<void>;
}

/**
 * List of pending photos with approve/reject buttons per item.
 */
export default function ModerationQueue({
  pendingPhotos,
  onApprove,
  onReject,
}: ModerationQueueProps) {
  const [busy, setBusy] = useState<string | null>(null);

  if (pendingPhotos.length === 0) {
    return (
      <p className="py-4 text-sm text-dearly-text-secondary">
        No photos pending moderation.
      </p>
    );
  }

  /**
   * Runs an approve or reject action while tracking the busy photo ID.
   */
  async function runAction(id: string, action: () => Promise<void>) {
    setBusy(id);
    try {
      await action();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3">
      {pendingPhotos.map((photo) => (
        <div
          key={photo.id}
          className="flex items-center gap-4 rounded-xl border border-dearly-border bg-dearly-card p-3"
        >
          {/* Thumbnail */}
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-dearly-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.thumbnail_url ?? photo.url}
              alt={photo.caption ?? "Guest photo"}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Meta */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-dearly-text">
              {photo.guest_name ?? "Anonymous guest"}
            </p>
            {photo.caption && (
              <p className="mt-0.5 truncate text-xs text-dearly-text-secondary">
                {photo.caption}
              </p>
            )}
            <p className="mt-0.5 text-xs text-dearly-text-muted">
              {new Date(photo.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => runAction(photo.id, () => onApprove(photo.id))}
              disabled={busy === photo.id}
              className="flex items-center gap-1 rounded-lg bg-green-100 px-2.5 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-200 disabled:opacity-50"
            >
              <Check size={14} />
              Approve
            </button>
            <button
              onClick={() => runAction(photo.id, () => onReject(photo.id))}
              disabled={busy === photo.id}
              className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            >
              <X size={14} />
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
