"use client";

/**
 * ParallaxSection — wraps children with a scroll-linked vertical translateY offset,
 * adding depth to any section as the user scrolls past it.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: React.ReactNode;
  /**
   * Parallax strength in pixels. The element shifts ±offset over the element's
   * scroll range (start entering → finish leaving viewport). Default: 50.
   */
  offset?: number;
  className?: string;
}

export default function ParallaxSection({
  children,
  offset = 50,
  className = "",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ translateY }}>{children}</motion.div>
    </div>
  );
}
