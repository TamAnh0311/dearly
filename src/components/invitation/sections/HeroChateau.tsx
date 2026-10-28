"use client";

/**
 * ChateauHero — the premium flagship hero layout.
 *
 * Split into two halves: the top ~48% is a cream paper area holding all
 * typographic content (greeting, eyebrow, couple names, date, venue). The
 * bottom ~52% presents a full-width watercolour painting as the visual
 * centrepiece, flanked by dense botanical sprays (eucalyptus, roses, peonies)
 * and animated doves. The entire hero starts blurred and sharpens on load.
 * A fine double-rule border frames the whole card like a printed invitation.
 */

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { getArtCollection } from "../art";
import { EASE_OUT, alpha } from "../utils";
import { DateLine, RisingText, useEventCopy, useEyebrow, useInvitationCopy } from "./HeroParts";
import ArtSpray from "./ArtSpray";
import type { LayoutProps } from "./Hero";

/* ─── Dove ───────────────────────────────────────────────────────────────── */

/** A small ink illustration of a dove drifting across the painted sky. */
function Dove({
  className,
  delay,
  drift = 26,
}: {
  className: string;
  delay: number;
  drift?: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 72 40"
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 0.85, 0.85, 0],
        x: [0, drift * 0.45, drift],
        y: [0, -7, 2],
      }}
      transition={{
        duration: 11,
        delay,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut",
      }}
    >
      <path
        d="M3 24c9-10 19-12 28-5 2-9 10-13 19-11-5 3-8 8-8 14 7-1 13 1 18 6-8-2-15-1-21 4-4-4-9-6-15-5-7 1-13 2-21-3Z"
        fill="rgba(255,255,255,0.92)"
        stroke="rgba(74,82,62,0.28)"
        strokeWidth="0.8"
      />
    </motion.svg>
  );
}

/* ─── Small decorative gold diamond ─────────────────────────────────────── */

