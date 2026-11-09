"use client";

/**
 * GalleryStatsPanel — summary statistics for the wedding photo gallery:
 * total uploads, host vs guest split, moderation queue, and approval breakdown.
 */

import { Image as ImageIcon } from "lucide-react";

interface Photo {
  id: string;
  uploaded_by: "couple" | "guest";
  status: "pending" | "approved" | "rejected";
}

interface GalleryStatsPanelProps {
  /** All gallery photos for the wedding. */
  photos: Photo[];
}

export default function GalleryStatsPanel({ photos }: GalleryStatsPanelProps) {
  const total = photos.length;
  const hostUploads = photos.filter((p) => p.uploaded_by === "couple").length;
  const guestUploads = photos.filter((p) => p.uploaded_by === "guest").length;
  const pending = photos.filter((p) => p.status === "pending").length;
  const approved = photos.filter((p) => p.status === "approved").length;
  const rejected = photos.filter((p) => p.status === "rejected").length;

  const stats = [
    { label: "Total photos", value: total },
    { label: "Host uploads", value: hostUploads },
    { label: "Guest uploads", value: guestUploads },
  ];

  const moderation = [
    { label: "Pending review", value: pending, className: "text-amber-600" },
    { label: "Approved", value: approved, className: "text-green-600" },
    { label: "Rejected", value: rejected, className: "text-red-600" },
  ];

  return (
    <div className="rounded-2xl border border-dearly-border bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <ImageIcon size={18} className="text-dearly-accent" />
        <h2 className="text-base font-semibold text-dearly-text">Gallery Stats</h2>
      </div>

      {total === 0 ? (
        <p className="text-sm text-dearly-text-secondary">No photos uploaded yet.</p>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-3 gap-3">
            {stats.map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-dearly-text">{value}</p>
                <p className="text-xs text-dearly-text-secondary">{label}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-dearly-text-secondary">
              Moderation
            </p>
            <div className="grid grid-cols-3 gap-3">
              {moderation.map(({ label, value, className }) => (
                <div key={label}>
                  <p className={`text-xl font-bold ${className}`}>{value}</p>
                  <p className="text-xs text-dearly-text-secondary">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
