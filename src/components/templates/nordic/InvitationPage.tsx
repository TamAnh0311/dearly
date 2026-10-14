"use client";

/**
 * Nordic invitation page — Scandinavian minimalist wedding with geometric patterns,
 * pine tree silhouettes, snowflake-inspired decorations, clean sans-serif type,
 * and a crisp, intentional design language throughout.
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

/** Nordic geometric pattern strip — triangles and diamonds in clean rows. */
function GeometricPatternStrip({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 400 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: "100%", maxWidth: 320, height: 24 }}
    >
      {/* Repeating diamond pattern */}
      {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
        <g key={x}>
          <polygon
            points={`${x + 20},4 ${x + 26},15 ${x + 20},26 ${x + 14},15`}
            fill="none"
            stroke={color}
            strokeWidth="0.6"
            opacity={0.3}
          />
          <line x1={x} y1={15} x2={x + 14} y2={15} stroke={color} strokeWidth="0.4" opacity={0.2} />
          <line x1={x + 26} y1={15} x2={x + 40} y2={15} stroke={color} strokeWidth="0.4" opacity={0.2} />
        </g>
      ))}
    </svg>
  );
}

/** Pine tree silhouette SVG motif. */
function PineTree({ color, size = 40, className }: { color: string; size?: number; className?: string }) {
  const h = size;
  const w = size * 0.6;
  return (
    <svg
      viewBox="0 0 24 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: w, height: h }}
    >
      <polygon points="12,0 20,14 16,14 22,26 18,26 24,38 0,38 6,26 2,26 8,14 4,14" fill={color} opacity={0.1} />
      <rect x="10" y="36" width="4" height="4" fill={color} opacity={0.1} />
    </svg>
  );
}

