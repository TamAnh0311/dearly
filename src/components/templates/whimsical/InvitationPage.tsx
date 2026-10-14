"use client";

/**
 * Whimsical invitation page — fairy tale enchanted wedding design with soft
 * lavender gradient, SVG enchanted forest silhouettes, floating lanterns,
 * stardust particles drifting upward, crescent moon, whimsical swirl
 * decorations, and a storybook page-border for the story section.
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

/* ─── SVG Components ───────────────────────────────────────────────────────── */

/** Crescent moon with soft lavender glow. */
function CrescentMoon({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 64, height: 64 }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="whimsicalMoonGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#whimsicalMoonGlow)" />
      <motion.path
        d="M46 12 A28 28 0 1 0 46 68 A20 20 0 1 1 46 12Z"
        fill={color}
        fillOpacity={0.9}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.6 }}
      />
    </svg>
  );
}

/** Enchanted forest silhouette: castle turrets + trees at the bottom. */
function EnchantedForest({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 1200 220"
      preserveAspectRatio="xMidYMax meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 left-0 w-full"
      style={{ height: 200 }}
      aria-hidden="true"
    >
      {/* Castle center */}
      <rect x="540" y="80" width="120" height="140" fill={color} fillOpacity={0.18} />
      {/* Left turret */}
      <rect x="520" y="60" width="40" height="100" fill={color} fillOpacity={0.22} />
      <polygon points="520,60 560,60 540,30" fill={color} fillOpacity={0.3} />
      {/* Right turret */}
      <rect x="640" y="60" width="40" height="100" fill={color} fillOpacity={0.22} />
      <polygon points="640,60 680,60 660,30" fill={color} fillOpacity={0.3} />
      {/* Far left turret */}
      <rect x="440" y="100" width="30" height="120" fill={color} fillOpacity={0.15} />
      <polygon points="440,100 470,100 455,75" fill={color} fillOpacity={0.2} />
      {/* Far right turret */}
      <rect x="730" y="100" width="30" height="120" fill={color} fillOpacity={0.15} />
      <polygon points="730,100 760,100 745,75" fill={color} fillOpacity={0.2} />
      {/* Castle door arch */}
      <path d="M575 220 L575 160 Q600 140 625 160 L625 220" fill={color} fillOpacity={0.28} />
      {/* Castle windows */}
      <rect x="555" y="105" width="16" height="22" rx="8" fill={color} fillOpacity={0.35} />
      <rect x="629" y="105" width="16" height="22" rx="8" fill={color} fillOpacity={0.35} />

      {/* Trees — left cluster */}
      <polygon points="60,220 100,100 140,220" fill={color} fillOpacity={0.2} />
      <polygon points="100,220 140,110 180,220" fill={color} fillOpacity={0.18} />
      <polygon points="150,220 185,120 220,220" fill={color} fillOpacity={0.22} />
      <polygon points="200,220 235,130 270,220" fill={color} fillOpacity={0.17} />
      <polygon points="250,220 285,115 320,220" fill={color} fillOpacity={0.2} />
      <polygon points="300,220 340,125 380,220" fill={color} fillOpacity={0.18} />
      <polygon points="360,220 400,135 440,220" fill={color} fillOpacity={0.15} />

      {/* Trees — right cluster */}
      <polygon points="760,220 800,135 840,220" fill={color} fillOpacity={0.15} />
      <polygon points="810,220 850,120 890,220" fill={color} fillOpacity={0.18} />
      <polygon points="860,220 900,110 940,220" fill={color} fillOpacity={0.2} />
      <polygon points="910,220 950,125 990,220" fill={color} fillOpacity={0.17} />
      <polygon points="960,220 1000,115 1040,220" fill={color} fillOpacity={0.22} />
      <polygon points="1020,220 1060,105 1100,220" fill={color} fillOpacity={0.18} />
      <polygon points="1070,220 1110,95 1150,220" fill={color} fillOpacity={0.2} />

      {/* Ground fill */}
      <rect x="0" y="200" width="1200" height="20" fill={color} fillOpacity={0.12} />
    </svg>
  );
}

