/**
 * Reactions API — adds anonymous blessing reactions (hearts, blooms, cheers…)
 * to a published wedding. Clients batch rapid taps into a single request.
 *
 * POST body: { weddingId, kind, amount (1..20) }
 * Responses: 200 { count }, 400 validation, 404 unknown wedding, 429 rate limited.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { REACTION_KINDS } from "@/types/database";

const ReactionSchema = z.object({
  weddingId: z.string().uuid(),
  kind: z.enum(REACTION_KINDS),
  amount: z.number().int().min(1).max(20),
});

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = ReactionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reaction." }, { status: 400 });
  }
  const { weddingId, kind, amount } = parsed.data;

  const wait = checkRateLimit(`react:${clientIp(request)}:${weddingId}`, 30, 60 * 1000);
  if (wait > 0) {
    return NextResponse.json({ error: "So much love! Please slow down a little." }, { status: 429 });
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.rpc("increment_reaction", {
    p_wedding_id: weddingId,
    p_kind: kind,
    p_amount: amount,
  });

  if (error) {
    const notFound = error.message.includes("wedding not found");
    if (!notFound) console.error("[ERROR] reaction increment failed", { weddingId, kind, code: error.code });
    return NextResponse.json(
      { error: notFound ? "This invitation is no longer available." : "Couldn't send your reaction. Please try again." },
      { status: notFound ? 404 : 500 }
    );
  }

  return NextResponse.json({ count: Number(data) }, { status: 200 });
}
