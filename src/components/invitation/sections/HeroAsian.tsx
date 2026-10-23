"use client";

/**
 * East Asian signature heroes, inspired by Chinese, Japanese, Korean and
 * Vietnamese wedding invitations:
 *
 *  - DoorsHero   Chinese lacquered gate doors with gold studs and a 囍 medallion
 *                split across the seam. The medallion glows, then the doors swing
 *                open in 3D onto hanging lanterns.
 *  - PosterHero  Photo-first poster (Korean mobile 청첩장 / Vietnamese thiệp cưới):
 *                the photo opens like a cinema shutter, with script "Save the date"
 *                and the names set over it.
 *  - EnsoHero    Japanese ink: a brush ensō circle paints itself, then a red
 *                hanko seal stamps beside the names. Seigaiha waves on wave ornament.
 *  - ShojiHero   Japanese sliding paper screens part to reveal a sakura branch
 *                in bloom.
 *  - BojagiHero  Korean bojagi wrapping cloth: the knot loosens and four patchwork
 *                flaps unfold to reveal the names.
 *
 * Timeline per AGENTS.md section 4.1: ornaments first, one signature moment of
 * at most 3s, names by ~2.5s. Reduced motion renders the opened end state.
 */

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import AmbientLayer from "../effects/Ambient";
import { EASE_OUT, alpha, formatDotDate, formatLongDate, luminance, mix, type InvitationPalette } from "../utils";
import { Ampersand, CenterNames, RisingText, useEventCopy, useEyebrow, useInvitationCopy } from "./HeroParts";
import type { LayoutProps } from "./Hero";
import type { EventType } from "@/types/database";

/** Brush font subset for the few auspicious glyphs we draw (tiny download). */
const GLYPH_FONT_URL = `https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&text=${encodeURIComponent("囍壽福寿")}&display=swap`;
const GLYPH_FONT = "'Ma Shan Zheng', 'Noto Serif SC', 'Songti SC', serif";

/** Auspicious character for the occasion: 囍 double happiness, 壽 longevity, 福 fortune. */
export function auspiciousGlyph(type: EventType): string {
  if (type === "wedding" || type === "engagement" || type === "anniversary") return "囍";
  if (type === "birthday") return "壽";
  return "福";
}

/** Loads the brush glyph font (subset to a handful of characters). */
function GlyphFont() {
  // eslint-disable-next-line @next/next/no-page-custom-font
  return <link rel="stylesheet" href={GLYPH_FONT_URL} />;
}

/** Text colour (dark or light) that stays readable on a given fill. */
function inkOn(fill: string): string {
  return luminance(fill) > 0.45 ? "#2a1a14" : "#fff8ec";
}

/* ═══════════════════════════════ Lacquer doors ═════════════════════════════ */

