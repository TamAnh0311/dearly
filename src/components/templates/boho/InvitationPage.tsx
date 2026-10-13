"use client";

/**
 * Boho invitation page — bohemian free-spirit aesthetic with warm cream
 * background, earth-toned palette (terracotta, dusty rose, sage), SVG
 * dreamcatcher-inspired circular decoration, macrame diamond lattice patterns,
 * dried flower/pampas grass SVG illustrations, sun/moon elements, large
 * handwritten display font, and organic asymmetric layout.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/* ─── SVG: Dreamcatcher Circle ────────────────────────────────────────────── */

/** Dreamcatcher-inspired concentric circles with radial web pattern. */
function Dreamcatcher({ color, accent, className }: { color: string; accent: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 220, height: 220 }}
    >
      {/* Outer ring */}
      <motion.circle
        cx="120"
        cy="120"
        r="110"
        stroke={color}
        strokeWidth="1.2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      {/* Middle ring */}
      <motion.circle
        cx="120"
        cy="120"
        r="90"
        stroke={color}
        strokeWidth="0.6"
        opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, delay: 0.3 }}
      />
      {/* Inner ring */}
      <motion.circle
        cx="120"
        cy="120"
        r="65"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.35"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.6 }}
      />
      {/* Radial web lines */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x1 = 120 + 65 * Math.cos(angle);
        const y1 = 120 + 65 * Math.sin(angle);
        const x2 = 120 + 110 * Math.cos(angle);
        const y2 = 120 + 110 * Math.sin(angle);
        return (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth="0.5"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.8 + i * 0.08 }}
          />
        );
      })}
      {/* Beads at intersections */}
      {[0, 90, 180, 270].map((deg, i) => {
        const angle = (deg * Math.PI) / 180;
        return (
          <motion.circle
            key={`bead-${i}`}
            cx={120 + 90 * Math.cos(angle)}
            cy={120 + 90 * Math.sin(angle)}
            r="3"
            fill={accent}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5 + i * 0.1, type: "spring" }}
          />
        );
      })}
      {/* Hanging feather lines at bottom */}
      {[-20, 0, 20].map((offsetX, i) => (
        <motion.line
          key={`hang-${i}`}
          x1={120 + offsetX}
          y1="230"
          x2={120 + offsetX}
          y2="240"
          stroke={accent}
          strokeWidth="0.8"
          opacity="0.4"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 2 + i * 0.15 }}
        />
      ))}
    </svg>
  );
}

/* ─── SVG: Macrame Diamond Pattern ────────────────────────────────────────── */

/** Geometric diamond lattice pattern inspired by macrame weaving. */
function MacramePattern({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 100, height: 50 }}
    >
      {/* Diamond shapes */}
      <path d="M30 0 L60 15 L30 30 L0 15 Z" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <path d="M90 0 L120 15 L90 30 L60 15 Z" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <path d="M60 15 L90 30 L60 45 L30 30 Z" stroke={color} strokeWidth="0.8" opacity="0.25" />
      {/* Connecting knots */}
      <circle cx="30" cy="0" r="2" fill={color} opacity="0.4" />
      <circle cx="60" cy="15" r="2" fill={color} opacity="0.4" />
      <circle cx="90" cy="0" r="2" fill={color} opacity="0.4" />
      <circle cx="30" cy="30" r="2" fill={color} opacity="0.4" />
      <circle cx="90" cy="30" r="2" fill={color} opacity="0.4" />
      <circle cx="60" cy="45" r="2" fill={color} opacity="0.4" />
    </svg>
  );
}

/* ─── SVG: Pampas Grass ───────────────────────────────────────────────────── */

/** Dried pampas grass illustration for bohemian corner accents. */
function PampasGrass({ color, className, flip }: { color: string; className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 80 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 60, height: 120, transform: flip ? "scaleX(-1)" : undefined }}
    >
      {/* Main stem */}
      <path d="M40 160 C40 120 38 80 42 40" stroke={color} strokeWidth="1" opacity="0.5" />
      {/* Plume fronds */}
      <path d="M42 40 C35 35 28 20 30 5" stroke={color} strokeWidth="0.7" opacity="0.35" />
      <path d="M42 40 C45 30 50 18 48 2" stroke={color} strokeWidth="0.7" opacity="0.35" />
      <path d="M42 40 C38 28 32 15 38 0" stroke={color} strokeWidth="0.7" opacity="0.3" />
      <path d="M42 40 C48 32 55 22 52 8" stroke={color} strokeWidth="0.7" opacity="0.3" />
      <path d="M42 40 C40 25 42 12 44 0" stroke={color} strokeWidth="0.8" opacity="0.4" />
      {/* Fluffy edges */}
      <ellipse cx="40" cy="18" rx="14" ry="20" fill={color} opacity="0.06" />
    </svg>
  );
}

