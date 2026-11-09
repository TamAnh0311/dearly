/**
 * Cron endpoint — weekly activity digest.
 *
 * Runs every Monday at 08:00 UTC (see vercel.json).
 * Finds published events with weekly_digest_enabled = true.
 * For each event, counts new RSVPs (attending/declined), blessings, and photos
 * from the last 7 days. Skips events with no activity.
 * Sends a digest email to the host via sendEmail + weeklyDigestHtml.
 *
 * POST only. Secured with CRON_SECRET via Authorization Bearer header.
 * Returns: { sent: number }
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { weeklyDigestHtml } from "@/lib/email-templates";

/** Verifies the request carries a valid CRON_SECRET Bearer token. */
function verifyCron(request: NextRequest): boolean {
  return request.headers.get("authorization")?.replace("Bearer ", "") === process.env.CRON_SECRET;
}

export async function POST(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Fetch all published events with weekly digest enabled.
  const { data: events, error: eventsErr } = await supabase
    .from("weddings")
    .select("id, user_id, slug, partner1_name, partner2_name")
    .eq("is_published", true)
    .eq("weekly_digest_enabled", true);

  if (eventsErr) {
    console.error("[ERROR] cron/digest: failed to fetch events", { code: eventsErr.code, message: eventsErr.message });
    return NextResponse.json({ error: "Failed to fetch events." }, { status: 500 });
  }

  let totalSent = 0;

  for (const event of events ?? []) {
    // Count new RSVPs in the last 7 days.
    const { data: rsvps, error: rsvpErr } = await supabase
      .from("rsvps")
      .select("attending")
      .eq("wedding_id", event.id)
      .gte("created_at", sevenDaysAgo);

    if (rsvpErr) {
      console.warn("[WARNING] cron/digest: failed to count rsvps", { eventId: event.id, code: rsvpErr.code });
      continue;
    }

    const attending = (rsvps ?? []).filter((r) => r.attending === true).length;
    const declined = (rsvps ?? []).filter((r) => r.attending === false).length;

    // Count new guestbook blessings in the last 7 days.
    const { count: blessings, error: blessingsErr } = await supabase
      .from("guestbook_entries")
      .select("id", { count: "exact", head: true })
      .eq("wedding_id", event.id)
      .gte("created_at", sevenDaysAgo);

    if (blessingsErr) {
      console.warn("[WARNING] cron/digest: failed to count blessings", { eventId: event.id, code: blessingsErr.code });
      continue;
    }

    // Count new photos in the last 7 days.
    const { count: photos, error: photosErr } = await supabase
      .from("gallery_photos")
      .select("id", { count: "exact", head: true })
      .eq("wedding_id", event.id)
      .gte("created_at", sevenDaysAgo);

    if (photosErr) {
      console.warn("[WARNING] cron/digest: failed to count photos", { eventId: event.id, code: photosErr.code });
      continue;
    }

    // Skip events with no activity this week.
    const hasActivity = attending + declined + (blessings ?? 0) + (photos ?? 0) > 0;
    if (!hasActivity) {
      console.info("[INFO] cron/digest: skipping event (no activity)", { eventId: event.id });
      continue;
    }

    // Count total guests (all invitees) for context.
    const { count: totalGuests } = await supabase
      .from("invitees")
      .select("id", { count: "exact", head: true })
      .eq("wedding_id", event.id);

    // Resolve host email via auth admin.
    const { data: hostAuth, error: hostErr } = await supabase.auth.admin.getUserById(event.user_id);
    if (hostErr || !hostAuth?.user?.email) {
      console.warn("[WARNING] cron/digest: could not resolve host email", { eventId: event.id });
      continue;
    }

    const eventName =
      event.partner1_name && event.partner2_name
        ? `${event.partner1_name} & ${event.partner2_name}`
        : event.slug;

    const sent = await sendEmail({
      to: hostAuth.user.email,
      subject: `Weekly update — ${eventName}`,
      html: weeklyDigestHtml({
        eventName,
        attending,
        declined,
        blessings: blessings ?? 0,
        photos: photos ?? 0,
        totalGuests: totalGuests ?? 0,
      }),
    });

    if (sent) {
      totalSent++;
      console.info("[INFO] cron/digest: digest sent", { eventId: event.id, to: hostAuth.user.email });
    } else {
      console.warn("[WARNING] cron/digest: email not sent", { eventId: event.id });
    }
  }

  console.info("[INFO] cron/digest: completed", { totalSent });
  return NextResponse.json({ sent: totalSent });
}