/** Hanging paper lantern with a gentle sway (decorative). */
function HangingLantern({ color, gold, className, delay }: { color: string; gold: string; className: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute top-0 z-[5] ${className}`}
      style={{ originY: 0 }}
      initial={{ y: -160 }}
      animate={{ y: 0, rotate: reduce ? 0 : [-3, 3, -3] }}
      transition={{ y: { duration: 1.2, delay, ease: EASE_OUT }, rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: delay + 1.2 } }}
    >
      <svg width="64" height="170" viewBox="0 0 64 170" style={{ filter: `drop-shadow(0 0 18px ${alpha(color, 0.6)})` }}>
        <line x1="32" y1="0" x2="32" y2="52" stroke={gold} strokeWidth="1.5" />
        <rect x="22" y="50" width="20" height="8" rx="2" fill={gold} />
        <ellipse cx="32" cy="92" rx="28" ry="36" fill={color} />
        {[-16, -6, 6, 16].map((dx) => (
          <path key={dx} d={`M${32 + dx * 0.4} 58 Q ${32 + dx * 1.7} 92 ${32 + dx * 0.4} 126`} stroke={mix(color, "#000000", 0.25)} strokeWidth="1" fill="none" />
        ))}
        <ellipse cx="24" cy="80" rx="6" ry="14" fill="#ffffff" opacity="0.18" />
        <rect x="22" y="126" width="20" height="8" rx="2" fill={gold} />
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={26 + i * 2} y1={134} x2={25 + i * 2.2} y2={166} stroke={gold} strokeWidth="1.2" />
        ))}
      </svg>
    </motion.div>
  );
}

/** One lacquer door: gold frame, lattice, stud rows, ring knocker and half of the medallion. */
function LacquerDoor({ side, lacquer, gold, glyph, t }: { side: "left" | "right"; lacquer: string; gold: string; glyph: string; t: number }) {
  const left = side === "left";
  const lattice = `repeating-linear-gradient(0deg, transparent 0 22px, ${alpha(gold, 0.18)} 22px 24px), repeating-linear-gradient(90deg, transparent 0 22px, ${alpha(gold, 0.18)} 22px 24px)`;
  return (
    <motion.div
      aria-hidden
      className={`absolute inset-y-0 z-30 w-1/2 overflow-hidden ${left ? "left-0" : "right-0"}`}
      style={{
        originX: left ? 0 : 1,
        background: `linear-gradient(${left ? 90 : 270}deg, ${mix(lacquer, "#000000", 0.35)} 0%, ${lacquer} 18%, ${mix(lacquer, "#ffffff", 0.06)} 60%, ${mix(lacquer, "#000000", 0.2)} 100%)`,
        boxShadow: `inset 0 0 0 10px ${mix(lacquer, "#000000", 0.25)}, inset 0 0 0 13px ${gold}`,
      }}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: left ? -108 : 108 }}
      transition={{ duration: 1.9 * t, delay: 1.1 * t, ease: [0.65, 0, 0.35, 1] }}
    >
      {/* Carved lattice panel */}
      <div className="absolute inset-x-[14%] top-[10%] h-[34%]" style={{ backgroundImage: lattice, border: `2px solid ${alpha(gold, 0.6)}` }} />
      <div className="absolute inset-x-[14%] bottom-[8%] h-[30%]" style={{ border: `2px solid ${alpha(gold, 0.45)}`, background: alpha("#000000", 0.08) }} />
      {/* Gold studs */}
      <div className="absolute inset-x-[18%] top-[48%] grid grid-cols-4 gap-y-4" style={{ justifyItems: "center" }}>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="h-3 w-3 rounded-full" style={{ background: `radial-gradient(circle at 35% 30%, ${mix(gold, "#ffffff", 0.6)}, ${gold} 55%, ${mix(gold, "#000000", 0.35)})` }} />
        ))}
      </div>
      {/* Ring knocker near the seam */}
      <div className={`absolute top-[56%] ${left ? "right-[9%]" : "left-[9%]"} flex h-12 w-12 items-center justify-center rounded-full`} style={{ border: `4px solid ${gold}`, boxShadow: `0 4px 10px ${alpha("#000000", 0.4)}` }}>
        <span className="h-4 w-4 rounded-full" style={{ background: gold }} />
      </div>
      {/* Half of the medallion: centred on the seam, clipped by this door */}
      <div
        className="absolute top-[20%] flex h-28 w-28 items-center justify-center rounded-full md:h-36 md:w-36"
        style={{
          [left ? "right" : "left"]: 0,
          transform: `translateX(${left ? "50%" : "-50%"})`,
          background: `radial-gradient(circle, ${mix(gold, "#ffffff", 0.25)} 0%, ${gold} 60%, ${mix(gold, "#000000", 0.3)} 100%)`,
          boxShadow: `0 0 0 4px ${mix(lacquer, "#000000", 0.3)}, 0 0 30px ${alpha(gold, 0.6)}`,
        }}
      >
        <span className="text-6xl leading-none md:text-7xl" style={{ fontFamily: GLYPH_FONT, color: lacquer }}>
          {glyph}
        </span>
      </div>
    </motion.div>
  );
}

export function DoorsHero({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const reduce = useReducedMotion();
  const t = reduce ? 0 : 1;
  const { eventType } = useEventCopy();
  const glyph = auspiciousGlyph(eventType);
  const eyebrow = useEyebrow("Double happiness");
  const lacquer = palette.isDark ? mix(palette.background, "#a3161c", 0.45) : mix(palette.accent, "#9b1b1f", 0.7);
  const gold = luminance(palette.primary) > 0.3 ? palette.primary : mix(palette.primary, "#d4a445", 0.6);
  // Lanterns glow brighter than the lacquer so they read on red backgrounds.
  const lantern = mix(lacquer, "#ff5a3c", 0.45);

  return (
    <>
      <GlyphFont />
      {/* Warm courtyard light behind the doors */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 60% 55% at 50% 45%, ${alpha(gold, palette.isDark ? 0.28 : 0.22)} 0%, transparent 70%)` }}
      />
      {/* Faint auspicious watermark */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 select-none text-[min(80vw,70vh)] leading-none"
        style={{ fontFamily: GLYPH_FONT, color: alpha(palette.primary, palette.isDark ? 0.08 : 0.06), x: "-50%", y: "-50%" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 2 * t }}
      >
        {glyph}
      </motion.span>
      <AmbientLayer palette={palette} intensity={0.8} />
      <HangingLantern color={lantern} gold={gold} className="left-[6%] md:left-[14%]" delay={2.4 * t} />
      <HangingLantern color={lantern} gold={gold} className="right-[6%] md:right-[14%]" delay={2.6 * t} />

      <motion.div className="relative z-10 px-6 pt-10" style={{ y: contentY, opacity: contentOpacity }}>
        <CenterNames palette={palette} wedding={wedding} delay={2.3 * t} eyebrow={eyebrow} />
      </motion.div>

      {/* The doors (with perspective) */}
      <div className="pointer-events-none absolute inset-0 z-30" style={{ perspective: 1800 }}>
        <LacquerDoor side="left" lacquer={lacquer} gold={gold} glyph={glyph} t={t} />
        <LacquerDoor side="right" lacquer={lacquer} gold={gold} glyph={glyph} t={t} />
        {/* Medallion glow just before the doors part */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-[20%] h-36 w-36 rounded-full md:h-44 md:w-44"
            style={{ background: `radial-gradient(circle, ${alpha("#fff3c4", 0.9)} 0%, transparent 65%)`, marginTop: -16, x: "-50%" }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.4, 1.8] }}
            transition={{ duration: 1.4, delay: 0.3, times: [0, 0.6, 1] }}
          />
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════ Photo poster ══════════════════════════════ */

