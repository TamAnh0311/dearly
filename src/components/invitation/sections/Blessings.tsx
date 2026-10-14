"use client";

/**
 * Blessings — a reaction bar (tap to shower the couple with hearts, blooms,
 * cheers…) and a masonry wall of every blessing guests have left.
 * Reaction taps are optimistic and batched into one request per second.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flower, Gem, Heart, Quote, Sparkles, Wine, type LucideIcon } from "lucide-react";
import type { GuestbookEntryRow, ReactionKind } from "@/types/database";
import { Reveal, SectionHeading } from "./Primitives";
import { EASE_OUT, alpha, seeded, timeAgo, type InvitationPalette } from "../utils";

export type ReactionCounts = Record<ReactionKind, number>;

const REACTIONS: { kind: ReactionKind; label: string; Icon: LucideIcon }[] = [
  { kind: "love", label: "Love", Icon: Heart },
  { kind: "bloom", label: "Bloom", Icon: Flower },
  { kind: "cheers", label: "Cheers", Icon: Wine },
  { kind: "sparkle", label: "Joy", Icon: Sparkles },
  { kind: "rings", label: "Forever", Icon: Gem },
];

const PAGE_SIZE = 9;
const FLUSH_MS = 1000;

interface Floater {
  id: number;
  kind: ReactionKind;
  dx: number;
}

/** Sends batched reaction counts; failures are logged and otherwise ignored (reactions are best-effort). */
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

/** Tap-to-react bar with floating icon feedback and live counts. */
function ReactionBar({
  weddingId,
  initial,
  palette,
  demo,
}: {
  weddingId: string;
  initial: ReactionCounts;
  palette: InvitationPalette;
  demo: boolean;
}) {
  const [counts, setCounts] = useState(initial);
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const pending = useRef<Partial<ReactionCounts>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(0);

  const flush = useCallback(() => {
    timer.current = null;
    const batch = pending.current;
    pending.current = {};
    if (!demo) sendReactions(weddingId, batch);
  }, [weddingId, demo]);

  // Deliver anything still pending when leaving the page.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      flush();
    };
  }, [flush]);

  /** Registers one tap: bump count, spawn floater, schedule a batched send. */
  function react(kind: ReactionKind) {
    setCounts((c) => ({ ...c, [kind]: c[kind] + 1 }));
    const id = nextId.current++;
    setFloaters((f) => [...f.slice(-24), { id, kind, dx: (seeded(id + 11) - 0.5) * 70 }]);
    const current = pending.current[kind] ?? 0;
    if (current >= 20) return; // cap per batch; extra taps are visual only
    pending.current[kind] = current + 1;
    if (!timer.current) timer.current = setTimeout(flush, FLUSH_MS);
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <Reveal className="mx-auto mb-20 max-w-3xl text-center">
      <p className="mb-6 text-xs uppercase tracking-[0.3em]" style={{ color: palette.inkMuted }}>
        Tap to send your love · <span style={{ color: palette.primary }}>{total.toLocaleString()}</span> sent so far
      </p>
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {REACTIONS.map(({ kind, label, Icon }) => (
          <div key={kind} className="relative">
            <AnimatePresence>
              {floaters
                .filter((f) => f.kind === kind)
                .map((f) => (
                  <motion.span
                    key={f.id}
                    className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
                    style={{ color: palette.primary }}
                    initial={{ y: 0, x: 0, opacity: 1, scale: 0.6 }}
                    animate={{ y: -140, x: f.dx, opacity: 0, scale: 1.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.3, ease: "easeOut" }}
                    onAnimationComplete={() => setFloaters((all) => all.filter((x) => x.id !== f.id))}
                  >
                    <Icon size={22} fill="currentColor" />
                  </motion.span>
                ))}
            </AnimatePresence>
            <motion.button
              type="button"
              onClick={() => react(kind)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.85 }}
              aria-label={`Send ${label}`}
              className="flex min-w-[5.5rem] flex-col items-center gap-1.5 border px-4 py-3 backdrop-blur-sm"
              style={{
                borderRadius: palette.radius.card,
                borderColor: alpha(palette.primary, 0.25),
                backgroundColor: alpha("#ffffff", palette.isDark ? 0.04 : 0.7),
                color: palette.primary,
              }}
            >
              <Icon size={24} />
              <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: palette.inkMuted }}>
                {label}
              </span>
              <motion.span
                key={counts[kind]}
                initial={{ scale: 1.4 }}
                animate={{ scale: 1 }}
                className="text-sm tabular-nums"
                style={{ color: palette.ink }}
              >
                {counts[kind].toLocaleString()}
              </motion.span>
            </motion.button>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/** A single blessing card on the wall. */
function BlessingCard({ entry, index, palette, highlight }: { entry: GuestbookEntryRow; index: number; palette: InvitationPalette; highlight: boolean }) {
  const tint = palette.petals[index % 3];
  const badge =
    entry.rsvp_status === "attending"
      ? "Will be there"
      : entry.rsvp_status === "declined"
        ? "Sending love from afar"
        : null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30, scale: highlight ? 0.9 : 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease: EASE_OUT }}
      className="relative mb-5 break-inside-avoid border p-7"
      style={{
        borderRadius: palette.radius.card,
        borderColor: highlight ? palette.primary : alpha(palette.primary, 0.15),
        background: `linear-gradient(160deg, ${alpha(tint, palette.isDark ? 0.12 : 0.22)}, ${alpha("#ffffff", palette.isDark ? 0.02 : 0.7)})`,
        boxShadow: highlight ? `0 0 0 4px ${alpha(palette.primary, 0.15)}` : `0 18px 40px -28px ${alpha(palette.primary, 0.5)}`,
      }}
    >
      <Quote size={22} style={{ color: alpha(palette.primary, 0.45) }} />
      <p className="mt-3 whitespace-pre-line leading-relaxed" style={{ color: palette.ink }}>
        {entry.message}
      </p>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-2xl leading-none" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
            {entry.guest_name}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.15em]" style={{ color: palette.inkMuted }} suppressHydrationWarning>
            {timeAgo(entry.created_at)}
          </p>
        </div>
        {badge && (
          <span
            className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.15em]"
            style={{ backgroundColor: alpha(palette.primary, 0.12), color: palette.primary }}
          >
            {badge}
          </span>
        )}
      </div>
    </motion.article>
  );
}

