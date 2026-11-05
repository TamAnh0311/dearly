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

/** "Just me" / "Two of us" / "Four guests" — localised. */
function partyLabel(size: number, lang: string): string {
  if (lang === "vi") {
    if (size === 1) return "Chỉ mình tôi";
    return `${size} khách`;
  }
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
    replyBy && ui.lang === "vi"
      ? `Vui l\u00f2ng x\u00e1c nh\u1eadn tham d\u1ef1 tr\u01b0\u1edbc ng\u00e0y ${replyBy} \u0111\u1ec3 ch\u00fang t\u00f4i c\u00f3 th\u1ec3 chu\u1ea9n b\u1ecb \u0111\u00f3n ti\u1ebfp Qu\u00fd kh\u00e1ch \u0111\u01b0\u1ee3c chu \u0111\u00e1o nh\u1ea5t.`
      : replyBy && ui.lang === "en"
        ? editorial
          ? `Kindly reply by ${replyBy} so we can ${variant === "lakeside" ? "save your seat by the lake" : variant === "ivory-veil" ? "save your seat beneath the ivory veil" : "prepare your seat"}.`
          : `Please reply by ${replyBy} so we can save your seat${variant === "lantern" ? " by lantern light" : " in the garden"}.`
        : replyBy
          ? `Please reply by ${replyBy} so we can save your seat.`
          : ui.lang === "vi"
            ? "S\u1ef1 hi\u1ec7n di\u1ec7n c\u1ee7a qu\u00fd kh\u00e1ch l\u00e0 ni\u1ec1m vui l\u1edbn nh\u1ea5t c\u1ee7a ch\u00fang t\u00f4i."
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
                  <p className="sb-kicker">{english ? "Your reply" : "Phản hồi"}</p>
                  <h3 className="sb-title">{english ? "A Note From You" : "Lời nhắn từ quý khách"}</h3>
                  <p>
                    {invitee
                      ? t.inviteeSubtitle(invitee.name, coupleNames.filter(Boolean).join(" & "), invitee.maxPartySize)
                      : t.subtitle(coupleNames.filter(Boolean).join(" & "))}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="sb-field">
                  <label id="sb-attend-label">{editorial ? (english ? "Your reply" : "Phản hồi") : (english ? "Will you be there?" : "Quý khách có tham dự?")}</label>
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

                {!(variant === "ivory-veil" && invitee) && (
                  <div className="sb-field">
                    <label htmlFor="sb-name">{t.yourName}</label>
                    <input
                      id="sb-name"
                      className="sb-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                      autoComplete="name"
                      placeholder={t.namePlaceholder}
                      aria-invalid={!!error && !name.trim()}
                      required
                    />
                  </div>
                )}

                {attending && (
                  <div className="sb-field">
                    <label htmlFor="sb-guests">{t.guests}</label>
                    <div className="sb-select-wrap">
                      <select
                        id="sb-guests"
                        className="sb-select"
                        value={Math.min(partySize, maxParty)}
                        onChange={(e) => setPartySize(Number(e.target.value))}
                      >
                        {Array.from({ length: maxParty }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {partyLabel(n, ui.lang)}
                          </option>
                        ))}
                      </select>
                      <svg className="sb-select-chevron" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                    </div>
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
                  {status === "sending" ? t.sending : editorial ? (english ? "Send reply" : t.sendRsvp) : attending ? (english ? "Seal & send" : t.sendRsvp) : t.sendLove}
                </button>
                <p className="sb-rsvp-note">
                  {demo
                    ? (english ? "Design preview — no data is sent or stored." : "Bản xem trước — không có dữ liệu nào được gửi.")
                    : (english
                      ? <>By submitting, you agree to our <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Privacy Policy</a>. Your reply is shared only with the hosts.</>
                      : <>Khi gửi, quý khách đồng ý với <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Chính sách bảo mật</a>. Phản hồi chỉ được chia sẻ với gia chủ.</>)}
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
