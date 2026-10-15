/**
 * Default Open Graph image (1200×630) for shared links to marketing pages.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Dearly — cinematic wedding & event invitations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2a0e14 0%, #5a1a26 45%, #1e0b10 100%)",
          color: "#fbf4e8",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 12, textTransform: "uppercase", color: "#d9b56c" }}>Dearly</div>
        <div style={{ fontSize: 76, marginTop: 28, textAlign: "center", lineHeight: 1.1, maxWidth: 980 }}>Invitations that open like a film</div>
        <div style={{ fontSize: 30, marginTop: 28, color: "#e9d8b8" }}>Weddings · Birthdays · Parties · RSVP · Memories</div>
      </div>
    ),
    size
  );
}
