"use client";

/**
 * RSVP — the invitation's call to action. Guests choose "I'll be there" or
 * "Can't make it", then leave their name, party size and an optional
 * blessing. Successful submissions trigger a celebration burst and the
 * blessing is handed to the parent so it appears on the blessing wall.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Heart, HeartHandshake, LoaderCircle, Minus, PartyPopper, Plus, QrCode, Send } from "lucide-react";
import type { GiftAccount, GuestbookEntryRow } from "@/types/database";
import { CelebrationBurst } from "../effects/Particles";
import { Reveal, SectionHeading } from "./Primitives";
import ArtSpray from "./ArtSpray";
import { useInvitationCopy } from "./HeroParts";
import { EASE_OUT, alpha, mix, type InvitationPalette } from "../utils";
import type { InvitationCopy } from "../i18n";

type Choice = "attending" | "declined";

export interface StoredRsvp {
  choice: Choice;
  name: string;
}

interface RsvpSectionProps {
  weddingId: string;
  coupleNames: [string, string];
  /** Event-specific headings (defaults are wedding wording). */
  eyebrow?: string;
  title?: string;
  /** Personal invitation from the guest list: prefilled name + seat limit. */
  invitee?: { token: string; name: string; maxPartySize: number } | null;
  palette: InvitationPalette;
  /** When true, submissions are simulated locally (template previews). */
  demo?: boolean;
  onBlessing: (entry: GuestbookEntryRow) => void;
  /** Optional gift accounts (QR code / payment link) shown after submission. */
  giftAccounts?: GiftAccount[];
}

/** localStorage key remembering this browser's RSVP for a wedding. */
export const storageKey = (weddingId: string) => `dearly-rsvp-${weddingId}`;

