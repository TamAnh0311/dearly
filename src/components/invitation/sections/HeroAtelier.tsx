"use client";

/**
 * AtelierHero — the painted-garden opening layout.
 *
 * A cream invitation card framed by a fine double rule. The names sit
 * letterpress-centred above a full-bleed watercolour
 * ceremony aisle that fades into the paper, with doves drifting across the
 * sky. The whole card reads as one printed piece rather than a photo split.
 */

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { getArtCollection } from "../art";
import { EASE_OUT, alpha } from "../utils";
import { DateLine, RisingText, useEventCopy, useEyebrow, useInvitationCopy } from "./HeroParts";
import type { LayoutProps } from "./Hero";

/** A small ink illustration of a dove; used as a slow ambient guest. */
function Dove({ className, delay, drift = 26 }: { className: string; delay: number; drift?: number }) {
  return (
    <motion.svg
      viewBox="0 0 72 40"
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{ opacity: [0, 0.85, 0.85, 0], x: [0, drift * 0.45, drift], y: [0, -7, 2] }}
      transition={{ duration: 11, delay, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
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

export function AtelierHero({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const { inviteeName, twoNames, lang } = useEventCopy();
  const ui = useInvitationCopy();
  const eyebrow = useEyebrow("Together with their families");
  const reduce = useReducedMotion();
  const art = getArtCollection(palette.style.art);
  if (!art) return null;

  const imageFilter = palette.isDark
    ? "brightness(0.72) saturate(0.9)"
    : "saturate(1.04) contrast(1.03) brightness(1.03)";
  const conjunction = lang === "vi" ? "và" : "and";

  const artEntrance = reduce
    ? { initial: false as const, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, scale: 1.06, y: 26 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { duration: 1.9, delay: 0.15, ease: EASE_OUT },
      };

  return (
    <>
      {/* Paper wash: a faint bloom of the scheme's colours behind the type. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 58% 38% at 50% 30%, ${alpha(palette.primary, palette.isDark ? 0.14 : 0.07)} 0%, transparent 72%),
                       radial-gradient(ellipse 40% 28% at 8% 84%, ${alpha(palette.leaf, 0.14)} 0%, transparent 72%)`,
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1180px] flex-col">
        {/* Fine double frame, like the edge of a printed card. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-3 border md:inset-5"
          style={{ borderColor: alpha(palette.primary, 0.2) }}
        />
        <motion.div
          className="relative z-20 flex flex-1 flex-col items-center justify-center px-8 pb-4 pt-24 text-center md:pt-28"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          {inviteeName && (
            <motion.p
              className="mb-2 text-2xl md:text-3xl"
              style={{ fontFamily: palette.scriptFont, color: palette.primary }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE_OUT }}
            >
              {ui.dear(inviteeName)}
            </motion.p>
          )}

          <motion.div
            className="flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.35 }}
          >
            <span className="h-px w-7 shrink-0 md:w-10" style={{ backgroundColor: alpha(palette.primary, 0.45) }} />
            <p className="text-[10px] uppercase leading-relaxed tracking-[0.32em] md:text-[11px] md:tracking-[0.44em]" style={{ color: alpha(palette.ink, 0.66) }}>
              {inviteeName ? ui.youAreInvited : eyebrow}
            </p>
            <span className="h-px w-7 shrink-0 md:w-10" style={{ backgroundColor: alpha(palette.primary, 0.45) }} />
          </motion.div>

          <h1
            className="mt-6 font-light md:mt-8"
            style={{
              fontFamily: palette.displayFont,
              color: palette.ink,
              fontSize: "clamp(2.9rem, 9.2vw, 6.4rem)",
              lineHeight: 0.98,
              letterSpacing: "0.005em",
            }}
          >
            <span className="block">
              <RisingText text={wedding.partner1_name} delay={0.55} stagger={0.055} />
            </span>
            {twoNames && (
              <>
                <motion.span
                  className="my-1 block text-[0.34em] md:my-2"
                  style={{ fontFamily: palette.scriptFont, color: palette.primary }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 1.15, ease: EASE_OUT }}
                >
                  {conjunction}
                </motion.span>
                <span className="block">
                  <RisingText text={wedding.partner2_name} delay={1.35} stagger={0.055} />
                </span>
              </>
            )}
          </h1>

          {wedding.wedding_date && (
            <div className="mt-7 md:mt-9">
              <DateLine date={wedding.wedding_date} palette={palette} delay={1.95} color={palette.ink} />
            </div>
          )}

          {wedding.venue_name && (
            <motion.p
              className="mt-4 max-w-[20rem] text-[10px] uppercase leading-relaxed tracking-[0.32em] md:mt-5 md:text-[11px]"
              style={{ color: alpha(palette.ink, 0.56) }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 2.35 }}
            >
              {wedding.venue_name}
            </motion.p>
          )}
        </motion.div>

        {/* Full-bleed watercolour ceremony aisle, fading into the paper. */}
        <div className="relative z-0 h-[49svh] w-full overflow-hidden md:h-[53svh]">
          <motion.div {...artEntrance} className="absolute inset-0">
            <Image
              src={art.heroPortrait.src}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 390px"
              placeholder="blur"
              blurDataURL={art.heroPortrait.blurDataURL}
              className="object-cover md:hidden"
              style={{ objectPosition: "50% 58%", filter: imageFilter }}
            />
            <Image
              src={art.hero.src}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1180px"
              placeholder="blur"
              blurDataURL={art.hero.blurDataURL}
              className="hidden object-cover md:block"
              style={{ objectPosition: "50% 60%", filter: imageFilter }}
            />

            {/* Warm tint + paper fade at the top so the painting joins the card. */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundColor: alpha(palette.primary, palette.isDark ? 0.16 : 0.035),
                mixBlendMode: palette.isDark ? "soft-light" : "multiply",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-[42%]"
              style={{ background: `linear-gradient(180deg, ${palette.background} 0%, ${alpha(palette.background, 0.86)} 30%, ${alpha(palette.background, 0)} 100%)` }}
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-16"
              style={{ background: `linear-gradient(0deg, ${alpha(palette.background, 0.55)} 0%, transparent 100%)` }}
            />
          </motion.div>

          <Dove className="left-[12%] top-[12%] w-10 md:w-14" delay={2.1} drift={24} />
          <Dove className="right-[16%] top-[18%] w-8 md:w-11" delay={4.2} drift={-18} />
          <Dove className="left-[40%] top-[6%] w-7 md:w-9" delay={6.1} drift={16} />
        </div>
      </div>
    </>
  );
}
