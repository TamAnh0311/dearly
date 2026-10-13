"use client";

/**
 * Guest upload form — allows guests to submit photos for moderation.
 */

import { useState, useRef, FormEvent } from "react";
import { Upload, Check, Loader2 } from "lucide-react";
import type { ResolvedTheme } from "@/components/templates/types";

interface GuestUploadFormProps {
  weddingId: string;
  theme: ResolvedTheme;
}

export default function GuestUploadForm({ weddingId, theme }: GuestUploadFormProps) {
  const [guestName, setGuestName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Handles form submission — uploads photos via API route. */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("weddingId", weddingId);
      formData.append("guestName", guestName);
      files.forEach((file) => formData.append("photos", file));

      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Upload failed");
      }

      setSuccess(true);
      setFiles([]);
      setGuestName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border p-6" style={{ borderColor: `${theme.colors.primary}30` }}>
        <Check size={32} style={{ color: theme.colors.primary }} />
        <p className="text-sm" style={{ color: theme.colors.accent }}>
          Photos submitted for review. Thank you!
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-sm underline"
          style={{ color: theme.colors.primary }}
        >
          Upload more
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border p-6" style={{ borderColor: `${theme.colors.primary}30` }}>
      <h3 className="mb-4 text-lg font-medium" style={{ color: theme.colors.primary }}>
        Share your photos
      </h3>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Your name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
          className="rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: `${theme.colors.primary}30` }}
        />

        <div
          className="cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition hover:opacity-80"
          style={{ borderColor: `${theme.colors.primary}30` }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={24} className="mx-auto mb-2" style={{ color: theme.colors.accent }} />
          <p className="text-sm" style={{ color: theme.colors.accent }}>
            {files.length > 0
              ? `${files.length} photo(s) selected`
              : "Click to select photos"}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={uploading || files.length === 0}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50"
          style={{ backgroundColor: theme.colors.primary }}
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Uploading…
            </span>
          ) : (
            "Submit Photos"
          )}
        </button>
      </div>
    </form>
  );
}