/** Floating lantern: oval body with glowing centre and a short tail. */
function Lantern({
  color,
  accent,
  size = 1,
}: {
  color: string;
  accent: string;
  size?: number;
}) {
  const w = 18 * size;
  const h = 24 * size;
  return (
    <svg
      viewBox="0 0 18 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: w, height: h }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`lanternGlow${size}`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </radialGradient>
      </defs>
      {/* Lantern body */}
      <ellipse cx="9" cy="13" rx="7" ry="10" fill={`url(#lanternGlow${size})`} />
      <ellipse cx="9" cy="13" rx="7" ry="10" stroke={color} strokeWidth="0.5" strokeOpacity="0.5" />
      {/* Top cap */}
      <rect x="6" y="3" width="6" height="2" rx="1" fill={color} fillOpacity={0.6} />
      {/* String */}
      <line x1="9" y1="3" x2="9" y2="0" stroke={color} strokeWidth="0.5" strokeOpacity="0.5" />
      {/* Bottom tail */}
      <line x1="9" y1="23" x2="9" y2="28" stroke={accent} strokeWidth="0.5" strokeOpacity="0.6" />
      <circle cx="9" cy="29" r="0.8" fill={accent} fillOpacity={0.5} />
    </svg>
  );
}

/** Whimsical swirl ornament used as a section divider. */
function SwirlDivider({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 280 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 240, height: 28 }}
      aria-hidden="true"
    >
      {/* Left swirl arm */}
      <path
        d="M0 16 Q20 4 40 16 Q60 28 80 16 Q100 4 110 16"
        stroke={color}
        strokeWidth="0.8"
        strokeOpacity="0.45"
        fill="none"
      />
      {/* Right swirl arm */}
      <path
        d="M280 16 Q260 4 240 16 Q220 28 200 16 Q180 4 170 16"
        stroke={color}
        strokeWidth="0.8"
        strokeOpacity="0.45"
        fill="none"
      />
      {/* Center star */}
      <path
        d="M140 6 L141.8 12 L148 12 L143 15.4 L145 21.6 L140 18 L135 21.6 L137 15.4 L132 12 L138.2 12 Z"
        fill={color}
        fillOpacity={0.75}
      />
      {/* Small flanking dots */}
      <circle cx="120" cy="16" r="1.5" fill={color} fillOpacity={0.5} />
      <circle cx="160" cy="16" r="1.5" fill={color} fillOpacity={0.5} />
    </svg>
  );
}

/** Magical circle border for the countdown. */
function MagicCircle({ color }: { color: string }) {
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15 * Math.PI) / 180;
    const r1 = 118;
    const r2 = i % 6 === 0 ? 110 : 113;
    const cx = 130;
    const cy = 130;
    return {
      x1: cx + r1 * Math.cos(angle),
      y1: cy + r1 * Math.sin(angle),
      x2: cx + r2 * Math.cos(angle),
      y2: cy + r2 * Math.sin(angle),
    };
  });

  return (
    <svg
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      <circle cx="130" cy="130" r="120" stroke={color} strokeWidth="0.6" strokeOpacity="0.22" />
      <circle cx="130" cy="130" r="112" stroke={color} strokeWidth="0.4" strokeOpacity="0.15" />
      <circle cx="130" cy="130" r="105" stroke={color} strokeWidth="0.3" strokeOpacity="0.1" strokeDasharray="3 6" />
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1}
          x2={t.x2} y2={t.y2}
          stroke={color}
          strokeWidth={i % 6 === 0 ? 1.2 : 0.6}
          strokeOpacity={i % 6 === 0 ? 0.45 : 0.25}
        />
      ))}
      {/* Cardinal stars */}
      {[0, 90, 180, 270].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = 130 + 120 * Math.cos(rad);
        const y = 130 + 120 * Math.sin(rad);
        return (
          <circle key={deg} cx={x} cy={y} r="2.5" fill={color} fillOpacity={0.55} />
        );
      })}
    </svg>
  );
}

