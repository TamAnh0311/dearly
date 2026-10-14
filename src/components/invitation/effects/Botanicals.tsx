"use client";

/**
 * Botanical SVG effects: a flower that grows from its stem (stem draws,
 * leaves unfurl, petals bloom, then it sways in the breeze), and a vine
 * whose growth is driven by an external progress value (e.g. scroll).
 */

import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import { EASE_OUT } from "../utils";

interface GrowingFlowerProps {
  /** Petal colour. */
  petal: string;
  /** Inner petal / centre highlight colour. */
  petalInner: string;
  leaf: string;
  /** Rendered height in px; width scales proportionally. */
  height?: number;
  /** Seconds before growth starts. */
  delay?: number;
  /** Number of petals (5–8 look best). */
  petals?: number;
  /** Mirror horizontally. */
  flip?: boolean;
  /** Stem curvature preset. */
  bend?: "left" | "right" | "straight";
  className?: string;
}

const STEMS = {
  left: "M60 300 C 58 250, 40 210, 46 160 C 50 130, 56 118, 58 104",
  right: "M60 300 C 62 250, 80 210, 74 160 C 70 130, 64 118, 62 104",
  straight: "M60 300 C 56 250, 66 200, 60 150 C 57 128, 60 116, 60 104",
} as const;

/** Bloom centre per stem preset (end point of the stem path). */
const HEADS = { left: [58, 104], right: [62, 104], straight: [60, 104] } as const;

/** A single flower that grows, blooms and sways. */
export function GrowingFlower({
  petal,
  petalInner,
  leaf,
  height = 260,
  delay = 0,
  petals = 6,
  flip = false,
  bend = "straight",
  className,
}: GrowingFlowerProps) {
  const reduce = useReducedMotion();
  const [cx, cy] = HEADS[bend];
  const stemDur = reduce ? 0 : 1.8;
  const bloomAt = delay + stemDur * 0.85;

  return (
    <svg
      viewBox="0 0 120 300"
      width={(height * 120) / 300}
      height={height}
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}
      aria-hidden
    >
      <motion.g
        style={{ originX: 0.5, originY: 1 }}
        animate={reduce ? undefined : { rotate: [-1.6, 1.6, -1.6] }}
        transition={{ duration: 6 + petals * 0.3, repeat: Infinity, ease: "easeInOut", delay: delay + 2 }}
      >
        {/* Stem */}
        <motion.path
          d={STEMS[bend]}
          stroke={leaf}
          strokeWidth={2.4}
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: stemDur, delay, ease: "easeInOut" }}
        />

        {/* Leaves unfurl from their base */}
        {[
          { d: "M61 232 C 80 214, 98 216, 108 202 C 96 226, 80 236, 61 232 Z", t: 0.35 },
          { d: "M57 190 C 38 176, 22 180, 12 166 C 24 190, 40 198, 57 190 Z", t: 0.55 },
          { d: "M59 150 C 72 140, 84 142, 90 132 C 84 150, 72 156, 59 150 Z", t: 0.72 },
        ].map((l, i) => (
          <motion.path
            key={i}
            d={l.d}
            fill={leaf}
            opacity={0.9}
            style={{ originX: i === 1 ? 1 : 0, originY: 1 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: reduce ? 0 : 0.9, delay: delay + stemDur * l.t, ease: EASE_OUT }}
          />
        ))}

        {/* Bloom: petals open outward from the centre */}
        <g>
          {Array.from({ length: petals }, (_, i) => {
            const angle = (360 / petals) * i;
            return (
              <g key={i} transform={`rotate(${angle} ${cx} ${cy})`}>
                <motion.ellipse
                  cx={cx}
                  cy={cy - 17}
                  rx={10.5}
                  ry={17}
                  fill={petal}
                  style={{ originX: 0.5, originY: 1 }}
                  initial={{ scaleY: 0, scaleX: 0.3, opacity: 0 }}
                  animate={{ scaleY: 1, scaleX: 1, opacity: 0.95 }}
                  transition={{
                    duration: reduce ? 0 : 1.1,
                    delay: bloomAt + i * 0.07,
                    ease: EASE_OUT,
                  }}
                />
                <motion.ellipse
                  cx={cx}
                  cy={cy - 11}
                  rx={5}
                  ry={10}
                  fill={petalInner}
                  style={{ originX: 0.5, originY: 1 }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 0.8 }}
                  transition={{ duration: reduce ? 0 : 0.9, delay: bloomAt + 0.3 + i * 0.07, ease: EASE_OUT }}
                />
              </g>
            );
          })}
          <motion.circle
            cx={cx}
            cy={cy}
            r={6.5}
            fill="#f3d27a"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 14, delay: bloomAt + 0.5 }}
          />
          {[0, 72, 144, 216, 288].map((a) => (
            <motion.circle
              key={a}
              cx={cx + Math.cos((a * Math.PI) / 180) * 3}
              cy={cy + Math.sin((a * Math.PI) / 180) * 3}
              r={1}
              fill="#b5813b"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: bloomAt + 0.8 }}
            />
          ))}
        </g>
      </motion.g>
    </svg>
  );
}

