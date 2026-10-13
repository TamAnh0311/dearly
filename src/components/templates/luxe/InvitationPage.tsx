"use client";

/**
 * Luxe invitation page — luxury gold & marble aesthetic with CSS marble-texture
 * background, gold (#D4AF37) accents, SVG laurel wreath monogram, thin gold
 * line borders, gold-framed countdown boxes, elegant serif typography with
 * wide letter spacing, and a story section on off-white panel with gold corners.
 */

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/* ─── Marble Background CSS ───────────────────────────────────────────────── */

/** Generates a CSS marble-texture background using multiple radial gradients. */
function getMarbleBackground(base: string): string {
  return [
    `radial-gradient(ellipse at 15% 25%, rgba(180,170,155,0.08) 0%, transparent 50%)`,
    `radial-gradient(ellipse at 80% 15%, rgba(160,150,140,0.06) 0%, transparent 45%)`,
    `radial-gradient(ellipse at 50% 70%, rgba(190,180,170,0.07) 0%, transparent 55%)`,
    `radial-gradient(ellipse at 25% 85%, rgba(170,160,150,0.05) 0%, transparent 40%)`,
    `radial-gradient(ellipse at 70% 50%, rgba(200,190,180,0.04) 0%, transparent 50%)`,
    `radial-gradient(ellipse at 90% 80%, rgba(175,165,155,0.06) 0%, transparent 45%)`,
    `linear-gradient(135deg, ${base} 0%, ${base} 100%)`,
  ].join(", ");
}

/* ─── SVG: Laurel Wreath ──────────────────────────────────────────────────── */

/** Ornamental laurel wreath that encircles the couple monogram initials. */
function LaurelWreath({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 160, height: 160 }}
    >
      {/* Left branch */}
      <motion.path
        d="M100 180 C60 170 30 140 25 100 C22 70 35 40 60 25"
        stroke={color}
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
      />
      {/* Left leaves */}
      {[
        "M55 155 C45 148 42 138 48 130",
        "M42 135 C30 130 28 118 35 110",
        "M32 112 C22 105 22 92 30 85",
        "M28 88 C22 78 25 65 35 58",
        "M35 62 C30 50 38 38 50 32",
      ].map((d, i) => (
        <motion.path
          key={`l${i}`}
          d={d}
          stroke={color}
          strokeWidth="0.8"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 0.6, delay: 0.8 + i * 0.15 }}
        />
      ))}
      {/* Right branch */}
      <motion.path
        d="M100 180 C140 170 170 140 175 100 C178 70 165 40 140 25"
        stroke={color}
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
      />
      {/* Right leaves */}
      {[
        "M145 155 C155 148 158 138 152 130",
        "M158 135 C170 130 172 118 165 110",
        "M168 112 C178 105 178 92 170 85",
        "M172 88 C178 78 175 65 165 58",
        "M165 62 C170 50 162 38 150 32",
      ].map((d, i) => (
        <motion.path
          key={`r${i}`}
          d={d}
          stroke={color}
          strokeWidth="0.8"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 0.6, delay: 1.0 + i * 0.15 }}
        />
      ))}
      {/* Top meeting point */}
      <motion.circle
        cx="100"
        cy="20"
        r="3"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2.2, type: "spring" }}
      />
    </svg>
  );
}

/* ─── SVG: Gold Corner Accent ─────────────────────────────────────────────── */

/** L-shaped gold corner accent for the story panel. */
function GoldCorner({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 40, height: 40 }}
    >
      <path d="M0 0 L24 0 L24 2 L2 2 L2 24 L0 24 Z" fill={color} />
      <path d="M8 0 L10 0 L10 10 L0 10 L0 8 L8 8 Z" fill={color} opacity="0.4" />
    </svg>
  );
}

/* ─── SVG: Thin Gold Divider ──────────────────────────────────────────────── */

/** Centered thin gold line divider with diamond midpoint. */
function GoldDivider({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 300 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 240, height: 12 }}
    >
      <line x1="0" y1="6" x2="130" y2="6" stroke={color} strokeWidth="0.5" opacity="0.6" />
      <rect x="145" y="1" width="10" height="10" fill={color} transform="rotate(45 150 6)" />
      <line x1="170" y1="6" x2="300" y2="6" stroke={color} strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}

/* ─── Animation Variants ──────────────────────────────────────────────────── */

const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.4 },
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

/** Section reveal for scroll-triggered animations. */
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

/* ─── Main Component ──────────────────────────────────────────────────────── */

