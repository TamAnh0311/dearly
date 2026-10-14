"use client";

/**
 * TopNav & Footer — a slim header that turns frosted after the hero with
 * section anchors and an always-visible RSVP button, plus a closing footer
 * with the couple's monogram.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { alpha, formatDotDate, type InvitationPalette } from "../utils";

export interface NavLink {
  href: string;
  label: string;
}

/** Couple initials, e.g. "E & J". */
function monogram(a: string, b: string): string {
  return `${a.trim().charAt(0).toUpperCase()} & ${b.trim().charAt(0).toUpperCase()}`;
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
          <nav className="hidden items-center gap-7 md:flex" aria-label="Invitation sections">
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
            className="rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.25em]"
            style={{ backgroundColor: palette.primary, color: palette.background }}
          >
            RSVP
          </a>
          ) : (
            <span className="w-16" aria-hidden />
          )}
        </motion.header>
      )}
    </AnimatePresence>
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
  return (
    <footer className="relative px-6 pb-32 pt-24 text-center" style={{ backgroundColor: palette.background }}>
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
      <p className="mt-8 text-3xl md:text-4xl" style={{ fontFamily: palette.displayFont, color: palette.ink }}>
        {names[0]} &amp; {names[1]}
      </p>
      {date && (
        <p className="mt-3 text-xs tracking-[0.35em]" style={{ color: palette.inkMuted }}>
          {formatDotDate(date)}
        </p>
      )}
      <p className="mx-auto mt-8 max-w-md text-2xl" style={{ fontFamily: palette.scriptFont, color: palette.primary }}>
        Thank you for being part of our story
      </p>
      {slug && (showGallery || showGuestbook) && (
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-[11px] uppercase tracking-[0.25em]">
          {showGallery && (
            <Link href={`/${slug}/gallery`} style={{ color: palette.inkMuted }} className="hover:opacity-70">
              Gallery
            </Link>
          )}
          {showGuestbook && (
            <Link href={`/${slug}/guestbook`} style={{ color: palette.inkMuted }} className="hover:opacity-70">
              Guest book
            </Link>
          )}
        </div>
      )}
      <Link href="/" className="mt-12 inline-block text-[10px] uppercase tracking-[0.3em]" style={{ color: alpha(palette.ink, 0.35) }}>
        Made with Dearly
      </Link>
    </footer>
  );
}
