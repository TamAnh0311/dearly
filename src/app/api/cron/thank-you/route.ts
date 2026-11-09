/**
 * Cron endpoint — post-event thank-you.
 *
 * Runs daily at 10:00 UTC (see vercel.json).
 * Finds published events whose wedding_date was yesterday and whose
 * thank_you_sent flag is false. For each event, finds attending invitees and
 * logs the thank-you intent (no guest emails stored), then marks
 * thank_you_sent = true on the event.
 *
 * POST only. Secured with CRON_SECRET via Authorization Bearer header.
 * Returns: { sent: number }
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

/** Verifies the request carries a valid CRON_SECRET Bearer token. */
function verifyCron(request: NextRequest): boolean {
  return request.headers.get("authorization")?.replace("Bearer ", "") === process.env.CRON_SECRET;
}

export async function POST(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createServiceRoleClient();

  // Compute yesterday's date in YYYY-MM-DD format.
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Fetch published events that happened yesterday and haven't sent thank-yous.
  const { data: events, error: eventsErr } = await supabase
    .from("weddings")
    .select("id, slug, partner1_name, partner2_name")
    .eq("is_published", true)
    .eq("wedding_date", yesterday)
    .eq("thank_you_sent", false);

  if (eventsErr) {
    console.error("[ERROR] cron/thank-you: failed to fetch events", { code: eventsErr.code, message: eventsErr.message });
    return NextResponse.json({ error: "Failed to fetch events." }, { status: 500 });
  }

  let totalSent = 0;

  for (const event of events ?? []) {
    // Fetch attending invitees for this event.
    const { data: invitees, error: invErr } = await supabase
      .from("invitees")
      .select("id, name")
      .eq("wedding_id", event.id)
      .eq("status", "attending");

    if (invErr) {
      console.warn("[WARNING] cron/thank-you: failed to fetch invitees", { eventId: event.id, code: invErr.code });
      continue;
    }

    const eventName =
      event.partner1_name && event.partner2_name
        ? `${event.partner1_name} & ${event.partner2_name}`
        : event.slug;

    // No guest emails stored — log intent only.
    for (const invitee of invitees ?? []) {
      console.info("[INFO] cron/thank-you: would send thank-you", {
        eventSlug: event.slug,
        inviteeId: invitee.id,
        inviteeName: invitee.name,
        eventName,
      });
    }

    // Mark thank_you_sent regardless of invitee count so we don't retry tomorrow.
    const { error: updateErr } = await supabase
      .from("weddings")
      .update({ thank_you_sent: true })
      .eq("id", event.id);

    if (updateErr) {
      console.warn("[WARNING] cron/thank-you: failed to mark thank_you_sent", {
        eventId: event.id,
        code: updateErr.code,
      });
      continue;
    }

    totalSent++;
    console.info("[INFO] cron/thank-you: processed event", {
      eventId: event.id,
      attendingCount: (invitees ?? []).length,
    });
  }

  console.info("[INFO] cron/thank-you: completed", { totalSent });
  return NextResponse.json({ sent: totalSent });
}
