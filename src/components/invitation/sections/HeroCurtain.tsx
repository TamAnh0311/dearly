"use client";

/**
 * Curtain heroes — two signature openings sharing the "curtain" layout:
 *
 *  VelvetCurtain  A grand theatre: gold proscenium, swagged valance with
 *                 fringe and tassels, velvet drapes with sheen that gather
 *                 into tied-back swoops, a spotlight that swells on, glowing
 *                 footlights and a burst of gold dust as the show begins.
 *
 *  GardenGate     An antique garden gate: wrought-iron leaves and a glowing
 *                 heart lock. The lock turns, light spills through the seam,
 *                 the gates swing open in 3D onto a watercolour ceremony aisle,
 *                 and petals drift around the names.
 *
 * Timeline guidance (see AGENTS.md §4.1): ornaments 0–1.5s, signature moment
 * ≤ 3s, names rise ~2–3s. Reduced motion renders the opened end state.
 */

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import AmbientLayer from "../effects/Ambient";
import { ButterflyShape } from "../effects/Particles";
import { getArtCollection } from "../art";
import { EASE_OUT, alpha, mix, seeded, type InvitationPalette } from "../utils";
import ArtSpray from "./ArtSpray";
import { CenterNames, useEyebrow } from "./HeroParts";
import type { LayoutProps } from "./Hero";

/* ═══════════════════════════════ Velvet ═══════════════════════════════════ */

/** Velvet colours derived from the palette accent (works for any scheme). */
function velvetTones(palette: InvitationPalette) {
  const base = palette.isDark ? mix(palette.accent, "#000000", 0.1) : mix(palette.accent, "#3a0a12", 0.35);
  return {
    base,
    deep: mix(base, "#000000", 0.5),
    sheen: mix(base, "#ffffff", 0.22),
    gold: palette.primary,
    goldLight: mix(palette.primary, "#ffffff", 0.45),
  };
}

/** One velvet drape: folds + sheen + gold hem; gathers into a tied-back swoop. */
function VelvetDrape({ side, palette, t }: { side: "left" | "right"; palette: InvitationPalette; t: number }) {
  const v = velvetTones(palette);
  const left = side === "left";
  const folds = `repeating-linear-gradient(90deg,
    ${v.deep} 0px, ${v.base} 14px, ${v.sheen} 26px, ${v.base} 38px, ${v.deep} 54px)`;
  const sheen = `linear-gradient(180deg, ${alpha("#ffffff", 0.08)} 0%, transparent 30%, transparent 70%, ${alpha("#000000", 0.35)} 100%)`;
  // Bottom corner swoops toward the tie-back when gathered.
  const closed = "inset(0% 0% 0% 0% round 0px 0px 0px 0px)";
  const open = left ? "inset(0% 0% 0% 0% round 0px 0px 100% 0px)" : "inset(0% 0% 0% 0% round 0px 0px 0px 100%)";

  return (
    <motion.div
      aria-hidden
      className={`absolute inset-y-0 z-30 w-[52%] ${left ? "left-0" : "right-0"}`}
      style={{ originX: left ? 0 : 1, background: `${sheen}, ${folds}`, boxShadow: `inset ${left ? "-" : ""}40px 0 70px rgba(0,0,0,0.55)` }}
      initial={{ scaleX: 1, clipPath: closed }}
      animate={{ scaleX: 0.2, clipPath: open }}
      transition={{ duration: 2.6 * t, delay: 0.9 * t, ease: [0.7, 0, 0.3, 1] }}
    >
      {/* Gold hem */}
      <div className="absolute inset-x-0 bottom-0 h-3" style={{ background: `linear-gradient(90deg, ${v.gold}, ${v.goldLight}, ${v.gold})` }} />
    </motion.div>
  );
}

/** Gold rope tie-back with a tassel, appearing where each drape gathers. */
function TieBack({ side, palette, t }: { side: "left" | "right"; palette: InvitationPalette; t: number }) {
  const v = velvetTones(palette);
  const left = side === "left";
  return (
    <motion.div
      aria-hidden
      className={`absolute top-[58%] z-40 hidden sm:block ${left ? "left-[4%]" : "right-[4%]"}`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 3 * t, duration: 0.6, ease: EASE_OUT }}
    >
      <svg width="64" height="96" viewBox="0 0 64 96" style={{ transform: left ? undefined : "scaleX(-1)" }}>
        <path d="M2 14 C 22 2, 46 6, 58 22" stroke={v.gold} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M2 14 C 22 2, 46 6, 58 22" stroke={v.goldLight} strokeWidth="1.5" fill="none" strokeDasharray="3 4" />
        <circle cx="58" cy="26" r="6" fill={v.gold} />
        <motion.g
          style={{ originX: "58px", originY: "26px" }}
          animate={t ? { rotate: [-6, 6, -6] } : undefined}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M52 32 L64 32 L62 44 L54 44 Z" fill={v.goldLight} />
          {Array.from({ length: 7 }, (_, i) => (
            <line key={i} x1={53 + i * 1.6} y1={44} x2={52 + i * 1.8} y2={70} stroke={i % 2 ? v.gold : v.goldLight} strokeWidth="1.4" />
          ))}
        </motion.g>
      </svg>
    </motion.div>
  );
}

