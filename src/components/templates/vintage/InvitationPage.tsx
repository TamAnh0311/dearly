"use client";

/**
 * Vintage invitation page — Old Hollywood glamour design with ornate SVG
 * filigree borders, Victorian frame patterns, film-strip decoration,
 * art nouveau flourishes, and monogram initial circle.
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

/** Victorian filigree corner ornament. */
function FiligreeCorner({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 110, height: 110 }}
    >
      <motion.path
        d="M4 126 C4 80 8 50 24 32 C36 18 56 10 126 4"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
      />
      <motion.path
        d="M10 126 C10 86 14 60 28 44 C40 30 58 20 126 12"
        stroke={color}
        strokeWidth="0.7"
        fill="none"
        opacity={0.4}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, ease: "easeInOut", delay: 0.7 }}
      />
      {/* Decorative scrollwork */}
      <motion.path
        d="M20 100 Q10 80 24 70 Q38 60 28 44"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        opacity={0.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
      />
      <motion.path
        d="M60 16 Q76 10 90 18 Q104 26 110 12"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        opacity={0.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
      />
      <motion.circle cx="24" cy="32" r="2.5" fill={color} opacity={0.6}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8 }} />
      <motion.circle cx="50" cy="16" r="1.5" fill={color} opacity={0.4}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }} />
    </svg>
  );
}

/** Art Nouveau inspired horizontal flourish divider. */
function ArtNouveauDivider({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 300 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 260, height: 32 }}
    >
      <line x1="0" y1="18" x2="90" y2="18" stroke={color} strokeWidth="0.5" opacity={0.3} />
      <path
        d="M90 18 Q105 4 120 12 Q135 20 150 10 Q165 0 180 12 Q195 24 210 18"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
      />
      {/* Central ornate diamond */}
      <path d="M150 4 L154 10 L150 16 L146 10 Z" fill={color} opacity={0.5} />
      <circle cx="150" cy="10" r="6" stroke={color} strokeWidth="0.5" fill="none" opacity={0.3} />
      <line x1="210" y1="18" x2="300" y2="18" stroke={color} strokeWidth="0.5" opacity={0.3} />
    </svg>
  );
}

/** Ornate monogram circle frame for initials. */
function MonogramFrame({ color, initials }: { color: string; initials: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 100, height: 100 }}
    >
      <circle cx="60" cy="60" r="52" stroke={color} strokeWidth="1.5" />
      <circle cx="60" cy="60" r="46" stroke={color} strokeWidth="0.5" opacity={0.3} />
      <circle cx="60" cy="60" r="56" stroke={color} strokeWidth="0.3" opacity={0.15} />
      {/* Small decorative dots at compass points */}
      <circle cx="60" cy="4" r="2" fill={color} opacity={0.5} />
      <circle cx="60" cy="116" r="2" fill={color} opacity={0.5} />
      <circle cx="4" cy="60" r="2" fill={color} opacity={0.5} />
      <circle cx="116" cy="60" r="2" fill={color} opacity={0.5} />
      <text
        x="60"
        y="66"
        textAnchor="middle"
        fill={color}
        fontSize="22"
        fontFamily="'Playfair Display', serif"
        opacity={0.8}
      >
        {initials}
      </text>
    </svg>
  );
}

/** Vintage ribbon banner for the date display. */
function RibbonBanner({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ maxWidth: 340 }}>
      <svg
        viewBox="0 0 340 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Ribbon tails */}
        <path d="M0 15 L30 15 L40 30 L30 45 L0 45 L10 30 Z" fill={color} opacity={0.08} />
        <path d="M340 15 L310 15 L300 30 L310 45 L340 45 L330 30 Z" fill={color} opacity={0.08} />
        {/* Main ribbon body */}
        <rect x="30" y="10" width="280" height="40" fill={color} opacity={0.05} rx="2" />
        <rect x="30" y="10" width="280" height="40" stroke={color} strokeWidth="0.8" fill="none" opacity={0.4} rx="2" />
      </svg>
      <div className="relative flex items-center justify-center py-4">
        {children}
      </div>
    </div>
  );
}

/** Film strip decoration — small decorative element. */
function FilmStripDecor({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 30 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 24, height: 64 }}
    >
      <rect x="0" y="0" width="30" height="80" stroke={color} strokeWidth="0.8" fill="none" opacity={0.2} />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x="3" y={4 + i * 13} width="5" height="8" fill={color} opacity={0.15} rx="1" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={`r${i}`} x="22" y={4 + i * 13} width="5" height="8" fill={color} opacity={0.15} rx="1" />
      ))}
    </svg>
  );
}

/** Footer ornament — ornate vintage flourish. */
function VintageFooterOrnament({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 180, height: 36 }}
    >
      <path d="M20 30 Q40 8 60 18 Q80 28 100 12" stroke={color} strokeWidth="1" fill="none" />
      <path d="M180 30 Q160 8 140 18 Q120 28 100 12" stroke={color} strokeWidth="1" fill="none" />
      <path d="M100 6 L103 12 L100 18 L97 12 Z" fill={color} opacity={0.5} />
      <circle cx="100" cy="12" r="4" stroke={color} strokeWidth="0.5" fill="none" opacity={0.3} />
    </svg>
  );
}

