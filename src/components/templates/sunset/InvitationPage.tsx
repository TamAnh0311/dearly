"use client";

/**
 * Sunset invitation page — warm tropical vibes with wave-rise entrance,
 * animated sun-glow gradient background, and rolling wave dividers.
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MapPin, Calendar } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/** Wave-rise: items slide up from below the fold with warm easing. */
const waveContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
};

const waveItem = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export default function SunsetInvitationPage({ wedding, events: _events, theme }: InvitationPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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
      style={{ fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      {/* Gradient hero background */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
        style={{
          background: `linear-gradient(180deg, #FF9A76 0%, ${theme.colors.primary} 35%, ${theme.colors.accent}88 70%, ${theme.colors.secondary} 100%)`,
        }}
      >
        {/* Animated sun glow */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{
            width: ["200px", "260px", "200px"],
            height: ["200px", "260px", "200px"],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: `radial-gradient(circle, ${theme.colors.accent} 0%, transparent 70%)`,
          }}
        />

        <motion.div
          variants={waveContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center"
        >
          <motion.p
            variants={waveItem}
            className="mb-8 text-sm uppercase tracking-[0.4em]"
            style={{ color: theme.colors.secondary, opacity: 0.9 }}
          >
            Together with their families
          </motion.p>

          <motion.h1
            variants={waveItem}
            className="mb-2 text-6xl md:text-8xl"
            style={{
              fontFamily: `'${theme.fonts.display}', serif`,
              color: theme.colors.secondary,
              textShadow: `0 2px 20px rgba(0,0,0,0.2)`,
            }}
          >
            {wedding.partner1_name}
          </motion.h1>

          <motion.div
            variants={waveItem}
            className="my-6 flex items-center gap-4"
          >
            <motion.div
              className="h-px w-20"
              style={{ backgroundColor: theme.colors.secondary, opacity: 0.6 }}
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <p
              className="text-3xl italic"
              style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.accent }}
            >
              &amp;
            </p>
            <motion.div
              className="h-px w-20"
              style={{ backgroundColor: theme.colors.secondary, opacity: 0.6 }}
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />
          </motion.div>

          <motion.h1
            variants={waveItem}
            className="mb-10 text-6xl md:text-8xl"
            style={{
              fontFamily: `'${theme.fonts.display}', serif`,
              color: theme.colors.secondary,
              textShadow: `0 2px 20px rgba(0,0,0,0.2)`,
            }}
          >
            {wedding.partner2_name}
          </motion.h1>

          {weddingDate && (
            <motion.div variants={waveItem} className="flex items-center gap-3">
              <Calendar size={18} style={{ color: theme.colors.secondary, opacity: 0.8 }} />
              <p className="text-base" style={{ color: theme.colors.secondary, opacity: 0.9 }}>
                {weddingDate}
              </p>
            </motion.div>
          )}

          {wedding.venue_name && (
            <motion.div variants={waveItem} className="mt-3 flex items-center gap-3">
              <MapPin size={18} style={{ color: theme.colors.secondary, opacity: 0.8 }} />
              <p className="text-base" style={{ color: theme.colors.secondary, opacity: 0.9 }}>
                {wedding.venue_name}
              </p>
            </motion.div>
          )}

          {wedding.wedding_date && (
            <motion.div variants={waveItem} className="mt-12">
              <CountdownTimer
                targetDate={wedding.wedding_date}
                numberClassName="text-dearly-text"
                labelClassName="text-dearly-text-muted"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Wave SVG at the bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <motion.path
              d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,80 L0,80 Z"
              fill={theme.colors.secondary}
              animate={{
                d: [
                  "M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,80 L0,80 Z",
                  "M0,50 C360,20 720,70 1080,30 C1260,10 1380,60 1440,50 L1440,80 L0,80 Z",
                  "M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,80 L0,80 Z",
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </section>

      {/* Story section on warm cream */}
      {wedding.story_text && (
        <motion.section
          className="mx-auto max-w-2xl px-6 py-20 text-center"
          style={{ backgroundColor: theme.colors.secondary }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <h2
            className="mb-8 text-3xl"
            style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
          >
            Our Story
          </h2>
          <p className="whitespace-pre-line text-base leading-relaxed" style={{ color: theme.colors.primary, opacity: 0.8 }}>
            {wedding.story_text}
          </p>
        </motion.section>
      )}
    </div>
  );
}
