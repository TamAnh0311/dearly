"use client";

/**
 * TopNav & Footer — a slim header that turns frosted after the hero with
 * section anchors and an always-visible RSVP button, plus a closing footer
 * with the couple's monogram.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { alpha, formatDotDate, mix, type InvitationPalette } from "../utils";
import { getArtCollection, type ArtCollection } from "../art";
import ArtSpray from "./ArtSpray";
import { useInvitationCopy } from "./HeroParts";
import { ChateauDivider, ChateauWreath } from "./ChateauDecor";

export interface NavLink {
  href: string;
  label: string;
}

/** Couple initials, e.g. "E & J". */
function monogram(a: string, b: string): string {
  const x = a.trim().charAt(0).toUpperCase();
  const y = b.trim().charAt(0).toUpperCase();
  return x && y ? `${x} & ${y}` : x || y;
}

export function TopNav({
  names,
  links,
  palette,
  topOffset = 0,
  showRsvp = true,
}: {
  names: [string, string];
  links: NavLink[];
  palette: InvitationPalette;
  topOffset?: number;
  showRsvp?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const ui = useInvitationCopy();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.header
          className="fixed inset-x-0 z-40 flex items-center justify-between px-5 py-3 md:px-10"
          style={{
            top: topOffset,
            backgroundColor: alpha(palette.background, 0.78),
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: `1px solid ${alpha(palette.primary, 0.12)}`,
          }}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        >
          <a href="#top" className="text-2xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
            {monogram(names[0], names[1])}
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label={ui.chrome.sectionsAria}>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[11px] uppercase tracking-[0.25em] transition-opacity hover:opacity-60"
                style={{ color: palette.ink }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          {showRsvp ? (
          <a
            href="#rsvp"
            className="rounded-full px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.25em]"
            style={{ backgroundColor: palette.primary, color: palette.background }}
          >
            {ui.nav.rsvp}
          </a>
          ) : (
            <span className="w-16" aria-hidden />
          )}
        </motion.header>
      )}
    </AnimatePresence>
  );
}

/** Visible CC BY attribution for the curated artwork. */
function ArtCredit({ art, palette }: { art: ArtCollection; palette: InvitationPalette }) {
  const credits = Array.from(
    new Map(
      art.credits
        .filter((credit) => credit.license.toUpperCase().includes("CC BY"))
        .map((credit) => [`${credit.artist}|${credit.license}`, credit])
    ).values()
  );
  if (credits.length === 0) return null;
  return (
    <p className="mx-auto mt-6 max-w-lg text-[9px] uppercase tracking-[0.22em]" style={{ color: alpha(palette.ink, 0.45) }}>
      Art:{" "}
      {credits.map((credit, i) => (
        <span key={`${credit.artist}-${credit.license}`}>
          {i > 0 && " · "}
          <a href={credit.source} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
            {credit.artist}
          </a>{" "}
          ({credit.license})
        </span>
      ))}
    </p>
  );
}

