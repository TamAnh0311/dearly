"use client";

/**
 * Signature hero layouts — theatrical openings that go beyond a static cover:
 *
 *  (CurtainHero — velvet theatre / garden gates — lives in HeroCurtain.tsx)
 *  - SealHero      a wax seal cracks, the envelope flap lifts and the letter rises out
 *  - DayNightHero  the sky turns from golden hour to a starry night as the sun sets
 *  - StainedHero   a rose window draws its leading, then glows in jewel tones
 *
 * All share the LayoutProps contract from Hero.tsx and respect reduced motion.
 */

import { motion, useReducedMotion } from "framer-motion";
import AmbientLayer from "../effects/Ambient";
import { TwinklingStars } from "../effects/Particles";
import { EASE_OUT, alpha, formatDotDate, formatLongDate, mix, type InvitationPalette } from "../utils";
import { Ampersand, CenterNames } from "./HeroParts";
import type { LayoutProps } from "./Hero";

/* ─── Wax seal letter ─────────────────────────────────────────────────────── */

/** Embossed wax seal with the couple's initials. */
function WaxSeal({ palette, initials }: { palette: InvitationPalette; initials: string }) {
  const wax = palette.primary;
  return (
    <div
      className="relative flex h-20 w-20 items-center justify-center md:h-24 md:w-24"
      style={{
        borderRadius: "48% 52% 50% 50% / 52% 48% 52% 48%",
        background: `radial-gradient(circle at 35% 30%, ${mix(wax, "#ffffff", 0.35)}, ${wax} 45%, ${mix(wax, "#000000", 0.35)} 100%)`,
        boxShadow: `0 6px 14px ${alpha(mix(wax, "#000000", 0.5), 0.5)}, inset 0 -3px 6px rgba(0,0,0,0.3)`,
      }}
    >
      <span
        className="flex h-[70%] w-[70%] items-center justify-center rounded-full text-2xl md:text-3xl"
        style={{
          border: `1.5px solid ${alpha("#ffffff", 0.35)}`,
          color: alpha("#ffffff", 0.85),
          fontFamily: palette.scriptFont,
          textShadow: "0 -1px 0 rgba(0,0,0,0.35)",
        }}
      >
        {initials}
      </span>
    </div>
  );
}