/** Tiny diamond ornament used between sections of the hero text. */
function GoldDiamond({ color, delay }: { color: string; delay: number }) {
  return (
    <motion.svg
      viewBox="0 0 12 12"
      aria-hidden
      className="mx-auto h-2.5 w-2.5"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.6, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: EASE_OUT }}
    >
      <rect
        x={2}
        y={2}
        width={8}
        height={8}
        fill={color}
        transform="rotate(45 6 6)"
      />
    </motion.svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function ChateauHero({
  wedding,
  palette,
  contentY,
  contentOpacity,
}: LayoutProps) {
  const { inviteeName, twoNames, lang } = useEventCopy();
  const ui = useInvitationCopy();
  const eyebrow = useEyebrow("Together with their families");
  const reduce = useReducedMotion();
  const art = getArtCollection(palette.style.art);
  if (!art) return null;

  const imageFilter = palette.isDark
    ? "brightness(0.68) saturate(0.85)"
    : "saturate(1.06) contrast(1.04) brightness(1.02)";
  const conjunction = lang === "vi" ? "và" : "and";

  /** Painting entrance: scale down from 1.06 to 1.0 for a cinematic reveal. */
  const paintingEntrance = reduce
    ? { initial: false as const, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, scale: 1.06 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 2.2, delay: 1.8, ease: EASE_OUT },
      };

  /** Blur-to-sharp intro for the entire hero card. */
  const blurIntro = reduce
    ? {}
    : {
        initial: { filter: "blur(8px)" },
        animate: { filter: "blur(0px)" },
        transition: { duration: 1.5, ease: EASE_OUT },
      };

  /** Botanical spray entrance — delayed fade-in for the dense framing. */
  const sprayEntrance = reduce
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 1.4, delay: 2.5, ease: EASE_OUT },
      };

  return (
    <motion.div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1180px] flex-col" {...blurIntro}>
      {/* ── Fine double-rule border ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 border md:inset-5"
        style={{ borderColor: alpha(palette.primary, 0.2) }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-5 border md:inset-7"
        style={{ borderColor: alpha(palette.primary, 0.1) }}
      />

      {/* ── Paper wash behind the text area ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 58% 38% at 50% 22%, ${alpha(palette.primary, palette.isDark ? 0.14 : 0.06)} 0%, transparent 72%)`,
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          TOP HALF — Cream paper area with all typographic content
         ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        className="relative z-20 flex min-h-[48svh] flex-col items-center justify-center px-8 pb-4 pt-24 text-center md:pt-28"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Personalized greeting */}
        {inviteeName && (
          <motion.p
            className="mb-3 text-2xl md:text-3xl"
            style={{ fontFamily: palette.scriptFont, color: palette.primary }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease: EASE_OUT }}
          >
            {ui.dear(inviteeName)}
          </motion.p>
        )}

        {/* Eyebrow with decorative lines */}
        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.8 }}
        >
          <motion.span
            className="h-px w-8 shrink-0 md:w-12"
            style={{ backgroundColor: alpha(palette.primary, 0.45), originX: 1 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.9, ease: EASE_OUT }}
          />
          <p
            className="text-[9px] uppercase leading-relaxed tracking-[0.30em] md:text-[10px] md:tracking-[0.40em]"
            style={{ color: alpha(palette.ink, 0.64) }}
          >
            {inviteeName ? ui.youAreInvited : eyebrow}
          </p>
          <motion.span
            className="h-px w-8 shrink-0 md:w-12"
            style={{ backgroundColor: alpha(palette.primary, 0.45), originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.9, ease: EASE_OUT }}
          />
        </motion.div>

        {/* Gold diamond ornament above names */}
        <div className="mt-4">
          <GoldDiamond color={palette.primary} delay={0.95} />
        </div>

        {/* Couple names — LARGE and commanding */}
        <h1
          className="mt-4 font-light md:mt-6"
          style={{
            fontFamily: palette.displayFont,
            color: palette.ink,
            fontSize: "clamp(3rem, 10vw, 6.5rem)",
            lineHeight: 0.94,
            letterSpacing: "0.005em",
          }}
        >
          <span className="block">
            <RisingText text={wedding.partner1_name} delay={1.0} stagger={0.055} />
          </span>
          {twoNames && (
            <>
              <motion.span
                className="my-1 block text-[0.32em] md:my-2"
                style={{ fontFamily: palette.scriptFont, color: palette.primary }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.3, ease: EASE_OUT }}
              >
                {conjunction}
              </motion.span>
              <span className="block">
                <RisingText text={wedding.partner2_name} delay={1.5} stagger={0.055} />
              </span>
            </>
          )}
        </h1>

        {/* Decorative gold lines flanking the names */}
        <motion.div
          className="mt-5 flex items-center gap-4 md:mt-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.9, ease: EASE_OUT }}
        >
          <motion.span
            className="h-px w-10 md:w-16"
            style={{ backgroundColor: alpha(palette.primary, 0.4), originX: 1 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1.95, ease: EASE_OUT }}
          />
          <GoldDiamond color={palette.primary} delay={2.0} />
          <motion.span
            className="h-px w-10 md:w-16"
            style={{ backgroundColor: alpha(palette.primary, 0.4), originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1.95, ease: EASE_OUT }}
          />
        </motion.div>

        {/* Date in gold */}
        {wedding.wedding_date && (
          <div className="mt-5 md:mt-6">
            <DateLine
              date={wedding.wedding_date}
              palette={palette}
              delay={2.0}
              color={palette.primary}
            />
          </div>
        )}

        {/* Venue / city in small caps */}
        {wedding.venue_name && (
          <motion.p
            className="mt-3 max-w-[20rem] text-[9px] uppercase leading-relaxed tracking-[0.30em] md:mt-4 md:text-[10px]"
            style={{ color: alpha(palette.ink, 0.54) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 2.3 }}
          >
            {wedding.venue_name}
          </motion.p>
        )}
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM HALF — Full-width watercolour painting as centrepiece
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative z-0 h-[52svh] w-full overflow-hidden">
        {/* Painting image with cinematic scale-in */}
        <motion.div {...paintingEntrance} className="absolute inset-0">
          {/* Mobile portrait crop */}
          <Image
            src={art.heroPortrait.src}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 0px"
            placeholder="blur"
            blurDataURL={art.heroPortrait.blurDataURL}
            className="object-cover md:hidden"
            style={{ objectPosition: "50% 45%", filter: imageFilter }}
          />
          {/* Desktop wide crop */}
          <Image
            src={art.hero.src}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 0px, 1180px"
            placeholder="blur"
            blurDataURL={art.hero.blurDataURL}
            className="hidden object-cover md:block"
            style={{ objectPosition: "50% 55%", filter: imageFilter }}
          />

          {/* Warm tint overlay matching the palette */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundColor: alpha(
                palette.primary,
                palette.isDark ? 0.18 : 0.04,
              ),
              mixBlendMode: palette.isDark ? "soft-light" : "multiply",
            }}
          />

          {/* Top gradient: painting merges into the cream paper above */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[38%]"
            style={{
              background: `linear-gradient(180deg, ${palette.background} 0%, ${alpha(palette.background, 0.88)} 28%, ${alpha(palette.background, 0)} 100%)`,
            }}
          />

          {/* Bottom gradient fade */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-20"
            style={{
              background: `linear-gradient(0deg, ${alpha(palette.background, 0.55)} 0%, transparent 100%)`,
            }}
          />
        </motion.div>

        {/* Doves drifting across the painted sky */}
        <Dove className="left-[12%] top-[14%] w-10 md:w-14" delay={2.8} drift={26} />
        <Dove className="right-[14%] top-[20%] w-8 md:w-11" delay={4.8} drift={-20} />
        <Dove className="left-[40%] top-[8%] w-7 md:w-9" delay={6.6} drift={18} />

        {/* Dense botanical sprays framing left and right edges */}
        <motion.div {...sprayEntrance}>
          <ArtSpray
            palette={palette}
            asset="eucalyptus"
            className="-left-6 bottom-[5svh] w-28 opacity-80 md:left-0 md:w-40"
            rotate={-8}
          />
          <ArtSpray
            palette={palette}
            asset="roses"
            className="-right-8 bottom-[8svh] w-32 opacity-80 md:right-0 md:w-44"
            rotate={10}
          />
          <ArtSpray
            palette={palette}
            asset="peonyTall"
            className="-left-10 bottom-[25svh] w-24 opacity-60 md:left-2 md:w-32"
            rotate={-15}
          />
          <ArtSpray
            palette={palette}
            asset="peony"
            className="-right-6 bottom-[30svh] w-28 opacity-60 md:right-2 md:w-36"
            rotate={12}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
