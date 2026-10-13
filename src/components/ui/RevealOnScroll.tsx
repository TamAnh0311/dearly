"use client";

/**
 * RevealOnScroll — animates children into view as they enter the viewport.
 * Supports four slide directions with a spring-physics reveal.
 */

import { motion } from "framer-motion";

interface RevealOnScrollProps {
  children: React.ReactNode;
  /** Direction the content slides in from. Default: "up". */
  direction?: "up" | "down" | "left" | "right";
  /** Delay before the animation starts (seconds). Default: 0. */
  delay?: number;
  className?: string;
}

/** Maps a direction to its hidden-state offset. */
function getInitialOffset(direction: RevealOnScrollProps["direction"]): {
  x?: number;
  y?: number;
} {
  switch (direction) {
    case "up":
      return { y: 40 };
    case "down":
      return { y: -40 };
    case "left":
      return { x: 40 };
    case "right":
      return { x: -40 };
    default:
      return { y: 40 };
  }
}

export default function RevealOnScroll({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: RevealOnScrollProps) {
  const offset = getInitialOffset(direction);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 20,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