/** Storybook page-border SVG: ornate corner flourishes and a ruled inner rect. */
function StorybookBorder({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 440 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Outer rect */}
      <rect x="4" y="4" width="432" height="312" rx="8" stroke={color} strokeWidth="0.8" strokeOpacity="0.25" />
      {/* Inner rect */}
      <rect x="14" y="14" width="412" height="292" rx="6" stroke={color} strokeWidth="0.4" strokeOpacity="0.15" strokeDasharray="4 8" />

      {/* Corner flourish — top-left */}
      <path d="M4 40 Q4 4 40 4" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" fill="none" strokeLinecap="round" />
      <path d="M4 55 Q4 4 55 4" stroke={color} strokeWidth="0.6" strokeOpacity="0.2" fill="none" />
      <circle cx="28" cy="28" r="3" fill={color} fillOpacity="0.3" />
      <path d="M20 4 L20 18 M4 20 L18 20" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" />

      {/* Corner flourish — top-right */}
      <path d="M436 40 Q436 4 400 4" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" fill="none" strokeLinecap="round" />
      <path d="M436 55 Q436 4 385 4" stroke={color} strokeWidth="0.6" strokeOpacity="0.2" fill="none" />
      <circle cx="412" cy="28" r="3" fill={color} fillOpacity="0.3" />
      <path d="M420 4 L420 18 M436 20 L422 20" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" />

      {/* Corner flourish — bottom-left */}
      <path d="M4 280 Q4 316 40 316" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" fill="none" strokeLinecap="round" />
      <path d="M4 265 Q4 316 55 316" stroke={color} strokeWidth="0.6" strokeOpacity="0.2" fill="none" />
      <circle cx="28" cy="292" r="3" fill={color} fillOpacity="0.3" />

      {/* Corner flourish — bottom-right */}
      <path d="M436 280 Q436 316 400 316" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" fill="none" strokeLinecap="round" />
      <path d="M436 265 Q436 316 385 316" stroke={color} strokeWidth="0.6" strokeOpacity="0.2" fill="none" />
      <circle cx="412" cy="292" r="3" fill={color} fillOpacity="0.3" />

      {/* Top centre ornament */}
      <path d="M195 4 Q220 16 245 4" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" fill="none" />
      <circle cx="220" cy="4" r="2" fill={color} fillOpacity="0.4" />

      {/* Bottom centre ornament */}
      <path d="M195 316 Q220 304 245 316" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" fill="none" />
      <circle cx="220" cy="316" r="2" fill={color} fillOpacity="0.4" />
    </svg>
  );
}

/* ─── Particle / Lantern Data (deterministic, no Math.random) ──────────────── */

/** Stardust particles that drift upward. */
const stardustParticles = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: `${((i * 23 + 5) % 96) + 2}%`,
  startTop: `${((i * 17 + 10) % 60) + 40}%`,
  size: 1 + (i % 3) * 0.8,
  delay: (i * 0.41) % 7,
  duration: 5 + (i % 5) * 2,
  driftX: ((i % 5) - 2) * 12,
}));

/** Scattered stars in the sky. */
const scatteredStars = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  left: `${((i * 19 + 3) % 96) + 2}%`,
  top: `${((i * 31 + 7) % 75) + 2}%`,
  size: 0.8 + (i % 4) * 0.6,
  delay: (i * 0.29) % 5,
  duration: 2.5 + (i % 4) * 1.2,
}));

/** Floating lanterns in the background. */
const floatingLanterns = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  left: `${((i * 11 + 4) % 88) + 6}%`,
  startTop: `${((i * 13 + 60) % 30) + 60}%`,
  scale: 0.7 + (i % 4) * 0.2,
  delay: (i * 0.9) % 6,
  duration: 8 + (i % 5) * 2,
  driftX: ((i % 5) - 2) * 18,
}));

/* ─── Animation Variants ───────────────────────────────────────────────────── */

const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.28, delayChildren: 0.4 },
  },
};

const heroChild = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── RevealSection ────────────────────────────────────────────────────────── */

/** Section that fades + slides up when it enters the viewport. */
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
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────────── */

