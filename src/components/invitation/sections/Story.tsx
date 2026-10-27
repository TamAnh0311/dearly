"use client";

/**
 * Our Story — editorial pull-quote layout. Vines on both edges grow as
 * the reader scrolls through the section; paragraphs reveal one by one.
 */

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollVine } from "../effects/Botanicals";
import { Reveal, SectionHeading } from "./Primitives";
import { getArtCollection } from "../art";
import { useInvitationCopy } from "./HeroParts";
import { alpha, type InvitationPalette } from "../utils";

export default function Story({ text, palette, title = "Our Story" }: { text: string; palette: InvitationPalette; title?: string }) {
  const ui = useInvitationCopy();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 40%"] });
  const vine = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const art = getArtCollection(palette.style.art);
  const artFilter = palette.isDark ? "brightness(0.8) saturate(0.9)" : "saturate(0.98)";

  return (
    <section ref={ref} id="story" className="relative overflow-hidden px-6 py-28 md:py-40" style={{ backgroundColor: palette.background }}>
      {palette.style.ornament === "floral" || palette.style.ornament === "leaf" ? (
        <>
          <ScrollVine progress={vine} leaf={palette.leaf} bloom={palette.petals[0]} className="pointer-events-none absolute left-2 top-0 h-full w-10 md:left-10 md:w-16" />
          <ScrollVine progress={vine} leaf={palette.leaf} bloom={palette.petals[1]} className="pointer-events-none absolute right-2 top-0 h-full w-10 md:right-10 md:w-16" flip />
        </>
      ) : (
        [0, 1].map((i) => (
          <motion.div
            key={i}
            aria-hidden
            className={`pointer-events-none absolute top-0 h-full w-px ${i ? "right-6 md:right-16" : "left-6 md:left-16"}`}
            style={{ backgroundColor: alpha(palette.primary, 0.5), scaleY: vine, originY: 0 }}
          />
        ))
      )}

      <SectionHeading eyebrow={title === "Our Story" || ui.lang === "vi" ? ui.story.eyebrow : ui.story.genericEyebrow} title={title} palette={palette} />

      <div className={art ? "relative mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-16" : "relative mx-auto max-w-2xl"}>
        <div className="relative">
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -left-4 -top-16 select-none text-[10rem] leading-none md:-left-16"
            style={{ fontFamily: palette.displayFont, color: alpha(palette.primary, 0.14) }}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          >
            &ldquo;
          </motion.span>
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p
                className={`mb-7 text-lg leading-[1.95] md:text-xl ${i === 0 && !art ? "first-letter:float-left first-letter:mr-2 first-letter:text-6xl first-letter:leading-[0.75] first-letter:text-[color:var(--dc)] first-letter:[font-family:var(--df)]" : ""}`}
                style={
                  {
                    color: palette.ink,
                    fontFamily: palette.bodyFont,
                    "--dc": palette.primary,
                    "--df": palette.displayFont,
                  } as React.CSSProperties
                }
              >
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        {art && (
          <Reveal className="relative mx-auto w-full max-w-[19rem] md:max-w-[24rem]">
            <div
              className="relative aspect-square w-full"
              style={{ background: `radial-gradient(circle at 50% 48%, ${alpha(palette.primary, palette.isDark ? 0.16 : 0.08)} 0%, transparent 66%)` }}
            >
              <Image
                src={art.sprays.peonyTall.src}
                alt=""
                width={art.sprays.peonyTall.width}
                height={art.sprays.peonyTall.height}
                className="absolute bottom-[8%] left-1/2 h-[68%] w-auto -translate-x-1/2"
                style={{ filter: artFilter }}
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
