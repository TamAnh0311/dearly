"use client";

/**
 * AtelierHero — the painted-garden opening layout.
 *
 * A framed watercolour painting hangs in an arched panel on the right (a
 * cropped print below the type on phones). Crisp botanical cut-outs spill out
 * of the frame and across the paper, while the names sit in restrained
 * letterpress typography. All artwork is tinted and feathered from the palette
 * so the fixed painting keeps working under every colour scheme.
 */

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { getArtCollection } from "../art";
import { EASE_OUT, alpha } from "../utils";
import { Ampersand, DateLine, RisingText, useEventCopy, useEyebrow, useInvitationCopy } from "./HeroParts";
import type { LayoutProps } from "./Hero";

const ARCH = "999px 999px 1.25rem 1.25rem";

export function AtelierHero({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const { copy, inviteeName, twoNames } = useEventCopy();
  const ui = useInvitationCopy();
  const eyebrow = useEyebrow("Together with their families");
  const reduce = useReducedMotion();
  const art = getArtCollection(palette.style.art);
  if (!art) return null;

  const imageFilter = palette.isDark ? "brightness(0.74) saturate(0.9)" : "saturate(1.06) contrast(1.04)";

  const artEntrance = reduce
    ? { initial: false as const, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, scale: 1.04, y: 18 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { duration: 1.7, ease: EASE_OUT },
      };

  const sprayEntrance = (delay: number, from: string) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1, rotate: 0, y: 0 } }
      : {
          initial: { opacity: 0, rotate: from, y: 28 },
          animate: { opacity: 1, rotate: 0, y: 0 },
          transition: { duration: 1.5, delay, ease: EASE_OUT },
        };

  return (
    <>
      {/* Paper wash: a faint bloom of the scheme's colours behind the type. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 52% 44% at 24% 34%, ${alpha(palette.primary, palette.isDark ? 0.17 : 0.1)} 0%, transparent 68%),
                       radial-gradient(ellipse 42% 36% at 8% 96%, ${alpha(palette.leaf, 0.15)} 0%, transparent 70%)`,
        }}
      />

      {/* Cherry blossom branch entering from the lower-left on wide screens. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-16 z-0 hidden w-[33%] max-w-lg md:block"
        {...sprayEntrance(0.9, "-18deg")}
      >
        <Image
          src={art.sprays.cherry.src}
          alt=""
          width={art.sprays.cherry.width}
          height={art.sprays.cherry.height}
          className="h-auto w-full -rotate-4"
          style={{ filter: imageFilter }}
        />
      </motion.div>

      <div className="relative z-10 grid min-h-[100svh] w-full grid-cols-1 items-stretch md:grid-cols-[52%_48%]">
        {/* ── Type ── */}
        <motion.div
          className="relative z-20 flex flex-col items-center justify-center px-7 pb-8 pt-24 text-center md:items-start md:px-12 md:py-28 md:text-left lg:px-20"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          {inviteeName && (
            <motion.p
              className="mb-3 text-2xl md:text-3xl"
              style={{ fontFamily: palette.scriptFont, color: palette.primary }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE_OUT }}
            >
              {ui.dear(inviteeName)}
            </motion.p>
          )}

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.3 }}
          >
            <span className="h-px w-8 shrink-0" style={{ backgroundColor: palette.primary, opacity: 0.55 }} />
            <p className="text-[10px] uppercase tracking-[0.3em] md:text-[11px] md:tracking-[0.42em]" style={{ color: alpha(palette.ink, 0.64) }}>
              {inviteeName ? (
                <>
                  <span className="md:hidden">{ui.youAreInvited}</span>
                  <span className="hidden md:inline">{ui.youAreInvitedTo(copy.label)}</span>
                </>
              ) : (
                eyebrow
              )}
            </p>
            <span className="h-px w-8 shrink-0 md:hidden" style={{ backgroundColor: palette.primary, opacity: 0.55 }} />
          </motion.div>

          <h1
            className="mt-7 font-light leading-[0.9]"
            style={{
              fontFamily: palette.displayFont,
              color: palette.ink,
              fontSize: "clamp(3.4rem, 10.5vw, 7rem)",
              letterSpacing: "-0.018em",
            }}
          >
            <span className="block">
              <RisingText text={wedding.partner1_name} delay={0.45} stagger={0.055} />
            </span>
            <Ampersand palette={palette} delay={1.05} className="my-2 text-[0.46em] md:my-1" />
            {twoNames && (
              <span className="block">
                <RisingText text={wedding.partner2_name} delay={1.25} stagger={0.055} />
              </span>
            )}
          </h1>

          {wedding.wedding_date && (
            <div className="mt-9">
              <DateLine date={wedding.wedding_date} palette={palette} delay={1.85} color={palette.ink} />
            </div>
          )}

          {wedding.venue_name && (
            <p
              className="mt-5 max-w-[19rem] text-[10px] uppercase leading-relaxed tracking-[0.32em] md:max-w-sm"
              style={{ color: alpha(palette.ink, 0.6) }}
            >
              {wedding.venue_name}
            </p>
          )}

          <motion.div
            className="mt-10 hidden items-center gap-3 md:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 2.4 }}
            aria-hidden
          >
            <span className="h-px w-16" style={{ backgroundColor: alpha(palette.primary, 0.5) }} />
            <span className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: alpha(palette.primary, 0.75) }} />
          </motion.div>
        </motion.div>

        {/* ── Framed painting ── */}
        <div className="relative z-0 flex min-h-[42svh] items-stretch px-5 pb-0 pt-2 md:min-h-[100svh] md:px-0 md:py-8 md:pr-8">
          <motion.div {...artEntrance} className="relative h-full w-full">
            <div
              className="relative h-full w-full"
              style={{
                borderRadius: ARCH,
                border: `1px solid ${alpha(palette.primary, 0.42)}`,
                padding: 6,
                backgroundColor: alpha(palette.background, 0.55),
              }}
            >
              <div className="relative h-full min-h-[38svh] w-full overflow-hidden md:min-h-0" style={{ borderRadius: ARCH }}>
                <Image
                  src={art.heroPortrait.src}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  placeholder="blur"
                  blurDataURL={art.heroPortrait.blurDataURL}
                  className="object-cover md:hidden"
                  style={{ objectPosition: "50% 56%", filter: imageFilter }}
                />
                <Image
                  src={art.hero.src}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 46vw"
                  placeholder="blur"
                  blurDataURL={art.hero.blurDataURL}
                  className="hidden object-cover md:block"
                  style={{ objectPosition: "50% 52%", filter: imageFilter }}
                />

                {/* Warm wash + inner vignette so the fixed painting joins the scheme. */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundColor: alpha(palette.primary, palette.isDark ? 0.16 : 0.04),
                    mixBlendMode: palette.isDark ? "soft-light" : "multiply",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ boxShadow: `inset 0 0 110px 18px ${alpha(palette.background, palette.isDark ? 0.5 : 0.18)}` }}
                />
                {/* Soft top fade so the arch is not a hard cut-out of the sky. */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-20"
                  style={{ background: `linear-gradient(180deg, ${alpha(palette.background, palette.isDark ? 0.5 : 0.22)} 0%, transparent 100%)` }}
                />
              </div>
            </div>

            {/* Peony spilling over the frame. */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-10 top-[9%] z-10 w-32 md:-left-16 md:w-44 lg:-left-20 lg:w-52"
              {...sprayEntrance(1.05, "-16deg")}
            >
              <Image
                src={art.sprays.peony.src}
                alt=""
                width={art.sprays.peony.width}
                height={art.sprays.peony.height}
                className="h-auto w-full -rotate-12"
                style={{ filter: imageFilter }}
              />
            </motion.div>

            {/* Eucalyptus rising from the lower corner. */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -bottom-10 -right-6 z-10 w-32 md:-right-8 md:w-44 lg:w-52"
              {...sprayEntrance(1.3, "16deg")}
            >
              <Image
                src={art.sprays.eucalyptus.src}
                alt=""
                width={art.sprays.eucalyptus.width}
                height={art.sprays.eucalyptus.height}
                className="h-auto w-full rotate-12"
                style={{ filter: imageFilter }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
