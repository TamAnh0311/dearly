"use client";

/**
 * Bloom invitation page — romantic floral design inspired by watercolor wedding
 * invitations. Features floating petal particles, soft blush gradients,
 * hand-painted-style SVG florals, and spring-physics scroll reveals.
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

/* ─── SVG Florals ───────────────────────────────────────────────────────────── */

/** Watercolor-style floral cluster for corners — soft circles, petals, leaves. */
function FloralCorner({
  color,
  accentColor,
  className,
}: {
  color: string;
  accentColor: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 140, height: 140 }}
    >
      {/* Large soft petal blob */}
      <motion.ellipse
        cx="40" cy="40" rx="32" ry="24"
        fill={color}
        opacity={0.18}
        transform="rotate(-25 40 40)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 80, delay: 0.4 }}
      />
      {/* Overlapping petal */}
      <motion.ellipse
        cx="55" cy="28" rx="22" ry="16"
        fill={color}
        opacity={0.14}
        transform="rotate(15 55 28)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 80, delay: 0.6 }}
      />
      {/* Small accent circle */}
      <motion.circle
        cx="70" cy="50" r="10"
        fill={color}
        opacity={0.22}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 90, delay: 0.8 }}
      />
      {/* Leaf shape 1 */}
      <motion.ellipse
        cx="30" cy="72" rx="18" ry="8"
        fill={accentColor}
        opacity={0.16}
        transform="rotate(-40 30 72)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 70, delay: 1.0 }}
      />
      {/* Leaf shape 2 */}
      <motion.ellipse
        cx="78" cy="30" rx="14" ry="6"
        fill={accentColor}
        opacity={0.13}
        transform="rotate(60 78 30)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 70, delay: 1.1 }}
      />
      {/* Tiny dot accents */}
      <motion.circle cx="22" cy="24" r="3" fill={color} opacity={0.25}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.3 }} />
      <motion.circle cx="62" cy="68" r="4" fill={color} opacity={0.15}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4 }} />
      <motion.circle cx="48" cy="56" r="2.5" fill={accentColor} opacity={0.2}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }} />
    </svg>
  );
}

/** Small leaf sprig — used flanking the date block. */
function LeafSprig({ color, flip }: { color: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: 36,
        height: 22,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      <path d="M2 20 Q12 12 20 12 Q28 12 38 4" stroke={color} strokeWidth="0.8" fill="none" />
      <ellipse cx="10" cy="14" rx="6" ry="3" fill={color} opacity={0.2} transform="rotate(-30 10 14)" />
      <ellipse cx="22" cy="10" rx="5" ry="2.5" fill={color} opacity={0.18} transform="rotate(-20 22 10)" />
      <ellipse cx="32" cy="7" rx="4" ry="2" fill={color} opacity={0.15} transform="rotate(-15 32 7)" />
    </svg>
  );
}

/** Bottom floral garland — simplified shapes spanning full width. */
function FloralGarland({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <svg
      viewBox="0 0 400 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto w-full max-w-md"
      style={{ height: 50 }}
    >
      {/* Vine line */}
      <path
        d="M0 30 Q50 10 100 25 Q150 40 200 20 Q250 0 300 25 Q350 42 400 28"
        stroke={accentColor}
        strokeWidth="0.8"
        fill="none"
        opacity={0.35}
      />
      {/* Flower clusters */}
      <circle cx="100" cy="25" r="6" fill={color} opacity={0.2} />
      <circle cx="100" cy="25" r="3" fill={color} opacity={0.3} />
      <circle cx="200" cy="20" r="7" fill={color} opacity={0.18} />
      <circle cx="200" cy="20" r="3.5" fill={color} opacity={0.28} />
      <circle cx="300" cy="25" r="5" fill={color} opacity={0.22} />
      <circle cx="300" cy="25" r="2.5" fill={color} opacity={0.32} />
      {/* Leaves */}
      <ellipse cx="65" cy="18" rx="8" ry="3" fill={accentColor} opacity={0.15} transform="rotate(-25 65 18)" />
      <ellipse cx="150" cy="32" rx="9" ry="3.5" fill={accentColor} opacity={0.13} transform="rotate(20 150 32)" />
      <ellipse cx="250" cy="12" rx="7" ry="3" fill={accentColor} opacity={0.14} transform="rotate(-15 250 12)" />
      <ellipse cx="340" cy="34" rx="8" ry="3" fill={accentColor} opacity={0.12} transform="rotate(25 340 34)" />
    </svg>
  );
}

/* ─── Petal Particles ───────────────────────────────────────────────────────── */

