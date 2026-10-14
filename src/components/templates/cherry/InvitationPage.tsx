"use client";

/**
 * Cherry invitation page — Japanese cherry blossom wedding with falling petals,
 * delicate branch SVGs, red accent sun/seal, ink-wash story section,
 * and torii gate footer decoration.
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

/* ─── SVG Decorations ──────────────────────────────────────────────────────── */

/** Cherry blossom branch extending from a corner. */
function BlossomBranch({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 180, height: 180 }}
    >
      {/* Main branch */}
      <motion.path
        d="M0 0 Q40 30 60 80 Q70 110 90 130 Q100 145 120 155"
        stroke="#5C3A2E"
        strokeWidth="2.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
      {/* Sub-branches */}
      <motion.path
        d="M40 50 Q55 45 65 35"
        stroke="#5C3A2E"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
      />
      <motion.path
        d="M60 80 Q80 70 90 55"
        stroke="#5C3A2E"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
      />
      <motion.path
        d="M80 110 Q95 95 110 90"
        stroke="#5C3A2E"
        strokeWidth="1.2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 1.8 }}
      />
      {/* Blossoms on branches */}
      {[
        { cx: 65, cy: 35, delay: 2.0 },
        { cx: 50, cy: 50, delay: 2.2 },
        { cx: 90, cy: 55, delay: 2.4 },
        { cx: 75, cy: 85, delay: 2.6 },
        { cx: 110, cy: 90, delay: 2.8 },
        { cx: 100, cy: 130, delay: 3.0 },
        { cx: 120, cy: 155, delay: 3.2 },
      ].map((b, i) => (
        <motion.g key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: b.delay, duration: 0.5 }}>
          <ellipse cx={b.cx} cy={b.cy} rx="4" ry="7" fill={color} opacity={0.6} transform={`rotate(0 ${b.cx} ${b.cy})`} />
          <ellipse cx={b.cx} cy={b.cy} rx="4" ry="7" fill={color} opacity={0.6} transform={`rotate(72 ${b.cx} ${b.cy})`} />
          <ellipse cx={b.cx} cy={b.cy} rx="4" ry="7" fill={color} opacity={0.6} transform={`rotate(144 ${b.cx} ${b.cy})`} />
          <ellipse cx={b.cx} cy={b.cy} rx="4" ry="7" fill={color} opacity={0.6} transform={`rotate(216 ${b.cx} ${b.cy})`} />
          <ellipse cx={b.cx} cy={b.cy} rx="4" ry="7" fill={color} opacity={0.6} transform={`rotate(288 ${b.cx} ${b.cy})`} />
          <circle cx={b.cx} cy={b.cy} r="2.5" fill="#F7E1C6" />
        </motion.g>
      ))}
    </svg>
  );
}

