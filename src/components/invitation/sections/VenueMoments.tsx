"use client";

/**
 * Venue & Moments — the venue card with directions, followed by an
 * auto-scrolling, tilted photo ribbon linking to the full gallery.
 */

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Camera, MapPin, Navigation } from "lucide-react";
import { Reveal, SectionHeading } from "./Primitives";
import ArtSpray from "./ArtSpray";
import { getArtCollection } from "../art";
import { useInvitationCopy } from "./HeroParts";
import { GrowingFlower } from "../effects/Botanicals";
import { alpha, mapsUrl, mix, type InvitationPalette } from "../utils";

/** Venue card with an animated border glow and a "Get directions" link. */
export function Venue({
  name,
  address,
  palette,
}: {
  name: string;
  address?: string | null;
  palette: InvitationPalette;
}) {
  const ui = useInvitationCopy();
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-120px" });
  const art = getArtCollection(palette.style.art);
  const atelier = palette.style.hero === "atelier";
  const directions = mapsUrl([name, address].filter(Boolean).join(", "));
  return (
    <section id="venue" className="relative overflow-hidden px-6 py-28 md:py-36" style={{ backgroundColor: palette.background }}>
      <SectionHeading eyebrow={ui.venue.eyebrow} title={ui.venue.title} palette={palette} />
      {atelier && art ? (
        <Reveal className="relative mx-auto max-w-3xl">
          <div
            className="relative overflow-hidden border text-center"
            style={{
              borderRadius: "14rem 14rem 1.25rem 1.25rem",
              borderColor: alpha(palette.primary, 0.32),
              background: palette.isDark ? mix(palette.background, "#ffffff", 0.06) : mix(palette.background, "#ffffff", 0.5),
              boxShadow: `0 46px 90px -48px ${alpha(palette.primary, 0.55)}`,
            }}
          >
            <div className="relative mx-3 mt-3 overflow-hidden" style={{ borderRadius: "13.5rem 13.5rem 0.8rem 0.8rem" }}>
              <div className="relative h-56 w-full sm:h-64 md:h-80">
                <Image
                  src={art.venue.src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  placeholder="blur"
                  blurDataURL={art.venue.blurDataURL}
                  className="object-cover"
                  style={{ objectPosition: "50% 48%", filter: palette.isDark ? "brightness(0.74) saturate(0.9)" : "saturate(1.03)" }}
                />
                <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 58%, ${alpha(palette.background, 0.7)} 100%)` }} />
              </div>
            </div>
            <div className="relative px-8 pb-12 pt-7 md:px-16">
              <div aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-px" style={{ backgroundColor: alpha(palette.primary, 0.24) }} />
              <p className="text-[10px] uppercase tracking-[0.42em]" style={{ color: palette.primary }}>
                {ui.venue.eyebrow}
              </p>
              <h3 className="mt-4 text-3xl leading-tight md:text-5xl" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
                {name}
              </h3>
              {address && (
                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed md:text-base" style={{ color: palette.inkMuted }}>
                  {address}
                </p>
              )}
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 border px-7 py-3 text-[10px] uppercase tracking-[0.28em] transition hover:-translate-y-0.5"
                style={{ borderRadius: "999px", borderColor: alpha(palette.primary, 0.45), color: palette.primary }}
              >
                <Navigation size={13} /> {ui.venue.directions}
              </a>
            </div>
          </div>
          <ArtSpray palette={palette} asset="roses" className="-left-10 bottom-10 w-24 md:-left-6 md:w-32" rotate={-12} opacity={0.8} />
        </Reveal>
      ) : (
      <Reveal className="relative mx-auto max-w-2xl">
        <div
          ref={cardRef}
          className="relative overflow-hidden border text-center"
          style={{
            borderRadius: palette.radius.lg,
            borderColor: alpha(palette.primary, 0.25),
            background: `linear-gradient(160deg, ${alpha(palette.primary, 0.08)}, ${alpha(palette.accent, 0.04)})`,
            boxShadow: `0 40px 80px -40px ${alpha(palette.primary, 0.45)}`,
          }}
        >
          {art && (
            <div className="relative h-44 w-full overflow-hidden sm:h-52 md:h-60">
              <Image
                src={art.venue.src}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                placeholder="blur"
                blurDataURL={art.venue.blurDataURL}
                className="object-cover"
                style={{ objectPosition: "50% 55%", filter: palette.isDark ? "brightness(0.72) saturate(0.9)" : "saturate(1.02)" }}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: `linear-gradient(180deg, transparent 45%, ${alpha(palette.background, 0.92)} 100%)` }}
              />
              <ArtSpray palette={palette} asset="peony" className="-left-4 -top-6 w-28 md:w-36" rotate={-12} opacity={0.85} />
            </div>
          )}
          <div className={art ? "px-8 pb-14 pt-2 md:px-16" : "px-8 py-14 md:px-16"}>
            {inView && palette.style.flowers && (
              <>
                <div className="pointer-events-none absolute -bottom-4 -left-4 opacity-70">
                  <GrowingFlower petal={palette.petals[0]} petalInner={palette.petals[2]} leaf={palette.leaf} height={150} delay={0.2} petals={6} />
                </div>
                <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-70">
                  <GrowingFlower petal={palette.petals[1]} petalInner={palette.petals[0]} leaf={palette.leaf} height={120} delay={0.5} petals={5} flip />
                </div>
              </>
            )}
            <MapPin className="mx-auto" size={28} style={{ color: palette.primary }} />
            <h3 className="mt-5 text-3xl md:text-4xl" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
              {name}
            </h3>
            {address && (
              <p className="mt-3 text-base" style={{ color: palette.inkMuted }}>
                {address}
              </p>
            )}
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-8 inline-flex items-center gap-2 px-7 py-3 text-xs font-semibold uppercase tracking-[0.25em] transition hover:-translate-y-0.5"
              style={{ borderRadius: palette.radius.sm, backgroundColor: palette.primary, color: palette.background }}
            >
              <Navigation size={14} /> {ui.venue.directions}
            </a>
          </div>
        </div>
      </Reveal>
      )}
    </section>
  );
}

export type MomentsLayout = "ribbon" | "grid" | "pinned";

/** Ribbon: auto-scrolling tilted photo strip. */
function RibbonLayout({ photos, palette, reduce }: { photos: string[]; palette: InvitationPalette; reduce: boolean | null }) {
  const loop = [...photos, ...photos];
  return (
    <div className="relative -rotate-2">
      <motion.div
        className="flex w-max gap-5"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: photos.length * 6, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((src, i) => (
          <div
            key={i}
            className="relative h-64 w-48 shrink-0 overflow-hidden bg-white p-2 shadow-xl md:h-80 md:w-60"
            style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)`, borderRadius: palette.radius.card }}
          >
            <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: `calc(${palette.radius.card} - 6px)` }}>
              <Image src={src} alt="" fill sizes="240px" className="object-cover" />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/** Grid: Pinterest / Instagram style masonry. */
