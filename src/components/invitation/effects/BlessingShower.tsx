"use client";

/**
 * BlessingShower — brings guests' blessings to life the moment the page
 * opens, in one of two couple-selectable modes:
 *  - "marquee" (default): blessings drift across the background of the
 *    opening hero only, as large, soft lines of running text (portalled into
 *    the hero's `#hero-blessings` layer, beneath the names and curtains).
 *  - "float": each blessing floats up the screen carried by the template's
 *    motif (butterfly, flower, star, heart or a confetti pop) with a note.
 *  - "feed": wishes pop up bottom-left like a livestream chat (popular on
 *    Vietnamese / Korean mobile invitations), a few at a time.
 *
 * Behaviour
 *  - First wave ~3.5s after load: up to 6 carriers with names, staggered.
 *  - Then one full note every 5s, cycling through blessings twice, then rests.
 *  - A freshly sent blessing (`latestId`) jumps the queue immediately.
 *  - Pointer-events pass through (never blocks the page); a small toggle
 *    lets guests turn it off (remembered in localStorage). Couples can disable
 *    it entirely with the "Floating blessings" section toggle. Disabled for
 *    reduced-motion users.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import type { GuestbookEntryRow } from "@/types/database";
import { ButterflyShape } from "../effects/Particles";
import { alpha, luminance, mix, seeded, type InvitationPalette } from "../utils";

type Carrier = "butterfly" | "flower" | "star" | "heart" | "confetti";

interface Flight {
  key: number;
  entry: GuestbookEntryRow;
  carrier: Carrier;
  left: number;
  /** Full note (message) vs. name-only tag. */
  full: boolean;
  duration: number;
}

const FIRST_WAVE_DELAY = 3500;
const FIRST_WAVE_SIZE = 6;
const CYCLE_MS = 5000;
const MAX_ROUNDS = 2;
const MAX_ACTIVE = 8;
const PREF_KEY = "dearly-blessing-shower";

/** Reads the guest's saved on/off preference (defaults to on). */
function readPref(): boolean {
  try {
    return window.localStorage.getItem(PREF_KEY) !== "off";
  } catch {
    return true;
  }
}

/** Saves the guest's on/off preference; storage failures are non-fatal. */
function writePref(on: boolean) {
  try {
    window.localStorage.setItem(PREF_KEY, on ? "on" : "off");
  } catch {
    /* private mode — ignore */
  }
}

/** Chooses carrier motifs from the template's ambient effects. */
export function carriersFor(palette: InvitationPalette): Carrier[] {
  const a = palette.style.ambient;
  const list: Carrier[] = [];
  if (a.includes("butterflies")) list.push("butterfly");
  if (a.includes("petals") || a.includes("leaves") || palette.style.ornament === "floral" || palette.style.ornament === "leaf") list.push("flower");
  if (a.includes("stars") || palette.style.ornament === "star") list.push("star");
  if (a.includes("confetti")) list.push("confetti");
  if (a.includes("gold-dust") || list.length === 0) list.push("heart");
  return list;
}

/** Accent colour that stays readable on the note background (darkens light accents on light notes). */
export function noteAccent(palette: InvitationPalette): string {
  const bgLum = luminance(palette.background);
  const fgLum = luminance(palette.primary);
  const ratio = (Math.max(bgLum, fgLum) + 0.05) / (Math.min(bgLum, fgLum) + 0.05);
  if (ratio >= 3) return palette.primary;
  return bgLum > 0.5 ? mix(palette.primary, "#000000", 0.45) : mix(palette.primary, "#ffffff", 0.45);
}

