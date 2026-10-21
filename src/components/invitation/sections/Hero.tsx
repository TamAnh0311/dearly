"use client";

/**
 * Hero — full-viewport cinematic opening. The layout is chosen by the
 * template's design language (palette.style.hero):
 *
 *  - garden     flowers grow from the bottom corners, butterflies drift by
 *  - arch       names framed in a self-drawing arch (classic / deco / boho)
 *  - editorial  oversized magazine typography with a date marquee (modern)
 *  - split      half-screen photo revealed with a curtain wipe (destination)
 *  - celestial  night sky, drawing crescent moon and constellations
 *  - polaroid   instant photos tumble onto the page around the names
 *  - curtain / seal / daynight / stained — signature layouts (HeroSignature.tsx)
 *  - doors / poster / enso / shoji / bojagi — East Asian collection (HeroAsian.tsx)
 *
 * Content parallaxes and fades on scroll in every layout.
 */

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { WeddingRow } from "@/types/database";
import { GrowingBud, GrowingFlower } from "../effects/Botanicals";
import AmbientLayer from "../effects/Ambient";
import { EASE_OUT, alpha, formatDotDate, formatLongDate, mix, type InvitationPalette } from "../utils";
import { Ampersand, DateLine, Eyebrow, RisingText, ScrollCue, useEventCopy, useEyebrow } from "./HeroParts";
import { DayNightHero, SealHero, StainedHero } from "./HeroSignature";
import { CurtainHero } from "./HeroCurtain";
import { BojagiHero, DoorsHero, EnsoHero, PosterHero, ShojiHero } from "./HeroAsian";

export interface HeroProps {
  wedding: WeddingRow;
  palette: InvitationPalette;
  photos: string[];
}

export interface LayoutProps extends HeroProps {
  contentY: MotionValue<number>;
  contentOpacity: MotionValue<number>;
}

/** Cluster of flowers + buds for one bottom corner. */
function FlowerCluster({ palette, side, scale = 1 }: { palette: InvitationPalette; side: "left" | "right"; scale?: number }) {
  const flip = side === "right";
  const [p1, p2, p3] = palette.petals;
  return (
    <div className={`pointer-events-none absolute bottom-0 flex items-end ${flip ? "right-0 flex-row-reverse" : "left-0"}`} style={{ marginBottom: -6 }}>
      <div className="-mr-6 hidden sm:block">
        <GrowingBud color={p2} leaf={palette.leaf} height={150 * scale} delay={1.4} flip={flip} />
      </div>
      <GrowingFlower petal={p1} petalInner={p3} leaf={palette.leaf} height={300 * scale} delay={0.6} bend={flip ? "left" : "right"} petals={7} flip={flip} />
      <div className="-ml-10">
        <GrowingFlower petal={p2} petalInner={p1} leaf={palette.leaf} height={210 * scale} delay={1.1} petals={6} flip={flip} />
      </div>
      <div className="-ml-8 hidden md:block">
        <GrowingFlower petal={p3} petalInner={p2} leaf={palette.leaf} height={170 * scale} delay={1.6} bend={flip ? "right" : "left"} petals={5} flip={flip} />
      </div>
      <div className="-ml-4 hidden lg:block">
        <GrowingBud color={p1} leaf={palette.leaf} height={120 * scale} delay={2} flip={flip} />
      </div>
    </div>
  );
}

/* ─── Layout: Garden ──────────────────────────────────────────────────────── */

