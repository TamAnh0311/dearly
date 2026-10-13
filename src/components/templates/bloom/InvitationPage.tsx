"use client";

/**
 * Bloom invitation page — romantic watercolor floral wedding design.
 * Features soft blush gradient backgrounds, SVG floral corner decorations,
 * 18 continuously falling petal particles, bloom scale-in name reveals,
 * circular countdown elements, vine/leaf dividers, and a floral garland footer.
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

/** Watercolor-style floral cluster for corners — soft petals, leaves with opacity. */
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
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: 150, height: 150 }}
    >
      {/* Large soft petal blob */}
      <motion.ellipse
        cx="42" cy="42" rx="36" ry="26"
        fill={color}
        opacity={0.16}
        transform="rotate(-25 42 42)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 70, delay: 0.3 }}
      />
      {/* Overlapping petal */}
      <motion.ellipse
        cx="60" cy="30" rx="24" ry="18"
        fill={color}
        opacity={0.12}
        transform="rotate(18 60 30)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 70, delay: 0.5 }}
      />
      {/* Small bloom circle */}
      <motion.circle
        cx="76" cy="52" r="12"
        fill={color}
        opacity={0.18}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 80, delay: 0.7 }}
      />
      {/* Second bloom */}
      <motion.circle
        cx="34" cy="70" r="9"
        fill={color}
        opacity={0.14}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 80, delay: 0.9 }}
      />
      {/* Leaf shapes in sage */}
      <motion.ellipse
        cx="28" cy="80" rx="20" ry="8"
        fill={accentColor}
        opacity={0.14}
        transform="rotate(-40 28 80)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 60, delay: 1.0 }}
      />
      <motion.ellipse
        cx="86" cy="32" rx="16" ry="6"
        fill={accentColor}
        opacity={0.11}
        transform="rotate(55 86 32)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 60, delay: 1.1 }}
      />
      <motion.ellipse
        cx="62" cy="76" rx="14" ry="5"
        fill={accentColor}
        opacity={0.10}
        transform="rotate(-20 62 76)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 60, delay: 1.2 }}
      />
      {/* Tiny dot accents — pollen effect */}
      <motion.circle cx="20" cy="26" r="3" fill={color} opacity={0.22}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.3 }} />
      <motion.circle cx="68" cy="68" r="4" fill={color} opacity={0.13}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4 }} />
      <motion.circle cx="50" cy="58" r="2.5" fill={accentColor} opacity={0.18}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }} />
      <motion.circle cx="90" cy="56" r="2" fill={color} opacity={0.16}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6 }} />
    </svg>
  );
}

/** Vine-and-leaf horizontal divider with organic curves. */
function VineDivider({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <svg
      viewBox="0 0 320 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
      style={{ width: 280, height: 32 }}
    >
      {/* Central vine */}
      <path
        d="M0 16 Q40 4 80 16 Q120 28 160 14 Q200 0 240 16 Q280 28 320 16"
        stroke={accentColor}
        strokeWidth="0.7"
        fill="none"
        opacity={0.35}
      />
      {/* Leaves along vine */}
      <ellipse cx="60" cy="10" rx="8" ry="3.5" fill={accentColor} opacity={0.15} transform="rotate(-30 60 10)" />
      <ellipse cx="120" cy="24" rx="9" ry="3.5" fill={accentColor} opacity={0.13} transform="rotate(25 120 24)" />
      <ellipse cx="200" cy="6" rx="7" ry="3" fill={accentColor} opacity={0.14} transform="rotate(-20 200 6)" />
      <ellipse cx="260" cy="22" rx="8" ry="3" fill={accentColor} opacity={0.12} transform="rotate(20 260 22)" />
      {/* Bloom dots */}
      <circle cx="80" cy="16" r="4" fill={color} opacity={0.18} />
      <circle cx="160" cy="14" r="5" fill={color} opacity={0.16} />
      <circle cx="240" cy="16" r="4" fill={color} opacity={0.18} />
      <circle cx="160" cy="14" r="2.5" fill={color} opacity={0.28} />
    </svg>
  );
}

