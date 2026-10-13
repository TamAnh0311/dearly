"use client";

/**
 * Glass invitation page — glassmorphism aesthetic with an indigo/purple
 * gradient background, frosted glass hero card, floating blur orbs,
 * and 3D tilt-on-hover interaction.
 */

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { MapPin, Calendar } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/** Floating blur orb config. */
const orbs = [
  { width: 400, height: 400, top: "-10%", left: "-10%", delay: 0 },
  { width: 300, height: 300, top: "50%", right: "-5%", delay: 2 },
  { width: 250, height: 250, bottom: "5%", left: "20%", delay: 1 },
];

/** Frosted glass card with 3D tilt on mouse move. */
function GlassCard({ children }: { children: React.ReactNode; theme: { colors: { primary: string; accent: string } } }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { stiffness: 200, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
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
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        backgroundColor: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.25)",
        boxShadow: `0 8px 32px rgba(102,126,234,0.25), inset 0 1px 0 rgba(255,255,255,0.3)`,
      }}
      className="w-full max-w-md rounded-3xl p-10 text-center"
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export default function GlassInvitationPage({ wedding, events: _events, theme }: InvitationPageProps) {
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
      className="min-h-screen overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 50%, #4834D4 100%)`,
        fontFamily: `'${theme.fonts.body}', sans-serif`,
      }}
    >
      {/* Floating blur orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: orb.width,
            height: orb.height,
            top: (orb as Record<string, string | number>).top as string | undefined,
            left: (orb as Record<string, string | number>).left as string | undefined,
            right: (orb as Record<string, string | number>).right as string | undefined,
            bottom: (orb as Record<string, string | number>).bottom as string | undefined,
            background: "rgba(255,255,255,0.08)",
            filter: "blur(60px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut", delay: orb.delay }}
        />
      ))}

      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6" style={{ perspective: "1000px" }}>
        <GlassCard theme={theme}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 text-xs uppercase tracking-[0.4em] text-white/70"
          >
            You are invited
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mb-2 text-5xl font-bold text-white"
            style={{ fontFamily: `'${theme.fonts.display}', sans-serif` }}
          >
            {wedding.partner1_name}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="my-5 flex items-center justify-center gap-3"
          >
            <div className="h-px flex-1 bg-white/30" />
            <span className="text-white/80 text-xl">✦</span>
            <div className="h-px flex-1 bg-white/30" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            className="mb-8 text-5xl font-bold text-white"
            style={{ fontFamily: `'${theme.fonts.display}', sans-serif` }}
          >
            {wedding.partner2_name}
          </motion.h1>

          {weddingDate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="flex items-center justify-center gap-2 text-white/80"
            >
              <Calendar size={15} />
              <p className="text-sm">{weddingDate}</p>
            </motion.div>
          )}

          {wedding.venue_name && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-2 flex items-center justify-center gap-2 text-white/70"
            >
              <MapPin size={15} />
              <p className="text-sm">{wedding.venue_name}</p>
            </motion.div>
          )}
        </GlassCard>

        {/* Countdown — frosted mini panel */}
        {wedding.wedding_date && (
          <motion.div
            className="mt-8 rounded-2xl px-8 py-5"
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7 }}
          >
            <CountdownTimer
              targetDate={wedding.wedding_date}
              numberClassName="text-white"
              labelClassName="text-white/60"
            />
          </motion.div>
        )}
      </section>

      {/* Story — frosted glass card */}
      {wedding.story_text && (
        <motion.section
          className="mx-auto max-w-2xl px-6 py-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
        >
          <div
            className="rounded-3xl p-10"
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <h2
              className="mb-6 text-3xl font-bold text-white"
              style={{ fontFamily: `'${theme.fonts.display}', sans-serif` }}
            >
              Our Story
            </h2>
            <p className="whitespace-pre-line text-sm leading-loose text-white/80">
              {wedding.story_text}
            </p>
          </div>
        </motion.section>
      )}
    </div>
  );
}
