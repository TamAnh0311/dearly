"use client";

/**
 * LottieDecoration — decorative animated illustrations implemented with
 * Framer Motion and SVG/CSS, mimicking Lottie-style effects without requiring
 * bundled JSON animation files.
 *
 * Supports: hearts, rings, flowers, sparkles, confetti.
 * Respects the user's prefers-reduced-motion accessibility setting.
 */

import { useReducedMotion, motion } from "framer-motion";
import { useMemo } from "react";

type AnimationType = "hearts" | "rings" | "flowers" | "sparkles" | "confetti";

interface LottieDecorationProps {
  /** The animation style to render. */
  type: AnimationType;
  className?: string;
  /** Width and height in px. Default: 200. */
  size?: number;
  /** Loop the animation. Default: true. */
  loop?: boolean;
  /** Start playing immediately. Default: true. */
  autoplay?: boolean;
}

// ─── Seeded random helpers (stable across renders) ──────────────────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ─── Hearts ─────────────────────────────────────────────────────────────────

/** A single SVG heart path. */
function HeartShape({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function HeartsAnimation({
  size,
  loop,
  reduced,
}: {
  size: number;
  loop: boolean;
  reduced: boolean;
}) {
  const hearts = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: seededRandom(i * 3) * 80 + 10, // % from left
        delay: seededRandom(i * 7) * 3,
        duration: 3 + seededRandom(i * 13) * 2,
        heartSize: 10 + seededRandom(i * 17) * 14,
        drift: (seededRandom(i * 23) - 0.5) * 40,
        color: i % 3 === 0 ? "#f43f5e" : i % 3 === 1 ? "#fb7185" : "#fda4af",
        opacity: 0.6 + seededRandom(i * 29) * 0.4,
      })),
    []
  );

  if (reduced) {
    return (
      <div className="relative" style={{ width: size, height: size }}>
        {hearts.slice(0, 3).map((h) => (
          <div
            key={h.id}
            className="absolute"
            style={{ left: `${h.x}%`, top: "50%", opacity: h.opacity }}
          >
            <HeartShape size={h.heartSize} color={h.color} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ width: size, height: size }}>
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{ left: `${h.x}%`, bottom: 0, opacity: h.opacity }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{
            y: [-size * 0.1, -size * 1.05],
            x: [0, h.drift],
            opacity: [0, h.opacity, h.opacity, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: loop ? Infinity : 0,
            repeatDelay: seededRandom(h.id * 37) * 1.5,
            ease: "easeOut",
          }}
        >
          <HeartShape size={h.heartSize} color={h.color} />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Rings ───────────────────────────────────────────────────────────────────

function RingsAnimation({
  size,
  loop,
  reduced,
}: {
  size: number;
  loop: boolean;
  reduced: boolean;
}) {
  const r = size * 0.28;
  const stroke = size * 0.04;
  const cx1 = size * 0.38;
  const cx2 = size * 0.62;
  const cy = size * 0.5;
  const circumference = 2 * Math.PI * r;

  if (reduced) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx1} cy={cy} r={r} fill="none" stroke="#d4af37" strokeWidth={stroke} />
        <circle cx={cx2} cy={cy} r={r} fill="none" stroke="#c0a030" strokeWidth={stroke} />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Ring 1 */}
      <motion.circle
        cx={cx1}
        cy={cy}
        r={r}
        fill="none"
        stroke="url(#ring-gold)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference, opacity: 0 }}
        animate={{
          strokeDashoffset: loop ? [circumference, 0, 0, circumference] : [circumference, 0],
          opacity: loop ? [0, 1, 1, 0] : [0, 1],
        }}
        transition={{
          duration: loop ? 4 : 2,
          repeat: loop ? Infinity : 0,
          repeatDelay: 0.5,
          ease: [0.4, 0, 0.2, 1],
          times: loop ? [0, 0.35, 0.75, 1] : [0, 1],
        }}
      />
      {/* Ring 2 (offset start) */}
      <motion.circle
        cx={cx2}
        cy={cy}
        r={r}
        fill="none"
        stroke="url(#ring-silver)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference, opacity: 0 }}
        animate={{
          strokeDashoffset: loop ? [circumference, 0, 0, circumference] : [circumference, 0],
          opacity: loop ? [0, 1, 1, 0] : [0, 1],
        }}
        transition={{
          duration: loop ? 4 : 2,
          delay: 0.4,
          repeat: loop ? Infinity : 0,
          repeatDelay: 0.5,
          ease: [0.4, 0, 0.2, 1],
          times: loop ? [0, 0.35, 0.75, 1] : [0, 1],
        }}
      />
      {/* Gleam on ring 1 */}
      <motion.circle
        cx={cx1 - r * 0.3}
        cy={cy - r * 0.55}
        r={stroke * 0.8}
        fill="white"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.9, 0], scale: [0, 1.4, 0] }}
        transition={{
          duration: 1,
          delay: loop ? 1.8 : 2,
          repeat: loop ? Infinity : 0,
          repeatDelay: 3,
        }}
      />
      <defs>
        <linearGradient id="ring-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5d060" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#a07830" />
        </linearGradient>
        <linearGradient id="ring-silver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="50%" stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#909090" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Flowers ─────────────────────────────────────────────────────────────────

