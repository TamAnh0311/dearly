"use client";

/**
 * Small shared building blocks for invitation sections: scroll reveal
 * wrapper, section heading (eyebrow style + case follow the template), and
 * an ornamental divider whose motif follows the template's ornament.
 */

import { motion } from "framer-motion";
import { EASE_OUT, type InvitationPalette } from "../utils";

/** Fades + lifts children in when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 36,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/** Eyebrow + large display title, centred. */
export function SectionHeading({
  eyebrow,
  title,
  palette,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  palette: InvitationPalette;
  subtitle?: string;
}) {
  const { eyebrow: eyebrowStyle, headingCase } = palette.style;
  return (
    <div className="mb-14 text-center md:mb-20">
      <Reveal y={20}>
        {eyebrowStyle === "script" ? (
          <p className="text-3xl md:text-4xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
            {eyebrow}
          </p>
        ) : (
          <p className="text-[11px] font-semibold uppercase tracking-[0.45em]" style={{ color: palette.primary }}>
            {eyebrow}
          </p>
        )}
      </Reveal>
      <Reveal delay={0.1}>
        <h2
          className={`mt-3 text-4xl font-light md:text-6xl ${headingCase === "upper" ? "uppercase tracking-[0.18em]" : "tracking-tight"}`}
          style={{ fontFamily: palette.displayFont, color: palette.ink }}
        >
          {title}
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <Divider palette={palette} />
      </Reveal>
      {subtitle && (
        <Reveal delay={0.25}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed" style={{ color: palette.inkMuted }}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/** Two rules that draw outward from the centre motif. */
function Rules({ palette, gap = 12 }: { palette: InvitationPalette; gap?: number }) {
  return (
    <>
      {[`M${120 - gap} 12 H 8`, `M${120 + gap} 12 H 232`].map((d) => (
        <motion.path
          key={d}
          d={d}
          stroke={palette.primary}
          strokeWidth={0.8}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        />
      ))}
    </>
  );
}

const pop = (i: number) => ({
  initial: { opacity: 0, scale: 0 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { delay: 0.6 + i * 0.08, duration: 0.6, ease: EASE_OUT },
});

/** Ornamental divider: floral bloom, deco diamond, leaf sprig, star, wave or plain line. */
export function Divider({ palette }: { palette: InvitationPalette }) {
  const o = palette.style.ornament;
  return (
    <svg viewBox="0 0 240 24" className="mx-auto mt-6 h-6 w-56" fill="none" aria-hidden>
      {o === "line" && (
        <motion.path d="M90 12 H 150" stroke={palette.primary} strokeWidth={1} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} />
      )}

      {o === "floral" && (
        <>
          <Rules palette={palette} />
          {[0, 72, 144, 216, 288].map((a, i) => (
            <motion.ellipse key={a} cx={120} cy={6} rx={3} ry={6} fill={palette.petals[i % 3]} transform={`rotate(${a} 120 12)`} {...pop(i)} />
          ))}
          <circle cx={120} cy={12} r={2.2} fill="#f3d27a" />
        </>
      )}

      {o === "deco" && (
        <>
          <Rules palette={palette} gap={18} />
          <motion.path d="M120 2 L130 12 L120 22 L110 12 Z" stroke={palette.primary} strokeWidth={1} {...pop(0)} />
          <motion.path d="M120 7 L125 12 L120 17 L115 12 Z" fill={palette.primary} {...pop(1)} />
          <motion.path d="M100 12 L104 8 L108 12 L104 16 Z M132 12 L136 8 L140 12 L136 16 Z" fill={palette.primary} opacity={0.6} {...pop(2)} />
        </>
      )}

      {o === "leaf" && (
        <>
          <Rules palette={palette} gap={22} />
          <motion.path d="M98 12 Q 120 2 142 12" stroke={palette.leaf} strokeWidth={1.2} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} />
          {[104, 114, 126, 136].map((x, i) => (
            <motion.ellipse key={x} cx={x} cy={i < 2 ? 6 : 6} rx={2.5} ry={5.5} fill={palette.leaf} transform={`rotate(${i < 2 ? -40 : 40} ${x} 8)`} {...pop(i)} />
          ))}
          <motion.circle cx={120} cy={6} r={2.6} fill={palette.petals[0]} {...pop(5)} />
        </>
      )}

      {o === "star" && (
        <>
          <Rules palette={palette} gap={16} />
          <motion.path d="M120 1 L123 9 L131 12 L123 15 L120 23 L117 15 L109 12 L117 9 Z" fill={palette.primary} {...pop(0)} />
          <motion.circle cx={102} cy={12} r={1.6} fill={palette.primary} {...pop(1)} />
          <motion.circle cx={138} cy={12} r={1.6} fill={palette.primary} {...pop(2)} />
        </>
      )}

      {o === "wave" && (
        <motion.path
          d="M20 12 Q 35 2 50 12 T 80 12 T 110 12 T 140 12 T 170 12 T 200 12 T 230 12"
          stroke={palette.primary}
          strokeWidth={1.1}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
      )}
    </svg>
  );
}
