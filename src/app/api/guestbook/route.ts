/**
 * Guestbook API — adds a guest message to a published event's guestbook.
 *
 * POST body: { weddingId, guestName, message }
 * Responses: 201 { entry }, 400 validation, 404 unpublished, 429 rate limited, 500.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

const GuestbookSchema = z.object({
  weddingId: z.string().uuid(),
  guestName: z.string({ required_error: "Please enter your name" }).trim().min(1, "Please enter your name").max(100, "Name is too long (max 100 characters)"),
  message: z.string({ required_error: "Please enter a message" }).trim().min(1, "Please enter a message").max(1000, "Message is too long (max 1000 characters)"),
});

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = GuestbookSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid guestbook entry." },
      { status: 400 }
    );
  }
  const { weddingId, guestName, message } = parsed.data;

  const wait = await checkRateLimit(`guestbook:${clientIp(request)}`, 1, 5 * 60 * 1000);
  if (wait > 0) {
    return NextResponse.json(
      { error: `Please wait ${Math.ceil(wait / 60)} minute(s) before sending another message.` },
      { status: 429 }
    );
  }

  const supabase = createServiceRoleClient();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("id")
    .eq("id", weddingId)
    .eq("is_published", true)
    .maybeSingle();
  if (!wedding) {
    return NextResponse.json({ error: "This invitation is no longer available." }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("guestbook_entries")
    .insert({ wedding_id: weddingId, guest_name: guestName, message })
    .select()
    .single();

  if (error) {
    console.error("[ERROR] guestbook insert failed", { weddingId, code: error.code });
    return NextResponse.json({ error: "Couldn't save your message. Please try again." }, { status: 500 });
  }

  console.info("[INFO] guestbook entry added", { weddingId });
  return NextResponse.json({ entry: data }, { status: 201 });
}