/** Swagged valance with gold trim, fringe and tassels between swags. */
function Valance({ palette }: { palette: InvitationPalette }) {
  const v = velvetTones(palette);
  const swags = 5;
  const w = 100 / swags;
  return (
    <div aria-hidden className="absolute inset-x-0 top-0 z-50">
      <div className="h-10" style={{ background: `linear-gradient(180deg, ${v.deep}, ${v.base})` }} />
      <svg viewBox="0 0 100 14" preserveAspectRatio="none" className="block h-12 w-full md:h-16">
        <defs>
          <linearGradient id="swag" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={v.base} />
            <stop offset="0.7" stopColor={v.sheen} />
            <stop offset="1" stopColor={v.deep} />
          </linearGradient>
        </defs>
        <rect width="100" height="2" fill={v.base} />
        {Array.from({ length: swags }, (_, i) => {
          const x = i * w;
          return (
            <g key={i}>
              <path d={`M${x} 0 Q ${x + w / 2} 16 ${x + w} 0 Z`} fill="url(#swag)" />
              <path d={`M${x} 0.6 Q ${x + w / 2} 15 ${x + w} 0.6`} stroke={v.gold} strokeWidth="0.6" fill="none" />
              <path d={`M${x} 2 Q ${x + w / 2} 12 ${x + w} 2`} stroke={alpha("#000000", 0.25)} strokeWidth="0.3" fill="none" />
            </g>
          );
        })}
      </svg>
      {/* Fringe + tassels */}
      <div className="relative -mt-1 h-4 md:h-5">
        <div
          className="absolute inset-x-0 top-0 h-2"
          style={{ background: `repeating-linear-gradient(90deg, ${v.gold} 0 1px, transparent 1px 4px)`, opacity: 0.85 }}
        />
        {Array.from({ length: swags + 1 }, (_, i) => (
          <svg key={i} viewBox="0 0 10 26" className="absolute -top-6 h-10 w-4 -translate-x-1/2 md:-top-8 md:h-12" style={{ left: `${i * w}%` }}>
            <circle cx="5" cy="4" r="3" fill={v.gold} />
            <path d="M2.5 7 L7.5 7 L8.5 12 L1.5 12 Z" fill={v.goldLight} />
            {Array.from({ length: 5 }, (_, k) => (
              <line key={k} x1={2 + k * 1.5} y1={12} x2={1.5 + k * 1.75} y2={25} stroke={k % 2 ? v.gold : v.goldLight} strokeWidth="0.7" />
            ))}
          </svg>
        ))}
      </div>
    </div>
  );
}

function VelvetCurtain({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const reduce = useReducedMotion();
  const t = reduce ? 0 : 1;
  const v = velvetTones(palette);
  const stage = palette.isDark ? palette.background : mix(palette.background, "#1a0c0e", 0.85);
  const ink = "#fbf4e8";
  const eyebrow = useEyebrow("Tonight, the curtain rises on");

  return (
    <>
      {/* Stage backdrop + proscenium */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 70% at 50% 35%, ${mix(stage, v.base, 0.35)}, ${stage} 70%)` }} />
      <div aria-hidden className="pointer-events-none absolute inset-3 z-[45] rounded-t-[40%] border md:inset-6" style={{ borderColor: alpha(v.gold, 0.35) }} />

      {/* Spotlight swells on as the curtain opens */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `conic-gradient(from 180deg at 50% -10%, transparent 160deg, ${alpha("#fff3d6", 0.22)} 176deg, ${alpha("#fff3d6", 0.32)} 180deg, ${alpha("#fff3d6", 0.22)} 184deg, transparent 200deg)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 * t, duration: 1.6 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 34% 46% at 50% 48%, ${alpha("#fff3d6", 0.22)}, transparent 70%)` }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8 * t, duration: 1.8, ease: EASE_OUT }}
      />
      {/* Footlights */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[35] flex h-24 items-end justify-center gap-[6vw] pb-2">
        {Array.from({ length: 7 }, (_, i) => (
          <motion.span
            key={i}
            className="block h-16 w-24 rounded-full"
            style={{ background: `radial-gradient(ellipse at 50% 100%, ${alpha("#ffcf7a", 0.55)}, transparent 70%)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.85] }}
            transition={{ delay: (0.4 + i * 0.08) * t, duration: 1.2 }}
          />
        ))}
      </div>

      <AmbientLayer palette={{ ...palette, primary: v.goldLight }} />

      {/* Gold dust burst from centre stage when the curtains part */}
      {t > 0 && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          {Array.from({ length: 26 }, (_, i) => {
            const a = (i / 26) * Math.PI * 2;
            const d = 160 + seeded(i + 900) * 320;
            return (
              <motion.span
                key={i}
                className="absolute rounded-full"
                style={{ width: 4, height: 4, background: v.goldLight, boxShadow: `0 0 10px ${v.gold}` }}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], x: Math.cos(a) * d, y: Math.sin(a) * d * 0.6 }}
                transition={{ delay: 1.7 + seeded(i) * 0.4, duration: 2.2, ease: "easeOut" }}
              />
            );
          })}
        </div>
      )}

      <VelvetDrape side="left" palette={palette} t={t} />
      <VelvetDrape side="right" palette={palette} t={t} />
      <TieBack side="left" palette={palette} t={t} />
      <TieBack side="right" palette={palette} t={t} />
      <Valance palette={palette} />

      <motion.div className="relative z-10 px-6 pt-16" style={{ y: contentY, opacity: contentOpacity }}>
        <CenterNames palette={palette} wedding={wedding} delay={2.2 * t} eyebrow={eyebrow} ink={ink} muted={alpha(ink, 0.7)} />
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════ Garden gate ══════════════════════════════ */

