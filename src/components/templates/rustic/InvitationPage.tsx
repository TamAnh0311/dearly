"use client";

/**
 * Rustic invitation page — kraft paper woodland wedding design.
 * Features parchment background with CSS noise texture, hand-drawn SVG wreath
 * around names, dashed border frame, botanical line-art dividers, SVG ribbon
 * banner for the date, falling leaf particles, self-drawing SVG elements,
 * and a botanical initial cap in the story section.
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

/* ─── SVG Draw Animation Variant ──────────────────────────────────────────── */

/** Standard self-drawing path animation variant for SVG strokes. */
const drawVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 2.2, ease: "easeInOut" as const, delay: 0.3 },
  },
};

const drawVariantSlow = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 3, ease: "easeInOut" as const, delay: 0.5 },
  },
};

/* ─── SVG Wreath Around Names ─────────────────────────────────────────────── */

/** Hand-drawn botanical wreath with leaves and berries that draws itself. */
function HandDrawnWreath({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <svg
      viewBox="0 0 360 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: "none" }}
    >
      {/* Left arc — main branch */}
      <motion.path
        d="M60 220 Q20 180 16 140 Q12 100 24 70 Q36 40 60 24 Q84 10 120 6"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        variants={drawVariantSlow}
        initial="hidden"
        animate="visible"
      />
      {/* Right arc — main branch */}
      <motion.path
        d="M300 220 Q340 180 344 140 Q348 100 336 70 Q324 40 300 24 Q276 10 240 6"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        variants={drawVariantSlow}
        initial="hidden"
        animate="visible"
      />
      {/* Left leaves */}
      <motion.path d="M22 150 Q10 144 18 134" stroke={accentColor} strokeWidth="0.8" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.5 }} />
      <motion.path d="M28 110 Q14 106 22 96" stroke={accentColor} strokeWidth="0.8" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.7 }} />
      <motion.path d="M42 64 Q30 56 38 48" stroke={accentColor} strokeWidth="0.8" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.9 }} />
      <motion.path d="M72 32 Q60 22 70 16" stroke={accentColor} strokeWidth="0.8" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 2.1 }} />
      {/* Right leaves */}
      <motion.path d="M338 150 Q350 144 342 134" stroke={accentColor} strokeWidth="0.8" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.6 }} />
      <motion.path d="M332 110 Q346 106 338 96" stroke={accentColor} strokeWidth="0.8" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.8 }} />
      <motion.path d="M318 64 Q330 56 322 48" stroke={accentColor} strokeWidth="0.8" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 2.0 }} />
      <motion.path d="M288 32 Q300 22 290 16" stroke={accentColor} strokeWidth="0.8" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 2.2 }} />
      {/* Berries — small circles */}
      <motion.circle cx="16" cy="130" r="2.5" fill={color} opacity={0.4}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.4 }} />
      <motion.circle cx="20" cy="90" r="2" fill={color} opacity={0.35}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5 }} />
      <motion.circle cx="344" cy="130" r="2.5" fill={color} opacity={0.4}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.6 }} />
      <motion.circle cx="340" cy="90" r="2" fill={color} opacity={0.35}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.7 }} />
      {/* Bottom tie */}
      <motion.path
        d="M120 6 Q140 2 160 4 Q180 0 200 4 Q220 2 240 6"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 2.0 }}
      />
    </svg>
  );
}

/* ─── Botanical Line-Art Divider ──────────────────────────────────────────── */

/** SVG branch/leaf divider with berries for separating sections. */
function BotanicalDivider({ color, accentColor }: { color: string; accentColor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="mx-auto" style={{ width: 260, height: 32 }}>
      <svg viewBox="0 0 260 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Central branch */}
        <motion.path
          d="M20 16 Q60 8 100 14 Q130 18 160 14 Q200 8 240 16"
          stroke={color}
          strokeWidth="0.8"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        {/* Leaves along the branch */}
        <ellipse cx="60" cy="10" rx="8" ry="3" fill={accentColor} opacity={inView ? 0.18 : 0} transform="rotate(-25 60 10)" />
        <ellipse cx="100" cy="16" rx="6" ry="2.5" fill={accentColor} opacity={inView ? 0.15 : 0} transform="rotate(10 100 16)" />
        <ellipse cx="160" cy="12" rx="7" ry="3" fill={accentColor} opacity={inView ? 0.16 : 0} transform="rotate(-15 160 12)" />
        <ellipse cx="200" cy="10" rx="8" ry="3" fill={accentColor} opacity={inView ? 0.18 : 0} transform="rotate(20 200 10)" />
        {/* Berry dots */}
        <circle cx="80" cy="12" r="2" fill={color} opacity={inView ? 0.35 : 0} />
        <circle cx="130" cy="16" r="2.5" fill={color} opacity={inView ? 0.3 : 0} />
        <circle cx="180" cy="11" r="2" fill={color} opacity={inView ? 0.35 : 0} />
      </svg>
    </div>
  );
}

