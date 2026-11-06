/**
 * Per-event social card — shown when guests share their invitation link on
 * Zalo, LINE, Facebook, WhatsApp, etc. Uses the couple's names, event date,
 * and template colours so the link preview matches the invitation.
 */

import { ImageResponse } from "next/og";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { hostNames, eventTypeOf, EVENT_COPY } from "@/lib/event-types";

export const runtime = "edge";
export const alt = "You're invited";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface ImageProps {
  params: { slug: string };
}

export default async function EventOpengraphImage({ params }: ImageProps) {
  let names = "You're Invited";
  let date = "";
  let venue = "";
  let label = "Invitation";
  let primary = "#B8860B";
  let secondary = "#FFFDF7";
  let accent = "#D4A574";

  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("weddings")
      .select("partner1_name, partner2_name, wedding_date, venue_name, event_type, event_title, template:templates(default_config)")
      .eq("slug", params.slug)
      .eq("is_published", true)
      .maybeSingle();

    if (data) {
      names = data.event_title || hostNames(data as { partner1_name: string; partner2_name: string });
      const copy = EVENT_COPY[eventTypeOf(data as Parameters<typeof eventTypeOf>[0])];
      label = copy.label;
      if (data.wedding_date) {
        date = new Date(data.wedding_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
      }
      if (data.venue_name) venue = data.venue_name;
      const tplConfig = (data.template as { default_config?: { colors?: { primary?: string; secondary?: string; accent?: string } } })?.default_config;
      if (tplConfig?.colors) {
        primary = tplConfig.colors.primary ?? primary;
        secondary = tplConfig.colors.secondary ?? secondary;
        accent = tplConfig.colors.accent ?? accent;
      }
    }
  } catch {
    /* Edge runtime may not have all env vars — fall back to defaults */
  }

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
          backgroundColor: secondary,
          color: "#1C1A17",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: primary }}>
          Dearly
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: primary }}>
            {label}
          </div>
          <div style={{ display: "flex", fontSize: 82, lineHeight: 1, letterSpacing: -2 }}>{names}</div>
          {(date || venue) && (
            <div style={{ display: "flex", fontSize: 28, color: "rgba(28,26,23,0.6)" }}>
              {[date, venue].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 22, color: "rgba(28,26,23,0.5)" }}>
          <div style={{ display: "flex" }}>dearly.app/{params.slug}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[primary, accent, secondary].map((color, i) => (
              <div key={`${color}-${i}`} style={{ display: "flex", width: 24, height: 24, borderRadius: 999, backgroundColor: color, border: "1px solid rgba(0,0,0,0.1)" }} />
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
