"use client";

/**
 * StorybookBlessings — a quiet paper wall for guest messages plus the same
 * optimistic, batched reaction API used by the classic invitation. The visual
 * language follows the Storybook collection (petal ornaments, letters, serif).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Flower, Gem, Heart, Sparkles, Wine, type LucideIcon } from "lucide-react";
import type { GuestbookEntryRow, ReactionKind } from "@/types/database";
import type { ReactionCounts } from "../sections/Blessings";
import { useInvitationCopy } from "../sections/HeroParts";
import { timeAgo, type InvitationPalette } from "../utils";

const REACTIONS: { kind: ReactionKind; Icon: LucideIcon }[] = [
  { kind: "love", Icon: Heart },
  { kind: "bloom", Icon: Flower },
  { kind: "cheers", Icon: Wine },
  { kind: "sparkle", Icon: Sparkles },
  { kind: "rings", Icon: Gem },
];

const PAGE_SIZE = 8;
const FLUSH_MS = 1000;

/** Sends batched reaction counts; best-effort, like the classic wall. */
function sendReactions(weddingId: string, pending: Partial<ReactionCounts>) {
  for (const [kind, amount] of Object.entries(pending)) {
    if (!amount) continue;
    fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weddingId, kind, amount: Math.min(amount, 20) }),
      keepalive: true,
    }).catch(() => console.warn("[WARNING] reaction not delivered", { kind }));
  }
}

interface StorybookBlessingsProps {
  weddingId: string;
  blessings: GuestbookEntryRow[];
  reactions: ReactionCounts;
  highlightId?: string | null;
  palette: InvitationPalette;
  demo?: boolean;
  showWall?: boolean;
  showReactions?: boolean;
  title: string;
}

export default function StorybookBlessings({
  weddingId,
  blessings,
  reactions,
  highlightId,
  demo = false,
  showWall = true,
  showReactions = true,
  title,
}: StorybookBlessingsProps) {
  const ui = useInvitationCopy();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [counts, setCounts] = useState(reactions);
  const pending = useRef<Partial<ReactionCounts>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shown = blessings.slice(0, visible);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const flush = useCallback(() => {
    timer.current = null;
    const batch = pending.current;
    pending.current = {};
    if (!demo) sendReactions(weddingId, batch);
  }, [weddingId, demo]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      flush();
    };
  }, [flush]);

  /** Registers one reaction tap and schedules a batched request. */
  function react(kind: ReactionKind) {
    setCounts((c) => ({ ...c, [kind]: c[kind] + 1 }));
    const current = pending.current[kind] ?? 0;
    if (current >= 20) return;
    pending.current[kind] = current + 1;
    if (!timer.current) timer.current = setTimeout(flush, FLUSH_MS);
  }

  const badge = (entry: GuestbookEntryRow) =>
    entry.rsvp_status === "attending" ? ui.blessings.willBeThere : entry.rsvp_status === "declined" ? ui.blessings.sendingLove : null;

  return (
    <section className="sb-section sb-blessings" id="blessings">
      <div className="sb-reveal in">
        <div className="sb-section-head">
          <p className="sb-kicker">{ui.blessings.withLove}</p>
          <h2 className="sb-title">{title}</h2>
          <div className="sb-ornament" aria-hidden="true" />
          {showWall && blessings.length > 0 && <p className="sb-lede">{ui.blessings.wishes(blessings.length)}</p>}
        </div>

        {showReactions && (
          <>
            <p className="sb-reaction-total">
              {ui.blessings.tapToSend} · {ui.blessings.sentSoFar(total)}
            </p>
            <div className="sb-reaction-bar">
              {REACTIONS.map(({ kind, Icon }) => (
                <button key={kind} type="button" className="sb-reaction" onClick={() => react(kind)} aria-label={`${ui.blessings.tapToSend}: ${ui.blessings.reactions[kind] ?? kind}`}>
                  <Icon size={20} aria-hidden />
                  <span>{ui.blessings.reactions[kind] ?? kind}</span>
                  <b>{counts[kind].toLocaleString()}</b>
                </button>
              ))}
            </div>
          </>
        )}

        {showWall &&
          (blessings.length === 0 ? (
            <div className="sb-blessings-empty">
              <p>{ui.blessings.firstBlessing}</p>
              <a className="sb-pill" href="#rsvp">
                {ui.blessings.writeBlessing}
              </a>
            </div>
          ) : (
            <>
              <div className="sb-wall">
                {shown.map((entry) => (
                  <article key={entry.id} className={`sb-blessing ${entry.id === highlightId ? "sb-highlight" : ""}`}>
                    <p>{entry.message}</p>
                    <p className="sb-blessing-name">{entry.guest_name}</p>
                    <div className="sb-blessing-meta">
                      <span suppressHydrationWarning>{timeAgo(entry.created_at, Date.now(), ui.dateLocale)}</span>
                      {badge(entry) && <span className="sb-blessing-badge">{badge(entry)}</span>}
                    </div>
                  </article>
                ))}
              </div>
              {visible < blessings.length && (
                <button type="button" className="sb-blessings-more" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  {ui.blessings.showMore(blessings.length - visible)}
                </button>
              )}
            </>
          ))}
      </div>
    </section>
  );
}
