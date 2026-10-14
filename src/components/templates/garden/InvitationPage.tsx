"use client";

/**
 * Garden invitation page — English country garden charm with SVG botanical
 * vine borders that draw themselves on load, fluttering SVG butterflies,
 * leaf dividers, scroll-linked vine growth, and gentle spring animations.
 */

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/* ── animation variants ────────────────────────────────────────────── */

/** SVG path draw-in for vine borders. */
const vineDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 2.5 + i * 0.3,
      ease: "easeInOut",
      delay: 0.3 + i * 0.15,
    },
  }),
};

/** Gentle rise with spring physics for content items. */
const gentleRise = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.18,
      type: "spring",
      stiffness: 120,
      damping: 16,
    },
  }),
};

/* ── CSS keyframes ─────────────────────────────────────────────────── */

const keyframes = `
@keyframes gardenSway {
  0%, 100% { transform: rotate(-2deg); }
  50%      { transform: rotate(2deg); }
}
@keyframes gardenSwayAlt {
  0%, 100% { transform: rotate(1.5deg); }
  50%      { transform: rotate(-1.5deg); }
}
@keyframes butterflyFloat {
  0%   { transform: translate(0, 0) rotate(0deg); }
  25%  { transform: translate(15px, -25px) rotate(8deg); }
  50%  { transform: translate(-10px, -40px) rotate(-5deg); }
  75%  { transform: translate(20px, -20px) rotate(10deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
`;

/* ── Butterfly SVG component ───────────────────────────────────────── */

/** Small SVG butterfly with independent random flight path. */
function Butterfly({
  color,
  accentColor,
  startX,
  startY,
  delay,
  duration,
  size = 20,
}: {
  color: string;
  accentColor: string;
  startX: string;
  startY: string;
  delay: number;
  duration: number;
  size?: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: startX, top: startY }}
      animate={{
        x: [0, 40, -30, 60, -20, 0],
        y: [0, -50, -90, -40, -70, 0],
        rotate: [0, 12, -8, 15, -10, 0],
        opacity: [0, 0.7, 0.5, 0.7, 0.4, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 30 24" width={size} height={size * 0.8}>
        {/* Left wing */}
        <motion.path
          d="M15,12 Q5,2 2,10 Q0,16 8,18 Q12,18 15,12"
          fill={color}
          opacity="0.7"
          animate={{ d: [
            "M15,12 Q5,2 2,10 Q0,16 8,18 Q12,18 15,12",
            "M15,12 Q8,4 4,10 Q2,15 8,17 Q12,17 15,12",
            "M15,12 Q5,2 2,10 Q0,16 8,18 Q12,18 15,12",
          ]}}
          transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Right wing */}
        <motion.path
          d="M15,12 Q25,2 28,10 Q30,16 22,18 Q18,18 15,12"
          fill={color}
          opacity="0.7"
          animate={{ d: [
            "M15,12 Q25,2 28,10 Q30,16 22,18 Q18,18 15,12",
            "M15,12 Q22,4 26,10 Q28,15 22,17 Q18,17 15,12",
            "M15,12 Q25,2 28,10 Q30,16 22,18 Q18,18 15,12",
          ]}}
          transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Body */}
        <ellipse cx="15" cy="13" rx="1" ry="4" fill={accentColor} opacity="0.8" />
        {/* Antennae */}
        <line x1="14" y1="9" x2="11" y2="5" stroke={accentColor} strokeWidth="0.5" opacity="0.6" />
        <line x1="16" y1="9" x2="19" y2="5" stroke={accentColor} strokeWidth="0.5" opacity="0.6" />
      </svg>
    </motion.div>
  );
}

/* ── Leaf Divider ──────────────────────────────────────────────────── */

/** Botanical leaf divider between sections. */
function LeafDivider({ color, accentColor: _accentColor }: { color: string; accentColor: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <div className="h-px w-12 md:w-20" style={{ backgroundColor: color, opacity: 0.25 }} />
      <svg viewBox="0 0 40 20" width="40" height="20" style={{ animation: "gardenSway 4s ease-in-out infinite" }}>
        <path
          d="M20,18 Q12,10 5,14 Q8,6 16,4 Q20,2 24,4 Q32,6 35,14 Q28,10 20,18 Z"
          fill={color}
          opacity="0.35"
        />
        <path
          d="M20,16 L20,4"
          stroke={color}
          strokeWidth="0.5"
          opacity="0.3"
          fill="none"
        />
      </svg>
      <div className="h-px w-12 md:w-20" style={{ backgroundColor: color, opacity: 0.25 }} />
    </div>
  );
}

/* ── Small Botanical Sprig ─────────────────────────────────────────── */

