/**
 * Guestbook API route with rate limiting (1 message per IP per 5 minutes).
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 5 * 60 * 1000;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";

  const lastSubmission = rateLimitMap.get(ip);
  if (lastSubmission && Date.now() - lastSubmission < RATE_LIMIT_MS) {
    const waitSeconds = Math.ceil((RATE_LIMIT_MS - (Date.now() - lastSubmission)) / 1000);
    return NextResponse.json({ error: `Please wait ${waitSeconds} seconds before sending another message.` }, { status: 429 });
  }

  const body = await request.json();
  const { weddingId, guestName, message } = body;

  if (!weddingId || !guestName || !message)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  if (guestName.length > 100)
    return NextResponse.json({ error: "Name too long (max 100 characters)" }, { status: 400 });
  if (message.length > 1000)
    return NextResponse.json({ error: "Message too long (max 1000 characters)" }, { status: 400 });

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("guestbook_entries")
    .insert({ wedding_id: weddingId, guest_name: guestName, message })
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  rateLimitMap.set(ip, Date.now());
  return NextResponse.json({ entry: data }, { status: 201 });
}