/** Shortens a blessing for the floating note. */
function excerpt(text: string, max = 90): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/** The little motif that carries a note. */
function CarrierGlyph({ carrier, palette, seed }: { carrier: Carrier; palette: InvitationPalette; seed: number }) {
  const color = palette.petals[seed % 3];
  switch (carrier) {
    case "butterfly":
      return <ButterflyShape color={color} accent={palette.primary} size={34} />;
    case "star":
      return (
        <motion.svg width={26} height={26} viewBox="0 0 24 24" animate={{ rotate: [0, 20, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          <path d="M12 1 L14.6 9 L23 9.3 L16.3 14.4 L18.8 22.5 L12 17.6 L5.2 22.5 L7.7 14.4 L1 9.3 L9.4 9 Z" fill={palette.primary} style={{ filter: `drop-shadow(0 0 6px ${alpha(palette.primary, 0.8)})` }} />
        </motion.svg>
      );
    case "heart":
      return (
        <motion.svg width={26} height={26} viewBox="0 0 24 24" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={palette.primary} />
        </motion.svg>
      );
    case "confetti":
      return (
        <span className="relative block h-8 w-8">
          {Array.from({ length: 7 }, (_, i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 h-2.5 w-1.5 rounded-sm"
              style={{ background: [palette.primary, palette.accent, ...palette.petals][i % 5] }}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{ x: Math.cos((i / 7) * Math.PI * 2) * 22, y: Math.sin((i / 7) * Math.PI * 2) * 22, rotate: 220, opacity: [1, 1, 0.6] }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          ))}
          <Sparkles className="absolute inset-0 m-auto" size={18} style={{ color: palette.primary }} />
        </span>
      );
    default:
      return (
        <motion.svg width={30} height={30} viewBox="-15 -15 30 30" animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={0} cy={-7} rx={4.5} ry={7.5} fill={color} transform={`rotate(${a})`} />
          ))}
          <circle r={3.5} fill="#f3d27a" />
        </motion.svg>
      );
  }
}

/** One blessing floating up the viewport. */
function FlyingBlessing({ flight, palette, onDone }: { flight: Flight; palette: InvitationPalette; onDone: () => void }) {
  const sway = (seeded(flight.key + 5) - 0.5) * 80;
  const noteRight = flight.left < 55;
  return (
    <motion.div
      className="absolute bottom-0"
      style={{ left: `${flight.left}%` }}
      initial={{ y: "10vh", opacity: 0 }}
      animate={{ y: "-110vh", x: [0, sway, -sway * 0.6, sway * 0.4], opacity: [0, 1, 1, 1, 0] }}
      transition={{ duration: flight.duration, ease: "linear", times: [0, 0.08, 0.5, 0.9, 1] }}
      onAnimationComplete={onDone}
    >
      <div className={`flex items-center gap-2 ${noteRight ? "" : "flex-row-reverse"}`}>
        <CarrierGlyph carrier={flight.carrier} palette={palette} seed={flight.key} />
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 160, damping: 14 }}
          className={`border px-3 py-2 shadow-lg backdrop-blur-md ${flight.full ? "max-w-[15rem]" : ""}`}
          style={{
            borderRadius: palette.radius.card === "2px" ? 4 : 16,
            borderColor: alpha(palette.primary, 0.25),
            background: alpha(palette.background, 0.82),
            color: palette.ink,
          }}
        >
          {flight.full && <p className="text-xs leading-snug">&ldquo;{excerpt(flight.entry.message)}&rdquo;</p>}
          <p className={`${flight.full ? "mt-1 text-lg" : "text-base"} leading-none`} style={{ fontFamily: palette.scriptFont, color: noteAccent(palette) }}>
            {flight.full ? `— ${flight.entry.guest_name}` : flight.entry.guest_name}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Running-text mode ───────────────────────────────────────────────────── */

const MARQUEE_ROWS = [
  { top: "20%", duration: 70, reverse: false },
  { top: "52%", duration: 90, reverse: true },
  { top: "82%", duration: 80, reverse: false },
];

/** Builds a row's text items, repeating blessings so the row is always full. */
export function marqueeItems(blessings: GuestbookEntryRow[], row: number, minItems = 6): GuestbookEntryRow[] {
  if (blessings.length === 0) return [];
  const rotated = blessings.map((_, i) => blessings[(i + row * 2) % blessings.length]);
  const out: GuestbookEntryRow[] = [];
  while (out.length < Math.max(minItems, rotated.length)) out.push(...rotated);
  return out.slice(0, Math.max(minItems, rotated.length));
}

/** DOM id of the layer inside the hero section that hosts the running text. */
export const HERO_BLESSINGS_LAYER_ID = "hero-blessings";