function GridLayout({ photos, palette }: { photos: string[]; palette: InvitationPalette }) {
  // Two-column masonry: alternate tall (aspect-[3/4]) and short (aspect-square) for visual variety.
  return (
    <Reveal className="mx-auto grid max-w-3xl grid-cols-2 gap-3 px-6 sm:grid-cols-3 md:gap-4">
      {photos.slice(0, 9).map((src, i) => (
        <motion.div
          key={i}
          className="relative overflow-hidden shadow-lg"
          style={{
            borderRadius: palette.radius.card,
            aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "1/1" : "4/3",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.08 }}
        >
          <Image src={src} alt="" fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover" />
        </motion.div>
      ))}
    </Reveal>
  );
}

/** Pinned: one large hero photo with a smaller grid beneath. */
function PinnedLayout({ photos, palette }: { photos: string[]; palette: InvitationPalette }) {
  const [hero, ...rest] = photos;
  return (
    <div className="mx-auto max-w-3xl px-6">
      {/* Hero pinned image */}
      <Reveal>
        <motion.div
          className="relative w-full overflow-hidden shadow-2xl"
          style={{ aspectRatio: "16/9", borderRadius: palette.radius.lg }}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Image src={hero} alt="" fill sizes="(min-width:768px) 800px, 100vw" className="object-cover" priority />
        </motion.div>
      </Reveal>
      {/* Supporting grid */}
      {rest.length > 0 && (
        <Reveal className="mt-4 grid grid-cols-3 gap-3 md:gap-4">
          {rest.slice(0, 6).map((src, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden shadow-md"
              style={{ aspectRatio: "1/1", borderRadius: palette.radius.card }}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Image src={src} alt="" fill sizes="(min-width:768px) 250px, 33vw" className="object-cover" />
            </motion.div>
          ))}
        </Reveal>
      )}
    </div>
  );
}