/* ─── SVG: Sun Element ────────────────────────────────────────────────────── */

/** Minimalist boho sun with radial lines. */
function BohoSun({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 40, height: 40 }}
    >
      <circle cx="30" cy="30" r="10" stroke={color} strokeWidth="1" opacity="0.4" />
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 30 + 14 * Math.cos(angle);
        const y1 = 30 + 14 * Math.sin(angle);
        const x2 = 30 + (i % 2 === 0 ? 26 : 20) * Math.cos(angle);
        const y2 = 30 + (i % 2 === 0 ? 26 : 20) * Math.sin(angle);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.8" opacity="0.35" />
        );
      })}
    </svg>
  );
}

/* ─── SVG: Moon Element ───────────────────────────────────────────────────── */

/** Crescent moon for boho celestial accent. */
function BohoMoon({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 30, height: 30 }}
    >
      <path
        d="M28 6 A16 16 0 1 0 28 34 A12 12 0 1 1 28 6"
        stroke={color}
        strokeWidth="1"
        fill={color}
        opacity="0.15"
      />
    </svg>
  );
}

/* ─── Animation Variants ──────────────────────────────────────────────────── */

const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
};

const heroChild = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
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

export default function BohoInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;
  const accent = theme.colors.accent;
  const displayFont = `'${theme.fonts.display}', cursive`;
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
      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section className="relative flex min-h-screen items-center justify-center px-6">
        {/* Pampas grass corner decorations */}
        <motion.div
          className="absolute left-2 top-10 hidden md:block"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <PampasGrass color={primary} />
        </motion.div>
        <motion.div
          className="absolute right-2 top-10 hidden md:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <PampasGrass color={accent} flip />
        </motion.div>

        {/* Sun & moon celestial accents */}
        <motion.div
          className="absolute left-8 top-8 hidden md:block"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        >
          <BohoSun color={primary} />
        </motion.div>
        <motion.div
          className="absolute right-10 bottom-16 hidden md:block"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, type: "spring" }}
        >
          <BohoMoon color={accent} />
        </motion.div>

        {/* Macrame patterns at edges */}
        <motion.div
          className="absolute bottom-8 left-4 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <MacramePattern color={primary} />
        </motion.div>
        <motion.div
          className="absolute right-4 top-1/3 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <MacramePattern color={accent} />
        </motion.div>

        {/* Central content with dreamcatcher */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
        >
          {/* Dreamcatcher as backdrop for names */}
          <motion.div variants={heroChild} className="relative">
            <Dreamcatcher color={primary} accent={accent} />

            {/* Names centered inside the dreamcatcher */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.p
                variants={heroChild}
                className="text-xs uppercase tracking-[0.3em]"
                style={{ color: accent, opacity: 0.7 }}
              >
                Together forever
              </motion.p>
            </div>
          </motion.div>

          {/* Names below dreamcatcher — asymmetric sizing */}
          <motion.h1
            variants={heroChild}
            className="mt-6 text-6xl sm:text-7xl md:text-8xl"
            style={{ fontFamily: displayFont, color: primary, lineHeight: 1.1 }}
          >
            {wedding.partner1_name}
          </motion.h1>

          <motion.p
            variants={heroChild}
            className="my-2 text-2xl"
            style={{ color: accent, fontFamily: bodyFont, fontWeight: 300 }}
          >
            &amp;
          </motion.p>

          <motion.h1
            variants={heroChild}
            className="text-6xl sm:text-7xl md:text-8xl"
            style={{ fontFamily: displayFont, color: primary, lineHeight: 1.1 }}
          >
            {wedding.partner2_name}
          </motion.h1>

          {/* Small serif subtitle */}
          <motion.p
            variants={heroChild}
            className="mt-6 text-sm font-light tracking-[0.15em]"
            style={{ color: accent, opacity: 0.6, fontFamily: bodyFont }}
          >
            are getting married
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════════ DATE & VENUE ═══════════════════ */}
      <RevealSection
        className="flex flex-col items-center px-6 py-24 text-center"
      >
        {/* Organic divider */}
        <svg
          viewBox="0 0 200 8"
          className="mx-auto mb-10"
          style={{ width: 160, height: 8 }}
        >
          <path
            d="M0 4 Q25 0 50 4 Q75 8 100 4 Q125 0 150 4 Q175 8 200 4"
            stroke={primary}
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          />
        </svg>

        {weddingDate && (
          <div className="flex items-center gap-3">
            <Calendar size={16} style={{ color: primary }} />
            <h2
              className="text-2xl font-light tracking-wide md:text-3xl"
              style={{ color: accent }}
            >
              {weddingDate}
            </h2>
          </div>
        )}

        {wedding.venue_name && (
          <div className="mt-5 flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: primary }} />
              <p className="text-base" style={{ color: accent }}>
                {wedding.venue_name}
              </p>
            </div>
            {wedding.venue_address && (
              <p className="text-sm" style={{ color: accent, opacity: 0.55 }}>
                {wedding.venue_address}
              </p>
            )}
          </div>
        )}

        {/* Organic divider */}
        <svg
          viewBox="0 0 200 8"
          className="mx-auto mt-10"
          style={{ width: 160, height: 8 }}
        >
          <path
            d="M0 4 Q25 8 50 4 Q75 0 100 4 Q125 8 150 4 Q175 0 200 4"
            stroke={primary}
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          />
        </svg>
      </RevealSection>

      {/* ═══════════════════ COUNTDOWN ═══════════════════ */}
      {wedding.wedding_date && (
        <RevealSection className="flex flex-col items-center px-6 py-20">
          <p
            className="mb-8 text-xs uppercase tracking-[0.25em]"
            style={{ color: primary }}
          >
            Days until forever
          </p>

          <CountdownTimer
            targetDate={wedding.wedding_date}
            className="gap-5 md:gap-8"
            numberClassName="text-4xl md:text-5xl font-light tabular-nums"
            labelClassName="text-xs uppercase tracking-wider mt-2"
          />
        </RevealSection>
      )}

      {/* ═══════════════════ OUR STORY ═══════════════════ */}
      {wedding.story_text && (
        <RevealSection className="relative px-6 py-24">
          {/* Offset card — asymmetric layout */}
          <div
            className="relative mx-auto max-w-xl rounded-2xl p-8 md:ml-auto md:mr-16 md:p-12"
            style={{
              backgroundColor: "#FFF8F0",
              boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
            }}
          >
            {/* Pampas accent on the card */}
            <div className="absolute -left-8 -top-6 hidden md:block">
              <PampasGrass color={primary} />
            </div>

            <h2
              className="mb-2 text-center text-4xl md:text-5xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              Our Story
            </h2>

            {/* Wavy divider */}
            <svg viewBox="0 0 160 8" className="mx-auto mb-8" style={{ width: 120, height: 8 }}>
              <path
                d="M0 4 Q20 0 40 4 Q60 8 80 4 Q100 0 120 4 Q140 8 160 4"
                stroke={accent}
                strokeWidth="1"
                fill="none"
                opacity="0.4"
              />
            </svg>

            <p
              className="whitespace-pre-line text-base leading-[2] md:text-lg"
              style={{ color: accent, opacity: 0.8, fontWeight: 300 }}
            >
              {wedding.story_text}
            </p>
          </div>
        </RevealSection>
      )}

      {/* ═══════════════════ EXPLORE LINKS ═══════════════════ */}
      <RevealSection className="flex flex-col items-center px-6 py-20">
        <p
          className="mb-8 text-xs uppercase tracking-[0.25em]"
          style={{ color: primary }}
        >
          Explore
        </p>

        <div className="flex flex-wrap justify-center gap-5">
          <Link href={`/${wedding.slug}/gallery`}>
            <motion.span
              className="inline-block cursor-pointer rounded-full border px-8 py-3 text-sm tracking-wider"
              style={{
                borderColor: primary,
                color: primary,
                fontFamily: bodyFont,
              }}
              whileHover={{
                backgroundColor: primary,
                color: secondary,
                scale: 1.04,
              }}
              transition={{ duration: 0.3 }}
            >
              Gallery
            </motion.span>
          </Link>

          <Link href={`/${wedding.slug}/guestbook`}>
            <motion.span
              className="inline-block cursor-pointer rounded-full border px-8 py-3 text-sm tracking-wider"
              style={{
                borderColor: primary,
                color: primary,
                fontFamily: bodyFont,
              }}
              whileHover={{
                backgroundColor: primary,
                color: secondary,
                scale: 1.04,
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
        <BohoSun color={primary} />
        <p
          className="mt-4 text-xs tracking-[0.15em]"
          style={{ color: accent, opacity: 0.4 }}
        >
          Made with love
        </p>
      </footer>
    </div>
  );
}
