/**
 * Client-side photo preparation and sequential upload.
 *
 * A multi-file selection used to be sent as one multipart request. Phone photos
 * are often 2–6 MB each, so three or more exceeded the platform request-body
 * limit and came back as a bare 413. Uploading one prepared photo per request
 * keeps every request small, and large images are re-encoded first.
 */

const MAX_EDGE = 2400;
/** Re-encode photos above this size before uploading. */
const TARGET_BYTES = 3.2 * 1024 * 1024;
/** Safety margin below Vercel's 4.5 MB request-body limit. */
const MAX_REQUEST_BYTES = 4 * 1024 * 1024;
const COMPRESSIBLE = new Set(["image/jpeg", "image/png", "image/webp"]);

/** Scales width/height down to fit `maxEdge`, preserving aspect ratio (never upscales). */
export function fitDimensions(width: number, height: number, maxEdge: number): { width: number; height: number } {
  if (width <= 0 || height <= 0 || maxEdge <= 0) return { width: 0, height: 0 };
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

/** Re-encodes an oversized JPEG/PNG/WebP as a smaller JPEG; other files pass through. */
export async function preparePhoto(file: File): Promise<File> {
  if (!COMPRESSIBLE.has(file.type) || file.size <= TARGET_BYTES) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = fitDimensions(bitmap.width, bitmap.height, MAX_EDGE);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg", lastModified: file.lastModified });
  } catch {
    return file;
  }
}

/** Upload failure with the HTTP status and optional API error code. */
export class PhotoUploadError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "PhotoUploadError";
    this.status = status;
    this.code = code;
  }
}

/** Uploads photos one request at a time and reports progress after each success. */
export async function uploadPhotos({
  weddingId,
  files,
  guestName,
  onProgress,
}: {
  weddingId: string;
  files: File[];
  guestName?: string;
  onProgress?: (done: number, total: number) => void;
}): Promise<{ url: string }[]> {
  const uploaded: { url: string }[] = [];

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const prepared = await preparePhoto(file);
    if (prepared.size > MAX_REQUEST_BYTES) {
      throw new PhotoUploadError(
        `"${file.name}" is too large to upload. Choose a photo under ${Math.round(MAX_REQUEST_BYTES / 1024 / 1024)} MB.`,
        413,
        "PAYLOAD_TOO_LARGE"
      );
    }

    const form = new FormData();
    form.append("weddingId", weddingId);
    if (guestName) form.append("guestName", guestName);
    form.append("photos", prepared);

    const res = await fetch("/api/photos/upload", { method: "POST", body: form });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const fallback =
        res.status === 413 ? "This upload is too large for the server." : `Upload failed (${res.status})`;
      throw new PhotoUploadError(body.error ?? fallback, res.status, body.code);
    }

    const body = await res.json().catch(() => ({ photos: [] as { url: string }[] }));
    uploaded.push(...(body.photos ?? []));
    onProgress?.(index + 1, files.length);
  }

  return uploaded;
}