function FlowersAnimation({
  size,
  loop,
  reduced,
}: {
  size: number;
  loop: boolean;
  reduced: boolean;
}) {
  const petalCount = 6;
  const cx = size / 2;
  const cy = size / 2;
  const petalLength = size * 0.32;
  const petalWidth = size * 0.12;

  const petalColors = ["#f9a8d4", "#f472b6", "#ec4899", "#fbcfe8", "#fce7f3", "#f9a8d4"];

  if (reduced) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {Array.from({ length: petalCount }, (_, i) => {
          const angle = (i / petalCount) * 360;
          return (
            <ellipse
              key={i}
              cx={cx}
              cy={cy - petalLength / 2}
              rx={petalWidth / 2}
              ry={petalLength / 2}
              fill={petalColors[i]}
              opacity={0.85}
              transform={`rotate(${angle} ${cx} ${cy})`}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={size * 0.07} fill="#fde68a" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {Array.from({ length: petalCount }, (_, i) => {
        const angle = (i / petalCount) * 360;
        return (
          <motion.ellipse
            key={i}
            cx={cx}
            cy={cy - petalLength / 2}
            rx={petalWidth / 2}
            ry={petalLength / 2}
            fill={petalColors[i]}
            opacity={0.85}
            transform={`rotate(${angle} ${cx} ${cy})`}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              loop
                ? {
                    scale: [0, 1, 1, 0.9, 1],
                    opacity: [0, 0.85, 0.85, 0.85, 0.85],
                    rotate: [angle, angle + 360],
                  }
                : { scale: [0, 1], opacity: [0, 0.85] }
            }
            transition={{
              duration: loop ? 6 : 1.2,
              delay: i * 0.08,
              repeat: loop ? Infinity : 0,
              ease: loop ? "linear" : [0.34, 1.56, 0.64, 1],
            }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        );
      })}
      {/* Centre stamen */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={size * 0.07}
        fill="#fde68a"
        initial={{ scale: 0 }}
        animate={{ scale: loop ? [0, 1, 1.1, 1] : [0, 1] }}
        transition={{
          duration: loop ? 6 : 0.6,
          repeat: loop ? Infinity : 0,
          ease: "easeOut",
        }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
    </svg>
  );
}

// ─── Sparkles ─────────────────────────────────────────────────────────────────

/** Four-pointed star sparkle. */
function SparkleShape({ s }: { s: number }) {
  const h = s / 2;
  const p = s * 0.25;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <path
        d={`M${h},0 L${h + p},${h - p} L${s},${h} L${h + p},${h + p} L${h},${s} L${h - p},${h + p} L0,${h} L${h - p},${h - p} Z`}
        fill="currentColor"
      />
    </svg>
  );
}

function SparklesAnimation({
  size,
  loop,
  reduced,
}: {
  size: number;
  loop: boolean;
  reduced: boolean;
}) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        id: i,
        x: seededRandom(i * 5) * 85 + 7.5,
        y: seededRandom(i * 11) * 85 + 7.5,
        s: 8 + seededRandom(i * 19) * 14,
        delay: seededRandom(i * 31) * 2.5,
        duration: 1.5 + seededRandom(i * 43) * 1.5,
        color: ["#fbbf24", "#f59e0b", "#fde68a", "#fcd34d", "#fff"][i % 5],
      })),
    []
  );

  if (reduced) {
    return (
      <div className="relative" style={{ width: size, height: size }}>
        {sparkles.slice(0, 5).map((sp) => (
          <div
            key={sp.id}
            className="absolute"
            style={{
              left: `${sp.x}%`,
              top: `${sp.y}%`,
              color: sp.color,
              opacity: 0.7,
            }}
          >
            <SparkleShape s={sp.s} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {sparkles.map((sp) => (
        <motion.div
          key={sp.id}
          className="absolute"
          style={{ left: `${sp.x}%`, top: `${sp.y}%`, color: sp.color }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: loop ? [0, 1, 1, 0] : [0, 1, 0],
            scale: loop ? [0, 1, 0.8, 0] : [0, 1.2, 0],
            rotate: loop ? [0, 45, 0, -45] : [0, 30],
          }}
          transition={{
            duration: sp.duration,
            delay: sp.delay,
            repeat: loop ? Infinity : 0,
            repeatDelay: seededRandom(sp.id * 53) * 2,
            ease: "easeInOut",
          }}
        >
          <SparkleShape s={sp.s} />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Confetti ────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = [
  "#f43f5e", "#fb923c", "#facc15", "#4ade80",
  "#60a5fa", "#a78bfa", "#f472b6", "#34d399",
];

function ConfettiAnimation({
  size,
  loop,
  reduced,
}: {
  size: number;
  loop: boolean;
  reduced: boolean;
}) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: seededRandom(i * 7) * 90 + 5,
        width: 5 + seededRandom(i * 11) * 7,
        height: 3 + seededRandom(i * 17) * 5,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: seededRandom(i * 23) * 2.5,
        duration: 2.5 + seededRandom(i * 31) * 2,
        rotate: seededRandom(i * 37) * 360,
        drift: (seededRandom(i * 41) - 0.5) * 60,
        opacity: 0.75 + seededRandom(i * 47) * 0.25,
      })),
    []
  );

  if (reduced) {
    return (
      <div className="relative overflow-hidden" style={{ width: size, height: size }}>
        {pieces.slice(0, 8).map((p) => (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${20 + seededRandom(p.id * 59) * 60}%`,
              width: p.width,
              height: p.height,
              backgroundColor: p.color,
              borderRadius: 2,
              transform: `rotate(${p.rotate}deg)`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ width: size, height: size }}>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: 0,
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            borderRadius: 2,
            opacity: p.opacity,
          }}
          initial={{ y: -p.height * 2, x: 0, rotate: p.rotate, opacity: 0 }}
          animate={{
            y: [-(p.height * 2), size * 1.05],
            x: [0, p.drift],
            rotate: [p.rotate, p.rotate + 360 * (seededRandom(p.id * 61) > 0.5 ? 1 : -1)],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: loop ? Infinity : 0,
            repeatDelay: seededRandom(p.id * 67) * 1.5,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function LottieDecoration({
  type,
  className = "",
  size = 200,
  loop = true,
  autoplay = true,
}: LottieDecorationProps) {
  const prefersReduced = useReducedMotion();
  const reduced = prefersReduced || !autoplay;

  const commonProps = { size, loop: loop && !reduced, reduced };

  const animation = (() => {
    switch (type) {
      case "hearts":
        return <HeartsAnimation {...commonProps} />;
      case "rings":
        return <RingsAnimation {...commonProps} />;
      case "flowers":
        return <FlowersAnimation {...commonProps} />;
      case "sparkles":
        return <SparklesAnimation {...commonProps} />;
      case "confetti":
        return <ConfettiAnimation {...commonProps} />;
    }
  })();

  return (
    <div
      className={className}
      style={{ width: size, height: size, display: "inline-block" }}
      aria-hidden
      role="presentation"
    >
      {animation}
    </div>
  );
}
