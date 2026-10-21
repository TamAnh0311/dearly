"use client";

/**
 * Extras common on East Asian invitations (usable by every template):
 *  - Families          the hosts' parents, side by side ("Nhà trai · Nhà gái", 혼주)
 *  - Gift              bank account(s) and/or payment QR for monetary gifts
 *                      (red envelope 红包, 축의금, mừng cưới), with copy-to-clipboard.
 *  - InvitationCard    formal card with event name, couple names, families and QR code
 *                      (lantern-night and other East Asian templates).
 * Data comes from src/lib/invitation-extras.ts.
 */

import { useState } from "react";
import { Check, Copy, Gift as GiftIcon } from "lucide-react";
import type { GiftAccount, WeddingRow } from "@/types/database";
import { Reveal, SectionHeading } from "./Primitives";
import { useEventCopy } from "./HeroParts";
import { alpha, formatLongDate, mix, type InvitationPalette } from "../utils";

/* ─── Families ────────────────────────────────────────────────────────────── */

/** Two family columns under the hero; one column for single-host events. */
export function Families({ families, names, palette }: { families: { side1?: string; side2?: string }; names: [string, string]; palette: InvitationPalette }) {
  const { twoNames } = useEventCopy();
  const sides = [
    { name: names[0], parents: families.side1 },
    ...(twoNames ? [{ name: names[1], parents: families.side2 }] : []),
  ].filter((s) => s.parents);

  return (
    <section id="families" className="px-6 py-20 md:py-24" style={{ backgroundColor: palette.background }}>
      <Reveal className={`mx-auto grid max-w-3xl items-center gap-10 text-center ${sides.length > 1 ? "md:grid-cols-[1fr_auto_1fr]" : ""}`}>
        {sides.map((s, i) => (
          <div key={s.name + i} className={i === 1 ? "md:order-3" : ""}>
            <p className="text-[11px] uppercase tracking-[0.4em]" style={{ color: palette.primary }}>
              The family of {s.name}
            </p>
            <p className="mt-3 text-xl leading-relaxed md:text-2xl" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
              {s.parents}
            </p>
          </div>
        ))}
        {sides.length > 1 && (
          <span className="text-4xl md:order-2" style={{ fontFamily: palette.scriptFont, color: palette.primary }} aria-hidden>
            &amp;
          </span>
        )}
      </Reveal>
    </section>
  );
}

/* ─── Gift ────────────────────────────────────────────────────────────────── */