/** Leaf sprig flanking the date. */
function LeafSprig({ color, flip }: { color: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: 38,
        height: 24,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      <path d="M2 22 Q12 14 22 14 Q32 14 42 4" stroke={color} strokeWidth="0.8" fill="none" />
      <ellipse cx="10" cy="16" rx="6" ry="3" fill={color} opacity={0.18} transform="rotate(-30 10 16)" />
      <ellipse cx="22" cy="12" rx="5" ry="2.5" fill={color} opacity={0.15} transform="rotate(-15 22 12)" />
      <ellipse cx="34" cy="8" rx="4.5" ry="2" fill={color} opacity={0.12} transform="rotate(-10 34 8)" />
    </svg>
  );
}

/** Bottom floral garland spanning full width. */
function FloralGarland({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <svg
      viewBox="0 0 440 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto w-full max-w-lg"
      style={{ height: 56 }}
    >
      {/* Main vine curve */}
      <path
        d="M0 34 Q55 8 110 28 Q165 48 220 22 Q275 -2 330 28 Q385 50 440 32"
        stroke={accentColor}
        strokeWidth="0.8"
        fill="none"
        opacity={0.3}
      />
      {/* Flowers */}
      <circle cx="110" cy="28" r="7" fill={color} opacity={0.18} />
      <circle cx="110" cy="28" r="3.5" fill={color} opacity={0.28} />
      <circle cx="220" cy="22" r="8" fill={color} opacity={0.16} />
      <circle cx="220" cy="22" r="4" fill={color} opacity={0.26} />
      <circle cx="330" cy="28" r="6" fill={color} opacity={0.2} />
      <circle cx="330" cy="28" r="3" fill={color} opacity={0.3} />
      {/* Scattered leaves */}
      <ellipse cx="60" cy="20" rx="9" ry="3.5" fill={accentColor} opacity={0.14} transform="rotate(-22 60 20)" />
      <ellipse cx="165" cy="38" rx="10" ry="4" fill={accentColor} opacity={0.12} transform="rotate(18 165 38)" />
      <ellipse cx="275" cy="12" rx="8" ry="3" fill={accentColor} opacity={0.13} transform="rotate(-18 275 12)" />
      <ellipse cx="380" cy="40" rx="9" ry="3.5" fill={accentColor} opacity={0.11} transform="rotate(22 380 40)" />
      {/* Tiny pollen dots */}
      <circle cx="50" cy="30" r="2" fill={color} opacity={0.15} />
      <circle cx="180" cy="16" r="1.5" fill={color} opacity={0.18} />
      <circle cx="300" cy="36" r="2" fill={color} opacity={0.14} />
      <circle cx="400" cy="26" r="1.5" fill={color} opacity={0.16} />
    </svg>
  );
}

/* ─── Petal Particles ─────────────────────────────────────────────────────── */

