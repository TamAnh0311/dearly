"use client";

/**
 * Ambient particle effects: butterflies flying across the viewport,
 * gently falling petals, drifting bokeh lights, and a one-shot
 * celebration burst used after an RSVP or blessing is sent.
 */

import { motion, useReducedMotion } from "framer-motion";
import { seeded } from "../utils";

/* ─── Butterfly ─────────────────────────────────────────────────────────────── */

/** A single butterfly with flapping wings (no flight path). */
export function ButterflyShape({ color, accent, size = 34 }: { color: string; accent: string; size?: number }) {
  const reduce = useReducedMotion();
  const flap = reduce ? undefined : { scaleX: [1, 0.25, 1] };
  const flapT = { duration: 0.32, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <svg viewBox="-32 -26 64 52" width={size} height={(size * 52) / 64} style={{ overflow: "visible" }} aria-hidden>
      {/* Left wings */}
      <motion.g style={{ originX: 1, originY: 0.5 }} animate={flap} transition={flapT}>
        <path d="M0 0 C -10 -22, -32 -22, -28 -4 C -26 6, -10 6, 0 0 Z" fill={color} />
        <path d="M0 2 C -10 6, -22 20, -12 22 C -5 23, -1 12, 0 2 Z" fill={color} opacity={0.85} />
        <circle cx={-18} cy={-8} r={3.2} fill={accent} opacity={0.8} />
      </motion.g>
      {/* Right wings */}
      <motion.g style={{ originX: 0, originY: 0.5 }} animate={flap} transition={flapT}>
        <path d="M0 0 C 10 -22, 32 -22, 28 -4 C 26 6, 10 6, 0 0 Z" fill={color} />
        <path d="M0 2 C 10 6, 22 20, 12 22 C 5 23, 1 12, 0 2 Z" fill={color} opacity={0.85} />
        <circle cx={18} cy={-8} r={3.2} fill={accent} opacity={0.8} />
      </motion.g>
      {/* Body & antennae */}
      <ellipse cx={0} cy={2} rx={1.8} ry={10} fill="#3b2f2a" />
      <path d="M0 -7 C -2 -14, -6 -18, -8 -19 M0 -7 C 2 -14, 6 -18, 8 -19" stroke="#3b2f2a" strokeWidth={0.8} fill="none" />
    </svg>
  );
}

interface FlightPath {
  x: string[];
  y: string[];
  duration: number;
  delay: number;
  size: number;
  top: string;
}

const FLIGHTS: FlightPath[] = [
  { x: ["-10vw", "18vw", "40vw", "62vw", "85vw", "112vw"], y: ["0vh", "-9vh", "3vh", "-12vh", "-2vh", "-14vh"], duration: 22, delay: 2.5, size: 34, top: "58%" },
  { x: ["110vw", "80vw", "58vw", "35vw", "12vw", "-12vw"], y: ["0vh", "-6vh", "-16vh", "-8vh", "-20vh", "-12vh"], duration: 26, delay: 7, size: 26, top: "40%" },
  { x: ["-8vw", "10vw", "30vw", "48vw", "70vw", "108vw"], y: ["0vh", "8vh", "-2vh", "10vh", "2vh", "12vh"], duration: 30, delay: 13, size: 22, top: "22%" },
];