/** One account card: label, bank, holder, number (copyable) and optional QR. */
function AccountCard({ account, palette }: { account: GiftAccount; palette: InvitationPalette }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  /** Copies the account number; shows a fallback hint if the browser blocks it. */
  async function copy() {
    if (!account.number) return;
    try {
      await navigator.clipboard.writeText(account.number.replace(/\s+/g, ""));
      setCopied(true);
      setFailed(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setFailed(true);
    }
  }

  return (
    <div
      className="flex flex-col items-center gap-3 border p-6 text-center"
      style={{ borderRadius: palette.radius.card, borderColor: alpha(palette.primary, 0.25), background: palette.isDark ? mix(palette.background, "#ffffff", 0.05) : mix(palette.background, "#ffffff", 0.65) }}
    >
      <p className="text-2xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
        {account.label}
      </p>
      {account.qrUrl && (
        // Couple-provided QR image (validated https URL); next/image would need every host whitelisted.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={account.qrUrl} alt={`Payment QR code for ${account.label}`} loading="lazy" className="h-44 w-44 bg-white object-contain p-2" style={{ borderRadius: palette.radius.sm === "2px" ? 2 : 12 }} />
      )}
      {account.bank && (
        <p className="text-xs uppercase tracking-[0.3em]" style={{ color: palette.inkMuted }}>
          {account.bank}
        </p>
      )}
      {account.holder && (
        <p className="text-base" style={{ color: palette.ink }}>
          {account.holder}
        </p>
      )}
      {account.number && (
        <button
          type="button"
          onClick={copy}
          className="mt-1 inline-flex items-center gap-2 border px-4 py-2 font-mono text-base tracking-wider transition hover:-translate-y-0.5"
          style={{ borderRadius: palette.radius.sm, borderColor: alpha(palette.primary, 0.4), color: palette.ink }}
          aria-label={`Copy account number ${account.number}`}
        >
          {account.number}
          {copied ? <Check size={16} style={{ color: palette.primary }} /> : <Copy size={16} style={{ color: palette.primary }} />}
        </button>
      )}
      <p className="h-4 text-xs" style={{ color: palette.inkMuted }} aria-live="polite">
        {copied ? "Copied" : failed ? "Couldn't copy, please select the number instead" : ""}
      </p>
    </div>
  );
}

/** Gift section: an optional note and one or two account cards. */
export function GiftSection({ gift, palette }: { gift: { note?: string; accounts: GiftAccount[] }; palette: InvitationPalette }) {
  const { eventType } = useEventCopy();
  const title = eventType === "wedding" ? "Wedding gift" : "Gifts";
  return (
    <section id="gift" className="relative px-6 py-28 md:py-36" style={{ backgroundColor: palette.surface }}>
      <SectionHeading
        eyebrow="With gratitude"
        title={title}
        palette={palette}
        subtitle={gift.note ?? "Your presence is the greatest gift. For those who wish to send their blessings from afar, you can do so here."}
      />
      <Reveal className={`mx-auto grid max-w-3xl gap-6 ${gift.accounts.length > 1 ? "md:grid-cols-2" : "max-w-sm"}`}>
        {gift.accounts.map((a, i) => (
          <AccountCard key={`${a.label}-${i}`} account={a} palette={palette} />
        ))}
      </Reveal>
      <div className="mt-10 flex justify-center" aria-hidden>
        <GiftIcon size={22} style={{ color: alpha(palette.primary, 0.6) }} />
      </div>
    </section>
  );
}

/* ─── Invitation Card ────────────────────────────────────────────────────── */

/** Cloud ornament for the card top/bottom borders. */
function CloudOrnament({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 20" className="w-full" preserveAspectRatio="none" aria-hidden>
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i} cx={10 + i * 20} cy={10} r={10} fill={color} opacity={0.12 + (i % 3) * 0.04} />
      ))}
    </svg>
  );
}

/**
 * Formal invitation card: event name, couple names, families, date, venue
 * and a QR code linking to the invitation URL. Designed for lantern-night
 * and other East Asian templates where a traditional card layout is expected.
 */