/** Tiny botanical sprig used as section separator. */
function BotanicalSprig({ color }: { color: string }) {
  return (
    <div className="flex justify-center py-4" style={{ animation: "gardenSwayAlt 5s ease-in-out infinite" }}>
      <svg viewBox="0 0 50 30" width="50" height="30">
        {/* Main stem */}
        <path d="M25,28 Q25,15 25,5" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
        {/* Left leaf */}
        <path d="M25,18 Q18,12 14,16 Q18,14 25,18" fill={color} opacity="0.3" />
        {/* Right leaf */}
        <path d="M25,14 Q32,8 36,12 Q32,10 25,14" fill={color} opacity="0.3" />
        {/* Top bud */}
        <circle cx="25" cy="5" r="2" fill={color} opacity="0.25" />
        {/* Additional leaves */}
        <path d="M25,22 Q20,18 17,21 Q20,19 25,22" fill={color} opacity="0.2" />
        <path d="M25,10 Q30,6 33,9 Q30,7 25,10" fill={color} opacity="0.2" />
      </svg>
    </div>
  );
}

/* ── Vine Border SVG ───────────────────────────────────────────────── */

/** Full-viewport vine border that draws itself on load. */
function VineBorder({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 1000 1000"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Top edge vine */}
        <motion.path
          d="M0,30 Q100,10 200,25 Q300,40 400,20 Q500,5 600,22 Q700,38 800,18 Q900,8 1000,28"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          custom={0}
          variants={vineDraw}
          initial="hidden"
          animate="visible"
          opacity={0.35}
        />
        {/* Left edge vine */}
        <motion.path
          d="M30,0 Q10,100 25,200 Q40,300 15,400 Q5,500 20,600 Q35,700 18,800 Q8,900 30,1000"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          custom={1}
          variants={vineDraw}
          initial="hidden"
          animate="visible"
          opacity={0.3}
        />
        {/* Bottom edge vine */}
        <motion.path
          d="M0,972 Q100,990 200,975 Q300,960 400,978 Q500,992 600,970 Q700,955 800,975 Q900,990 1000,968"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          custom={2}
          variants={vineDraw}
          initial="hidden"
          animate="visible"
          opacity={0.3}
        />
        {/* Right edge vine */}
        <motion.path
          d="M972,0 Q990,100 975,200 Q960,300 980,400 Q995,500 975,600 Q955,700 978,800 Q992,900 970,1000"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          custom={3}
          variants={vineDraw}
          initial="hidden"
          animate="visible"
          opacity={0.3}
        />

        {/* Leaf accents along top vine */}
        {[150, 350, 550, 750].map((x, i) => (
          <motion.path
            key={`tl${i}`}
            d={`M${x},${20 + (i % 2) * 10} Q${x - 10},${10 + (i % 2) * 5} ${x - 5},${28 + (i % 2) * 6} Q${x},${22 + (i % 2) * 8} ${x},${20 + (i % 2) * 10}`}
            fill={color}
            opacity={0.2}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ delay: 1.5 + i * 0.3, duration: 0.5 }}
          />
        ))}
        {/* Leaf accents along left vine */}
        {[200, 450, 650, 850].map((y, i) => (
          <motion.path
            key={`ll${i}`}
            d={`M${22 + (i % 2) * 8},${y} Q${10 + (i % 2) * 4},${y - 8} ${28 + (i % 2) * 5},${y - 4} Q${24 + (i % 2) * 6},${y} ${22 + (i % 2) * 8},${y}`}
            fill={color}
            opacity={0.18}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.18, scale: 1 }}
            transition={{ delay: 2 + i * 0.25, duration: 0.5 }}
          />
        ))}
        {/* Small flower dots at vine intersections */}
        {[
          { cx: 200, cy: 25 },
          { cx: 500, cy: 12 },
          { cx: 800, cy: 20 },
          { cx: 25, cy: 300 },
          { cx: 18, cy: 600 },
        ].map((pos, i) => (
          <motion.circle
            key={`f${i}`}
            cx={pos.cx}
            cy={pos.cy}
            r="3"
            fill={accentColor}
            opacity={0}
            animate={{ opacity: [0, 0.35, 0.35] }}
            transition={{ delay: 2.5 + i * 0.2, duration: 0.4 }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ── Scroll-linked vine ────────────────────────────────────────────── */

/** Single leaf accent on the scroll vine — calls useTransform at top level. */
function VineLeaf({
  color,
  scrollProgress,
  y,
  index,
}: {
  color: string;
  scrollProgress: ReturnType<typeof useTransform<number>>;
  y: number;
  index: number;
}) {
  const opacity = useTransform(
    scrollProgress,
    [Math.max(0, y / 1000 - 0.05), y / 1000],
    [0, 0.2]
  );
  const cx = index % 2 === 0 ? 12 : 18;
  const qx = index % 2 === 0 ? 4 : 26;
  const ex = index % 2 === 0 ? 8 : 22;
  return (
    <motion.path
      d={`M${cx},${y} Q${qx},${y - 8} ${ex},${y + 5} Z`}
      fill={color}
      style={{ opacity }}
    />
  );
}

/** Vine that grows along the left margin as user scrolls. */
function ScrollVine({ color, scrollProgress }: { color: string; scrollProgress: ReturnType<typeof useTransform<number>> }) {
  const pathLength = useSpring(scrollProgress, { stiffness: 60, damping: 20 });
  const vineYPositions = [100, 250, 400, 550, 700, 850];

  return (
    <div className="pointer-events-none fixed left-2 top-0 z-10 hidden h-full w-8 md:block lg:left-4">
      <svg
        viewBox="0 0 30 1000"
        className="h-full w-full"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          d="M15,0 Q8,50 18,100 Q25,150 12,200 Q5,250 20,300 Q28,350 10,400 Q4,450 18,500 Q26,550 12,600 Q6,650 20,700 Q27,750 10,800 Q5,850 18,900 Q24,950 15,1000"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={0.25}
          style={{ pathLength }}
        />
        {/* Leaf accents along the scroll vine */}
        {vineYPositions.map((y, i) => (
          <VineLeaf
            key={i}
            color={color}
            scrollProgress={scrollProgress}
            y={y}
            index={i}
          />
        ))}
      </svg>
    </div>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function GardenInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-80px" });
  const navInView = useInView(navRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -30]);

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

  /* Butterfly configuration — 5 independent butterflies */
  const butterflyConfigs = [
    { startX: "15%", startY: "25%", delay: 0.5, duration: 10, size: 18 },
    { startX: "75%", startY: "15%", delay: 2.0, duration: 12, size: 22 },
    { startX: "40%", startY: "60%", delay: 3.5, duration: 9, size: 16 },
    { startX: "85%", startY: "45%", delay: 5.0, duration: 11, size: 20 },
    { startX: "25%", startY: "70%", delay: 6.5, duration: 13, size: 17 },
  ];

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundColor: secondary,
        fontFamily: bodyFont,
      }}
    >
      {/* Inject CSS keyframes */}
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      {/* Vine border that draws itself around viewport edges */}
      <VineBorder color={primary} accentColor={accent} />

      {/* Scroll-linked vine along left margin */}
      <ScrollVine color={primary} scrollProgress={scrollYProgress} />

      {/* Floating SVG butterflies */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {butterflyConfigs.map((cfg, i) => (
          <Butterfly
            key={i}
            color={accent}
            accentColor={primary}
            startX={cfg.startX}
            startY={cfg.startY}
            delay={cfg.delay}
            duration={cfg.duration}
            size={cfg.size}
          />
        ))}
      </div>

      {/* ═══════════════ HERO ═══════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center px-8 text-center"
      >
        {/* Subtle background pattern — faint botanical texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, ${primary} 1px, transparent 1px),
                              radial-gradient(circle at 80% 70%, ${primary} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content with staggered entrance */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          style={{ y: parallaxY }}
        >
          {/* Tagline */}
          <motion.p
            custom={0}
            variants={gentleRise}
            initial="hidden"
            animate="visible"
            className="mb-8 text-xs uppercase tracking-[0.45em]"
            style={{ color: accent }}
          >
            In the garden of love
          </motion.p>

          {/* Partner 1 */}
          <motion.h1
            custom={1}
            variants={gentleRise}
            initial="hidden"
            animate="visible"
            className="mb-2 text-5xl sm:text-6xl md:text-8xl"
            style={{ fontFamily: displayFont, color: primary }}
          >
            {wedding.partner1_name}
          </motion.h1>

          {/* Leaf ampersand divider */}
          <motion.div
            custom={2}
            variants={gentleRise}
            initial="hidden"
            animate="visible"
            className="my-5 flex items-center gap-3"
          >
            <div
              className="h-px w-14 md:w-20"
              style={{ backgroundColor: primary, opacity: 0.3 }}
            />
            <svg viewBox="0 0 30 24" width="28" height="22" style={{ animation: "gardenSway 4s ease-in-out infinite" }}>
              <path
                d="M15,22 Q8,14 3,17 Q6,8 13,4 Q15,2 17,4 Q24,8 27,17 Q22,14 15,22 Z"
                fill={primary}
                opacity="0.4"
              />
              <path
                d="M15,20 L15,5"
                stroke={primary}
                strokeWidth="0.5"
                opacity="0.3"
                fill="none"
              />
            </svg>
            <div
              className="h-px w-14 md:w-20"
              style={{ backgroundColor: primary, opacity: 0.3 }}
            />
          </motion.div>

          {/* Partner 2 */}
          <motion.h1
            custom={3}
            variants={gentleRise}
            initial="hidden"
            animate="visible"
            className="mb-10 text-5xl sm:text-6xl md:text-8xl"
            style={{ fontFamily: displayFont, color: primary }}
          >
            {wedding.partner2_name}
          </motion.h1>

          {/* Date */}
          {weddingDate && (
            <motion.div
              custom={4}
              variants={gentleRise}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3"
            >
              <svg viewBox="0 0 20 20" width="16" height="16">
                <rect x="2" y="4" width="16" height="14" rx="1" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.6" />
                <line x1="2" y1="8" x2="18" y2="8" stroke={accent} strokeWidth="0.8" opacity="0.4" />
                <line x1="6" y1="2" x2="6" y2="6" stroke={accent} strokeWidth="1" opacity="0.5" strokeLinecap="round" />
                <line x1="14" y1="2" x2="14" y2="6" stroke={accent} strokeWidth="1" opacity="0.5" strokeLinecap="round" />
              </svg>
              <p
                className="text-sm md:text-base"
                style={{ color: primary, fontFamily: displayFont }}
              >
                {weddingDate}
              </p>
            </motion.div>
          )}

          {/* Venue */}
          {wedding.venue_name && (
            <motion.div
              custom={5}
              variants={gentleRise}
              initial="hidden"
              animate="visible"
              className="mt-3 flex items-center gap-3"
            >
              <svg viewBox="0 0 20 20" width="16" height="16">
                <path
                  d="M10,2 C6,2 3,5 3,9 C3,14 10,19 10,19 C10,19 17,14 17,9 C17,5 14,2 10,2 Z"
                  fill="none" stroke={accent} strokeWidth="1.2" opacity="0.6"
                />
                <circle cx="10" cy="9" r="2.5" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.5" />
              </svg>
              <p className="text-sm" style={{ color: accent }}>
                {wedding.venue_name}
              </p>
            </motion.div>
          )}

          {/* Countdown with leaf icons between units */}
          {wedding.wedding_date && (
            <motion.div
              custom={6}
              variants={gentleRise}
              initial="hidden"
              animate="visible"
              className="mt-14"
            >
              <CountdownTimer
                targetDate={wedding.wedding_date}
                numberClassName="text-2xl md:text-3xl"
                labelClassName="text-[10px] uppercase tracking-[0.15em]"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 20 30" width="16" height="24">
              <path
                d="M10,2 L10,22 M4,16 L10,22 L16,16"
                stroke={primary}
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ BOTANICAL DIVIDER ═══════════════ */}
      <LeafDivider color={primary} accentColor={accent} />

      {/* ═══════════════ STORY ═══════════════ */}
      {wedding.story_text && (
        <motion.section
          ref={storyRef}
          className="mx-auto max-w-2xl px-8 py-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={storyInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <BotanicalSprig color={primary} />

          <h2
            className="mb-2 text-3xl md:text-4xl"
            style={{ fontFamily: displayFont, color: primary }}
          >
            Our Story
          </h2>

          <LeafDivider color={primary} accentColor={accent} />

          <p
            className="mt-6 whitespace-pre-line text-base leading-relaxed md:text-lg"
            style={{ color: accent }}
          >
            {wedding.story_text}
          </p>

          <BotanicalSprig color={primary} />
        </motion.section>
      )}

      {/* ═══════════════ SECOND DIVIDER ═══════════════ */}
      <LeafDivider color={primary} accentColor={accent} />

      {/* ═══════════════ NAVIGATION ═══════════════ */}
      <motion.section
        ref={navRef}
        className="flex flex-col items-center px-8 py-20 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={navInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="mb-8 text-xs uppercase tracking-[0.4em]"
          style={{ color: accent, opacity: 0.65 }}
        >
          Explore
        </p>

        <div className="flex flex-wrap justify-center gap-5">
          {[
            { href: `/${wedding.slug}/gallery`, label: "Gallery" },
            { href: `/${wedding.slug}/guestbook`, label: "Guest Book" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}>
              <motion.span
                className="inline-block cursor-pointer rounded-full border px-10 py-3 text-sm uppercase tracking-[0.2em] transition-colors duration-300"
                style={{
                  color: primary,
                  borderColor: `${primary}40`,
                  fontFamily: bodyFont,
                }}
                whileHover={{
                  backgroundColor: `${primary}10`,
                  borderColor: primary,
                  scale: 1.04,
                }}
                whileTap={{ scale: 0.97 }}
              >
                {label}
              </motion.span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════ FOOTER DECORATION ═══════════════ */}
      <footer className="flex flex-col items-center pb-14 pt-4">
        <BotanicalSprig color={primary} />

        <motion.p
          className="text-xs tracking-widest"
          style={{ color: primary, opacity: 0.3 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Made with love
        </motion.p>
      </footer>
    </div>
  );
}
