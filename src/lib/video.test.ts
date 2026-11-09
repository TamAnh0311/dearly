import { describe, it, expect } from "vitest";
import { parseVideoUrl, getOEmbedThumbnail } from "./video";

describe("parseVideoUrl", () => {
  it("parses youtube.com/watch?v= URLs", () => {
    const result = parseVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(result).toEqual({ provider: "youtube", videoId: "dQw4w9WgXcQ" });
  });

  it("parses youtu.be short URLs", () => {
    const result = parseVideoUrl("https://youtu.be/dQw4w9WgXcQ");
    expect(result).toEqual({ provider: "youtube", videoId: "dQw4w9WgXcQ" });
  });

  it("parses vimeo.com URLs", () => {
    const result = parseVideoUrl("https://vimeo.com/123456789");
    expect(result).toEqual({ provider: "vimeo", videoId: "123456789" });
  });

  it("returns null for non-video URLs", () => {
    expect(parseVideoUrl("https://example.com/video")).toBeNull();
    expect(parseVideoUrl("not a url")).toBeNull();
  });

  it("strips extra query params from YouTube", () => {
    const result = parseVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30");
    expect(result).toEqual({ provider: "youtube", videoId: "dQw4w9WgXcQ" });
  });
});

describe("getOEmbedThumbnail", () => {
  it("returns YouTube thumbnail URL from video ID", () => {
    const url = getOEmbedThumbnail("youtube", "dQw4w9WgXcQ");
    expect(url).toBe("https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg");
  });

  it("returns Vimeo thumbnail placeholder", () => {
    const url = getOEmbedThumbnail("vimeo", "123456789");
    expect(url).toContain("vumbnail.com");
  });
});
