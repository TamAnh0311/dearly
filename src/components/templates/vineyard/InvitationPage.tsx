"use client";

/**
 * Vineyard invitation page — Tuscan wine country wedding with grapevine borders,
 * wine-stain watermarks, cork-texture story section, cypress tree silhouette
 * footer, and warm burgundy/cream palette throughout.
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

/** Grapevine border with leaves and grape clusters. */
function GrapevineBorder({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 60 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 50, height: 340 }}
    >
      {/* Main vine stem */}
      <motion.path
        d="M30 0 Q35 40 25 80 Q20 120 30 160 Q40 200 28 240 Q20 280 32 320 Q38 360 30 400"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
      {/* Vine tendrils */}
      <motion.path d="M25 50 Q10 45 8 55 Q6 65 15 60" stroke={color} strokeWidth="0.8" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.5, duration: 0.8 }} />
      <motion.path d="M30 130 Q45 125 48 135 Q50 145 42 142" stroke={color} strokeWidth="0.8" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2, duration: 0.8 }} />
      <motion.path d="M28 210 Q12 205 10 215 Q8 225 18 220" stroke={color} strokeWidth="0.8" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.3, duration: 0.8 }} />
      <motion.path d="M32 290 Q48 285 50 295 Q52 305 44 300" stroke={color} strokeWidth="0.8" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.6, duration: 0.8 }} />

      {/* Grape leaves */}
      {[
        { cx: 12, cy: 80, delay: 1.8 },
        { cx: 46, cy: 160, delay: 2.2 },
        { cx: 14, cy: 250, delay: 2.5 },
        { cx: 44, cy: 340, delay: 2.8 },
      ].map((leaf, i) => (
        <motion.path
          key={i}
          d={`M${leaf.cx} ${leaf.cy} Q${leaf.cx - 8} ${leaf.cy - 12} ${leaf.cx} ${leaf.cy - 16} Q${leaf.cx + 8} ${leaf.cy - 12} ${leaf.cx} ${leaf.cy}`}
          fill={color}
          opacity={0.15}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: leaf.delay, duration: 0.6 }}
        />
      ))}

      {/* Grape clusters */}
      {[
        { x: 8, y: 100, delay: 2 },
        { x: 44, y: 185, delay: 2.4 },
        { x: 10, y: 270, delay: 2.7 },
      ].map((cluster, i) => (
        <motion.g key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: cluster.delay, duration: 0.5 }}>
          <circle cx={cluster.x} cy={cluster.y} r="3" fill={color} opacity={0.25} />
          <circle cx={cluster.x + 5} cy={cluster.y + 2} r="3" fill={color} opacity={0.25} />
          <circle cx={cluster.x - 1} cy={cluster.y + 5} r="3" fill={color} opacity={0.25} />
          <circle cx={cluster.x + 3} cy={cluster.y + 7} r="3" fill={color} opacity={0.25} />
          <circle cx={cluster.x + 1} cy={cluster.y + 10} r="2.5" fill={color} opacity={0.2} />
        </motion.g>
      ))}
    </svg>
  );
}

/** Wine-stain watermark circle. */
function WineStain({ color, size, className }: { color: string; size: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: size, height: size }}
    >
      <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="6" opacity={0.04} />
      <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="3" opacity={0.03} />
      <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="2" opacity={0.02} />
    </svg>
  );
}

/** Vine leaf accent SVG. */
function VineLeafAccent({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 30 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 20, height: 16 }}
    >
      <path
        d="M15 2 Q6 6 4 14 Q2 20 8 22 Q12 22 15 18 Q18 22 22 22 Q28 20 26 14 Q24 6 15 2Z"
        fill={color}
        opacity={0.2}
      />
      <path d="M15 2 L15 18" stroke={color} strokeWidth="0.5" opacity={0.3} />
      <path d="M15 10 L9 6" stroke={color} strokeWidth="0.4" opacity={0.2} />
      <path d="M15 10 L21 6" stroke={color} strokeWidth="0.4" opacity={0.2} />
    </svg>
  );
}

/** Tuscan landscape silhouette footer — rolling hills with cypress trees. */
function TuscanLandscape({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 800 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      style={{ height: 80 }}
      preserveAspectRatio="none"
    >
      {/* Rolling hills */}
      <path
        d="M0 80 Q100 40 200 60 Q300 80 400 50 Q500 30 600 55 Q700 75 800 45 V120 H0 Z"
        fill={color}
        opacity={0.08}
      />
      <path
        d="M0 90 Q150 55 300 70 Q450 85 600 60 Q700 50 800 65 V120 H0 Z"
        fill={color}
        opacity={0.05}
      />
      {/* Cypress trees */}
      {[160, 340, 420, 580, 700].map((x, i) => (
        <g key={i}>
          <rect x={x - 1} y={45 - i * 2} width={2} height={20 + i * 3} fill={color} opacity={0.1} />
          <ellipse cx={x} cy={40 - i * 2} rx={4} ry={14 + i} fill={color} opacity={0.1} />
        </g>
      ))}
    </svg>
  );
}

