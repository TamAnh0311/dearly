"use client";

/**
 * Rustic invitation page — earthy botanical aesthetic with hand-drawn SVG
 * border reveal, drifting leaf particles, and sketch-like entrance animations.
 */

import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/** Leaf particles drifting in from sides. */
const leaves = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  startX: i % 2 === 0 ? "-5vw" : "105vw",
  endX: i % 2 === 0 ? "30vw" : "70vw",
  startY: `${10 + i * 12}vh`,
  delay: i * 0.7,
  duration: 10 + (i % 5) * 2,
}));

/** Sketch-draw path animation for SVG border reveal. */
const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 2, ease: "easeInOut", delay: 0.3 } },
};

export default function RusticInvitationPage({ wedding, events: _events, theme }: InvitationPageProps) {
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
        backgroundColor: theme.colors.secondary,
        fontFamily: `'${theme.fonts.body}', sans-serif`,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235C4033' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* Drifting leaf particles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {leaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            className="absolute text-lg"
            style={{ top: leaf.startY }}
            initial={{ x: leaf.startX, opacity: 0, rotate: 0 }}
            animate={{ x: leaf.endX, opacity: [0, 0.4, 0], rotate: leaf.id % 2 === 0 ? 180 : -180 }}
            transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: "linear" }}
          >
            <span style={{ color: theme.colors.accent, opacity: 0.6 }}>🌿</span>
          </motion.div>
        ))}
      </div>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-8 text-center">
        {/* Sketch-draw border SVG */}
        <div className="absolute inset-8 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 400 500" preserveAspectRatio="none">
            <motion.rect
              x="2" y="2" width="396" height="496"
              rx="4"
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth="1.5"
              strokeDasharray="6 4"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              style={{ opacity: 0.3 }}
            />
          </svg>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-6 text-sm uppercase tracking-[0.3em]"
          style={{ color: theme.colors.accent }}
        >
          With heartfelt joy
        </motion.p>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="mb-0 text-6xl md:text-8xl"
          style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary, lineHeight: 1.1 }}
        >
          {wedding.partner1_name}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="my-6 flex items-center gap-4"
        >
          <div className="h-px flex-1" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
          <span className="text-2xl" style={{ color: theme.colors.accent }}>✦</span>
          <div className="h-px flex-1" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.0 }}
          className="mb-8 text-6xl md:text-8xl"
          style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary, lineHeight: 1.1 }}
        >
          {wedding.partner2_name}
        </motion.h1>

        {weddingDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex items-center gap-2"
          >
            <Calendar size={16} style={{ color: theme.colors.accent }} />
            <p className="text-sm tracking-wider" style={{ color: theme.colors.accent }}>
              {weddingDate}
            </p>
          </motion.div>
        )}

        {wedding.venue_name && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="mt-3 flex items-center gap-2"
          >
            <MapPin size={16} style={{ color: theme.colors.accent }} />
            <p className="text-sm" style={{ color: theme.colors.accent }}>{wedding.venue_name}</p>
          </motion.div>
        )}

        {wedding.wedding_date && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="mt-12"
          >
            <CountdownTimer
              targetDate={wedding.wedding_date}
              numberClassName="text-dearly-text"
              labelClassName="text-dearly-text-muted"
            />
          </motion.div>
        )}
      </section>

      {/* Story */}
      {wedding.story_text && (
        <motion.section
          className="mx-auto max-w-2xl px-8 py-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-12" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
            <span className="text-xl" style={{ color: theme.colors.accent }}>✦</span>
            <div className="h-px w-12" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
          </div>
          <h2
            className="mb-8 text-4xl"
            style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
          >
            Our Story
          </h2>
          <p className="whitespace-pre-line text-sm leading-loose" style={{ color: theme.colors.accent }}>
            {wedding.story_text}
          </p>
        </motion.section>
      )}
    </div>
  );
}
