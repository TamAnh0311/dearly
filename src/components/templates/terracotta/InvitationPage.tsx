"use client";

/**
 * Terracotta invitation page — Mediterranean warm earth design with arch-shaped
 * SVG frames, abstract sun motif, dried botanical line art, textured plaster
 * background, and warm modern-rustic aesthetic.
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

/* ─── SVG Ornaments ────────────────────────────────────────────────────────── */

/** Moroccan/Mediterranean arch frame around content. */
function ArchFrame({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 260 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
    >
      <motion.path
        d="M30 338 L30 140 Q30 20 130 20 Q230 20 230 140 L230 338"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.path
        d="M40 338 L40 144 Q40 34 130 34 Q220 34 220 144 L220 338"
        stroke={color}
        strokeWidth="0.6"
        fill="none"
        opacity={0.3}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut", delay: 0.8 }}
      />
    </svg>
  );
}

/** Abstract sun motif — radiating lines from a semicircle. */
function SunMotif({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 120 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 100, height: 58 }}
    >
      <motion.path
        d="M20 65 Q60 10 100 65"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      {/* Sun rays */}
      {Array.from({ length: 9 }, (_, i) => {
        const angle = ((i * 20 + 10) * Math.PI) / 180;
        const cx = 60;
        const cy = 65;
        const r1 = 30;
        const r2 = 45;
        const x1 = cx + r1 * Math.cos(Math.PI + angle);
        const y1 = cy + r1 * Math.sin(Math.PI + angle);
        const x2 = cx + r2 * Math.cos(Math.PI + angle);
        const y2 = cy + r2 * Math.sin(Math.PI + angle);
        return (
          <motion.line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color}
            strokeWidth="0.8"
            opacity={0.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 1.2 + i * 0.1 }}
          />
        );
      })}
      <circle cx="60" cy="65" r="4" fill={color} opacity={0.3} />
    </svg>
  );
}

/** Dried botanical — simple eucalyptus branch line art. */
function BotanicalBranch({ color, className, flip }: { color: string; className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 60 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 48, height: 128, transform: flip ? "scaleX(-1)" : undefined }}
    >
      <motion.path
        d="M30 160 Q28 120 32 80 Q34 50 30 10"
        stroke={color}
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      {/* Leaves */}
      <motion.path d="M32 130 Q45 120 38 110" stroke={color} strokeWidth="0.7" fill="none" opacity={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 1.2 }} />
      <motion.path d="M30 110 Q18 100 22 90" stroke={color} strokeWidth="0.7" fill="none" opacity={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 1.5 }} />
      <motion.path d="M33 85 Q46 76 40 66" stroke={color} strokeWidth="0.7" fill="none" opacity={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 1.8 }} />
      <motion.path d="M30 65 Q16 56 22 46" stroke={color} strokeWidth="0.7" fill="none" opacity={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 2.1 }} />
      <motion.path d="M31 45 Q42 36 38 28" stroke={color} strokeWidth="0.7" fill="none" opacity={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 2.4 }} />
    </svg>
  );
}

/** Decorative dots pattern in terracotta. */
function DotsPattern({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 200 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 180, height: 18 }}
    >
      {Array.from({ length: 15 }, (_, i) => (
        <circle key={i} cx={10 + i * 13} cy="10" r="2.5" fill={color} opacity={0.2 + (i % 3) * 0.1} />
      ))}
    </svg>
  );
}

/* ─── Animation Variants ───────────────────────────────────────────────────── */

const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.6 },
  },
};

const heroChild = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
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