/** Wrought-iron gate leaf (bars, rails, arched top, finials) over a hedge of ivy. */
function GateLeaf({ side, palette, t }: { side: "left" | "right"; palette: InvitationPalette; t: number }) {
  const left = side === "left";
  const iron = "#24221f";
  const bars = 7;
  return (
    <motion.div
      aria-hidden
      className={`absolute inset-y-0 z-30 w-1/2 ${left ? "left-0" : "right-0"}`}
      style={{
        originX: left ? 0 : 1,
        transformPerspective: 1600,
        background: `linear-gradient(${left ? "90deg" : "270deg"}, ${alpha("#243021", 0.28)}, ${alpha("#243021", 0.08)} 45%, transparent 80%)`,
      }}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: left ? -112 : 112 }}
      transition={{ duration: 2.2 * t, delay: 1.9 * t, ease: [0.55, 0, 0.25, 1] }}
    >
      <svg viewBox="0 0 400 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ transform: left ? undefined : "scaleX(-1)" }}>
        {/* Frame */}
        <rect x="8" y="140" width="384" height="752" fill="none" stroke={iron} strokeWidth="10" />
        <path d="M8 160 Q 200 40 392 120" fill="none" stroke={iron} strokeWidth="10" />
        {/* Bars with spear finials */}
        {Array.from({ length: bars }, (_, i) => {
          const x = 40 + i * ((392 - 40) / bars);
          const top = 150 - Math.sin(((x - 8) / 384) * Math.PI * 0.85) * 70;
          return (
            <g key={i}>
              <line x1={x} y1={top} x2={x} y2={892} stroke={iron} strokeWidth="6" />
              <path d={`M${x - 7} ${top} L${x} ${top - 22} L${x + 7} ${top} Z`} fill={iron} />
            </g>
          );
        })}
        <line x1="8" y1="520" x2="392" y2="520" stroke={iron} strokeWidth="8" />
        <line x1="8" y1="840" x2="392" y2="840" stroke={iron} strokeWidth="8" />
        {/* Scroll curls on the mid rail */}
        {[90, 200, 310].map((x) => (
          <path key={x} d={`M${x - 30} 520 C ${x - 30} 480, ${x + 30} 480, ${x + 30} 520 C ${x + 30} 560, ${x - 10} 555, ${x - 5} 530`} fill="none" stroke={iron} strokeWidth="4" />
        ))}
      </svg>
      {/* Watercolour roses climbing the ironwork */}
      <ArtSpray palette={palette} asset="roses" className={`bottom-[10%] w-24 opacity-90 md:w-32 ${left ? "right-[4%]" : "left-[4%]"}`} rotate={left ? -12 : 12} />
      <ArtSpray palette={palette} asset="peony" className={`top-[30%] w-20 opacity-80 md:w-28 ${left ? "right-[24%]" : "left-[24%]"}`} rotate={left ? 8 : -8} />
    </motion.div>
  );
}

