/**
 * RSVP API — records a guest's attendance answer and, if they wrote one,
 * publishes their blessing to the wedding's guestbook (shown on the invitation).
 *
 * POST body: { weddingId, guestName, attending, partySize?, message? }
 * Responses: 201 { blessing | null }, 400 validation, 404 unknown wedding, 429 rate limited, 500.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

const RsvpSchema = z.object({
  weddingId: z.string().uuid(),
  guestName: z.string().trim().min(1, "Please enter your name").max(100, "Name is too long (max 100 characters)"),
  attending: z.boolean(),
  partySize: z.number().int().min(1).max(20).optional(),
  /** Personal invitation token from the guest list (?i=...). */
  inviteeToken: z.string().regex(/^[a-f0-9]{8,40}$/i).optional(),
  message: z.string().trim().max(1000, "Message is too long (max 1000 characters)").optional(),
});

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = RsvpSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid RSVP." },
      { status: 400 }
    );
  }
  const { weddingId, guestName, attending, partySize, message, inviteeToken } = parsed.data;

  const wait = checkRateLimit(`rsvp:${clientIp(request)}:${weddingId}`, 3, 10 * 60 * 1000);
  if (wait > 0) {
    return NextResponse.json(
      { error: `You've already responded a few times. Please try again in ${Math.ceil(wait / 60)} minute(s).` },
      { status: 429 }
    );
  }

  const supabase = createServiceRoleClient();

  // Service role bypasses RLS, so verify the wedding is published ourselves.
  const { data: wedding } = await supabase
    .from("weddings")
    .select("id")
    .eq("id", weddingId)
    .eq("is_published", true)
    .maybeSingle();
  if (!wedding) {
    return NextResponse.json({ error: "This invitation is no longer available." }, { status: 404 });
  }

  const blessingText = message && message.length > 0 ? message : null;

  // Personal invitation: must belong to this event; party size is capped by the invite.
  let invitee: { id: string; max_party_size: number } | null = null;
  if (inviteeToken) {
    const { data } = await supabase
      .from("invitees")
      .select("id, max_party_size")
      .eq("wedding_id", weddingId)
      .eq("token", inviteeToken)
      .maybeSingle();
    invitee = data;
  }
  const seats = attending ? Math.min(partySize ?? 1, invitee?.max_party_size ?? 10) : 0;

  const { error: rsvpError } = await supabase.from("rsvps").insert({
    wedding_id: weddingId,
    guest_name: guestName,
    attending,
    party_size: seats,
    message: blessingText,
    invitee_id: invitee?.id ?? null,
  });
  if (rsvpError) {
    console.error("[ERROR] rsvp insert failed", { weddingId, code: rsvpError.code });
    return NextResponse.json({ error: "We couldn't save your RSVP. Please try again." }, { status: 500 });
  }

  if (invitee) {
    const { error: invErr } = await supabase
      .from("invitees")
      .update({ status: attending ? "attending" : "declined", party_size: seats, responded_at: new Date().toISOString() })
      .eq("id", invitee.id);
    if (invErr) console.warn("[WARNING] invitee status update failed", { weddingId, code: invErr.code });
  }

  let blessing = null;
  if (blessingText) {
    const { data, error } = await supabase
      .from("guestbook_entries")
      .insert({
        wedding_id: weddingId,
        guest_name: guestName,
        message: blessingText,
        rsvp_status: attending ? "attending" : "declined",
      })
      .select()
      .single();
    if (error) {
      // RSVP is saved; the blessing is a bonus — report but don't fail the request.
      console.warn("[WARNING] blessing insert failed", { weddingId, code: error.code });
    } else {
      blessing = data;
    }
  }

  console.info("[INFO] rsvp recorded", { weddingId, attending });
  return NextResponse.json({ blessing }, { status: 201 });
}