/* ─── Animation Variants ───────────────────────────────────────────────────── */

const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.22, delayChildren: 0.4 },
  },
};

const heroChild = {
  hidden: { opacity: 0, scale: 0.96, y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
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

export default function VintageInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const cornerParallax = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 45]);

  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;
  const accent = theme.colors.accent;
  const displayFont = `'${theme.fonts.display}', serif`;
  const bodyFont = `'${theme.fonts.body}', sans-serif`;

  const initials = `${(wedding.partner1_name?.[0] ?? "").toUpperCase()}${(wedding.partner2_name?.[0] ?? "").toUpperCase()}`;

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
      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center"
        style={{ backgroundColor: secondary }}
      >
        {/* Victorian filigree corners with parallax */}
        <motion.div className="absolute left-3 top-3 md:left-8 md:top-8" style={{ y: cornerParallax }}>
          <FiligreeCorner color={primary} />
        </motion.div>
        <motion.div
          className="absolute right-3 top-3 md:right-8 md:top-8"
          style={{ y: cornerParallax, transform: "scaleX(-1)" }}
        >
          <FiligreeCorner color={primary} />
        </motion.div>
        <motion.div
          className="absolute bottom-3 left-3 md:bottom-8 md:left-8"
          style={{ y: cornerParallax, transform: "scaleY(-1)" }}
        >
          <FiligreeCorner color={primary} />
        </motion.div>
        <motion.div
          className="absolute bottom-3 right-3 md:bottom-8 md:right-8"
          style={{ y: cornerParallax, transform: "scale(-1)" }}
        >
          <FiligreeCorner color={primary} />
        </motion.div>

        {/* Film strip decorations on edges */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-30 hidden md:block">
          <FilmStripDecor color={primary} />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-30 hidden md:block">
          <FilmStripDecor color={primary} />
        </div>

        {/* Central hero content */}
        <motion.div
          className="relative z-20 flex flex-col items-center px-6 text-center"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          style={{ y: heroContentY }}
        >
          {/* Monogram */}
          <motion.div variants={heroChild}>
            <MonogramFrame color={primary} initials={initials} />
          </motion.div>

          <motion.div
            variants={heroChild}
            className="mt-6 mb-4 h-px w-32"
            style={{ backgroundColor: primary, opacity: 0.4 }}
          />

          <motion.p
            variants={heroChild}
            className="mb-6 text-xs uppercase tracking-[0.35em]"
            style={{ color: accent }}
          >
            Together with their families
          </motion.p>

          {/* Partner names */}
          <motion.h1
            variants={heroChild}
            className="text-5xl font-light tracking-[0.15em] sm:text-6xl md:text-7xl lg:text-8xl"
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
            className="text-5xl font-light tracking-[0.15em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: primary, lineHeight: 1.15 }}
          >
            {wedding.partner2_name}
          </motion.h1>

          <motion.div
            variants={heroChild}
            className="mt-6 mb-4 h-px w-32"
            style={{ backgroundColor: primary, opacity: 0.4 }}
          />

          <motion.p
            variants={heroChild}
            className="text-xs uppercase tracking-[0.25em]"
            style={{ color: accent }}
          >
            Request the honour of your presence
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════════════════ DATE & VENUE ══════════════════════ */}
      <RevealSection
        className="flex flex-col items-center px-6 py-24 text-center"
        style={{ backgroundColor: secondary }}
      >
        <ArtNouveauDivider color={primary} />

        {weddingDate && (
          <div className="mt-10">
            <RibbonBanner color={primary}>
              <h2
                className="text-xl tracking-[0.1em] md:text-2xl"
                style={{ fontFamily: displayFont, color: primary }}
              >
                {weddingDate}
              </h2>
            </RibbonBanner>
          </div>
        )}

        {wedding.venue_name && (
          <div className="mt-8 flex flex-col items-center gap-1">
            <p className="text-lg italic" style={{ color: accent, fontFamily: displayFont }}>
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
          <ArtNouveauDivider color={primary} />
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
            Counting down to forever
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
              style={{ fontFamily: displayFont, color: primary }}
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
                className="whitespace-pre-line text-base italic leading-[1.9] md:text-lg"
                style={{ color: accent }}
              >
                <span
                  className="float-left mr-2 text-5xl leading-none not-italic"
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
              className="inline-block cursor-pointer border-2 px-8 py-3 text-sm uppercase tracking-[0.2em] transition-colors"
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
              className="inline-block cursor-pointer border-2 px-8 py-3 text-sm uppercase tracking-[0.2em] transition-colors"
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
        <VintageFooterOrnament color={primary} />
        <p
          className="mt-6 text-xs italic tracking-[0.15em]"
          style={{ color: accent, opacity: 0.5 }}
        >
          A timeless celebration
        </p>
      </footer>
    </div>
  );
}