/**
 * Memories — photo gallery with three layout options:
 *  - "ribbon"  (default) infinite auto-scrolling tilted photo strip
 *  - "grid"    Pinterest / Instagram masonry grid
 *  - "pinned"  one large hero image with supporting grid beneath
 */
export function Moments({
  photos,
  galleryHref,
  uploadHref,
  palette,
  layout = "ribbon",
}: {
  photos: string[];
  galleryHref?: string;
  /** Where guests share photos; shows the "Share your photos" button. */
  uploadHref?: string;
  palette: InvitationPalette;
  layout?: MomentsLayout;
}) {
  const ui = useInvitationCopy();
  const reduce = useReducedMotion();
  const hasPhotos = photos.length >= 3;

  return (
    <section id="moments" className="relative overflow-hidden py-28 md:py-36" style={{ backgroundColor: palette.surface }}>
      <div className="px-6">
        <SectionHeading
          eyebrow={ui.moments.eyebrow}
          title={ui.moments.title}
          palette={palette}
          subtitle={uploadHref ? ui.moments.shareSubtitle : undefined}
        />
      </div>
      {hasPhotos ? (
        layout === "grid" ? <GridLayout photos={photos} palette={palette} />
        : layout === "pinned" ? <PinnedLayout photos={photos} palette={palette} />
        : <RibbonLayout photos={photos} palette={palette} reduce={reduce} />
      ) : (
        <Reveal className="mx-auto flex max-w-xl justify-center gap-4 px-6">
          {[-6, 3, -2].map((r, i) => (
            <div
              key={i}
              className="flex h-40 w-32 items-center justify-center border-2 border-dashed md:h-52 md:w-40"
              style={{ transform: `rotate(${r}deg)`, borderRadius: palette.radius.card, borderColor: alpha(palette.primary, 0.35), color: alpha(palette.primary, 0.6) }}
            >
              <Camera size={28} />
            </div>
          ))}
        </Reveal>
      )}
      {(galleryHref || uploadHref) && (
        <div className="mt-14 flex flex-wrap justify-center gap-3 px-6">
          {uploadHref && (
            <Link
              href={uploadHref}
              className="inline-flex items-center gap-2 px-7 py-3 text-xs font-semibold uppercase tracking-[0.25em] transition hover:-translate-y-0.5"
              style={{ borderRadius: palette.radius.sm, backgroundColor: palette.primary, color: palette.background }}
            >
              <Camera size={14} /> {ui.moments.sharePhotos}
            </Link>
          )}
          {galleryHref && hasPhotos && (
            <Link
              href={galleryHref}
              className="border px-7 py-3 text-xs uppercase tracking-[0.25em] transition hover:-translate-y-0.5"
              style={{ borderRadius: palette.radius.sm, borderColor: alpha(palette.primary, 0.5), color: palette.primary }}
            >
              {ui.moments.viewAlbum}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}