/** A small closed bud on a thin stem — used to fill gaps between blooms. */
export function GrowingBud({
  color,
  leaf,
  height = 150,
  delay = 0,
  flip = false,
}: {
  color: string;
  leaf: string;
  height?: number;
  delay?: number;
  flip?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 60 200"
      width={(height * 60) / 200}
      height={height}
      style={{ transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}
      aria-hidden
    >
      <motion.g
        style={{ originX: 0.5, originY: 1 }}
        animate={reduce ? undefined : { rotate: [-2.5, 2.5, -2.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: delay + 1.5 }}
      >
        <motion.path
          d="M30 200 C 26 160, 38 120, 32 70"
          stroke={leaf}
          strokeWidth={1.8}
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 1.4, delay, ease: "easeInOut" }}
        />
        <motion.path
          d="M31 130 C 44 120, 52 124, 58 112 C 52 132, 42 136, 31 130 Z"
          fill={leaf}
          style={{ originX: 0, originY: 1 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.8, delay: delay + 0.7, ease: EASE_OUT }}
        />
        <motion.path
          d="M32 72 C 20 60, 22 40, 32 30 C 42 40, 44 60, 32 72 Z"
          fill={color}
          style={{ originX: 0.5, originY: 1 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 12, delay: delay + 1.2 }}
        />
        <motion.path
          d="M32 72 C 26 66, 25 56, 28 48"
          stroke={leaf}
          strokeWidth={1.4}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: delay + 1.5 }}
        />
      </motion.g>
    </svg>
  );
}

/** A meandering vine whose growth (0..1) is driven by a MotionValue, e.g. scroll progress. */
export function ScrollVine({
  progress,
  leaf,
  bloom,
  className,
  flip = false,
}: {
  progress: MotionValue<number>;
  leaf: string;
  bloom: string;
  className?: string;
  flip?: boolean;
}) {
  const leaves = [
    { x: 38, y: 90, r: -30 },
    { x: 18, y: 190, r: 200 },
    { x: 42, y: 290, r: -20 },
    { x: 16, y: 400, r: 190 },
    { x: 40, y: 500, r: -35 },
    { x: 20, y: 600, r: 195 },
  ];
  return (
    <svg
      viewBox="0 0 60 700"
      preserveAspectRatio="none"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden
    >
      <motion.path
        d="M30 0 C 50 60, 10 120, 30 180 S 50 300, 30 360 S 10 480, 30 540 S 50 640, 30 700"
        stroke={leaf}
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
        style={{ pathLength: progress }}
      />
      {leaves.map((l, i) => (
        <motion.path
          key={i}
          d="M0 0 C 6 -8, 16 -8, 20 0 C 16 8, 6 8, 0 0 Z"
          fill={leaf}
          transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}
          style={{ opacity: progress }}
        />
      ))}
      {[180, 360, 540].map((y) => (
        <motion.circle key={y} cx={30} cy={y} r={4} fill={bloom} style={{ opacity: progress }} />
      ))}
    </svg>
  );
}
