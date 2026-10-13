"use client";

/**
 * Minimal guestbook — stark white cards with thin border lines
 * and precise typographic hierarchy.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

export default function MinimalGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <div className="mb-12">
        <div className="mb-4 h-px w-12" style={{ backgroundColor: theme.colors.primary }} />
        <h2 className="text-2xl font-bold uppercase tracking-widest" style={{ color: theme.colors.primary }}>
          Guest Book
        </h2>
      </div>

      <GuestbookForm weddingId={weddingId} theme={theme} />

      <div className="mt-12 flex flex-col gap-4">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="border-b py-6"
            style={{ borderColor: `${theme.colors.primary}20` }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-base leading-relaxed" style={{ color: theme.colors.accent }}>
              {entry.message}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: theme.colors.primary }}>
                {entry.guest_name}
              </p>
              <p className="text-xs" style={{ color: theme.colors.accent, opacity: 0.4 }}>
                {new Date(entry.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
