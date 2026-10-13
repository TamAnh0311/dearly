"use client";

/**
 * Boho guestbook — warm-toned organic card display with handwritten headings,
 * rounded corners, and a submission form styled to match the bohemian aesthetic.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

export default function BohoGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ backgroundColor: theme.colors.secondary, fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <div className="mb-12 text-center">
        <h2
          className="text-4xl"
          style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
        >
          Guest Book
        </h2>
        <svg viewBox="0 0 160 8" className="mx-auto mt-3" style={{ width: 120, height: 8 }}>
          <path
            d="M0 4 Q20 0 40 4 Q60 8 80 4 Q100 0 120 4 Q140 8 160 4"
            stroke={theme.colors.primary}
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          />
        </svg>
      </div>

      <GuestbookForm weddingId={weddingId} theme={theme} />

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="rounded-xl p-6"
            style={{ backgroundColor: "#FFF8F0", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <p
              className="text-base leading-relaxed"
              style={{ color: theme.colors.accent }}
            >
              &ldquo;{entry.message}&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-px flex-1" style={{ backgroundColor: theme.colors.primary, opacity: 0.2 }} />
              <p
                className="text-sm"
                style={{ color: theme.colors.primary, fontFamily: `'${theme.fonts.display}', cursive` }}
              >
                {entry.guest_name}
              </p>
            </div>
            <p className="mt-1 text-right text-xs" style={{ color: theme.colors.accent, opacity: 0.45 }}>
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