/** Butterflies that drift across the containing (relative) element on looping paths. */
export function Butterflies({ colors, accent, count = 3 }: { colors: string[]; accent: string; count?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {FLIGHTS.slice(0, count).map((f, i) => (
        <motion.div
          key={i}
          className="absolute left-0"
          style={{ top: f.top }}
          initial={{ x: f.x[0], y: f.y[0], opacity: 0 }}
          animate={{ x: f.x, y: f.y, opacity: [0, 1, 1, 1, 1, 0], rotate: [8, -6, 10, -8, 6, -4] }}
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
        >
          <motion.div
            animate={{ y: [0, -10, 0, 8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ButterflyShape color={colors[i % colors.length]} accent={accent} size={f.size} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Falling petals ──────────────────────────────────────────────────────── */

export type FallingShape = "petal" | "leaf" | "confetti" | "snow";

/** Renders one falling particle's SVG for the given shape. */
function FallingGlyph({ shape, color, size }: { shape: FallingShape; color: string; size: number }) {
  switch (shape) {
    case "leaf":
      return (
        <svg width={size * 1.2} height={size * 1.2} viewBox="0 0 24 24" aria-hidden>
          <path d="M2 22 C 2 10, 10 2, 22 2 C 22 14, 14 22, 2 22 Z" fill={color} opacity={0.85} />
          <path d="M3 21 L 18 6" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={0.9} />
        </svg>
      );
    case "confetti":
      return <div style={{ width: size * 0.5, height: size, backgroundColor: color, borderRadius: 2, opacity: 0.85 }} />;
    case "snow":
      return (
        <div
          style={{
            width: size * 0.55,
            height: size * 0.55,
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            boxShadow: `0 0 6px ${color}`,
            opacity: 0.9,
          }}
        />
      );
    default:
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 20 26" aria-hidden>
          <path d="M10 0 C 18 6, 20 16, 10 26 C 0 16, 2 6, 10 0 Z" fill={color} opacity={0.85} />
          <path d="M10 3 C 11 10, 11 16, 10 23" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={0.8} fill="none" />
        </svg>
      );
  }
}

/** Particles (petals, leaves, confetti or snow) falling and tumbling through the containing (relative) element. */
export function FallingPetals({
  colors,
  count = 14,
  shape = "petal",
}: {
  colors: string[];
  count?: number;
  shape?: FallingShape;
}) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const spin = shape === "snow" ? 0 : shape === "confetti" ? 900 : 480;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const left = seeded(i) * 100;
        const size = 9 + seeded(i + 50) * 10;
        const duration = (shape === "snow" ? 14 : 11) + seeded(i + 100) * 9;
        const delay = seeded(i + 150) * 12;
        const drift = (seeded(i + 200) - 0.5) * 160;
        return (
          <motion.div
            key={i}
            className="absolute -top-8"
            style={{ left: `${left}%` }}
            initial={{ y: "-5vh", opacity: 0 }}
            animate={{
              y: ["-5vh", "110vh"],
              x: [0, drift * 0.5, drift, drift * 0.6],
              rotate: [0, spin * 0.4, spin * 0.7, spin],
              rotateY: shape === "confetti" ? [0, 180, 360, 540] : 0,
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
          >
            <FallingGlyph shape={shape} color={colors[i % colors.length]} size={size} />
          </motion.div>
        );
      })}
    </div>
  );
}

/** Tiny glowing specks drifting upward — champagne / gold-leaf feel. */
export function GoldDust({ color, count = 28 }: { color: string; count?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const size = 2 + seeded(i + 400) * 3.5;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${seeded(i + 410) * 100}%`,
              bottom: `${seeded(i + 420) * 30 - 10}%`,
              width: size,
              height: size,
              backgroundColor: color,
              boxShadow: `0 0 ${size * 3}px ${color}`,
            }}
            animate={{ y: [0, -500 - seeded(i + 430) * 300], x: [0, (seeded(i + 440) - 0.5) * 80], opacity: [0, 1, 0.8, 0] }}
            transition={{ duration: 9 + seeded(i + 450) * 8, delay: seeded(i + 460) * 8, repeat: Infinity, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

/** Twinkling star field with the occasional shooting star. */
export function TwinklingStars({ color, count = 70 }: { color: string; count?: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const size = 1 + seeded(i + 500) * 2.4;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${seeded(i + 510) * 100}%`,
              top: `${seeded(i + 520) * 100}%`,
              width: size,
              height: size,
              backgroundColor: color,
              boxShadow: size > 2.6 ? `0 0 6px ${color}` : undefined,
            }}
            animate={reduce ? { opacity: 0.7 } : { opacity: [0.15, 1, 0.15] }}
            transition={{ duration: 2 + seeded(i + 530) * 4, delay: seeded(i + 540) * 4, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}
      {!reduce &&
        [0, 1].map((i) => (
          <motion.span
            key={`shoot-${i}`}
            className="absolute h-px w-32"
            style={{
              top: `${12 + i * 22}%`,
              left: `${55 + i * 15}%`,
              background: `linear-gradient(90deg, ${color}, transparent)`,
              rotate: -30,
            }}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], x: [-0, -320], y: [0, 180] }}
            transition={{ duration: 1.4, delay: 4 + i * 6, repeat: Infinity, repeatDelay: 9 + i * 4, ease: "easeOut" }}
          />
        ))}
    </div>
  );
}
/* ─── Balloons ──────────────────────────────────────────────────────────────── */

