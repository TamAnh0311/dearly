"use client";

/**
 * Bloom invitation page — romantic floral aesthetic with bloom-on-scroll
 * scale reveals, floating petal particles, and soft spring palette.
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MapPin, Calendar } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { InvitationPageProps } from "../types";

/** Petal particle config — each petal has a fixed random-ish position. */
const petals = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${((i * 37 + 11) % 100)}%`,
  delay: (i * 0.4) % 5,
  duration: 6 + (i % 4),
  size: 8 + (i % 12),
}));

/** Bloom scale-up from 0.8 with fade. */
const bloomVariants = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function BloomInvitationPage({ wedding, events, theme }: InvitationPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

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
      {/* Floating petal particles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {petals.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: "-20px",
              width: p.size,
              height: p.size,
              backgroundColor: theme.colors.primary,
              opacity: 0.25,
              borderRadius: "50% 0 50% 0",
            }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, (p.id % 2 === 0 ? 30 : -30)],
              rotate: [0, 360],
              opacity: [0.25, 0.1, 0.25],
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

      {/* Hero */}
      <section ref={heroRef} className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div style={{ y: heroY }} className="flex flex-col items-center">
          {/* Floral ornament top */}
          <motion.div
            custom={0}
            variants={bloomVariants}
            initial="hidden"
            animate="visible"
            className="mb-8 flex items-center gap-3"
          >
            <div className="h-px w-16" style={{ backgroundColor: theme.colors.primary }} />
            <span className="text-2xl" style={{ color: theme.colors.primary }}>✿</span>
            <div className="h-px w-16" style={{ backgroundColor: theme.colors.primary }} />
          </motion.div>

          <motion.p
            custom={1}
            variants={bloomVariants}
            initial="hidden"
            animate="visible"
            className="mb-4 text-sm uppercase tracking-[0.35em]"
            style={{ color: theme.colors.accent }}
          >
            With joy in our hearts
          </motion.p>

          <motion.h1
            custom={2}
            variants={bloomVariants}
            initial="hidden"
            animate="visible"
            className="mb-2 text-6xl font-light md:text-8xl"
            style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
          >
            {wedding.partner1_name}
          </motion.h1>

          <motion.p
            custom={3}
            variants={bloomVariants}
            initial="hidden"
            animate="visible"
            className="my-3 text-3xl italic"
            style={{ color: theme.colors.accent, fontFamily: `'${theme.fonts.display}', serif` }}
          >
            &amp;
          </motion.p>

          <motion.h1
            custom={4}
            variants={bloomVariants}
            initial="hidden"
            animate="visible"
            className="mb-8 text-6xl font-light md:text-8xl"
            style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
          >
            {wedding.partner2_name}
          </motion.h1>

          {/* Floral ornament bottom */}
          <motion.div
            custom={5}
            variants={bloomVariants}
            initial="hidden"
            animate="visible"
            className="mb-8 flex items-center gap-3"
          >
            <div className="h-px w-16" style={{ backgroundColor: theme.colors.primary }} />
            <span className="text-2xl" style={{ color: theme.colors.primary }}>✿</span>
            <div className="h-px w-16" style={{ backgroundColor: theme.colors.primary }} />
          </motion.div>

          {weddingDate && (
            <motion.div
              custom={6}
              variants={bloomVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-2"
            >
              <Calendar size={18} style={{ color: theme.colors.primary }} />
              <p className="text-lg" style={{ color: theme.colors.primary, fontFamily: `'${theme.fonts.display}', serif` }}>
                {weddingDate}
              </p>
            </motion.div>
          )}

          {wedding.venue_name && (
            <motion.div
              custom={7}
              variants={bloomVariants}
              initial="hidden"
              animate="visible"
              className="mt-4 flex items-center gap-2"
            >
              <MapPin size={18} style={{ color: theme.colors.accent }} />
              <p className="text-base" style={{ color: theme.colors.accent }}>{wedding.venue_name}</p>
            </motion.div>
          )}

          {wedding.wedding_date && (
            <motion.div
              custom={8}
              variants={bloomVariants}
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
        </motion.div>
      </section>

      {/* Story section */}
      {wedding.story_text && (
        <motion.section
          className="mx-auto max-w-2xl px-6 py-20 text-center"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="h-px w-12" style={{ backgroundColor: theme.colors.primary, opacity: 0.5 }} />
            <span style={{ color: theme.colors.primary }}>✿</span>
            <div className="h-px w-12" style={{ backgroundColor: theme.colors.primary, opacity: 0.5 }} />
          </div>
          <h2
            className="mb-8 text-3xl font-light"
            style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
          >
            Our Story
          </h2>
          <p
            className="whitespace-pre-line text-base leading-relaxed"
            style={{ color: theme.colors.accent }}
          >
            {wedding.story_text}
          </p>
        </motion.section>
      )}
    </div>
  );
}
