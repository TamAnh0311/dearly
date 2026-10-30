"use client";

/**
 * StorybookInvitation — the paper-first invitation used by the Storybook
 * collection (Atelier Ivory, Lakeside Hydrangea, Peony Letter and Lantern
 * Garden). It reproduces the approved static demos while reading every piece
 * of content from the live wedding, events, blessings and RSVP APIs.
 */

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Check, Copy, MapPin, Navigation, QrCode } from "lucide-react";
import type { CinematicInvitationProps } from "../CinematicInvitation";
import { getArtCollection } from "../art";
import { getInvitationCopy, type InvitationCopy } from "../i18n";
import { resolveBlessingStyle, resolveSections } from "../sections-config";
import { EventContext } from "../sections/HeroParts";
import StorybookRsvp from "./StorybookRsvp";
import StorybookBlessings from "./StorybookBlessings";
import {
  googleFontsUrl,
  alpha,
  calendarUrl,
  formatDotDate,
  formatTime,
  mix,
  mapsUrl,
  parseWeddingDate,
  type InvitationPalette,
} from "../utils";
import { eventTypeOf, getEventCopy, hostNames, isPastEvent } from "@/lib/event-types";
import { monthGrid, resolveDateNote, resolveDressCode, resolveFamilies, resolveGift, resolveLocationLabel } from "@/lib/invitation-extras";
import type {
  DressSwatch,
  GiftAccount,
  GuestbookEntryRow,
  WeddingEventRow,
  WeddingRow,
} from "@/types/database";
import type { ReactionCounts } from "../sections/Blessings";
import type { StorybookVariant } from "../styles";
import "./storybook.css";
import { FallingPetals, GoldDust } from "../effects/Particles";
import BlessingShower from "../effects/BlessingShower";
import MusicPlayer from "@/components/ui/MusicPlayer";

interface StorybookProps extends CinematicInvitationProps {
  palette: InvitationPalette;
}

const EMPTY_REACTIONS: ReactionCounts = { love: 0, bloom: 0, cheers: 0, sparkle: 0, rings: 0 };

/** Approved demo paintings (CC BY 4.0, credited in the footer). */
const DEMO_ART = {
  chuppah: "/demo/assets/garden-chuppah.webp",
  pergola: "/demo/assets/lakeside-pergola.webp",
  aisle: "/art/watercolour-garden/ceremony-aisle.webp",
  hydrangea: { src: "/art/watercolour-garden/hydrangea-01.webp", width: 1400, height: 1400 },
};

const DOW = ["M", "T", "W", "T", "F", "S", "S"];

/** Two-digit day/month. */
function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** A seven-day strip ending three days after the event. */
function weekAround(date: Date): { date: Date; label: string; day: string; mark: boolean }[] {
  const start = new Date(date);
  start.setDate(date.getDate() - 4);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      date: d,
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      day: pad(d.getDate()),
      mark: d.toDateString() === date.toDateString(),
    };
  });
}

/** "Da Lat · Vietnam"-style line from a free-form address. */
function placeLine(wedding: WeddingRow): string {
  const parts = (wedding.venue_address ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const tail = parts.length > 1 ? parts[parts.length - 1] : "";
  return [wedding.venue_name, tail].filter(Boolean).join(" · ") || wedding.venue_name || "";
}

/** Reply-by date: six weeks before the event, formatted for the RSVP note. */
function replyBy(date: string, locale: string): string {
  const d = parseWeddingDate(date);
  d.setDate(d.getDate() - 42);
  return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

/** Reveals a section's children once it enters the viewport. */
function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <div ref={ref} className={`sb-reveal ${inView ? "in" : ""} ${className}`}>
      {children}
    </div>
  );
}

/** Flower ornament + eyebrow + title shared by every section. */
function Head({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <div className="sb-section-head">
      <p className="sb-kicker">{kicker}</p>
      <h2 className="sb-title">{title}</h2>
      <div className="sb-ornament" aria-hidden="true" />
      {subtitle && <p className="sb-lede">{subtitle}</p>}
    </div>
  );
}

