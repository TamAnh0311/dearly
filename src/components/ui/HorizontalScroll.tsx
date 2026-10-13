"use client";

/**
 * HorizontalScroll — a sticky horizontal-scroll container driven by vertical scroll.
 * As the user scrolls down through the section's height, children pan left-to-right.
 * Ideal for photo showcases or feature rows.
 *
 * Usage: wrap in a tall outer div so the browser provides scroll distance,
 * e.g. <div style={{ height: "300vh" }}><HorizontalScroll>…</HorizontalScroll></div>
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
}

export default function HorizontalScroll({
  children,
  className = "",
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /**
   * Maps vertical scroll progress (0 → 1) to a left-to-right translateX shift.
   * The "0%" → "-80%" range covers most multi-item strips; templates can adjust
   * the offset prop if they need a different sweep distance.
   */
  const translateX = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Sticky viewport window */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="flex h-full items-center gap-8 px-8 will-change-transform"
          style={{ translateX }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
