"use client";

/**
 * Gallery management page — upload, view, and moderate photos.
 * Uses useGallery for photo data and useMyWedding for the wedding ID.
 */

import { useCallback, useState } from "react";
import { Video } from "lucide-react";
import { useMyWedding } from "@/hooks/useWedding";
import { useGallery } from "@/hooks/useGallery";
import { createClient } from "@/lib/supabase/client";
import PhotoUploader from "@/components/dashboard/gallery/PhotoUploader";
import PhotoGrid from "@/components/dashboard/gallery/PhotoGrid";
import VideoAddModal from "@/components/dashboard/gallery/VideoAddModal";
import BulkModeration from "@/components/dashboard/gallery/BulkModeration";

/**
 * Dashboard gallery page.
 */
export default function GalleryPage() {
  const { wedding, loading: weddingLoading } = useMyWedding();
  const {
    photos,
    pendingPhotos,
    loading: galleryLoading,
    approvePhoto,
    rejectPhoto,
    deletePhoto,
    updatePhoto,
  } = useGallery(wedding?.id);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  /**
   * Re-uses the same gallery hook — the hook re-fetches on weddingId change,
   * so we trigger a lightweight reload by forcing a state notification.
   * Here we simply rely on the gallery hook's internal state.
   */
  const handleUploaded = useCallback(() => {
    // The photo will appear in the moderation queue after a page refresh.
    // A full SPA refresh is the simplest reliable approach here.
    window.location.reload();
  }, []);

  /**
   * Toggles a single pending photo in/out of the selection set.
   */
  function handleTogglePhoto(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  /**
   * Selects all pending photos if not all are selected; otherwise clears selection.
   */
  function handleToggleAll() {
    if (selectedIds.size === pendingPhotos.length && pendingPhotos.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingPhotos.map((p) => p.id)));
    }
  }

  /**
   * Bulk-approves the given photo IDs, then reloads the page to reflect changes.
   */
  async function handleBulkApprove(ids: string[]) {
    const supabase = createClient();
    await supabase
      .from("gallery_photos")
      .update({ status: "approved" })
      .in("id", ids);
    setSelectedIds(new Set());
    window.location.reload();
  }

  /**
   * Bulk-rejects the given photo IDs, then reloads the page to reflect changes.
   */
  async function handleBulkReject(ids: string[]) {
    const supabase = createClient();
    await supabase
      .from("gallery_photos")
      .update({ status: "rejected" })
      .in("id", ids);
    setSelectedIds(new Set());
    window.location.reload();
  }

  /**
   * Inserts a video gallery row via Supabase then reloads to show it
   * in the approved photos grid.
   */
  async function handleAddVideo(videoUrl: string, thumbnailUrl: string) {
    if (!wedding) return;
    setVideoError(null);
    const supabase = createClient();
    const maxOrder = photos.reduce((m, p) => Math.max(m, p.sort_order), 0);
    const { error } = await supabase.from("gallery_photos").insert({
      wedding_id: wedding.id,
      url: thumbnailUrl,
      thumbnail_url: thumbnailUrl,
      media_type: "video",
      video_url: videoUrl,
      status: "approved",
      uploaded_by: "couple",
      album: "other",
      sort_order: maxOrder + 1,
    });
    if (error) {
      setVideoError(error.message);
      return;
    }
    window.location.reload();
  }

  if (weddingLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-sm text-dearly-text-secondary">Loading…</p>
      </div>
    );
  }

  if (!wedding) {
    return (
      <p className="text-sm text-dearly-text-secondary">
        No event found. Set one up in the Editor first.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dearly-text">Gallery</h1>
        <p className="mt-1 text-sm text-dearly-text-secondary">
          Upload photos and manage guest submissions.
        </p>
      </div>

      {/* Upload area */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-dearly-text">Upload Photos</h2>
          <button
            type="button"
            onClick={() => setVideoModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-dearly-border bg-white px-3 py-1.5 text-xs font-semibold text-dearly-text shadow-sm transition hover:bg-dearly-accent-soft"
          >
            <Video size={14} className="text-dearly-accent" />
            Add video
          </button>
        </div>
        <PhotoUploader weddingId={wedding.id} onUploaded={handleUploaded} />
        {videoError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{videoError}</p>
        )}
      </section>

      {videoModalOpen && (
        <VideoAddModal
          onAdd={handleAddVideo}
          onClose={() => setVideoModalOpen(false)}
        />
      )}

      {/* Moderation queue */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-dearly-text">
            Moderation Queue{" "}
            {pendingPhotos.length > 0 && (
              <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                {pendingPhotos.length}
              </span>
            )}
          </h2>
        </div>

        {/* Bulk moderation toolbar — only shown when pending photos exist */}
        {pendingPhotos.length > 0 && (
          <BulkModeration
            totalPending={pendingPhotos.length}
            selectedIds={selectedIds}
            onToggleAll={handleToggleAll}
            onApprove={handleBulkApprove}
            onReject={handleBulkReject}
          />
        )}

        {/* Individual photo rows with checkbox overlay */}
        <div className="space-y-3">
          {pendingPhotos.length === 0 ? (
            <p className="py-4 text-sm text-dearly-text-secondary">
              No photos pending moderation.
            </p>
          ) : (
            pendingPhotos.map((photo) => (
              <div key={photo.id} className="relative flex items-center gap-4 rounded-xl border border-dearly-border bg-dearly-card p-3">
                {/* Checkbox overlay for bulk selection */}
                <button
                  type="button"
                  aria-label={selectedIds.has(photo.id) ? "Deselect photo" : "Select photo"}
                  onClick={() => handleTogglePhoto(photo.id)}
                  className="absolute left-3 top-3 z-10 flex h-5 w-5 items-center justify-center rounded border border-dearly-border bg-white shadow-sm transition hover:border-dearly-accent"
                >
                  {selectedIds.has(photo.id) && (
                    <span className="block h-3 w-3 rounded-sm bg-dearly-accent" />
                  )}
                </button>

                {/* Thumbnail — left-padded to clear checkbox */}
                <div className="ml-6 h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-dearly-border">
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

                {/* Per-row approve/reject actions */}
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => approvePhoto(photo.id)}
                    className="flex items-center gap-1 rounded-lg bg-green-100 px-2.5 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-200"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectPhoto(photo.id)}
                    className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Approved photos grid */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-dearly-text">
          Approved Photos{" "}
          <span className="ml-1 text-dearly-text-secondary">({photos.length})</span>
        </h2>
        {galleryLoading ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-dearly-border" />
            ))}
          </div>
        ) : (
          <PhotoGrid
            photos={photos}
            onDelete={deletePhoto}
            onUpdate={updatePhoto}
          />
        )}
      </section>
    </div>
  );
}
