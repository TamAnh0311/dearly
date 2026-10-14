"use client";

/**
 * Whimsical guestbook — enchanted card display with magical glow effects
 * and a submission form styled with fairy-tale charm.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

export default function WhimsicalGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <h2
        className="mb-12 text-center text-3xl"
        style={{
          fontFamily: `'${theme.fonts.display}', serif`,
          color: theme.colors.primary,
        }}
      >
        Guest Book
      </h2>

      <GuestbookForm weddingId={weddingId} theme={theme} />

      <div className="mt-12 flex flex-col gap-6">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="rounded-xl border p-6"
            style={{
              borderColor: `${theme.colors.primary}20`,
              backgroundColor: `${theme.colors.secondary}`,
              boxShadow: `0 2px 20px ${theme.colors.primary}08`,
            }}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <p className="text-base leading-relaxed" style={{ color: theme.colors.primary }}>
              &ldquo;{entry.message}&rdquo;
            </p>
            <p
              className="mt-3 text-sm font-medium"
              style={{ color: theme.colors.accent }}
            >
              — {entry.guest_name}
            </p>
            <p className="mt-1 text-xs" style={{ color: theme.colors.primary, opacity: 0.4 }}>
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
