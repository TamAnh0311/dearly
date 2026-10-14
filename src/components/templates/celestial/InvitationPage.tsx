"use client";

/**
 * Celestial invitation page — starry night sky wedding design with twinkling
 * CSS stars, crescent moon SVG, constellation patterns, zodiac-inspired date
 * decoration, shooting star animation, and star-shaped countdown markers.
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

/* ─── SVG Components ───────────────────────────────────────────────────────── */

/** Crescent moon with soft ambient glow. */
function CrescentMoon({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 72, height: 72 }}
    >
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#moonGlow)" />
      <motion.path
        d="M50 10 A30 30 0 1 0 50 70 A22 22 0 1 1 50 10Z"
        fill={color}
        fillOpacity={0.85}
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
      />
    </svg>
  );
}

/** Constellation pattern connecting star dots with thin lines. */
function ConstellationPattern({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 180, height: 108 }}
    >
      {/* Stars */}
      <circle cx="30" cy="20" r="2" fill={color} opacity={0.8} />
      <circle cx="70" cy="50" r="1.5" fill={color} opacity={0.7} />
      <circle cx="110" cy="25" r="2" fill={color} opacity={0.9} />
      <circle cx="140" cy="70" r="1.5" fill={color} opacity={0.6} />
      <circle cx="170" cy="30" r="2" fill={color} opacity={0.8} />
      <circle cx="50" cy="90" r="1.5" fill={color} opacity={0.7} />
      <circle cx="130" cy="100" r="2" fill={color} opacity={0.6} />
      {/* Connecting lines */}
      <motion.line x1="30" y1="20" x2="70" y2="50" stroke={color} strokeWidth="0.5" opacity={0.3}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.2 }} />
      <motion.line x1="70" y1="50" x2="110" y2="25" stroke={color} strokeWidth="0.5" opacity={0.3}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.5 }} />
      <motion.line x1="110" y1="25" x2="170" y2="30" stroke={color} strokeWidth="0.5" opacity={0.3}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.8 }} />
      <motion.line x1="110" y1="25" x2="140" y2="70" stroke={color} strokeWidth="0.5" opacity={0.3}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 2.0 }} />
      <motion.line x1="70" y1="50" x2="50" y2="90" stroke={color} strokeWidth="0.5" opacity={0.3}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 2.2 }} />
      <motion.line x1="140" y1="70" x2="130" y2="100" stroke={color} strokeWidth="0.5" opacity={0.3}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 2.4 }} />
    </svg>
  );
}

/** Zodiac-inspired circular decoration for the date. */
function ZodiacCircle({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0"
      style={{ width: "100%", height: "100%" }}
    >
      <circle cx="80" cy="80" r="72" stroke={color} strokeWidth="0.5" opacity={0.2} />
      <circle cx="80" cy="80" r="66" stroke={color} strokeWidth="0.3" opacity={0.15} />
      {/* 12 zodiac tick marks around the circle */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 80 + 66 * Math.cos(angle);
        const y1 = 80 + 66 * Math.sin(angle);
        const x2 = 80 + 72 * Math.cos(angle);
        const y2 = 80 + 72 * Math.sin(angle);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color} strokeWidth="0.8" opacity={0.4} />
        );
      })}
      {/* Small star at top */}
      <circle cx="80" cy="8" r="2.5" fill={color} opacity={0.6} />
    </svg>
  );
}

/** Ornamental star divider. */
function StarDivider({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 240 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 200, height: 20 }}
    >
      <line x1="0" y1="12" x2="95" y2="12" stroke={color} strokeWidth="0.5" opacity={0.3} />
      <path d="M120 4 L122.4 10 L129 10 L123.6 13.6 L125.4 20 L120 16 L114.6 20 L116.4 13.6 L111 10 L117.6 10 Z"
        fill={color} opacity={0.7} />
      <line x1="145" y1="12" x2="240" y2="12" stroke={color} strokeWidth="0.5" opacity={0.3} />
    </svg>
  );
}

/* ─── Twinkling Stars Background ───────────────────────────────────────────── */

