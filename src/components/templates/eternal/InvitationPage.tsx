"use client";

/**
 * Eternal invitation page — classic luxury wedding design inspired by gold foil
 * on cream paper. Features ornamental SVG borders, parallax scrolling, sparkle
 * particles, and rich section-by-section reveal animations.
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

/** Corner flourish — curved scrollwork for the hero frame. */
function CornerFlourish({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 100, height: 100 }}
    >
      <motion.path
        d="M4 116 C4 60 12 32 36 16 C50 6 72 4 116 4"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }}
      />
      <motion.path
        d="M8 116 C8 72 16 48 34 34 C48 22 68 14 116 12"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        opacity={0.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, ease: "easeInOut", delay: 0.9 }}
      />
      <motion.circle
        cx="36"
        cy="16"
        r="2"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.8 }}
      />
      <motion.path
        d="M30 26 Q36 16 46 12"
        stroke={color}
        strokeWidth="0.7"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1.4 }}
      />
    </svg>
  );
}

/** Horizontal ornamental divider with central scroll motif. */
function OrnamentalDivider({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 240 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 220, height: 24 }}
    >
      <line x1="0" y1="12" x2="80" y2="12" stroke={color} strokeWidth="0.6" opacity={0.4} />
      <path
        d="M80 12 Q90 2 100 8 Q110 14 120 8 Q130 2 140 8 Q150 14 160 12"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <circle cx="120" cy="8" r="1.8" fill={color} />
      <line x1="160" y1="12" x2="240" y2="12" stroke={color} strokeWidth="0.6" opacity={0.4} />
    </svg>
  );
}

/** Footer ornament — mirrored scrollwork curves meeting at center. */
function FooterOrnament({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 180, height: 36 }}
    >
      <path d="M20 30 Q40 10 60 16 Q80 22 100 10" stroke={color} strokeWidth="1" fill="none" />
      <path d="M180 30 Q160 10 140 16 Q120 22 100 10" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="100" cy="10" r="2.5" fill={color} />
      <circle cx="100" cy="10" r="5" stroke={color} strokeWidth="0.5" fill="none" opacity={0.4} />
    </svg>
  );
}

/* ─── Sparkle Particles ─────────────────────────────────────────────────────── */

const sparkles = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${((i * 23 + 7) % 90) + 5}%`,
  top: `${((i * 31 + 13) % 80) + 10}%`,
  size: 3 + (i % 3),
  delay: i * 0.7,
  duration: 3 + (i % 3) * 1.2,
}));

/* ─── Animation Variants ────────────────────────────────────────────────────── */

const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.22, delayChildren: 0.3 },
  },
};

const heroChild = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Section reveal with clip-path wipe from center. */
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

/* ─── Main Component ────────────────────────────────────────────────────────── */

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
  const cornerParallax = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 50]);

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
      {/* ─── Gold sparkle particles ─── */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
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
              opacity: [0, 0.7, 0],
              scale: [0.5, 1.2, 0.5],
              y: [0, -20, 0],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${secondary}, ${secondary}ee 60%, ${secondary}cc)`,
        }}
      >
        {/* Decorative corner flourishes with parallax */}
        <motion.div className="absolute left-4 top-4 md:left-10 md:top-10" style={{ y: cornerParallax }}>
          <CornerFlourish color={primary} />
        </motion.div>
        <motion.div
          className="absolute right-4 top-4 md:right-10 md:top-10"
          style={{ y: cornerParallax, transform: "scaleX(-1)" }}
        >
          <CornerFlourish color={primary} />
        </motion.div>
        <motion.div
          className="absolute bottom-4 left-4 md:bottom-10 md:left-10"
          style={{ y: cornerParallax, transform: "scaleY(-1)" }}
        >
          <CornerFlourish color={primary} />
        </motion.div>
        <motion.div
          className="absolute bottom-4 right-4 md:bottom-10 md:right-10"
          style={{ y: cornerParallax, transform: "scale(-1)" }}
        >
          <CornerFlourish color={primary} />
        </motion.div>

        {/* Central hero content */}
        <motion.div
          className="relative z-20 flex flex-col items-center px-6 text-center"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          style={{ y: heroContentY }}
        >
          {/* Top rule */}
          <motion.div
            variants={heroChild}
            className="mb-6 h-px w-28"
            style={{ backgroundColor: primary, opacity: 0.6 }}
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
            style={{ color: accent, fontFamily: displayFont, opacity: 0.8 }}
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

          {/* Bottom rule */}
          <motion.div
            variants={heroChild}
            className="mt-6 mb-4 h-px w-28"
            style={{ backgroundColor: primary, opacity: 0.6 }}
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

      {/* ═══════════════════════ DATE & VENUE ═══════════════════════ */}
      <RevealSection
        className="flex flex-col items-center px-6 py-24 text-center"
        style={{ backgroundColor: secondary }}
      >
        <OrnamentalDivider color={primary} />

        {weddingDate && (
          <h2
            className="mt-10 text-2xl tracking-[0.1em] md:text-3xl"
            style={{ fontFamily: displayFont, color: primary }}
          >
            {weddingDate}
          </h2>
        )}

        {wedding.venue_name && (
          <div className="mt-6 flex flex-col items-center gap-1">
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

        <div className="mt-4">
          <OrnamentalDivider color={primary} />
        </div>
      </RevealSection>

      {/* ═══════════════════════ COUNTDOWN ═══════════════════════ */}
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

          <style jsx global>{`
            /* Pulse on the countdown seconds digit */
            @keyframes eternal-pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.6; }
            }
          `}</style>
        </RevealSection>
      )}

      {/* ═══════════════════════ OUR STORY ═══════════════════════ */}
      {wedding.story_text && (
        <RevealSection
          className="px-6 py-24"
          style={{
            background: `linear-gradient(180deg, ${secondary}e6 0%, ${secondary}f2 50%, ${secondary} 100%)`,
          }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className="mb-10 text-3xl tracking-[0.12em] md:text-4xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              Our Story
            </h2>

            {/* Decorative opening quote */}
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

      {/* ═══════════════════════ EXPLORE LINKS ═══════════════════════ */}
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

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="flex flex-col items-center px-6 pb-16 pt-8" style={{ backgroundColor: secondary }}>
        <FooterOrnament color={primary} />
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
