"use client";

/**
 * TextReveal — cinematic stagger-reveal for text.
 * Splits the string into characters or words and animates each unit in sequence
 * as the element enters the viewport.
 */

import { motion } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  /** Delay between each character (seconds). Default: 0.03. */
  charDelay?: number;
  /** Animate by word instead of by character. Default: false. */
  wordMode?: boolean;
}

/** Container variant — orchestrates staggered children. */
const containerVariants = (stagger: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
    },
  },
});

/** Child variant — each character or word fades and slides up. */
const childVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 18 },
  },
};

export default function TextReveal({
  text,
  className = "",
  charDelay = 0.03,
  wordMode = false,
}: TextRevealProps) {
  const units = wordMode ? text.split(" ") : text.split("");
  const separator = wordMode ? " " : "";

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants(charDelay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      aria-label={text}
    >
      {units.map((unit, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={childVariants}
          aria-hidden="true"
        >
          {unit}
          {separator}
        </motion.span>
      ))}
    </motion.span>
  );
}