function GardenHero({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const eyebrow = useEyebrow("Together with their families");
  const { copy } = useEventCopy();
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 42%, ${alpha(palette.primary, palette.isDark ? 0.22 : 0.14)} 0%, transparent 70%),
                       radial-gradient(ellipse 60% 40% at 50% 100%, ${alpha(palette.leaf, 0.18)} 0%, transparent 70%)`,
        }}
      />
      <AmbientLayer palette={palette} />
      <div className="pointer-events-none absolute inset-0">
        <FlowerCluster palette={palette} side="left" />
        <FlowerCluster palette={palette} side="right" />
      </div>
      <motion.div className="relative z-10 flex flex-col items-center px-6 pb-24 text-center" style={{ y: contentY, opacity: contentOpacity }}>
        <Eyebrow text={eyebrow} color={palette.inkMuted} />
        <h1 className="mt-8 flex flex-col items-center font-light leading-[0.95]" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
          <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
            <RisingText text={wedding.partner1_name} delay={0.5} />
          </span>
          <Ampersand palette={palette} delay={1.1} className="my-1 text-6xl md:my-2 md:text-8xl" />
          <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
            <RisingText text={wedding.partner2_name} delay={1.3} />
          </span>
        </h1>
        <motion.p
          className="mt-8 text-2xl md:text-3xl"
          style={{ fontFamily: palette.scriptFont, color: palette.primary }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.1, ease: EASE_OUT }}
        >
          {wedding.event_title || copy.tagline(wedding.partner1_name)}
        </motion.p>
        {wedding.wedding_date && (
          <div className="mt-6">
            <DateLine date={wedding.wedding_date} palette={palette} delay={2.4} />
          </div>
        )}
        {wedding.venue_name && (
          <motion.p className="mt-4 text-xs uppercase tracking-[0.3em]" style={{ color: palette.inkMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.7 }}>
            {wedding.venue_name}
          </motion.p>
        )}
      </motion.div>
    </>
  );
}

/* ─── Layout: Arch ────────────────────────────────────────────────────────── */

/** Sunburst rays behind the arch top (deco ornament). */
function DecoRays({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 220" className="absolute left-1/2 top-0 w-[130%] -translate-x-1/2 -translate-y-[38%]" aria-hidden>
      {Array.from({ length: 19 }, (_, i) => {
        const a = Math.PI + (i / 18) * Math.PI;
        return (
          <motion.line
            key={i}
            x1={200}
            y1={210}
            x2={200 + Math.cos(a) * 200}
            y2={210 + Math.sin(a) * 200}
            stroke={color}
            strokeWidth={0.6}
            opacity={0.45}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 0.8 + Math.abs(i - 9) * 0.06, ease: EASE_OUT }}
          />
        );
      })}
    </svg>
  );
}

/** Leafy sprig crowning the arch (floral / leaf ornaments). */
function ArchSprig({ palette }: { palette: InvitationPalette }) {
  const leaves = [-60, -35, -12, 12, 35, 60];
  return (
    <svg viewBox="-80 -40 160 60" className="absolute left-1/2 top-0 w-48 -translate-x-1/2 -translate-y-1/2" aria-hidden>
      <motion.path d="M-70 10 Q 0 -30 70 10" stroke={palette.leaf} strokeWidth={1.4} fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 1.2 }} />
      {leaves.map((x, i) => (
        <motion.ellipse
          key={x}
          cx={x}
          cy={-6 + Math.abs(x) * 0.22}
          rx={4}
          ry={9}
          fill={i % 2 ? palette.leaf : mix(palette.leaf, palette.accent, 0.35)}
          transform={`rotate(${x * 0.9} ${x} ${-6 + Math.abs(x) * 0.22})`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.6 + i * 0.08, type: "spring", stiffness: 200, damping: 14 }}
        />
      ))}
      <motion.circle cx={0} cy={-14} r={6} fill={palette.petals[0]} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.2, type: "spring" }} />
      <motion.circle cx={0} cy={-14} r={2.4} fill="#f3d27a" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.4 }} />
    </svg>
  );
}

function ArchHero({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const deco = palette.style.ornament === "deco";
  const archEyebrow = useEyebrow(deco ? "The wedding of" : "Together with their families");
  const archPath = "M 20 620 V 220 A 180 180 0 0 1 380 220 V 620";
  const innerPath = "M 34 620 V 224 A 166 166 0 0 1 366 224 V 620";
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 50% 60% at 50% 45%, ${alpha(palette.primary, palette.isDark ? 0.2 : 0.1)} 0%, transparent 70%)` }}
      />
      <AmbientLayer palette={palette} />
      {palette.style.flowers && (
        <div className="pointer-events-none absolute inset-0 opacity-90">
          <FlowerCluster palette={palette} side="left" scale={0.8} />
          <FlowerCluster palette={palette} side="right" scale={0.8} />
        </div>
      )}

      <motion.div className="relative z-10 mx-auto w-[min(88vw,420px)]" style={{ y: contentY, opacity: contentOpacity }}>
        <div className="relative aspect-[400/620] w-full">
          {deco && <DecoRays color={palette.primary} />}
          <motion.div
            className="absolute inset-[3.5%] overflow-hidden"
            style={{
              borderRadius: "999px 999px 0 0",
              background: `linear-gradient(180deg, ${alpha(palette.primary, palette.isDark ? 0.14 : 0.08)}, ${alpha(palette.background, 0)})`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.4 }}
          />
          <svg viewBox="0 0 400 620" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
            <motion.path d={archPath} stroke={palette.primary} strokeWidth={1.4} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, ease: "easeInOut" }} />
            <motion.path d={innerPath} stroke={palette.primary} strokeWidth={0.6} opacity={0.6} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.6, delay: 0.3, ease: "easeInOut" }} />
          </svg>
          {!deco && <ArchSprig palette={palette} />}

          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 pt-16 text-center">
            <Eyebrow text={archEyebrow} color={palette.inkMuted} delay={1} />
            <h1 className="mt-6 font-light leading-[1]" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
              <span className={`block text-5xl md:text-6xl ${palette.style.headingCase === "upper" ? "uppercase tracking-[0.12em]" : ""}`}>
                <RisingText text={wedding.partner1_name} delay={1.3} />
              </span>
              <Ampersand palette={palette} delay={1.9} className="my-2 text-5xl md:text-6xl" />
              <span className={`block text-5xl md:text-6xl ${palette.style.headingCase === "upper" ? "uppercase tracking-[0.12em]" : ""}`}>
                <RisingText text={wedding.partner2_name} delay={2.1} />
              </span>
            </h1>
            {wedding.wedding_date && (
              <motion.p
                className="mt-8 text-xs uppercase tracking-[0.3em]"
                style={{ color: palette.inkMuted }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.7, duration: 1 }}
              >
                {formatLongDate(wedding.wedding_date)}
              </motion.p>
            )}
            {wedding.venue_name && (
              <motion.p className="mt-2 text-xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
                {wedding.venue_name}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ─── Layout: Editorial ───────────────────────────────────────────────────── */

function EditorialHero({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const { twoNames } = useEventCopy();
  const marquee = [wedding.partner1_name, ...(twoNames ? ["&", wedding.partner2_name] : []), "·", wedding.wedding_date ? formatDotDate(wedding.wedding_date) : "Save the date", "·", "Save the date", "·"];
  return (
    <>
      <AmbientLayer palette={palette} intensity={0.6} />
      <motion.div className="relative z-10 flex w-full max-w-7xl flex-col px-6 pb-28 pt-24 md:px-12" style={{ y: contentY, opacity: contentOpacity }}>
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em]" style={{ color: palette.inkMuted }}>
          <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 1 }}>
            The Wedding
          </motion.span>
          <motion.span initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 1 }}>
            {wedding.wedding_date ? new Date(wedding.wedding_date).getFullYear() : ""}
          </motion.span>
        </div>
        <motion.div className="mt-6 h-px w-full" style={{ backgroundColor: palette.ink, originX: 0 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, delay: 0.4, ease: EASE_OUT }} />

        <h1 className="mt-10 font-light leading-[0.88]" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
          <span className="block text-[17vw] md:text-[11vw]">
            <RisingText text={wedding.partner1_name} delay={0.7} stagger={0.06} />
          </span>
          <span className="flex items-center gap-6">
            <Ampersand palette={palette} delay={1.3} className="text-[12vw] leading-none md:text-[7vw]" />
            <motion.span className="h-px flex-1" style={{ backgroundColor: palette.primary, originX: 0 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, delay: 1.4, ease: EASE_OUT }} />
          </span>
          <span className="block text-right text-[17vw] md:text-[11vw]">
            <RisingText text={wedding.partner2_name} delay={1.5} stagger={0.06} />
          </span>
        </h1>

        <motion.div
          className="mt-10 grid gap-4 text-xs uppercase tracking-[0.3em] md:grid-cols-3"
          style={{ color: palette.inkMuted }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 1 }}
        >
          <span>{wedding.wedding_date ? formatLongDate(wedding.wedding_date) : "Date to be announced"}</span>
          <span className="md:text-center">{wedding.venue_name ?? ""}</span>
          <span className="md:text-right">Request the pleasure of your company</span>
        </motion.div>
      </motion.div>

      {/* Date marquee */}
      <div className="absolute inset-x-0 bottom-16 z-10 overflow-hidden border-y py-3" style={{ borderColor: alpha(palette.ink, 0.15) }}>
        <motion.div className="flex w-max gap-10 whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }}>
          {[...marquee, ...marquee, ...marquee, ...marquee].map((t, i) => (
            <span key={i} className="text-sm uppercase tracking-[0.4em]" style={{ color: t === "&" ? palette.primary : palette.ink, fontFamily: palette.displayFont }}>
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </>
  );
}

/* ─── Layout: Split ───────────────────────────────────────────────────────── */

function SplitHero({ wedding, palette, photos, contentY, contentOpacity }: LayoutProps) {
  const eyebrow = useEyebrow("We're getting married");
  return (
    <div className="relative z-10 grid min-h-[100svh] w-full md:grid-cols-2">
      <div className="relative h-[55svh] overflow-hidden md:h-auto">
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1.6, ease: [0.77, 0, 0.18, 1] }}
        >
          <motion.div className="absolute inset-0" initial={{ scale: 1.25 }} animate={{ scale: 1.05 }} transition={{ duration: 8, ease: "easeOut" }}>
            <Image src={photos[0]} alt={`${wedding.partner1_name} and ${wedding.partner2_name}`} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, ${alpha(palette.background, 0.55)}, transparent 45%)` }} />
        </motion.div>
        <motion.span
          className="absolute bottom-6 left-6 text-3xl md:bottom-10 md:left-10 md:text-4xl"
          style={{ fontFamily: palette.scriptFont, color: "#ffffff", textShadow: "0 2px 20px rgba(0,0,0,0.35)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          Save the date
        </motion.span>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden px-8 py-20">
        <AmbientLayer palette={palette} intensity={0.7} />
        <motion.div className="relative z-10 text-center md:text-left" style={{ y: contentY, opacity: contentOpacity }}>
          <Eyebrow text={eyebrow} color={palette.inkMuted} delay={1} />
          <h1 className="mt-6 font-light leading-[0.95]" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
            <span className="block text-6xl md:text-7xl lg:text-8xl">
              <RisingText text={wedding.partner1_name} delay={1.2} />
            </span>
            <Ampersand palette={palette} delay={1.7} className="my-1 text-5xl md:text-7xl" />
            <span className="block text-6xl md:text-7xl lg:text-8xl">
              <RisingText text={wedding.partner2_name} delay={1.9} />
            </span>
          </h1>
          <motion.div
            className="mt-10 inline-flex flex-col gap-2 border-l-2 pl-5 text-left"
            style={{ borderColor: palette.primary }}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            {wedding.wedding_date && (
              <span className="text-lg" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
                {formatLongDate(wedding.wedding_date)}
              </span>
            )}
            {wedding.venue_name && (
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: palette.inkMuted }}>
                {wedding.venue_name}
              </span>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Layout: Celestial ───────────────────────────────────────────────────── */

const CONSTELLATION = [
  [60, 80], [120, 50], [180, 95], [240, 60], [300, 110], [340, 70],
] as const;

function CelestialHero({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const lanternFestival = palette.style.ambient.includes("lanterns");
  const sky = palette.isDark ? palette.background : mix(palette.primary, "#0b1030", 0.88);
  const starInk = mix(palette.primary, "#ffffff", 0.55);
  const ink = "#f4f1ea";
  const eyebrow = useEyebrow(lanternFestival ? "An evening of light" : "Written in the stars");
  const { twoNames } = useEventCopy();

  // Lantern-night uses a warmer sky gradient to complement the golden lanterns.
  const skyBg = lanternFestival
    ? `radial-gradient(ellipse 90% 80% at 50% 25%, ${mix(sky, "#2a1810", 0.35)} 0%, ${sky} 55%, ${mix(sky, "#000000", 0.5)} 100%)`
    : `radial-gradient(ellipse 80% 70% at 50% 30%, ${mix(sky, palette.accent, 0.25)} 0%, ${sky} 60%, ${mix(sky, "#000000", 0.4)} 100%)`;

  return (
    <>
      <div className="pointer-events-none absolute inset-0" style={{ background: skyBg }} />
      <AmbientLayer palette={{ ...palette, primary: starInk }} />

      {lanternFestival ? (
        <>
          {/* Warm horizon glow for the lantern festival (Chiang Mai / Turkey nights). */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
            style={{ background: `linear-gradient(0deg, ${alpha(mix(palette.primary, "#ff8c00", 0.5), 0.18)} 0%, transparent 100%)` }}
          />
          {/* Scattered warm sparkles to fill the dark sky between lanterns */}
          {Array.from({ length: 40 }, (_, i) => (
            <motion.span
              key={`spark-${i}`}
              aria-hidden
              className="pointer-events-none absolute rounded-full"
              style={{
                left: `${(i * 37 + 13) % 100}%`,
                top: `${(i * 53 + 7) % 85}%`,
                width: (i % 3) + 1,
                height: (i % 3) + 1,
                background: mix(palette.primary, "#ffffff", 0.5),
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3 + (i % 4) * 0.12, 0.15, 0.3 + (i % 3) * 0.1] }}
              transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: (i % 8) * 0.4 }}
            />
          ))}
        </>
      ) : (
        <>
          {/* Crescent moon with soft halo */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute right-[8%] top-[10%] h-24 w-24 rounded-full md:h-36 md:w-36"
            style={{ background: `radial-gradient(circle, ${alpha(starInk, 0.28)} 0%, transparent 68%)`, scale: 1.8 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
          />
          <motion.svg viewBox="0 0 100 100" className="absolute right-[8%] top-[10%] w-24 md:w-36" aria-hidden initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} transition={{ duration: 2.4, ease: EASE_OUT }}>
            <defs>
              <mask id="crescent">
                <rect width="100" height="100" fill="white" />
                <circle cx="64" cy="40" r="34" fill="black" />
              </mask>
            </defs>
            <circle cx="50" cy="50" r="36" fill={starInk} mask="url(#crescent)" />
          </motion.svg>

          {/* Constellation drawing itself */}
          <svg viewBox="0 0 400 160" className="absolute left-[4%] top-[8%] w-[70%] max-w-xl opacity-80" aria-hidden>
            <motion.polyline
              points={CONSTELLATION.map((p) => p.join(",")).join(" ")}
              fill="none"
              stroke={starInk}
              strokeWidth={0.6}
              strokeDasharray="2 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, delay: 0.6, ease: "easeInOut" }}
            />
            {CONSTELLATION.map(([x, y], i) => (
              <motion.circle key={i} cx={x} cy={y} r={2.4} fill={starInk} initial={{ scale: 0 }} animate={{ scale: [0, 1.6, 1] }} transition={{ delay: 0.6 + i * 0.45, duration: 0.6 }} />
            ))}
          </svg>
        </>
      )}

      <motion.div className="relative z-10 flex flex-col items-center px-6 text-center" style={{ y: contentY, opacity: contentOpacity }}>
        <Eyebrow text={eyebrow} color={alpha(ink, 0.7)} delay={0.8} />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[160%] -translate-x-1/2 -translate-y-1/2"
          style={{ background: `radial-gradient(ellipse at center, ${alpha(starInk, 0.16)} 0%, transparent 60%)` }}
        />
        <h1 className="mt-8 font-light leading-[0.95]" style={{ fontFamily: palette.displayFont, color: ink }}>
          <span className="block text-6xl md:text-8xl">
            <RisingText text={wedding.partner1_name} delay={1.1} />
          </span>
          {twoNames && (
          <motion.span
            className="my-2 block text-6xl md:text-8xl"
            style={{ fontFamily: palette.scriptFont, color: starInk }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 12, delay: 1.7 }}
          >
            &amp;
          </motion.span>
          )}
          <span className="block text-6xl md:text-8xl">
            <RisingText text={wedding.partner2_name} delay={1.9} />
          </span>
        </h1>
        {wedding.wedding_date && (
          <div className="mt-10">
            <DateLine date={wedding.wedding_date} palette={{ ...palette, primary: starInk }} delay={2.6} color={ink} />
          </div>
        )}
        {wedding.venue_name && (
          <motion.p className="mt-4 text-xs uppercase tracking-[0.3em]" style={{ color: alpha(ink, 0.65) }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.9 }}>
            {wedding.venue_name}
          </motion.p>
        )}
      </motion.div>
    </>
  );
}

/* ─── Layout: Polaroid ────────────────────────────────────────────────────── */

const POLAROID_SPOTS = [
  { left: "6%", top: "12%", rotate: -12, delay: 0.3 },
  { left: "72%", top: "8%", rotate: 9, delay: 0.55 },
  { left: "4%", top: "58%", rotate: 7, delay: 0.8 },
  { left: "74%", top: "56%", rotate: -8, delay: 1.05 },
  { left: "40%", top: "74%", rotate: 4, delay: 1.3 },
];

function PolaroidHero({ wedding, palette, photos, contentY, contentOpacity }: LayoutProps) {
  const headline = useEyebrow("We're getting married!");
  const { twoNames } = useEventCopy();
  return (
    <>
      <AmbientLayer palette={palette} intensity={0.8} />
      {POLAROID_SPOTS.slice(0, Math.min(5, photos.length)).map((spot, i) => (
        <motion.div
          key={i}
          drag
          dragSnapToOrigin
          whileHover={{ scale: 1.06, rotate: 0, zIndex: 30 }}
          className={`absolute z-[5] w-32 cursor-grab bg-white p-2 pb-8 shadow-2xl active:cursor-grabbing md:w-48 ${i === 4 ? "hidden md:block" : ""}`}
          style={{ left: spot.left, top: spot.top, borderRadius: palette.radius.sm === "2px" ? 2 : 6 }}
          initial={{ y: -600, rotate: spot.rotate * 3, opacity: 0 }}
          animate={{ y: 0, rotate: spot.rotate, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 11, delay: spot.delay }}
        >
          <div className="relative aspect-square w-full overflow-hidden bg-neutral-200">
            <Image src={photos[i]} alt="" fill sizes="200px" className="object-cover" />
          </div>
          <span className="absolute bottom-1.5 left-0 right-0 text-center text-lg" style={{ fontFamily: palette.scriptFont, color: "#3b332d" }}>
            {["first date", "the proposal", "us", "adventures", "forever"][i]}
          </span>
          {/* Washi tape */}
          <span className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-[-4deg]" style={{ backgroundColor: alpha(palette.accent, 0.6) }} />
        </motion.div>
      ))}

      <motion.div className="relative z-10 flex flex-col items-center px-6 text-center" style={{ y: contentY, opacity: contentOpacity }}>
        <motion.div
          className="bg-white/80 px-10 py-10 shadow-xl backdrop-blur-sm md:px-16"
          style={{ borderRadius: palette.radius.card, backgroundColor: alpha(palette.background, 0.85) }}
          initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
          animate={{ scale: 1, opacity: 1, rotate: -1.5 }}
          transition={{ type: "spring", stiffness: 90, damping: 14, delay: 1.5 }}
        >
          <p className="text-3xl md:text-4xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
            {headline}
          </p>
          <h1 className="mt-4 text-5xl font-light leading-none md:text-7xl" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
            <RisingText text={wedding.partner1_name} delay={1.9} />
            {twoNames && (
              <>
                <span className="mx-3 inline-block" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
                  &amp;
                </span>
                <RisingText text={wedding.partner2_name} delay={2.2} />
              </>
            )}
          </h1>
          {wedding.wedding_date && (
            <p className="mt-5 text-xs uppercase tracking-[0.3em]" style={{ color: palette.inkMuted }}>
              {formatLongDate(wedding.wedding_date)}
              {wedding.venue_name ? ` · ${wedding.venue_name}` : ""}
            </p>
          )}
        </motion.div>
        <motion.p className="mt-6 text-[11px] uppercase tracking-[0.3em]" style={{ color: palette.inkMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
          psst — you can drag the photos
        </motion.p>
      </motion.div>
    </>
  );
}

/* ─── Dispatcher ──────────────────────────────────────────────────────────── */

export default function Hero({ wedding, palette, photos }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Photo-led layouts need photos; fall back to the arch layout without them.
  let layout = palette.style.hero;
  if (layout === "split" && photos.length < 1) layout = "arch";
  if (layout === "polaroid" && photos.length < 3) layout = "arch";
  if (layout === "poster" && photos.length < 1) layout = "enso";

  const props: LayoutProps = { wedding, palette, photos, contentY, contentOpacity };
  const { inviteeName, copy } = useEventCopy();
  const cueColor = layout === "celestial" || layout === "daynight" || layout === "poster" ? "rgba(244,241,234,0.75)" : palette.inkMuted;

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
      style={{ backgroundColor: palette.background }}
    >
      {/* Layer for blessings running as background text (BlessingShower portals into it) */}
      <div id="hero-blessings" aria-hidden className="pointer-events-none absolute inset-0 z-[6] overflow-hidden" />
      {layout === "garden" && <GardenHero {...props} />}
      {layout === "arch" && <ArchHero {...props} />}
      {layout === "editorial" && <EditorialHero {...props} />}
      {layout === "split" && <SplitHero {...props} />}
      {layout === "celestial" && <CelestialHero {...props} />}
      {layout === "polaroid" && <PolaroidHero {...props} />}
      {layout === "curtain" && <CurtainHero {...props} />}
      {layout === "seal" && <SealHero {...props} />}
      {layout === "daynight" && <DayNightHero {...props} />}
      {layout === "stained" && <StainedHero {...props} />}
      {layout === "doors" && <DoorsHero {...props} />}
      {layout === "poster" && <PosterHero {...props} />}
      {layout === "enso" && <EnsoHero {...props} />}
      {layout === "shoji" && <ShojiHero {...props} />}
      {layout === "bojagi" && <BojagiHero {...props} />}
      {layout !== "editorial" && <ScrollCue color={cueColor} />}
      {/* Personal greeting for invitations sent from the guest list */}
      {inviteeName && (
        <motion.div
          className="absolute left-1/2 top-16 z-[45] -translate-x-1/2 flex flex-col items-center gap-1.5 rounded-2xl px-7 py-4 shadow-lg backdrop-blur-md md:top-20"
          style={{ background: alpha(palette.background, 0.82), border: `1px solid ${alpha(palette.primary, 0.25)}` }}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 1 }}
        >
          <p className="text-xl md:text-2xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
            Dear {inviteeName}
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-center" style={{ color: cueColor }}>
            You have been invited to {wedding.event_title || `${wedding.partner1_name}${wedding.partner2_name ? ` & ${wedding.partner2_name}'s` : "'s"} ${copy.label.toLowerCase()}`}
          </p>
        </motion.div>
      )}
    </section>
  );
}