/** Reads a previously stored RSVP; tolerates missing/corrupt storage. */
export function readStored(weddingId: string): StoredRsvp | null {
  try {
    const raw = window.localStorage.getItem(storageKey(weddingId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredRsvp;
    return parsed.choice === "attending" || parsed.choice === "declined" ? parsed : null;
  } catch {
    return null;
  }
}

/** Sends the RSVP to the API (or simulates it in demo mode). */
export async function submitRsvp(
  payload: { weddingId: string; guestName: string; attending: boolean; partySize?: number; message?: string; inviteeToken?: string },
  demo: boolean,
  ui: InvitationCopy
): Promise<GuestbookEntryRow | null> {
  if (demo) {
    await new Promise((r) => setTimeout(r, 700));
    return payload.message
      ? {
          id: `demo-${Date.now()}`,
          wedding_id: payload.weddingId,
          guest_name: payload.guestName,
          message: payload.message,
          rsvp_status: payload.attending ? "attending" : "declined",
          created_at: new Date().toISOString(),
        }
      : null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string; blessing?: GuestbookEntryRow | null };
    if (!res.ok) throw new Error(data.error ?? ui.rsvp.genericError);
    return data.blessing ?? null;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(ui.rsvp.timeoutError);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/** Large choice card used for the two RSVP options. */
function ChoiceButton({
  active,
  icon,
  title,
  subtitle,
  onClick,
  palette,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  palette: InvitationPalette;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex flex-1 flex-col items-center gap-3 overflow-hidden border px-6 py-8 text-center transition-colors"
      style={{
        borderRadius: palette.radius.card,
        borderColor: active ? palette.primary : alpha(palette.primary, 0.25),
        backgroundColor: active ? palette.primary : alpha("#ffffff", palette.isDark ? 0.03 : 0.6),
        color: active ? palette.background : palette.ink,
        boxShadow: active ? `0 24px 50px -20px ${alpha(palette.primary, 0.7)}` : "none",
      }}
    >
      <span className="transition-transform duration-500 group-hover:scale-110">{icon}</span>
      <span className="text-xl md:text-2xl" style={{ fontFamily: palette.displayFont }}>
        {title}
      </span>
      <span className="text-xs uppercase tracking-[0.2em] opacity-75">{subtitle}</span>
    </motion.button>
  );
}

/** Compact inline gift card shown after a successful RSVP. */
function GiftInlineCard({ account, palette }: { account: GiftAccount; palette: InvitationPalette }) {
  const ui = useInvitationCopy();
  const [copied, setCopied] = useState(false);

  /** Copies the account number to the clipboard. */
  async function handleCopy() {
    if (!account.number) return;
    try {
      await navigator.clipboard.writeText(account.number.replace(/\s+/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* private mode or unsupported — non-fatal */
    }
  }

  return (
    <div
      className="flex flex-col items-center gap-2 border p-4 text-center"
      style={{ borderRadius: palette.radius.card, borderColor: alpha(palette.primary, 0.2), background: palette.isDark ? mix(palette.background, "#ffffff", 0.04) : mix(palette.background, "#ffffff", 0.6) }}
    >
      <p className="text-lg" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
        {account.label}
      </p>
      {account.qrUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={account.qrUrl} alt={ui.rsvp.qrAlt(account.label)} loading="lazy" className="h-36 w-36 bg-white object-contain p-1.5" style={{ borderRadius: palette.radius.sm === "2px" ? 2 : 10 }} />
      )}
      {account.bank && (
        <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: palette.inkMuted }}>{account.bank}</p>
      )}
      {account.holder && (
        <p className="text-sm" style={{ color: palette.ink }}>{account.holder}</p>
      )}
      {account.number && (
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-sm tracking-wider transition hover:-translate-y-0.5"
          style={{ borderRadius: palette.radius.sm, borderColor: alpha(palette.primary, 0.35), color: palette.ink }}
          aria-label={ui.rsvp.copyAccount(account.number)}
        >
          {account.number}
          {copied ? <Check size={14} style={{ color: palette.primary }} /> : <Copy size={14} style={{ color: palette.primary }} />}
        </button>
      )}
    </div>
  );
}

/** Gift accounts section shown inline after a successful blessing. */
function GiftInline({ accounts, palette }: { accounts: GiftAccount[]; palette: InvitationPalette }) {
  const ui = useInvitationCopy();
  return (
    <motion.div
      className="mt-8 w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      <div className="mb-4 flex items-center gap-3 justify-center">
        <span className="h-px flex-1 max-w-[4rem]" style={{ background: alpha(palette.primary, 0.25) }} />
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em]" style={{ color: palette.inkMuted }}>
          <QrCode size={14} style={{ color: palette.primary }} /> {ui.rsvp.sendGift}
        </span>
        <span className="h-px flex-1 max-w-[4rem]" style={{ background: alpha(palette.primary, 0.25) }} />
      </div>
      <div className={`mx-auto grid gap-4 ${accounts.length > 1 ? "max-w-lg grid-cols-2" : "max-w-xs"}`}>
        {accounts.map((a, i) => (
          <GiftInlineCard key={`${a.label}-${i}`} account={a} palette={palette} />
        ))}
      </div>
    </motion.div>
  );
}

export default function RsvpSection({
  weddingId,
  coupleNames,
  palette,
  demo = false,
  onBlessing,
  eyebrow: eyebrowProp,
  title: titleProp,
  invitee = null,
  giftAccounts = [],
}: RsvpSectionProps) {
  const ui = useInvitationCopy();
  const t = ui.rsvp;
  const eyebrow = eyebrowProp ?? ui.nav.rsvp;
  const title = titleProp ?? ui.nav.rsvp;
  const maxParty = invitee?.maxPartySize ?? 10;
  const [choice, setChoice] = useState<Choice | null>(null);
  const [name, setName] = useState(invitee?.name ?? "");
  const [partySize, setPartySize] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [burstKey, setBurstKey] = useState(0);

  // Restore a previous answer from this browser.
  useEffect(() => {
    if (demo) return;
    const stored = readStored(weddingId);
    if (stored) {
      setChoice(stored.choice);
      setName(stored.name);
      setStatus("done");
    }
  }, [weddingId, demo]);

  /** Validates and submits the form. */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!choice) return;
    const guestName = name.trim();
    if (!guestName) {
      setError(t.nameError);
      return;
    }
    setError(null);
    setStatus("sending");
    try {
      const blessing = await submitRsvp(
        {
          weddingId,
          guestName,
          attending: choice === "attending",
          partySize: choice === "attending" ? Math.min(partySize, maxParty) : undefined,
          inviteeToken: invitee?.token,
          message: message.trim() || undefined,
        },
        demo,
        ui
      );
      if (blessing) onBlessing(blessing);
      if (!demo) {
        try {
          window.localStorage.setItem(storageKey(weddingId), JSON.stringify({ choice, name: guestName }));
        } catch {
          /* storage unavailable (private mode) — non-fatal */
        }
      }
      setStatus("done");
      setBurstKey((k) => k + 1);
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : t.genericError);
    }
  }

  /** Lets the guest answer again (e.g. plans changed). */
  function reset() {
    setStatus("idle");
    setMessage("");
    setError(null);
  }

  const attending = choice === "attending";
  const inputStyle = {
    borderColor: alpha(palette.primary, 0.3),
    backgroundColor: alpha("#ffffff", palette.isDark ? 0.04 : 0.75),
    color: palette.ink,
    borderRadius: palette.style.corners === "sharp" ? "2px" : "1rem",
    "--tw-ring-color": alpha(palette.primary, 0.35),
  } as React.CSSProperties;

  return (
    <section id="rsvp" className="relative overflow-hidden px-6 py-28 md:py-36" style={{ backgroundColor: palette.background }}>
      {burstKey > 0 && <CelebrationBurst key={burstKey} colors={[palette.primary, ...palette.petals]} />}

      <ArtSpray palette={palette} asset="peony" className="-right-14 top-20 hidden w-64 lg:block xl:w-80" rotate={-6} opacity={0.6} />

      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        palette={palette}
        subtitle={
          invitee
            ? t.inviteeSubtitle(invitee.name, coupleNames.filter(Boolean).join(" & "), invitee.maxPartySize)
            : t.subtitle(coupleNames.filter(Boolean).join(" & "))
        }
      />

      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          {status === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="border px-8 py-14 text-center"
              style={{ borderRadius: palette.radius.lg, borderColor: alpha(palette.primary, 0.3), backgroundColor: alpha(palette.primary, 0.06) }}
              role="status"
            >
              <motion.div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: palette.primary, color: palette.background }}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
              >
                {attending ? <PartyPopper size={34} /> : <Heart size={34} fill="currentColor" />}
              </motion.div>
              <p className="mt-6 text-4xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
                {attending ? t.successAttending : t.successDeclined}
              </p>
              <p className="mx-auto mt-3 max-w-md leading-relaxed" style={{ color: palette.inkMuted }}>
                {attending ? t.thanksAttending(name) : t.thanksDeclined(name)}
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-8 text-xs uppercase tracking-[0.25em] underline-offset-4 hover:underline"
                style={{ color: palette.primary }}
              >
                {t.changeReply}
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              noValidate
            >
              <Reveal className="flex flex-col gap-4 sm:flex-row">
                <ChoiceButton
                  active={choice === "attending"}
                  onClick={() => setChoice("attending")}
                  icon={<PartyPopper size={30} />}
                  title={t.attendingTitle}
                  subtitle={t.attendingSubtitle}
                  palette={palette}
                />
                <ChoiceButton
                  active={choice === "declined"}
                  onClick={() => setChoice("declined")}
                  icon={<HeartHandshake size={30} />}
                  title={t.declinedTitle}
                  subtitle={t.declinedSubtitle}
                  palette={palette}
                />
              </Reveal>

              {giftAccounts.length > 0 && <GiftInline accounts={giftAccounts} palette={palette} />}

              <AnimatePresence initial={false}>
                {choice && (
                  <motion.div
                    key="fields"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-5 pt-8">
                      <label className="block">
                        <span className="mb-2 block text-xs uppercase tracking-[0.25em]" style={{ color: palette.inkMuted }}>
                          {t.yourName}
                        </span>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          maxLength={100}
                          required
                          autoComplete="name"
                          placeholder={t.namePlaceholder}
                          className="w-full border px-5 py-4 text-base outline-none transition focus:ring-2"
                          style={inputStyle}
                        />
                      </label>

                      {attending && (
                        <div>
                          <span className="mb-2 block text-xs uppercase tracking-[0.25em]" style={{ color: palette.inkMuted }}>
                            {t.guests}
                          </span>
                          <div className="inline-flex items-center gap-4 border px-3 py-2" style={inputStyle}>
                            <button
                              type="button"
                              aria-label={t.fewerGuests}
                              onClick={() => setPartySize((n) => Math.max(1, n - 1))}
                              className="rounded-full p-2 transition hover:opacity-70 disabled:opacity-30"
                              disabled={partySize <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center text-xl tabular-nums" style={{ fontFamily: palette.displayFont }} aria-live="polite">
                              {partySize}
                            </span>
                            <button
                              type="button"
                              aria-label={t.moreGuests}
                              onClick={() => setPartySize((n) => Math.min(maxParty, n + 1))}
                              className="rounded-full p-2 transition hover:opacity-70 disabled:opacity-30"
                              disabled={partySize >= maxParty}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      )}

                      <label className="block">
                        <span className="mb-2 block text-xs uppercase tracking-[0.25em]" style={{ color: palette.inkMuted }}>
                          {attending ? t.blessingOptional : t.blessingPrompt}
                        </span>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          maxLength={1000}
                          rows={4}
                          placeholder={attending ? t.attendingPlaceholder : t.declinedPlaceholder}
                          className="w-full resize-none border px-5 py-4 text-base outline-none transition focus:ring-2"
                          style={inputStyle}
                        />
                        <span className="mt-1 block text-right text-[11px]" style={{ color: palette.inkMuted }}>
                          {message.length}/1000 · {t.charCount}
                        </span>
                      </label>

                      {error && (
                        <p role="alert" className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#b91c1c" }}>
                          {error}
                        </p>
                      )}

                      <motion.button
                        type="submit"
                        disabled={status === "sending"}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-center gap-2 px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] disabled:opacity-60"
                        style={{
                          borderRadius: palette.style.corners === "sharp" ? "2px" : palette.style.corners === "pill" ? "999px" : "1rem",
                          backgroundColor: palette.primary,
                          color: palette.background,
                          boxShadow: `0 20px 40px -18px ${alpha(palette.primary, 0.8)}`,
                        }}
                      >
                        {status === "sending" ? (
                          <LoaderCircle size={18} className="animate-spin" />
                        ) : (
                          <Send size={16} />
                        )}
                        {status === "sending" ? t.sending : attending ? t.sendRsvp : t.sendLove}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
