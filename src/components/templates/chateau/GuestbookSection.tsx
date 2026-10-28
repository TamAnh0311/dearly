"use client";

/**
 * Chateau guestbook — golden-accented entry cards with ornate French estate
 * styling and scroll-triggered fade-in animations.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

/** Small ornate SVG flourish used beside guest names. */
function GoldFlourish({ color }: { color: string }) {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
      <path
        d="M2 6 C5 2, 8 2, 9 6 S13 10, 16 6"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="9" cy="6" r="1.2" fill={color} />
    </svg>
  );
}

export default function ChateauGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  const gold = theme.colors.primary;

  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <div className="mb-12 flex flex-col items-center gap-3 text-center">
        <GoldFlourish color={gold} />
        <h2
          className="text-3xl font-light"
          style={{ fontFamily: "'Playfair Display', serif", color: gold }}
        >
          Guest Book
        </h2>
      </div>

      <GuestbookForm weddingId={weddingId} theme={theme} />

      <div className="mt-12 flex flex-col gap-6">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="rounded-xl p-6"
            style={{
              backgroundColor: `${gold}08`,
              border: `1px solid ${gold}25`,
              boxShadow: `0 4px 24px ${gold}10`,
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="text-base italic leading-relaxed"
              style={{ color: theme.colors.accent }}
            >
              &ldquo;{entry.message}&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2">
              <GoldFlourish color={gold} />
              <p className="text-sm font-medium" style={{ color: gold }}>
                {entry.guest_name}
              </p>
            </div>
            <p
              className="mt-1 text-xs"
              style={{ color: theme.colors.accent, opacity: 0.5 }}
            >
              {new Date(entry.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