export default function WhimsicalInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 55]);
  const moonY = useTransform(scrollYProgress, [0, 1], [0, -35]);
  const forestY = useTransform(scrollYProgress, [0, 1], [0, 30]);

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
      style={{
        background: `linear-gradient(165deg, #EDE8F8 0%, #D4C8F0 18%, #C2B2E8 35%, ${primary}55 55%, #BBA8E0 72%, #D8CEEE 88%, ${secondary} 100%)`,
        fontFamily: bodyFont,
      }}
    >
      {/* ─── Twinkling scattered stars (fixed overlay) ─── */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {scatteredStars.map((s) => (
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
            animate={{ opacity: [0, 0.85, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ─── Floating lanterns (fixed) ─── */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {floatingLanterns.map((l) => (
          <motion.div
            key={l.id}
            className="absolute"
            style={{ left: l.left, top: l.startTop, scale: l.scale }}
            animate={{
              y: [0, -160, -320],
              x: [0, l.driftX, l.driftX * 0.6],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: l.duration,
              delay: l.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Lantern color={primary} accent={accent} size={l.scale} />
          </motion.div>
        ))}
      </div>

      {/* ─── Stardust particles drifting upward (fixed) ─── */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {stardustParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: p.startTop,
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, ${accent} 0%, ${primary}88 100%)`,
            }}
            animate={{
              y: [0, -80, -180],
              x: [0, p.driftX],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* ════════════════════════════ HERO ════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center"
        style={{ overflow: "hidden" }}
      >
        {/* Crescent moon — upper right with parallax */}
        <motion.div
          className="absolute right-8 top-12 md:right-20 md:top-16"
          style={{ y: moonY }}
        >
          <CrescentMoon color={primary} />
        </motion.div>

        {/* Scattered large stars near hero */}
        {[
          { top: "12%", left: "8%", size: 14 },
          { top: "20%", right: "14%", size: 10 },
          { top: "35%", left: "5%", size: 8 },
          { top: "10%", left: "55%", size: 6 },
          { top: "28%", right: "5%", size: 12 },
        ].map((s, i) => (
          <motion.svg
            key={i}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute"
            style={{ width: s.size, height: s.size, ...s }}
            animate={{ opacity: [0.3, 0.9, 0.3], rotate: [0, 15, 0] }}
            transition={{ duration: 3 + i, delay: i * 0.7, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          >
            <path
              d="M10 1 L11.8 7 L18 7 L13 10.8 L14.8 17 L10 13 L5.2 17 L7 10.8 L2 7 L8.2 7 Z"
              fill={primary}
              fillOpacity={0.7}
            />
          </motion.svg>
        ))}

        {/* Enchanted forest silhouette with parallax */}
        <motion.div className="absolute bottom-0 left-0 w-full" style={{ y: forestY }}>
          <EnchantedForest color={primary} />
        </motion.div>

        {/* Central hero content */}
        <motion.div
          className="relative z-20 flex flex-col items-center px-6 text-center"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          style={{ y: heroContentY }}
        >
          <motion.p
            variants={heroChild}
            className="mb-5 text-xs uppercase tracking-[0.5em]"
            style={{ color: primary, opacity: 0.75 }}
          >
            Once upon a time
          </motion.p>

          {/* Decorative swirl above names */}
          <motion.div variants={heroChild} className="mb-4">
            <svg
              viewBox="0 0 120 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: 110, height: 24 }}
              aria-hidden="true"
            >
              <path
                d="M0 14 Q15 2 30 14 Q45 26 60 14 Q75 2 90 14 Q105 26 120 14"
                stroke={primary}
                strokeWidth="1"
                strokeOpacity="0.45"
                fill="none"
              />
            </svg>
          </motion.div>

          {/* Partner names in magical flowing script */}
          <motion.h1
            variants={heroChild}
            className="text-6xl font-light sm:text-7xl md:text-8xl lg:text-9xl"
            style={{
              fontFamily: displayFont,
              color: primary,
              lineHeight: 1.1,
              letterSpacing: "0.06em",
              textShadow: `0 0 40px ${primary}40`,
            }}
          >
            {wedding.partner1_name}
          </motion.h1>

          <motion.p
            variants={heroChild}
            className="my-2 text-4xl italic md:my-3 md:text-5xl"
            style={{ color: accent, fontFamily: displayFont, opacity: 0.8 }}
          >
            &amp;
          </motion.p>

          <motion.h1
            variants={heroChild}
            className="text-6xl font-light sm:text-7xl md:text-8xl lg:text-9xl"
            style={{
              fontFamily: displayFont,
              color: primary,
              lineHeight: 1.1,
              letterSpacing: "0.06em",
              textShadow: `0 0 40px ${primary}40`,
            }}
          >
            {wedding.partner2_name}
          </motion.h1>

          {/* Decorative swirl below names */}
          <motion.div variants={heroChild} className="mt-4 mb-6">
            <svg
              viewBox="0 0 120 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: 110, height: 24 }}
              aria-hidden="true"
            >
              <path
                d="M0 14 Q15 26 30 14 Q45 2 60 14 Q75 26 90 14 Q105 2 120 14"
                stroke={primary}
                strokeWidth="1"
                strokeOpacity="0.45"
                fill="none"
              />
            </svg>
          </motion.div>

          <motion.p
            variants={heroChild}
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: accent, opacity: 0.7 }}
          >
            Invite you to share in their enchanted celebration
          </motion.p>
        </motion.div>
      </section>

      {/* ════════════════════ DATE & VENUE ════════════════════ */}
      <RevealSection
        className="relative flex flex-col items-center px-6 py-24 text-center"
      >
        <SwirlDivider color={primary} />

        {weddingDate && (
          <div className="mt-10 flex flex-col items-center gap-2">
            {/* Small crescent icon */}
            <svg
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: 22, height: 22, marginBottom: 6 }}
              aria-hidden="true"
            >
              <path
                d="M18 4 A12 12 0 1 0 18 24 A8 8 0 1 1 18 4Z"
                fill={primary}
                fillOpacity={0.5}
              />
            </svg>
            <h2
              className="text-2xl tracking-[0.1em] md:text-3xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              {weddingDate}
            </h2>
          </div>
        )}

        {wedding.venue_name && (
          <div className="mt-6 flex flex-col items-center gap-1">
            <p className="text-lg tracking-wide" style={{ color: accent, fontFamily: displayFont }}>
              {wedding.venue_name}
            </p>
            {wedding.venue_address && (
              <p className="text-sm" style={{ color: primary, opacity: 0.6, fontFamily: bodyFont }}>
                {wedding.venue_address}
              </p>
            )}
          </div>
        )}

        <div className="mt-8">
          <SwirlDivider color={primary} />
        </div>
      </RevealSection>

      {/* ════════════════════ COUNTDOWN ════════════════════ */}
      {wedding.wedding_date && (
        <RevealSection className="flex flex-col items-center px-6 py-20">
          <p
            className="mb-3 text-xs uppercase tracking-[0.35em]"
            style={{ color: accent, opacity: 0.8 }}
          >
            The magic begins in
          </p>

          {/* Magical circle border containing the countdown */}
          <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            >
              <MagicCircle color={primary} />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center">
              <CountdownTimer
                targetDate={wedding.wedding_date}
                className="gap-3 md:gap-5"
                numberClassName="text-3xl md:text-4xl font-light tabular-nums"
                labelClassName="text-[10px] uppercase tracking-[0.15em] mt-1"
              />
            </div>
          </div>
        </RevealSection>
      )}

      {/* ════════════════════ OUR STORY ════════════════════ */}
      {wedding.story_text && (
        <RevealSection className="px-6 py-24">
          <div className="mx-auto max-w-2xl">
            <h2
              className="mb-10 text-center text-3xl tracking-[0.12em] md:text-4xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              Our Story
            </h2>

            {/* Storybook page border */}
            <div className="relative px-12 py-10" style={{ minHeight: 280 }}>
              <StorybookBorder color={primary} />

              {/* Drop-cap first letter */}
              <p
                className="relative z-10 whitespace-pre-line text-base leading-[1.95] md:text-lg"
                style={{ color: primary, opacity: 0.85, fontFamily: bodyFont }}
              >
                <span
                  className="float-left mr-2 text-6xl leading-none"
                  style={{ fontFamily: displayFont, color: accent }}
                >
                  {wedding.story_text.charAt(0)}
                </span>
                {wedding.story_text.slice(1)}
              </p>
            </div>
          </div>
        </RevealSection>
      )}

      {/* ════════════════════ EXPLORE LINKS ════════════════════ */}
      <RevealSection className="flex flex-col items-center px-6 py-20">
        <SwirlDivider color={primary} />

        <p
          className="my-8 text-xs uppercase tracking-[0.35em]"
          style={{ color: accent, opacity: 0.8 }}
        >
          Continue the journey
        </p>

        <div className="flex flex-wrap justify-center gap-5">
          <Link href={`/${wedding.slug}/gallery`}>
            <motion.span
              className="inline-block cursor-pointer rounded-full border px-9 py-3 text-sm uppercase tracking-[0.2em]"
              style={{
                borderColor: primary,
                color: primary,
                fontFamily: bodyFont,
                background: "transparent",
              }}
              whileHover={{
                backgroundColor: primary,
                color: secondary,
                scale: 1.04,
                boxShadow: `0 0 18px ${primary}55`,
              }}
              transition={{ duration: 0.3 }}
            >
              Gallery
            </motion.span>
          </Link>

          <Link href={`/${wedding.slug}/guestbook`}>
            <motion.span
              className="inline-block cursor-pointer rounded-full border px-9 py-3 text-sm uppercase tracking-[0.2em]"
              style={{
                borderColor: primary,
                color: primary,
                fontFamily: bodyFont,
                background: "transparent",
              }}
              whileHover={{
                backgroundColor: primary,
                color: secondary,
                scale: 1.04,
                boxShadow: `0 0 18px ${primary}55`,
              }}
              transition={{ duration: 0.3 }}
            >
              Guest Book
            </motion.span>
          </Link>
        </div>

        <div className="mt-8">
          <SwirlDivider color={primary} />
        </div>
      </RevealSection>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer
        className="flex flex-col items-center px-6 pb-16 pt-6"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <p
          className="text-xs tracking-[0.18em]"
          style={{ color: primary, opacity: 0.45, fontFamily: bodyFont }}
        >
          And they lived happily ever after
        </p>
      </footer>
    </div>
  );
}