export default function TerracottaInvitationPage({
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
      style={{
        backgroundColor: secondary,
        fontFamily: bodyFont,
        backgroundImage: `radial-gradient(circle at 30% 20%, ${primary}06, transparent 50%), radial-gradient(circle at 70% 80%, ${primary}04, transparent 50%)`,
      }}
    >
      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        {/* Arch frame around hero */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="relative" style={{ width: 320, height: 420, maxWidth: "85vw" }}>
            <ArchFrame color={primary} />
          </div>
        </div>

        {/* Botanical branches on sides */}
        <motion.div className="absolute left-2 top-1/4 md:left-8" style={{ y: branchParallax }}>
          <BotanicalBranch color={primary} />
        </motion.div>
        <motion.div className="absolute right-2 top-1/4 md:right-8" style={{ y: branchParallax }}>
          <BotanicalBranch color={primary} flip />
        </motion.div>

        {/* Central hero content */}
        <motion.div
          className="relative z-20 flex flex-col items-center px-6 text-center"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          style={{ y: heroContentY }}
        >
          <motion.div variants={heroChild}>
            <SunMotif color={primary} />
          </motion.div>

          <motion.p
            variants={heroChild}
            className="mb-6 mt-4 text-xs uppercase tracking-[0.35em]"
            style={{ color: accent }}
          >
            Together with their families
          </motion.p>

          {/* Partner names */}
          <motion.h1
            variants={heroChild}
            className="text-5xl font-light tracking-[0.12em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: accent, lineHeight: 1.15 }}
          >
            {wedding.partner1_name}
          </motion.h1>

          <motion.p
            variants={heroChild}
            className="my-3 text-3xl italic md:my-4 md:text-4xl"
            style={{ color: primary, fontFamily: displayFont, opacity: 0.8 }}
          >
            &amp;
          </motion.p>

          <motion.h1
            variants={heroChild}
            className="text-5xl font-light tracking-[0.12em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: accent, lineHeight: 1.15 }}
          >
            {wedding.partner2_name}
          </motion.h1>

          <motion.p
            variants={heroChild}
            className="mt-8 text-xs uppercase tracking-[0.25em]"
            style={{ color: primary }}
          >
            Request the pleasure of your company
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════════════════ DATE & VENUE ══════════════════════ */}
      <RevealSection
        className="flex flex-col items-center px-6 py-24 text-center"
        style={{ backgroundColor: secondary }}
      >
        <DotsPattern color={primary} />

        {weddingDate && (
          <div className="relative mt-10">
            {/* Arched date frame */}
            <svg viewBox="0 0 240 100" fill="none" className="mx-auto" style={{ width: 220, height: 92 }}>
              <path d="M20 90 L20 50 Q20 10 120 10 Q220 10 220 50 L220 90"
                stroke={primary} strokeWidth="1" fill="none" opacity={0.3} />
            </svg>
            <h2
              className="-mt-16 text-2xl tracking-[0.1em] md:text-3xl"
              style={{ fontFamily: displayFont, color: accent }}
            >
              {weddingDate}
            </h2>
          </div>
        )}

        {wedding.venue_name && (
          <div className="mt-8 flex flex-col items-center gap-1">
            <p className="text-lg" style={{ color: primary, fontFamily: bodyFont }}>
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
          <DotsPattern color={primary} />
        </div>
      </RevealSection>

      {/* ══════════════════════ COUNTDOWN ══════════════════════ */}
      {wedding.wedding_date && (
        <RevealSection
          className="flex flex-col items-center px-6 py-20"
          style={{ backgroundColor: secondary }}
        >
          <p
            className="mb-8 text-xs uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            Counting the days
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
          style={{ backgroundColor: secondary }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className="mb-10 text-3xl tracking-[0.12em] md:text-4xl"
              style={{ fontFamily: displayFont, color: accent }}
            >
              Our Story
            </h2>

            <div className="relative">
              <svg
                viewBox="0 0 40 32"
                fill="none"
                className="absolute -top-6 -left-2 md:-left-8"
                style={{ width: 36, height: 28, opacity: 0.12 }}
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
        style={{ backgroundColor: secondary }}
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
      <footer className="flex flex-col items-center px-6 pb-16 pt-8" style={{ backgroundColor: secondary }}>
        <SunMotif color={primary} />
        <p
          className="mt-6 text-xs tracking-[0.15em]"
          style={{ color: accent, opacity: 0.5 }}
        >
          Made with love
        </p>
      </footer>
    </div>
  );
}