export default function Blessings({
  weddingId,
  blessings,
  reactions,
  highlightId,
  palette,
  demo = false,
  showWall = true,
  showReactions = true,
}: {
  weddingId: string;
  blessings: GuestbookEntryRow[];
  reactions: ReactionCounts;
  highlightId?: string | null;
  palette: InvitationPalette;
  demo?: boolean;
  /** Show the masonry wall of blessings. */
  showWall?: boolean;
  /** Show the tap-to-react bar. */
  showReactions?: boolean;
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = blessings.slice(0, visible);

  return (
    <section id="blessings" className="relative px-6 py-28 md:py-36" style={{ backgroundColor: palette.surface }}>
      <SectionHeading
        eyebrow="With love"
        title="Blessings"
        palette={palette}
        subtitle={showWall && blessings.length > 0 ? `${blessings.length} heartfelt ${blessings.length === 1 ? "wish" : "wishes"} for the happy couple` : undefined}
      />

      {showReactions && <ReactionBar weddingId={weddingId} initial={reactions} palette={palette} demo={demo} />}

      {!showWall ? null : blessings.length === 0 ? (
        <Reveal className="text-center">
          <p className="text-3xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
            Be the first to leave a blessing
          </p>
          <a
            href="#rsvp"
            className="mt-6 inline-block rounded-full border px-7 py-3 text-xs uppercase tracking-[0.25em]"
            style={{ borderColor: alpha(palette.primary, 0.5), color: palette.primary }}
          >
            Write a blessing
          </a>
        </Reveal>
      ) : (
        <div className="mx-auto max-w-6xl columns-1 gap-5 md:columns-2 lg:columns-3">
          {shown.map((b, i) => (
            <BlessingCard key={b.id} entry={b} index={i} palette={palette} highlight={b.id === highlightId} />
          ))}
        </div>
      )}

      {showWall && visible < blessings.length && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-full border px-7 py-3 text-xs uppercase tracking-[0.25em] transition hover:-translate-y-0.5"
            style={{ borderColor: alpha(palette.primary, 0.5), color: palette.primary }}
          >
            Show more blessings ({blessings.length - visible})
          </button>
        </div>
      )}
    </section>
  );
}
