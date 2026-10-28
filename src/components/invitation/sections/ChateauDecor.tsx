"use client";

/**
 * Premium SVG decorative elements for the Chateau template.
 *
 * Includes ornate botanical corners, golden arch frames, rich scrollwork
 * dividers, vertical botanical vines, and a lush circular wreath. All
 * elements animate with framer-motion scroll-triggered reveals and spring
 * physics for a hand-crafted, luxurious feel.
 */

import { motion } from "framer-motion";
import type { InvitationPalette } from "../utils";
import { alpha } from "../utils";

/* ─── Shared animation defaults ─────────────────────────────────────────── */

const VIEWPORT = { once: true, margin: "-40px" } as const;

const FADE_IN = {
  initial: { opacity: 0, scale: 0.7 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: VIEWPORT,
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
} as const;

const DRAW = {
  initial: { pathLength: 0 },
  whileInView: { pathLength: 1 },
  viewport: VIEWPORT,
  transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
} as const;

const SPRING_IN = {
  initial: { opacity: 0, scale: 0 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: VIEWPORT,
  transition: { type: "spring", stiffness: 260, damping: 20 },
} as const;

/* ─── Leaf & flower primitives ──────────────────────────────────────────── */

interface LeafProps {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  angle: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

/** Single botanical ellipse leaf with optional stroke. */
function Leaf({ cx, cy, rx, ry, angle, fill, stroke, strokeWidth }: LeafProps) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      transform={`rotate(${angle} ${cx} ${cy})`}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

/** A detailed leaf shape using a path for more organic appearance. */
function DetailedLeaf({
  x,
  y,
  size,
  angle,
  fill,
  stroke,
}: {
  x: number;
  y: number;
  size: number;
  angle: number;
  fill: string;
  stroke?: string;
}) {
  const s = size;
  return (
    <path
      d={`M${x},${y} C${x - s * 0.3},${y - s * 0.6} ${x - s * 0.1},${y - s * 1.2} ${x},${y - s * 1.4} C${x + s * 0.1},${y - s * 1.2} ${x + s * 0.3},${y - s * 0.6} ${x},${y}Z`}
      transform={`rotate(${angle} ${x} ${y})`}
      fill={fill}
      stroke={stroke || "none"}
      strokeWidth={stroke ? 0.5 : 0}
    />
  );
}

/** Small accent flower with petals radiating from centre. */
function FlowerBud({
  cx,
  cy,
  r,
  petalR,
  fill,
  petalFill,
}: {
  cx: number;
  cy: number;
  r: number;
  petalR: number;
  fill: string;
  petalFill: string;
}) {
  const petals = 5;
  return (
    <g>
      {Array.from({ length: petals }, (_, i) => {
        const a = ((360 / petals) * i * Math.PI) / 180;
        return (
          <ellipse
            key={i}
            cx={cx + Math.cos(a) * r * 0.6}
            cy={cy + Math.sin(a) * r * 0.6}
            rx={petalR * 0.7}
            ry={petalR}
            transform={`rotate(${(360 / petals) * i} ${cx + Math.cos(a) * r * 0.6} ${cy + Math.sin(a) * r * 0.6})`}
            fill={petalFill}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.35} fill={fill} />
    </g>
  );
}

/** Small diamond ornament. */
function Diamond({ cx, cy, size, fill }: { cx: number; cy: number; size: number; fill: string }) {
  const h = size / 2;
  return <polygon points={`${cx},${cy - h} ${cx + h * 0.6},${cy} ${cx},${cy + h} ${cx - h * 0.6},${cy}`} fill={fill} />;
}

/* ─── GoldenArchFrame ──────────────────────────────────────────────────── */

/**
 * Ornate golden arch frame that wraps content, decorated with dense
 * botanical elements along the arch curve, a top crown cluster, corner
 * diamonds, and vine tendrils. The key decorative element of the template.
 */
export function GoldenArchFrame({
  palette,
  children,
}: {
  palette: InvitationPalette;
  children: React.ReactNode;
}) {
  const goldOuter = alpha(palette.primary, 0.5);
  const goldInner = alpha(palette.primary, 0.25);
  const leafColor = alpha(palette.leaf, 0.6);
  const leafFill = alpha(palette.leaf, 0.35);
  const flowerColor = alpha(palette.primary, 0.55);
  const flowerPetal = alpha(palette.primary, 0.3);
  const diamondColor = alpha(palette.primary, 0.4);

  /**
   * Generate positions along the arch curve for botanical decorations.
   * Uses parametric coordinates on the arch border.
   */
  const archBotanicals = Array.from({ length: 18 }, (_, i) => {
    // Walk along the arch from bottom-left, up and over, to bottom-right
    const t = i / 17; // 0..1
    let x: number;
    let y: number;
    let rotation: number;

    if (t < 0.15) {
      // Left side, straight portion
      x = 0;
      y = 1 - t / 0.15 * 0.45; // bottom to midpoint
      rotation = -80 + t * 200;
    } else if (t > 0.85) {
      // Right side, straight portion
      x = 1;
      y = 1 - (1 - t) / 0.15 * 0.45;
      rotation = 80 - (1 - t) * 200;
    } else {
      // Arch curve (semi-elliptical)
      const archT = (t - 0.15) / 0.7; // 0..1 along the arch
      const angle = Math.PI * (1 - archT); // pi..0
      x = 0.5 + Math.cos(angle) * 0.5;
      y = 0.55 - Math.sin(angle) * 0.55;
      rotation = (-angle * 180) / Math.PI + 90;
    }

    const isFlower = i % 4 === 2;
    const leafSize = 6 + (i % 3) * 2;

    return { x, y, rotation, isFlower, leafSize, index: i };
  });

  return (
    <div className="relative mx-auto w-full max-w-sm" style={{ aspectRatio: "5/8" }}>
      {/* Outer arch border */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          border: `2px solid ${goldOuter}`,
          borderRadius: "50% 50% 1rem 1rem",
        }}
      >
        {/* Inner arch border */}
        <div
          className="absolute"
          style={{
            inset: "14px",
            border: `0.8px solid ${goldInner}`,
            borderRadius: "50% 50% 0.5rem 0.5rem",
          }}
        />
      </div>

      {/* Botanical decorations along the arch edges */}
      <motion.svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 160"
        preserveAspectRatio="none"
        aria-hidden
        {...FADE_IN}
      >
        {archBotanicals.map((b) => {
          const svgX = b.x * 100;
          const svgY = b.y * 160;
          if (b.isFlower) {
            return (
              <motion.g
                key={`ab-${b.index}`}
                {...SPRING_IN}
                transition={{
                  ...SPRING_IN.transition,
                  delay: 0.1 + b.index * 0.04,
                }}
              >
                <FlowerBud
                  cx={svgX}
                  cy={svgY}
                  r={3}
                  petalR={2}
                  fill={flowerColor}
                  petalFill={flowerPetal}
                />
              </motion.g>
            );
          }
          return (
            <motion.g
              key={`ab-${b.index}`}
              {...SPRING_IN}
              transition={{
                ...SPRING_IN.transition,
                delay: 0.08 + b.index * 0.035,
              }}
            >
              <DetailedLeaf
                x={svgX}
                y={svgY}
                size={b.leafSize}
                angle={b.rotation}
                fill={leafFill}
                stroke={leafColor}
              />
            </motion.g>
          );
        })}

        {/* Top crown cluster — 5 leaves + flower at apex */}
        <motion.g
          {...SPRING_IN}
          transition={{ ...SPRING_IN.transition, delay: 0.5 }}
        >
          <DetailedLeaf x={50} y={4} size={9} angle={0} fill={leafFill} stroke={leafColor} />
          <DetailedLeaf x={44} y={6} size={7} angle={-25} fill={leafFill} stroke={leafColor} />
          <DetailedLeaf x={56} y={6} size={7} angle={25} fill={leafFill} stroke={leafColor} />
          <DetailedLeaf x={40} y={9} size={5.5} angle={-45} fill={leafFill} stroke={leafColor} />
          <DetailedLeaf x={60} y={9} size={5.5} angle={45} fill={leafFill} stroke={leafColor} />
          <FlowerBud cx={50} cy={3} r={3.5} petalR={2.5} fill={flowerColor} petalFill={flowerPetal} />
        </motion.g>

        {/* Vine tendrils on left side */}
        <motion.path
          d="M4,100 C-2,90 2,82 6,75 C3,72 -1,66 3,60"
          stroke={leafColor}
          strokeWidth="0.6"
          fill="none"
          strokeLinecap="round"
          {...DRAW}
          transition={{ ...DRAW.transition, delay: 0.3 }}
        />
        <motion.path
          d="M4,105 C-3,98 1,92 5,88"
          stroke={leafColor}
          strokeWidth="0.5"
          fill="none"
          strokeLinecap="round"
          {...DRAW}
          transition={{ ...DRAW.transition, delay: 0.4 }}
        />

        {/* Vine tendrils on right side */}
        <motion.path
          d="M96,100 C102,90 98,82 94,75 C97,72 101,66 97,60"
          stroke={leafColor}
          strokeWidth="0.6"
          fill="none"
          strokeLinecap="round"
          {...DRAW}
          transition={{ ...DRAW.transition, delay: 0.3 }}
        />
        <motion.path
          d="M96,105 C103,98 99,92 95,88"
          stroke={leafColor}
          strokeWidth="0.5"
          fill="none"
          strokeLinecap="round"
          {...DRAW}
          transition={{ ...DRAW.transition, delay: 0.4 }}
        />

        {/* Bottom corner diamonds */}
        <motion.g
          {...FADE_IN}
          transition={{ ...FADE_IN.transition, delay: 0.6 }}
        >
          <Diamond cx={8} cy={152} size={6} fill={diamondColor} />
          <Diamond cx={92} cy={152} size={6} fill={diamondColor} />
          {/* Smaller accent diamonds */}
          <Diamond cx={14} cy={148} size={3.5} fill={alpha(palette.primary, 0.25)} />
          <Diamond cx={86} cy={148} size={3.5} fill={alpha(palette.primary, 0.25)} />
        </motion.g>
      </motion.svg>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center px-6 pb-6 pt-12">
        {children}
      </div>
    </div>
  );
}

/* ─── ChateauCorners (BIGGER version) ──────────────────────────────────── */

interface CornerClusterProps {
  size: number;
  leafColor: string;
  leafFill: string;
  flowerColor: string;
  flowerPetal: string;
}

/**
 * A single corner's dense leaf + flower cluster with vine stems,
 * drawn at top-left origin. Larger and more lush than before.
 */
function CornerCluster({ size: s, leafColor, leafFill, flowerColor, flowerPetal }: CornerClusterProps) {
  return (
    <g>
      {/* Vine stems connecting the leaves */}
      <path
        d={`M${s * 0.05},${s * 0.5} C${s * 0.1},${s * 0.35} ${s * 0.15},${s * 0.22} ${s * 0.25},${s * 0.15}`}
        stroke={leafColor}
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M${s * 0.5},${s * 0.05} C${s * 0.35},${s * 0.1} ${s * 0.22},${s * 0.15} ${s * 0.15},${s * 0.25}`}
        stroke={leafColor}
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M${s * 0.12},${s * 0.42} C${s * 0.18},${s * 0.32} ${s * 0.28},${s * 0.26} ${s * 0.38},${s * 0.22}`}
        stroke={leafColor}
        strokeWidth="0.6"
        fill="none"
        strokeLinecap="round"
      />

      {/* Main leaves — 10 varied leaves per corner */}
      <DetailedLeaf x={s * 0.12} y={s * 0.42} size={s * 0.14} angle={-30} fill={leafFill} stroke={leafColor} />
      <DetailedLeaf x={s * 0.2} y={s * 0.3} size={s * 0.16} angle={-20} fill={leafFill} stroke={leafColor} />
      <DetailedLeaf x={s * 0.08} y={s * 0.28} size={s * 0.11} angle={-55} fill={leafFill} stroke={leafColor} />
      <DetailedLeaf x={s * 0.3} y={s * 0.2} size={s * 0.15} angle={15} fill={leafFill} stroke={leafColor} />
      <DetailedLeaf x={s * 0.42} y={s * 0.12} size={s * 0.14} angle={30} fill={leafFill} stroke={leafColor} />
      <DetailedLeaf x={s * 0.28} y={s * 0.08} size={s * 0.11} angle={55} fill={leafFill} stroke={leafColor} />
      <DetailedLeaf x={s * 0.15} y={s * 0.48} size={s * 0.1} angle={-15} fill={leafFill} stroke={leafColor} />
      <DetailedLeaf x={s * 0.38} y={s * 0.28} size={s * 0.12} angle={25} fill={leafFill} stroke={leafColor} />
      <DetailedLeaf x={s * 0.48} y={s * 0.15} size={s * 0.1} angle={50} fill={leafFill} stroke={leafColor} />
      <DetailedLeaf x={s * 0.05} y={s * 0.55} size={s * 0.08} angle={-10} fill={leafFill} stroke={leafColor} />

      {/* Small ellipse leaves for extra density */}
      <Leaf cx={s * 0.22} cy={s * 0.42} rx={s * 0.03} ry={s * 0.08} angle={-40} fill={leafFill} stroke={leafColor} strokeWidth={0.5} />
      <Leaf cx={s * 0.42} cy={s * 0.22} rx={s * 0.03} ry={s * 0.08} angle={40} fill={leafFill} stroke={leafColor} strokeWidth={0.5} />

      {/* 3 flowers with petals */}
      <FlowerBud cx={s * 0.18} cy={s * 0.18} r={s * 0.04} petalR={s * 0.028} fill={flowerColor} petalFill={flowerPetal} />
      <FlowerBud cx={s * 0.35} cy={s * 0.35} r={s * 0.035} petalR={s * 0.024} fill={flowerColor} petalFill={flowerPetal} />
      <FlowerBud cx={s * 0.08} cy={s * 0.38} r={s * 0.03} petalR={s * 0.02} fill={flowerColor} petalFill={flowerPetal} />
    </g>
  );
}

/**
 * Botanical SVG corner clusters for section decoration.
 * Bigger, denser, and more luxurious. Parent must be `position: relative`.
 */
export function ChateauCorners({ palette, className }: { palette: InvitationPalette; className?: string }) {
  const size = 120;
  const leafColor = alpha(palette.leaf, 0.6);
  const leafFill = alpha(palette.leaf, 0.3);
  const flowerColor = alpha(palette.primary, 0.6);
  const flowerPetal = alpha(palette.primary, 0.3);

  const positions = [
    { key: "tl", style: { top: 0, left: 0 }, scaleX: 1, scaleY: 1 },
    { key: "tr", style: { top: 0, right: 0 }, scaleX: -1, scaleY: 1 },
    { key: "bl", style: { bottom: 0, left: 0 }, scaleX: 1, scaleY: -1 },
    { key: "br", style: { bottom: 0, right: 0 }, scaleX: -1, scaleY: -1 },
  ] as const;

  return (
    <>
      {positions.map(({ key, style, scaleX, scaleY }) => (
        <motion.svg
          key={key}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={`pointer-events-none absolute ${className ?? ""}`}
          style={{ ...style, transform: `scaleX(${scaleX}) scaleY(${scaleY})` }}
          aria-hidden
          {...FADE_IN}
        >
          <CornerCluster
            size={size}
            leafColor={leafColor}
            leafFill={leafFill}
            flowerColor={flowerColor}
            flowerPetal={flowerPetal}
          />
        </motion.svg>
      ))}
    </>
  );
}

/* ─── ChateauDivider (RICHER version) ──────────────────────────────────── */

/**
 * Ornate golden SVG divider with dual-spiral scrollwork, a central floral
 * rosette, and gold endpoint dots. 340px wide, horizontally centered.
 */
export function ChateauDivider({ palette }: { palette: InvitationPalette }) {
  const strokeColor = alpha(palette.primary, 0.5);
  const accentColor = alpha(palette.primary, 0.6);
  const dotColor = alpha(palette.primary, 0.45);
  const rosetteFill = alpha(palette.primary, 0.2);

  return (
    <div className="flex justify-center py-4">
      <svg width="340" height="40" viewBox="0 0 340 40" fill="none" aria-hidden>
        {/* Left outer spiral */}
        <motion.path
          d="M8 20 C20 8, 38 8, 52 16 C62 20, 58 28, 50 26"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          {...DRAW}
        />
        {/* Left inner spiral */}
        <motion.path
          d="M12 20 C24 10, 40 10, 55 18 S80 28, 100 20"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          {...DRAW}
        />
        {/* Left connecting scroll to centre */}
        <motion.path
          d="M100 20 C115 14, 130 14, 145 20"
          stroke={strokeColor}
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
          {...DRAW}
          transition={{ ...DRAW.transition, delay: 0.15 }}
        />

        {/* Right outer spiral (mirrored) */}
        <motion.path
          d="M332 20 C320 8, 302 8, 288 16 C278 20, 282 28, 290 26"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          {...DRAW}
        />
        {/* Right inner spiral */}
        <motion.path
          d="M328 20 C316 10, 300 10, 285 18 S260 28, 240 20"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          {...DRAW}
        />
        {/* Right connecting scroll to centre */}
        <motion.path
          d="M240 20 C225 14, 210 14, 195 20"
          stroke={strokeColor}
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
          {...DRAW}
          transition={{ ...DRAW.transition, delay: 0.15 }}
        />

        {/* Central floral rosette */}
        <motion.g
          {...FADE_IN}
          transition={{ ...FADE_IN.transition, delay: 0.4 }}
        >
          {/* Rosette petals — 8 petals around the centre */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (360 / 8) * i;
            const rad = (angle * Math.PI) / 180;
            const px = 170 + Math.cos(rad) * 5;
            const py = 20 + Math.sin(rad) * 5;
            return (
              <ellipse
                key={`rp-${i}`}
                cx={px}
                cy={py}
                rx={2.5}
                ry={5}
                transform={`rotate(${angle} ${px} ${py})`}
                fill={rosetteFill}
                stroke={strokeColor}
                strokeWidth="0.6"
              />
            );
          })}
          {/* Rosette centre */}
          <circle cx={170} cy={20} r={3} fill={accentColor} />
          <circle cx={170} cy={20} r={1.5} fill={alpha(palette.primary, 0.8)} />
        </motion.g>

        {/* Gold endpoint dots */}
        <motion.g
          {...FADE_IN}
          transition={{ ...FADE_IN.transition, delay: 0.3 }}
        >
          <circle cx={4} cy={20} r={2} fill={dotColor} />
          <circle cx={336} cy={20} r={2} fill={dotColor} />
          {/* Secondary smaller dots */}
          <circle cx={14} cy={20} r={1.2} fill={alpha(palette.primary, 0.3)} />
          <circle cx={326} cy={20} r={1.2} fill={alpha(palette.primary, 0.3)} />
        </motion.g>
      </svg>
    </div>
  );
}

/* ─── BotanicalVine ────────────────────────────────────────────────────── */

/**
 * Tall vertical botanical vine illustration for schedule timeline sections.
 * Features a curved central stem, alternating leaves, and small flower buds.
 * The stem draws itself in and leaves spring in with stagger on scroll.
 */
export function BotanicalVine({
  palette,
  height = 450,
}: {
  palette: InvitationPalette;
  height?: number;
}) {
  const stemColor = alpha(palette.leaf, 0.5);
  const leafColor = alpha(palette.leaf, 0.55);
  const leafFill = alpha(palette.leaf, 0.25);
  const budColor = alpha(palette.primary, 0.5);
  const budPetal = alpha(palette.primary, 0.25);

  const viewH = height;
  const viewW = 60;
  const midX = 30;

  /** Generate curved stem control points for a natural S-curve. */
  const stemPath = `M${midX},${viewH} C${midX + 8},${viewH * 0.85} ${midX - 10},${viewH * 0.7} ${midX + 4},${viewH * 0.55} C${midX + 12},${viewH * 0.42} ${midX - 8},${viewH * 0.28} ${midX + 2},${viewH * 0.15} C${midX + 6},${viewH * 0.08} ${midX - 2},${viewH * 0.02} ${midX},0`;

  /** Leaf positions alternating left and right along the stem. */
  const leaves = Array.from({ length: 10 }, (_, i) => {
    const t = 0.08 + (i / 9) * 0.84; // 0.08..0.92 along the stem
    const y = viewH * (1 - t);
    const side = i % 2 === 0 ? -1 : 1;
    // X offset follows the S-curve roughly
    const sway = Math.sin(t * Math.PI * 2) * 6;
    const x = midX + sway + side * 12;
    const angle = side === -1 ? -35 - i * 3 : 35 + i * 3;
    const leafSize = 8 + (i % 3) * 2.5;
    return { x, y, angle, side, leafSize, index: i };
  });

  /** Flower bud positions — 3 buds spaced along the vine. */
  const buds = [0.2, 0.5, 0.8].map((t, i) => {
    const y = viewH * (1 - t);
    const sway = Math.sin(t * Math.PI * 2) * 6;
    const side = i % 2 === 0 ? 1 : -1;
    const x = midX + sway + side * 8;
    return { x, y, index: i };
  });

  return (
    <svg
      width={viewW}
      height={viewH}
      viewBox={`0 0 ${viewW} ${viewH}`}
      className="pointer-events-none"
      aria-hidden
    >
      {/* Main stem path — draws in on scroll */}
      <motion.path
        d={stemPath}
        stroke={stemColor}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        {...DRAW}
        transition={{ ...DRAW.transition, duration: 2 }}
      />

      {/* Secondary thinner stem strand for depth */}
      <motion.path
        d={`M${midX + 2},${viewH} C${midX + 10},${viewH * 0.83} ${midX - 8},${viewH * 0.68} ${midX + 6},${viewH * 0.53} C${midX + 14},${viewH * 0.4} ${midX - 6},${viewH * 0.26} ${midX + 4},${viewH * 0.13}`}
        stroke={alpha(palette.leaf, 0.25)}
        strokeWidth="0.7"
        fill="none"
        strokeLinecap="round"
        {...DRAW}
        transition={{ ...DRAW.transition, duration: 2.2, delay: 0.3 }}
      />

      {/* Alternating leaves with spring-in animation */}
      {leaves.map((l) => (
        <motion.g
          key={`vine-leaf-${l.index}`}
          {...SPRING_IN}
          transition={{
            ...SPRING_IN.transition,
            delay: 0.3 + l.index * 0.1,
          }}
        >
          <DetailedLeaf
            x={l.x}
            y={l.y}
            size={l.leafSize}
            angle={l.angle}
            fill={leafFill}
            stroke={leafColor}
          />
          {/* Small stem connecting leaf to main vine */}
          <line
            x1={midX + Math.sin((1 - l.y / viewH) * Math.PI * 2) * 6}
            y1={l.y}
            x2={l.x}
            y2={l.y}
            stroke={stemColor}
            strokeWidth="0.6"
            strokeLinecap="round"
          />
        </motion.g>
      ))}

      {/* Flower buds along the vine */}
      {buds.map((b) => (
        <motion.g
          key={`vine-bud-${b.index}`}
          {...SPRING_IN}
          transition={{
            ...SPRING_IN.transition,
            delay: 0.6 + b.index * 0.15,
          }}
        >
          <FlowerBud
            cx={b.x}
            cy={b.y}
            r={4}
            petalR={3}
            fill={budColor}
            petalFill={budPetal}
          />
        </motion.g>
      ))}
    </svg>
  );
}

/* ─── ChateauWreath (ENHANCED) ─────────────────────────────────────────── */

/**
 * Lush circular botanical wreath for monograms or footer content.
 * Features 20 filled leaves, 6 flower accents, and two dove silhouettes
 * at the top. Wraps `children` at the centre.
 */
export function ChateauWreath({
  palette,
  size = 200,
  children,
}: {
  palette: InvitationPalette;
  size?: number;
  children?: React.ReactNode;
}) {
  const leafColor = alpha(palette.leaf, 0.55);
  const leafFill = alpha(palette.leaf, 0.3);
  const flowerColor = alpha(palette.primary, 0.55);
  const flowerPetal = alpha(palette.primary, 0.28);
  const r = size / 2;
  const leafCount = 20;

  /** Positions leaves evenly around a circle with varied sizes. */
  const leaves = Array.from({ length: leafCount }, (_, i) => {
    const angle = (360 / leafCount) * i;
    const rad = (angle * Math.PI) / 180;
    const cx = r + Math.cos(rad) * (r * 0.78);
    const cy = r + Math.sin(rad) * (r * 0.78);
    const leafSize = size * 0.065 + (i % 3) * size * 0.012;
    return { cx, cy, angle: angle + 90, leafSize };
  });

  /** 6 flower accent positions evenly spaced. */
  const flowers = [0, 60, 120, 180, 240, 300].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return {
      cx: r + Math.cos(rad) * (r * 0.78),
      cy: r + Math.sin(rad) * (r * 0.78),
    };
  });

  /** Dove silhouette path — a simple bird shape. */
  const dovePath = (dx: number, dy: number, flipX: boolean) => {
    const sx = flipX ? -1 : 1;
    return `M${dx},${dy} C${dx + sx * 3},${dy - 4} ${dx + sx * 8},${dy - 6} ${dx + sx * 12},${dy - 3} C${dx + sx * 10},${dy - 5} ${dx + sx * 6},${dy - 8} ${dx + sx * 4},${dy - 7} C${dx + sx * 6},${dy - 6} ${dx + sx * 8},${dy - 4} ${dx + sx * 12},${dy - 3} M${dx + sx * 5},${dy - 5} C${dx + sx * 3},${dy - 3} ${dx + sx * 1},${dy - 1} ${dx},${dy}`;
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        aria-hidden
      >
        {/* Filled leaves around the wreath */}
        {leaves.map((l, i) => (
          <motion.g
            key={`wleaf-${i}`}
            {...SPRING_IN}
            transition={{ ...SPRING_IN.transition, delay: i * 0.04 }}
          >
            <DetailedLeaf
              x={l.cx}
              y={l.cy}
              size={l.leafSize}
              angle={l.angle}
              fill={leafFill}
              stroke={leafColor}
            />
          </motion.g>
        ))}

        {/* Inner ring of smaller accent leaves for lushness */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (360 / 12) * i + 15; // offset from main ring
          const rad = (angle * Math.PI) / 180;
          const cx = r + Math.cos(rad) * (r * 0.65);
          const cy = r + Math.sin(rad) * (r * 0.65);
          return (
            <motion.g
              key={`inner-leaf-${i}`}
              {...SPRING_IN}
              transition={{ ...SPRING_IN.transition, delay: 0.3 + i * 0.03 }}
            >
              <Leaf
                cx={cx}
                cy={cy}
                rx={size * 0.018}
                ry={size * 0.05}
                angle={angle + 90}
                fill={alpha(palette.leaf, 0.2)}
                stroke={alpha(palette.leaf, 0.35)}
                strokeWidth={0.6}
              />
            </motion.g>
          );
        })}

        {/* Flower accents with petal details */}
        {flowers.map((f, i) => (
          <motion.g
            key={`wflower-${i}`}
            {...SPRING_IN}
            transition={{ ...SPRING_IN.transition, delay: 0.5 + i * 0.08 }}
          >
            <FlowerBud
              cx={f.cx}
              cy={f.cy}
              r={size * 0.025}
              petalR={size * 0.018}
              fill={flowerColor}
              petalFill={flowerPetal}
            />
          </motion.g>
        ))}

        {/* Two dove silhouettes at the top of the wreath */}
        <motion.g
          {...FADE_IN}
          transition={{ ...FADE_IN.transition, delay: 0.8 }}
        >
          <path
            d={dovePath(r - 14, r * 0.22, false)}
            stroke={alpha(palette.primary, 0.4)}
            strokeWidth="0.8"
            fill={alpha(palette.primary, 0.15)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={dovePath(r + 14, r * 0.22, true)}
            stroke={alpha(palette.primary, 0.4)}
            strokeWidth="0.8"
            fill={alpha(palette.primary, 0.15)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
