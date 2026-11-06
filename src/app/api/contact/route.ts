/**
 * Contact form API — sends the message to the Dearly support inbox.
 * Uses Resend when configured; falls back to logging when it isn't.
 *
 * POST body: { name, email, message }
 * Responses: 200, 400 validation, 429 rate limited, 500.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().email("Please enter a valid email"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "hello@dearly.app";

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }
  const { name, email, message } = parsed.data;

  const wait = await checkRateLimit(`contact:${clientIp(request)}`, 2, 10 * 60 * 1000);
  if (wait > 0) {
    return NextResponse.json({ error: "Please wait a few minutes before sending another message." }, { status: 429 });
  }

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px;padding:24px;">
      <h2 style="color:#B8860B;margin:0 0 16px;">New contact message</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p style="margin-top:12px;padding:12px 16px;background:#f9f7f4;border-radius:8px;white-space:pre-wrap;">${message}</p>
      <p style="margin-top:16px;font-size:12px;color:#999;">Reply directly to this email to respond to ${name}.</p>
    </div>
  `;

  const sent = await sendEmail({
    to: SUPPORT_EMAIL,
    subject: `[Dearly Contact] ${name}`,
    html,
  });

  if (!sent) {
    console.info("[INFO] contact form submitted (email not configured)", { name, email });
  }

  return NextResponse.json({ ok: true });
}
