"use client";

/**
 * HeroParty — celebration-collection openings.
 *
 * BalloonHero builds a floating balloon garland around poster-scale type.
 * ConfettiHero frames the same type in a die-cut invitation ticket while a
 * single confetti burst fires behind it. Both are deliberately photo-free:
 * the host name and the date are the artwork.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { hostNames } from "@/lib/event-types";
import AmbientLayer from "../effects/Ambient";
import { EASE_OUT, alpha, formatLongDate, mix, seeded } from "../utils";
import { DateLine, Eyebrow, ReplayButton, useEventCopy, useEyebrow, useInvitationCopy } from "./HeroParts";
import { useHeroOpening } from "../use-hero-opening";
import type { LayoutProps } from "./Hero";

function titleOf(wedding: LayoutProps["wedding"]): string {
  return wedding.event_title?.trim() || hostNames(wedding) || wedding.partner1_name;
}

/** Word-by-word rise that still wraps when an event title is long. */
function RiseWords({ text, delay, className = "" }: { text: string; delay: number; className?: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span className={`inline-flex flex-wrap justify-center ${className}`}>
      <span aria-hidden className="inline-flex flex-wrap justify-center">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] pr-[0.22em]">
            <motion.span
              className="inline-block"
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 1.05, delay: delay + i * 0.075, ease: EASE_OUT }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

