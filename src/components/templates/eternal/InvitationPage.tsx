"use client";

/**
 * Eternal invitation page — classic luxury gold-on-ivory wedding design.
 * Features ornamental SVG corner flourishes with draw-on animations,
 * gold sparkle particles, parallax scroll effects, pulse countdown boxes,
 * decorative drop-cap story section, and self-drawing SVG borders.
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

/* ─── SVG Ornaments ─────────────────────────────────────────────────────────── */

/** Ornate corner flourish with nested scrollwork curves that draw themselves. */
function CornerFlourish({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 120, height: 120 }}
    >
      {/* Primary scroll curve */}
      <motion.path
        d="M4 146 C4 80 10 44 28 26 C42 12 64 6 90 4 Q110 3 146 4"
        stroke={color}
        strokeWidth="1.4"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, ease: "easeInOut", delay: 0.4 }}
      />
      {/* Inner parallel scroll */}
      <motion.path
        d="M10 146 C10 88 18 56 34 38 C46 24 66 16 88 12 Q106 10 146 12"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        opacity={0.45}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut", delay: 0.7 }}
      />
      {/* Decorative curl at corner */}
      <motion.path
        d="M28 26 C20 34 16 44 20 52 C24 60 34 58 38 50 C42 42 36 34 28 26"
        stroke={color}
        strokeWidth="0.9"
        fill="none"
        opacity={0.6}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, delay: 1.4 }}
      />
      {/* Tiny leaf sprout at apex */}
      <motion.path
        d="M38 50 Q44 42 52 38"
        stroke={color}
        strokeWidth="0.7"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
      />
      {/* Terminal dot */}
      <motion.circle
        cx="28" cy="26" r="2.5"
        fill={color}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.8 }}
        transition={{ delay: 2.0, duration: 0.4 }}
      />
      {/* End curve dot */}
      <motion.circle
        cx="52" cy="38" r="1.5"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2.2 }}
      />
      {/* Outermost whisper line */}
      <motion.path
        d="M2 146 C2 68 8 36 24 18 C38 4 62 2 146 2"
        stroke={color}
        strokeWidth="0.4"
        fill="none"
        opacity={0.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.6, ease: "easeInOut", delay: 0.2 }}
      />
    </svg>
  );
}

/** Ornamental horizontal divider with central scroll motif and flanking lines. */
function OrnamentalDivider({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 300 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 260, height: 28 }}
    >
      <line x1="0" y1="14" x2="90" y2="14" stroke={color} strokeWidth="0.5" opacity={0.35} />
      <path
        d="M90 14 Q100 4 110 10 Q118 16 126 8 Q134 0 142 8 Q150 16 158 10 Q166 4 176 8 Q186 14 196 14"
        stroke={color}
        strokeWidth="0.9"
        fill="none"
      />
      <circle cx="143" cy="8" r="2" fill={color} opacity={0.7} />
      <circle cx="143" cy="8" r="4.5" stroke={color} strokeWidth="0.4" fill="none" opacity={0.3} />
      <line x1="196" y1="14" x2="300" y2="14" stroke={color} strokeWidth="0.5" opacity={0.35} />
      {/* Small diamonds flanking center */}
      <path d="M118 14 L121 11 L124 14 L121 17 Z" fill={color} opacity={0.25} />
      <path d="M162 14 L165 11 L168 14 L165 17 Z" fill={color} opacity={0.25} />
    </svg>
  );
}

/** Self-drawing rectangular frame border around a section. */
function DrawingFrame({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 800 200"
      fill="none"
      preserveAspectRatio="none"
      className={className}
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <motion.rect
        x="20" y="10" width="760" height="180" rx="2"
        stroke={color}
        strokeWidth="0.6"
        fill="none"
        opacity={0.25}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
      <motion.rect
        x="26" y="16" width="748" height="168" rx="1"
        stroke={color}
        strokeWidth="0.3"
        fill="none"
        opacity={0.12}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.8, ease: "easeInOut", delay: 0.3 }}
      />
    </svg>
  );
}

/** Footer ornament — mirrored scrollwork arcs meeting at center diamond. */
function FooterOrnament({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 240 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 200, height: 42 }}
    >
      <path d="M10 38 Q30 12 60 18 Q80 22 100 8 Q108 4 120 8" stroke={color} strokeWidth="0.9" fill="none" />
      <path d="M230 38 Q210 12 180 18 Q160 22 140 8 Q132 4 120 8" stroke={color} strokeWidth="0.9" fill="none" />
      <path d="M116 8 L120 2 L124 8 L120 14 Z" fill={color} opacity={0.6} />
      <circle cx="120" cy="8" r="7" stroke={color} strokeWidth="0.4" fill="none" opacity={0.25} />
      <circle cx="60" cy="18" r="1.5" fill={color} opacity={0.4} />
      <circle cx="180" cy="18" r="1.5" fill={color} opacity={0.4} />
    </svg>
  );
}

