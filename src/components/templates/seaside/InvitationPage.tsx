"use client";

/**
 * Seaside invitation page — coastal beach wedding with layered SVG waves,
 * seashell decorations, lighthouse motifs, drifting seagull silhouettes,
 * and a sand-colored lower half evoking tide meeting shore.
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

/** Three overlapping wave layers at different opacities. */
function WaveLayers({ color }: { color: string }) {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ height: 120 }}>
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 w-full"
        preserveAspectRatio="none"
        style={{ height: 120 }}
      >
        {/* Back wave — lightest */}
        <motion.path
          d="M0 80 Q180 40 360 70 T720 60 T1080 75 T1440 55 V120 H0 Z"
          fill="#F5E6D3"
          opacity={0.4}
          animate={{ d: [
            "M0 80 Q180 40 360 70 T720 60 T1080 75 T1440 55 V120 H0 Z",
            "M0 70 Q180 50 360 60 T720 75 T1080 60 T1440 70 V120 H0 Z",
            "M0 80 Q180 40 360 70 T720 60 T1080 75 T1440 55 V120 H0 Z",
          ] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Mid wave */}
        <motion.path
          d="M0 90 Q180 60 360 80 T720 70 T1080 85 T1440 65 V120 H0 Z"
          fill="#F5E6D3"
          opacity={0.6}
          animate={{ d: [
            "M0 90 Q180 60 360 80 T720 70 T1080 85 T1440 65 V120 H0 Z",
            "M0 85 Q180 70 360 75 T720 85 T1080 70 T1440 80 V120 H0 Z",
            "M0 90 Q180 60 360 80 T720 70 T1080 85 T1440 65 V120 H0 Z",
          ] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        {/* Front wave — most opaque */}
        <motion.path
          d="M0 100 Q180 80 360 95 T720 85 T1080 100 T1440 80 V120 H0 Z"
          fill="#F5E6D3"
          opacity={0.9}
          animate={{ d: [
            "M0 100 Q180 80 360 95 T720 85 T1080 100 T1440 80 V120 H0 Z",
            "M0 95 Q180 85 360 90 T720 95 T1080 88 T1440 92 V120 H0 Z",
            "M0 100 Q180 80 360 95 T720 85 T1080 100 T1440 80 V120 H0 Z",
          ] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        {/* Wave crest line */}
        <motion.path
          d="M0 95 Q180 75 360 90 T720 80 T1080 95 T1440 75"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity={0.2}
          animate={{ d: [
            "M0 95 Q180 75 360 90 T720 80 T1080 95 T1440 75",
            "M0 90 Q180 80 360 85 T720 92 T1080 82 T1440 88",
            "M0 95 Q180 75 360 90 T720 80 T1080 95 T1440 75",
          ] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </svg>
    </div>
  );
}

/** Seashell SVG decoration. */
function Seashell({ color, className, size = 40 }: { color: string; className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: size, height: size }}
    >
      <path
        d="M24 4 C16 8 8 18 8 30 C8 38 14 44 24 44 C34 44 40 38 40 30 C40 18 32 8 24 4Z"
        fill={color}
        opacity={0.12}
      />
      <path
        d="M24 4 C24 16 24 30 24 44"
        stroke={color}
        strokeWidth="0.6"
        opacity={0.3}
      />
      <path d="M24 10 C19 16 14 24 10 32" stroke={color} strokeWidth="0.5" opacity={0.2} />
      <path d="M24 10 C29 16 34 24 38 32" stroke={color} strokeWidth="0.5" opacity={0.2} />
      <path d="M24 18 C21 22 16 28 12 34" stroke={color} strokeWidth="0.5" opacity={0.15} />
      <path d="M24 18 C27 22 32 28 36 34" stroke={color} strokeWidth="0.5" opacity={0.15} />
    </svg>
  );
}

/** Starfish SVG decoration. */
function Starfish({ color, className, size = 32 }: { color: string; className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: size, height: size }}
    >
      <path
        d="M24 2 L28 18 L44 18 L31 28 L35 44 L24 34 L13 44 L17 28 L4 18 L20 18 Z"
        fill={color}
        opacity={0.15}
        stroke={color}
        strokeWidth="0.6"
      />
      <circle cx="24" cy="22" r="2.5" fill={color} opacity={0.2} />
    </svg>
  );
}

/** Anchor motif for section accents. */
function AnchorIcon({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 40 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 28, height: 34 }}
    >
      <circle cx="20" cy="8" r="4" stroke={color} strokeWidth="1.2" fill="none" />
      <line x1="20" y1="12" x2="20" y2="42" stroke={color} strokeWidth="1.2" />
      <path d="M8 34 Q14 42 20 42 Q26 42 32 34" stroke={color} strokeWidth="1.2" fill="none" />
      <line x1="12" y1="24" x2="28" y2="24" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

/** Drifting seagull silhouette. */
function SeagullSilhouette({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 28, height: 12 }}
    >
      <path
        d="M0 12 Q8 2 16 8 Q18 10 20 8 Q22 10 24 8 Q32 2 40 12"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

/* ─── Seagulls array ───────────────────────────────────────────────────────── */

const seagulls = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${10 + i * 15}%`,
  top: `${8 + (i % 3) * 6}%`,
  scale: 0.7 + (i % 3) * 0.2,
  delay: i * 1.5,
  duration: 12 + (i % 3) * 4,
  drift: (i % 2 === 0 ? 1 : -1) * (80 + i * 20),
}));

/* ─── Animation Helpers ────────────────────────────────────────────────────── */

const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.4 },
  },
};

const heroChild = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Section that fades in when scrolled into view. */
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

export default function SeasideInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const seagullParallax = useTransform(scrollYProgress, [0, 1], [0, -40]);

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
      {/* ─── Drifting seagull silhouettes ─── */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {seagulls.map((s) => (
          <motion.div
            key={s.id}
            className="absolute"
            style={{
              left: s.left,
              top: s.top,
              scale: s.scale,
              y: seagullParallax,
            }}
            animate={{
              x: [0, s.drift, 0],
              y: [0, -10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <SeagullSilhouette color={primary} />
          </motion.div>
        ))}
      </div>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center"
        style={{
          background: `linear-gradient(180deg, ${secondary} 0%, #C8DDE6 40%, #A8C8D8 70%, ${secondary} 100%)`,
        }}
      >
        {/* Shell & starfish decorations */}
        <Seashell color={accent} className="absolute left-6 top-20 opacity-60 md:left-16" size={48} />
        <Starfish color={accent} className="absolute right-8 top-32 opacity-50 md:right-20" size={36} />
        <Seashell color={primary} className="absolute bottom-40 left-12 opacity-40 md:left-24" size={32} />
        <Starfish color={accent} className="absolute bottom-48 right-10 opacity-40 md:right-16" size={28} />

        {/* Wave layers at bottom */}
        <WaveLayers color={primary} />

        {/* Central hero content */}
        <motion.div
          className="relative z-20 flex flex-col items-center px-6 text-center"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          style={{ y: heroContentY }}
        >
          {/* Anchor motif */}
          <motion.div variants={heroChild} className="mb-6">
            <AnchorIcon color={primary} />
          </motion.div>

          <motion.p
            variants={heroChild}
            className="mb-4 text-xs uppercase tracking-[0.35em]"
            style={{ color: primary, opacity: 0.7 }}
          >
            Together with their families
          </motion.p>

          {/* Partner names */}
          <motion.h1
            variants={heroChild}
            className="text-5xl font-light tracking-[0.1em] sm:text-6xl md:text-7xl lg:text-8xl"
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
            className="text-5xl font-light tracking-[0.1em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: primary, lineHeight: 1.15 }}
          >
            {wedding.partner2_name}
          </motion.h1>

          <motion.div
            variants={heroChild}
            className="mt-8 h-px w-20"
            style={{ backgroundColor: primary, opacity: 0.4 }}
          />

          <motion.p
            variants={heroChild}
            className="mt-4 text-xs uppercase tracking-[0.25em]"
            style={{ color: primary, opacity: 0.6 }}
          >
            Request the pleasure of your company
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════════════ DATE & VENUE ═══════════════════════ */}
      <RevealSection
        className="flex flex-col items-center px-6 py-24 text-center"
        style={{ backgroundColor: "#F5E6D3" }}
      >
        <AnchorIcon color={primary} />

        {weddingDate && (
          <h2
            className="mt-8 text-2xl tracking-[0.1em] md:text-3xl"
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
      </RevealSection>

      {/* ═══════════════════════ COUNTDOWN ═══════════════════════ */}
      {wedding.wedding_date && (
        <RevealSection
          className="flex flex-col items-center px-6 py-20"
          style={{ backgroundColor: "#F5E6D3" }}
        >
          <p
            className="mb-8 text-xs uppercase tracking-[0.3em]"
            style={{ color: primary, opacity: 0.7 }}
          >
            Until we say I do
          </p>

          <div
            className="rounded-xl border px-10 py-8"
            style={{
              borderColor: `${primary}25`,
              backgroundColor: `${secondary}cc`,
              boxShadow: `0 2px 20px ${primary}08`,
            }}
          >
            <CountdownTimer
              targetDate={wedding.wedding_date}
              className="gap-4 md:gap-8"
              numberClassName="text-4xl md:text-5xl font-light tabular-nums"
              labelClassName="text-xs uppercase tracking-[0.15em] mt-2"
            />
          </div>
        </RevealSection>
      )}

      {/* ═══════════════════════ OUR STORY ═══════════════════════ */}
      {wedding.story_text && (
        <RevealSection
          className="px-6 py-24"
          style={{ backgroundColor: secondary }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <Seashell color={accent} className="mx-auto mb-4" size={36} />

            <h2
              className="mb-10 text-3xl tracking-[0.1em] md:text-4xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              Our Story
            </h2>

            <p
              className="whitespace-pre-line text-base leading-[1.9] md:text-lg"
              style={{ color: primary, opacity: 0.8 }}
            >
              <span
                className="float-left mr-2 text-5xl leading-none"
                style={{ fontFamily: displayFont, color: accent }}
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
        style={{ backgroundColor: "#F5E6D3" }}
      >
        <p
          className="mb-8 text-xs uppercase tracking-[0.3em]"
          style={{ color: primary, opacity: 0.7 }}
        >
          Explore
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/${wedding.slug}/gallery`}>
            <motion.span
              className="inline-block cursor-pointer rounded-full border px-8 py-3 text-sm uppercase tracking-[0.2em]"
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
              className="inline-block cursor-pointer rounded-full border px-8 py-3 text-sm uppercase tracking-[0.2em]"
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
      <footer
        className="relative flex flex-col items-center overflow-hidden px-6 pb-16 pt-12"
        style={{ backgroundColor: secondary }}
      >
        {/* Lighthouse silhouette */}
        <svg
          viewBox="0 0 60 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-4"
          style={{ width: 40, height: 66, opacity: 0.2 }}
        >
          <rect x="22" y="20" width="16" height="60" fill={primary} rx="2" />
          <polygon points="18,80 42,80 46,90 14,90" fill={primary} />
          <rect x="25" y="10" width="10" height="14" fill={primary} rx="1" />
          <polygon points="20,22 40,22 30,6" fill={primary} />
          {/* Light beam */}
          <motion.ellipse
            cx="30"
            cy="16"
            rx="20"
            ry="3"
            fill={accent}
            opacity={0.3}
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        <p
          className="text-xs tracking-[0.15em]"
          style={{ color: primary, opacity: 0.4 }}
        >
          Made with love by the sea
        </p>
      </footer>
    </div>
  );
}