const twinklingStars = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  left: `${((i * 19 + 3) % 98) + 1}%`,
  top: `${((i * 31 + 7) % 96) + 2}%`,
  size: 1 + (i % 4) * 0.5,
  delay: (i * 0.37) % 6,
  duration: 2 + (i % 4) * 1.5,
}));

/* ─── Animation Variants ───────────────────────────────────────────────────── */

const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25, delayChildren: 0.5 },
  },
};

const heroChild = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Section reveal with fade + upward slide. */
function RevealSection({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────────── */

export default function CelestialInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const moonY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;
  const accent = theme.colors.accent;
  const displayFont = `'${theme.fonts.display}', serif`;
  const bodyFont = `'${theme.fonts.body}', sans-serif`;

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
      className="min-h-screen overflow-x-hidden"
      style={{
        background: `linear-gradient(180deg, ${secondary} 0%, #0a1020 40%, ${secondary} 100%)`,
        fontFamily: bodyFont,
      }}
    >
      {/* ─── Twinkling star field ─── */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {twinklingStars.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
            }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ─── Shooting star (repeats every 8s) ─── */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        <motion.div
          className="absolute h-px w-20"
          style={{
            top: "15%",
            left: "-10%",
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            transform: "rotate(-25deg)",
          }}
          animate={{
            left: ["−10%", "110%"],
            top: ["15%", "40%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatDelay: 8,
            ease: "easeIn",
          }}
        />
      </div>

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center"
      >
        {/* Moon — upper right with parallax */}
        <motion.div
          className="absolute right-8 top-16 md:right-20 md:top-20"
          style={{ y: moonY }}
        >
          <CrescentMoon color={primary} />
        </motion.div>

        {/* Constellation — lower left */}
        <ConstellationPattern color={accent} className="absolute bottom-16 left-4 opacity-50 md:left-12" />

        {/* Central hero content */}
        <motion.div
          className="relative z-20 flex flex-col items-center px-6 text-center"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          style={{ y: heroContentY }}
        >
          <motion.p
            variants={heroChild}
            className="mb-6 text-xs uppercase tracking-[0.4em]"
            style={{ color: accent }}
          >
            Under the stars
          </motion.p>

          {/* Partner names */}
          <motion.h1
            variants={heroChild}
            className="text-5xl font-light tracking-[0.12em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: primary, lineHeight: 1.15 }}
          >
            {wedding.partner1_name}
          </motion.h1>

          <motion.p
            variants={heroChild}
            className="my-3 text-3xl italic md:my-4 md:text-4xl"
            style={{ color: accent, fontFamily: displayFont, opacity: 0.7 }}
          >
            &amp;
          </motion.p>

          <motion.h1
            variants={heroChild}
            className="text-5xl font-light tracking-[0.12em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: primary, lineHeight: 1.15 }}
          >
            {wedding.partner2_name}
          </motion.h1>

          <motion.div
            variants={heroChild}
            className="mt-8 mb-2 h-px w-24"
            style={{ backgroundColor: primary, opacity: 0.4 }}
          />

          <motion.p
            variants={heroChild}
            className="text-xs uppercase tracking-[0.25em]"
            style={{ color: accent }}
          >
            Request the pleasure of your company
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════════════════ DATE & VENUE ══════════════════════ */}
      <RevealSection
        className="flex flex-col items-center px-6 py-24 text-center"
        style={{ backgroundColor: "transparent" }}
      >
        <StarDivider color={primary} />

        {weddingDate && (
          <div className="relative mt-10 flex items-center justify-center" style={{ width: 160, height: 160 }}>
            <ZodiacCircle color={primary} />
            <h2
              className="relative z-10 text-center text-lg tracking-[0.08em] md:text-xl"
              style={{ fontFamily: displayFont, color: primary, maxWidth: 120 }}
            >
              {weddingDate}
            </h2>
          </div>
        )}

        {wedding.venue_name && (
          <div className="mt-8 flex flex-col items-center gap-1">
            <p className="text-lg" style={{ color: accent, fontFamily: bodyFont }}>
              {wedding.venue_name}
            </p>
            {wedding.venue_address && (
              <p className="text-sm" style={{ color: accent, opacity: 0.6 }}>
                {wedding.venue_address}
              </p>
            )}
          </div>
        )}

        <div className="mt-6">
          <StarDivider color={primary} />
        </div>
      </RevealSection>

      {/* ══════════════════════ COUNTDOWN ══════════════════════ */}
      {wedding.wedding_date && (
        <RevealSection
          className="flex flex-col items-center px-6 py-20"
          style={{ backgroundColor: "transparent" }}
        >
          <p
            className="mb-8 text-xs uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            Counting down to the stars aligning
          </p>

          <div className="flex gap-4 md:gap-8">
            <CountdownTimer
              targetDate={wedding.wedding_date}
              className="gap-4 md:gap-8"
              numberClassName="text-4xl md:text-5xl font-light tabular-nums"
              labelClassName="text-xs uppercase tracking-[0.15em] mt-2"
            />
          </div>
        </RevealSection>
      )}

      {/* ══════════════════════ OUR STORY ══════════════════════ */}
      {wedding.story_text && (
        <RevealSection
          className="px-6 py-24"
          style={{ backgroundColor: "transparent" }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className="mb-10 text-3xl tracking-[0.12em] md:text-4xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              Our Story
            </h2>

            <div className="relative">
              <svg
                viewBox="0 0 40 32"
                fill="none"
                className="absolute -top-6 -left-2 md:-left-8"
                style={{ width: 36, height: 28, opacity: 0.15 }}
              >
                <path
                  d="M0 20 C0 8 6 0 18 0 L18 6 C12 6 8 10 8 16 L18 16 L18 32 L0 32 Z M22 20 C22 8 28 0 40 0 L40 6 C34 6 30 10 30 16 L40 16 L40 32 L22 32 Z"
                  fill={primary}
                />
              </svg>

              <p
                className="whitespace-pre-line text-base leading-[1.9] md:text-lg"
                style={{ color: accent }}
              >
                <span
                  className="float-left mr-2 text-5xl leading-none"
                  style={{ fontFamily: displayFont, color: primary }}
                >
                  {wedding.story_text.charAt(0)}
                </span>
                {wedding.story_text.slice(1)}
              </p>
            </div>
          </div>
        </RevealSection>
      )}

      {/* ══════════════════════ EXPLORE LINKS ══════════════════════ */}
      <RevealSection
        className="flex flex-col items-center px-6 py-20"
        style={{ backgroundColor: "transparent" }}
      >
        <p
          className="mb-8 text-xs uppercase tracking-[0.3em]"
          style={{ color: accent }}
        >
          Explore
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/${wedding.slug}/gallery`}>
            <motion.span
              className="inline-block cursor-pointer rounded-full border px-8 py-3 text-sm uppercase tracking-[0.2em] transition-colors"
              style={{
                borderColor: primary,
                color: primary,
                fontFamily: bodyFont,
              }}
              whileHover={{
                backgroundColor: primary,
                color: secondary,
                scale: 1.03,
              }}
              transition={{ duration: 0.3 }}
            >
              Gallery
            </motion.span>
          </Link>

          <Link href={`/${wedding.slug}/guestbook`}>
            <motion.span
              className="inline-block cursor-pointer rounded-full border px-8 py-3 text-sm uppercase tracking-[0.2em] transition-colors"
              style={{
                borderColor: primary,
                color: primary,
                fontFamily: bodyFont,
              }}
              whileHover={{
                backgroundColor: primary,
                color: secondary,
                scale: 1.03,
              }}
              transition={{ duration: 0.3 }}
            >
              Guest Book
            </motion.span>
          </Link>
        </div>
      </RevealSection>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer className="flex flex-col items-center px-6 pb-16 pt-8">
        <StarDivider color={primary} />
        <p
          className="mt-6 text-xs tracking-[0.15em]"
          style={{ color: accent, opacity: 0.5 }}
        >
          Written in the stars
        </p>
      </footer>
    </div>
  );
}
