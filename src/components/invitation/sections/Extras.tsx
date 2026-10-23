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
import type { GiftAccount, WeddingEventRow, WeddingRow } from "@/types/database";
import { Reveal, SectionHeading } from "./Primitives";
import { useEventCopy } from "./HeroParts";
import { type InvitationLang } from "../i18n";
import { alpha, formatLongDate, mix, type InvitationPalette } from "../utils";

export type { InvitationLang } from "../i18n";

/* ─── Language / Translations ────────────────────────────────────────────── */

/** All translatable strings used in the Extras components. */
interface Translations {
  weddingInvitation: string;
  invitation: (label: string) => string;
  theGroom: string;
  theBride: string;
  familyOf: (name: string, side?: number) => string;
  honouredByPresence: (names: string) => string;
  sendAGift: string;
  weddingGift: string;
  gifts: string;
  withGratitude: string;
  defaultGiftNote: string;
  copied: string;
  couldntCopy: string;
  /** Locale for Intl.DateTimeFormat. */
  dateLocale: string;
}

const TRANSLATIONS: Record<InvitationLang, Translations> = {
  en: {
    weddingInvitation: "Wedding Invitation",
    invitation: (label) => `${label} Invitation`,
    theGroom: "The Groom",
    theBride: "The Bride",
    familyOf: (name, _side) => `The family of ${name}`,
    honouredByPresence: (names) => `${names} would be honoured by your presence`,
    sendAGift: "Send a gift",
    weddingGift: "Wedding gift",
    gifts: "Gifts",
    withGratitude: "With gratitude",
    defaultGiftNote: "Your presence is the greatest gift. For those who wish to send their blessings from afar, you can do so here.",
    copied: "Copied",
    couldntCopy: "Couldn't copy, please select the number instead",
    dateLocale: "en-US",
  },
  vi: {
    weddingInvitation: "Trân Trọng Kính Mời",
    invitation: (label) => `Thiệp Mời ${label}`,
    theGroom: "Chú Rể",
    theBride: "Cô Dâu",
    familyOf: (_name, side) => (side === 1 ? "Nhà Gái" : "Nhà Trai"),
    honouredByPresence: () => "Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi",
    sendAGift: "Mừng Cưới",
    weddingGift: "Mừng Cưới",
    gifts: "Quà Tặng",
    withGratitude: "Lời Tri Ân",
    defaultGiftNote: "Sự hiện diện của quý khách là món quà lớn nhất dành cho gia đình chúng tôi. Quý khách có thể gửi lời chúc phúc qua mã QR bên dưới.",
    copied: "Đã sao chép",
    couldntCopy: "Không thể sao chép, vui lòng chọn số tài khoản",
    dateLocale: "vi-VN",
  },
};

/** Resolves translation strings for the given language. */
function t(lang: InvitationLang | undefined): Translations {
  return TRANSLATIONS[lang ?? "en"];
}

/**
 * Splits a parents string by common separators (· & ,) into individual lines.
 * "Mr. Zhang Hao & Mrs. Li Mei" → ["Mr. Zhang Hao", "Mrs. Li Mei"]
 */
function splitParents(value: string): string[] {
  return value.split(/\s*[·&,]\s*/).map((s) => s.trim()).filter(Boolean);
}

/* ─── Families ────────────────────────────────────────────────────────────── */