export function SealHero({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const reduce = useReducedMotion();
  const paper = palette.isDark ? mix(palette.background, "#ffffff", 0.08) : mix(palette.background, "#ffffff", 0.6);
  const envelope = palette.isDark ? mix(palette.background, "#ffffff", 0.14) : mix(palette.background, palette.accent, 0.35);
  const initials = `${wedding.partner1_name.charAt(0)}&${wedding.partner2_name.charAt(0)}`;
  const t = reduce ? 0 : 1;

  return (
    <>
      <AmbientLayer palette={palette} intensity={0.8} />
      <motion.div className="relative z-10 mt-24 w-[min(92vw,560px)]" style={{ y: contentY, opacity: contentOpacity }}>
        <div className="relative aspect-[1.45] w-full" style={{ perspective: 1600 }}>
          {/* Envelope back */}
          <div className="absolute inset-0 rounded-md shadow-2xl" style={{ background: envelope }} />

          {/* Letter rising out of the envelope */}
          <motion.div
            className="absolute inset-x-[5%] top-[6%] z-10 flex flex-col items-center rounded-sm px-6 pb-8 pt-10 text-center shadow-xl md:px-10"
            style={{
              background: paper,
              border: `1px solid ${alpha(palette.primary, 0.25)}`,
              outline: `1px solid ${alpha(palette.primary, 0.15)}`,
              outlineOffset: -8,
            }}
            initial={{ y: "8%" }}
            animate={{ y: "-62%" }}
            transition={{ duration: 1.6 * t, delay: 2.3 * t, ease: EASE_OUT }}
          >
            {/* Pearl / lace edge */}
            <svg viewBox="0 0 200 6" className="absolute -top-[3px] left-0 h-[6px] w-full" preserveAspectRatio="none" aria-hidden>
              {Array.from({ length: 40 }, (_, i) => (
                <circle key={i} cx={2.5 + i * 5} cy={3} r={2.2} fill={mix(paper, palette.primary, 0.15)} />
              ))}
            </svg>
            <p className="text-[10px] uppercase tracking-[0.45em]" style={{ color: palette.inkMuted }}>
              You are invited
            </p>
            <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
              {wedding.partner1_name}
              <span className="mx-3 inline-block" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
                &amp;
              </span>
              {wedding.partner2_name}
            </h1>
            {wedding.wedding_date && (
              <p className="mt-4 text-xs uppercase tracking-[0.3em]" style={{ color: palette.inkMuted }}>
                {formatLongDate(wedding.wedding_date)}
              </p>
            )}
            {wedding.venue_name && (
              <p className="mt-1 text-xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
                {wedding.venue_name}
              </p>
            )}
          </motion.div>

          {/* Envelope front pocket (covers the lower part of the letter) */}
          <svg viewBox="0 0 145 100" preserveAspectRatio="none" className="absolute inset-0 z-20 h-full w-full drop-shadow-sm" aria-hidden>
            <path d="M0 0 L72.5 58 L145 0 L145 100 L0 100 Z" fill={mix(envelope, "#ffffff", 0.08)} />
            <path d="M0 100 L60 52 M145 100 L85 52" stroke={alpha("#000000", 0.08)} strokeWidth={0.4} />
          </svg>

          {/* Flap lifting open */}
          <motion.div
            className="absolute inset-x-0 top-0 z-30 h-[62%]"
            style={{ originY: 0, transformStyle: "preserve-3d" }}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: 180, zIndex: 5 }}
            transition={{ duration: 1.1 * t, delay: 1.4 * t, ease: [0.65, 0, 0.35, 1] }}
          >
            <svg viewBox="0 0 145 62" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
              <path d="M0 0 L145 0 L72.5 60 Z" fill={mix(envelope, "#000000", 0.06)} />
            </svg>
          </motion.div>

          {/* Seal: presses in, then cracks away */}
          <motion.div
            className="absolute left-1/2 top-[56%] z-40 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 1.6, opacity: 0 }}
            animate={{ scale: [1.6, 1, 1, 1.15], opacity: [0, 1, 1, 0], rotate: [0, 0, 0, -12] }}
            transition={{ duration: 1.6 * t, times: [0, 0.35, 0.8, 1], ease: "easeOut" }}
          >
            <WaxSeal palette={palette} initials={initials} />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

/* ─── Day → Night ─────────────────────────────────────────────────────────── */

export function DayNightHero({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : 5;
  const night = palette.isDark ? palette.background : mix(palette.accent, "#0b0e22", 0.82);
  const dusk = mix(palette.primary, "#c56a8d", 0.45);
  const hills = mix(night, "#000000", 0.35);
  const ink = "#fffaf3";

  return (
    <>
      {/* Sky layers crossfade: golden hour → dusk → night */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, #8ec5ea 0%, #fde2c2 100%)` }} />
      <motion.div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${mix(dusk, "#6a5aa8", 0.4)} 0%, ${dusk} 55%, ${mix(palette.primary, "#ffd29a", 0.4)} 100%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1] }}
        transition={{ duration: dur, times: [0, 0.45, 1], ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${mix(night, "#000000", 0.25)} 0%, ${night} 60%, ${mix(night, dusk, 0.25)} 100%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: dur * 0.6, delay: dur * 0.5, ease: "easeInOut" }}
      />

      {/* Sun sets, moon rises */}
      <motion.div
        aria-hidden
        className="absolute left-[18%] h-24 w-24 rounded-full md:h-32 md:w-32"
        style={{ background: "radial-gradient(circle, #fff6d6 0%, #ffd27a 55%, #ff9e5e 100%)", boxShadow: "0 0 80px 30px rgba(255,190,110,0.55)" }}
        initial={{ top: "18%" }}
        animate={{ top: "92%" }}
        transition={{ duration: dur, ease: [0.4, 0, 0.6, 1] }}
      />
      <motion.div
        aria-hidden
        className="absolute right-[16%] h-16 w-16 rounded-full md:h-20 md:w-20"
        style={{ background: "#f4efe2", boxShadow: "inset -10px 4px 0 0 #d9d2bd, 0 0 50px 10px rgba(244,239,226,0.35)" }}
        initial={{ top: "95%", opacity: 0 }}
        animate={{ top: "14%", opacity: 1 }}
        transition={{ duration: dur * 0.7, delay: dur * 0.45, ease: EASE_OUT }}
      />
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: dur * 0.7, duration: 2 }}>
        <TwinklingStars color="#fff8e7" count={70} />
      </motion.div>

      {/* Rolling hills silhouette */}
      <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-40 w-full md:h-56" aria-hidden>
        <path d="M0 140 C 240 60 420 180 720 110 C 980 50 1200 160 1440 90 L1440 220 L0 220 Z" fill={mix(hills, "#ffffff", 0.06)} />
        <path d="M0 180 C 300 120 520 210 860 160 C 1120 120 1300 190 1440 150 L1440 220 L0 220 Z" fill={hills} />
        {/* Warm window lights of the venue */}
        {[880, 905, 930].map((x, i) => (
          <motion.rect
            key={x}
            x={x}
            y={146}
            width={8}
            height={10}
            fill="#ffd27a"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 1] }}
            transition={{ delay: dur * 0.75 + i * 0.3, duration: 2, repeat: Infinity, repeatType: "mirror" }}
          />
        ))}
      </svg>

      <motion.div className="relative z-10 px-6" style={{ y: contentY, opacity: contentOpacity }}>
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[130%] w-[150%] -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(ellipse at center, rgba(10,12,30,0.35) 0%, transparent 62%)" }}
        />
        <CenterNames
          palette={palette}
          wedding={wedding}
          delay={reduce ? 0 : 2.4}
          eyebrow="From golden hour to forever"
          ink={ink}
          muted={alpha(ink, 0.75)}
        />
      </motion.div>
    </>
  );
}

