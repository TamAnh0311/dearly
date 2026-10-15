"use client";

/**
 * Extras common on East Asian invitations (usable by every template):
 *  - Families  the hosts' parents, side by side ("Nhà trai · Nhà gái", 혼주)
 *  - Gift      bank account(s) and/or payment QR for monetary gifts
 *              (red envelope 红包, 축의금, mừng cưới), with copy-to-clipboard.
 * Both read already-validated data from src/lib/invitation-extras.ts.
 */

import { useState } from "react";
import { Check, Copy, Gift as GiftIcon } from "lucide-react";
import type { GiftAccount } from "@/types/database";
import { Reveal, SectionHeading } from "./Primitives";
import { useEventCopy } from "./HeroParts";
import { alpha, mix, type InvitationPalette } from "../utils";

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
