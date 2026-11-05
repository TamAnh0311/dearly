/**
 * Per-template social card. Renders the design name, family and the template's
 * own colours so shared links look like the invitation, not a generic banner.
 */

import { ImageResponse } from "next/og";
import { LAYOUT_LABEL, getInvitationStyle } from "@/components/invitation/styles";
import { createPublicClient } from "@/lib/supabase/public";

export const runtime = "edge";
export const alt = "A Dearly invitation template";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

interface ImageProps {
  params: { slug: string };
}

/** Renders the Open Graph image for one template demo. */
export default async function TemplateOpengraphImage({ params }: ImageProps) {
  const supabase = createPublicClient();
  const { data } = supabase
    ? await supabase.from("templates").select("name, default_config").eq("slug", params.slug).maybeSingle()
    : { data: null };

  const name = data?.name ?? params.slug.replace(/-/g, " ");
  const colors = data?.default_config?.colors ?? { primary: "#B8860B", secondary: "#FFFDF7", accent: "#D4A574" };
  const label = LAYOUT_LABEL[getInvitationStyle(params.slug).hero] ?? "Invitation";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px 72px",
          backgroundColor: colors.secondary,
          color: "#1C1A17",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, textTransform: "uppercase", color: colors.primary }}>
          Dearly
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 5, textTransform: "uppercase", color: colors.primary }}>
            {label} invitation template
          </div>
          <div style={{ display: "flex", fontSize: 92, lineHeight: 1, letterSpacing: -2 }}>{name}</div>
          <div style={{ display: "flex", fontSize: 28, color: "rgba(28,26,23,0.62)" }}>
            Live animated demo · RSVP · blessings · photo album
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 24, color: "rgba(28,26,23,0.55)" }}>
          <div style={{ display: "flex" }}>dearly.app</div>
          <div style={{ display: "flex", gap: 10 }}>
            {[colors.primary, colors.accent, colors.secondary].map((color, i) => (
              <div
                key={`${color}-${i}`}
                style={{ display: "flex", width: 26, height: 26, borderRadius: 999, backgroundColor: color, border: "1px solid rgba(0,0,0,0.12)" }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
