"use client";

/**
 * Polaroid invitation page — retro scrapbook aesthetic with off-white
 * dot-pattern background, giant polaroid hero frame, scattered smaller
 * polaroids, washi tape SVG accents, torn-paper note cards, push-pin SVGs,
 * and a corkboard-style story section. Handwritten Caveat font throughout.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/* ─── SVG: Washi Tape Strip ───────────────────────────────────────────────── */

/** Decorative washi tape strip with semi-transparent patterned fill. */
function WashiTape({
  width = 100,
  rotate = 0,
  color,
  className,
}: {
  width?: number;
  rotate?: number;
  color: string;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${width} 24`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width, height: 24, transform: `rotate(${rotate}deg)` }}
    >
      <rect x="0" y="0" width={width} height="24" fill={color} opacity="0.55" rx="1" />
      {/* Diagonal stripe pattern */}
      {Array.from({ length: Math.ceil(width / 12) }, (_, i) => (
        <line
          key={i}
          x1={i * 12}
          y1="0"
          x2={i * 12 + 10}
          y2="24"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
        />
      ))}
      {/* Torn edges */}
      <path
        d={`M0 0 ${Array.from({ length: Math.ceil(width / 6) }, (_, i) => `L${i * 6 + 3} ${1 + (i % 3)} L${i * 6 + 6} 0`).join(" ")}`}
        fill={color}
        opacity="0.35"
      />
    </svg>
  );
}

/* ─── SVG: Push Pin ───────────────────────────────────────────────────────── */

/** Small push-pin SVG for corkboard decorations. */
function PushPin({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 18, height: 24 }}
    >
      <circle cx="12" cy="10" r="7" fill={color} />
      <circle cx="12" cy="10" r="4" fill="rgba(255,255,255,0.4)" />
      <line x1="12" y1="17" x2="12" y2="30" stroke="#666" strokeWidth="1.5" />
    </svg>
  );
}

/* ─── Scattered Polaroid Decorations ──────────────────────────────────────── */

interface ScatteredPhoto {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  rotate: number;
  delay: number;
  scale: number;
}

const scatteredPhotos: ScatteredPhoto[] = [
  { top: "6%", left: "3%", rotate: -14, delay: 0.4, scale: 0.7 },
  { top: "4%", right: "5%", rotate: 10, delay: 0.6, scale: 0.65 },
  { bottom: "12%", left: "5%", rotate: 18, delay: 0.8, scale: 0.75 },
  { bottom: "6%", right: "4%", rotate: -8, delay: 0.5, scale: 0.68 },
];

/* ─── Torn Paper Clip-Path ────────────────────────────────────────────────── */

const tornEdgeClip =
  "polygon(2% 0%, 5% 3%, 10% 0%, 15% 2%, 20% 0%, 25% 3%, 30% 1%, 35% 0%, 40% 2%, 45% 0%, 50% 3%, 55% 1%, 60% 0%, 65% 2%, 70% 0%, 75% 3%, 80% 1%, 85% 0%, 90% 2%, 95% 0%, 98% 3%, 100% 0%, 100% 97%, 97% 100%, 93% 98%, 88% 100%, 83% 97%, 78% 100%, 73% 98%, 68% 100%, 63% 97%, 58% 100%, 53% 98%, 48% 100%, 43% 97%, 38% 100%, 33% 98%, 28% 100%, 23% 97%, 18% 100%, 13% 98%, 8% 100%, 3% 97%, 0% 100%, 0% 0%)";

/* ─── Animation Variants ──────────────────────────────────────────────────── */

const heroCard = {
  hidden: { opacity: 0, y: -100, rotate: -6, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 2,
    scale: 1,
    transition: { type: "spring", stiffness: 70, damping: 13, delay: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

/** Section reveal helper for scroll-triggered animations. */
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

export default function PolaroidInvitationPage({
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
      className="relative min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: secondary,
        fontFamily: bodyFont,
        backgroundImage: `radial-gradient(${primary}12 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      {/* ═══════════════════ SCATTERED SMALL POLAROIDS ═══════════════════ */}
      {scatteredPhotos.map((p, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute hidden md:block"
          style={{
            top: p.top,
            bottom: p.bottom,
            left: p.left,
            right: p.right,
            width: 110 * p.scale,
            height: 130 * p.scale,
            zIndex: 5,
          }}
          initial={{ opacity: 0, y: -50, rotate: p.rotate - 12 }}
          animate={{ opacity: 1, y: 0, rotate: p.rotate }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 12,
            delay: p.delay,
          }}
          whileHover={{ rotate: 0, scale: 1.08, y: -6 }}
        >
          {/* Polaroid frame */}
          <div
            style={{
              backgroundColor: "#fff",
              boxShadow: "3px 4px 12px rgba(0,0,0,0.15)",
              padding: "6px 6px 22px",
              width: "100%",
              height: "100%",
            }}
          >
            <div
              className="h-full w-full"
              style={{ backgroundColor: `${primary}10` }}
            />
          </div>
          {/* Washi tape on top */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <WashiTape width={50} rotate={i % 2 === 0 ? -8 : 6} color={accent} />
          </div>
        </motion.div>
      ))}

      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20">
        {/* Giant hero polaroid */}
        <motion.div
          variants={heroCard}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-sm text-center"
          style={{
            backgroundColor: "#fff",
            boxShadow:
              "8px 10px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.04)",
            padding: "24px 24px 60px",
          }}
        >
          {/* Photo area — names inside */}
          <div
            className="flex flex-col items-center justify-center"
            style={{
              backgroundColor: `${primary}08`,
              padding: "40px 20px",
              minHeight: 240,
            }}
          >
            <motion.h1
              custom={0.5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-5xl sm:text-6xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              {wedding.partner1_name}
            </motion.h1>

            <motion.p
              custom={0.65}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="my-2 text-3xl"
              style={{ fontFamily: displayFont, color: accent }}
            >
              &amp;
            </motion.p>

            <motion.h1
              custom={0.8}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-5xl sm:text-6xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              {wedding.partner2_name}
            </motion.h1>
          </div>

          {/* Caption below photo area */}
          <motion.p
            custom={1.0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-4 text-lg"
            style={{ fontFamily: displayFont, color: primary, opacity: 0.7 }}
          >
            Save the Date
          </motion.p>
        </motion.div>

        {/* Washi tape across the top of the hero card */}
        <motion.div
          className="absolute"
          style={{ top: "calc(50% - 180px)", zIndex: 10 }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
        >
          <WashiTape width={120} rotate={-3} color={accent} />
        </motion.div>

        {/* ─── Torn paper notes for date & venue ─── */}
        <div className="mt-10 flex flex-wrap items-start justify-center gap-6">
          {weddingDate && (
            <motion.div
              custom={1.2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="relative px-8 py-5 text-center"
              style={{
                backgroundColor: "#FFF9F0",
                clipPath: tornEdgeClip,
                boxShadow: "2px 3px 10px rgba(0,0,0,0.08)",
                maxWidth: 260,
              }}
            >
              <PushPin color={accent} className="absolute -top-2 left-1/2 -translate-x-1/2" />
              <Calendar size={16} style={{ color: accent }} className="mx-auto mb-2" />
              <p
                className="text-lg"
                style={{ fontFamily: displayFont, color: primary }}
              >
                {weddingDate}
              </p>
            </motion.div>
          )}

          {wedding.venue_name && (
            <motion.div
              custom={1.4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="relative px-8 py-5 text-center"
              style={{
                backgroundColor: "#FFF9F0",
                clipPath: tornEdgeClip,
                boxShadow: "2px 3px 10px rgba(0,0,0,0.08)",
                maxWidth: 260,
              }}
            >
              <PushPin color={accent} className="absolute -top-2 left-1/2 -translate-x-1/2" />
              <MapPin size={16} style={{ color: accent }} className="mx-auto mb-2" />
              <p
                className="text-lg"
                style={{ fontFamily: displayFont, color: primary }}
              >
                {wedding.venue_name}
              </p>
              {wedding.venue_address && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: primary, opacity: 0.6 }}
                >
                  {wedding.venue_address}
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Countdown */}
        {wedding.wedding_date && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.7 }}
          >
            <CountdownTimer
              targetDate={wedding.wedding_date}
              numberClassName="text-3xl md:text-4xl"
              labelClassName="text-xs uppercase tracking-wider"
            />
          </motion.div>
        )}
      </section>

      {/* ═══════════════════ CORKBOARD STORY SECTION ═══════════════════ */}
      {wedding.story_text && (
        <RevealSection
          className="px-6 py-24"
          style={{
            backgroundColor: "#C4A265",
            backgroundImage: `
              radial-gradient(ellipse at 20% 30%, rgba(0,0,0,0.06) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 70%, rgba(0,0,0,0.06) 0%, transparent 60%),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(0,0,0,0.03) 3px,
                rgba(0,0,0,0.03) 4px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 3px,
                rgba(0,0,0,0.03) 3px,
                rgba(0,0,0,0.03) 4px
              )
            `,
          }}
        >
          <div className="mx-auto max-w-lg">
            {/* Story card pinned to corkboard */}
            <motion.div
              className="relative mx-auto p-8"
              style={{
                backgroundColor: "#FFFFF8",
                boxShadow: "4px 5px 16px rgba(0,0,0,0.15)",
                transform: "rotate(-1.5deg)",
              }}
              whileHover={{ rotate: 0, scale: 1.01, transition: { duration: 0.3 } }}
            >
              <PushPin color={accent} className="absolute -top-2 left-6" />
              <PushPin color={primary} className="absolute -top-2 right-6" />

              <h2
                className="mb-6 text-center text-4xl"
                style={{ fontFamily: displayFont, color: primary }}
              >
                Our Story
              </h2>

              <div className="mx-auto mb-4 h-px w-16" style={{ backgroundColor: accent, opacity: 0.4 }} />

              <p
                className="whitespace-pre-line text-base leading-[1.9]"
                style={{ fontFamily: displayFont, color: primary, opacity: 0.8 }}
              >
                {wedding.story_text}
              </p>

              {/* Bottom washi tape */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                <WashiTape width={90} rotate={2} color={accent} />
              </div>
            </motion.div>
          </div>
        </RevealSection>
      )}

      {/* ═══════════════════ EXPLORE LINKS ═══════════════════ */}
      <RevealSection
        className="flex flex-col items-center px-6 py-20"
        style={{ backgroundColor: secondary }}
      >
        <h3
          className="mb-8 text-2xl"
          style={{ fontFamily: displayFont, color: primary }}
        >
          Explore More
        </h3>

        <div className="flex flex-wrap justify-center gap-5">
          <Link href={`/${wedding.slug}/gallery`}>
            <motion.span
              className="relative inline-block cursor-pointer px-8 py-3 text-sm"
              style={{
                fontFamily: displayFont,
                color: primary,
                backgroundColor: "#fff",
                boxShadow: "3px 3px 10px rgba(0,0,0,0.1)",
                transform: "rotate(-1deg)",
              }}
              whileHover={{ rotate: 0, scale: 1.05, y: -4, boxShadow: "4px 6px 16px rgba(0,0,0,0.15)" }}
              transition={{ duration: 0.2 }}
            >
              <WashiTape
                width={50}
                rotate={4}
                color={accent}
                className="absolute -top-2 left-1/2 -translate-x-1/2"
              />
              Gallery
            </motion.span>
          </Link>

          <Link href={`/${wedding.slug}/guestbook`}>
            <motion.span
              className="relative inline-block cursor-pointer px-8 py-3 text-sm"
              style={{
                fontFamily: displayFont,
                color: primary,
                backgroundColor: "#fff",
                boxShadow: "3px 3px 10px rgba(0,0,0,0.1)",
                transform: "rotate(1.5deg)",
              }}
              whileHover={{ rotate: 0, scale: 1.05, y: -4, boxShadow: "4px 6px 16px rgba(0,0,0,0.15)" }}
              transition={{ duration: 0.2 }}
            >
              <WashiTape
                width={50}
                rotate={-3}
                color={accent}
                className="absolute -top-2 left-1/2 -translate-x-1/2"
              />
              Guest Book
            </motion.span>
          </Link>
        </div>
      </RevealSection>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer
        className="flex flex-col items-center px-6 pb-16 pt-8"
        style={{ backgroundColor: secondary }}
      >
        <WashiTape width={80} rotate={0} color={accent} />
        <p
          className="mt-4 text-sm"
          style={{ fontFamily: displayFont, color: primary, opacity: 0.5 }}
        >
          Made with love
        </p>
      </footer>
    </div>
  );
}