export function PosterHero({ wedding, palette, photos, contentY, contentOpacity }: LayoutProps) {
  const reduce = useReducedMotion();
  const t = reduce ? 0 : 1;
  const { twoNames, copy, inviteeName } = useEventCopy();
  const ui = useInvitationCopy();
  const headline = useEyebrow("Save the date");
  const korean = palette.style.culture === "korean";
  const ink = "#ffffff";
  const title = twoNames ? `${wedding.partner1_name} and ${wedding.partner2_name}` : wedding.partner1_name;

  return (
    <div className="relative z-10 flex min-h-[100svh] w-full items-stretch justify-center px-3 pb-3 pt-16 md:px-10 md:pb-8 md:pt-20">
      <motion.div
        className="relative w-full max-w-5xl overflow-hidden"
        style={{ borderRadius: palette.radius.card, boxShadow: `0 30px 80px -30px ${alpha("#000000", 0.6)}` }}
        initial={{ clipPath: "inset(50% 0% 50% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1.8 * t, delay: 0.3 * t, ease: [0.77, 0, 0.18, 1] }}
      >
        <motion.div className="absolute inset-0" initial={{ scale: 1.18 }} animate={{ scale: 1.02 }} transition={{ duration: 9 * t, ease: "easeOut" }}>
          <Image src={photos[0]} alt={title} fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${alpha("#000000", 0.45)} 0%, transparent 28%, transparent 52%, ${alpha("#000000", 0.7)} 100%)` }} />

        <motion.div className="relative flex h-full min-h-[calc(100svh-5.5rem)] flex-col justify-between px-6 pb-24 pt-6 text-center md:p-12" style={{ y: contentY, opacity: contentOpacity, color: ink }}>
          <div>
            {inviteeName && (
              <motion.p
                className="mb-2 text-2xl md:text-3xl"
                style={{ fontFamily: palette.scriptFont, textShadow: "0 2px 18px rgba(0,0,0,0.35)" }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 * t, duration: 1 }}
              >
                {ui.dear(inviteeName)}
              </motion.p>
            )}
            <motion.p
              className={korean ? "text-[11px] uppercase tracking-[0.5em]" : "text-4xl md:text-6xl"}
              style={{ fontFamily: korean ? undefined : palette.scriptFont, textShadow: "0 2px 18px rgba(0,0,0,0.35)" }}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 * t, duration: 1 }}
            >
              {inviteeName ? ui.youAreInvitedTo(copy.label) : headline}
            </motion.p>
            {wedding.wedding_date && (
              <motion.p
                className="mt-3 text-sm tracking-[0.4em] md:text-base"
                style={{ fontFamily: palette.displayFont }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 1.9 * t, duration: 1 }}
              >
                {formatDotDate(wedding.wedding_date).replace(/ · /g, ".")}
              </motion.p>
            )}
          </div>

          <div>
            <h1 className="font-light leading-[0.95]" style={{ fontFamily: palette.displayFont, textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}>
              <span className="block text-[clamp(2.75rem,10vw,6.5rem)]">
                <RisingText text={wedding.partner1_name} delay={2 * t} />
              </span>
              <Ampersand palette={{ ...palette, primary: mix(palette.primary, "#ffffff", 0.5) }} delay={2.4 * t} className="my-1 text-4xl md:text-6xl" />
              {twoNames && (
                <span className="block text-[clamp(2.75rem,10vw,6.5rem)]">
                  <RisingText text={wedding.partner2_name} delay={2.6 * t} />
                </span>
              )}
            </h1>
            <motion.div
              className="mx-auto mt-6 flex max-w-md flex-col items-center gap-1 text-xs uppercase tracking-[0.3em]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3 * t, duration: 1 }}
            >
              <span>{wedding.event_title || copy.tagline(wedding.partner1_name)}</span>
              {wedding.wedding_date && <span className="opacity-80">{formatLongDate(wedding.wedding_date, null, ui.dateLocale)}</span>}
              {wedding.venue_name && <span className="opacity-80">{wedding.venue_name}</span>}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════ Ensō ══════════════════════════════════════ */

/** Seigaiha (blue ocean wave) pattern band along the bottom, fading upward. */
function Seigaiha({ color, ground }: { color: string; ground: string }) {
  // Classic tile: overlapping concentric half-circles; later circles cover earlier ones.
  const rings = (cx: number, cy: number) =>
    [20, 14, 8].map((r) => <circle key={`${cx}-${cy}-${r}`} cx={cx} cy={cy} r={r} fill={ground} stroke={color} strokeWidth={1.1} />);
  return (
    <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full md:h-56" aria-hidden>
      <defs>
        <pattern id="seigaiha" width={40} height={20} patternUnits="userSpaceOnUse">
          {rings(0, 10)}
          {rings(40, 10)}
          {rings(20, 20)}
        </pattern>
        <linearGradient id="seigaiha-fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="seigaiha-mask">
          <rect width="100%" height="100%" fill="url(#seigaiha-fade)" />
        </mask>
      </defs>
      <motion.rect width="100%" height="100%" fill="url(#seigaiha)" mask="url(#seigaiha-mask)" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 2.5, delay: 1 }} />
    </svg>
  );
}

export function EnsoHero({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const reduce = useReducedMotion();
  const t = reduce ? 0 : 1;
  const { twoNames, eventType } = useEventCopy();
  const eyebrow = useEyebrow("Two paths, one circle");
  const sumi = palette.isDark ? mix(palette.primary, "#ffffff", 0.2) : mix(palette.ink, "#000000", 0.2);
  const hanko = palette.isDark ? mix(palette.accent, "#c0392b", 0.5) : palette.primary;
  const seal = eventType === "wedding" || eventType === "engagement" ? "寿" : twoNames ? `${wedding.partner1_name.charAt(0)}${wedding.partner2_name.charAt(0)}` : wedding.partner1_name.charAt(0);
  // Nearly-closed brush circle (gap at upper right, like a real ensō).
  const enso = "M 236 92 C 268 150, 250 236, 176 262 C 100 288, 30 238, 26 162 C 22 86, 84 30, 158 30 C 196 30, 222 44, 238 62";

  return (
    <>
      <GlyphFont />
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 55% 50% at 50% 45%, ${alpha(palette.isDark ? palette.primary : "#ffffff", palette.isDark ? 0.12 : 0.6)} 0%, transparent 70%)` }} />
      {palette.style.ornament === "wave" && <Seigaiha color={alpha(palette.primary, palette.isDark ? 0.55 : 0.4)} ground={palette.background} />}
      <AmbientLayer palette={palette} intensity={0.6} />

      <motion.div className="relative z-10 flex flex-col items-center px-6 text-center" style={{ y: contentY, opacity: contentOpacity }}>
        <div className="relative flex aspect-square w-[min(88vw,66vh,560px)] items-center justify-center">
          <svg viewBox="0 0 290 290" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <filter id="brush" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
                <feDisplacementMap in="SourceGraphic" scale="5" />
              </filter>
            </defs>
            <motion.path d={enso} fill="none" stroke={sumi} strokeWidth={16} strokeLinecap="round" filter="url(#brush)" initial={{ pathLength: 0, opacity: 0.95 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2 * t, delay: 0.4 * t, ease: [0.45, 0, 0.2, 1] }} />
            <motion.path d={enso} fill="none" stroke={sumi} strokeOpacity={0.35} strokeWidth={4} strokeDasharray="2 6" transform="translate(5 3)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2 * t, delay: 0.55 * t, ease: [0.45, 0, 0.2, 1] }} />
          </svg>

          <div className="relative flex flex-col items-center">
            <motion.p className="text-[10px] uppercase tracking-[0.5em] md:text-xs" style={{ color: palette.inkMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 * t, duration: 1.2 }}>
              {eyebrow}
            </motion.p>
            <h1 className="mt-4 font-light leading-[1.02]" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
              <span className="block text-[clamp(2.4rem,8.5vw,5rem)]">
                <RisingText text={wedding.partner1_name} delay={1.8 * t} />
              </span>
              <Ampersand palette={palette} delay={2.2 * t} className="text-3xl md:text-5xl" />
              {twoNames && (
                <span className="block text-[clamp(2.4rem,8.5vw,5rem)]">
                  <RisingText text={wedding.partner2_name} delay={2.4 * t} />
                </span>
              )}
            </h1>
            {wedding.wedding_date && (
              <motion.p className="mt-5 text-xs tracking-[0.4em]" style={{ color: palette.inkMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 * t, duration: 1 }}>
                {formatDotDate(wedding.wedding_date)}
              </motion.p>
            )}
          </div>

          {/* Hanko seal stamps in after the brush stroke */}
          <motion.div
            aria-hidden
            className="absolute bottom-[12%] right-[10%] flex h-14 w-14 items-center justify-center md:h-16 md:w-16"
            style={{ background: hanko, borderRadius: 6, boxShadow: `inset 0 0 0 3px ${alpha("#ffffff", 0.25)}`, rotate: -6 }}
            initial={{ opacity: 0, scale: 1.8 }}
            animate={{ opacity: 0.92, scale: 1 }}
            transition={{ delay: 2.7 * t, type: "spring", stiffness: 380, damping: 18 }}
          >
            <span className="text-3xl leading-none md:text-4xl" style={{ fontFamily: seal.length === 1 && /[^\x00-\x7F]/.test(seal) ? GLYPH_FONT : palette.displayFont, color: inkOn(hanko) }}>
              {seal}
            </span>
          </motion.div>
        </div>
        {wedding.venue_name && (
          <motion.p className="mt-2 text-xs uppercase tracking-[0.35em]" style={{ color: palette.inkMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.1 * t }}>
            {wedding.venue_name}
          </motion.p>
        )}
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════ Shoji screens ═════════════════════════════ */

/** A sakura branch drawing in from the top corner with blossoms popping open. */
function SakuraBranch({ palette, t }: { palette: InvitationPalette; t: number }) {
  const bark = palette.isDark ? mix(palette.background, "#ffffff", 0.35) : mix(palette.ink, "#6b4a2f", 0.5);
  const blossoms: [number, number, number][] = [
    [300, 70, 1], [262, 118, 0.8], [220, 96, 1.1], [182, 150, 0.9], [140, 128, 1], [110, 184, 0.75], [330, 150, 0.85], [250, 40, 0.7], [70, 160, 0.9],
  ];
  return (
    <svg viewBox="0 0 400 260" className="pointer-events-none absolute right-0 top-0 w-[min(95vw,620px)]" aria-hidden>
      <motion.path
        d="M410 20 C 340 40, 300 70, 250 100 C 200 130, 160 130, 120 170 C 100 190, 80 175, 60 168 M250 100 C 270 130, 300 140, 340 150 M300 66 C 290 50, 270 42, 250 40"
        fill="none"
        stroke={bark}
        strokeWidth={5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2 * t, delay: 1.6 * t, ease: EASE_OUT }}
      />
      {blossoms.map(([x, y, s], i) => (
        // Outer <g> positions; inner motion.g scales (Framer owns its transform).
        <g key={i} transform={`translate(${x} ${y})`}>
          <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: s * 1.3 }} transition={{ delay: (2.2 + i * 0.12) * t, type: "spring", stiffness: 200, damping: 12 }}>
            {[0, 72, 144, 216, 288].map((a) => (
              <path key={a} d="M0 0 C -6 -6, -5 -14, 0 -15 C 5 -14, 6 -6, 0 0 Z" fill={palette.petals[(i + a / 72) % 3]} transform={`rotate(${a})`} />
            ))}
            <circle r="2.6" fill={mix(palette.primary, "#f3d27a", 0.5)} />
          </motion.g>
        </g>
      ))}
    </svg>
  );
}

