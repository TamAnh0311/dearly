"use client";

/**
 * Deco invitation page — 1920s Great Gatsby luxury. Deep navy background
 * with elaborate SVG Art Deco geometric frames, gold shimmer effects,
 * chevron/fan/sunburst patterns, diamond-shaped countdown, and angular reveals.
 */

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import Link from "next/link";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/* ── animation variants ────────────────────────────────────────────── */

/** SVG stroke draw-in using pathLength. */
const drawLine = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.6, delay: i * 0.15, ease: "easeInOut" },
  }),
};

/** Geometric clip-path inset wipe reveal. */
const clipWipe = {
  hidden: { clipPath: "inset(0 50% 0 50%)" },
  visible: (i: number) => ({
    clipPath: "inset(0 0% 0 0%)",
    transition: {
      duration: 0.9,
      delay: 0.6 + i * 0.22,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/** Diamond countdown box rotate-in. */
const _diamondIn = {
  hidden: { opacity: 0, rotate: 45, scale: 0.5 },
  visible: (i: number) => ({
    opacity: 1,
    rotate: 45,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: 1.4 + i * 0.12,
      type: "spring",
      stiffness: 180,
      damping: 18,
    },
  }),
};

/** Angular section reveal — slides up with slight skew. */
const _angularReveal = {
  hidden: { opacity: 0, y: 60, skewY: 2 },
  visible: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Stagger container for child items. */
const _staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
};

/** Item used in stagger containers. */
const _staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── CSS keyframes ─────────────────────────────────────────────────── */

const keyframes = `
@keyframes decoShimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes decoLineShimmer {
  0%   { background-position: -300% 0; }
  100% { background-position: 300% 0; }
}
@keyframes decoGoldPulse {
  0%, 100% { opacity: 0.15; }
  50%      { opacity: 0.3; }
}
`;

/* ── Art Deco Fan SVG subcomponent ─────────────────────────────────── */

/** Renders a row of Art Deco sunburst fans. */
function DecoFanBand({ gold, count = 16 }: { gold: string; count?: number }) {
  return (
    <svg
      viewBox="0 0 1200 100"
      className="w-full"
      preserveAspectRatio="none"
    >
      {/* Baselines */}
      <line x1="0" y1="1" x2="1200" y2="1" stroke={gold} strokeWidth="0.5" opacity="0.4" />
      <line x1="0" y1="99" x2="1200" y2="99" stroke={gold} strokeWidth="0.5" opacity="0.4" />
      {/* Fan triangles */}
      {Array.from({ length: count }).map((_, i) => {
        const w = 1200 / count;
        const cx = i * w + w / 2;
        return (
          <motion.path
            key={i}
            d={`M${cx},100 L${i * w},0 L${i * w + w},0 Z`}
            fill="none"
            stroke={gold}
            strokeWidth="0.6"
            initial={{ opacity: 0, scaleY: 0 }}
            whileInView={{ opacity: 0.55, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.035 }}
            style={{ transformOrigin: "bottom center" }}
          />
        );
      })}
      {/* Inner arcs for extra detail */}
      {Array.from({ length: count }).map((_, i) => {
        const w = 1200 / count;
        const cx = i * w + w / 2;
        return (
          <motion.path
            key={`arc-${i}`}
            d={`M${cx - w * 0.3},50 Q${cx},15 ${cx + w * 0.3},50`}
            fill="none"
            stroke={gold}
            strokeWidth="0.4"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.03 }}
          />
        );
      })}
    </svg>
  );
}

/* ── Ornamental Divider ────────────────────────────────────────────── */

/** Gold Art Deco divider with diamond center and flanking lines. */
function DecoDivider({ gold }: { gold: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <div className="flex items-center gap-1">
        <div className="h-px w-8" style={{ backgroundColor: gold, opacity: 0.3 }} />
        <div className="h-px w-4" style={{ backgroundColor: gold, opacity: 0.5 }} />
      </div>
      <svg viewBox="0 0 24 24" width="16" height="16">
        <rect
          x="4" y="4" width="16" height="16"
          fill="none" stroke={gold} strokeWidth="1"
          transform="rotate(45 12 12)"
        />
        <rect
          x="7" y="7" width="10" height="10"
          fill={gold} opacity="0.15"
          transform="rotate(45 12 12)"
        />
      </svg>
      <div className="flex items-center gap-1">
        <div className="h-px w-4" style={{ backgroundColor: gold, opacity: 0.5 }} />
        <div className="h-px w-8" style={{ backgroundColor: gold, opacity: 0.3 }} />
      </div>
    </div>
  );
}

/* ── Stepped Corner SVG ────────────────────────────────────────────── */

/** Stepped Art Deco corner ornament. */
function SteppedCorner({
  gold,
  position,
}: {
  gold: string;
  position: "tl" | "tr" | "bl" | "br";
}) {
  const transforms: Record<string, string> = {
    tl: "",
    tr: "scaleX(-1)",
    bl: "scaleY(-1)",
    br: "scale(-1)",
  };
  const positions: Record<string, React.CSSProperties> = {
    tl: { top: 0, left: 0 },
    tr: { top: 0, right: 0 },
    bl: { bottom: 0, left: 0 },
    br: { bottom: 0, right: 0 },
  };
  return (
    <div
      className="pointer-events-none absolute h-20 w-20 md:h-28 md:w-28"
      style={{ ...positions[position], transform: transforms[position] }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path d="M0,0 L40,0 L40,8 L8,8 L8,40 L0,40 Z" fill={gold} opacity="0.25" />
        <path d="M0,0 L25,0 L25,4 L4,4 L4,25 L0,25 Z" fill={gold} opacity="0.15" />
        <path d="M12,12 L50,12 L50,16 L16,16 L16,50 L12,50 Z" fill="none" stroke={gold} strokeWidth="0.5" opacity="0.3" />
        <line x1="0" y1="50" x2="20" y2="50" stroke={gold} strokeWidth="0.5" opacity="0.2" />
        <line x1="50" y1="0" x2="50" y2="20" stroke={gold} strokeWidth="0.5" opacity="0.2" />
      </svg>
    </div>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function DecoInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const gold = theme.colors.primary;
  const navy = theme.colors.secondary;
  const accent = theme.colors.accent;
  const displayFont = `'${theme.fonts.display}', sans-serif`;
  const bodyFont = `'${theme.fonts.body}', sans-serif`;

  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  const navInView = useInView(navRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll();
  const patternY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const parallaxSlow = useTransform(scrollYProgress, [0, 1], [0, -25]);

  const weddingDate = wedding.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundColor: navy,
        fontFamily: bodyFont,
        backgroundImage: `repeating-linear-gradient(
          135deg,
          transparent,
          transparent 28px,
          ${gold}08 28px,
          ${gold}08 29px
        ),
        repeating-linear-gradient(
          45deg,
          transparent,
          transparent 28px,
          ${gold}05 28px,
          ${gold}05 29px
        )`,
      }}
    >
      {/* Inject CSS keyframes */}
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      {/* Diagonal gold shimmer overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            135deg,
            transparent,
            transparent 56px,
            ${gold}06 56px,
            ${gold}06 57px
          )`,
          animation: "decoGoldPulse 6s ease-in-out infinite",
        }}
      />

      {/* ════════════════════ HERO ════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        {/* Stepped corner ornaments */}
        <SteppedCorner gold={gold} position="tl" />
        <SteppedCorner gold={gold} position="tr" />
        <SteppedCorner gold={gold} position="bl" />
        <SteppedCorner gold={gold} position="br" />

        {/* Central Art Deco geometric SVG frame */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 700 800"
            className="absolute h-[88%] w-[88%] max-w-[700px]"
            fill="none"
          >
            {/* Outer rectangle */}
            <motion.rect
              x="20" y="20" width="660" height="760" rx="0"
              stroke={gold} strokeWidth="1.5"
              custom={0} variants={drawLine} initial="hidden" animate="visible"
            />
            {/* Inner rectangle */}
            <motion.rect
              x="36" y="36" width="628" height="728" rx="0"
              stroke={gold} strokeWidth="0.7"
              custom={1} variants={drawLine} initial="hidden" animate="visible"
            />
            {/* Third innermost rectangle — faint */}
            <motion.rect
              x="44" y="44" width="612" height="712" rx="0"
              stroke={gold} strokeWidth="0.3" opacity={0.4}
              custom={1.5} variants={drawLine} initial="hidden" animate="visible"
            />
            {/* Top chevron fan — 5 layers */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.polyline
                key={`tc${i}`}
                points={`${220 - i * 30},${55 + i * 10} 350,${22 + i * 6} ${480 + i * 30},${55 + i * 10}`}
                stroke={gold}
                strokeWidth={i === 0 ? "1" : "0.6"}
                opacity={1 - i * 0.15}
                custom={2 + i * 0.3}
                variants={drawLine}
                initial="hidden"
                animate="visible"
              />
            ))}
            {/* Bottom chevron fan — 5 layers */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.polyline
                key={`bc${i}`}
                points={`${220 - i * 30},${745 - i * 10} 350,${778 - i * 6} ${480 + i * 30},${745 - i * 10}`}
                stroke={gold}
                strokeWidth={i === 0 ? "1" : "0.6"}
                opacity={1 - i * 0.15}
                custom={4 + i * 0.3}
                variants={drawLine}
                initial="hidden"
                animate="visible"
              />
            ))}
            {/* Corner stepped accents — top-left */}
            <motion.path
              d="M20,140 L70,140 L70,95 L115,95 L115,55 L155,55"
              stroke={gold} strokeWidth="1"
              custom={6} variants={drawLine} initial="hidden" animate="visible"
            />
            {/* Corner stepped accents — top-right */}
            <motion.path
              d="M680,140 L630,140 L630,95 L585,95 L585,55 L545,55"
              stroke={gold} strokeWidth="1"
              custom={7} variants={drawLine} initial="hidden" animate="visible"
            />
            {/* Corner stepped accents — bottom-left */}
            <motion.path
              d="M20,660 L70,660 L70,705 L115,705 L115,745 L155,745"
              stroke={gold} strokeWidth="1"
              custom={8} variants={drawLine} initial="hidden" animate="visible"
            />
            {/* Corner stepped accents — bottom-right */}
            <motion.path
              d="M680,660 L630,660 L630,705 L585,705 L585,745 L545,745"
              stroke={gold} strokeWidth="1"
              custom={9} variants={drawLine} initial="hidden" animate="visible"
            />
            {/* Side vertical accent lines */}
            <motion.line
              x1="52" y1="170" x2="52" y2="630"
              stroke={gold} strokeWidth="0.4" opacity={0.5}
              custom={10} variants={drawLine} initial="hidden" animate="visible"
            />
            <motion.line
              x1="648" y1="170" x2="648" y2="630"
              stroke={gold} strokeWidth="0.4" opacity={0.5}
              custom={11} variants={drawLine} initial="hidden" animate="visible"
            />
            {/* Horizontal mid-accents */}
            <motion.line
              x1="80" y1="280" x2="260" y2="280"
              stroke={gold} strokeWidth="0.3" opacity={0.25}
              custom={12} variants={drawLine} initial="hidden" animate="visible"
            />
            <motion.line
              x1="440" y1="280" x2="620" y2="280"
              stroke={gold} strokeWidth="0.3" opacity={0.25}
              custom={12} variants={drawLine} initial="hidden" animate="visible"
            />
            <motion.line
              x1="80" y1="520" x2="260" y2="520"
              stroke={gold} strokeWidth="0.3" opacity={0.25}
              custom={13} variants={drawLine} initial="hidden" animate="visible"
            />
            <motion.line
              x1="440" y1="520" x2="620" y2="520"
              stroke={gold} strokeWidth="0.3" opacity={0.25}
              custom={13} variants={drawLine} initial="hidden" animate="visible"
            />
            {/* Small diamond accent at center top */}
            <motion.rect
              x="343" y="155" width="14" height="14"
              fill="none" stroke={gold} strokeWidth="0.8"
              transform="rotate(45 350 162)"
              custom={14} variants={drawLine} initial="hidden" animate="visible"
            />
          </svg>
        </div>

        {/* Tagline */}
        <motion.p
          custom={0}
          variants={clipWipe}
          initial="hidden"
          animate="visible"
          className="relative z-10 mb-10 text-[10px] uppercase"
          style={{ color: gold, letterSpacing: "0.55em" }}
        >
          The pleasure of your company is requested
        </motion.p>

        {/* Partner 1 — gold shimmer text */}
        <motion.h1
          custom={0}
          variants={clipWipe}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-5xl font-light sm:text-6xl md:text-8xl"
          style={{
            fontFamily: displayFont,
            color: gold,
            letterSpacing: "0.14em",
            background: `linear-gradient(90deg, ${gold} 0%, ${gold} 35%, #FFF5D4 50%, ${gold} 65%, ${gold} 100%)`,
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "decoShimmer 4s ease-in-out infinite",
          }}
        >
          {wedding.partner1_name}
        </motion.h1>

        {/* Diamond ampersand */}
        <motion.div
          className="relative z-10 my-6 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0, rotate: 45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            duration: 0.9,
            delay: 1.0,
            type: "spring",
            stiffness: 150,
            damping: 15,
          }}
        >
          <div className="relative flex h-16 w-16 items-center justify-center">
            <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full">
              <rect
                x="4" y="4" width="56" height="56"
                fill="none" stroke={gold} strokeWidth="1.5"
                transform="rotate(45 32 32)"
              />
              <rect
                x="10" y="10" width="44" height="44"
                fill="none" stroke={gold} strokeWidth="0.5"
                transform="rotate(45 32 32)"
              />
              <rect
                x="14" y="14" width="36" height="36"
                fill={gold} opacity="0.06"
                transform="rotate(45 32 32)"
              />
            </svg>
            <span
              className="relative text-2xl font-light"
              style={{ fontFamily: displayFont, color: gold }}
            >
              &amp;
            </span>
          </div>
        </motion.div>

        {/* Partner 2 — gold shimmer text */}
        <motion.h1
          custom={1}
          variants={clipWipe}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-5xl font-light sm:text-6xl md:text-8xl"
          style={{
            fontFamily: displayFont,
            color: gold,
            letterSpacing: "0.14em",
            background: `linear-gradient(90deg, ${gold} 0%, ${gold} 35%, #FFF5D4 50%, ${gold} 65%, ${gold} 100%)`,
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "decoShimmer 4s ease-in-out infinite",
            animationDelay: "0.6s",
          }}
        >
          {wedding.partner2_name}
        </motion.h1>

        {/* Date & Venue inside geometric double-line frame */}
        {(weddingDate || wedding.venue_name) && (
          <motion.div
            className="relative z-10 mt-14 px-12 py-6"
            custom={2}
            variants={clipWipe}
            initial="hidden"
            animate="visible"
          >
            {/* Double-line frame */}
            <div
              className="absolute inset-0"
              style={{ border: `1px solid ${gold}`, opacity: 0.65 }}
            />
            <div
              className="absolute inset-[5px]"
              style={{ border: `0.5px solid ${gold}`, opacity: 0.35 }}
            />
            {/* Corner accent diamonds */}
            {[
              { top: -4, left: -4 },
              { top: -4, right: -4 },
              { bottom: -4, left: -4 },
              { bottom: -4, right: -4 },
            ].map((pos, i) => (
              <div
                key={i}
                className="absolute h-[8px] w-[8px] rotate-45"
                style={{ ...pos, backgroundColor: gold } as React.CSSProperties}
              />
            ))}

            {weddingDate && (
              <p
                className="text-sm uppercase tracking-[0.3em]"
                style={{ color: accent }}
              >
                {weddingDate}
              </p>
            )}
            {wedding.venue_name && (
              <p
                className="mt-2 text-xs uppercase tracking-[0.25em]"
                style={{ color: gold, opacity: 0.75 }}
              >
                {wedding.venue_name}
              </p>
            )}
          </motion.div>
        )}

        {/* Countdown — diamond-shaped containers */}
        {wedding.wedding_date && (
          <motion.div
            className="relative z-10 mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            <CountdownTimer
              targetDate={wedding.wedding_date}
              className="gap-5"
              numberClassName="text-3xl tabular-nums"
              labelClassName="text-[9px] uppercase tracking-[0.2em]"
            />
          </motion.div>
        )}

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={gold} strokeWidth="1.5">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════ GEOMETRIC FAN BAND ════════════════════ */}
      <motion.div
        className="relative w-full overflow-hidden py-1"
        style={{ y: patternY }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <DecoFanBand gold={gold} count={18} />
      </motion.div>

      {/* ════════════════════ STORY ════════════════════ */}
      {wedding.story_text && (
        <section ref={storyRef} className="relative px-6 py-28">
          <motion.div
            className="relative mx-auto max-w-2xl"
            initial={{ opacity: 0, y: 50, skewY: 1 }}
            animate={storyInView ? { opacity: 1, y: 0, skewY: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Story frame with stepped corner ornaments */}
            <div className="relative px-8 py-14 text-center md:px-14">
              <div
                className="absolute inset-0"
                style={{ border: `1px solid ${gold}35` }}
              />
              {/* Stepped corner ornaments */}
              {(["tl", "tr", "bl", "br"] as const).map((pos) => (
                <div
                  key={pos}
                  className="absolute h-10 w-10"
                  style={{
                    ...(pos.includes("t") ? { top: -1 } : { bottom: -1 }),
                    ...(pos.includes("l") ? { left: -1 } : { right: -1 }),
                    transform:
                      pos === "tr"
                        ? "scaleX(-1)"
                        : pos === "bl"
                          ? "scaleY(-1)"
                          : pos === "br"
                            ? "scale(-1)"
                            : "none",
                  }}
                >
                  <svg viewBox="0 0 40 40" className="h-full w-full">
                    <path
                      d="M0,0 L16,0 L16,5 L5,5 L5,16 L0,16 Z"
                      fill={gold}
                      opacity="0.4"
                    />
                    <path
                      d="M0,0 L10,0 L10,3 L3,3 L3,10 L0,10 Z"
                      fill={gold}
                      opacity="0.25"
                    />
                  </svg>
                </div>
              ))}

              <h2
                className="mb-8 text-3xl uppercase tracking-[0.3em]"
                style={{ fontFamily: displayFont, color: gold }}
              >
                Our Story
              </h2>

              <DecoDivider gold={gold} />

              <p
                className="mt-8 whitespace-pre-line text-sm leading-[2.1]"
                style={{ color: accent }}
              >
                {wedding.story_text}
              </p>

              <div className="mt-10">
                <DecoDivider gold={gold} />
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ════════════════════ SECOND FAN BAND ════════════════════ */}
      <motion.div
        className="relative w-full overflow-hidden py-1"
        style={{ y: parallaxSlow }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <svg viewBox="0 0 1200 60" className="w-full" preserveAspectRatio="none">
          {/* Sunburst arcs */}
          {Array.from({ length: 24 }).map((_, i) => {
            const cx = (i * 50) + 25;
            return (
              <motion.line
                key={i}
                x1={cx} y1="60" x2={cx} y2="5"
                stroke={gold} strokeWidth="0.3" opacity={0.3}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.02 }}
                style={{ transformOrigin: "bottom" }}
              />
            );
          })}
          <line x1="0" y1="59" x2="1200" y2="59" stroke={gold} strokeWidth="0.5" opacity="0.35" />
        </svg>
      </motion.div>

      {/* ════════════════════ NAVIGATION ════════════════════ */}
      <motion.section
        ref={navRef}
        className="flex flex-col items-center gap-10 px-8 py-24 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={navInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-4">
          <div className="h-px w-14" style={{ backgroundColor: gold, opacity: 0.3 }} />
          <p
            className="text-xs uppercase tracking-[0.45em]"
            style={{ color: gold, opacity: 0.65 }}
          >
            Explore
          </p>
          <div className="h-px w-14" style={{ backgroundColor: gold, opacity: 0.3 }} />
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {[
            { href: `/${wedding.slug}/gallery`, label: "Gallery" },
            { href: `/${wedding.slug}/guestbook`, label: "Guest Book" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}>
              <motion.span
                className="inline-block cursor-pointer border px-10 py-3 text-xs uppercase tracking-[0.3em] transition-all duration-300 hover:brightness-125"
                style={{
                  color: gold,
                  borderColor: gold,
                  clipPath:
                    "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                }}
                whileHover={{ scale: 1.06, backgroundColor: `${gold}10` }}
                whileTap={{ scale: 0.97 }}
              >
                {label}
              </motion.span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ════════════════════ FOOTER DECORATION ════════════════════ */}
      <footer className="flex flex-col items-center pb-12 pt-4">
        <DecoDivider gold={gold} />
        <motion.p
          className="mt-4 text-[10px] uppercase tracking-[0.5em]"
          style={{ color: gold, opacity: 0.35 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.35 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {wedding.partner1_name} & {wedding.partner2_name}
        </motion.p>
      </footer>
    </div>
  );
}