export function Footer({
  names,
  date,
  slug,
  palette,
  showGallery = true,
  showGuestbook = true,
}: {
  names: [string, string];
  date?: string | null;
  slug?: string;
  palette: InvitationPalette;
  showGallery?: boolean;
  showGuestbook?: boolean;
}) {
  const ui = useInvitationCopy();
  const atelier = palette.style.hero === "atelier";
  const chateau = palette.style.hero === "chateau";
  const art = getArtCollection(palette.style.art);

  return (
    <footer className="relative px-6 pb-32 pt-24 text-center" style={{ backgroundColor: palette.background }}>
      {atelier ? (
        <div className="relative mx-auto max-w-2xl">
          <div
            className="relative overflow-hidden border px-6 py-14 md:px-16 md:py-16"
            style={{
              borderRadius: "2rem",
              borderColor: alpha(palette.primary, 0.34),
              background: palette.isDark ? mix(palette.background, "#ffffff", 0.06) : mix(palette.background, "#ffffff", 0.5),
              boxShadow: `0 44px 90px -50px ${alpha(palette.primary, 0.55)}`,
            }}
          >
            <div aria-hidden className="pointer-events-none absolute inset-3 border" style={{ borderRadius: "1.6rem", borderColor: alpha(palette.primary, 0.18) }} />
            <ArtSpray palette={palette} asset="roses" className="-bottom-8 -right-8 w-28 opacity-40 md:w-36" rotate={14} />
            <div className="relative">
              <motion.div
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border"
                style={{ borderColor: alpha(palette.primary, 0.4) }}
                initial={{ rotate: -90, opacity: 0 }}
                whileInView={{ rotate: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4 }}
              >
                <span className="text-3xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
                  {monogram(names[0], names[1])}
                </span>
              </motion.div>
              <p className="mt-7 text-2xl uppercase tracking-[0.18em] md:text-3xl" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
                {names.filter(Boolean).join(" & ")}
              </p>
              {date && (
                <p className="mt-3 text-[11px] tracking-[0.35em]" style={{ color: palette.inkMuted }}>
                  {formatDotDate(date)}
                </p>
              )}
              <span aria-hidden className="mx-auto mt-7 block h-px w-14" style={{ backgroundColor: alpha(palette.primary, 0.35) }} />
              <p className="mx-auto mt-6 max-w-md text-3xl md:text-4xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
                {ui.chrome.thankYou}
              </p>
              {slug && (showGallery || showGuestbook) && (
                <div className="mt-9 flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-[0.25em]">
                  {showGallery && (
                    <Link href={`/${slug}/gallery`} style={{ color: palette.inkMuted }} className="hover:opacity-70">
                      {ui.chrome.gallery}
                    </Link>
                  )}
                  {showGuestbook && (
                    <Link href={`/${slug}/guestbook`} style={{ color: palette.inkMuted }} className="hover:opacity-70">
                      {ui.chrome.guestbook}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
          {art && <ArtCredit art={art} palette={palette} />}
        </div>
      ) : (
        <>
          {chateau ? (
            <div className="flex justify-center">
              <ChateauWreath palette={palette} size={170}>
                <motion.div
                  className="flex h-24 w-24 items-center justify-center rounded-full border"
                  style={{ borderColor: alpha(palette.primary, 0.4) }}
                  initial={{ rotate: -90, opacity: 0 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4 }}
                >
                  <span className="text-3xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
                    {monogram(names[0], names[1])}
                  </span>
                </motion.div>
              </ChateauWreath>
            </div>
          ) : (
            <motion.div
              className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border"
              style={{ borderColor: alpha(palette.primary, 0.4) }}
              initial={{ rotate: -90, opacity: 0 }}
              whileInView={{ rotate: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4 }}
            >
              <span className="text-4xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
                {monogram(names[0], names[1])}
              </span>
            </motion.div>
          )}
          <p className="mt-8 text-3xl md:text-4xl" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
            {names.filter(Boolean).join(" & ")}
          </p>
          {date && (
            <p className="mt-3 text-xs tracking-[0.35em]" style={{ color: palette.inkMuted }}>
              {formatDotDate(date)}
            </p>
          )}
          {chateau && <ChateauDivider palette={palette} />}
          <p className={`mx-auto max-w-md ${chateau ? "mt-2 text-3xl md:text-4xl" : "mt-8 text-2xl"}`} style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
            {ui.chrome.thankYou}
          </p>
          {slug && (showGallery || showGuestbook) && (
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-[11px] uppercase tracking-[0.25em]">
              {showGallery && (
                <Link href={`/${slug}/gallery`} style={{ color: palette.inkMuted }} className="hover:opacity-70">
                  {ui.chrome.gallery}
                </Link>
              )}
              {showGuestbook && (
                <Link href={`/${slug}/guestbook`} style={{ color: palette.inkMuted }} className="hover:opacity-70">
                  {ui.chrome.guestbook}
                </Link>
              )}
            </div>
          )}
          {art && <ArtCredit art={art} palette={palette} />}
        </>
      )}
      <Link href="/" className="mt-12 inline-block text-[10px] uppercase tracking-[0.3em]" style={{ color: alpha(palette.ink, 0.35) }}>
        Made with Dearly
      </Link>
    </footer>
  );
}
