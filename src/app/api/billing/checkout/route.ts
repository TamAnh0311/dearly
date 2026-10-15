/**
 * Billing checkout — monetisation scaffold (not live).
 *
 * Intended flow once a payment provider (e.g. Stripe) is connected:
 *  1. POST { eventId, plan } from /pricing or the dashboard.
 *  2. Verify the signed-in user owns the event; create a checkout session.
 *  3. A webhook marks weddings.plan / plan_expires_at on success.
 *
 * Until then it validates input and returns 501 so the UI can show
 * "coming soon" without failing silently.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PLANS } from "@/lib/plans";

const CheckoutSchema = z.object({
  eventId: z.string().uuid().optional(),
  plan: z.enum(["premium", "forever"]),
});

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = CheckoutSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Unknown plan." }, { status: 400 });

  console.info("[INFO] checkout requested (billing not configured)", { plan: parsed.data.plan });
  return NextResponse.json(
    {
      error: `${PLANS[parsed.data.plan].name} upgrades are coming soon. Everything is free while we're in early access.`,
      code: "BILLING_NOT_CONFIGURED",
    },
    { status: 501 }
  );
}
