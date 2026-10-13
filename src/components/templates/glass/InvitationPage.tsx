"use client";

/**
 * Glass invitation page — glassmorphism aesthetic with animated gradient mesh
 * background (colorful blobs on 20-30s CSS animation), frosted glass hero card
 * with 3D mouse-tracked tilt, floating glass orbs at multiple depths, individual
 * glass countdown cards, clean Sora font, and glass pill navigation buttons.
 */

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/* ─── Gradient Mesh CSS Keyframes ─────────────────────────────────────────── */

const meshKeyframes = `
@keyframes blob1 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  25% { transform: translate(10%, -15%) scale(1.1); }
  50% { transform: translate(-5%, 10%) scale(0.95); }
  75% { transform: translate(15%, 5%) scale(1.05); }
}
@keyframes blob2 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  25% { transform: translate(-12%, 8%) scale(1.08); }
  50% { transform: translate(8%, -12%) scale(0.92); }
  75% { transform: translate(-8%, -5%) scale(1.12); }
}
@keyframes blob3 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  33% { transform: translate(12%, 10%) scale(1.15); }
  66% { transform: translate(-10%, -8%) scale(0.9); }
}
@keyframes blob4 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  20% { transform: translate(-8%, 12%) scale(1.1); }
  40% { transform: translate(14%, -6%) scale(0.95); }
  60% { transform: translate(-4%, -14%) scale(1.08); }
  80% { transform: translate(10%, 8%) scale(0.92); }
}
`;

/* ─── Mesh Blob Data ──────────────────────────────────────────────────────── */

interface MeshBlob {
  color: string;
  width: number;
  height: number;
  top: string;
  left: string;
  animation: string;
  blur: number;
}

function getMeshBlobs(primary: string, accent: string): MeshBlob[] {
  return [
    { color: primary, width: 600, height: 600, top: "-10%", left: "-10%", animation: "blob1 24s ease-in-out infinite", blur: 80 },
    { color: accent, width: 500, height: 500, top: "50%", left: "60%", animation: "blob2 28s ease-in-out infinite", blur: 90 },
    { color: "#6C63FF", width: 450, height: 450, top: "20%", left: "30%", animation: "blob3 22s ease-in-out infinite", blur: 100 },
    { color: "#FF6B9D", width: 400, height: 400, top: "70%", left: "10%", animation: "blob4 26s ease-in-out infinite", blur: 85 },
  ];
}

/* ─── Floating Glass Orbs ─────────────────────────────────────────────────── */

interface GlassOrb {
  size: number;
  top: string;
  left: string;
  depth: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
}

const glassOrbs: GlassOrb[] = [
  { size: 80, top: "15%", left: "8%", depth: 0.3, driftX: 30, driftY: -20, duration: 12, delay: 0 },
  { size: 50, top: "60%", left: "85%", depth: 0.6, driftX: -25, driftY: 15, duration: 14, delay: 1 },
  { size: 120, top: "75%", left: "20%", depth: 0.2, driftX: 20, driftY: -30, duration: 18, delay: 2 },
  { size: 35, top: "25%", left: "78%", depth: 0.8, driftX: -15, driftY: 25, duration: 10, delay: 0.5 },
  { size: 60, top: "45%", left: "5%", depth: 0.5, driftX: 35, driftY: -10, duration: 16, delay: 1.5 },
  { size: 45, top: "10%", left: "55%", depth: 0.7, driftX: -20, driftY: -25, duration: 11, delay: 3 },
];

/* ─── 3D Tilt Glass Card ──────────────────────────────────────────────────── */

