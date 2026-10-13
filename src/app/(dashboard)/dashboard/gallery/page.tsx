"use client";

/**
 * Gallery management page — upload, view, and moderate photos.
 * Uses useGallery for photo data and useMyWedding for the wedding ID.
 */

import { useCallback } from "react";
import { useMyWedding } from "@/hooks/useWedding";
import { useGallery } from "@/hooks/useGallery";
import PhotoUploader from "@/components/dashboard/gallery/PhotoUploader";
import PhotoGrid from "@/components/dashboard/gallery/PhotoGrid";
import ModerationQueue from "@/components/dashboard/gallery/ModerationQueue";

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
        No wedding found. Set one up in the Editor first.
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
        <h2 className="text-sm font-semibold text-dearly-text">Upload Photos</h2>
        <PhotoUploader weddingId={wedding.id} onUploaded={handleUploaded} />
      </section>

      {/* Moderation queue */}
      {pendingPhotos.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-dearly-text">
            Moderation Queue{" "}
            <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
              {pendingPhotos.length}
            </span>
          </h2>
          <ModerationQueue
            pendingPhotos={pendingPhotos}
            onApprove={approvePhoto}
            onReject={rejectPhoto}
          />
        </section>
      )}

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
