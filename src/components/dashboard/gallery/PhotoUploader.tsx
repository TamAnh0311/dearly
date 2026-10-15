"use client";

/**
 * PhotoUploader — drag-and-drop area for uploading wedding photos.
 * Submits files to /api/photos/upload as FormData.
 */

import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";

interface PhotoUploaderProps {
  /** The wedding ID to associate uploads with. */
  weddingId: string;
  /** Called after a successful upload to trigger a data refresh. */
  onUploaded: () => void;
}

/**
 * Handles file selection, drag-and-drop, and multipart upload to the API.
 */
export default function PhotoUploader({ weddingId, onUploaded }: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Uploads selected files via POST /api/photos/upload.
   */
  async function uploadFiles(files: FileList | File[]) {
    const fileList = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileList.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const form = new FormData();
      fileList.forEach((file) => form.append("photos", file));
      form.append("weddingId", weddingId);

      const res = await fetch("/api/photos/upload", { method: "POST", body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Upload failed (${res.status})`);
      }
      onUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      uploadFiles(e.dataTransfer.files);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [weddingId]
  );

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition ${
          isDragging
            ? "border-dearly-accent bg-dearly-accent-soft"
            : "border-dearly-border hover:border-dearly-accent/60 hover:bg-dearly-accent-soft/30"
        }`}
      >
        <Upload size={28} className="text-dearly-text-secondary" />
        <div className="text-center">
          <p className="text-sm font-medium text-dearly-text">
            {uploading ? "Uploading…" : "Drop photos here or click to browse"}
          </p>
          <p className="mt-0.5 text-xs text-dearly-text-secondary">
            JPG, PNG, WEBP — multiple files supported
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