/** Ornamental divider with vine motif. */
function VineDivider({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 240 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 200, height: 20 }}
    >
      <line x1="0" y1="12" x2="80" y2="12" stroke={color} strokeWidth="0.5" opacity={0.3} />
      <path
        d="M100 12 Q108 4 116 8 Q120 10 124 8 Q132 4 140 12"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
      />
      <circle cx="120" cy="9" r="2" fill={color} opacity={0.4} />
      <line x1="160" y1="12" x2="240" y2="12" stroke={color} strokeWidth="0.5" opacity={0.3} />
    </svg>
  );
}

/* ─── Animation Variants ──────────────────────────────────────────────────── */

const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.22, delayChildren: 0.3 },
  },
};

const heroChild = {
  hidden: { opacity: 0, y: 14 },
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

export default function VineyardInvitationPage({
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
  const vineParallax = useTransform(scrollYProgress, [0, 1], [0, -40]);

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
      {/* ─── Wine-stain watermarks (background) ─── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <WineStain color={primary} size={200} className="absolute left-10 top-20" />
        <WineStain color={primary} size={160} className="absolute right-16 top-1/3" />
        <WineStain color={primary} size={240} className="absolute left-1/4 top-2/3" />
        <WineStain color={primary} size={180} className="absolute right-8 bottom-20" />
      </div>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${secondary}, ${secondary}ee 60%, ${secondary}dd)`,
        }}
      >
        {/* Grapevine borders — left and right */}
        <motion.div className="absolute left-2 top-1/2 -translate-y-1/2 md:left-6" style={{ y: vineParallax }}>
          <GrapevineBorder color={primary} />
        </motion.div>
        <motion.div
          className="absolute right-2 top-1/2 -translate-y-1/2 md:right-6"
          style={{ y: vineParallax, transform: "scaleX(-1) translateY(-50%)" }}
        >
          <GrapevineBorder color={primary} />
        </motion.div>

        {/* Central hero content */}
        <motion.div
          className="relative z-10 flex flex-col items-center px-6 text-center"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          style={{ y: heroContentY }}
        >
          <motion.div variants={heroChild}>
            <VineDivider color={primary} />
          </motion.div>

          <motion.p
            variants={heroChild}
            className="mt-6 mb-4 text-xs uppercase tracking-[0.35em]"
            style={{ color: accent }}
          >
            Together with their families
          </motion.p>

          {/* Partner names — deep burgundy serif */}
          <motion.h1
            variants={heroChild}
            className="text-5xl font-normal tracking-[0.1em] sm:text-6xl md:text-7xl lg:text-8xl"
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
            className="text-5xl font-normal tracking-[0.1em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: primary, lineHeight: 1.15 }}
          >
            {wedding.partner2_name}
          </motion.h1>

          <motion.div variants={heroChild} className="mt-8">
            <VineDivider color={primary} />
          </motion.div>

          <motion.p
            variants={heroChild}
            className="mt-4 text-xs uppercase tracking-[0.25em]"
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
        <VineDivider color={primary} />

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

        <div className="mt-6">
          <VineDivider color={primary} />
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
            Raising a glass in
          </p>

          <div className="flex gap-4 md:gap-8">
            <CountdownTimer
              targetDate={wedding.wedding_date}
              className="gap-4 md:gap-8"
              numberClassName="text-4xl md:text-5xl font-light tabular-nums"
              labelClassName="text-xs uppercase tracking-[0.15em] mt-2"
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <VineLeafAccent color={primary} />
            <VineLeafAccent color={primary} />
            <VineLeafAccent color={primary} />
          </div>
        </RevealSection>
      )}

      {/* ═══════════════════════ OUR STORY (cork-texture) ═══════════════════════ */}
      {wedding.story_text && (
        <RevealSection
          className="px-6 py-24"
          style={{
            backgroundColor: "#E8DFD2",
            backgroundImage: `radial-gradient(circle at 20% 50%, ${accent}08 1px, transparent 1px), radial-gradient(circle at 80% 20%, ${accent}06 1px, transparent 1px), radial-gradient(circle at 60% 80%, ${accent}07 1px, transparent 1px)`,
            backgroundSize: "30px 30px, 45px 45px, 35px 35px",
          }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className="mb-10 text-3xl tracking-[0.12em] md:text-4xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              Our Story
            </h2>

            <div className="relative">
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
              className="inline-block cursor-pointer rounded-sm border px-8 py-3 text-sm uppercase tracking-[0.2em]"
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
              className="inline-block cursor-pointer rounded-sm border px-8 py-3 text-sm uppercase tracking-[0.2em]"
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
      <footer className="flex flex-col items-center px-6 pb-8 pt-4" style={{ backgroundColor: secondary }}>
        <TuscanLandscape color={primary} />
        <p
          className="mt-4 text-xs tracking-[0.15em]"
          style={{ color: accent, opacity: 0.5 }}
        >
          Made with love
        </p>
      </footer>
    </div>
  );
}