/** Snowflake-inspired geometric decoration. */
function SnowflakeGeometric({ color, size = 32, className }: { color: string; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: size, height: size }}
    >
      {/* Six-armed crystal structure */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 24 24)`}>
          <line x1="24" y1="24" x2="24" y2="6" stroke={color} strokeWidth="0.8" opacity={0.3} />
          <line x1="24" y1="10" x2="20" y2="14" stroke={color} strokeWidth="0.6" opacity={0.25} />
          <line x1="24" y1="10" x2="28" y2="14" stroke={color} strokeWidth="0.6" opacity={0.25} />
          <circle cx="24" cy="6" r="1" fill={color} opacity={0.2} />
        </g>
      ))}
      <circle cx="24" cy="24" r="2" fill="none" stroke={color} strokeWidth="0.8" opacity={0.3} />
    </svg>
  );
}

/** Clean geometric divider — line with diamond center. */
function NordicDivider({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 200 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 160, height: 14 }}
    >
      <line x1="0" y1="8" x2="80" y2="8" stroke={color} strokeWidth="0.5" opacity={0.25} />
      <polygon points="100,2 106,8 100,14 94,8" fill="none" stroke={color} strokeWidth="0.8" opacity={0.4} />
      <line x1="120" y1="8" x2="200" y2="8" stroke={color} strokeWidth="0.5" opacity={0.25} />
    </svg>
  );
}

/** Pine forest silhouette for footer. */
function PineForestFooter({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 800 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      style={{ height: 60 }}
      preserveAspectRatio="none"
    >
      {/* Ground line */}
      <rect x="0" y="70" width="800" height="10" fill={color} opacity={0.04} />
      {/* Trees of varying sizes */}
      {[
        { x: 40, h: 45 }, { x: 80, h: 55 }, { x: 130, h: 40 },
        { x: 190, h: 50 }, { x: 240, h: 35 }, { x: 300, h: 60 },
        { x: 350, h: 42 }, { x: 410, h: 52 }, { x: 460, h: 38 },
        { x: 520, h: 48 }, { x: 570, h: 56 }, { x: 630, h: 44 },
        { x: 680, h: 50 }, { x: 740, h: 36 },
      ].map((tree, i) => {
        const base = 70;
        const top = base - tree.h;
        const w = tree.h * 0.35;
        return (
          <polygon
            key={i}
            points={`${tree.x},${top} ${tree.x + w},${base} ${tree.x - w},${base}`}
            fill={color}
            opacity={0.06 + (i % 3) * 0.02}
          />
        );
      })}
    </svg>
  );
}

/* ─── Floating geometric particles ─────────────────────────────────────────── */

const geometricParticles = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: `${((i * 12.5) + 6) % 90 + 5}%`,
  top: `${((i * 17 + 5) % 80) + 10}%`,
  size: 3 + (i % 2),
  delay: i * 1.2,
  duration: 6 + (i % 3) * 2,
}));

/* ─── Animation Variants ──────────────────────────────────────────────────── */

const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.2 },
  },
};

const heroChild = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Section reveal with clean slide-in. */
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
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────────── */

export default function NordicInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const patternParallax = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;
  const accentColor = theme.colors.accent;
  const displayFont = `'${theme.fonts.display}', sans-serif`;
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
      {/* ─── Floating geometric particles ─── */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {geometricParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              border: `1px solid ${accentColor}`,
              opacity: 0,
              transform: p.id % 2 === 0 ? "rotate(45deg)" : "rotate(0deg)",
            }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0.5, 1, 0.5],
              rotate: p.id % 2 === 0 ? [45, 90, 45] : [0, 45, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
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
        style={{ backgroundColor: secondary }}
      >
        {/* Geometric pattern strips — top and bottom */}
        <motion.div className="absolute left-0 top-10 flex w-full justify-center md:top-16" style={{ y: patternParallax }}>
          <GeometricPatternStrip color={accentColor} />
        </motion.div>
        <motion.div className="absolute bottom-10 left-0 flex w-full justify-center md:bottom-16" style={{ y: patternParallax }}>
          <GeometricPatternStrip color={accentColor} />
        </motion.div>

        {/* Snowflake decorations in corners */}
        <SnowflakeGeometric color={accentColor} className="absolute left-6 top-20 md:left-16 md:top-24" size={44} />
        <SnowflakeGeometric color={accentColor} className="absolute right-6 top-20 md:right-16 md:top-24" size={36} />
        <PineTree color={primary} className="absolute bottom-24 left-10 md:left-20" size={50} />
        <PineTree color={primary} className="absolute bottom-20 right-12 md:right-24" size={40} />

        {/* Central hero content */}
        <motion.div
          className="relative z-20 flex flex-col items-center px-6 text-center"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          style={{ y: heroContentY }}
        >
          <motion.div variants={heroChild}>
            <NordicDivider color={accentColor} />
          </motion.div>

          <motion.p
            variants={heroChild}
            className="mt-6 mb-4 text-xs uppercase tracking-[0.4em]"
            style={{ color: accentColor }}
          >
            Together with their families
          </motion.p>

          {/* Partner names — geometric sans-serif, medium weight */}
          <motion.h1
            variants={heroChild}
            className="text-5xl font-medium tracking-[0.12em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: primary, lineHeight: 1.15 }}
          >
            {wedding.partner1_name}
          </motion.h1>

          <motion.p
            variants={heroChild}
            className="my-3 text-2xl font-light md:my-4 md:text-3xl"
            style={{ color: accentColor, fontFamily: displayFont }}
          >
            &amp;
          </motion.p>

          <motion.h1
            variants={heroChild}
            className="text-5xl font-medium tracking-[0.12em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: primary, lineHeight: 1.15 }}
          >
            {wedding.partner2_name}
          </motion.h1>

          <motion.div variants={heroChild} className="mt-8">
            <NordicDivider color={accentColor} />
          </motion.div>

          <motion.p
            variants={heroChild}
            className="mt-4 text-xs uppercase tracking-[0.3em]"
            style={{ color: accentColor }}
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
        <NordicDivider color={accentColor} />

        {weddingDate && (
          <h2
            className="mt-10 text-2xl font-medium tracking-[0.1em] md:text-3xl"
            style={{ fontFamily: displayFont, color: primary }}
          >
            {weddingDate}
          </h2>
        )}

        {wedding.venue_name && (
          <div className="mt-6 flex flex-col items-center gap-1">
            <p className="text-lg" style={{ color: primary, fontFamily: bodyFont, opacity: 0.8 }}>
              {wedding.venue_name}
            </p>
            {wedding.venue_address && (
              <p className="text-sm" style={{ color: accentColor, opacity: 0.6 }}>
                {wedding.venue_address}
              </p>
            )}
          </div>
        )}

        <div className="mt-8">
          <NordicDivider color={accentColor} />
        </div>
      </RevealSection>

      {/* ═══════════════════════ COUNTDOWN ═══════════════════════ */}
      {wedding.wedding_date && (
        <RevealSection
          className="flex flex-col items-center px-6 py-20"
          style={{ backgroundColor: secondary }}
        >
          <p
            className="mb-8 text-xs uppercase tracking-[0.35em]"
            style={{ color: accentColor }}
          >
            Days until forever
          </p>

          <div
            className="border px-10 py-8"
            style={{
              borderColor: `${accentColor}30`,
              backgroundColor: "#FFFFFF",
            }}
          >
            <CountdownTimer
              targetDate={wedding.wedding_date}
              className="gap-4 md:gap-8"
              numberClassName="text-4xl md:text-5xl font-light tabular-nums"
              labelClassName="text-xs uppercase tracking-[0.2em] mt-2"
            />
          </div>
        </RevealSection>
      )}

      {/* ═══════════════════════ OUR STORY ═══════════════════════ */}
      {wedding.story_text && (
        <RevealSection
          className="px-6 py-24"
          style={{
            backgroundColor: "#F0F4F6",
          }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <SnowflakeGeometric color={accentColor} className="mx-auto mb-6" size={28} />

            <h2
              className="mb-10 text-3xl font-medium tracking-[0.1em] md:text-4xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              Our Story
            </h2>

            <p
              className="whitespace-pre-line text-base leading-[1.9] md:text-lg"
              style={{ color: primary, opacity: 0.75 }}
            >
              <span
                className="float-left mr-3 text-5xl font-medium leading-none"
                style={{ fontFamily: displayFont, color: accentColor }}
              >
                {wedding.story_text.charAt(0)}
              </span>
              {wedding.story_text.slice(1)}
            </p>
          </div>
        </RevealSection>
      )}

      {/* ═══════════════════════ EXPLORE LINKS ═══════════════════════ */}
      <RevealSection
        className="flex flex-col items-center px-6 py-20"
        style={{ backgroundColor: secondary }}
      >
        <p
          className="mb-8 text-xs uppercase tracking-[0.35em]"
          style={{ color: accentColor }}
        >
          Explore
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/${wedding.slug}/gallery`}>
            <motion.span
              className="inline-block cursor-pointer border px-8 py-3 text-sm uppercase tracking-[0.2em]"
              style={{
                borderColor: primary,
                color: primary,
                fontFamily: bodyFont,
              }}
              whileHover={{
                backgroundColor: primary,
                color: secondary,
                scale: 1.02,
              }}
              transition={{ duration: 0.25 }}
            >
              Gallery
            </motion.span>
          </Link>

          <Link href={`/${wedding.slug}/guestbook`}>
            <motion.span
              className="inline-block cursor-pointer border px-8 py-3 text-sm uppercase tracking-[0.2em]"
              style={{
                borderColor: primary,
                color: primary,
                fontFamily: bodyFont,
              }}
              whileHover={{
                backgroundColor: primary,
                color: secondary,
                scale: 1.02,
              }}
              transition={{ duration: 0.25 }}
            >
              Guest Book
            </motion.span>
          </Link>
        </div>
      </RevealSection>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="flex flex-col items-center px-6 pb-8 pt-4" style={{ backgroundColor: secondary }}>
        <PineForestFooter color={primary} />
        <p
          className="mt-4 text-xs tracking-[0.2em]"
          style={{ color: accentColor, opacity: 0.4 }}
        >
          Made with love
        </p>
      </footer>
    </div>
  );
}
