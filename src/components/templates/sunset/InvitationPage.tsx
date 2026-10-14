"use client";

/**
 * Sunset invitation page — beach destination wedding with multi-stop
 * gradient sky, animated SVG waves, pulsing CSS sun, swaying palm fronds,
 * frosted glass panels, and warm coral typography.
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

/* ── animation variants ────────────────────────────────────────────── */

/** Stagger container for hero content. */
const riseContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
};

/** Single item rising up with spring bounce. */
const riseItem = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
  },
};


/* ── SVG wave morph paths ──────────────────────────────────────────── */

const WAVE_A =
  "M0,45 C180,90 360,10 540,50 C720,90 900,15 1080,45 C1260,75 1380,25 1440,45 L1440,100 L0,100 Z";
const WAVE_B =
  "M0,55 C180,20 360,80 540,35 C720,5 900,70 1080,40 C1260,15 1380,65 1440,55 L1440,100 L0,100 Z";
const WAVE_C =
  "M0,40 C180,70 360,25 540,60 C720,30 900,55 1080,35 C1260,60 1380,40 1440,50 L1440,100 L0,100 Z";

/* ── CSS keyframes ─────────────────────────────────────────────────── */

const keyframes = `
@keyframes sunsetShift {
  0%   { filter: hue-rotate(0deg); }
  25%  { filter: hue-rotate(8deg); }
  50%  { filter: hue-rotate(-5deg); }
  75%  { filter: hue-rotate(10deg); }
  100% { filter: hue-rotate(0deg); }
}
@keyframes nameGlow {
  0%   { text-shadow: 0 2px 20px rgba(255,255,255,0.15); }
  50%  { text-shadow: 0 2px 40px rgba(255,228,196,0.55), 0 0 60px rgba(224,122,95,0.3); }
  100% { text-shadow: 0 2px 20px rgba(255,255,255,0.15); }
}
@keyframes shimmerWater {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

/* ── Palm Frond SVG ────────────────────────────────────────────────── */

/** Detailed palm frond silhouette with swaying animation. */
function PalmFrond({
  side,
  color,
  size = 130,
  topOffset = 20,
}: {
  side: "left" | "right";
  color: string;
  size?: number;
  topOffset?: number;
}) {
  const flip = side === "right";
  return (
    <motion.svg
      viewBox="0 0 140 260"
      className="pointer-events-none absolute"
      style={{
        width: size,
        opacity: 0.14,
        ...(flip
          ? { top: topOffset, right: 0, transformOrigin: "top right" }
          : { top: topOffset, left: 0, transformOrigin: "top left" }),
      }}
      animate={{
        rotate: flip ? [3, -3, 3] : [-3, 3, -3],
        scale: [1, 1.02, 1],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <g transform={flip ? "translate(140,0) scale(-1,1)" : ""}>
        <path
          d="M70,260 Q65,180 35,120 Q15,70 5,30 Q20,55 40,75 Q55,90 60,110 Q55,80 42,50 Q35,30 38,10 Q48,40 60,70 Q62,50 60,15 Q68,40 68,75 Q72,45 82,25 Q78,55 70,90 Q88,60 105,40 Q95,70 75,105 Q68,120 65,145 Z"
          fill={color}
        />
        {/* Second frond layer for depth */}
        <path
          d="M70,260 Q72,200 55,150 Q40,110 30,70 Q45,95 58,115 Q60,100 50,70 Q44,50 48,30 Q55,55 62,85 Q65,60 62,30 Q70,50 70,80 Q75,55 85,40 Q80,65 72,95 Q90,75 100,55 Q92,80 74,110 Z"
          fill={color}
          opacity="0.5"
        />
      </g>
    </motion.svg>
  );
}

/* ── Section wave divider ──────────────────────────────────────────── */

/** Thin decorative wave separator between sections. */
function WaveDivider({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 50"
      preserveAspectRatio="none"
      className={`block h-6 w-full ${flip ? "rotate-180" : ""}`}
    >
      <path
        d="M0,25 C240,50 480,0 720,25 C960,50 1200,0 1440,25 L1440,50 L0,50 Z"
        fill={color}
        opacity="0.12"
      />
    </svg>
  );
}

/* ── Ornamental sun divider ────────────────────────────────────────── */

/** Small decorative sun circle used as a section separator. */
function SunDivider({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <div className="h-px w-16 md:w-24" style={{ backgroundColor: color, opacity: 0.25 }} />
      <div
        className="h-4 w-4 rounded-full"
        style={{
          background: `radial-gradient(circle, #FFD6A5, ${color})`,
          boxShadow: `0 0 10px ${color}60`,
        }}
      />
      <div className="h-px w-16 md:w-24" style={{ backgroundColor: color, opacity: 0.25 }} />
    </div>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function SunsetInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-80px" });
  const navInView = useInView(navRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  /* Parallax transforms */
  const sunY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;
  const accent = theme.colors.accent;
  const displayFont = `'${theme.fonts.display}', 'Libre Baskerville', serif`;
  const bodyFont = `'${theme.fonts.body}', sans-serif`;

  const weddingDate = wedding.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const offWhite = "#FFF8F0";

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{ fontFamily: bodyFont }}
    >
      {/* Inject CSS keyframes */}
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
        style={{
          background: `linear-gradient(180deg,
            #FFE8D0 0%,
            #FFDAB5 15%,
            #F2CC8F 30%,
            #E8A87C 45%,
            #E07A5F 60%,
            #C1666B 75%,
            #D4A373 90%,
            #DEB887 100%
          )`,
          animation: "sunsetShift 30s ease-in-out infinite",
        }}
      >
        {/* Palm frond silhouettes */}
        <PalmFrond side="left" color={secondary} size={140} topOffset={10} />
        <PalmFrond side="right" color={secondary} size={120} topOffset={30} />
        {/* Smaller secondary fronds */}
        <PalmFrond side="left" color={secondary} size={80} topOffset={120} />
        <PalmFrond side="right" color={secondary} size={90} topOffset={140} />

        {/* Sun element with parallax and pulse */}
        <motion.div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{ top: "10%", y: sunY }}
        >
          <motion.div
            className="rounded-full"
            style={{
              width: 160,
              height: 160,
              background:
                "radial-gradient(circle, #FFE4B5 0%, #FFD6A5 30%, #F4A261 60%, #E07A5F 100%)",
              boxShadow:
                "0 0 80px 30px rgba(244,162,97,0.45), 0 0 150px 60px rgba(224,122,95,0.2)",
            }}
            animate={{
              scale: [1, 1.06, 1],
              boxShadow: [
                "0 0 80px 30px rgba(244,162,97,0.45), 0 0 150px 60px rgba(224,122,95,0.2)",
                "0 0 100px 40px rgba(244,162,97,0.6), 0 0 180px 70px rgba(224,122,95,0.3)",
                "0 0 80px 30px rgba(244,162,97,0.45), 0 0 150px 60px rgba(224,122,95,0.2)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Inner bright core */}
          <div
            className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
            }}
          />
        </motion.div>

        {/* Thin golden accent lines at top and bottom */}
        <div
          className="pointer-events-none absolute left-6 right-6 top-8 h-px opacity-20 md:left-12 md:right-12"
          style={{ backgroundColor: "#FFD6A5" }}
        />
        <div
          className="pointer-events-none absolute bottom-28 left-6 right-6 h-px opacity-10 md:left-12 md:right-12"
          style={{ backgroundColor: "#FFD6A5" }}
        />

        {/* Content with stagger animation */}
        <motion.div
          variants={riseContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center"
          style={{ y: contentY }}
        >
          <motion.p
            variants={riseItem}
            className="mb-8 text-xs uppercase tracking-[0.5em]"
            style={{ color: secondary, opacity: 0.85 }}
          >
            Together with their families
          </motion.p>

          {/* Partner 1 */}
          <motion.h1
            variants={riseItem}
            className="mb-1 text-5xl sm:text-6xl md:text-8xl"
            style={{
              fontFamily: displayFont,
              color: secondary,
              animation: "nameGlow 4s ease-in-out infinite",
            }}
          >
            {wedding.partner1_name}
          </motion.h1>

          {/* Ampersand with decorative lines */}
          <motion.div
            variants={riseItem}
            className="my-5 flex items-center gap-5"
          >
            <motion.div
              className="h-px w-16 md:w-28"
              style={{ backgroundColor: secondary, opacity: 0.45 }}
              animate={{ scaleX: [1, 1.3, 1] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span
              className="text-3xl italic"
              style={{ fontFamily: displayFont, color: "#FFE4B5" }}
            >
              &amp;
            </span>
            <motion.div
              className="h-px w-16 md:w-28"
              style={{ backgroundColor: secondary, opacity: 0.45 }}
              animate={{ scaleX: [1, 1.3, 1] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.75,
              }}
            />
          </motion.div>

          {/* Partner 2 */}
          <motion.h1
            variants={riseItem}
            className="mb-10 text-5xl sm:text-6xl md:text-8xl"
            style={{
              fontFamily: displayFont,
              color: secondary,
              animation: "nameGlow 4s ease-in-out infinite 0.6s",
            }}
          >
            {wedding.partner2_name}
          </motion.h1>

          {/* Frosted glass panel — date & venue */}
          {(weddingDate || wedding.venue_name) && (
            <motion.div
              variants={riseItem}
              className="mt-2 rounded-2xl px-10 py-7 text-center md:px-14"
              style={{
                background: "rgba(255,255,255,0.14)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.22)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              }}
            >
              {weddingDate && (
                <p
                  className="text-sm tracking-widest md:text-base"
                  style={{ color: secondary, fontFamily: displayFont }}
                >
                  {weddingDate}
                </p>
              )}
              {wedding.venue_name && (
                <p
                  className="mt-2 text-xs tracking-wide opacity-75 md:text-sm"
                  style={{ color: secondary }}
                >
                  {wedding.venue_name}
                </p>
              )}
            </motion.div>
          )}

          {/* Countdown */}
          {wedding.wedding_date && (
            <motion.div variants={riseItem} className="mt-14">
              <CountdownTimer
                targetDate={wedding.wedding_date}
                className="[&>div>span:first-child]:rounded-xl [&>div>span:first-child]:px-3 [&>div>span:first-child]:py-1"
                numberClassName="text-white"
                labelClassName="text-white/70"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Animated wave divider at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 100"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="block h-20 w-full md:h-28"
          >
            {/* Back wave — slower, lighter */}
            <motion.path
              d={WAVE_C}
              fill={offWhite}
              opacity={0.5}
              animate={{ d: [WAVE_C, WAVE_A, WAVE_C] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Front wave */}
            <motion.path
              d={WAVE_A}
              fill={offWhite}
              animate={{ d: [WAVE_A, WAVE_B, WAVE_A] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════ STORY ═══════════════ */}
      {wedding.story_text && (
        <section style={{ backgroundColor: offWhite }}>
          <WaveDivider color={primary} flip />

          <motion.div
            ref={storyRef}
            className="mx-auto max-w-2xl px-6 pb-24 pt-12 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <SunDivider color="#E07A5F" />

            <h2
              className="mb-2 text-3xl md:text-4xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              Our Story
            </h2>
            <div
              className="mx-auto mb-8 h-px w-20"
              style={{ backgroundColor: accent, opacity: 0.45 }}
            />
            <p
              className="whitespace-pre-line text-base leading-relaxed md:text-lg"
              style={{ color: primary, opacity: 0.7 }}
            >
              {wedding.story_text}
            </p>

            <SunDivider color="#E07A5F" />
          </motion.div>
        </section>
      )}

      {/* ═══════════════ NAVIGATION ═══════════════ */}
      <motion.section
        ref={navRef}
        className="flex flex-col items-center px-6 py-20"
        style={{ backgroundColor: offWhite }}
        initial={{ opacity: 0, y: 40 }}
        animate={navInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <p
          className="mb-8 text-xs uppercase tracking-[0.4em]"
          style={{ color: accent, opacity: 0.65 }}
        >
          Explore
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { href: `/${wedding.slug}/gallery`, label: "Gallery" },
            { href: `/${wedding.slug}/guestbook`, label: "Guest Book" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}>
              <motion.span
                className="inline-block cursor-pointer rounded-full px-10 py-3 text-sm uppercase tracking-[0.2em]"
                style={{
                  backgroundColor: "#E07A5F",
                  color: secondary,
                  fontFamily: bodyFont,
                  boxShadow: "0 4px 16px rgba(224,122,95,0.25)",
                }}
                whileHover={{
                  backgroundColor: "#C1666B",
                  scale: 1.05,
                  boxShadow: "0 6px 24px rgba(224,122,95,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                {label}
              </motion.span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════ FOOTER DECORATION ═══════════════ */}
      <footer
        className="relative flex flex-col items-center pb-14 pt-4"
        style={{ backgroundColor: offWhite }}
      >
        {/* Mirrored decorative wave */}
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="mb-8 block h-10 w-full rotate-180"
        >
          <path
            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
            fill="#E07A5F"
            opacity="0.12"
          />
          <path
            d="M0,40 C360,55 720,15 1080,40 C1260,50 1380,25 1440,40 L1440,60 L0,60 Z"
            fill="#E07A5F"
            opacity="0.06"
          />
        </svg>

        {/* Small sun icon */}
        <motion.div
          className="mb-4 h-6 w-6 rounded-full"
          style={{
            background: "radial-gradient(circle, #FFE4B5, #E07A5F)",
            boxShadow: "0 0 14px rgba(244,162,97,0.4)",
          }}
          animate={{
            boxShadow: [
              "0 0 14px rgba(244,162,97,0.4)",
              "0 0 22px rgba(244,162,97,0.6)",
              "0 0 14px rgba(244,162,97,0.4)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <p
          className="text-xs tracking-widest opacity-35"
          style={{ color: primary }}
        >
          Made with love
        </p>
      </footer>
    </div>
  );
}
