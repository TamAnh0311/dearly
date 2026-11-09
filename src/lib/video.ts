/**
 * YouTube / Vimeo URL parsing and thumbnail resolution.
 * No external dependencies — pure string manipulation.
 */

export type VideoProvider = "youtube" | "vimeo";

export interface ParsedVideo {
  provider: VideoProvider;
  videoId: string;
}

/** Extracts provider and video ID from a YouTube or Vimeo URL. Returns null if unrecognised. */
export function parseVideoUrl(url: string): ParsedVideo | null {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return { provider: "youtube", videoId: v };
      const embedMatch = u.pathname.match(/\/embed\/([a-zA-Z0-9_-]+)/);
      if (embedMatch) return { provider: "youtube", videoId: embedMatch[1] };
    }

    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      if (id) return { provider: "youtube", videoId: id };
    }

    if (u.hostname.includes("vimeo.com")) {
      const match = u.pathname.match(/\/(\d+)/);
      if (match) return { provider: "vimeo", videoId: match[1] };
    }
  } catch {
    // Invalid URL
  }
  return null;
}

/** Returns a direct thumbnail URL for a video. */
export function getOEmbedThumbnail(provider: VideoProvider, videoId: string): string {
  if (provider === "youtube") {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return `https://vumbnail.com/${videoId}.jpg`;
}

/** Returns the embed URL for an iframe. */
export function getEmbedUrl(provider: VideoProvider, videoId: string): string {
  if (provider === "youtube") {
    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  }
  return `https://player.vimeo.com/video/${videoId}`;
}