/** Frosted glass card with mouse-tracked 3D tilt up to 5deg. */
function TiltGlassCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-200, 200], [5, -5]), { stiffness: 180, damping: 25 });
  const rotateY = useSpring(useTransform(mx, [-200, 200], [-5, 5]), { stiffness: 180, damping: 25 });

  /** Compute pointer offset from card center for tilt effect. */
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  }

  /** Reset tilt to zero when pointer leaves. */
  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        backgroundColor: "rgba(255,255,255,0.10)",
        border: "1px solid rgba(255,255,255,0.20)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)",
      }}
      className="w-full max-w-md rounded-3xl p-10 text-center md:p-14"
      initial={{ opacity: 0, y: 70, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section Reveal Helper ───────────────────────────────────────────────── */

/** Scroll-triggered reveal with blur transition. */
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

export default function GlassInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const primary = theme.colors.primary;
  const accent = theme.colors.accent;
  const displayFont = `'${theme.fonts.display}', sans-serif`;
  const bodyFont = `'${theme.fonts.body}', sans-serif`;
  const meshBlobs = getMeshBlobs(primary, accent);

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
        backgroundColor: "#0F0F1A",
        fontFamily: bodyFont,
      }}
    >
      {/* Inject CSS keyframes for mesh animation */}
      <style dangerouslySetInnerHTML={{ __html: meshKeyframes }} />

      {/* ═══════════════ ANIMATED GRADIENT MESH BACKGROUND ═══════════════ */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {meshBlobs.map((blob, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: blob.width,
              height: blob.height,
              top: blob.top,
              left: blob.left,
              background: `radial-gradient(circle, ${blob.color}55 0%, transparent 70%)`,
              filter: `blur(${blob.blur}px)`,
              animation: blob.animation,
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* ═══════════════ FLOATING GLASS ORBS ═══════════════ */}
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        {glassOrbs.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              top: orb.top,
              left: orb.left,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              backgroundColor: `rgba(255,255,255,${0.03 + orb.depth * 0.06})`,
              border: `1px solid rgba(255,255,255,${0.05 + orb.depth * 0.08})`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,${0.1 + orb.depth * 0.1})`,
            }}
            animate={{
              x: [0, orb.driftX, -orb.driftX / 2, 0],
              y: [0, orb.driftY, -orb.driftY / 2, 0],
              scale: [1, 1 + orb.depth * 0.1, 1],
            }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6"
        style={{ perspective: "1200px" }}
      >
        <TiltGlassCard>
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-7 text-xs uppercase tracking-[0.45em] text-white/60"
          >
            You are invited
          </motion.p>

          {/* Partner 1 */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mb-2 text-5xl font-bold text-white sm:text-6xl"
            style={{ fontFamily: displayFont }}
          >
            {wedding.partner1_name}
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="my-5 flex items-center justify-center gap-3"
          >
            <div className="h-px flex-1 bg-white/25" />
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <span className="text-sm text-white/80">&amp;</span>
            </div>
            <div className="h-px flex-1 bg-white/25" />
          </motion.div>

          {/* Partner 2 */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="mb-8 text-5xl font-bold text-white sm:text-6xl"
            style={{ fontFamily: displayFont }}
          >
            {wedding.partner2_name}
          </motion.h1>

          {/* Date */}
          {weddingDate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15 }}
              className="flex items-center justify-center gap-2 text-white/75"
            >
              <Calendar size={14} />
              <p className="text-sm">{weddingDate}</p>
            </motion.div>
          )}

          {/* Venue */}
          {wedding.venue_name && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.25 }}
              className="mt-2 flex items-center justify-center gap-2 text-white/60"
            >
              <MapPin size={14} />
              <p className="text-sm">{wedding.venue_name}</p>
            </motion.div>
          )}
        </TiltGlassCard>

        {/* ─── Glass Countdown Cards ─── */}
        {wedding.wedding_date && (
          <motion.div
            className="mt-10 rounded-2xl px-8 py-6"
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <CountdownTimer
              targetDate={wedding.wedding_date}
              className="gap-4 md:gap-6"
              numberClassName="text-3xl md:text-4xl font-bold text-white tabular-nums"
              labelClassName="text-xs uppercase tracking-[0.15em] text-white/50 mt-1"
            />
          </motion.div>
        )}
      </section>

      {/* ═══════════════════ STORY SECTION ═══════════════════ */}
      {wedding.story_text && (
        <RevealSection
          className="relative z-10 mx-auto max-w-2xl px-6 py-24 text-center"
        >
          <div
            className="rounded-3xl p-10 md:p-14"
            style={{
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <h2
              className="mb-3 text-3xl font-bold text-white"
              style={{ fontFamily: displayFont }}
            >
              Our Story
            </h2>

            <div className="mx-auto mb-8 h-px w-20 bg-white/20" />

            <p className="whitespace-pre-line text-sm leading-[1.9] text-white/75">
              {wedding.story_text}
            </p>
          </div>
        </RevealSection>
      )}

      {/* ═══════════════════ EXPLORE — GLASS PILLS ═══════════════════ */}
      <RevealSection
        className="relative z-10 flex flex-col items-center px-6 py-20"
      >
        <p className="mb-8 text-xs uppercase tracking-[0.4em] text-white/50">
          Explore
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/${wedding.slug}/gallery`}>
            <motion.span
              className="inline-block cursor-pointer rounded-full px-8 py-3 text-sm font-medium text-white"
              style={{
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontFamily: bodyFont,
              }}
              whileHover={{
                backgroundColor: "rgba(255,255,255,0.2)",
                scale: 1.05,
                boxShadow: "0 4px 20px rgba(255,255,255,0.1)",
              }}
              transition={{ duration: 0.25 }}
            >
              Gallery
            </motion.span>
          </Link>

          <Link href={`/${wedding.slug}/guestbook`}>
            <motion.span
              className="inline-block cursor-pointer rounded-full px-8 py-3 text-sm font-medium text-white"
              style={{
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontFamily: bodyFont,
              }}
              whileHover={{
                backgroundColor: "rgba(255,255,255,0.2)",
                scale: 1.05,
                boxShadow: "0 4px 20px rgba(255,255,255,0.1)",
              }}
              transition={{ duration: 0.25 }}
            >
              Guest Book
            </motion.span>
          </Link>
        </div>
      </RevealSection>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="relative z-10 flex flex-col items-center px-6 pb-16 pt-8">
        <div className="mx-auto h-px w-20 bg-white/15" />
        <p className="mt-5 text-xs tracking-[0.15em] text-white/30">
          Made with love
        </p>
      </footer>
    </div>
  );
}