/** Single cherry blossom petal for the falling animation. */
function FallingPetal({ color, style, delay, duration }: {
  color: string;
  style: React.CSSProperties;
  delay: number;
  duration: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute"
      style={{ width: 14, height: 14, ...style }}
      animate={{
        y: [0, 800],
        x: [0, 40, -20, 30, 0],
        rotate: [0, 180, 360],
        opacity: [0, 0.8, 0.6, 0.3, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <ellipse cx="10" cy="8" rx="4" ry="7" fill={color} opacity={0.7} />
      <ellipse cx="10" cy="8" rx="4" ry="7" fill={color} opacity={0.5} transform="rotate(72 10 10)" />
      <ellipse cx="10" cy="8" rx="4" ry="7" fill={color} opacity={0.5} transform="rotate(144 10 10)" />
      <ellipse cx="10" cy="8" rx="4" ry="7" fill={color} opacity={0.5} transform="rotate(216 10 10)" />
      <ellipse cx="10" cy="8" rx="4" ry="7" fill={color} opacity={0.5} transform="rotate(288 10 10)" />
      <circle cx="10" cy="10" r="2" fill="#F7E1C6" opacity={0.8} />
    </motion.svg>
  );
}

/** Torii gate SVG for footer. */
function ToriiGate({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 100, height: 66 }}
    >
      {/* Pillars */}
      <rect x="20" y="18" width="5" height="62" fill={color} rx="1" />
      <rect x="95" y="18" width="5" height="62" fill={color} rx="1" />
      {/* Top beam (kasagi) with curve */}
      <path d="M8 8 Q60 0 112 8 L112 14 Q60 6 8 14 Z" fill={color} />
      {/* Lower beam (nuki) */}
      <rect x="16" y="22" width="88" height="4" fill={color} rx="1" />
      {/* Slight upward curve ends */}
      <path d="M4 12 Q6 6 12 8" stroke={color} strokeWidth="2.5" fill="none" />
      <path d="M116 12 Q114 6 108 8" stroke={color} strokeWidth="2.5" fill="none" />
    </svg>
  );
}

/* ─── Falling Petals Configuration ─────────────────────────────────────────── */

const petals = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 4.1 + 2) % 96}%`,
  delay: (i * 0.8) % 10,
  duration: 10 + (i % 5) * 2,
}));

/* ─── Animation Variants ──────────────────────────────────────────────────── */

const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.5 },
  },
};

const heroChild = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Section reveal with fade-in on scroll. */
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
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────────── */

export default function CherryInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const branchParallax = useTransform(scrollYProgress, [0, 1], [0, -30]);

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
      style={{ backgroundColor: secondary, fontFamily: bodyFont }}
    >
      {/* ─── Falling cherry blossom petals ─── */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {petals.map((p) => (
          <FallingPetal
            key={p.id}
            color={primary}
            style={{ left: p.left, top: -20 }}
            delay={p.delay}
            duration={p.duration}
          />
        ))}
      </div>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center"
        style={{
          background: `linear-gradient(180deg, #FFFFFF 0%, ${secondary} 40%, ${secondary} 100%)`,
        }}
      >
        {/* Cherry blossom branches from top corners */}
        <motion.div className="absolute left-0 top-0" style={{ y: branchParallax }}>
          <BlossomBranch color={primary} />
        </motion.div>
        <motion.div
          className="absolute right-0 top-0"
          style={{ y: branchParallax, transform: "scaleX(-1)" }}
        >
          <BlossomBranch color={primary} />
        </motion.div>

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
            style={{ color: accent, opacity: 0.6 }}
          >
            Together with their families
          </motion.p>

          {/* Partner names with Japanese-inspired spacing */}
          <motion.h1
            variants={heroChild}
            className="text-5xl font-light tracking-[0.2em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: accent, lineHeight: 1.2 }}
          >
            {wedding.partner1_name}
          </motion.h1>

          {/* Red sun/seal accent behind ampersand */}
          <motion.div variants={heroChild} className="relative my-4 md:my-5">
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 56,
                height: 56,
                backgroundColor: "#C0392B",
                opacity: 0.12,
              }}
            />
            <p
              className="relative text-3xl italic md:text-4xl"
              style={{ color: primary, fontFamily: displayFont }}
            >
              &amp;
            </p>
          </motion.div>

          <motion.h1
            variants={heroChild}
            className="text-5xl font-light tracking-[0.2em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: accent, lineHeight: 1.2 }}
          >
            {wedding.partner2_name}
          </motion.h1>

          <motion.div
            variants={heroChild}
            className="mt-8 h-px w-24"
            style={{ backgroundColor: primary, opacity: 0.3 }}
          />

          <motion.p
            variants={heroChild}
            className="mt-4 text-xs uppercase tracking-[0.25em]"
            style={{ color: accent, opacity: 0.5 }}
          >
            Request the pleasure of your company
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════════════ DATE & VENUE ═══════════════════════ */}
      <RevealSection
        className="flex flex-col items-center px-6 py-24 text-center"
        style={{ backgroundColor: secondary }}
      >
        {/* Decorative blossom */}
        <svg viewBox="0 0 40 40" fill="none" className="mb-6" style={{ width: 32, height: 32 }}>
          <ellipse cx="20" cy="12" rx="4" ry="8" fill={primary} opacity={0.5} transform="rotate(0 20 20)" />
          <ellipse cx="20" cy="12" rx="4" ry="8" fill={primary} opacity={0.5} transform="rotate(72 20 20)" />
          <ellipse cx="20" cy="12" rx="4" ry="8" fill={primary} opacity={0.5} transform="rotate(144 20 20)" />
          <ellipse cx="20" cy="12" rx="4" ry="8" fill={primary} opacity={0.5} transform="rotate(216 20 20)" />
          <ellipse cx="20" cy="12" rx="4" ry="8" fill={primary} opacity={0.5} transform="rotate(288 20 20)" />
          <circle cx="20" cy="20" r="3" fill="#F7E1C6" />
        </svg>

        {weddingDate && (
          <h2
            className="text-2xl tracking-[0.15em] md:text-3xl"
            style={{ fontFamily: displayFont, color: accent }}
          >
            {weddingDate}
          </h2>
        )}

        {wedding.venue_name && (
          <div className="mt-6 flex flex-col items-center gap-1">
            <p className="text-lg" style={{ color: accent, fontFamily: bodyFont, opacity: 0.8 }}>
              {wedding.venue_name}
            </p>
            {wedding.venue_address && (
              <p className="text-sm" style={{ color: accent, opacity: 0.5 }}>
                {wedding.venue_address}
              </p>
            )}
          </div>
        )}
      </RevealSection>

      {/* ═══════════════════════ COUNTDOWN ═══════════════════════ */}
      {wedding.wedding_date && (
        <RevealSection
          className="flex flex-col items-center px-6 py-20"
          style={{ backgroundColor: secondary }}
        >
          <p
            className="mb-8 text-xs uppercase tracking-[0.3em]"
            style={{ color: accent, opacity: 0.5 }}
          >
            Counting the days
          </p>

          <div className="flex gap-4 md:gap-6">
            <CountdownTimer
              targetDate={wedding.wedding_date}
              className="gap-4 md:gap-6"
              numberClassName="text-4xl md:text-5xl font-light tabular-nums"
              labelClassName="text-xs uppercase tracking-[0.15em] mt-2"
            />
          </div>
        </RevealSection>
      )}

      {/* ═══════════════════════ OUR STORY (ink-wash style) ═══════════════════════ */}
      {wedding.story_text && (
        <RevealSection
          className="px-6 py-24"
          style={{
            background: `linear-gradient(180deg, ${secondary} 0%, #E8D5DA 30%, #D4B8C2 60%, ${secondary} 100%)`,
          }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className="mb-10 text-3xl tracking-[0.15em] md:text-4xl"
              style={{ fontFamily: displayFont, color: accent }}
            >
              Our Story
            </h2>

            <div className="relative">
              {/* Ink-wash decorative element */}
              <div
                className="absolute -left-4 -top-4 h-24 w-24 rounded-full blur-2xl"
                style={{ backgroundColor: primary, opacity: 0.06 }}
              />
              <div
                className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full blur-3xl"
                style={{ backgroundColor: primary, opacity: 0.04 }}
              />

              <p
                className="relative whitespace-pre-line text-base leading-[2] md:text-lg"
                style={{ color: accent, opacity: 0.85 }}
              >
                <span
                  className="float-left mr-3 text-5xl leading-none"
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

      {/* ═══════════════════════ EXPLORE LINKS ═══════════════════════ */}
      <RevealSection
        className="flex flex-col items-center px-6 py-20"
        style={{ backgroundColor: secondary }}
      >
        <p
          className="mb-8 text-xs uppercase tracking-[0.3em]"
          style={{ color: accent, opacity: 0.5 }}
        >
          Explore
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/${wedding.slug}/gallery`}>
            <motion.span
              className="inline-block cursor-pointer rounded-full border px-8 py-3 text-sm uppercase tracking-[0.2em]"
              style={{
                borderColor: primary,
                color: accent,
                fontFamily: bodyFont,
              }}
              whileHover={{
                backgroundColor: primary,
                color: "#FFFFFF",
                scale: 1.03,
              }}
              transition={{ duration: 0.3 }}
            >
              Gallery
            </motion.span>
          </Link>

          <Link href={`/${wedding.slug}/guestbook`}>
            <motion.span
              className="inline-block cursor-pointer rounded-full border px-8 py-3 text-sm uppercase tracking-[0.2em]"
              style={{
                borderColor: primary,
                color: accent,
                fontFamily: bodyFont,
              }}
              whileHover={{
                backgroundColor: primary,
                color: "#FFFFFF",
                scale: 1.03,
              }}
              transition={{ duration: 0.3 }}
            >
              Guest Book
            </motion.span>
          </Link>
        </div>
      </RevealSection>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="flex flex-col items-center px-6 pb-16 pt-10" style={{ backgroundColor: secondary }}>
        <div style={{ opacity: 0.2 }}>
          <ToriiGate color={primary} />
        </div>
        <p
          className="mt-6 text-xs tracking-[0.15em]"
          style={{ color: accent, opacity: 0.4 }}
        >
          Made with love
        </p>
      </footer>
    </div>
  );
}