/* ─── SVG Ribbon Banner ───────────────────────────────────────────────────── */

/** Date displayed inside a hand-drawn ribbon banner shape. */
function RibbonBanner({
  text,
  color,
  textColor,
  fontFamily,
}: {
  text: string;
  color: string;
  textColor: string;
  fontFamily: string;
}) {
  return (
    <div className="relative mx-auto" style={{ width: 320, height: 56 }}>
      <svg viewBox="0 0 320 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
        {/* Ribbon body */}
        <motion.path
          d="M40 8 L280 8 L300 28 L280 48 L40 48 L20 28 Z"
          stroke={color}
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
        {/* Ribbon tails */}
        <motion.path
          d="M40 8 L8 8 L24 28 L8 48 L40 48"
          stroke={color}
          strokeWidth="0.7"
          fill="none"
          opacity={0.5}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 1.0 }}
        />
        <motion.path
          d="M280 8 L312 8 L296 28 L312 48 L280 48"
          stroke={color}
          strokeWidth="0.7"
          fill="none"
          opacity={0.5}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 1.0 }}
        />
      </svg>
      <div
        className="relative flex h-full items-center justify-center text-xs uppercase tracking-[0.3em]"
        style={{ color: textColor, fontFamily }}
      >
        {text}
      </div>
    </div>
  );
}

/* ─── Dashed Border Frame ─────────────────────────────────────────────────── */

/** Full-page dashed border that draws itself on load. */
function DashedFrame({ color }: { color: string }) {
  return (
    <svg
      className="pointer-events-none absolute inset-6 md:inset-10 h-[calc(100%-3rem)] w-[calc(100%-3rem)] md:h-[calc(100%-5rem)] md:w-[calc(100%-5rem)]"
      viewBox="0 0 400 500"
      preserveAspectRatio="none"
      fill="none"
    >
      <motion.rect
        x="2" y="2" width="396" height="496" rx="3"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="8 5"
        fill="none"
        opacity={0.25}
        variants={drawVariant}
        initial="hidden"
        animate="visible"
      />
    </svg>
  );
}

/* ─── Falling Leaf Particles ──────────────────────────────────────────────── */

const leaves = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  left: `${15 + i * 18}%`,
  size: 10 + (i % 3) * 4,
  delay: i * 2.5,
  duration: 14 + (i % 3) * 3,
  drift: ((i % 2) - 0.5) * 60,
  rotation: (i * 72) % 360,
}));

/* ─── Section Reveal ──────────────────────────────────────────────────────── */

