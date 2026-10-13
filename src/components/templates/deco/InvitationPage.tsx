"use client";

/**
 * Deco invitation page — Art Deco gatsby-era grandeur: geometric chevron
 * borders build in sequence, gold shimmer on names, dark navy background.
 */

import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/** Geometric chevron/diamond builds in from corners. */
const cornerVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, delay: i * 0.2, ease: "easeInOut" },
  }),
};

/** Gold shimmer text animation. */
const shimmerVariants = {
  hidden: { opacity: 0, letterSpacing: "0.5em" },
  visible: (i: number) => ({
    opacity: 1,
    letterSpacing: "0.05em",
    transition: { duration: 1, delay: 0.5 + i * 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
};

/** Geometric reveal — scale from center with opacity. */
const geoReveal = {
  hidden: { opacity: 0, scaleY: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scaleY: 1,
    transition: { duration: 0.6, delay: 0.8 + i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function DecoInvitationPage({ wedding, events, theme }: InvitationPageProps) {
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
      }}
    >
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-8 text-center">
        {/* Art Deco geometric SVG frame */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <svg width="90%" height="90%" viewBox="0 0 600 700" className="absolute">
            {/* Top chevron */}
            <motion.polyline
              points="200,20 300,60 400,20"
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth="1"
              custom={0}
              variants={cornerVariants}
              initial="hidden"
              animate="visible"
            />
            {/* Bottom chevron */}
            <motion.polyline
              points="200,680 300,640 400,680"
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth="1"
              custom={1}
              variants={cornerVariants}
              initial="hidden"
              animate="visible"
            />
            {/* Left side */}
            <motion.line
              x1="10" y1="200" x2="10" y2="500"
              stroke={theme.colors.primary}
              strokeWidth="1"
              custom={2}
              variants={cornerVariants}
              initial="hidden"
              animate="visible"
            />
            {/* Right side */}
            <motion.line
              x1="590" y1="200" x2="590" y2="500"
              stroke={theme.colors.primary}
              strokeWidth="1"
              custom={3}
              variants={cornerVariants}
              initial="hidden"
              animate="visible"
            />
            {/* Corner diamonds */}
            {[
              [100, 100], [500, 100], [100, 600], [500, 600],
            ].map(([cx, cy], idx) => (
              <motion.polygon
                key={idx}
                points={`${cx},${cy - 12} ${cx + 12},${cy} ${cx},${cy + 12} ${cx - 12},${cy}`}
                fill="none"
                stroke={theme.colors.primary}
                strokeWidth="1"
                custom={4 + idx}
                variants={cornerVariants}
                initial="hidden"
                animate="visible"
              />
            ))}
          </svg>
        </div>

        <motion.p
          custom={0}
          variants={shimmerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 text-xs uppercase"
          style={{ color: theme.colors.primary, letterSpacing: "0.4em" }}
        >
          The pleasure of your company is requested
        </motion.p>

        {/* Horizontal top rule */}
        <motion.div
          custom={0}
          variants={geoReveal}
          initial="hidden"
          animate="visible"
          className="mb-8 flex items-center gap-6"
        >
          <div className="h-px w-24" style={{ backgroundColor: theme.colors.primary }} />
          <div className="h-3 w-3 rotate-45" style={{ backgroundColor: theme.colors.primary }} />
          <div className="h-px w-24" style={{ backgroundColor: theme.colors.primary }} />
        </motion.div>

        <motion.h1
          custom={1}
          variants={shimmerVariants}
          initial="hidden"
          animate="visible"
          className="mb-2 text-6xl font-light md:text-8xl"
          style={{
            fontFamily: `'${theme.fonts.display}', sans-serif`,
            color: theme.colors.primary,
            textShadow: `0 0 40px ${theme.colors.primary}40`,
          }}
        >
          {wedding.partner1_name}
        </motion.h1>

        <motion.p
          custom={2}
          variants={shimmerVariants}
          initial="hidden"
          animate="visible"
          className="my-4 text-lg"
          style={{ color: theme.colors.accent }}
        >
          &amp;
        </motion.p>

        <motion.h1
          custom={3}
          variants={shimmerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 text-6xl font-light md:text-8xl"
          style={{
            fontFamily: `'${theme.fonts.display}', sans-serif`,
            color: theme.colors.primary,
            textShadow: `0 0 40px ${theme.colors.primary}40`,
          }}
        >
          {wedding.partner2_name}
        </motion.h1>

        {/* Horizontal bottom rule */}
        <motion.div
          custom={1}
          variants={geoReveal}
          initial="hidden"
          animate="visible"
          className="mb-8 flex items-center gap-6"
        >
          <div className="h-px w-24" style={{ backgroundColor: theme.colors.primary }} />
          <div className="h-3 w-3 rotate-45" style={{ backgroundColor: theme.colors.primary }} />
          <div className="h-px w-24" style={{ backgroundColor: theme.colors.primary }} />
        </motion.div>

        {weddingDate && (
          <motion.div
            custom={4}
            variants={shimmerVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-3"
          >
            <Calendar size={16} style={{ color: theme.colors.primary }} />
            <p className="text-sm uppercase tracking-[0.25em]" style={{ color: theme.colors.accent }}>
              {weddingDate}
            </p>
          </motion.div>
        )}

        {wedding.venue_name && (
          <motion.div
            custom={5}
            variants={shimmerVariants}
            initial="hidden"
            animate="visible"
            className="mt-3 flex items-center gap-3"
          >
            <MapPin size={16} style={{ color: theme.colors.primary }} />
            <p className="text-sm uppercase tracking-[0.2em]" style={{ color: theme.colors.accent }}>
              {wedding.venue_name}
            </p>
          </motion.div>
        )}

        {wedding.wedding_date && (
          <motion.div
            custom={6}
            variants={shimmerVariants}
            initial="hidden"
            animate="visible"
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
          <div className="mb-6 flex items-center justify-center gap-6">
            <div className="h-px w-16" style={{ backgroundColor: theme.colors.primary, opacity: 0.5 }} />
            <div className="h-3 w-3 rotate-45" style={{ backgroundColor: theme.colors.primary }} />
            <div className="h-px w-16" style={{ backgroundColor: theme.colors.primary, opacity: 0.5 }} />
          </div>
          <h2
            className="mb-8 text-4xl font-light uppercase tracking-widest"
            style={{ fontFamily: `'${theme.fonts.display}', sans-serif`, color: theme.colors.primary }}
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
