"use client";

/**
 * StorybookRsvp — the wax-seal letter RSVP used by the Storybook collection.
 * It keeps the production contract of the classic RSVP (API, personal invite
 * limits, local replay protection and blessing hand-off) while matching the
 * paper-letter visual language of the static demos.
 */

import { useEffect, useMemo, useState } from "react";
import { Check, LoaderCircle, Lock } from "lucide-react";
import type { GiftAccount, GuestbookEntryRow } from "@/types/database";
import { useInvitationCopy } from "../sections/HeroParts";
import { readStored, storageKey, submitRsvp } from "../sections/RsvpSection";
import type { StorybookVariant } from "../styles";

type Choice = "attending" | "declined";

interface StorybookRsvpProps {
  variant: StorybookVariant;
  weddingId: string;
  coupleNames: [string, string];
  demo?: boolean;
  invitee?: { token: string; name: string; maxPartySize: number } | null;
  giftAccounts?: GiftAccount[];
  eyebrow: string;
  title: string;
  replyBy: string | null;
  onBlessing: (entry: GuestbookEntryRow) => void;
}

/** Two-letter monogram for the seal ("Mai & Anh" → "M&A"). */
function monogram(names: [string, string]): string {
  const initials = names
    .map((n) => n.trim().charAt(0).toUpperCase())
    .filter(Boolean);
  return initials.join("&") || "♥";
}

/** "Just me" / "Two of us" / "Four guests". */
function partyLabel(size: number): string {
  if (size === 1) return "Just me";
  if (size === 2) return "Two of us";
  return `${size} guests`;
}

