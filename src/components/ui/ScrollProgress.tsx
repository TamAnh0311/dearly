"use client";

/**
 * ScrollProgress — a thin fixed bar at the top of the viewport that fills
 * left-to-right as the user scrolls down the page.
 */

import { motion, useScroll } from "framer-motion";

interface ScrollProgressProps {
  /** Bar color. Defaults to the theme's dark-gold primary. */
  color?: string;
}

export default function ScrollProgress({ color = "#B8860B" }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] origin-left"
      style={{
        scaleX: scrollYProgress,
        backgroundColor: color,
        boxShadow: `0 1px 4px ${color}40`,
      }}
    />
  );
}