/* ─── Sparkle Particles ───────────────────────────────────────────────────── */

const sparkles = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${((i * 23 + 7) % 90) + 5}%`,
  top: `${((i * 31 + 13) % 80) + 10}%`,
  size: 2.5 + (i % 3) * 1.2,
  delay: i * 0.8,
  duration: 3 + (i % 4) * 1.1,
}));

/* ─── Animation Variants ──────────────────────────────────────────────────── */

const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.4 },
  },
};

const heroChild = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Scroll-triggered section reveal with vertical slide and fade. */
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
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 44 }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */

export default function EternalInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const cornerParallax = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 55]);
  const sparkleParallax = useTransform(scrollYProgress, [0, 1], [0, -30]);

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
      {/* ─── Gold sparkle particles floating infinitely ─── */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
        style={{ y: sparkleParallax }}
      >
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              backgroundColor: primary,
            }}
            animate={{
              opacity: [0, 0.75, 0],
              scale: [0.4, 1.3, 0.4],
              y: [0, -24, 0],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center"
        style={{
          background: `radial-gradient(ellipse at 50% 38%, ${secondary} 0%, ${secondary}ee 55%, ${secondary}cc 100%)`,
        }}
      >
        {/* Corner flourishes with parallax */}
        <motion.div className="absolute left-3 top-3 md:left-8 md:top-8" style={{ y: cornerParallax }}>
          <CornerFlourish color={primary} />
        </motion.div>
        <motion.div
          className="absolute right-3 top-3 md:right-8 md:top-8"
          style={{ y: cornerParallax, transform: "scaleX(-1)" }}
        >
          <CornerFlourish color={primary} />
        </motion.div>
        <motion.div
          className="absolute bottom-3 left-3 md:bottom-8 md:left-8"
          style={{ y: cornerParallax, transform: "scaleY(-1)" }}
        >
          <CornerFlourish color={primary} />
        </motion.div>
        <motion.div
          className="absolute bottom-3 right-3 md:bottom-8 md:right-8"
          style={{ y: cornerParallax, transform: "scale(-1)" }}
        >
          <CornerFlourish color={primary} />
        </motion.div>

        {/* Subtle radial glow behind names */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${primary}08 0%, transparent 50%)`,
          }}
        />

        {/* Central hero content */}
        <motion.div
          className="relative z-20 flex flex-col items-center px-6 text-center"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          style={{ y: heroContentY }}
        >
          {/* Top decorative rule */}
          <motion.div variants={heroChild} className="mb-3 flex items-center gap-3">
            <div className="h-px w-20 md:w-28" style={{ backgroundColor: primary, opacity: 0.5 }} />
            <svg viewBox="0 0 12 12" fill="none" style={{ width: 10, height: 10 }}>
              <path d="M6 0 L8 4 L12 6 L8 8 L6 12 L4 8 L0 6 L4 4 Z" fill={primary} opacity={0.5} />
            </svg>
            <div className="h-px w-20 md:w-28" style={{ backgroundColor: primary, opacity: 0.5 }} />
          </motion.div>

          <motion.p
            variants={heroChild}
            className="mb-8 text-xs uppercase tracking-[0.4em]"
            style={{ color: accent }}
          >
            Together with their families
          </motion.p>

          {/* Partner 1 name */}
          <motion.h1
            variants={heroChild}
            className="text-5xl font-light tracking-[0.15em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: primary, lineHeight: 1.1 }}
          >
            {wedding.partner1_name}
          </motion.h1>

          {/* Ampersand */}
          <motion.p
            variants={heroChild}
            className="my-4 text-3xl italic md:my-5 md:text-4xl"
            style={{ color: accent, fontFamily: displayFont, opacity: 0.75 }}
          >
            &amp;
          </motion.p>

          {/* Partner 2 name */}
          <motion.h1
            variants={heroChild}
            className="text-5xl font-light tracking-[0.15em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: primary, lineHeight: 1.1 }}
          >
            {wedding.partner2_name}
          </motion.h1>

          {/* Bottom decorative rule */}
          <motion.div variants={heroChild} className="mt-8 mb-4 flex items-center gap-3">
            <div className="h-px w-20 md:w-28" style={{ backgroundColor: primary, opacity: 0.5 }} />
            <svg viewBox="0 0 12 12" fill="none" style={{ width: 10, height: 10 }}>
              <path d="M6 0 L8 4 L12 6 L8 8 L6 12 L4 8 L0 6 L4 4 Z" fill={primary} opacity={0.5} />
            </svg>
            <div className="h-px w-20 md:w-28" style={{ backgroundColor: primary, opacity: 0.5 }} />
          </motion.div>

          <motion.p
            variants={heroChild}
            className="text-[10px] uppercase tracking-[0.35em] md:text-xs"
            style={{ color: accent }}
          >
            Request the pleasure of your company
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════════════ DATE & VENUE ═══════════════════════ */}
      <RevealSection
        className="relative flex flex-col items-center px-6 py-28 text-center"
        style={{ backgroundColor: secondary }}
      >
        <DrawingFrame color={primary} />
        <OrnamentalDivider color={primary} />

        {weddingDate && (
          <h2
            className="mt-12 text-2xl tracking-[0.12em] md:text-3xl"
            style={{ fontFamily: displayFont, color: primary }}
          >
            {weddingDate}
          </h2>
        )}

        {wedding.venue_name && (
          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-lg" style={{ color: accent, fontFamily: bodyFont }}>
              {wedding.venue_name}
            </p>
            {wedding.venue_address && (
              <p className="text-sm" style={{ color: accent, opacity: 0.55 }}>
                {wedding.venue_address}
              </p>
            )}
          </div>
        )}

        <div className="mt-10">
          <OrnamentalDivider color={primary} />
        </div>
      </RevealSection>

      {/* ═══════════════════════ COUNTDOWN ═══════════════════════ */}
      {wedding.wedding_date && (
        <RevealSection
          className="flex flex-col items-center px-6 py-24"
          style={{ backgroundColor: secondary }}
        >
          <p
            className="mb-10 text-[10px] uppercase tracking-[0.35em] md:text-xs"
            style={{ color: accent }}
          >
            Counting down to forever
          </p>

          {/* Gold-bordered countdown boxes with pulse */}
          <div className="flex gap-3 md:gap-6">
            <CountdownTimer
              targetDate={wedding.wedding_date}
              className="gap-3 md:gap-6"
              numberClassName="text-3xl md:text-5xl font-light tabular-nums"
              labelClassName="text-[10px] uppercase tracking-[0.18em] mt-2"
            />
          </div>

          {/* Pulse keyframes for countdown accent */}
          <style jsx global>{`
            @keyframes eternal-glow-pulse {
              0%, 100% { box-shadow: 0 0 0 0 transparent; }
              50% { box-shadow: 0 0 12px 2px rgba(255, 215, 0, 0.08); }
            }
          `}</style>
        </RevealSection>
      )}

      {/* ═══════════════════════ OUR STORY ═══════════════════════ */}
      {wedding.story_text && (
        <RevealSection
          className="px-6 py-28"
          style={{
            background: `linear-gradient(180deg, ${secondary} 0%, ${secondary}f0 40%, ${secondary} 100%)`,
          }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <OrnamentalDivider color={primary} />

            <h2
              className="mt-10 mb-12 text-3xl tracking-[0.14em] md:text-4xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              Our Story
            </h2>

            {/* Story text with decorative drop-cap */}
            <div className="relative text-left">
              {/* Large decorative opening quotation mark */}
              <svg
                viewBox="0 0 44 36"
                fill="none"
                className="absolute -top-5 -left-2 md:-left-8"
                style={{ width: 38, height: 30, opacity: 0.12 }}
              >
                <path
                  d="M0 22 C0 10 6 0 18 0 L18 6 C12 6 8 10 8 16 L18 16 L18 34 L0 34 Z M24 22 C24 10 30 0 42 0 L42 6 C36 6 32 10 32 16 L42 16 L42 34 L24 34 Z"
                  fill={primary}
                />
              </svg>

              <p
                className="whitespace-pre-line text-base leading-[2] md:text-lg"
                style={{ color: accent }}
              >
                {/* Decorative drop-cap for first letter */}
                <span
                  className="float-left mr-3 mt-1 text-6xl leading-none"
                  style={{
                    fontFamily: displayFont,
                    color: primary,
                    lineHeight: "0.8",
                  }}
                >
                  {wedding.story_text.charAt(0)}
                </span>
                {wedding.story_text.slice(1)}
              </p>
            </div>

            <div className="mt-12">
              <OrnamentalDivider color={primary} />
            </div>
          </div>
        </RevealSection>
      )}

      {/* ═══════════════════════ EXPLORE LINKS ═══════════════════════ */}
      <RevealSection
        className="flex flex-col items-center px-6 py-24"
        style={{ backgroundColor: secondary }}
      >
        <p
          className="mb-10 text-[10px] uppercase tracking-[0.35em] md:text-xs"
          style={{ color: accent }}
        >
          Explore
        </p>

        <div className="flex flex-wrap justify-center gap-5">
          <Link href={`/${wedding.slug}/gallery`}>
            <motion.span
              className="inline-block cursor-pointer rounded-none border px-10 py-3.5 text-xs uppercase tracking-[0.25em]"
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
              className="inline-block cursor-pointer rounded-none border px-10 py-3.5 text-xs uppercase tracking-[0.25em]"
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

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer
        className="flex flex-col items-center px-6 pb-20 pt-10"
        style={{ backgroundColor: secondary }}
      >
        <FooterOrnament color={primary} />

        <motion.p
          className="mt-8 text-[10px] tracking-[0.2em]"
          style={{ color: accent, opacity: 0.4 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          Made with love
        </motion.p>
      </footer>
    </div>
  );
}