export function InvitationCard({
  wedding,
  families,
  palette,
  giftAccounts = [],
}: {
  wedding: WeddingRow;
  families: { side1?: string; side2?: string } | null;
  palette: InvitationPalette;
  giftAccounts?: GiftAccount[];
}) {
  const { eventType, copy, twoNames } = useEventCopy();
  const names: [string, string] = [wedding.partner1_name, wedding.partner2_name];
  const coupleNames = names.filter(Boolean).join(" & ");
  const eventLabel = wedding.event_title || copy.label;

  const cardBg = palette.isDark ? mix(palette.background, "#ffffff", 0.06) : mix(palette.background, "#ffffff", 0.7);
  const border = alpha(palette.primary, 0.3);
  const ornamentColor = palette.primary;

  return (
    <section id="invitation-card" className="relative px-6 py-20 md:py-28" style={{ backgroundColor: palette.background }}>
      <Reveal className="mx-auto max-w-lg">
        <div
          className="relative overflow-hidden border px-8 py-12 text-center md:px-14 md:py-16"
          style={{
            borderRadius: palette.radius.lg,
            borderColor: border,
            background: cardBg,
            boxShadow: `0 24px 60px -20px ${alpha(palette.primary, 0.2)}`,
          }}
        >
          {/* Inner decorative border */}
          <div
            className="pointer-events-none absolute inset-3 rounded-lg border"
            style={{ borderColor: alpha(palette.primary, 0.15) }}
            aria-hidden
          />

          {/* Top ornament */}
          <CloudOrnament color={ornamentColor} />

          {/* Event label */}
          <p className="mt-6 text-[10px] uppercase tracking-[0.5em]" style={{ color: palette.inkMuted }}>
            {eventType === "wedding" ? "Wedding Invitation" : `${eventLabel} Invitation`}
          </p>

          {/* Couple names */}
          <h2 className="mt-6 text-4xl font-light leading-tight md:text-5xl" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
            {names[0]}
            {twoNames && (
              <>
                <span className="mx-2 inline-block text-3xl md:text-4xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
                  &amp;
                </span>
                {names[1]}
              </>
            )}
          </h2>

          {/* Tagline */}
          <p className="mt-3 text-lg" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
            {wedding.event_title || copy.tagline(names[0])}
          </p>

          {/* Divider */}
          <div className="mx-auto my-6 flex items-center gap-3">
            <span className="h-px flex-1" style={{ background: alpha(palette.primary, 0.25) }} />
            <span className="text-sm" style={{ color: palette.primary }}>&#10022;</span>
            <span className="h-px flex-1" style={{ background: alpha(palette.primary, 0.25) }} />
          </div>

          {/* Families */}
          {families && (families.side1 || families.side2) && (
            <div className={`mb-6 grid gap-6 ${families.side1 && families.side2 ? "md:grid-cols-[1fr_auto_1fr]" : ""}`}>
              {families.side1 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: palette.primary }}>
                    The family of {names[0]}
                  </p>
                  <p className="mt-1 text-base leading-relaxed" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
                    {families.side1}
                  </p>
                </div>
              )}
              {families.side1 && families.side2 && (
                <span className="hidden text-2xl md:block" style={{ fontFamily: palette.scriptFont, color: palette.primary }} aria-hidden>
                  &amp;
                </span>
              )}
              {families.side2 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: palette.primary }}>
                    The family of {names[1]}
                  </p>
                  <p className="mt-1 text-base leading-relaxed" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
                    {families.side2}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Date & venue */}
          {wedding.wedding_date && (
            <p className="text-base font-medium" style={{ color: palette.ink }}>
              {formatLongDate(wedding.wedding_date)}
            </p>
          )}
          {wedding.venue_name && (
            <p className="mt-2 text-sm" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
              {wedding.venue_name}
            </p>
          )}
          {wedding.venue_address && (
            <p className="mt-1 text-xs" style={{ color: palette.inkMuted }}>
              {wedding.venue_address}
            </p>
          )}

          {/* Story excerpt */}
          {wedding.story_text && (
            <>
              <div className="mx-auto my-6 flex items-center gap-3">
                <span className="h-px flex-1" style={{ background: alpha(palette.primary, 0.2) }} />
                <span className="text-sm" style={{ color: palette.primary }}>&#10022;</span>
                <span className="h-px flex-1" style={{ background: alpha(palette.primary, 0.2) }} />
              </div>
              <p className="mx-auto max-w-sm text-sm italic leading-relaxed" style={{ color: palette.inkMuted }}>
                &ldquo;{wedding.story_text.replace(/\s+/g, " ").trim().slice(0, 160).trimEnd()}{wedding.story_text.length > 160 ? "…" : ""}&rdquo;
              </p>
            </>
          )}

          {/* RSVP prompt */}
          <div className="mx-auto my-6 flex items-center gap-3">
            <span className="h-px flex-1" style={{ background: alpha(palette.primary, 0.2) }} />
            <span className="text-sm" style={{ color: palette.primary }}>&#10022;</span>
            <span className="h-px flex-1" style={{ background: alpha(palette.primary, 0.2) }} />
          </div>
          <p className="text-xs uppercase tracking-[0.35em]" style={{ color: palette.inkMuted }}>
            {copy.rsvpEyebrow}
          </p>
          <p className="mt-1 text-lg" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
            {coupleNames} would be honoured by your presence
          </p>

          {/* Gift QR codes */}
          {giftAccounts.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-3 justify-center">
                <span className="h-px flex-1 max-w-[3rem]" style={{ background: alpha(palette.primary, 0.2) }} />
                <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: palette.inkMuted }}>
                  Send a gift
                </span>
                <span className="h-px flex-1 max-w-[3rem]" style={{ background: alpha(palette.primary, 0.2) }} />
              </div>
              <div className={`mx-auto grid gap-4 ${giftAccounts.length > 1 ? "max-w-sm grid-cols-2" : "max-w-[10rem]"}`}>
                {giftAccounts.map((a, i) => (
                  <div key={`${a.label}-${i}`} className="flex flex-col items-center gap-1 text-center">
                    {a.qrUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.qrUrl} alt={`QR for ${a.label}`} loading="lazy" className="h-24 w-24 bg-white object-contain p-1" style={{ borderRadius: 8 }} />
                    )}
                    <p className="text-xs" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>{a.label}</p>
                    {a.bank && <p className="text-[9px] uppercase tracking-wider" style={{ color: palette.inkMuted }}>{a.bank}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom ornament */}
          <div className="mt-8">
            <CloudOrnament color={ornamentColor} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
