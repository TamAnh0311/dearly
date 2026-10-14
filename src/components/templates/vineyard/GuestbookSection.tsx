"use client";

/**
 * Vineyard guestbook — warm message cards with burgundy accents,
 * wine-label inspired borders, and earthy styling.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

export default function VineyardGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <h2
        className="mb-12 text-center text-3xl"
        style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
      >
        Guest Book
      </h2>

      <GuestbookForm weddingId={weddingId} theme={theme} />

      <div className="mt-12 flex flex-col gap-6">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="rounded-lg border-l-4 p-6"
            style={{
              borderLeftColor: theme.colors.primary,
              backgroundColor: theme.colors.secondary,
              boxShadow: `0 1px 4px ${theme.colors.accent}15`,
            }}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <p className="text-base leading-relaxed" style={{ color: theme.colors.accent }}>
              &ldquo;{entry.message}&rdquo;
            </p>
            <p
              className="mt-3 text-sm font-medium"
              style={{ color: theme.colors.primary }}
            >
              &mdash; {entry.guest_name}
            </p>
            <p className="mt-1 text-xs" style={{ color: theme.colors.accent, opacity: 0.4 }}>
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
