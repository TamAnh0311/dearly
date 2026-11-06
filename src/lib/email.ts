/**
 * Transactional email via Resend. No-ops gracefully when RESEND_API_KEY is
 * not configured, so the app works without an email provider during development.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Dearly <noreply@dearly.app>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/** Sends an email via Resend. Returns true on success, false on failure or when unconfigured. */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.info("[INFO] email skipped (RESEND_API_KEY not set)", { to, subject });
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[ERROR] email send failed", { to, subject, status: res.status, body });
      return false;
    }

    console.info("[INFO] email sent", { to, subject });
    return true;
  } catch (err) {
    console.error("[ERROR] email send threw", { to, subject, err });
    return false;
  }
}

/** Builds the HTML for an RSVP notification email to the host. */
export function rsvpNotificationHtml({
  guestName,
  attending,
  partySize,
  message,
  eventSlug,
}: {
  guestName: string;
  attending: boolean;
  partySize: number;
  message?: string;
  eventSlug: string;
}): string {
  const status = attending ? `coming (party of ${partySize})` : "can't make it";
  const messageBlock = message
    ? `<p style="margin-top:12px;padding:12px 16px;background:#f9f7f4;border-radius:8px;font-style:italic;color:#555;">&ldquo;${escapeHtml(message)}&rdquo;</p>`
    : "";

  return `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h2 style="color:#B8860B;margin:0 0 16px;">New RSVP</h2>
      <p style="margin:0;color:#333;">
        <strong>${escapeHtml(guestName)}</strong> replied — ${status}.
      </p>
      ${messageBlock}
      <p style="margin-top:20px;">
        <a href="https://dearly-self.vercel.app/dashboard/rsvps" style="display:inline-block;padding:10px 20px;background:#B8860B;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
          View all RSVPs
        </a>
      </p>
      <p style="margin-top:24px;font-size:12px;color:#999;">
        This notification was sent because a guest replied to your ${escapeHtml(eventSlug)} invitation on Dearly.
      </p>
    </div>
  `;
}

/** Escapes HTML entities in user-supplied strings. */
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