const petals = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${((i * 29 + 5) % 92) + 4}%`,
  size: 6 + (i % 5) * 2,
  rotation: (i * 47) % 360,
  delay: (i * 1.2) % 10,
  duration: 15 + (i % 6) * 2,
  drift: ((i % 3) - 1) * 45,
  colorIndex: i % 3,
}));

/** Returns petal color: 0=pink/primary, 1=sage/accent, 2=cream. */
function petalColor(idx: number, primary: string, accent: string): string {
  if (idx === 0) return primary;
  if (idx === 1) return accent;
  return "#f5efe6";
}

/* ─── Animation Helpers ───────────────────────────────────────────────────── */

const bloomStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
};

const bloomChild = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 90, damping: 14 },
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
      transition={{ type: "spring", stiffness: 65, damping: 18 }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */

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
  const floralParallax = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const petalParallax = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;
  const accent = theme.colors.accent;
  const displayFont = `'${theme.fonts.display}', serif`;
  const bodyFont = `'${theme.fonts.body}', sans-serif`;
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
      {/* ─── Falling petal shower (18 petals, CSS ovals at angles) ─── */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
        style={{ y: petalParallax }}
      >
        {petals.map((p) => (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              left: p.left,
              top: -24,
              width: p.size,
              height: p.size * 1.5,
              backgroundColor: petalColor(p.colorIndex, primary, leafColor),
              borderRadius: "50% 0 50% 0",
              transform: `rotate(${p.rotation}deg)`,
              opacity: 0.22,
            }}
            animate={{
              y: [0, typeof window !== "undefined" ? window.innerHeight + 60 : 1200],
              x: [0, p.drift],
              rotate: [p.rotation, p.rotation + 200],
              opacity: [0.22, 0.14, 0.22, 0.08],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </motion.div>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center"
        style={{
          background: `linear-gradient(180deg, ${secondary}f8 0%, ${secondary} 30%, ${primary}0a 70%, ${secondary}f4 100%)`,
        }}
      >
        {/* Floral corner decorations with parallax */}
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

        {/* Soft radial blush glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 45%, ${primary}0c, transparent 60%)` }}
        />

        {/* Hero content with bloom-in stagger */}
        <motion.div
          className="relative z-20 flex flex-col items-center px-6 text-center"
          variants={bloomStagger}
          initial="hidden"
          animate="visible"
          style={{ y: heroContentY }}
        >
          <motion.p
            variants={bloomChild}
            className="mb-8 text-xs uppercase tracking-[0.4em]"
            style={{ color: accent }}
          >
            With joy in our hearts
          </motion.p>

          {/* Partner 1 — bloom scale entrance */}
          <motion.h1
            variants={bloomChild}
            className="text-5xl font-light tracking-[0.08em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: primary, lineHeight: 1.1 }}
          >
            {wedding.partner1_name}
          </motion.h1>

          {/* Soft ampersand */}
          <motion.p
            variants={bloomChild}
            className="my-4 text-3xl italic md:my-5 md:text-4xl"
            style={{ color: accent, fontFamily: displayFont, opacity: 0.7 }}
          >
            &amp;
          </motion.p>

          {/* Partner 2 — bloom scale entrance */}
          <motion.h1
            variants={bloomChild}
            className="text-5xl font-light tracking-[0.08em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: displayFont, color: primary, lineHeight: 1.1 }}
          >
            {wedding.partner2_name}
          </motion.h1>

          {/* Soft dot-line-dot divider */}
          <motion.div
            variants={bloomChild}
            className="my-9 flex items-center gap-4"
          >
            <div className="h-px w-16 md:w-20" style={{ backgroundColor: primary, opacity: 0.25 }} />
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: primary, opacity: 0.35 }} />
            <div className="h-px w-16 md:w-20" style={{ backgroundColor: primary, opacity: 0.25 }} />
          </motion.div>

          <motion.p
            variants={bloomChild}
            className="text-[10px] uppercase tracking-[0.3em] md:text-xs"
            style={{ color: accent }}
          >
            Invite you to celebrate their love
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════════════ DATE & VENUE ═══════════════════════ */}
      <SpringSection
        className="flex flex-col items-center px-6 py-28 text-center"
        style={{ backgroundColor: secondary }}
      >
        <VineDivider color={primary} accentColor={leafColor} />

        {weddingDate && (
          <div className="mt-10 flex items-center gap-4">
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
          <div className="mt-8 flex flex-col items-center gap-2">
            {/* Location pin SVG */}
            <svg viewBox="0 0 16 20" fill="none" style={{ width: 14, height: 18, marginBottom: 4 }}>
              <path
                d="M8 0 C3.6 0 0 3.6 0 8 C0 14 8 20 8 20 C8 20 16 14 16 8 C16 3.6 12.4 0 8 0Z"
                fill={accent}
                opacity={0.35}
              />
              <circle cx="8" cy="8" r="3" fill={accent} opacity={0.55} />
            </svg>
            <p className="text-lg" style={{ color: accent, fontFamily: bodyFont }}>
              {wedding.venue_name}
            </p>
            {wedding.venue_address && (
              <p className="text-sm" style={{ color: accent, opacity: 0.5 }}>
                {wedding.venue_address}
              </p>
            )}
          </div>
        )}

        <div className="mt-10">
          <VineDivider color={primary} accentColor={leafColor} />
        </div>
      </SpringSection>

      {/* ═══════════════════════ COUNTDOWN ═══════════════════════ */}
      {wedding.wedding_date && (
        <SpringSection
          className="flex flex-col items-center px-6 py-24"
          style={{
            background: `linear-gradient(180deg, ${secondary} 0%, ${primary}06 50%, ${secondary} 100%)`,
          }}
        >
          <p
            className="mb-12 text-[10px] uppercase tracking-[0.35em] md:text-xs"
            style={{ color: accent }}
          >
            Until we say I do
          </p>

          {/* Circular countdown elements */}
          <CountdownTimer
            targetDate={wedding.wedding_date}
            className="gap-5 md:gap-8"
            numberClassName="text-3xl md:text-4xl font-light tabular-nums"
            labelClassName="text-[10px] uppercase tracking-[0.14em] mt-2"
          />
        </SpringSection>
      )}

      {/* ═══════════════════════ OUR STORY ═══════════════════════ */}
      {wedding.story_text && (
        <SpringSection
          className="px-6 py-28"
          style={{
            backgroundColor: secondary,
            backgroundImage: `radial-gradient(${primary}06 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        >
          <div className="mx-auto max-w-2xl text-center">
            {/* Decorative opening quote */}
            <svg
              viewBox="0 0 44 36"
              fill="none"
              className="mx-auto mb-5"
              style={{ width: 34, height: 28, opacity: 0.15 }}
            >
              <path
                d="M0 22 C0 10 6 0 18 0 L18 6 C12 6 8 10 8 16 L18 16 L18 34 L0 34 Z M24 22 C24 10 30 0 42 0 L42 6 C36 6 32 10 32 16 L42 16 L42 34 L24 34 Z"
                fill={primary}
              />
            </svg>

            <h2
              className="mb-12 text-3xl font-light tracking-[0.08em] md:text-4xl"
              style={{ fontFamily: displayFont, color: primary }}
            >
              Our Story
            </h2>

            <p
              className="whitespace-pre-line text-base leading-[2] md:text-lg"
              style={{ color: accent }}
            >
              {wedding.story_text}
            </p>

            {/* Closing quote */}
            <svg
              viewBox="0 0 44 36"
              fill="none"
              className="mx-auto mt-8"
              style={{ width: 26, height: 22, opacity: 0.1, transform: "rotate(180deg)" }}
            >
              <path
                d="M0 22 C0 10 6 0 18 0 L18 6 C12 6 8 10 8 16 L18 16 L18 34 L0 34 Z M24 22 C24 10 30 0 42 0 L42 6 C36 6 32 10 32 16 L42 16 L42 34 L24 34 Z"
                fill={primary}
              />
            </svg>
          </div>
        </SpringSection>
      )}

      {/* ═══════════════════════ EXPLORE LINKS ═══════════════════════ */}
      <SpringSection
        className="flex flex-col items-center px-6 py-24"
        style={{ backgroundColor: secondary }}
      >
        <p
          className="mb-10 text-[10px] uppercase tracking-[0.35em] md:text-xs"
          style={{ color: accent }}
        >
          Explore
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/${wedding.slug}/gallery`}>
            <motion.span
              className="inline-block cursor-pointer rounded-full px-9 py-3.5 text-xs uppercase tracking-[0.2em]"
              style={{
                background: `linear-gradient(135deg, ${primary}cc, ${primary})`,
                color: secondary,
                fontFamily: bodyFont,
              }}
              whileHover={{ scale: 1.06, boxShadow: `0 6px 24px ${primary}35` }}
              transition={{ type: "spring", stiffness: 280 }}
            >
              Gallery
            </motion.span>
          </Link>

          <Link href={`/${wedding.slug}/guestbook`}>
            <motion.span
              className="inline-block cursor-pointer rounded-full px-9 py-3.5 text-xs uppercase tracking-[0.2em]"
              style={{
                background: `linear-gradient(135deg, ${primary}cc, ${primary})`,
                color: secondary,
                fontFamily: bodyFont,
              }}
              whileHover={{ scale: 1.06, boxShadow: `0 6px 24px ${primary}35` }}
              transition={{ type: "spring", stiffness: 280 }}
            >
              Guest Book
            </motion.span>
          </Link>
        </div>
      </SpringSection>

      {/* ═══════════════════════ FOOTER GARLAND ═══════════════════════ */}
      <footer
        className="flex flex-col items-center px-6 pb-20 pt-10"
        style={{ backgroundColor: secondary }}
      >
        <FloralGarland color={primary} accentColor={leafColor} />

        <motion.p
          className="mt-8 text-[10px] tracking-[0.18em]"
          style={{ color: accent, opacity: 0.4 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Made with love
        </motion.p>
      </footer>
    </div>
  );
}
