/**
 * HTML email template builders for automated emails.
 * All templates are pre-designed — no host customisation.
 */

/** Escapes HTML entities. */
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Shared email wrapper with Dearly branding. */
function wrap(body: string): string {
  return `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;">${body}<p style="margin-top:32px;font-size:11px;color:#999;text-align:center;">Sent by <a href="https://dearly-self.vercel.app" style="color:#B8860B;">Dearly</a></p></div>`;
}

/** CTA button. */
function btn(text: string, url: string): string {
  return `<a href="${esc(url)}" style="display:inline-block;padding:12px 24px;background:#B8860B;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">${esc(text)}</a>`;
}

export function rsvpReminderHtml(p: { guestName: string; eventName: string; eventDate: string; rsvpUrl: string }): string {
  return wrap(`
    <h2 style="color:#B8860B;margin:0 0 16px;">You're invited!</h2>
    <p style="color:#333;">Hi ${esc(p.guestName)},</p>
    <p style="color:#333;">Just a friendly reminder — <strong>${esc(p.eventName)}</strong> is on <strong>${esc(p.eventDate)}</strong> and we'd love to know if you can make it.</p>
    <p style="margin-top:20px;">${btn("RSVP now", p.rsvpUrl)}</p>
  `);
}

export function weeklyDigestHtml(p: { eventName: string; attending: number; declined: number; blessings: number; photos: number; totalGuests: number }): string {
  return wrap(`
    <h2 style="color:#B8860B;margin:0 0 16px;">Weekly update — ${esc(p.eventName)}</h2>
    <p style="color:#333;">Here's what happened this week:</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#555;">New RSVPs (attending)</td><td style="padding:8px 0;font-weight:bold;text-align:right;color:#333;">${p.attending}</td></tr>
      <tr><td style="padding:8px 0;color:#555;">New RSVPs (declined)</td><td style="padding:8px 0;font-weight:bold;text-align:right;color:#333;">${p.declined}</td></tr>
      <tr><td style="padding:8px 0;color:#555;">New blessings</td><td style="padding:8px 0;font-weight:bold;text-align:right;color:#333;">${p.blessings}</td></tr>
      <tr><td style="padding:8px 0;color:#555;">New photos</td><td style="padding:8px 0;font-weight:bold;text-align:right;color:#333;">${p.photos}</td></tr>
      <tr style="border-top:1px solid #eee;"><td style="padding:8px 0;color:#555;">Total guests</td><td style="padding:8px 0;font-weight:bold;text-align:right;color:#333;">${p.totalGuests}</td></tr>
    </table>
    <p style="margin-top:20px;">${btn("View dashboard", "https://dearly-self.vercel.app/dashboard")}</p>
  `);
}

export function thankYouHtml(p: { guestName: string; eventName: string; memoryUrl: string }): string {
  return wrap(`
    <h2 style="color:#B8860B;margin:0 0 16px;">Thank you!</h2>
    <p style="color:#333;">Dear ${esc(p.guestName)},</p>
    <p style="color:#333;">Thank you for being part of <strong>${esc(p.eventName)}</strong>. It meant the world to have you there.</p>
    <p style="color:#333;">Relive the memories — photos and blessings are waiting for you:</p>
    <p style="margin-top:20px;">${btn("View memories", p.memoryUrl)}</p>
  `);
}