/** Glossy balloons on wavy strings drifting up through the containing (relative) element. */
export function Balloons({ colors, count = 9 }: { colors: string[]; count?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const size = 38 + seeded(i + 700) * 30;
        const color = colors[i % colors.length];
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${4 + seeded(i + 710) * 90}%`, bottom: -140 }}
            animate={{ y: ["0vh", "-125vh"], x: [0, (seeded(i + 720) - 0.5) * 60, 0], rotate: [-4, 4, -4] }}
            transition={{ duration: 14 + seeded(i + 730) * 10, delay: seeded(i + 740) * 10, repeat: Infinity, ease: "linear" }}
          >
            <svg width={size} height={size * 2.2} viewBox="0 0 40 88">
              <ellipse cx="20" cy="22" rx="17" ry="21" fill={color} opacity="0.9" />
              <ellipse cx="13" cy="14" rx="4" ry="7" fill="#ffffff" opacity="0.35" transform="rotate(-20 13 14)" />
              <path d="M17 42 L23 42 L20 46 Z" fill={color} />
              <path d="M20 46 C 14 56, 26 64, 18 74 C 14 80, 22 84, 20 88" stroke={color} strokeOpacity="0.6" strokeWidth="1" fill="none" />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Sky lanterns ────────────────────────────────────────────────────────── */

/** Warm colour palette — each lantern picks a tint for variety. */
const LANTERN_TINTS = [
  { core: "#fffbe6", mid: "#fff3c4", body: "#e8a030" },  // classic gold
  { core: "#fff5f0", mid: "#ffd6c4", body: "#c9503a" },  // soft red
  { core: "#fffde8", mid: "#ffe8a0", body: "#d4920e" },  // deep amber
  { core: "#fff8f2", mid: "#ffc8a0", body: "#b85e30" },  // burnt orange
  { core: "#fff6f6", mid: "#ffc0c0", body: "#a83030" },  // crimson
];

/**
 * Three lantern shape variants rendered as detailed SVGs:
 *  - barrel  (traditional kongming — trapezoidal paper body)
 *  - globe   (round paper globe lantern)
 *  - wide    (broad flat barrel — the classic sky-release shape)
 *
 * Each has: warm radial glow, structural ribs, top cap, bottom flame.
 * Gradient IDs are scoped per-instance to avoid SVG conflicts.
 */
function LanternSVG({ variant, id, _color, glow, size, tint }: { variant: number; id: string; _color?: string; glow: string; size: number; tint: number }) {
  const t = LANTERN_TINTS[tint % LANTERN_TINTS.length];
  const shared = (
    <defs>
      <radialGradient id={`lg-${id}`} cx="50%" cy="55%" r="55%">
        <stop offset="0%" stopColor={t.core} />
        <stop offset="28%" stopColor={t.mid} />
        <stop offset="60%" stopColor={glow} />
        <stop offset="100%" stopColor={t.body} />
      </radialGradient>
      <radialGradient id={`fl-${id}`} cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fffde0" />
        <stop offset="100%" stopColor={glow} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
  const flame = <ellipse cx="20" cy="46" rx="4.5" ry="2" fill={`url(#fl-${id})`} className="animate-pulse" style={{ animationDuration: "1.8s" }} />;

  if (variant === 1) {
    // Globe lantern
    return (
      <svg width={size} height={size * 1.3} viewBox="0 0 40 52" fill="none">
        {shared}
        <ellipse cx="20" cy="24" rx="16" ry="19" fill={`url(#lg-${id})`} />
        <path d="M20 5 V43" stroke={t.body} strokeOpacity="0.2" strokeWidth="0.5" />
        <path d="M10 8 Q20 28 10 42 M30 8 Q20 28 30 42" stroke={t.body} strokeOpacity="0.15" strokeWidth="0.5" />
        <rect x="16" y="4" width="8" height="3" rx="1" fill={t.body} opacity="0.55" />
        <line x1="20" y1="7" x2="20" y2="5" stroke={t.body} strokeWidth="0.6" opacity="0.45" />
        {flame}
      </svg>
    );
  }
  if (variant === 2) {
    // Wide barrel — the classic flat kongming release shape
    return (
      <svg width={size * 1.15} height={size * 1.2} viewBox="0 0 46 48" fill="none">
        {shared}
        <path d="M6 6 H40 L43 36 Q23 46 3 36 Z" fill={`url(#lg-${id})`} />
        <path d="M15 6 L13 36 M31 6 L33 36 M23 6 V40" stroke={t.body} strokeOpacity="0.16" strokeWidth="0.5" />
        <path d="M6 18 Q23 22 40 18" stroke={t.body} strokeOpacity="0.1" strokeWidth="0.4" />
        <rect x="5" y="4" width="36" height="3" rx="1" fill={t.body} opacity="0.4" />
        <line x1="5" y1="7" x2="41" y2="7" stroke={t.body} strokeOpacity="0.25" strokeWidth="0.5" />
        <path d="M16 4 L23 1 L30 4" stroke={t.body} strokeOpacity="0.25" strokeWidth="0.5" fill="none" />
        <ellipse cx="23" cy="40" rx="5" ry="2" fill={`url(#fl-${id})`} className="animate-pulse" style={{ animationDuration: "2s" }} />
        <path d="M23 42 C21 45 25 47 23 50" stroke={t.body} strokeOpacity="0.3" strokeWidth="0.5" fill="none" />
      </svg>
    );
  }
  // Barrel (traditional kongming) — default
  return (
    <svg width={size} height={size * 1.35} viewBox="0 0 40 54" fill="none">
      {shared}
      <path d="M10 6 H30 L35 40 Q20 50 5 40 Z" fill={`url(#lg-${id})`} />
      <path d="M15 6 L13 40 M25 6 L27 40 M20 6 V44" stroke={t.body} strokeOpacity="0.18" strokeWidth="0.5" />
      <path d="M10 20 Q20 23 30 20" stroke={t.body} strokeOpacity="0.1" strokeWidth="0.4" />
      <rect x="9" y="4" width="22" height="3" rx="1" fill={t.body} opacity="0.45" />
      <line x1="9" y1="7" x2="31" y2="7" stroke={t.body} strokeOpacity="0.3" strokeWidth="0.6" />
      <path d="M16 4 L20 1 L24 4" stroke={t.body} strokeOpacity="0.3" strokeWidth="0.5" fill="none" />
      {flame}
      <path d="M20 48 C18 51 22 53 20 56" stroke={t.body} strokeOpacity="0.3" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

/** CSS keyframes injected once for the lantern rise + sway animation. */
const LANTERN_KEYFRAMES = `
@keyframes _lr{0%{transform:translateY(0) translateX(0);opacity:0}
10%{opacity:var(--lo)}85%{opacity:var(--lo)}
100%{transform:translateY(-125vh) translateX(var(--lx));opacity:0}}
@keyframes _lf{0%,100%{opacity:.55}50%{opacity:1}}`;
let keyframesInjected = false;

/**
 * GPU-composited sky lanterns. Rise animation runs entirely on the compositor
 * via CSS @keyframes + will-change, so 30 lanterns cost almost nothing.
 */
export function Lanterns({ color: _color, glow, count = 8 }: { color: string; glow: string; count?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const festival = count > 14;
  const total = Math.min(count, 35);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {!keyframesInjected && <style>{LANTERN_KEYFRAMES}</style>}
      {(() => { keyframesInjected = true; return null; })()}
      {Array.from({ length: total }, (_, i) => {
        const band = festival ? (i % 3) : 1;
        const sz = festival
          ? band === 0 ? 12 + seeded(i + 900) * 10
          : band === 2 ? 32 + seeded(i + 900) * 20
          : 20 + seeded(i + 900) * 14
          : 24 + seeded(i + 900) * 24;
        const glowR = festival ? sz * (band === 2 ? 0.55 : 0.25) : sz * 0.45;
        const peak = festival ? (band === 0 ? 0.5 : band === 2 ? 1 : 0.75) : 0.92;
        const dur = festival ? 20 + seeded(i + 930) * 16 : 24 + seeded(i + 930) * 12;
        const del = seeded(i + 940) * (festival ? 20 : 14);
        const sway = (seeded(i + 920) - 0.5) * (festival ? 35 : 50);
        return (
          <div
            key={i}
            className="absolute will-change-transform"
            style={{
              left: `${2 + seeded(i + 910) * 96}%`,
              bottom: -90,
              filter: `drop-shadow(0 0 ${glowR}px ${glow})`,
              animation: `_lr ${dur}s ${del}s linear infinite`,
              "--lo": peak,
              "--lx": `${sway}px`,
            } as React.CSSProperties}
          >
            <LanternSVG variant={i % 3} id={`l${i}`} glow={glow} size={sz} tint={i} />
          </div>
        );
      })}
    </div>
  );
}

/* ─── Bokeh lights ────────────────────────────────────────────────────────── */

/** Large, blurred light orbs that slowly breathe — adds cinematic depth. */
export function BokehLights({ color, count = 7 }: { color: string; count?: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const size = 80 + seeded(i + 300) * 220;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${seeded(i + 310) * 100}%`,
              top: `${seeded(i + 320) * 100}%`,
              width: size,
              height: size,
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              filter: "blur(8px)",
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={reduce ? { opacity: 0.25 } : { opacity: [0.12, 0.38, 0.12], scale: [0.9, 1.08, 0.9] }}
            transition={{ duration: 7 + seeded(i + 330) * 6, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
          />
        );
      })}
    </div>
  );
}

/* ─── Celebration burst ───────────────────────────────────────────────────── */

/** One-shot radial burst of hearts and petals. Re-mount (change `key`) to replay. */
export function CelebrationBurst({ colors }: { colors: string[] }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center" aria-hidden>
      {Array.from({ length: 28 }, (_, i) => {
        const angle = (i / 28) * Math.PI * 2 + seeded(i) * 0.4;
        const dist = 140 + seeded(i + 7) * 260;
        const isHeart = i % 3 === 0;
        const color = colors[i % colors.length];
        return (
          <motion.div
            key={i}
            className="absolute"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist + 120,
              scale: [0, 1.2, 1],
              opacity: [1, 1, 0],
              rotate: (seeded(i + 3) - 0.5) * 540,
            }}
            transition={{ duration: 1.9, ease: [0.1, 0.8, 0.3, 1] }}
          >
            {isHeart ? (
              <svg width={18} height={18} viewBox="0 0 24 24" fill={color}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg width={12} height={16} viewBox="0 0 20 26" fill={color}>
                <path d="M10 0 C 18 6, 20 16, 10 26 C 0 16, 2 6, 10 0 Z" />
              </svg>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
