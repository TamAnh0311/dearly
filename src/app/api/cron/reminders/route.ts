/**
 * Cron endpoint — RSVP reminders.
 *
 * Runs daily at 09:00 UTC (see vercel.json).
 * Finds published events whose wedding_date is in the future and whose
 * daysUntil value matches one of the event's configured reminder_days.
 * For each matching event, finds pending invitees who have NOT been reminded
 * today, logs the intent (no guest emails stored), and updates last_reminder_sent.
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
  const today = new Date();
  const todayIso = today.toISOString().split("T")[0]; // YYYY-MM-DD

  // Fetch all published events with a future wedding_date and reminder config.
  const { data: events, error: eventsErr } = await supabase
    .from("weddings")
    .select("id, wedding_date, reminder_days, slug")
    .eq("is_published", true)
    .gt("wedding_date", todayIso)
    .not("reminder_days", "is", null);

  if (eventsErr) {
    console.error("[ERROR] cron/reminders: failed to fetch events", { code: eventsErr.code, message: eventsErr.message });
    return NextResponse.json({ error: "Failed to fetch events." }, { status: 500 });
  }

  let totalSent = 0;

  for (const event of events ?? []) {
    const reminderDays: number[] = Array.isArray(event.reminder_days) ? event.reminder_days : [];
    if (reminderDays.length === 0) continue;

    const weddingDate = new Date(event.wedding_date);
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysUntil = Math.round((weddingDate.getTime() - today.getTime()) / msPerDay);

    if (!reminderDays.includes(daysUntil)) continue;

    // Find pending invitees who have not been reminded today.
    const { data: invitees, error: invErr } = await supabase
      .from("invitees")
      .select("id, name")
      .eq("wedding_id", event.id)
      .eq("status", "pending")
      .or(`last_reminder_sent.is.null,last_reminder_sent.lt.${todayIso}`);

    if (invErr) {
      console.warn("[WARNING] cron/reminders: failed to fetch invitees", { eventId: event.id, code: invErr.code });
      continue;
    }

    for (const invitee of invitees ?? []) {
      // No guest emails stored — log intent only.
      console.info("[INFO] cron/reminders: would send reminder", {
        eventSlug: event.slug,
        inviteeId: invitee.id,
        inviteeName: invitee.name,
        daysUntil,
      });

      const { error: updateErr } = await supabase
        .from("invitees")
        .update({ last_reminder_sent: todayIso })
        .eq("id", invitee.id);

      if (updateErr) {
        console.warn("[WARNING] cron/reminders: failed to update last_reminder_sent", {
          inviteeId: invitee.id,
          code: updateErr.code,
        });
        continue;
      }

      totalSent++;
    }
  }

  console.info("[INFO] cron/reminders: completed", { totalSent });
  return NextResponse.json({ sent: totalSent });
}
