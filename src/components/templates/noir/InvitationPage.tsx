"use client";

/**
 * Noir invitation page — dark cinematic luxury with radial spotlight gradient,
 * inset vignette, CSS film-grain noise, letter-by-letter name reveals, gold
 * accent lines with traveling shimmer, and scroll-linked spotlight movement.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import type { InvitationPageProps } from "../types";

/* ── Cinematic letter-by-letter reveal ─────────────────────────────── */

/** Renders text with each letter scaling from 1.5 and fading in. */
function CinematicTitle({
  text,
  fontFamily,
  color,
  baseDelay = 0,
}: {
  text: string;
  fontFamily: string;
  color: string;
  baseDelay?: number;
}) {
  return (
    <span className="inline-flex flex-wrap justify-center overflow-hidden">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block origin-center"
          initial={{ opacity: 0, scale: 1.5, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.75,
            delay: baseDelay + i * 0.065,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ fontFamily, color }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Gold line with traveling shimmer highlight ────────────────────── */

/** Horizontal gold line with animated shimmer traveling along it. */
function GoldLine({
  width,
  delay = 0,
  goldColor,
  className = "",
}: {
  width: string;
  delay?: number;
  goldColor: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`origin-center ${className}`}
      style={{
        height: "1px",
        width,
        background: `linear-gradient(90deg, transparent 0%, ${goldColor}40 20%, ${goldColor} 50%, ${goldColor}40 80%, transparent 100%)`,
        backgroundSize: "200% 100%",
        animation: "noirShimmer 3.5s ease-in-out infinite",
      }}
    />
  );
}

/* ── Custom countdown with gold glow ───────────────────────────────── */

/** Countdown display with gold-glowing number boxes. */
function GoldCountdown({
  targetDate,
  goldColor,
  bgColor,
  textColor,
}: {
  targetDate: string;
  goldColor: string;
  bgColor: string;
  textColor: string;
}) {
  /** Calculates remaining time from now to the target date. */
  const calc = useCallback(() => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [targetDate]);

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ];

  return (
    <div className="flex gap-4 md:gap-6">
      {units.map(({ label, value }, i) => (
        <motion.div
          key={label}
          className="flex flex-col items-center rounded-sm px-3 py-3 md:px-5 md:py-4"
          style={{
            backgroundColor: bgColor,
            border: `1px solid ${goldColor}30`,
            boxShadow: `0 0 24px ${goldColor}12, inset 0 0 12px ${goldColor}06`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 2.5 + i * 0.1,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span
            className="text-2xl font-light tabular-nums md:text-3xl"
            style={{ color: goldColor, fontVariantNumeric: "tabular-nums" }}
          >
            {String(value).padStart(2, "0")}
          </span>
          <span
            className="mt-1 text-[10px] uppercase tracking-[0.15em]"
            style={{ color: textColor, opacity: 0.45 }}
          >
            {label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Gold divider with diamond center ──────────────────────────────── */

/** Ornamental gold divider for section separation. */
function NoirDivider({ goldColor }: { goldColor: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <div
        className="h-px w-12 md:w-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${goldColor}60)`,
        }}
      />
      <div
        className="h-1.5 w-1.5 rotate-45"
        style={{ backgroundColor: goldColor, opacity: 0.5 }}
      />
      <div
        className="h-px w-12 md:w-20"
        style={{
          background: `linear-gradient(90deg, ${goldColor}60, transparent)`,
        }}
      />
    </div>
  );
}

/* ── CSS keyframes ─────────────────────────────────────────────────── */

const keyframes = `
@keyframes noirShimmer {
  0%, 100% { background-position: 200% 0; }
  50%      { background-position: -200% 0; }
}
@keyframes noirGrain {
  0%, 100% { transform: translate(0, 0); }
  10%      { transform: translate(-2%, -2%); }
  20%      { transform: translate(1%, 3%); }
  30%      { transform: translate(-3%, 1%); }
  40%      { transform: translate(3%, -1%); }
  50%      { transform: translate(-1%, 2%); }
  60%      { transform: translate(2%, -3%); }
  70%      { transform: translate(-2%, 1%); }
  80%      { transform: translate(1%, -2%); }
  90%      { transform: translate(3%, 2%); }
}
@keyframes noirGoldPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(139,125,107,0.1); }
  50%      { box-shadow: 0 0 40px rgba(139,125,107,0.2); }
}
`;

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function NoirInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const weddingDate = wedding.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  /* -- Cinematic 1-second black intro -- */
  const [introComplete, setIntroComplete] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIntroComplete(true), 1000);
    return () => clearTimeout(t);
  }, []);

  /* -- Scroll-linked spotlight -- */
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const spotlightY = useTransform(heroScroll, [0, 1], ["35%", "60%"]);
  const _spotlightX = useTransform(heroScroll, [0, 0.5, 1], ["50%", "48%", "52%"]);

  /* -- Story / nav in-view detection -- */
  const storyInView = useInView(storyRef, { once: true, margin: "-80px" });
  const navInView = useInView(navRef, { once: true, margin: "-60px" });

  /* -- Vignette intensifies on scroll -- */
  const vignetteOpacity = useTransform(heroScroll, [0, 0.8], [0.6, 0.85]);

  /* -- Colors from theme -- */
  const goldColor = theme.colors.accent;
  const ivoryColor = theme.colors.primary;
  const darkBg = theme.colors.secondary;

  const displayFont = `'${theme.fonts.display}', serif`;
  const bodyFont = `'${theme.fonts.body}', sans-serif`;

  /* -- Timing for letter reveals -- */
  const partner1Delay = 1.3;
  const partner2Delay =
    partner1Delay + wedding.partner1_name.length * 0.065 + 0.5;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: darkBg, fontFamily: bodyFont }}
    >
      {/* Global keyframes */}
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      {/* Film grain noise overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-30 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          animation: "noirGrain 0.5s steps(1) infinite",
        }}
      />

      {/* Vignette overlay — inset box-shadow effect */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-20"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 15%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,1) 100%)",
          opacity: vignetteOpacity,
        }}
      />

      {/* Additional corner vignette for cinematic depth */}
      <div
        className="pointer-events-none fixed inset-0 z-20"
        style={{
          boxShadow: "inset 0 0 200px 60px rgba(0,0,0,0.7)",
        }}
      />

      {/* ── CINEMATIC BLACK INTRO ── */}
      <AnimatePresence>
        <motion.div
          className="pointer-events-none fixed inset-0 z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: "easeInOut" }}
          style={{ backgroundColor: "#000000" }}
        />
      </AnimatePresence>

      {/* ═══════════════ HERO ═══════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        {/* Spotlight radial gradient — shifts with scroll */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: useTransform(
              spotlightY,
              (y) =>
                `radial-gradient(ellipse 55% 45% at 50% ${y}, rgba(255,255,255,0.04) 0%, ${darkBg}90 40%, ${darkBg} 100%)`
            ),
          }}
        />

        {/* Gold framing lines — top */}
        <div className="absolute left-6 right-6 top-8 flex items-center justify-between md:left-14 md:right-14 md:top-14">
          <GoldLine width="70px" delay={1.7} goldColor={goldColor} />
          <GoldLine width="70px" delay={1.7} goldColor={goldColor} />
        </div>

        {/* Gold corner accents */}
        {[
          { top: 8, left: 6, rotate: 0 },
          { top: 8, right: 6, rotate: 90 },
          { bottom: 8, left: 6, rotate: 270 },
          { bottom: 8, right: 6, rotate: 180 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute hidden md:block"
            style={{
              ...(pos as React.CSSProperties),
              width: 30,
              height: 30,
            }}
            initial={{ opacity: 0 }}
            animate={introComplete ? { opacity: 0.3 } : {}}
            transition={{ delay: 2 + i * 0.1, duration: 0.6 }}
          >
            <svg viewBox="0 0 30 30" width="30" height="30">
              <path
                d="M0,0 L30,0 L30,4 L4,4 L4,30 L0,30 Z"
                fill={goldColor}
                opacity="0.5"
                transform={`rotate(${pos.rotate} 15 15)`}
              />
            </svg>
          </motion.div>
        ))}

        {/* Main content */}
        <div className="relative z-10">
          {/* Tagline with letter-spacing animation */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.9em" }}
            animate={
              introComplete
                ? { opacity: 0.55, letterSpacing: "0.45em" }
                : {}
            }
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="mb-14 text-[10px] uppercase md:text-xs"
            style={{ color: goldColor, fontFamily: bodyFont }}
          >
            Together with their families
          </motion.p>

          {/* Partner 1 — cinematic letter reveal */}
          <div
            className="mb-2 text-5xl font-light md:text-7xl lg:text-8xl"
            style={{ lineHeight: 1.1 }}
          >
            {introComplete && (
              <CinematicTitle
                text={wedding.partner1_name}
                fontFamily={displayFont}
                color={ivoryColor}
                baseDelay={partner1Delay - 1}
              />
            )}
          </div>

          {/* Ampersand with gold flanking lines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={introComplete ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: partner2Delay - 1.2 }}
            className="my-7 flex items-center justify-center gap-5"
          >
            <motion.div
              className="h-px w-14 md:w-24"
              style={{ backgroundColor: goldColor, opacity: 0.3 }}
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <span
              className="text-2xl font-light"
              style={{ color: goldColor, fontFamily: displayFont }}
            >
              &amp;
            </span>
            <motion.div
              className="h-px w-14 md:w-24"
              style={{ backgroundColor: goldColor, opacity: 0.3 }}
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </motion.div>

          {/* Partner 2 — cinematic letter reveal */}
          <div
            className="mb-10 text-5xl font-light md:text-7xl lg:text-8xl"
            style={{ lineHeight: 1.1 }}
          >
            {introComplete && (
              <CinematicTitle
                text={wedding.partner2_name}
                fontFamily={displayFont}
                color={ivoryColor}
                baseDelay={partner2Delay - 1}
              />
            )}
          </div>

          {/* Gold separator line */}
          <GoldLine
            width="120px"
            delay={partner2Delay + 0.2}
            goldColor={goldColor}
            className="mx-auto mb-8"
          />

          {/* Date */}
          {weddingDate && (
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={introComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: partner2Delay + 0.4 }}
              className="text-xs uppercase tracking-[0.3em] md:text-sm"
              style={{
                color: goldColor,
                fontVariant: "small-caps",
                fontFamily: bodyFont,
              }}
            >
              {weddingDate}
            </motion.p>
          )}

          {/* Venue */}
          {wedding.venue_name && (
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={introComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: partner2Delay + 0.6 }}
              className="mt-3 text-xs uppercase tracking-[0.22em]"
              style={{ color: ivoryColor, opacity: 0.5, fontFamily: bodyFont }}
            >
              {wedding.venue_name}
            </motion.p>
          )}

          {/* Countdown with gold glow */}
          {wedding.wedding_date && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={introComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: partner2Delay + 0.8 }}
              className="mt-16 flex justify-center"
            >
              <GoldCountdown
                targetDate={wedding.wedding_date}
                goldColor={goldColor}
                bgColor={`${darkBg}CC`}
                textColor={ivoryColor}
              />
            </motion.div>
          )}
        </div>

        {/* Gold framing lines — bottom */}
        <div className="absolute bottom-8 left-6 right-6 flex items-center justify-between md:bottom-14 md:left-14 md:right-14">
          <GoldLine width="70px" delay={1.7} goldColor={goldColor} />
          <GoldLine width="70px" delay={1.7} goldColor={goldColor} />
        </div>
      </section>

      {/* ═══════════════ STORY ═══════════════ */}
      {wedding.story_text && (
        <section
          className="relative px-6 py-28 md:py-40"
          style={{ backgroundColor: "#0A0A0A" }}
        >
          <motion.div
            ref={storyRef}
            className="relative mx-auto max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={storyInView ? { opacity: 1 } : {}}
            transition={{ duration: 1.2 }}
          >
            {/* Gold rule above */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={storyInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.9 }}
              className="mx-auto mb-12 h-px w-28 origin-center"
              style={{
                background: `linear-gradient(90deg, transparent, ${goldColor}, transparent)`,
              }}
            />

            {/* Section title */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mb-10 text-3xl font-light uppercase tracking-[0.25em]"
              style={{ fontFamily: displayFont, color: ivoryColor }}
            >
              Our Story
            </motion.h2>

            <NoirDivider goldColor={goldColor} />

            {/* Story text */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="mt-8 whitespace-pre-line text-base leading-[2.1] md:text-lg md:leading-[2.2]"
              style={{
                color: ivoryColor,
                opacity: 0.7,
                fontFamily: bodyFont,
              }}
            >
              {wedding.story_text}
            </motion.p>

            {/* Gold rule below */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={storyInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.7 }}
              className="mx-auto mt-14 h-px w-28 origin-center"
              style={{
                background: `linear-gradient(90deg, transparent, ${goldColor}, transparent)`,
              }}
            />
          </motion.div>
        </section>
      )}

      {/* ═══════════════ NAVIGATION ═══════════════ */}
      <motion.section
        ref={navRef}
        className="flex flex-col items-center px-6 py-20"
        style={{ backgroundColor: darkBg }}
        initial={{ opacity: 0, y: 30 }}
        animate={navInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <NoirDivider goldColor={goldColor} />

        <p
          className="mb-8 mt-4 text-[10px] uppercase tracking-[0.45em]"
          style={{ color: goldColor, opacity: 0.5 }}
        >
          Explore
        </p>

        <div className="flex justify-center gap-10">
          {[
            { href: `/${wedding.slug}/gallery`, label: "Gallery" },
            { href: `/${wedding.slug}/guestbook`, label: "Guestbook" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}>
              <motion.span
                className="group relative inline-block cursor-pointer text-xs uppercase tracking-[0.3em] transition-all duration-300"
                style={{ color: goldColor, fontFamily: bodyFont }}
                whileHover={{
                  textShadow: `0 0 14px ${goldColor}80`,
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.97 }}
              >
                {label}
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-px origin-left"
                  style={{ backgroundColor: goldColor, opacity: 0.3 }}
                  whileHover={{ scaleX: 1 }}
                  initial={{ scaleX: 0 }}
                />
              </motion.span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer
        className="flex flex-col items-center px-6 py-14"
        style={{ backgroundColor: darkBg }}
      >
        <div
          className="mb-6 h-px w-20"
          style={{
            background: `linear-gradient(90deg, transparent, ${goldColor}50, transparent)`,
          }}
        />
        <motion.span
          className="text-xs uppercase tracking-[0.45em]"
          style={{ color: goldColor, opacity: 0.35, fontFamily: bodyFont }}
          animate={{ opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {(wedding.partner1_name?.[0] ?? "") +
            " & " +
            (wedding.partner2_name?.[0] ?? "")}
        </motion.span>
      </footer>
    </div>
  );
}