const petals = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${((i * 29 + 3) % 94) + 3}%`,
  size: 6 + (i % 5) * 2,
  rotation: (i * 47) % 360,
  delay: (i * 1.1) % 8,
  duration: 15 + (i % 6) * 2,
  drift: ((i % 3) - 1) * 40,
  colorIndex: i % 3, // 0 = pink, 1 = sage, 2 = white-ish
}));

function petalColor(idx: number, primary: string, accent: string): string {
  if (idx === 0) return primary;
  if (idx === 1) return accent;
  return "#f5efe6";
}

/* ─── Animation helpers ─────────────────────────────────────────────────────── */

const bloomStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.16, delayChildren: 0.25 },
  },
};

const bloomChild = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 14 },
  },
};

/** Spring-physics scroll reveal wrapper. */
function SpringSection({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.section
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 70, damping: 18 }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */

export default function BloomInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const floralParallax = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;
  const accent = theme.colors.accent;
  const displayFont = `'${theme.fonts.display}', serif`;
  const bodyFont = `'${theme.fonts.body}', sans-serif`;

  /* Sage green derived from accent for leaves — we desaturate slightly */
  const leafColor = accent;

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
      style={{ fontFamily: bodyFont }}
    >
      {/* ─── Petal shower ─── */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {petals.map((p) => (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              left: p.left,
              top: -20,
              width: p.size,
              height: p.size * 1.4,
              backgroundColor: petalColor(p.colorIndex, primary, leafColor),
              borderRadius: "50% 0 50% 0",
              transform: `rotate(${p.rotation}deg)`,
              opacity: 0.25,
            }}
            animate={{
              y: [0, typeof window !== "undefined" ? window.innerHeight + 40 : 1100],
              x: [0, p.drift],
              rotate: [p.rotation, p.rotation + 180],
              opacity: [0.25, 0.15, 0.25, 0.1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center"
        style={{
          background: `linear-gradient(180deg, ${secondary}f8 0%, ${secondary} 35%, ${primary}12 100%)`,
        }}
      >
        {/* Floral corners with parallax */}
        <motion.div className="absolute left-0 top-0" style={{ y: floralParallax }}>
          <FloralCorner color={primary} accentColor={leafColor} />
        </motion.div>
        <motion.div
          className="absolute right-0 top-0"
          style={{ y: floralParallax, transform: "scaleX(-1)" }}
        >
          <FloralCorner color={primary} accentColor={leafColor} />
        </motion.div>
        <motion.div
          className="absolute bottom-0 left-0"
          style={{ y: floralParallax, transform: "scaleY(-1)" }}
        >
          <FloralCorner color={primary} accentColor={leafColor} />
        </motion.div>
        <motion.div
          className="absolute bottom-0 right-0"
          style={{ y: floralParallax, transform: "scale(-1)" }}
        >
          <FloralCorner color={primary} accentColor={leafColor} />
        </motion.div>

        {/* Hero content */}
        <motion.div
          className="relative z-20 flex flex-col items-center px-6 text-center"
          variants={bloomStagger}
          initial="hidden"
          animate="visible"
          style={{ y: heroContentY }}
        >
          <motion.p
            variants={bloomChild}
            className="mb-6 text-xs uppercase tracking-[0.35em]"
            style={{ color: accent }}
          >
            With joy in our hearts
          </motion.p>

          <motion.h1
            variants={bloomChild}
            className="text-5xl font-light tracking-[0.08em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: primary, lineHeight: 1.15 }}
          >
            {wedding.partner1_name}
          </motion.h1>

          <motion.p
            variants={bloomChild}
            className="my-3 text-3xl italic md:my-4 md:text-4xl"
            style={{
              color: accent,
              fontFamily: displayFont,
              opacity: 0.75,
              fontStyle: "italic",
            }}
          >
            &amp;
          </motion.p>

          <motion.h1
            variants={bloomChild}
            className="text-5xl font-light tracking-[0.08em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: primary, lineHeight: 1.15 }}
          >
            {wedding.partner2_name}
          </motion.h1>

          {/* Soft divider */}
          <motion.div
            variants={bloomChild}
            className="my-8 flex items-center gap-4"
          >
            <div className="h-px w-16" style={{ backgroundColor: primary, opacity: 0.3 }} />
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: primary, opacity: 0.4 }}
            />
            <div className="h-px w-16" style={{ backgroundColor: primary, opacity: 0.3 }} />
          </motion.div>

          <motion.p
            variants={bloomChild}
            className="text-xs uppercase tracking-[0.25em]"
            style={{ color: accent }}
          >
            Invite you to celebrate their love
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════════════ DATE & VENUE ═══════════════════════ */}
      <SpringSection
        className="flex flex-col items-center px-6 py-24 text-center"
        style={{ backgroundColor: secondary }}
      >
        {weddingDate && (
          <div className="flex items-center gap-4">
            <LeafSprig color={leafColor} />
            <h2
              className="text-2xl tracking-[0.08em] md:text-3xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              {weddingDate}
            </h2>
            <LeafSprig color={leafColor} flip />
          </div>
        )}

        {wedding.venue_name && (
          <div className="mt-6 flex flex-col items-center gap-1">
            {/* Location pin */}
            <svg
              viewBox="0 0 16 20"
              fill="none"
              style={{ width: 14, height: 18, marginBottom: 4 }}
            >
              <path
                d="M8 0 C3.6 0 0 3.6 0 8 C0 14 8 20 8 20 C8 20 16 14 16 8 C16 3.6 12.4 0 8 0Z"
                fill={accent}
                opacity={0.4}
              />
              <circle cx="8" cy="8" r="3" fill={accent} opacity={0.6} />
            </svg>
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
      </SpringSection>

      {/* ═══════════════════════ COUNTDOWN ═══════════════════════ */}
      {wedding.wedding_date && (
        <SpringSection
          className="flex flex-col items-center px-6 py-20"
          style={{
            background: `linear-gradient(180deg, ${secondary} 0%, ${primary}08 100%)`,
          }}
        >
          <p
            className="mb-10 text-xs uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            Until we say I do
          </p>

          <CountdownTimer
            targetDate={wedding.wedding_date}
            className="gap-5 md:gap-8"
            numberClassName="text-3xl md:text-4xl font-light tabular-nums"
            labelClassName="text-xs uppercase tracking-[0.12em] mt-2"
          />
        </SpringSection>
      )}

      {/* ═══════════════════════ OUR STORY ═══════════════════════ */}
      {wedding.story_text && (
        <SpringSection
          className="px-6 py-24"
          style={{
            backgroundColor: secondary,
            backgroundImage: `radial-gradient(${primary}08 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        >
          <div className="mx-auto max-w-2xl text-center">
            {/* Decorative quote mark */}
            <svg
              viewBox="0 0 40 32"
              fill="none"
              className="mx-auto mb-4"
              style={{ width: 32, height: 26, opacity: 0.18 }}
            >
              <path
                d="M0 20 C0 8 6 0 18 0 L18 6 C12 6 8 10 8 16 L18 16 L18 32 L0 32 Z M22 20 C22 8 28 0 40 0 L40 6 C34 6 30 10 30 16 L40 16 L40 32 L22 32 Z"
                fill={primary}
              />
            </svg>

            <h2
              className="mb-10 text-3xl font-light tracking-[0.08em] md:text-4xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              Our Story
            </h2>

            <p
              className="whitespace-pre-line text-base leading-[1.9] md:text-lg"
              style={{ color: accent }}
            >
              {wedding.story_text}
            </p>

            {/* Closing quote */}
            <svg
              viewBox="0 0 40 32"
              fill="none"
              className="mx-auto mt-6"
              style={{ width: 24, height: 20, opacity: 0.12, transform: "rotate(180deg)" }}
            >
              <path
                d="M0 20 C0 8 6 0 18 0 L18 6 C12 6 8 10 8 16 L18 16 L18 32 L0 32 Z M22 20 C22 8 28 0 40 0 L40 6 C34 6 30 10 30 16 L40 16 L40 32 L22 32 Z"
                fill={primary}
              />
            </svg>
          </div>
        </SpringSection>
      )}

      {/* ═══════════════════════ EXPLORE LINKS ═══════════════════════ */}
      <SpringSection
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
              className="inline-block cursor-pointer rounded-full px-8 py-3 text-sm uppercase tracking-[0.18em]"
              style={{
                background: `linear-gradient(135deg, ${primary}cc, ${primary})`,
                color: secondary,
                fontFamily: bodyFont,
              }}
              whileHover={{ scale: 1.05, boxShadow: `0 4px 20px ${primary}40` }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Gallery
            </motion.span>
          </Link>

          <Link href={`/${wedding.slug}/guestbook`}>
            <motion.span
              className="inline-block cursor-pointer rounded-full px-8 py-3 text-sm uppercase tracking-[0.18em]"
              style={{
                background: `linear-gradient(135deg, ${primary}cc, ${primary})`,
                color: secondary,
                fontFamily: bodyFont,
              }}
              whileHover={{ scale: 1.05, boxShadow: `0 4px 20px ${primary}40` }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Guest Book
            </motion.span>
          </Link>
        </div>
      </SpringSection>

      {/* ═══════════════════════ FOOTER GARLAND ═══════════════════════ */}
      <footer
        className="flex flex-col items-center px-6 pb-16 pt-8"
        style={{ backgroundColor: secondary }}
      >
        <FloralGarland color={primary} accentColor={leafColor} />
        <p
          className="mt-6 text-xs tracking-[0.15em]"
          style={{ color: accent, opacity: 0.45 }}
        >
          Made with love
        </p>
      </footer>
    </div>
  );
}