export default function LuxeInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 60]);

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

  const initials =
    (wedding.partner1_name?.charAt(0) ?? "") +
    (wedding.partner2_name?.charAt(0) ?? "");

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: getMarbleBackground(secondary),
        fontFamily: bodyFont,
      }}
    >
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center px-6"
      >
        {/* Thin gold border frame */}
        <div
          className="pointer-events-none absolute inset-6 md:inset-12"
          style={{ border: `1px solid ${primary}40` }}
        />
        <div
          className="pointer-events-none absolute inset-8 md:inset-14"
          style={{ border: `0.5px solid ${primary}25` }}
        />

        {/* Central hero content */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          style={{ y: parallaxY }}
        >
          {/* Laurel wreath with monogram */}
          <motion.div variants={heroChild} className="relative mb-6">
            <LaurelWreath color={primary} />
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-light tracking-[0.3em]"
              style={{ fontFamily: displayFont, color: primary }}
            >
              {initials}
            </span>
          </motion.div>

          {/* Top gold rule */}
          <motion.div
            variants={heroChild}
            className="mb-6 h-px w-32"
            style={{ backgroundColor: primary, opacity: 0.5 }}
          />

          <motion.p
            variants={heroChild}
            className="mb-8 text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent, opacity: 0.6 }}
          >
            Together with their families
          </motion.p>

          {/* Partner 1 */}
          <motion.h1
            variants={heroChild}
            className="text-5xl font-extralight tracking-[0.25em] sm:text-6xl md:text-7xl"
            style={{ fontFamily: displayFont, color: accent, lineHeight: 1.2 }}
          >
            {wedding.partner1_name}
          </motion.h1>

          {/* Ampersand */}
          <motion.p
            variants={heroChild}
            className="my-4 text-3xl font-light italic md:my-5"
            style={{ color: primary, fontFamily: displayFont }}
          >
            &amp;
          </motion.p>

          {/* Partner 2 */}
          <motion.h1
            variants={heroChild}
            className="text-5xl font-extralight tracking-[0.25em] sm:text-6xl md:text-7xl"
            style={{ fontFamily: displayFont, color: accent, lineHeight: 1.2 }}
          >
            {wedding.partner2_name}
          </motion.h1>

          {/* Bottom gold rule */}
          <motion.div
            variants={heroChild}
            className="mt-8 mb-5 h-px w-32"
            style={{ backgroundColor: primary, opacity: 0.5 }}
          />

          <motion.p
            variants={heroChild}
            className="text-[10px] uppercase tracking-[0.4em]"
            style={{ color: accent, opacity: 0.5 }}
          >
            Request the pleasure of your company
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════════ DATE & VENUE ═══════════════════ */}
      <RevealSection
        className="flex flex-col items-center px-6 py-24 text-center"
      >
        <GoldDivider color={primary} />

        {weddingDate && (
          <div className="mt-10 flex items-center gap-3">
            <Calendar size={14} style={{ color: primary }} />
            <h2
              className="text-2xl font-light tracking-[0.15em] md:text-3xl"
              style={{ fontFamily: displayFont, color: accent }}
            >
              {weddingDate}
            </h2>
          </div>
        )}

        {wedding.venue_name && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: primary }} />
              <p
                className="text-lg font-light tracking-[0.1em]"
                style={{ color: accent }}
              >
                {wedding.venue_name}
              </p>
            </div>
            {wedding.venue_address && (
              <p
                className="text-sm font-light tracking-wide"
                style={{ color: accent, opacity: 0.55 }}
              >
                {wedding.venue_address}
              </p>
            )}
          </div>
        )}

        <div className="mt-10">
          <GoldDivider color={primary} />
        </div>
      </RevealSection>

      {/* ═══════════════════ COUNTDOWN ═══════════════════ */}
      {wedding.wedding_date && (
        <RevealSection className="flex flex-col items-center px-6 py-20">
          <p
            className="mb-10 text-[10px] uppercase tracking-[0.5em]"
            style={{ color: primary }}
          >
            Counting the moments
          </p>

          <CountdownTimer
            targetDate={wedding.wedding_date}
            className="gap-4 md:gap-8"
            numberClassName="text-4xl md:text-5xl font-extralight tabular-nums"
            labelClassName="text-[10px] uppercase tracking-[0.2em] mt-2"
          />
        </RevealSection>
      )}

      {/* ═══════════════════ OUR STORY ═══════════════════ */}
      {wedding.story_text && (
        <RevealSection className="px-6 py-24">
          <div
            className="relative mx-auto max-w-2xl p-10 md:p-14"
            style={{
              backgroundColor: "#F7F5F0",
              boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
            }}
          >
            {/* Gold corner accents */}
            <GoldCorner color={primary} className="absolute left-3 top-3" />
            <div className="absolute right-3 top-3" style={{ transform: "scaleX(-1)" }}>
              <GoldCorner color={primary} />
            </div>
            <div className="absolute bottom-3 left-3" style={{ transform: "scaleY(-1)" }}>
              <GoldCorner color={primary} />
            </div>
            <div className="absolute bottom-3 right-3" style={{ transform: "scale(-1)" }}>
              <GoldCorner color={primary} />
            </div>

            <h2
              className="mb-3 text-center text-3xl font-light tracking-[0.15em] md:text-4xl"
              style={{ fontFamily: displayFont, color: accent }}
            >
              Our Story
            </h2>

            <div className="mx-auto mb-8">
              <GoldDivider color={primary} />
            </div>

            <p
              className="whitespace-pre-line text-center text-base font-light leading-[2] md:text-lg"
              style={{ color: accent, opacity: 0.8 }}
            >
              {wedding.story_text}
            </p>
          </div>
        </RevealSection>
      )}

      {/* ═══════════════════ EXPLORE LINKS ═══════════════════ */}
      <RevealSection className="flex flex-col items-center px-6 py-20">
        <p
          className="mb-8 text-[10px] uppercase tracking-[0.5em]"
          style={{ color: primary }}
        >
          Explore
        </p>

        <div className="flex flex-wrap justify-center gap-5">
          <Link href={`/${wedding.slug}/gallery`}>
            <motion.span
              className="inline-block cursor-pointer border px-10 py-3 text-xs uppercase tracking-[0.25em]"
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
              className="inline-block cursor-pointer border px-10 py-3 text-xs uppercase tracking-[0.25em]"
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

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="flex flex-col items-center px-6 pb-16 pt-8">
        <GoldDivider color={primary} />
        <p
          className="mt-6 text-[10px] uppercase tracking-[0.3em]"
          style={{ color: accent, opacity: 0.35 }}
        >
          Made with love
        </p>
      </footer>
    </div>
  );
}