/** One latex balloon with knot, highlight and a gently swaying string. */
function Balloon({
  color,
  className,
  delay,
  rotate,
}: {
  color: string;
  className: string;
  delay: number;
  rotate: number;
}) {
  const reduce = useReducedMotion();
  const light = mix(color, "#ffffff", 0.58);
  const dark = mix(color, "#000000", 0.3);
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      initial={reduce ? false : { opacity: 0, y: 90, scale: 0.86 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.3, delay, ease: EASE_OUT }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -9, 0], rotate: [rotate - 1.5, rotate + 1.5, rotate - 1.5] }}
        transition={reduce ? undefined : { duration: 6 + seeded(delay * 100) * 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="relative aspect-[4/5] w-full"
          style={{
            borderRadius: "50% 50% 47% 47% / 52% 52% 48% 48%",
            background: `radial-gradient(circle at 32% 26%, ${light} 0%, ${color} 44%, ${dark} 100%)`,
            boxShadow: `inset -10px -12px 24px ${alpha(dark, 0.34)}, 0 18px 40px ${alpha(color, 0.18)}`,
          }}
        >
          <span
            className="absolute left-[20%] top-[16%] h-[28%] w-[18%] rounded-full"
            style={{ background: alpha("#ffffff", 0.42), filter: "blur(1px)" }}
          />
          <span
            className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2"
            style={{ background: dark, clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
          />
        </div>
        <svg viewBox="0 0 24 92" className="mx-auto -mt-1 h-[7rem] w-6 opacity-70" aria-hidden>
          <path d="M12 0 C 5 18, 19 31, 11 47 C 4 62, 16 76, 12 92" fill="none" stroke={dark} strokeWidth="0.9" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

const POP_BALLOONS = [
  { className: "left-[7%] top-[34%] w-[clamp(4rem,17vw,6.6rem)]", color: 0, rotate: -8 },
  { className: "left-[36%] top-[31%] w-[clamp(3.4rem,14vw,5.4rem)]", color: 1, rotate: 5 },
  { className: "right-[7%] top-[36%] w-[clamp(4.2rem,18vw,7rem)]", color: 2, rotate: 7 },
  { className: "left-[17%] top-[64%] w-[clamp(3.8rem,16vw,6rem)]", color: 1, rotate: 6 },
  { className: "right-[17%] top-[66%] w-[clamp(4rem,17vw,6.4rem)]", color: 0, rotate: -5 },
] as const;

/** A balloon that is also the opening button. */
function PoppingBalloon({
  color,
  className,
  index,
  total,
  popped,
  ink,
  rotate,
  onPop,
}: {
  color: string;
  className: string;
  index: number;
  total: number;
  popped: boolean;
  ink: string;
  rotate: number;
  onPop: () => void;
}) {
  const light = mix(color, "#ffffff", 0.58);
  const dark = mix(color, "#000000", 0.3);
  return (
    <motion.button
      type="button"
      aria-label={`Pop balloon ${index + 1} of ${total}`}
      disabled={popped}
      onClick={onPop}
      className={`group absolute flex flex-col items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 ${className}`}
      style={{ outlineColor: ink }}
      initial={{ opacity: 0, y: 40, rotate }}
      animate={popped ? { opacity: 0, scale: 0.2, y: -18, rotate: rotate + 24 } : { opacity: 1, scale: 1, y: 0, rotate }}
      transition={
        popped
          ? { duration: 0.35, ease: "easeOut" }
          : { type: "spring", stiffness: 120, damping: 14, delay: 0.18 + index * 0.07 }
      }
      whileHover={popped ? undefined : { scale: 1.07, rotate: rotate + 2 }}
      whileTap={popped ? undefined : { scale: 0.9 }}
    >
      <motion.div
        aria-hidden
        className="relative aspect-[4/5] w-full"
        style={{
          borderRadius: "50% 50% 47% 47% / 52% 52% 48% 48%",
          background: `radial-gradient(circle at 32% 26%, ${light} 0%, ${color} 44%, ${dark} 100%)`,
          boxShadow: `inset -10px -12px 24px ${alpha(dark, 0.34)}, 0 18px 40px ${alpha(color, 0.2)}`,
        }}
        animate={popped ? undefined : { y: [0, -7, 0] }}
        transition={popped ? undefined : { duration: 4.5 + index, repeat: Infinity, ease: "easeInOut" }}
      >
        <span
          className="absolute left-[20%] top-[16%] h-[28%] w-[18%] rounded-full"
          style={{ background: alpha("#ffffff", 0.44), filter: "blur(1px)" }}
        />
        <span
          className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2"
          style={{ background: dark, clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
        />
      </motion.div>
      <svg viewBox="0 0 24 74" className="mx-auto -mt-1 h-16 w-5 opacity-70" aria-hidden>
        <path d="M12 0 C 5 15, 19 25, 11 39 C 5 51, 16 61, 12 74" fill="none" stroke={dark} strokeWidth="0.9" />
      </svg>
    </motion.button>
  );
}

function BalloonReveal({
  palette,
  title,
  date,
  popped,
  onPop,
  onSkip,
  ui,
}: {
  palette: LayoutProps["palette"];
  title: string;
  date: string | null;
  popped: number[];
  onPop: (index: number) => void;
  onSkip: () => void;
  ui: { skipOpening: string; popToOpen: string; invitationWaiting: string };
}) {
  const colors = [palette.primary, palette.accent, ...palette.petals];
  const total = POP_BALLOONS.length;
  return (
    <motion.div
      className="absolute inset-0 z-30 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: EASE_OUT } }}
      style={{
        backgroundColor: palette.background,
        backgroundImage: `radial-gradient(ellipse 62% 48% at 50% 30%, ${alpha(palette.primary, palette.isDark ? 0.25 : 0.14)} 0%, transparent 72%),
                          radial-gradient(ellipse 50% 36% at 10% 92%, ${alpha(palette.accent, 0.16)} 0%, transparent 72%)`,
      }}
    >
      <div className="absolute inset-x-0 top-[9%] z-10 px-6 text-center">
        <motion.p
          className="text-[10px] uppercase tracking-[0.42em]"
          style={{ color: palette.inkMuted }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          {ui.invitationWaiting}
        </motion.p>
        <motion.h2
          className="mx-auto mt-3 max-w-[20ch] text-3xl font-medium text-balance sm:text-5xl"
          style={{ fontFamily: palette.displayFont, color: palette.ink, letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT }}
        >
          {title}
        </motion.h2>
        {date && (
          <p className="mt-2 text-[10px] uppercase tracking-[0.34em]" style={{ color: palette.inkMuted }}>
            {date}
          </p>
        )}
        <p className="mt-3 text-xs uppercase tracking-[0.24em]" style={{ color: palette.ink }}>
          {ui.popToOpen}
        </p>
        <p className="mt-2 text-xs" style={{ color: palette.inkMuted }} aria-live="polite">
          {popped.length} of {total} popped
        </p>
      </div>

      {POP_BALLOONS.map((b, i) => (
        <PoppingBalloon
          key={i}
          color={colors[b.color % colors.length]}
          className={b.className}
          index={i}
          total={total}
          popped={popped.includes(i)}
          ink={palette.ink}
          rotate={b.rotate}
          onPop={() => onPop(i)}
        />
      ))}

      <button
        type="button"
        onClick={onSkip}
        className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2 border-b px-1 py-1 text-[10px] uppercase tracking-[0.32em] transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ borderColor: alpha(palette.ink, 0.35), color: palette.inkMuted, outlineColor: palette.ink }}
      >
        {ui.skipOpening}
      </button>
    </motion.div>
  );
}

const BALLOON_LAYOUT = [
  { className: "left-[-4%] top-[7%] w-[clamp(4.5rem,15vw,9rem)]", color: 0, delay: 0.25, rotate: -7 },
  { className: "left-[16%] top-[1%] w-[clamp(3.4rem,10vw,6.5rem)]", color: 1, delay: 0.45, rotate: 5 },
  { className: "right-[15%] top-[0%] w-[clamp(3.8rem,11vw,7rem)]", color: 2, delay: 0.6, rotate: -4 },
  { className: "right-[-5%] top-[9%] w-[clamp(4.8rem,16vw,9.5rem)]", color: 1, delay: 0.35, rotate: 8 },
  { className: "left-[-2%] top-[43%] w-[clamp(2.8rem,8vw,5rem)] hidden sm:block", color: 2, delay: 0.85, rotate: 6 },
  { className: "right-[-2%] top-[45%] w-[clamp(3rem,8vw,5.2rem)] hidden sm:block", color: 0, delay: 0.9, rotate: -6 },
] as const;

export function BalloonHero({ wedding, palette, personalInvite = false, contentY, contentOpacity }: LayoutProps) {
  const reduce = useReducedMotion();
  const { copy } = useEventCopy();
  const ui = useInvitationCopy();
  const eyebrow = useEyebrow("You're invited to celebrate");
  const title = titleOf(wedding);
  const date = wedding.wedding_date ? formatLongDate(wedding.wedding_date, null, ui.dateLocale) : null;
  const balloonColors = [palette.primary, palette.accent, ...palette.petals];
  const [popped, setPopped] = useState<number[]>([]);
  const { revealed: openingRevealed, open, replay } = useHeroOpening(`dearly-open-balloons-${wedding.id}`, personalInvite);
  const revealed = reduce === true || openingRevealed;

  useEffect(() => {
    if (popped.length === POP_BALLOONS.length) open();
  }, [popped.length, open]);

  return (
    <>
      <div className="absolute inset-0" aria-hidden={!revealed} {...(!revealed ? { inert: true } : {})}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 62% 46% at 50% 38%, ${alpha(palette.primary, palette.isDark ? 0.22 : 0.12)} 0%, transparent 72%),
                       radial-gradient(ellipse 45% 30% at 8% 92%, ${alpha(palette.accent, 0.14)} 0%, transparent 72%)`,
        }}
      />

      {BALLOON_LAYOUT.map((b, i) => (
        <Balloon
          key={i}
          color={balloonColors[b.color % balloonColors.length]}
          className={b.className}
          delay={reduce ? 0 : b.delay}
          rotate={b.rotate}
        />
      ))}

      {/* Loose confetti drifting through the scene. */}
      {Array.from({ length: 16 }, (_, i) => {
        const color = balloonColors[i % balloonColors.length];
        return (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute z-[1] block rounded-[1px]"
            style={{
              left: `${4 + seeded(i + 310) * 92}%`,
              top: `${8 + seeded(i + 340) * 76}%`,
              width: 5 + seeded(i + 350) * 5,
              height: 2 + seeded(i + 360) * 3,
              background: color,
              opacity: 0.65,
            }}
            animate={reduce ? undefined : { y: [0, -14, 0], rotate: [0, 70, 0] }}
            transition={reduce ? undefined : { duration: 7 + seeded(i + 370) * 6, repeat: Infinity, ease: "easeInOut", delay: seeded(i + 380) * 3 }}
          />
        );
      })}

      <AmbientLayer palette={palette} intensity={0.7} />

      <motion.div
        className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-6 pb-32 pt-24 text-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <Eyebrow text={eyebrow} color={palette.inkMuted} delay={0.7} />
        <h1
          className="mt-6 max-w-[15ch] font-medium text-balance"
          style={{
            fontFamily: palette.displayFont,
            color: palette.ink,
            fontSize: "clamp(2.9rem, 11.5vw, 6.8rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.025em",
            textShadow: `0 2px 30px ${alpha(palette.background, 0.55)}`,
          }}
        >
          <RiseWords text={title} delay={1.1} />
        </h1>

        {!wedding.event_title && (
          <motion.p
            className="mt-5 text-2xl md:text-3xl"
            style={{ fontFamily: palette.scriptFont, color: palette.primary }}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2, ease: EASE_OUT }}
          >
            {copy.tagline(title)}
          </motion.p>
        )}

        <motion.div
          className="mt-8 flex flex-col items-center gap-2 border-y px-5 py-3 text-[10px] uppercase tracking-[0.3em] sm:flex-row sm:gap-4 sm:text-[11px]"
          style={{ borderColor: alpha(palette.ink, 0.18), color: palette.inkMuted }}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.35, ease: EASE_OUT }}
        >
          {wedding.wedding_date && <span>{formatLongDate(wedding.wedding_date, null, ui.dateLocale)}</span>}
          {wedding.wedding_date && wedding.venue_name && (
            <span aria-hidden className="h-1 w-1 rounded-full" style={{ backgroundColor: palette.primary }} />
          )}
          {wedding.venue_name && <span>{wedding.venue_name}</span>}
        </motion.div>
      </motion.div>
      </div>

      <AnimatePresence>
        {!revealed && (
          <BalloonReveal
            palette={palette}
            title={title}
            date={date}
            popped={popped}
            onPop={(index) => setPopped((prev) => (prev.includes(index) ? prev : [...prev, index]))}
            onSkip={() => setPopped(POP_BALLOONS.map((_, index) => index))}
            ui={ui}
          />
        )}
      </AnimatePresence>
      {revealed && !personalInvite && <ReplayButton onClick={() => { setPopped([]); replay(); }} color={palette.inkMuted} />}
    </>
  );
}

/** A single confetti cannon burst drawn behind the ticket. */
function ConfettiBurst({ colors }: { colors: string[] }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 400 400" className="pointer-events-none absolute left-1/2 top-[44%] z-[1] w-[min(190vw,1100px)] -translate-x-1/2 -translate-y-1/2" aria-hidden>
      <g transform="translate(200 200)">
        {Array.from({ length: 30 }, (_, i) => {
          const angle = (i / 30) * Math.PI * 2 + seeded(i + 470) * 0.16;
          const distance = 78 + seeded(i + 480) * 128;
          return (
            <motion.rect
              key={i}
              x={-2.4}
              y={-7}
              width={4.8}
              height={14}
              rx={1}
              fill={colors[i % colors.length]}
              initial={reduce ? { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, opacity: 0.45, rotate: angle * 57.3 } : { x: 0, y: 0, opacity: 0, rotate: 0 }}
              animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, opacity: 0.45, rotate: angle * 57.3 }}
              transition={{ duration: 1.7, delay: reduce ? 0 : 0.25 + seeded(i + 490) * 0.35, ease: EASE_OUT }}
            />
          );
        })}
      </g>
    </svg>
  );
}

function PartyPopper({ palette }: { palette: LayoutProps["palette"] }) {
  return (
    <svg viewBox="0 0 220 240" className="w-28 sm:w-36" aria-hidden>
      <g transform="rotate(-32 110 118)">
        <path d="M91 48 L139 48 L163 174 L67 174 Z" fill={palette.primary} />
        <path d="M91 48 L139 48 L146 80 L84 80 Z" fill={palette.accent} />
        <path d="M81 112 L149 112 L157 146 L73 146 Z" fill={palette.background} opacity={0.9} />
        <path d="M72 168 L158 168 L163 174 L67 174 Z" fill={palette.accent} />
        <ellipse cx="115" cy="48" rx="24" ry="7" fill={palette.background} opacity={0.7} />
      </g>
      {[
        [58, 30, palette.accent],
        [88, 16, palette.petals[0]],
        [148, 22, palette.petals[1]],
        [170, 48, palette.primary],
      ].map(([x, y, color], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={4 + (i % 2) * 1.5}
          fill={color as string}
          animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4 + i * 0.35, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <motion.g animate={{ y: [0, 3, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
        <path d="M113 176 C 124 195, 101 207, 112 223" fill="none" stroke={palette.ink} strokeWidth="1.4" />
        <circle cx="112" cy="226" r="9" fill="none" stroke={palette.primary} strokeWidth="2" />
      </motion.g>
    </svg>
  );
}

function ConfettiReveal({
  palette,
  title,
  date,
  onOpen,
  onSkip,
  ui,
}: {
  palette: LayoutProps["palette"];
  title: string;
  date: string | null;
  onOpen: () => void;
  onSkip: () => void;
  ui: { skipOpening: string; invitationWaiting: string };
}) {
  return (
    <motion.div
      className="absolute inset-0 z-30 overflow-hidden"
      exit={{ y: "-100%", transition: { duration: 1.05, ease: EASE_OUT } }}
      style={{
        backgroundColor: palette.background,
        backgroundImage: `radial-gradient(ellipse 62% 48% at 50% 34%, ${alpha(palette.primary, palette.isDark ? 0.26 : 0.15)} 0%, transparent 72%),
                          radial-gradient(ellipse 50% 34% at 90% 96%, ${alpha(palette.accent, 0.17)} 0%, transparent 72%)`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[24%] top-[-12%] h-[52vh] w-[86vw] rotate-[-18deg]"
        style={{ background: alpha(palette.primary, palette.isDark ? 0.1 : 0.06), clipPath: "polygon(0 0, 100% 0, 48% 100%, 0 78%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[26%] bottom-[-14%] h-[54vh] w-[88vw] rotate-[14deg]"
        style={{ background: alpha(palette.accent, palette.isDark ? 0.12 : 0.07), clipPath: "polygon(42% 0, 100% 18%, 100% 100%, 0 100%)" }}
      />

      <div className="absolute inset-x-0 top-[10%] z-10 px-6 text-center">
        <motion.p
          className="text-[10px] uppercase tracking-[0.42em]"
          style={{ color: palette.inkMuted }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          {ui.invitationWaiting}
        </motion.p>
        <motion.h2
          className="mx-auto mt-3 max-w-[20ch] text-3xl uppercase text-balance sm:text-5xl"
          style={{ fontFamily: palette.bodyFont, fontWeight: 600, color: palette.ink, letterSpacing: "-0.03em" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT }}
        >
          {title}
        </motion.h2>
        {date && (
          <p className="mt-2 text-[10px] uppercase tracking-[0.34em]" style={{ color: palette.inkMuted }}>
            {date}
          </p>
        )}
        <p className="mt-3 text-[10px] uppercase tracking-[0.24em]" style={{ color: palette.ink }}>
          Pull the string to open
        </p>
      </div>

      <motion.button
        type="button"
        aria-label="Pull the string to open the invitation"
        onClick={onOpen}
        className="group absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8"
        style={{ outlineColor: palette.ink }}
        initial={{ opacity: 0, y: 22, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT }}
        whileHover={{ scale: 1.04, rotate: -1 }}
        whileTap={{ scale: 0.94 }}
      >
        <PartyPopper palette={palette} />
        <span className="mt-2 text-xs uppercase tracking-[0.32em]" style={{ color: palette.inkMuted }}>
          tap or press enter
        </span>
      </motion.button>

      <button
        type="button"
        onClick={onSkip}
        className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2 border-b px-1 py-1 text-[10px] uppercase tracking-[0.32em] transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ borderColor: alpha(palette.ink, 0.35), color: palette.inkMuted, outlineColor: palette.ink }}
      >
        {ui.skipOpening}
      </button>
    </motion.div>
  );
}

export function ConfettiHero({ wedding, palette, personalInvite = false, contentY, contentOpacity }: LayoutProps) {
  const reduce = useReducedMotion();
  const { copy } = useEventCopy();
  const ui = useInvitationCopy();
  const eyebrow = useEyebrow("You're invited to celebrate");
  const title = titleOf(wedding);
  const date = wedding.wedding_date ? formatLongDate(wedding.wedding_date, null, ui.dateLocale) : null;
  const confetti = [palette.primary, palette.accent, ...palette.petals];
  const { revealed: openingRevealed, open, replay } = useHeroOpening(`dearly-open-confetti-${wedding.id}`, personalInvite);
  const revealed = reduce === true || openingRevealed;

  return (
    <>
      <div className="absolute inset-0" aria-hidden={!revealed} {...(!revealed ? { inert: true } : {})}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(145deg, ${mix(palette.background, palette.primary, palette.isDark ? 0.14 : 0.07)} 0%, ${palette.background} 42%, ${mix(palette.background, palette.accent, palette.isDark ? 0.16 : 0.08)} 100%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[18%] top-[-12%] h-[55vh] w-[80vw] rotate-[-14deg]"
        style={{ background: alpha(palette.primary, palette.isDark ? 0.1 : 0.06), clipPath: "polygon(0 0, 100% 0, 48% 100%, 0 78%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] bottom-[-16%] h-[58vh] w-[82vw] rotate-[12deg]"
        style={{ background: alpha(palette.accent, palette.isDark ? 0.12 : 0.07), clipPath: "polygon(42% 0, 100% 18%, 100% 100%, 0 100%)" }}
      />

      {revealed && <ConfettiBurst colors={confetti} />}
      <AmbientLayer palette={palette} intensity={0.55} />

      <motion.div
        className="relative z-10 flex min-h-[100svh] w-full items-center justify-center px-5 pb-32 pt-24 sm:px-8"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          className="relative w-[min(90vw,640px)] px-7 py-9 text-center sm:px-12 sm:py-12"
          style={{
            backgroundColor: palette.background,
            border: `1px solid ${alpha(palette.ink, 0.18)}`,
            borderRadius: palette.radius.card,
            boxShadow: `12px 14px 0 ${alpha(palette.primary, 0.24)}, 0 30px 80px ${alpha(palette.ink, 0.13)}`,
          }}
          initial={reduce ? false : { opacity: 0, y: 52, rotate: -2.5, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: EASE_OUT }}
        >
          <span
            aria-hidden
            className="absolute inset-x-10 top-0 h-1.5"
            style={{ backgroundColor: palette.primary, borderBottomLeftRadius: 99, borderBottomRightRadius: 99 }}
          />
          <motion.span
            aria-hidden
            className="absolute -right-2 -top-5 select-none px-3 py-1 text-xl sm:-right-4 sm:text-2xl"
            style={{ fontFamily: palette.scriptFont, color: palette.accent, backgroundColor: palette.background, border: `1px solid ${alpha(palette.accent, 0.35)}`, borderRadius: 999 }}
            initial={reduce ? false : { opacity: 0, scale: 0.4, rotate: 18 }}
            animate={{ opacity: 1, scale: 1, rotate: 8 }}
            transition={{ type: "spring", stiffness: 180, damping: 11, delay: 1.5 }}
          >
            {ui.lang === "vi" ? "bùm!" : "pop!"}
          </motion.span>

          <Eyebrow text={eyebrow} color={palette.inkMuted} delay={0.8} />

          <h1
            className="mt-6 text-balance uppercase"
            style={{
              fontFamily: palette.bodyFont,
              fontWeight: 600,
              color: palette.ink,
              fontSize: "clamp(2.2rem, 8.6vw, 4.8rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
            }}
          >
            <RiseWords text={title} delay={1.15} />
          </h1>

          {!wedding.event_title && (
            <motion.p
              className="mt-4 text-2xl sm:text-3xl"
              style={{ fontFamily: palette.scriptFont, color: palette.primary }}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 2.05, ease: EASE_OUT }}
            >
              {copy.tagline(title)}
            </motion.p>
          )}

          <div className="mt-7 border-t border-dashed pt-5" style={{ borderColor: alpha(palette.ink, 0.22) }}>
            {wedding.wedding_date && <DateLine date={wedding.wedding_date} palette={palette} delay={2.3} />}
            {wedding.venue_name && (
              <motion.p
                className="mt-3 text-[10px] uppercase tracking-[0.32em] sm:text-[11px]"
                style={{ color: palette.inkMuted }}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.6 }}
              >
                {wedding.venue_name}
              </motion.p>
            )}
          </div>

        </motion.div>
      </motion.div>
      </div>

      <AnimatePresence>
        {!revealed && (
          <ConfettiReveal palette={palette} title={title} date={date} onOpen={open} onSkip={open} ui={ui} />
        )}
      </AnimatePresence>
      {revealed && !personalInvite && <ReplayButton onClick={replay} color={palette.inkMuted} />}
    </>
  );
}