/** One sliding paper screen with a kumiko lattice and a round pull. */
function ShojiPanel({ side, paper, wood, t }: { side: "left" | "right"; paper: string; wood: string; t: number }) {
  const left = side === "left";
  const kumiko = `repeating-linear-gradient(0deg, transparent 0 62px, ${wood} 62px 66px), repeating-linear-gradient(90deg, transparent 0 46px, ${wood} 46px 50px)`;
  return (
    <motion.div
      aria-hidden
      className={`absolute inset-y-0 z-30 w-1/2 ${left ? "left-0" : "right-0"}`}
      style={{ background: `${kumiko}, ${paper}`, boxShadow: `inset 0 0 0 10px ${wood}, ${left ? "6px" : "-6px"} 0 30px ${alpha("#000000", 0.25)}` }}
      initial={{ x: "0%" }}
      animate={{ x: left ? "-101%" : "101%" }}
      transition={{ duration: 1.7 * t, delay: 1 * t, ease: [0.7, 0, 0.3, 1] }}
    >
      <span className={`absolute top-1/2 h-10 w-6 -translate-y-1/2 rounded-full ${left ? "right-5" : "left-5"}`} style={{ border: `3px solid ${wood}`, background: alpha(wood, 0.25) }} />
    </motion.div>
  );
}