/** Scroll-triggered section reveal with rustic spring physics. */
function RusticReveal({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  return (
    <motion.section
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ type: "spring", stiffness: 60, damping: 16 }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */

export default function RusticInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const wreathParallax = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const nameParallax = useTransform(scrollYProgress, [0, 1], [0, 50]);

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

  /** CSS noise texture for kraft paper feel. */
  const noiseTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`;

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: secondary,
        fontFamily: bodyFont,
        backgroundImage: noiseTexture,
        backgroundRepeat: "repeat",
      }}
    >
      {/* ─── Falling leaf particles (3-5 SVG leaves) ─── */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {leaves.map((l) => (
          <motion.div
            key={l.id}
            className="absolute"
            style={{ left: l.left, top: -30 }}
            animate={{
              y: [0, typeof window !== "undefined" ? window.innerHeight + 60 : 1200],
              x: [0, l.drift],
              rotate: [l.rotation, l.rotation + 240],
              opacity: [0.3, 0.2, 0.3, 0.1],
            }}
            transition={{
              duration: l.duration,
              delay: l.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Inline SVG leaf shape */}
            <svg
              viewBox="0 0 24 32"
              fill="none"
              style={{ width: l.size, height: l.size * 1.3 }}
            >
              <path
                d="M12 0 Q20 8 20 18 Q20 28 12 32 Q4 28 4 18 Q4 8 12 0Z"
                fill={accent}
                opacity={0.35}
              />
              <path
                d="M12 4 L12 28"
                stroke={accent}
                strokeWidth="0.5"
                opacity={0.3}
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center px-8 text-center"
      >
        {/* Dashed border frame */}
        <DashedFrame color={primary} />

        {/* Wreath around names */}
        <motion.div
          className="relative flex flex-col items-center"
          style={{ width: 360, maxWidth: "90vw", minHeight: 260, y: wreathParallax }}
        >
          <HandDrawnWreath color={primary} accentColor={accent} />

          {/* Content inside wreath */}
          <motion.div
            className="relative z-10 flex flex-col items-center py-12"
            style={{ y: nameParallax }}
          >
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-6 text-[10px] uppercase tracking-[0.35em] md:text-xs"
              style={{ color: accent }}
            >
              With heartfelt joy
            </motion.p>

            {/* Partner 1 — large handwritten style */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl"
              style={{ fontFamily: displayFont, color: primary, lineHeight: 1.1 }}
            >
              {wedding.partner1_name}
            </motion.h1>

            {/* Ampersand with flanking lines */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.3 }}
              className="my-4 flex items-center gap-4"
            >
              <div className="h-px w-10 md:w-14" style={{ backgroundColor: accent, opacity: 0.35 }} />
              <span
                className="text-lg italic"
                style={{ color: accent, fontFamily: bodyFont }}
              >
                &amp;
              </span>
              <div className="h-px w-10 md:w-14" style={{ backgroundColor: accent, opacity: 0.35 }} />
            </motion.div>

            {/* Partner 2 — large handwritten style */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="text-5xl md:text-7xl lg:text-8xl"
              style={{ fontFamily: displayFont, color: primary, lineHeight: 1.1 }}
            >
              {wedding.partner2_name}
            </motion.h1>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════ DATE IN RIBBON BANNER ═══════════════════════ */}
      {weddingDate && (
        <RusticReveal
          className="flex flex-col items-center px-6 py-16"
          style={{ backgroundColor: "transparent" }}
        >
          <RibbonBanner
            text={weddingDate}
            color={primary}
            textColor={accent}
            fontFamily={bodyFont}
          />
        </RusticReveal>
      )}

      {/* ═══════════════════════ VENUE ═══════════════════════ */}
      {wedding.venue_name && (
        <RusticReveal
          className="flex flex-col items-center px-6 pb-16 text-center"
          style={{ backgroundColor: "transparent" }}
        >
          <BotanicalDivider color={primary} accentColor={accent} />

          <div className="mt-8 flex flex-col items-center gap-2">
            {/* Simple map pin SVG */}
            <svg viewBox="0 0 16 22" fill="none" style={{ width: 14, height: 20, marginBottom: 4 }}>
              <path
                d="M8 0 C3.6 0 0 3.6 0 8 C0 15 8 22 8 22 C8 22 16 15 16 8 C16 3.6 12.4 0 8 0Z"
                stroke={accent}
                strokeWidth="1"
                fill="none"
                opacity={0.4}
              />
              <circle cx="8" cy="8" r="2.5" fill={accent} opacity={0.35} />
            </svg>
            <p className="text-base" style={{ color: accent, fontFamily: bodyFont }}>
              {wedding.venue_name}
            </p>
            {wedding.venue_address && (
              <p className="text-sm" style={{ color: accent, opacity: 0.5 }}>
                {wedding.venue_address}
              </p>
            )}
          </div>

          <div className="mt-8">
            <BotanicalDivider color={primary} accentColor={accent} />
          </div>
        </RusticReveal>
      )}

      {/* ═══════════════════════ COUNTDOWN ═══════════════════════ */}
      {wedding.wedding_date && (
        <RusticReveal
          className="flex flex-col items-center px-6 py-20"
          style={{ backgroundColor: "transparent" }}
        >
          <p
            className="mb-10 text-[10px] uppercase tracking-[0.3em] md:text-xs"
            style={{ color: accent }}
          >
            Days until forever
          </p>

          <CountdownTimer
            targetDate={wedding.wedding_date}
            className="gap-4 md:gap-6"
            numberClassName="text-3xl md:text-4xl font-light tabular-nums"
            labelClassName="text-[10px] uppercase tracking-[0.14em] mt-2"
          />
        </RusticReveal>
      )}

      {/* ═══════════════════════ OUR STORY ═══════════════════════ */}
      {wedding.story_text && (
        <RusticReveal
          className="px-6 py-28"
          style={{ backgroundColor: "transparent" }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <BotanicalDivider color={primary} accentColor={accent} />

            <h2
              className="mt-10 mb-12 text-4xl md:text-5xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              Our Story
            </h2>

            {/* Story with botanical initial cap */}
            <div className="text-left">
              <p
                className="whitespace-pre-line text-sm leading-[2] md:text-base"
                style={{ color: accent }}
              >
                {/* Botanical drop-cap: first letter styled large with leaf accent */}
                <span className="relative float-left mr-3 mt-1">
                  <span
                    className="text-6xl leading-none"
                    style={{ fontFamily: displayFont, color: primary, lineHeight: "0.8" }}
                  >
                    {wedding.story_text.charAt(0)}
                  </span>
                  {/* Tiny leaf beside the initial */}
                  <svg
                    viewBox="0 0 12 16"
                    fill="none"
                    className="absolute -right-1 bottom-0"
                    style={{ width: 10, height: 14 }}
                  >
                    <path
                      d="M6 0 Q10 4 10 10 Q10 14 6 16 Q2 14 2 10 Q2 4 6 0Z"
                      fill={accent}
                      opacity={0.2}
                    />
                  </svg>
                </span>
                {wedding.story_text.slice(1)}
              </p>
            </div>

            <div className="mt-12">
              <BotanicalDivider color={primary} accentColor={accent} />
            </div>
          </div>
        </RusticReveal>
      )}

      {/* ═══════════════════════ EXPLORE LINKS ═══════════════════════ */}
      <RusticReveal
        className="flex flex-col items-center px-6 py-20"
        style={{ backgroundColor: "transparent" }}
      >
        <p
          className="mb-10 text-[10px] uppercase tracking-[0.3em] md:text-xs"
          style={{ color: accent }}
        >
          Explore
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/${wedding.slug}/gallery`}>
            <motion.span
              className="inline-block cursor-pointer border px-8 py-3 text-xs uppercase tracking-[0.2em]"
              style={{
                borderColor: primary,
                borderStyle: "dashed",
                color: primary,
                fontFamily: bodyFont,
                borderRadius: 2,
              }}
              whileHover={{
                backgroundColor: primary,
                color: secondary,
                scale: 1.04,
                borderStyle: "solid",
              }}
              transition={{ duration: 0.3 }}
            >
              Gallery
            </motion.span>
          </Link>

          <Link href={`/${wedding.slug}/guestbook`}>
            <motion.span
              className="inline-block cursor-pointer border px-8 py-3 text-xs uppercase tracking-[0.2em]"
              style={{
                borderColor: primary,
                borderStyle: "dashed",
                color: primary,
                fontFamily: bodyFont,
                borderRadius: 2,
              }}
              whileHover={{
                backgroundColor: primary,
                color: secondary,
                scale: 1.04,
                borderStyle: "solid",
              }}
              transition={{ duration: 0.3 }}
            >
              Guest Book
            </motion.span>
          </Link>
        </div>
      </RusticReveal>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="flex flex-col items-center px-6 pb-20 pt-10">
        {/* Footer botanical ornament */}
        <svg
          viewBox="0 0 200 40"
          fill="none"
          className="mx-auto"
          style={{ width: 180, height: 36 }}
        >
          {/* Crossed branches */}
          <path d="M60 30 Q80 10 100 16 Q120 22 100 16" stroke={primary} strokeWidth="0.8" fill="none" opacity={0.4} />
          <path d="M140 30 Q120 10 100 16 Q80 22 100 16" stroke={primary} strokeWidth="0.8" fill="none" opacity={0.4} />
          {/* Leaves */}
          <ellipse cx="76" cy="18" rx="6" ry="2.5" fill={accent} opacity={0.15} transform="rotate(-30 76 18)" />
          <ellipse cx="124" cy="18" rx="6" ry="2.5" fill={accent} opacity={0.15} transform="rotate(30 124 18)" />
          {/* Center berry */}
          <circle cx="100" cy="16" r="3" fill={primary} opacity={0.3} />
        </svg>

        <motion.p
          className="mt-6 text-[10px] tracking-[0.18em]"
          style={{ color: accent, opacity: 0.4 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Made with love
        </motion.p>
      </footer>
    </div>
  );
}
