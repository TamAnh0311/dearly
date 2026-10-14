"use client";

/**
 * Minimal invitation page — ultra-modern editorial wedding design.
 * Features massive sans-serif typography with character-stagger reveals,
 * animated horizontal rules, pure black story section with enormous faded
 * quotation marks, flip-digit countdown, animated underline nav links,
 * and a monogram footer.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import type { InvitationPageProps } from "../types";

/* ------------------------------------------------------------------ */
/*  Character reveal — each letter clips in from below with stagger    */
/* ------------------------------------------------------------------ */

/** Renders each character of text as an individually animated element. */
function CharacterReveal({
  text,
  fontFamily,
  color,
  delay = 0,
}: {
  text: string;
  fontFamily: string;
  color: string;
  delay?: number;
}) {
  return (
    <span className="inline-flex flex-wrap justify-center overflow-hidden">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "115%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ fontFamily, color }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Nav link with animated underline expanding from center             */
/* ------------------------------------------------------------------ */

/** Navigation link with CSS-animated underline that expands on hover. */
function NavLink({
  href,
  label,
  color,
  fontFamily,
}: {
  href: string;
  label: string;
  color: string;
  fontFamily: string;
}) {
  return (
    <Link
      href={href}
      className="group relative inline-block text-xs uppercase tracking-[0.35em]"
      style={{ color, fontFamily }}
    >
      {label}
      <span
        className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-full"
        style={{ backgroundColor: color }}
      />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Flip digit — smooth slide animation on value change                */
/* ------------------------------------------------------------------ */

/** Animated digit that slides down when the value changes. */
function FlipDigit({ value, color }: { value: number; color: string }) {
  const display = String(value).padStart(2, "0");
  const [prev, setPrev] = useState(display);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (display !== prev) {
      setFlip(true);
      const t = setTimeout(() => {
        setPrev(display);
        setFlip(false);
      }, 180);
      return () => clearTimeout(t);
    }
  }, [display, prev]);

  return (
    <span
      className="inline-block tabular-nums transition-all duration-200"
      style={{
        color,
        fontVariantNumeric: "tabular-nums",
        transform: flip ? "translateY(3px)" : "translateY(0)",
        opacity: flip ? 0.5 : 1,
      }}
    >
      {prev}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom inline countdown with colon separators and flip digits      */
/* ------------------------------------------------------------------ */

/** Minimal countdown with colon-separated flip digits. */
function MinimalCountdown({
  targetDate,
  color,
  mutedColor,
}: {
  targetDate: string;
  color: string;
  mutedColor: string;
}) {
  const calc = useCallback(() => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [targetDate]);

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hrs", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ];

  return (
    <div className="flex items-baseline gap-1 text-2xl font-extralight tracking-wide md:text-3xl">
      {units.map((u, i) => (
        <span key={u.label} className="flex items-baseline gap-1">
          <FlipDigit value={u.value} color={color} />
          <span
            className="text-[9px] uppercase tracking-[0.18em]"
            style={{ color: mutedColor }}
          >
            {u.label}
          </span>
          {i < units.length - 1 && (
            <span className="mx-1.5 text-base" style={{ color: mutedColor, opacity: 0.3 }}>
              :
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function MinimalInvitationPage({
  wedding,
  events: _events,
  theme,
}: InvitationPageProps) {
  const weddingDate = wedding.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  /* Scroll-linked transition for the story section */
  const transitionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: transitionRef,
    offset: ["start end", "start start"],
  });
  const storyBg = useTransform(
    scrollYProgress,
    [0, 1],
    [theme.colors.secondary, "#111111"]
  );

  /* Story in-view trigger */
  const storyRef = useRef<HTMLDivElement>(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });

  /* Parallax for the hero horizontal rules */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const ruleParallax = useTransform(heroScroll, [0, 1], [0, 30]);
  const nameParallax = useTransform(heroScroll, [0, 1], [0, 50]);

  /* Initials for footer monogram */
  const initials =
    (wedding.partner1_name?.[0] ?? "") + (wedding.partner2_name?.[0] ?? "");

  const displayFont = `'${theme.fonts.display}', sans-serif`;
  const bodyFont = `'${theme.fonts.body}', sans-serif`;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.colors.secondary,
        fontFamily: bodyFont,
      }}
    >
      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section
        ref={heroRef}
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        {/* Partner 1 — MASSIVE uppercase, tight tracking */}
        <motion.div
          className="text-6xl font-bold uppercase sm:text-7xl md:text-8xl lg:text-9xl"
          style={{
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            fontFamily: displayFont,
            y: nameParallax,
          }}
        >
          <CharacterReveal
            text={wedding.partner1_name}
            fontFamily={displayFont}
            color={theme.colors.primary}
            delay={0.15}
          />
        </motion.div>

        {/* Animated horizontal rule — scaleX 0 to 1 */}
        <motion.div
          style={{ y: ruleParallax }}
          className="flex items-center justify-center"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="my-5 h-px w-36 origin-center md:my-6 md:w-52"
            style={{ backgroundColor: theme.colors.primary }}
          />
        </motion.div>

        {/* Tiny italic "&" — scale contrast */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.95 }}
          className="my-1 block text-sm italic"
          style={{ color: theme.colors.accent, fontFamily: bodyFont }}
        >
          &amp;
        </motion.span>

        {/* Second horizontal rule */}
        <motion.div style={{ y: ruleParallax }} className="flex items-center justify-center">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="my-5 h-px w-36 origin-center md:my-6 md:w-52"
            style={{ backgroundColor: theme.colors.primary }}
          />
        </motion.div>

        {/* Partner 2 — MASSIVE uppercase */}
        <motion.div
          className="text-6xl font-bold uppercase sm:text-7xl md:text-8xl lg:text-9xl"
          style={{
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            fontFamily: displayFont,
            y: nameParallax,
          }}
        >
          <CharacterReveal
            text={wedding.partner2_name}
            fontFamily={displayFont}
            color={theme.colors.primary}
            delay={0.55}
          />
        </motion.div>

        {/* Date — editorial uppercase, spaced */}
        {weddingDate && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-12 text-[10px] uppercase tracking-[0.35em] md:text-xs"
            style={{ color: theme.colors.accent }}
          >
            {weddingDate}
          </motion.p>
        )}

        {/* Venue */}
        {wedding.venue_name && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="mt-3 text-[10px] uppercase tracking-[0.3em]"
            style={{ color: theme.colors.accent, opacity: 0.65 }}
          >
            {wedding.venue_name}
          </motion.p>
        )}

        {/* Venue address */}
        {wedding.venue_address && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="mt-1 text-[10px] uppercase tracking-[0.25em]"
            style={{ color: theme.colors.accent }}
          >
            {wedding.venue_address}
          </motion.p>
        )}

        {/* Countdown */}
        {wedding.wedding_date && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.9 }}
            className="mt-16"
          >
            <MinimalCountdown
              targetDate={wedding.wedding_date}
              color={theme.colors.primary}
              mutedColor={theme.colors.accent}
            />
          </motion.div>
        )}

        {/* Navigation links */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="mt-20 flex gap-12"
        >
          <NavLink
            href={`/${wedding.slug}/gallery`}
            label="Gallery"
            color={theme.colors.primary}
            fontFamily={bodyFont}
          />
          <NavLink
            href={`/${wedding.slug}/guestbook`}
            label="Guestbook"
            color={theme.colors.primary}
            fontFamily={bodyFont}
          />
        </motion.nav>
      </section>

      {/* ── SCROLL TRANSITION SENTINEL ── */}
      <div ref={transitionRef} className="h-40" />

      {/* ═══════════════════════ STORY — BLACK BACKGROUND ═══════════════════ */}
      {wedding.story_text && (
        <motion.section
          style={{ backgroundColor: storyBg }}
          className="relative overflow-hidden px-6 py-32 md:py-44"
        >
          <div ref={storyRef} className="relative mx-auto max-w-xl">
            {/* Enormous faded opening quotation mark */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={storyInView ? { opacity: 0.05 } : {}}
              transition={{ duration: 1.4 }}
              className="pointer-events-none absolute -left-6 -top-20 select-none text-[14rem] font-bold leading-none md:-left-14 md:-top-24 md:text-[20rem]"
              style={{
                color: "#FFFFFF",
                fontFamily: displayFont,
              }}
              aria-hidden
            >
              &ldquo;
            </motion.span>

            {/* Enormous faded closing quotation mark */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={storyInView ? { opacity: 0.04 } : {}}
              transition={{ duration: 1.4, delay: 0.4 }}
              className="pointer-events-none absolute -bottom-28 -right-6 select-none text-[14rem] font-bold leading-none md:-bottom-32 md:-right-14 md:text-[20rem]"
              style={{
                color: "#FFFFFF",
                fontFamily: displayFont,
              }}
              aria-hidden
            >
              &rdquo;
            </motion.span>

            {/* Story heading with line accent */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.1 }}
            >
              <div
                className="mb-8 h-px w-14"
                style={{ backgroundColor: "#FFFFFF", opacity: 0.15 }}
              />
              <h2
                className="mb-10 text-[10px] font-bold uppercase tracking-[0.45em]"
                style={{ color: "#FFFFFF", opacity: 0.45, fontFamily: bodyFont }}
              >
                Our Story
              </h2>
            </motion.div>

            {/* Story text */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.35 }}
              className="whitespace-pre-line text-base leading-[2.1] md:text-lg md:leading-[2.3]"
              style={{ color: "#FFFFFF", opacity: 0.82, fontFamily: bodyFont }}
            >
              {wedding.story_text}
            </motion.p>

            {/* Bottom line accent */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={storyInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-14 h-px w-14 origin-left"
              style={{ backgroundColor: "#FFFFFF", opacity: 0.15 }}
            />
          </div>
        </motion.section>
      )}

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer
        className="flex flex-col items-center px-6 py-20"
        style={{ backgroundColor: theme.colors.secondary }}
      >
        <div
          className="mb-10 h-px w-24"
          style={{ backgroundColor: theme.colors.primary, opacity: 0.12 }}
        />

        {/* Monogram initials */}
        <span
          className="text-sm font-bold uppercase tracking-[0.5em]"
          style={{
            color: theme.colors.primary,
            fontFamily: displayFont,
            opacity: 0.35,
          }}
        >
          {initials}
        </span>
      </footer>
    </div>
  );
}