export default function StorybookRsvp({
  variant,
  weddingId,
  coupleNames,
  demo = false,
  invitee = null,
  giftAccounts = [],
  eyebrow,
  title,
  replyBy,
  onBlessing,
}: StorybookRsvpProps) {
  const ui = useInvitationCopy();
  const t = ui.rsvp;
  const editorial = variant === "ivory" || variant === "lakeside" || variant === "ivory-veil";
  const maxParty = Math.max(1, invitee?.maxPartySize ?? 10);
  const attendingLabel = ui.lang === "en" ? (editorial ? "Joyfully accepts" : "With joy") : t.attendingSubtitle;
  const declinedLabel = ui.lang === "en" ? (editorial ? "Regretfully declines" : "With regret") : t.declinedSubtitle;
  const lede =
    replyBy && ui.lang === "en"
      ? editorial
        ? `Kindly reply by ${replyBy} so we can ${variant === "lakeside" ? "save your seat by the lake" : variant === "ivory-veil" ? "save your seat beneath the ivory veil" : "prepare your seat"}.`
        : `Please reply by ${replyBy} so we can save your seat${variant === "lantern" ? " by lantern light" : " in the garden"}.`
      : replyBy
        ? `Please reply by ${replyBy} so we can save your seat.`
        : "We would love to know if you can join us, and keep a few words from you.";
  const [choice, setChoice] = useState<Choice>("attending");
  const [name, setName] = useState(invitee?.name ?? "");
  const [partySize, setPartySize] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [petals, setPetals] = useState(0);

  const seal = useMemo(() => monogram(coupleNames), [coupleNames]);
  const attending = choice === "attending";
  const english = ui.lang === "en";
  const successTitle = english && !invitee && attending
    ? editorial ? "Thank you" : "Your reply is sealed"
    : attending ? t.successAttending : t.successDeclined;
  const successCopy = english && !invitee && attending
    ? editorial
      ? "Your reply has been noted. We cannot wait to celebrate with you."
      : `Your reply has been noted. We cannot wait to see you ${variant === "lantern" ? "by lantern light" : "in the garden"}.`
    : attending ? t.thanksAttending(name.trim() || "friend") : t.thanksDeclined(name.trim() || "friend");
  const blessingLabel = english
    ? attending ? "A note or blessing (optional)" : t.blessingPrompt
    : attending ? t.blessingOptional : t.blessingPrompt;
  const blessingPlaceholder = english
    ? "Leave a few words for the couple…"
    : attending ? t.attendingPlaceholder : t.declinedPlaceholder;

  useEffect(() => {
    if (demo) return;
    const stored = readStored(weddingId);
    if (!stored) return;
    setChoice(stored.choice);
    setName(stored.name);
    setStatus("done");
  }, [weddingId, demo]);

  /** Validates, submits and locally remembers the reply. */
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
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
          attending,
          partySize: attending ? Math.min(partySize, maxParty) : undefined,
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
          /* private mode — non-fatal */
        }
      }
      setPetals((n) => n + 1);
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : t.genericError);
    }
  }

  /** Re-opens the letter so the guest can change plans. */
  function reset() {
    setStatus("idle");
    setMessage("");
    setError(null);
  }

  return (
    <section className={`sb-section sb-rsvp ${editorial ? "sb-rsvp-editorial" : ""}`} id="rsvp">
      <div className="sb-reveal in">
        <div className="sb-section-head">
          <p className="sb-kicker">{eyebrow}</p>
          <h2 className="sb-title">{title}</h2>
          <div className="sb-ornament" aria-hidden="true" />
          <p className="sb-lede">{lede}</p>
        </div>

        <div className={editorial ? "sb-form-card" : "sb-letter"}>
          {!editorial && (
            <span className="sb-letter-seal" aria-hidden="true">
              {seal}
            </span>
          )}
          {status === "done" && petals > 0 && (
            <div className="sb-petal-burst" aria-hidden="true">
              {Array.from({ length: 14 }, (_, i) => (
                <i
                  key={`${petals}-${i}`}
                  style={
                    {
                      "--s": `${5 + (i % 4) * 2}px`,
                      "--x": `${Math.round((Math.sin(i * 2.4) * 120 + 0) * 10) / 10}px`,
                      "--y": `${-60 - (i % 6) * 24}px`,
                      "--r": `${i * 41}deg`,
                      "--d": `${1.1 + (i % 5) * 0.18}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          )}

          {status === "done" ? (
            <div className="sb-rsvp-success" role="status" aria-live="polite">
              <div className="sb-check" aria-hidden="true">
                <Check size={22} />
              </div>
              <h3>{successTitle}</h3>
              <p>{successCopy}</p>
              <button type="button" className="sb-rsvp-change" onClick={reset}>
                {t.changeReply}
              </button>
              {giftAccounts.length > 0 && attending && (
                <p className="sb-rsvp-invitee">
                  <Lock size={12} aria-hidden /> {giftAccounts.length} gift {giftAccounts.length === 1 ? "account is" : "accounts are"} listed below.
                </p>
              )}
            </div>
          ) : (
            <>
              {!editorial && (
                <div className="sb-letter-head">
                  <p className="sb-kicker">Your reply</p>
                  <h3 className="sb-title">A Note From You</h3>
                  <p>
                    {invitee
                      ? t.inviteeSubtitle(invitee.name, coupleNames.filter(Boolean).join(" & "), invitee.maxPartySize)
                      : t.subtitle(coupleNames.filter(Boolean).join(" & "))}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="sb-field">
                  <label id="sb-attend-label">{editorial ? "Your reply" : "Will you be there?"}</label>
                  <div className="sb-choice-grid" role="radiogroup" aria-labelledby="sb-attend-label">
                    <label className="sb-choice">
                      <input
                        type="radio"
                        name="attending"
                        value="attending"
                        checked={attending}
                        onChange={() => setChoice("attending")}
                      />
                      <span>{attendingLabel}</span>
                    </label>
                    <label className="sb-choice">
                      <input
                        type="radio"
                        name="attending"
                        value="declined"
                        checked={!attending}
                        onChange={() => setChoice("declined")}
                      />
                      <span>{declinedLabel}</span>
                    </label>
                  </div>
                </div>

                <div className="sb-field">
                  <label htmlFor="sb-name">Your name</label>
                  <input
                    id="sb-name"
                    className="sb-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    autoComplete="name"
                    placeholder="How should we call you?"
                    aria-invalid={!!error && !name.trim()}
                    required
                  />
                </div>

                {attending && (
                  <div className="sb-field">
                    <label htmlFor="sb-guests">Number of guests</label>
                    <select
                      id="sb-guests"
                      className="sb-select"
                      value={Math.min(partySize, maxParty)}
                      onChange={(e) => setPartySize(Number(e.target.value))}
                    >
                      {Array.from({ length: maxParty }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {partyLabel(n)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="sb-field">
                  <label htmlFor="sb-message">{blessingLabel}</label>
                  <textarea
                    id="sb-message"
                    className="sb-textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={1000}
                    rows={4}
                    placeholder={blessingPlaceholder}
                  />
                </div>

                {error && (
                  <p className="sb-rsvp-error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className={editorial ? "sb-submit" : "sb-seal-button"} disabled={status === "sending"}>
                  {status === "sending" && <LoaderCircle size={14} className="animate-spin" aria-hidden />}
                  {status === "sending" ? t.sending : editorial ? "Send reply" : attending ? "Seal & send" : t.sendLove}
                </button>
                <p className="sb-rsvp-note">
                  {demo ? "Design preview — no data is sent or stored." : "Your reply is private and shared only with the hosts."}
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