/** Heart padlock on the seam: glows, turns and fades as the gates unlock. */
function HeartLock({ t }: { t: number }) {
  return (
    <motion.div
      aria-hidden
      className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1.2, 1.7], rotate: [0, 0, -25, -25] }}
      transition={{ duration: 2.6 * t, times: [0, 0.12, 0.7, 1], ease: "easeInOut" }}
    >
      <svg width="88" height="104" viewBox="0 0 64 76" style={{ filter: `drop-shadow(0 0 18px ${alpha("#ffd98a", 0.9)})` }}>
        <path d="M18 30 V 20 a 14 14 0 0 1 28 0 V 30" fill="none" stroke="#c9a04a" strokeWidth="5" />
        <path d="M32 72 C 10 56 4 44 4 36 C 4 28 10 24 17 24 C 23 24 28 28 32 33 C 36 28 41 24 47 24 C 54 24 60 28 60 36 C 60 44 54 56 32 72 Z" fill="#d8b25a" />
        <circle cx="32" cy="42" r="4" fill="#5b4320" />
        <rect x="30.5" y="44" width="3" height="9" rx="1.5" fill="#5b4320" />
      </svg>
    </motion.div>
  );
}

function GardenGate({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const reduce = useReducedMotion();
  const t = reduce ? 0 : 1;
  const eyebrow = useEyebrow("Welcome to our secret garden");
  const art = getArtCollection(palette.style.art);

  return (
    <>
      {/* Sunlit watercolour garden behind the gates */}
      {art ? (
        <div className="absolute inset-0">
          <Image
            src={art.hero.src}
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={art.hero.blurDataURL}
            className="object-cover"
            style={{ objectPosition: "50% 55%", filter: palette.isDark ? "brightness(0.7) saturate(0.9)" : "saturate(1.03)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 62% 46% at 50% 46%, ${alpha(palette.background, palette.isDark ? 0.78 : 0.9)} 0%, ${alpha(palette.background, 0.46)} 50%, transparent 78%)`,
            }}
          />
          <div className="absolute inset-x-0 top-0 h-40" style={{ background: `linear-gradient(180deg, ${palette.background} 0%, transparent 100%)` }} />
          <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: `linear-gradient(0deg, ${alpha(palette.background, 0.7)} 0%, transparent 100%)` }} />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 55% at 50% 40%, ${alpha("#fff8dc", 0.95)} 0%, ${mix(palette.background, "#fff8dc", 0.4)} 40%, ${mix(palette.background, palette.leaf, 0.18)} 100%)`,
          }}
        />
      )}
      <AmbientLayer palette={palette} />

      {/* Light spilling through the seam, widening as the gates open */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 z-[35] -translate-x-1/2"
        style={{ background: `linear-gradient(90deg, transparent, ${alpha("#fff4c8", 0.95)}, transparent)`, filter: "blur(6px)" }}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: ["0vw", "6vw", "120vw"], opacity: [0, 1, 0] }}
        transition={{ delay: 1.3 * t, duration: 2.6 * t, times: [0, 0.3, 1], ease: "easeOut" }}
      />

      {/* Petal + butterfly burst out of the opening */}
      {t > 0 && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[36] flex items-center justify-center">
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2 + seeded(i) * 0.3;
            const d = 220 + seeded(i + 40) * 380;
            return (
              <motion.svg
                key={`p${i}`}
                width="14"
                height="18"
                viewBox="0 0 20 26"
                className="absolute"
                initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
                animate={{ opacity: [0, 1, 0], x: Math.cos(a) * d, y: Math.sin(a) * d * 0.7 + 120, rotate: 360 * (seeded(i + 7) - 0.5) * 2 }}
                transition={{ delay: 2 + seeded(i + 3) * 0.5, duration: 2.6, ease: "easeOut" }}
              >
                <path d="M10 0 C 18 6, 20 16, 10 26 C 0 16, 2 6, 10 0 Z" fill={palette.petals[i % 3]} />
              </motion.svg>
            );
          })}
          {[-1, 1, -1, 1, 0].map((dir, i) => (
            <motion.div
              key={`b${i}`}
              className="absolute"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: [0, 1, 1, 0], x: dir * (260 + i * 90), y: -220 - i * 50 }}
              transition={{ delay: 2.2 + i * 0.18, duration: 3.4, ease: "easeOut" }}
            >
              <ButterflyShape color={palette.petals[i % 3]} accent={palette.primary} size={30 + (i % 2) * 8} />
            </motion.div>
          ))}
        </div>
      )}

      <GateLeaf side="left" palette={palette} t={t} />
      <GateLeaf side="right" palette={palette} t={t} />
      <HeartLock t={t} />

      <motion.div className="relative z-10 px-6 pt-10" style={{ y: contentY, opacity: contentOpacity }}>
        <CenterNames palette={palette} wedding={wedding} delay={2.9 * t} eyebrow={eyebrow} size="text-5xl md:text-7xl" />
      </motion.div>
    </>
  );
}

/** Dispatches the curtain material chosen by the template's style. */
export function CurtainHero(props: LayoutProps) {
  return props.palette.style.curtain === "ivy" ? <GardenGate {...props} /> : <VelvetCurtain {...props} />;
}