/* ─── Stained-glass rose window ───────────────────────────────────────────── */

export function StainedHero({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const reduce = useReducedMotion();
  const lead = palette.isDark ? mix(palette.background, "#000000", 0.4) : "#2b2622";
  const jewels = [
    palette.primary,
    palette.accent,
    mix(palette.primary, "#d4a017", 0.5),
    mix(palette.accent, "#2e8b57", 0.45),
    mix(palette.primary, "#7b3fa0", 0.5),
    palette.petals[0],
  ];
  const petals = 12;
  const R = 200;

  return (
    <>
      {/* Coloured light pooling on the floor */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 30% 18% at 35% 88%, ${alpha(jewels[0], 0.25)}, transparent 70%),
                       radial-gradient(ellipse 30% 18% at 65% 90%, ${alpha(jewels[1], 0.25)}, transparent 70%),
                       radial-gradient(ellipse 50% 50% at 50% 42%, ${alpha("#fff4d6", palette.isDark ? 0.12 : 0.6)}, transparent 70%)`,
        }}
      />
      <AmbientLayer palette={palette} intensity={0.6} />

      <motion.div className="relative z-10 flex flex-col items-center px-6" style={{ y: contentY, opacity: contentOpacity }}>
        <div className="relative w-[min(86vw,58vh,520px)]">
          {/* Slowly turning god-rays */}
          <motion.div
            aria-hidden
            className="absolute inset-[-25%] rounded-full"
            style={{ background: `conic-gradient(from 0deg, transparent, ${alpha("#fff4d6", 0.35)}, transparent 12%, transparent 25%, ${alpha("#fff4d6", 0.25)}, transparent 37%, transparent 50%, ${alpha("#fff4d6", 0.3)}, transparent 62%, transparent 75%, ${alpha("#fff4d6", 0.25)}, transparent 87%)`, filter: "blur(18px)" }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          />
          <svg viewBox="-220 -220 440 440" className="relative w-full" aria-hidden>
            <circle r={R + 12} fill={mix(palette.primary, "#ffffff", palette.isDark ? 0.55 : 0.78)} stroke={lead} strokeWidth={8} />
            {Array.from({ length: petals }, (_, i) => (
              <motion.path
                key={`ring-${i}`}
                transform={`rotate(${(360 / petals) * i + 360 / petals / 2})`}
                d={`M0 -${R - 4} L 22 -${R - 46} L 0 -${R - 70} L -22 -${R - 46} Z`}
                fill={jewels[(i + 3) % jewels.length]}
                stroke={lead}
                strokeWidth={4}
                initial={{ fillOpacity: 0 }}
                animate={{ fillOpacity: 0.75 }}
                transition={{ delay: reduce ? 0 : 2 + i * 0.06, duration: 0.6 }}
              />
            ))}
            {Array.from({ length: petals }, (_, i) => (
              <line key={`spoke-${i}`} transform={`rotate(${(360 / petals) * i})`} x1={0} y1={-92} x2={0} y2={-R - 8} stroke={lead} strokeWidth={3} />
            ))}
            {/* Petal panes */}
            {Array.from({ length: petals }, (_, i) => {
              const a = (360 / petals) * i;
              return (
                <g key={i} transform={`rotate(${a})`}>
                  <motion.path
                    d={`M0 -70 C 38 -110, 40 -170, 0 -${R} C -40 -170, -38 -110, 0 -70 Z`}
                    fill={jewels[i % jewels.length]}
                    stroke={lead}
                    strokeWidth={5}
                    initial={{ fillOpacity: 0, pathLength: 0 }}
                    animate={{ fillOpacity: 0.88, pathLength: 1 }}
                    transition={{ pathLength: { duration: reduce ? 0 : 1.6, delay: 0.2 }, fillOpacity: { duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 1.4 + i * 0.12 } }}
                  />
                  <motion.circle
                    cy={-R + 18}
                    r={10}
                    fill={jewels[(i + 2) % jewels.length]}
                    stroke={lead}
                    strokeWidth={4}
                    initial={{ fillOpacity: 0 }}
                    animate={{ fillOpacity: 0.9 }}
                    transition={{ delay: reduce ? 0 : 2.6 + i * 0.05 }}
                  />
                </g>
              );
            })}
            {/* Inner medallion where the names sit */}
            <motion.circle r={92} fill={mix(palette.background, "#ffffff", palette.isDark ? 0.06 : 0.4)} stroke={lead} strokeWidth={6} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: reduce ? 0 : 0.6, duration: 1, ease: EASE_OUT }} />
            <circle r={R + 12} fill="none" stroke={palette.primary} strokeWidth={2} opacity={0.6} />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <motion.p
              className="text-[min(7vw,2.8rem)] leading-none"
              style={{ fontFamily: palette.displayFont, color: palette.ink }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 2.2, duration: 1 }}
            >
              {wedding.partner1_name}
            </motion.p>
            <Ampersand palette={palette} delay={reduce ? 0 : 2.6} className="text-[min(6vw,2.4rem)] leading-tight" />
            <motion.p
              className="text-[min(7vw,2.8rem)] leading-none"
              style={{ fontFamily: palette.displayFont, color: palette.ink }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 2.8, duration: 1 }}
            >
              {wedding.partner2_name}
            </motion.p>
          </div>
        </div>

        <motion.div className="mt-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 3.2, duration: 1 }}>
          <p className="text-xs uppercase tracking-[0.4em]" style={{ color: palette.inkMuted }}>
            {wedding.wedding_date ? formatDotDate(wedding.wedding_date) : "Save the date"}
          </p>
          {wedding.venue_name && (
            <p className="mt-2 text-2xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
              {wedding.venue_name}
            </p>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
