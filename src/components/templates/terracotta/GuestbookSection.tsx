"use client";

/**
 * Terracotta guestbook — warm earthy card display with arch-inspired
 * borders and a submission form in warm Mediterranean tones.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

export default function TerracottaGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <h2
        className="mb-12 text-center text-3xl"
        style={{
          fontFamily: `'${theme.fonts.display}', serif`,
          color: theme.colors.accent,
        }}
      >
        Guest Book
      </h2>

      <GuestbookForm weddingId={weddingId} theme={theme} />

      <div className="mt-12 flex flex-col gap-6">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="rounded-2xl border p-6"
            style={{
              borderColor: `${theme.colors.primary}25`,
              backgroundColor: theme.colors.secondary,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
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
              — {entry.guest_name}
            </p>
            <p className="mt-1 text-xs" style={{ color: theme.colors.accent, opacity: 0.5 }}>
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