export function ShojiHero({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const reduce = useReducedMotion();
  const t = reduce ? 0 : 1;
  const eyebrow = useEyebrow("Under the cherry blossoms");
  const paper = palette.isDark ? mix(palette.background, "#f4ede0", 0.82) : mix(palette.background, "#ffffff", 0.75);
  const wood = palette.isDark ? mix(palette.background, "#000000", 0.2) : mix(palette.ink, palette.primary, 0.25);

  return (
    <>
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 65% 55% at 50% 50%, ${alpha(palette.primary, palette.isDark ? 0.2 : 0.1)} 0%, transparent 70%)` }} />
      {/* Rising sun disc */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[8%] top-[14%] h-28 w-28 rounded-full md:h-40 md:w-40"
        style={{ background: alpha(palette.primary, palette.isDark ? 0.5 : 0.3) }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 * t, duration: 1.6, ease: EASE_OUT }}
      />
      <SakuraBranch palette={palette} t={t} />
      <AmbientLayer palette={palette} intensity={0.7} />
      <motion.div className="relative z-10 px-6 pt-8" style={{ y: contentY, opacity: contentOpacity }}>
        <CenterNames palette={palette} wedding={wedding} delay={2.1 * t} eyebrow={eyebrow} size="text-[clamp(3rem,11vw,6.5rem)]" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        <ShojiPanel side="left" paper={paper} wood={wood} t={t} />
        <ShojiPanel side="right" paper={paper} wood={wood} t={t} />
      </div>
    </>
  );
}

/* ═══════════════════════════════ Bojagi ════════════════════════════════════ */

/** Patchwork (jogakbo) fill built from the palette, in obangsaek spirit. */
function patchwork(palette: InvitationPalette): string {
  // Soft, ramie-like tones: palette colours washed toward the background.
  const wash = (c: string) => mix(c, palette.background, 0.28);
  const c = [
    wash(palette.primary),
    wash(palette.accent),
    wash(mix(palette.primary, "#f2c94c", 0.55)),
    wash(mix(palette.accent, "#ffffff", 0.45)),
    wash(mix(palette.background, "#ffffff", 0.4)),
  ];
  const stitch = alpha("#ffffff", 0.7);
  // Irregular patches: two offset conic splits with thin stitched seams.
  return [
    `linear-gradient(90deg, transparent 37.6%, ${stitch} 37.6% 38.4%, transparent 38.4%)`,
    `linear-gradient(0deg, transparent 61.6%, ${stitch} 61.6% 62.4%, transparent 62.4%)`,
    `conic-gradient(from 0deg at 38% 62%, ${c[0]} 0 25%, ${c[3]} 0 50%, ${c[1]} 0 75%, ${c[2]} 0)`,
  ].join(", ") + `, ${c[4]}`;
}

/** One triangular flap of the wrapping cloth, folding outward around its outer edge. */
function Flap({ edge, fill, delay, t }: { edge: "top" | "right" | "bottom" | "left"; fill: string; delay: number; t: number }) {
  const clip = { top: "polygon(0 0, 100% 0, 50% 50%)", right: "polygon(100% 0, 100% 100%, 50% 50%)", bottom: "polygon(0 100%, 100% 100%, 50% 50%)", left: "polygon(0 0, 0 100%, 50% 50%)" }[edge];
  const origin = { top: "50% 0%", right: "100% 50%", bottom: "50% 100%", left: "0% 50%" }[edge];
  const open = { top: { rotateX: 178 }, bottom: { rotateX: -178 }, left: { rotateY: -178 }, right: { rotateY: 178 } }[edge];
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 z-20"
      style={{ clipPath: clip, transformOrigin: origin, background: fill, backgroundSize: "210px 170px", backfaceVisibility: "visible" }}
      initial={{ rotateX: 0, rotateY: 0 }}
      animate={open}
      transition={{ duration: 1 * t, delay: delay * t, ease: [0.65, 0, 0.35, 1] }}
    />
  );
}

export function BojagiHero({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const reduce = useReducedMotion();
  const t = reduce ? 0 : 1;
  const { eventType } = useEventCopy();
  const eyebrow = useEyebrow("Wrapped with our families' blessings");
  const fill = patchwork(palette);
  const card = palette.isDark ? mix(palette.background, "#ffffff", 0.08) : mix(palette.background, "#ffffff", 0.6);
  const knot = mix(palette.primary, "#000000", 0.15);

  return (
    <>
      <GlyphFont />
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 55% at 50% 50%, ${alpha(palette.accent, palette.isDark ? 0.2 : 0.14)} 0%, transparent 70%)` }} />
      <AmbientLayer palette={palette} intensity={0.6} />
      <motion.div className="relative z-10 flex flex-col items-center px-6 pt-10" style={{ y: contentY, opacity: contentOpacity }}>
        <div className="relative aspect-square w-[min(84vw,60vh,500px)]" style={{ perspective: 1400 }}>
          {/* The card inside the cloth */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            style={{ background: card, borderRadius: palette.radius.card, border: `1px solid ${alpha(palette.primary, 0.3)}`, outline: `1px solid ${alpha(palette.primary, 0.18)}`, outlineOffset: -10, boxShadow: `0 30px 60px -30px ${alpha("#000000", 0.45)}` }}
          >
            {(eventType === "wedding" || eventType === "engagement") && (
              <motion.span className="text-4xl leading-none md:text-5xl" style={{ fontFamily: GLYPH_FONT, color: palette.primary }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 * t }} aria-hidden>
                囍
              </motion.span>
            )}
            <motion.p className="mt-3 text-[10px] uppercase tracking-[0.4em] md:text-[11px]" style={{ color: palette.inkMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 * t }}>
              {eyebrow}
            </motion.p>
            <h1 className="mt-3 font-light leading-[1.05]" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
              <span className="block text-[clamp(2.2rem,8vw,4.5rem)]">
                <RisingText text={wedding.partner1_name} delay={2.5 * t} />
              </span>
              <Ampersand palette={palette} delay={2.8 * t} className="text-3xl md:text-4xl" />
              {wedding.partner2_name && (
                <span className="block text-[clamp(2.2rem,8vw,4.5rem)]">
                  <RisingText text={wedding.partner2_name} delay={2.9 * t} />
                </span>
              )}
            </h1>
            {wedding.wedding_date && (
              <motion.p className="mt-4 text-xs tracking-[0.35em]" style={{ color: palette.inkMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 * t }}>
                {formatDotDate(wedding.wedding_date)}
              </motion.p>
            )}
          </div>

          {/* Four patchwork flaps unfold outward, one after another */}
          <Flap edge="top" fill={fill} delay={1.2} t={t} />
          <Flap edge="right" fill={fill} delay={1.45} t={t} />
          <Flap edge="bottom" fill={fill} delay={1.7} t={t} />
          <Flap edge="left" fill={fill} delay={1.95} t={t} />

          {/* The knot loosens first */}
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-1/2 z-30"
            style={{ x: "-50%", y: "-50%" }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: [1, 1.15, 0], opacity: [1, 1, 0], rotate: [0, -10, 20] }}
            transition={{ duration: 1.1 * t, delay: 0.3 * t, times: [0, 0.5, 1] }}
          >
            <svg width="120" height="90" viewBox="0 0 120 90">
              <ellipse cx="34" cy="40" rx="30" ry="18" fill={knot} transform="rotate(-18 34 40)" />
              <ellipse cx="86" cy="40" rx="30" ry="18" fill={knot} transform="rotate(18 86 40)" />
              <path d="M54 50 L40 88 M66 50 L80 88" stroke={knot} strokeWidth="10" strokeLinecap="round" />
              <circle cx="60" cy="44" r="12" fill={mix(knot, "#ffffff", 0.15)} />
            </svg>
          </motion.div>
        </div>
        {wedding.venue_name && (
          <motion.p className="mt-8 text-xs uppercase tracking-[0.35em]" style={{ color: palette.inkMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.3 * t }}>
            {wedding.venue_name}
          </motion.p>
        )}
      </motion.div>
    </>
  );
}
