"use client";

/**
 * Curtain heroes — two signature openings sharing the "curtain" layout:
 *
 *  VelvetCurtain  A grand theatre: gold proscenium, swagged valance with
 *                 fringe and tassels, velvet drapes with sheen that gather
 *                 into tied-back swoops, a spotlight that swells on, glowing
 *                 footlights and a burst of gold dust as the show begins.
 *
 *  GardenGate     A secret garden: ivy-clad wrought-iron gates with roses and
 *                 a glowing heart lock. The lock turns, light spills through
 *                 the seam, the gates swing open in 3D, petals and butterflies
 *                 burst out, and a floral arch grows around the names.
 *
 * Timeline guidance (see AGENTS.md §4.1): ornaments 0–1.5s, signature moment
 * ≤ 3s, names rise ~2–3s. Reduced motion renders the opened end state.
 */

import { motion, useReducedMotion } from "framer-motion";
import AmbientLayer from "../effects/Ambient";
import { ButterflyShape } from "../effects/Particles";
import { GrowingFlower } from "../effects/Botanicals";
import { EASE_OUT, alpha, mix, seeded, type InvitationPalette } from "../utils";
import { CenterNames } from "./HeroParts";
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
        <CenterNames palette={palette} wedding={wedding} delay={2.2 * t} eyebrow="Tonight, the curtain rises on" ink={ink} muted={alpha(ink, 0.7)} />
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════ Garden gate ══════════════════════════════ */