/**
 * Blessings drifting across the hero background in large, soft, slow-moving
 * lines of text — like credits behind a film. Pointer-transparent and
 * low-contrast so it never competes with the couple's names.
 */
function BlessingMarquee({ blessings, palette }: { blessings: GuestbookEntryRow[]; palette: InvitationPalette }) {
  const ink = palette.isDark ? "#ffffff" : palette.ink;
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ mixBlendMode: palette.isDark ? "screen" : "multiply" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: FIRST_WAVE_DELAY / 1000, duration: 2.5 }}
      aria-hidden
    >
      {MARQUEE_ROWS.map((row, r) => {
        const items = marqueeItems(blessings, r);
        const line = (
          <div className="flex shrink-0 items-baseline gap-12 pr-12">
            {items.map((b, i) => (
              <span key={`${b.id}-${i}`} className="flex items-baseline gap-4 whitespace-nowrap">
                <span className="text-[clamp(1.5rem,3.4vw,3rem)] italic" style={{ fontFamily: palette.displayFont }}>
                  &ldquo;{excerpt(b.message, 70)}&rdquo;
                </span>
                <span className="text-[clamp(1.6rem,3.6vw,3.2rem)]" style={{ fontFamily: palette.scriptFont, color: alpha(palette.primary, palette.isDark ? 0.32 : 0.24) }}>
                  {b.guest_name}
                </span>
                <span style={{ color: alpha(palette.primary, 0.25) }}>✦</span>
              </span>
            ))}
          </div>
        );
        return (
          <motion.div
            key={r}
            className="absolute left-0 flex w-max"
            style={{ top: row.top, color: alpha(ink, palette.isDark ? 0.16 : 0.1) }}
            animate={{ x: row.reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
            transition={{ duration: row.duration + items.length * 4, repeat: Infinity, ease: "linear" }}
          >
            {line}
            {line}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
/* ─── Live chat feed mode ────────────────────────────────────────────────── */

const FEED_VISIBLE = 4;
const FEED_MS = 2800;

/** Pure: the slice of blessings visible after `tick` steps (newest last). */
export function feedWindow(blessings: GuestbookEntryRow[], tick: number, visible = FEED_VISIBLE): GuestbookEntryRow[] {
  if (blessings.length === 0 || tick <= 0) return [];
  const out: GuestbookEntryRow[] = [];
  for (let i = Math.max(0, tick - visible); i < tick; i++) out.push(blessings[i % blessings.length]);
  return out;
}

/** Chat bubbles that appear one by one and scroll up, then rest after two rounds. */
function BlessingFeed({ blessings, palette }: { blessings: GuestbookEntryRow[]; palette: InvitationPalette }) {
  const [tick, setTick] = useState(0);
  const max = blessings.length * MAX_ROUNDS;
  useEffect(() => {
    const start = setTimeout(() => setTick(1), FIRST_WAVE_DELAY);
    const id = setInterval(() => setTick((n) => (n > 0 && n < max ? n + 1 : n)), FEED_MS);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [max]);
  // Rested: clear the feed shortly after the final message.
  const items = tick >= max ? [] : feedWindow(blessings, tick);
  return (
    <div className="pointer-events-none fixed bottom-20 left-3 z-30 flex w-[min(78vw,20rem)] flex-col items-start gap-1.5" aria-hidden>
      <AnimatePresence initial={false}>
        {items.map((b, i) => (
          <motion.div
            key={`${b.id}-${tick - items.length + i}`}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: i === 0 && items.length === FEED_VISIBLE ? 0.55 : 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="max-w-full px-3 py-1.5 text-xs leading-snug shadow-md backdrop-blur-md"
            style={{ borderRadius: 14, background: alpha(mix(palette.primary, "#000000", 0.6), 0.8), color: "#ffffff" }}
          >
            <span className="font-semibold">{b.guest_name}:</span> {excerpt(b.message, 80)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function BlessingShower({
  blessings,
  palette,
  latestId,
  mode = "marquee",
}: {
  blessings: GuestbookEntryRow[];
  palette: InvitationPalette;
  latestId?: string | null;
  /** "marquee" = background running text (default); "float" = carried by motifs; "feed" = live chat. */
  mode?: "marquee" | "float" | "feed";
}) {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const carriers = useMemo(() => carriersFor(palette), [palette]);
  const nextKey = useRef(0);
  const cursor = useRef(0);
  const shown = useRef(0);
  const latestSeen = useRef<string | null>(null);
  const blessingsRef = useRef(blessings);
  blessingsRef.current = blessings;

  /** Launches one blessing into the air (ref so timers always see fresh state). */
  const launch = useRef<(entry: GuestbookEntryRow, full: boolean) => void>(() => {});
  launch.current = (entry, full) => {
    const key = nextKey.current++;
    const flight: Flight = {
      key,
      entry,
      full,
      carrier: carriers[key % carriers.length],
      left: 6 + seeded(key * 7 + 3) * 78,
      duration: full ? 14 + seeded(key) * 4 : 10 + seeded(key) * 4,
    };
    setFlights((f) => [...f, flight].slice(-MAX_ACTIVE));
  };
  const hasBlessings = blessings.length > 0;
  const [heroLayer, setHeroLayer] = useState<HTMLElement | null>(null);

  // Find the hero's running-text layer once mounted.
  useEffect(() => {
    setHeroLayer(document.getElementById(HERO_BLESSINGS_LAYER_ID));
  }, []);

  // Restore the guest's preference after mount (avoids SSR mismatch).
  useEffect(() => {
    if (!readPref()) setEnabled(false);
  }, []);
  // First wave + rotating notes.
  useEffect(() => {
    if (reduce || !enabled || !hasBlessings || mode !== "float") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wave = blessingsRef.current.slice(0, FIRST_WAVE_SIZE);
    wave.forEach((b, i) => timers.push(setTimeout(() => launch.current(b, false), FIRST_WAVE_DELAY + i * 650)));

    const interval = setInterval(() => {
      const list = blessingsRef.current;
      if (list.length === 0 || shown.current >= list.length * MAX_ROUNDS) return;
      launch.current(list[cursor.current % list.length], true);
      cursor.current++;
      shown.current++;
    }, CYCLE_MS);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
    // Only (re)start when toggled or when blessings first become available.
  }, [reduce, enabled, hasBlessings, mode]);

  // A newly sent blessing flies in right away.
  useEffect(() => {
    if (!latestId || latestId === latestSeen.current || reduce || !enabled || mode !== "float") return;
    latestSeen.current = latestId;
    const entry = blessingsRef.current.find((b) => b.id === latestId);
    if (entry) launch.current(entry, true);
  }, [latestId, reduce, enabled, mode]);

  if (reduce || blessings.length === 0) return null;

  return (
    <>
      {heroLayer &&
        createPortal(
          <AnimatePresence>{enabled && mode === "marquee" && <BlessingMarquee key="marquee" blessings={blessings} palette={palette} />}</AnimatePresence>,
          heroLayer
        )}
      {enabled && mode === "feed" && <BlessingFeed blessings={blessings} palette={palette} />}
      <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden>
        <AnimatePresence>
          {enabled &&
            mode === "float" &&
            flights.map((f) => (
              <FlyingBlessing key={f.key} flight={f} palette={palette} onDone={() => setFlights((all) => all.filter((x) => x.key !== f.key))} />
            ))}
        </AnimatePresence>
      </div>

      <motion.button
        type="button"
        onClick={() => {
          const next = !enabled;
          setEnabled(next);
          writePref(next);
          setFlights([]);
        }}
        aria-pressed={enabled}
        aria-label={enabled ? "Hide blessings" : "Show blessings"}
        title={enabled ? "Hide blessings" : "Show blessings"}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] shadow-lg backdrop-blur-md"
        style={{ borderColor: alpha(palette.primary, 0.3), background: alpha(palette.background, 0.85), color: noteAccent(palette) }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: FIRST_WAVE_DELAY / 1000 }}
      >
        <Heart size={14} fill={enabled ? "currentColor" : "none"} />
        {blessings.length} {blessings.length === 1 ? "blessing" : "blessings"}
      </motion.button>
    </>
  );
}
