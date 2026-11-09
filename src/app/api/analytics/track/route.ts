/**
 * Analytics event ingestion endpoint.
 *
 * POST body: { weddingId, eventType, guestToken?, metadata? }
 * Responses: 201 on success, 200 on dedup, 400 on validation error, 500 on insert failure.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { clientIp } from "@/lib/rate-limit";
import { hashIp, lookupGeo } from "@/lib/geo";

const VALID_EVENT_TYPES = [
  "page_view",
  "rsvp_opened",
  "rsvp_submitted",
  "blessing_sent",
  "reaction_sent",
  "photo_viewed",
] as const;

/** How long (ms) within which a duplicate ip_hash + event + wedding_id is suppressed. */
const DEDUP_WINDOW_MS = 5 * 60 * 1000;

const TrackSchema = z.object({
  weddingId: z.string().uuid(),
  eventType: z.enum(VALID_EVENT_TYPES),
  guestToken: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = TrackSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid analytics event." },
      { status: 400 }
    );
  }

  const { weddingId, eventType, guestToken, metadata } = parsed.data;
  const ip = clientIp(request);
  const ipHash = hashIp(ip);

  const supabase = createServiceRoleClient();

  // Deduplication: check if this ip_hash + event + wedding_id exists within the last 5 minutes.
  const dedupCutoff = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString();
  const { data: existing } = await supabase
    .from("analytics_events")
    .select("id")
    .eq("ip_hash", ipHash)
    .eq("event", eventType)
    .eq("wedding_id", weddingId)
    .gte("created_at", dedupCutoff)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ deduplicated: true }, { status: 200 });
  }

  const geo = await lookupGeo(ip);

  const { error } = await supabase.from("analytics_events").insert({
    wedding_id: weddingId,
    event: eventType,
    guest_token: guestToken ?? null,
    ip_hash: ipHash,
    country: geo.country,
    city: geo.city,
    properties: metadata ?? {},
  });

  if (error) {
    console.error("[ERROR] analytics insert failed", { weddingId, eventType, code: error.code });
    return NextResponse.json({ error: "Failed to record analytics event." }, { status: 500 });
  }

  console.info("[INFO] analytics event recorded", { weddingId, eventType });
  return NextResponse.json({ recorded: true }, { status: 201 });
}