/** The scroll-grown vine used by the Peony and Lantern variants. */
function ScrollVine() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, [0, 0.92], [0, 1]);
  const leaves = [
    [13, 70, 34], [7, 130, -42], [15, 210, 28], [4, 300, -38], [14, 390, 40],
    [6, 470, -36], [16, 560, 30], [4, 650, -40], [14, 740, 38], [6, 830, -34], [15, 920, 32],
  ];
  return (
    <div className="sb-vine" aria-hidden="true">
      <svg viewBox="0 0 100 1000" preserveAspectRatio="none">
        <motion.path
          className="sb-vine-path"
          d="M6 0 C16 90 0 160 8 240 C18 330 2 400 10 490 C20 580 4 650 12 740 C22 830 2 900 8 1000"
          style={{ pathLength: reduce ? 1 : progress }}
        />
        {leaves.map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <ellipse className="sb-vine-leaf" cx="0" cy="0" rx="2.3" ry="0.8" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Hanging paper lanterns for the Lantern Garden variant. */
function Lanterns() {
  const spots = [
    [7, 7, 8, -1.2], [17, 10, 7, -4.4], [28, 5, 6, -2.8], [73, 6, 7, -3.6],
    [84, 10, 8, -0.8], [94, 5, 6, -5.2], [39, 3, 5, -1.8], [61, 4, 5, -4.9],
  ];
  return (
    <div className="sb-lanterns" aria-hidden="true">
      {spots.map(([x, top, w, delay], i) => (
        <span
          key={i}
          className="sb-lantern"
          style={
            {
              "--x": `${x}%`,
              "--w": `${w * 5}px`,
              "--dur": `${5 + (i % 4)}s`,
              "--delay": `${delay}s`,
              top: `${top}%`,
            } as CSSProperties
          }
        >
          <i />
        </span>
      ))}
    </div>
  );
}

/** Hero for Atelier Ivory and Lakeside Hydrangea. */
function EditorialHero({
  variant,
  wedding,
  names,
  twoNames,
  greeting,
  inviteLine,
  art,
  familiesText,
  place,
  palette,
}: {
  variant: StorybookVariant;
  wedding: WeddingRow;
  names: [string, string];
  twoNames: boolean;
  greeting: string;
  inviteLine: string;
  art: NonNullable<ReturnType<typeof getArtCollection>>;
  familiesText: string | null;
  place: string;
  palette: InvitationPalette;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const floraY = useTransform(scrollYProgress, [0, 1], [0, -96]);
  const floraRotate = useTransform(scrollYProgress, [0, 1], [0, 1.6]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 34]);
  const flora =
    variant === "lakeside"
      ? { l: art.sprays.eucalyptus, r: DEMO_ART.hydrangea }
      : { l: art.sprays.eucalyptus, r: art.sprays.magnolia };
  return (
    <header ref={ref} className="sb-hero sb-hero-editorial" id="top">
      <div className="sb-editorial-petals" aria-hidden="true">
        <FallingPetals
          colors={variant === "lakeside" ? [palette.leaf, palette.petals[0]] : [palette.petals[0], palette.petals[1], palette.leaf]}
          count={variant === "lakeside" ? 5 : 6}
          shape={variant === "lakeside" ? "leaf" : "petal"}
        />
      </div>
      <motion.div className="sb-hero-flora" aria-hidden="true" style={{ y: reduce ? 0 : floraY, rotate: reduce ? 0 : floraRotate }}>
        <Image className="sb-flora-l" src={flora.l.src} alt="" width={flora.l.width} height={flora.l.height} priority />
        <Image className="sb-flora-r" src={flora.r.src} alt="" width={flora.r.width} height={flora.r.height} priority />
      </motion.div>
      <div className="sb-hero-copy">
        <p className="sb-greeting">{greeting}</p>
        <p className="sb-invite">{inviteLine}</p>
        <h1 className="sb-names">
          <span>{names[0]}</span>
          {twoNames && (
            <>
              <span className="sb-amp">and</span>
              <span>{names[1]}</span>
            </>
          )}
        </h1>
        {wedding.wedding_date && <p className="sb-date-line">{formatDotDate(wedding.wedding_date)}</p>}
        <p className="sb-place">{place}</p>
        {familiesText && <p className="sb-hero-families">{familiesText}</p>}
      </div>
      <motion.div className="sb-hero-scene" aria-hidden="true" style={{ y: reduce ? 0 : sceneY }}>
        <Image
          src={variant === "lakeside" ? DEMO_ART.pergola : DEMO_ART.chuppah}
          alt=""
          fill
          sizes="(max-width: 860px) 100vw, 760px"
          priority
          className="object-cover"
        />
      </motion.div>
    </header>
  );
}

const VEIL_EUCALYPTUS = {
  left: { src: "/art/watercolour-garden/eucalyptus-01.webp", width: 827, height: 1400 },
  right: { src: "/art/watercolour-garden/eucalyptus-02.webp", width: 645, height: 1400 },
} as const;

const VEIL_PETALS = [
  [2, 30, 24, -2], [8, 18, 34, -9], [15, 26, 29, 4], [23, 16, 37, 12],
  [31, 28, 32, -5], [38, 20, 40, 18], [46, 14, 27, 7], [52, 24, 35, -12],
  [59, 17, 30, 2], [66, 27, 38, 15], [73, 15, 28, -7], [81, 25, 33, 5],
  [88, 19, 36, 11], [95, 28, 31, -3], [12, 12, 42, 20], [29, 22, 26, -14],
  [57, 13, 39, 9], [78, 21, 34, -1],
] as const;

const VEIL_PETALS_FRONT = [
  [6, 56, 18, 1], [19, 40, 24, 9], [69, 46, 20, 3],
  [86, 58, 17, 12], [12, 34, 26, 7], [94, 44, 21, -4],
] as const;

/** Hero for Ivory Veil: a painted garden revealed beneath watercolour branches. */
function IvoryVeilHero({
  wedding,
  names,
  twoNames,
  greeting,
  inviteLine,
  note,
  art,
  familiesText,
  place,
}: {
  wedding: WeddingRow;
  names: [string, string];
  twoNames: boolean;
  greeting: string;
  inviteLine: string;
  note: string | null;
  art: NonNullable<ReturnType<typeof getArtCollection>>;
  familiesText: string | null;
  place: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const floraY = useTransform(scrollYProgress, [0, 1], [0, -64]);
  return (
    <header ref={ref} className="sb-hero sb-hero-veil" id="top">
      <motion.div className="sb-veil-art" aria-hidden="true" style={{ y: reduce ? 0 : artY }}>
        <Image src="/art/ivory-veil/hero.webp" alt="" width={2752} height={1536} priority />
      </motion.div>

      <div className="sb-veil-petals" aria-hidden="true">
        {VEIL_PETALS.map(([x, size, duration, delay], i) => (
          <i
            key={i}
            style={{
              "--x": `${x}%`,
              "--s": `${size}px`,
              "--dur": `${duration}s`,
              "--delay": `${delay}s`,
            } as CSSProperties}
          />
        ))}
      </div>

      <motion.div className="sb-veil-flora-layer" aria-hidden="true" style={{ y: reduce ? 0 : floraY }}>
        <div className="sb-veil-flora sb-veil-flora--tl">
          <Image src={art.sprays.magnolia.src} alt="" width={art.sprays.magnolia.width} height={art.sprays.magnolia.height} priority />
        </div>
        <div className="sb-veil-flora sb-veil-flora--tr">
          <Image src={art.sprays.magnolia.src} alt="" width={art.sprays.magnolia.width} height={art.sprays.magnolia.height} priority />
        </div>
        <div className="sb-veil-flora sb-veil-flora--bl">
          <Image src={VEIL_EUCALYPTUS.left.src} alt="" width={VEIL_EUCALYPTUS.left.width} height={VEIL_EUCALYPTUS.left.height} priority />
        </div>
        <div className="sb-veil-flora sb-veil-flora--br">
          <Image src={VEIL_EUCALYPTUS.right.src} alt="" width={VEIL_EUCALYPTUS.right.width} height={VEIL_EUCALYPTUS.right.height} priority />
        </div>
      </motion.div>

      <div className="sb-veil-petals sb-veil-petals--front" aria-hidden="true">
        {VEIL_PETALS_FRONT.map(([x, size, duration, delay], i) => (
          <i
            key={i}
            style={{
              "--x": `${x}%`,
              "--s": `${size}px`,
              "--dur": `${duration}s`,
              "--delay": `${delay}s`,
            } as CSSProperties}
          />
        ))}
      </div>

      <div className="sb-hero-copy sb-veil-copy">
        <p className="sb-greeting">{greeting}</p>
        <p className="sb-invite">{inviteLine}</p>
        <h1 className="sb-names">
          <span>{names[0]}</span>
          {twoNames && (
            <>
              <span className="sb-amp">and</span>
              <span>{names[1]}</span>
            </>
          )}
        </h1>
        {wedding.wedding_date && <p className="sb-date-line">{formatDotDate(wedding.wedding_date)}</p>}
        <p className="sb-place">{place}</p>
        {familiesText && <p className="sb-hero-families">{familiesText}</p>}
        {note && <p className="sb-veil-note">{note}</p>}
      </div>

      <a className="sb-scroll sb-veil-cue" href="#sb-date">
        Open the invitation <i aria-hidden="true" />
      </a>
    </header>
  );
}

/** Wreath hero for Peony Letter and Lantern Garden. */
function WreathHero({
  variant,
  wedding,
  names,
  twoNames,
  greeting,
  note,
  art,
  place,
  palette,
}: {
  variant: StorybookVariant;
  wedding: WeddingRow;
  names: [string, string];
  twoNames: boolean;
  greeting: string;
  note: string;
  art: NonNullable<ReturnType<typeof getArtCollection>>;
  place: string;
  palette: InvitationPalette;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const garlandY = useTransform(scrollYProgress, [0, 1], [0, -86]);
  const garlandRotate = useTransform(scrollYProgress, [0, 1], [0, 1.4]);
  const wreathY = useTransform(scrollYProgress, [0, 1], [0, -38]);
  const wreathRotate = useTransform(scrollYProgress, [0, 1], [0, -1.2]);
  const lanternY = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const petals = [6, 16, 27, 38, 49, 59, 68, 77, 86, 94];
  return (
    <header ref={ref} className={`sb-hero sb-hero-${variant === "lantern" ? "lantern" : "peony"}`} id="top">
      {variant === "lantern" && (
        <div className="sb-hero-life" aria-hidden="true">
          <GoldDust color={palette.accent} count={24} />
        </div>
      )}
      <motion.div className="sb-hero-garland" aria-hidden="true" style={{ y: reduce ? 0 : garlandY, rotate: reduce ? 0 : garlandRotate }}>
        <Image className="sb-garland-tl" src={art.sprays.cherry.src} alt="" width={art.sprays.cherry.width} height={art.sprays.cherry.height} priority />
        <Image className="sb-garland-tr" src={art.sprays.roses.src} alt="" width={art.sprays.roses.width} height={art.sprays.roses.height} priority />
        <Image className="sb-garland-bl" src={art.sprays.eucalyptus.src} alt="" width={art.sprays.eucalyptus.width} height={art.sprays.eucalyptus.height} priority />
        <Image className="sb-garland-br" src={art.sprays.cherry.src} alt="" width={art.sprays.cherry.width} height={art.sprays.cherry.height} priority />
      </motion.div>
      <div className="sb-hero-wash" aria-hidden="true">
        <Image src={art.venue.src} alt="" fill sizes="760px" className="object-cover" />
      </div>
      {variant === "lantern" && (
        <motion.div className="sb-hero-lanterns" aria-hidden="true" style={{ y: reduce ? 0 : lanternY }}>
          <Lanterns />
        </motion.div>
      )}
      <div className="sb-hero-petals" aria-hidden="true">
        {petals.map((x, i) => (
          <i
            key={x}
            className="sb-petal"
            style={
              {
                "--x": `${x}%`,
                "--s": `${5 + (i % 4)}px`,
                "--dur": `${17 + (i % 7) * 1.3}s`,
                "--delay": `${-2 - i * 1.7}s`,
                background: i % 4 === 0 ? "var(--sb-sage)" : undefined,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <motion.div className="sb-hero-wreath" style={{ y: reduce ? 0 : wreathY }}>
        <motion.div className="sb-wreath-spin" style={{ rotate: reduce ? 0 : wreathRotate }}>
          <Image className="sb-wreath" src={art.sprays.wreath.src} alt="" width={art.sprays.wreath.width} height={art.sprays.wreath.height} priority />
        </motion.div>
        {variant !== "lantern" && (
          <>
            <span className="sb-wf sb-wf-top">
              <Image src={art.sprays.peony.src} alt="" width={art.sprays.peony.width} height={art.sprays.peony.height} />
            </span>
            <span className="sb-wf sb-wf-left">
              <Image src={art.sprays.roses.src} alt="" width={art.sprays.roses.width} height={art.sprays.roses.height} />
            </span>
            <span className="sb-wf sb-wf-right">
              <Image src={art.sprays.cherry.src} alt="" width={art.sprays.cherry.width} height={art.sprays.cherry.height} />
            </span>
          </>
        )}
        <div className="sb-hero-copy">
          <p className="sb-greeting">{greeting}</p>
          <h1 className="sb-names">
            <span>{names[0]}</span>
            {twoNames && (
              <>
                <span className="sb-amp">and</span>
                <span>{names[1]}</span>
              </>
            )}
          </h1>
          {wedding.wedding_date && <p className="sb-date-line">{formatDotDate(wedding.wedding_date)}</p>}
          <p className="sb-place">{place}</p>
        </div>
      </motion.div>
      <p className="sb-hero-note">{note}</p>
      <a className="sb-scroll" href="#sb-date">
        {variant === "lantern" ? "Follow the lanterns" : "Open the invitation"} <i aria-hidden="true" />
      </a>
    </header>
  );
}

/** Save-the-date section: a watercolour arch scene. */
function SceneDate({
  date,
  wedding,
  ui,
  ceremony,
  note,
  variant,
}: {
  date: string;
  wedding: WeddingRow;
  ui: InvitationCopy;
  ceremony?: WeddingEventRow;
  note?: string | null;
  variant?: StorybookVariant;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const d = parseWeddingDate(date);
  const strip = weekAround(d);
  const time = ceremony ? formatTime(ceremony.start_time, wedding.timezone, ui.dateLocale) : null;
  return (
    <section ref={ref} className={`sb-scene ${inView ? "in" : ""}`} id="sb-date">
      <div className="sb-scene-bg" aria-hidden="true">
        <Image src={variant === "ivory-veil" ? DEMO_ART.chuppah : DEMO_ART.pergola} alt="" fill sizes="760px" className="object-cover" />
      </div>
      <svg className="sb-arch" viewBox="0 0 400 800" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength={1} d="M14 800 L14 250 C14 90 386 90 386 250 L386 800" />
        <path pathLength={1} d="M26 800 L26 252 C26 108 374 108 374 252 L374 800" />
      </svg>
      <svg className="sb-crest" viewBox="0 0 44 30" fill="none" aria-hidden="true">
        <path d="M22 1.5 L31 12 L22 28.5 L13 12 Z" stroke="currentColor" />
        <circle cx="22" cy="13" r="2" fill="currentColor" />
        <path d="M22 17.5 V24" stroke="currentColor" strokeLinecap="round" />
      </svg>
      <div className="sb-scene-inner">
        <Reveal>
          <p className="sb-kicker">Save the date</p>
          <h2 className="sb-title">{variant === "ivory-veil" ? "The Day" : "The Time"}</h2>
          <p className="sb-month">{d.toLocaleDateString(ui.dateLocale, { month: "long", year: "numeric" })}</p>
          <div className="sb-strip" aria-label={`Wedding week, ${d.toLocaleDateString(ui.dateLocale, { weekday: "long", day: "numeric", month: "long" })}`}>
            {strip.map((day) => (
              <div key={day.date.toISOString()} className={`sb-strip-day ${day.mark ? "sb-mark" : ""}`}>
                <span>{day.label}</span>
                <b>{day.day}</b>
              </div>
            ))}
          </div>
          <p className="sb-weekday">
            {d.toLocaleDateString(ui.dateLocale, { weekday: "long" })}
            {time ? ` · Ceremony at ${time}` : ""}
          </p>
          {note && <p className="sb-date-note">{note}</p>}
          <a className="sb-pill" href={calendarUrl(hostNames(wedding), date, [wedding.venue_name, wedding.venue_address].filter(Boolean).join(", "))} target="_blank" rel="noopener noreferrer">
            {ui.addToCalendar}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/** Save-the-date section: a wreath-framed month calendar. */
function WreathDate({
  date,
  wedding,
  ui,
  art,
  ceremony,
  note,
}: {
  date: string;
  wedding: WeddingRow;
  ui: InvitationCopy;
  art: NonNullable<ReturnType<typeof getArtCollection>>;
  ceremony?: WeddingEventRow;
  note?: string | null;
}) {
  const d = parseWeddingDate(date);
  const time = ceremony ? formatTime(ceremony.start_time, wedding.timezone, ui.dateLocale) : null;
  return (
    <section className="sb-section sb-date-wreath" id="sb-date">
      <Reveal>
        <Head kicker="Save the date" title="The Day" />
        <div className="sb-wreath-calendar">
          <Image className="sb-calendar-wreath" src={art.sprays.wreath.src} alt="" width={art.sprays.wreath.width} height={art.sprays.wreath.height} />
          <div className="sb-calendar">
            <p className="sb-cal-month">{d.toLocaleDateString(ui.dateLocale, { month: "long" })}</p>
            <p className="sb-cal-year">{d.getFullYear()}</p>
            <div className="sb-cal-grid" role="img" aria-label={`${d.toLocaleDateString(ui.dateLocale, { month: "long", year: "numeric" })} calendar. The wedding day is ${d.toLocaleDateString(ui.dateLocale, { weekday: "long", day: "numeric", month: "long" })}.`}>
              {DOW.map((dow, i) => (
                <div key={`${dow}-${i}`} className="sb-dow">
                  {dow}
                </div>
              ))}
              {monthGrid(d).map((day, i) =>
                day === null ? (
                  <div key={`blank-${i}`} className="sb-day" />
                ) : (
                  <div key={day} className={`sb-day ${day === d.getDate() ? "sb-mark-day" : ""}`}>
                    {day}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <p className="sb-date-time">
          <span>{d.toLocaleDateString(ui.dateLocale, { weekday: "long", day: "numeric", month: "long" })}</span>
          {time && <i aria-hidden="true" />}
          {time && <span>Ceremony at {time}</span>}
        </p>
        {note && <p className="sb-date-note">{note}</p>}
        <a className="sb-pill" href={calendarUrl(hostNames(wedding), date, [wedding.venue_name, wedding.venue_address].filter(Boolean).join(", "))} target="_blank" rel="noopener noreferrer">
          {ui.addToCalendar}
        </a>
      </Reveal>
    </section>
  );
}

/** Our Story as a pressed-paper letter. */
function StorySection({ text, title, art, variant }: { text: string; title: string; art: NonNullable<ReturnType<typeof getArtCollection>>; variant?: StorybookVariant }) {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <section className="sb-section sb-story" id="story">
      <Reveal>
        <Head kicker="How it began" title={title} />
        <div className="sb-story-card">
          {variant !== "ivory-veil" && (
            <Image className="sb-story-spray" src={art.sprays.roses.src} alt="" width={art.sprays.roses.width} height={art.sprays.roses.height} aria-hidden />
          )}
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/** The day's programme, in a quiet two-column paper list or a peony timeline. */
function ScheduleSection({ events, wedding, ui, variant }: { events: WeddingEventRow[]; wedding: WeddingRow; ui: InvitationCopy; variant: StorybookVariant }) {
  return (
    <section className="sb-section sb-schedule" id="schedule">
      <Reveal>
        <Head kicker="Order of the day" title="The Schedule" />
        {variant === "peony" || variant === "lantern" ? (
          <div className="sb-timeline">
            {events.map((ev) => (
              <div key={ev.id} className="sb-tl-item">
                <p className="sb-tl-time">{formatTime(ev.start_time, wedding.timezone, ui.dateLocale)}</p>
                <span className="sb-tl-dot" aria-hidden="true" />
                <div className="sb-tl-body">
                  <h3>{ev.title}</h3>
                  {ev.description && <p>{ev.description}</p>}
                  {ev.location && <p>{ev.location}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="sb-program">
            {events.map((ev) => (
              <div key={ev.id} className="sb-prog-item">
                <p className="sb-prog-time">{formatTime(ev.start_time, wedding.timezone, ui.dateLocale)}</p>
                <h3>{ev.title}</h3>
                {ev.description && <p>{ev.description}</p>}
                {ev.location && <p>{ev.location}</p>}
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}

/** Venue: a watercolour postcard (or a full-width painting for the editorial variants). */
function VenueSection({
  name,
  address,
  date,
  art,
  variant,
}: {
  name: string;
  address?: string | null;
  date: string | null;
  art: NonNullable<ReturnType<typeof getArtCollection>>;
  variant: StorybookVariant;
}) {
  const directions = mapsUrl([name, address].filter(Boolean).join(", "));
  const parts = (address ?? "").split(",").map((p) => p.trim()).filter(Boolean);
  const city = parts.length >= 3 ? parts[parts.length - 2] : (parts[parts.length - 1] ?? "");
  const addressLines = parts.length > 2 ? [parts.slice(0, 2).join(", "), parts.slice(2).join(", ")] : [address ?? ""];
  const stamp = date ? formatDotDate(date).replace(/ · /g, ".").slice(0, 5) : "SAVE";
  if (variant === "peony" || variant === "lantern") {
    return (
      <section className="sb-section sb-venue" id="venue">
        <Reveal>
          <Head kicker="Where we gather" title="The Venue" />
          <figure className="sb-postcard">
            <span className="sb-stamp" aria-hidden="true">
              {stamp}
            </span>
            <div className="sb-postcard-img">
              <Image src={art.venue.src} alt="" fill sizes="(max-width: 760px) 100vw, 570px" className="object-cover" />
            </div>
            <figcaption className="sb-postcard-caption">
              <span>{name}</span>
              <i aria-hidden="true" />
              <span>{city || "The garden"}</span>
            </figcaption>
          </figure>
          <h3 className="sb-venue-name">{name}</h3>
          {address && (
            <p className="sb-venue-address">
              {addressLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < addressLines.length - 1 && <br />}
                </span>
              ))}
            </p>
          )}
          <a className="sb-pill" href={directions} target="_blank" rel="noopener noreferrer">
            <Navigation size={12} aria-hidden /> View map
          </a>
        </Reveal>
      </section>
    );
  }
  return (
    <section className="sb-section sb-venue" id="venue">
      <Reveal>
        <Head kicker="Where we gather" title="The Venue" />
        <figure className="sb-venue-art">
          <Image src={DEMO_ART.aisle} alt="" fill sizes="(max-width: 760px) 100vw, 760px" className="object-cover" />
        </figure>
        <h3 className="sb-venue-name">{name}</h3>
        {address && (
          <p className="sb-venue-address">
            {addressLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < addressLines.length - 1 && <br />}
              </span>
            ))}
          </p>
        )}
        <a className="sb-pill" href={directions} target="_blank" rel="noopener noreferrer">
          <MacPin /> View map
        </a>
      </Reveal>
    </section>
  );
}

/** Small map-pin alias keeps the JSX tidy. */
function MacPin() {
  return <MapPin size={12} aria-hidden />;
}

/** Dress code with couple-entered swatches. */
function DressSection({ text, colors, art, variant }: { text?: string; colors: DressSwatch[]; art: NonNullable<ReturnType<typeof getArtCollection>>; variant: StorybookVariant }) {
  const flora = variant === "lakeside" ? DEMO_ART.hydrangea : art.sprays.peonyTall;
  return (
    <section className="sb-section sb-dress" id="dress">
      <Reveal>
        <Head kicker="What to wear" title="Dress Code" />
        {variant === "peony" || variant === "lantern" ? (
          <div className="sb-dress-grid">
            <div className="sb-dress-copy">
              {text && <p>{text}</p>}
              {colors.length > 0 && (
                <div className="sb-swatches" aria-label="Suggested dress-code colours">
                  {colors.map((c) => (
                    <div key={`${c.label}-${c.hex}`} className="sb-swatch">
                      <i style={{ background: c.hex }} />
                      <span>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Image className="sb-dress-art" src={art.sprays.roses.src} alt="" width={art.sprays.roses.width} height={art.sprays.roses.height} aria-hidden />
          </div>
        ) : (
          <>
            {text && <p className="sb-lede">{text}</p>}
            {colors.length > 0 && (
              <div className="sb-swatches" aria-label="Suggested dress-code colours">
                {colors.map((c) => (
                  <div key={`${c.label}-${c.hex}`} className="sb-swatch">
                    <i style={{ background: c.hex }} />
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
            )}
            <Image className="sb-dress-flora" src={flora.src} alt="" width={flora.width} height={flora.height} aria-hidden />
          </>
        )}
      </Reveal>
    </section>
  );
}

/** Photo memories, with the gallery / guest-upload links. */
function MomentsSection({
  photos,
  slug,
  guestUploads,
  demo,
  ui,
}: {
  photos: string[];
  slug: string;
  guestUploads: boolean;
  demo: boolean;
  ui: InvitationCopy;
}) {
  const shown = photos.slice(0, 6);
  return (
    <section className="sb-section sb-moments" id="moments">
      <Reveal>
        <Head kicker={ui.moments.eyebrow} title={ui.moments.title} />
        {shown.length > 0 && (
          <div className="sb-moments-grid">
            {shown.map((src, i) => (
              <div key={`${src}-${i}`} className="sb-moment">
                <Image src={src} alt="" fill sizes="(max-width: 620px) 50vw, 220px" className="object-cover" />
              </div>
            ))}
          </div>
        )}
        {guestUploads && (
          <div className="sb-moments-share">
            <p>{ui.moments.shareSubtitle}</p>
            {!demo && <Link className="sb-pill" href={`/${slug}/gallery#share`}>{ui.moments.sharePhotos}</Link>}
          </div>
        )}
        <div className="sb-moments-actions">
          {!demo && photos.length > 0 && <Link className="sb-pill" href={`/${slug}/gallery`}>{ui.moments.viewAlbum}</Link>}
        </div>
      </Reveal>
    </section>
  );
}

/** Gift accounts, QR images and copyable account numbers. */
function GiftSection({ accounts, note, palette }: { accounts: GiftAccount[]; note?: string; palette: InvitationPalette }) {
  const [copied, setCopied] = useState<string | null>(null);

  /** Copies an account number without ever logging it. */
  async function copy(number: string) {
    try {
      await navigator.clipboard.writeText(number.replace(/\s+/g, ""));
      setCopied(number);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard unavailable — non-fatal */
    }
  }

  return (
    <section className="sb-section sb-gift" id="gift" style={{ backgroundColor: palette.surface }}>
      <Reveal>
        <Head kicker="With gratitude" title="Gifts" />
        {note && <p className="sb-gift-note">{note}</p>}
        <div className="sb-gift-grid">
          {accounts.map((a, i) => (
            <div key={`${a.label}-${i}`} className="sb-gift-card">
              <h3>{a.label}</h3>
              {a.qrUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="sb-gift-qr" src={a.qrUrl} alt={`QR code for ${a.label}`} loading="lazy" />
              )}
              {a.bank && <p>{a.bank}</p>}
              {a.holder && <p>{a.holder}</p>}
              {a.number && (
                <button type="button" className="sb-gift-copy" onClick={() => copy(a.number!)}>
                  <QrCode size={12} aria-hidden /> {a.number} {copied === a.number ? <Check size={12} /> : <Copy size={12} />}
                </button>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/** Closing thanks card. */
function ThanksSection({ names, date, venue, art, variant }: { names: [string, string]; date: string | null; venue: string | null; art: NonNullable<ReturnType<typeof getArtCollection>>; variant?: StorybookVariant }) {
  return (
    <section className="sb-thanks" id="thanks">
      <div className="sb-thanks-card">
        <Image className="sb-thanks-wreath" src={art.sprays.wreath.src} alt="" width={art.sprays.wreath.width} height={art.sprays.wreath.height} aria-hidden />
        <Image className="sb-thanks-flora sb-tl" src={variant === "ivory-veil" ? art.sprays.magnolia.src : art.sprays.cherry.src} alt="" width={variant === "ivory-veil" ? art.sprays.magnolia.width : art.sprays.cherry.width} height={variant === "ivory-veil" ? art.sprays.magnolia.height : art.sprays.cherry.height} aria-hidden />
        <Image className="sb-thanks-flora sb-br" src={variant === "ivory-veil" ? art.sprays.magnolia.src : art.sprays.cherry.src} alt="" width={variant === "ivory-veil" ? art.sprays.magnolia.width : art.sprays.cherry.width} height={variant === "ivory-veil" ? art.sprays.magnolia.height : art.sprays.cherry.height} aria-hidden />
        <p className="sb-thanks-script">With love</p>
        <h2 className="sb-thanks-title">Thank You</h2>
        <p className="sb-thanks-text">For the miles travelled, the hands held and the joy you bring into our lives — thank you for being part of our story.</p>
        <p className="sb-monogram">
          {names[0]?.[0] ?? ""}
          {names[1] ? ` & ${names[1][0] ?? ""}` : ""}
        </p>
        <p className="sb-thanks-date">
          {date ? formatDotDate(date) : ""}
          {venue ? ` · ${venue}` : ""}
        </p>
      </div>
    </section>
  );
}

/** Footer with gallery/guestbook links and the required art attribution. */
function FooterSection({
  names,
  date,
  venue,
  slug,
  demo,
  showGallery,
  showGuestbook,
  art,
}: {
  names: [string, string];
  date: string | null;
  venue: string | null;
  slug: string;
  demo: boolean;
  showGallery: boolean;
  showGuestbook: boolean;
  art: NonNullable<ReturnType<typeof getArtCollection>>;
}) {
  const credit = art.credits.find((c) => c.license.includes("CC BY")) ?? art.credits[0];
  return (
    <footer className="sb-footer">
      <p className="sb-footer-mono">{names.filter(Boolean).join(" & ")}</p>
      <p>{[date ? formatDotDate(date) : null, venue].filter(Boolean).join(" · ")}</p>
      {!demo && (showGallery || showGuestbook) && (
        <div className="sb-footer-links">
          {showGallery && <Link href={`/${slug}/gallery`}>Gallery</Link>}
          {showGuestbook && <Link href={`/${slug}/guestbook`}>Guest book</Link>}
        </div>
      )}
      <p>
        Made with Dearly
        {credit && (
          <>
            {" · Art: "}
            <a href={credit.source} target="_blank" rel="noopener noreferrer">
              {credit.artist}
            </a>{" "}
            · {credit.license}
          </>
        )}
        {" · Botanicals: "}
        <a href="https://usefulpix.com/free-clipart/category/flowers/" target="_blank" rel="noopener noreferrer">
          UsefulPix
        </a>
      </p>
    </footer>
  );
}

export default function StorybookInvitation({
  wedding,
  events,
  theme,
  blessings: initialBlessings = [],
  reactions,
  photos = [],
  demo = false,
  music,
  guestUploads = false,
  invitee = null,
  palette,
}: StorybookProps) {
  const variant = palette.style.storybook ?? "ivory";
  const ui = getInvitationCopy(wedding.customization?.language ?? "en");
  const eventType = eventTypeOf(wedding);
  const copy = getEventCopy(eventType, ui.lang);
  const names: [string, string] = [wedding.partner1_name, wedding.partner2_name];
  const twoNames = Boolean(wedding.partner2_name?.trim());
  const past = !demo && isPastEvent(wedding.wedding_date);
  const show = resolveSections(wedding.customization?.sections);
  const families = show.families ? resolveFamilies(wedding.customization?.families) : null;
  const gift = show.gift ? resolveGift(wedding.customization?.gift) : null;
  const dress = resolveDressCode(wedding.customization?.dressCode);
  const dateNote = resolveDateNote(wedding.customization?.dateNote);
  const showStory = Boolean(wedding.story_text) && show.story;
  const showSchedule = events.length > 0 && show.timeline;
  const showVenue = Boolean(wedding.venue_name) && show.venue;
  const showMoments = (photos.length >= 3 || guestUploads) && show.gallery;
  const showRsvp = show.rsvp && !past;
  const showWall = show.blessings || show.reactions;
  const ceremony = events.find((e) => /ceremony|vows|lễ/i.test(e.title)) ?? events[0];
  const [blessings, setBlessings] = useState<GuestbookEntryRow[]>(initialBlessings);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const art = getArtCollection(palette.style.art) ?? getArtCollection("watercolour-garden")!;
  const familiesText = families ? [families.side1, families.side2].filter(Boolean).join(" · ") || null : null;
  const note = wedding.event_title || (wedding.venue_name ? `${copy.label} at ${wedding.venue_name}` : copy.blurb);
  const place = resolveLocationLabel(wedding.customization?.locationLabel) ?? placeLine(wedding);
  const dateLocale = ui.lang === "en" ? "en-GB" : ui.dateLocale;
  const dateUi = { ...ui, dateLocale };
  const greeting = invitee
    ? ui.dear(invitee.name)
    : variant === "ivory-veil"
      ? "Together with their families"
      : variant === "peony" || variant === "lantern"
        ? "With our families"
        : copy.eyebrow;
  const inviteLine =
    eventType === "wedding"
      ? `request the pleasure of your company as we say “I do” ${variant === "lakeside" ? "by the lake" : variant === "ivory-veil" ? "beneath the ivory veil" : "in the garden"}`
      : copy.tagline(hostNames(wedding));
  const veilNote = wedding.event_title || (eventType === "wedding" ? "An evening wrapped in flowers" : null);

  /** Adds a blessing and scrolls the guest to the wall. */
  function handleBlessing(entry: GuestbookEntryRow) {
    setBlessings((prev) => [entry, ...prev]);
    setHighlightId(entry.id);
    setTimeout(() => document.getElementById("blessings")?.scrollIntoView({ behavior: "smooth" }), 2200);
  }

  const vars = useMemo(
    () =>
      ({
        "--sb-paper": palette.background,
        "--sb-paper-2": palette.isDark ? mix(palette.background, "#ffffff", 0.06) : mix(palette.background, "#ffffff", 0.6),
        "--sb-ink": palette.ink,
        "--sb-muted": palette.inkMuted,
        "--sb-accent": palette.primary,
        "--sb-accent-deep": mix(palette.primary, "#000000", palette.isDark ? 0.1 : 0.24),
        "--sb-gold": palette.accent,
        "--sb-sage": palette.leaf,
        "--sb-line": alpha(palette.primary, 0.28),
        "--sb-line-soft": alpha(palette.primary, 0.14),
        "--sb-display": palette.displayFont,
        "--sb-script": palette.scriptFont,
        "--sb-body": palette.bodyFont,
      }) as CSSProperties,
    [palette]
  );

  return (
    <EventContext.Provider value={{ eventType, copy, twoNames, inviteeName: invitee?.name ?? null, lang: ui.lang }}>
      <div className={`sb-root sb-variant-${variant} ${palette.isDark ? "sb-dark" : ""}`} style={vars}>
        <link rel="stylesheet" href={googleFontsUrl(theme.fonts, [palette.style.bodyFont, palette.style.scriptFont])} />
        <div className="sb-grain" aria-hidden="true" />
        <div className="sb-page">
          {variant === "peony" || variant === "lantern" ? <ScrollVine /> : null}
          {variant === "peony" || variant === "lantern" ? (
            <WreathHero variant={variant} wedding={wedding} names={names} twoNames={twoNames} greeting={greeting} note={note} art={art} place={place} palette={palette} />
          ) : variant === "ivory-veil" ? (
            <IvoryVeilHero wedding={wedding} names={names} twoNames={twoNames} greeting={greeting} inviteLine={inviteLine} note={veilNote} art={art} familiesText={familiesText} place={place} />
          ) : (
            <EditorialHero variant={variant} wedding={wedding} names={names} twoNames={twoNames} greeting={greeting} inviteLine={inviteLine} art={art} familiesText={familiesText} place={place} palette={palette} />
          )}

          <main>
            {wedding.wedding_date &&
              (variant === "peony" || variant === "lantern" ? (
                <WreathDate date={wedding.wedding_date} wedding={wedding} ui={dateUi} art={art} ceremony={ceremony} note={dateNote} />
              ) : (
                <SceneDate date={wedding.wedding_date} wedding={wedding} ui={dateUi} ceremony={ceremony} note={dateNote} variant={variant} />
              ))}
            {showStory && <StorySection text={wedding.story_text!} title={copy.storyTitle} art={art} variant={variant} />}
            {showSchedule && <ScheduleSection events={events} wedding={wedding} ui={dateUi} variant={variant} />}
            {showVenue && <VenueSection name={wedding.venue_name!} address={wedding.venue_address} date={wedding.wedding_date} art={art} variant={variant} />}
            {dress && <DressSection text={dress.text} colors={dress.colors} art={art} variant={variant} />}
            {showMoments && <MomentsSection photos={photos} slug={wedding.slug} guestUploads={guestUploads} demo={demo} ui={ui} />}
            {gift && <GiftSection accounts={gift.accounts} note={gift.note} palette={palette} />}
            {showRsvp && (
              <StorybookRsvp
                variant={variant}
                weddingId={wedding.id}
                coupleNames={names}
                demo={demo}
                invitee={invitee}
                giftAccounts={gift?.accounts}
                eyebrow={copy.rsvpEyebrow}
                title={copy.rsvpTitle}
                replyBy={wedding.wedding_date ? replyBy(wedding.wedding_date, dateLocale) : null}
                onBlessing={handleBlessing}
              />
            )}
            {showWall && (
              <StorybookBlessings
                weddingId={wedding.id}
                blessings={blessings}
                reactions={{ ...EMPTY_REACTIONS, ...reactions }}
                highlightId={highlightId}
                demo={demo}
                showWall={show.blessings}
                showReactions={show.reactions}
                title={copy.blessingsTitle}
                palette={palette}
              />
            )}
            <ThanksSection names={names} date={wedding.wedding_date} venue={wedding.venue_name} art={art} variant={variant} />
          </main>

          <FooterSection
            names={names}
            date={wedding.wedding_date}
            venue={wedding.venue_name}
            slug={wedding.slug}
            demo={demo}
            showGallery={show.gallery}
            showGuestbook={show.guestbook}
            art={art}
          />
        </div>
        {show.blessingShower && (
          <BlessingShower blessings={blessings} palette={palette} latestId={highlightId} mode={resolveBlessingStyle(wedding.customization?.blessingStyle)} />
        )}
        {show.music && <MusicPlayer musicUrl={music?.url} preset={music?.preset ?? palette.style.music} theme={theme} />}
      </div>
    </EventContext.Provider>
  );
}