/** Two family columns under the hero; one column for single-host events. */
export function Families({ families, names, palette, lang }: { families: { side1?: string; side2?: string }; names: [string, string]; palette: InvitationPalette; lang?: InvitationLang }) {
  const { twoNames } = useEventCopy();
  const i18n = t(lang);
  const sides = [
    { name: names[0], parents: families.side1, side: 0 as number },
    ...(twoNames ? [{ name: names[1], parents: families.side2, side: 1 as number }] : []),
  ].filter((s) => s.parents);

  return (
    <section id="families" className="px-6 py-20 md:py-24" style={{ backgroundColor: palette.background }}>
      <Reveal className={`mx-auto grid max-w-3xl items-center gap-10 text-center ${sides.length > 1 ? "md:grid-cols-[1fr_auto_1fr]" : ""}`}>
        {sides.map((s, i) => (
          <div key={s.name + i} className={i === 1 ? "md:order-3" : ""}>
            <p className="text-[11px] uppercase tracking-[0.4em]" style={{ color: palette.primary }}>
              {i18n.familyOf(s.name, s.side)}
            </p>
            <div className="mt-3 space-y-1">
              {splitParents(s.parents!).map((line, j) => (
                <p key={j} className="text-xl leading-relaxed md:text-2xl" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
                  {line}
                </p>
              ))}
            </div>
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
function AccountCard({ account, palette, lang }: { account: GiftAccount; palette: InvitationPalette; lang?: InvitationLang }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const i18n = t(lang);

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
        {copied ? i18n.copied : failed ? i18n.couldntCopy : ""}
      </p>
    </div>
  );
}

/** Gift section: an optional note and one or two account cards. */
export function GiftSection({ gift, palette, lang }: { gift: { note?: string; accounts: GiftAccount[] }; palette: InvitationPalette; lang?: InvitationLang }) {
  const { eventType } = useEventCopy();
  const i18n = t(lang);
  const title = eventType === "wedding" ? i18n.weddingGift : i18n.gifts;
  return (
    <section id="gift" className="relative px-6 py-28 md:py-36" style={{ backgroundColor: palette.surface }}>
      <SectionHeading
        eyebrow={i18n.withGratitude}
        title={title}
        palette={palette}
        subtitle={gift.note ?? i18n.defaultGiftNote}
      />
      <Reveal className={`mx-auto grid max-w-3xl gap-6 ${gift.accounts.length > 1 ? "md:grid-cols-2" : "max-w-sm"}`}>
        {gift.accounts.map((a, i) => (
          <AccountCard key={`${a.label}-${i}`} account={a} palette={palette} lang={lang} />
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
 * Formats an event time string to a short time (e.g. "10:00 AM" or "10:00").
 */
function formatEventTime(value: string, locale: string): string {
  const d = new Date(value);
  return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
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
  events = [],
  lang,
}: {
  wedding: WeddingRow;
  families: { side1?: string; side2?: string } | null;
  palette: InvitationPalette;
  giftAccounts?: GiftAccount[];
  events?: WeddingEventRow[];
  lang?: InvitationLang;
}) {
  const { eventType, copy, twoNames } = useEventCopy();
  const i18n = t(lang);
  const names: [string, string] = [wedding.partner1_name, wedding.partner2_name];
  const coupleNames = names.filter(Boolean).join(" & ");
  const eventLabel = wedding.event_title || copy.label;

  const cardBg = palette.isDark ? mix(palette.background, "#ffffff", 0.06) : mix(palette.background, "#ffffff", 0.7);
  const border = alpha(palette.primary, 0.3);
  const ornamentColor = palette.primary;

  // Show only the first gift account QR in the card (full GiftSection shows all).
  const cardGift = giftAccounts.length > 0 ? giftAccounts[0] : null;

  // Events with a location — shown as destination cards for multi-venue weddings.
  const venueEvents = events.filter((e) => e.location);

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
            {eventType === "wedding" ? i18n.weddingInvitation : i18n.invitation(eventLabel)}
          </p>

          {/* Couple names with bride/groom labels */}
          {twoNames && eventType === "wedding" ? (
            <div className="mt-6 flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-[0.4em]" style={{ color: palette.inkMuted }}>{i18n.theGroom}</p>
                <p className="mt-1 text-3xl font-light md:text-4xl" style={{ fontFamily: palette.displayFont, color: palette.ink }}>{names[0]}</p>
              </div>
              <span className="text-3xl md:text-4xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>&amp;</span>
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-[0.4em]" style={{ color: palette.inkMuted }}>{i18n.theBride}</p>
                <p className="mt-1 text-3xl font-light md:text-4xl" style={{ fontFamily: palette.displayFont, color: palette.ink }}>{names[1]}</p>
              </div>
            </div>
          ) : (
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
          )}

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

          {/* Families — each parent on its own line */}
          {families && (families.side1 || families.side2) && (
            <div className={`mb-6 grid gap-6 ${families.side1 && families.side2 ? "md:grid-cols-[1fr_auto_1fr]" : ""}`}>
              {families.side1 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: palette.primary }}>
                    {i18n.familyOf(names[0], 0)}
                  </p>
                  <div className="mt-1 space-y-0.5">
                    {splitParents(families.side1).map((line, j) => (
                      <p key={j} className="text-base leading-relaxed" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
                        {line}
                      </p>
                    ))}
                  </div>
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
                    {i18n.familyOf(names[1], 1)}
                  </p>
                  <div className="mt-1 space-y-0.5">
                    {splitParents(families.side2).map((line, j) => (
                      <p key={j} className="text-base leading-relaxed" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Venues — multiple destinations for Vietnamese-style weddings */}
          {venueEvents.length > 0 ? (
            <div className={`grid gap-6 ${venueEvents.length > 1 ? "md:grid-cols-2" : ""}`}>
              {venueEvents.map((evt) => (
                <div key={evt.id} className="rounded-lg border p-4" style={{ borderColor: alpha(palette.primary, 0.2) }}>
                  <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: palette.primary }}>
                    {evt.title}
                  </p>
                  {evt.start_time && (
                    <p className="mt-2 text-sm font-medium" style={{ color: palette.ink }}>
                      {formatEventTime(evt.start_time, i18n.dateLocale)}
                      {wedding.wedding_date && ` · ${formatLongDate(wedding.wedding_date, null, i18n.dateLocale)}`}
                    </p>
                  )}
                  <p className="mt-1 text-sm" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
                    {evt.location}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Single venue fallback (original layout) */}
              {wedding.wedding_date && (
                <p className="text-base font-medium" style={{ color: palette.ink }}>
                  {formatLongDate(wedding.wedding_date, null, i18n.dateLocale)}
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
            </>
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
            {i18n.honouredByPresence(coupleNames)}
          </p>

          {/* Single gift QR code (first account only) */}
          {cardGift?.qrUrl && (
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-3 justify-center">
                <span className="h-px flex-1 max-w-[3rem]" style={{ background: alpha(palette.primary, 0.2) }} />
                <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: palette.inkMuted }}>
                  {i18n.sendAGift}
                </span>
                <span className="h-px flex-1 max-w-[3rem]" style={{ background: alpha(palette.primary, 0.2) }} />
              </div>
              <div className="mx-auto max-w-[10rem]">
                <div className="flex flex-col items-center gap-1 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cardGift.qrUrl} alt={`QR for ${cardGift.label}`} loading="lazy" className="h-24 w-24 bg-white object-contain p-1" style={{ borderRadius: 8 }} />
                  <p className="text-xs" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>{cardGift.label}</p>
                  {cardGift.bank && <p className="text-[9px] uppercase tracking-wider" style={{ color: palette.inkMuted }}>{cardGift.bank}</p>}
                </div>
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