/** Tileable ivy leaves with tiny blossoms, as a CSS background image. */
function ivyPattern(palette: InvitationPalette): string {
  const tones = [palette.leaf, mix(palette.leaf, "#1e3a1e", 0.35), mix(palette.leaf, "#ffffff", 0.18), mix(palette.leaf, "#2f4f2f", 0.55)];
  const leaf = (x: number, y: number, r: number, fill: string) =>
    `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0 C 8 -10 20 -10 24 0 C 20 10 8 10 0 0 Z M0 0 L22 0" fill="${fill}" stroke="${mix(fill, "#000000", 0.35)}" stroke-width="0.8"/>`;
  const spots: [number, number, number][] = [
    [4, 10, -20], [40, 4, 25], [70, 16, -40], [14, 38, 60], [50, 34, -10], [80, 46, 30],
    [0, 66, 15], [32, 62, -55], [62, 74, 40], [20, 88, -30], [52, 92, 10], [86, 84, -60],
  ];
  const leaves = spots.map(([x, y, r], i) => leaf(x, y, r, tones[i % tones.length])).join("");
  const blooms = [[30, 24], [74, 60], [12, 78]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${mix(palette.petals[0], "#ffffff", 0.3)}"/><circle cx="${x}" cy="${y}" r="1" fill="#f3d27a"/>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" fill="${mix(tones[3], "#0f240f", 0.45)}"/>${leaves}${blooms}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

/** Wrought-iron gate leaf (bars, rails, arched top, finials) over a hedge of ivy. */
function GateLeaf({ side, palette, t }: { side: "left" | "right"; palette: InvitationPalette; t: number }) {
  const left = side === "left";
  const iron = "#24221f";
  const bars = 7;
  return (
    <motion.div
      aria-hidden
      className={`absolute inset-y-0 z-30 w-1/2 ${left ? "left-0" : "right-0"}`}
      style={{ originX: left ? 0 : 1, transformPerspective: 1600, backgroundImage: ivyPattern(palette), backgroundSize: "96px 96px" }}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: left ? -112 : 112 }}
      transition={{ duration: 2.2 * t, delay: 1.9 * t, ease: [0.55, 0, 0.25, 1] }}
    >
      {/* Shade toward the seam so the leaves feel deep */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(${left ? "90deg" : "270deg"}, transparent 55%, rgba(0,0,0,0.35))` }} />
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
      {/* Roses on the gate */}
      <div className={`absolute bottom-[8%] ${left ? "right-[10%]" : "left-[10%]"} opacity-95`}>
        <GrowingFlower petal={palette.petals[0]} petalInner={palette.petals[2]} leaf={palette.leaf} height={150} delay={0.2 * t} petals={7} flip={!left} />
      </div>
      <div className={`absolute top-[36%] ${left ? "right-[30%]" : "left-[30%]"} opacity-90`}>
        <GrowingFlower petal={palette.petals[1]} petalInner={palette.petals[0]} leaf={palette.leaf} height={110} delay={0.5 * t} petals={6} flip={left} />
      </div>
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

/** Floral arch that grows around the names after the gates open. */
function FloralArch({ palette, t }: { palette: InvitationPalette; t: number }) {
  // Garden roses: blend the scheme with rose/ivory so blooms stay vivid on green schemes.
  const roses = [mix(palette.petals[0], "#ef9fb3", 0.55), "#fdf3ec", mix(palette.accent, "#f6c6cf", 0.45)];
  const path = "M 40 420 C 40 140, 160 40, 300 40 C 440 40, 560 140, 560 420";
  const blooms = Array.from({ length: 11 }, (_, i) => {
    const p = i / 10;
    const a = Math.PI * (1 - p);
    return { x: 300 + Math.cos(a) * 260, y: 420 - Math.sin(a) * 380 * (0.82 + 0.18 * Math.sin(a)), i };
  });
  return (
    <svg viewBox="0 0 600 440" className="pointer-events-none absolute left-1/2 top-1/2 z-[5] w-[min(96vw,720px)] -translate-x-1/2 -translate-y-[52%]" aria-hidden>
      <motion.path d={path} fill="none" stroke={palette.leaf} strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.6 * t, duration: 1.6 * t, ease: "easeInOut" }} />
      {blooms.map(({ x, y, i }) => (
        <motion.g key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: (2.9 + i * 0.12) * t, type: "spring", stiffness: 180, damping: 12 }} style={{ originX: `${x}px`, originY: `${y}px` }}>
          <ellipse cx={x - 14} cy={y + 6} rx="12" ry="6" fill={palette.leaf} transform={`rotate(-30 ${x - 14} ${y + 6})`} />
          <ellipse cx={x + 14} cy={y + 6} rx="12" ry="6" fill={mix(palette.leaf, "#1e3a1e", 0.25)} transform={`rotate(30 ${x + 14} ${y + 6})`} />
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx={x} cy={y - 9} rx="7" ry="11" fill={roses[i % 3]} stroke={alpha("#000000", 0.06)} transform={`rotate(${r} ${x} ${y})`} />
          ))}
          <circle cx={x} cy={y} r="5" fill="#f3d27a" />
        </motion.g>
      ))}
    </svg>
  );
}

function GardenGate({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const reduce = useReducedMotion();
  const t = reduce ? 0 : 1;

  return (
    <>
      {/* Sunlit garden behind the gates */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 55% at 50% 40%, ${alpha("#fff8dc", 0.95)} 0%, ${mix(palette.background, "#fff8dc", 0.4)} 40%, ${mix(palette.background, palette.leaf, 0.18)} 100%)`,
        }}
      />
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
          {Array.from({ length: 22 }, (_, i) => {
            const a = (i / 22) * Math.PI * 2 + seeded(i) * 0.3;
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
      <FloralArch palette={palette} t={t} />

      {/* Flowerbeds bloom at the foot of the arch once the gates are open */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] flex items-end justify-between px-2">
        {[0, 1].map((side) => (
          <div key={side} className={`flex items-end ${side ? "flex-row-reverse" : ""}`}>
            <GrowingFlower petal={mix(palette.petals[0], "#ef9fb3", 0.55)} petalInner="#fdf3ec" leaf={palette.leaf} height={240} delay={3.1 * t} petals={7} flip={!!side} bend={side ? "left" : "right"} />
            <div className="-ml-10">
              <GrowingFlower petal="#fdf3ec" petalInner={mix(palette.petals[0], "#ef9fb3", 0.4)} leaf={palette.leaf} height={170} delay={3.4 * t} petals={6} flip={!!side} />
            </div>
          </div>
        ))}
      </div>

      <motion.div className="relative z-10 px-6 pt-10" style={{ y: contentY, opacity: contentOpacity }}>
        <CenterNames palette={palette} wedding={wedding} delay={2.9 * t} eyebrow="Welcome to our secret garden" size="text-5xl md:text-7xl" />
      </motion.div>
    </>
  );
}

/** Dispatches the curtain material chosen by the template's style. */
export function CurtainHero(props: LayoutProps) {
  return props.palette.style.curtain === "ivy" ? <GardenGate {...props} /> : <VelvetCurtain {...props} />;
}
