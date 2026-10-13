"use client";

/**
 * Bloom guestbook — floral-bordered entry cards with soft pink styling
 * and bloom-in animation on scroll.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

export default function BloomGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <div className="mb-12 flex flex-col items-center gap-3 text-center">
        <span className="text-2xl" style={{ color: theme.colors.primary }}>✿</span>
        <h2
          className="text-3xl font-light"
          style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.primary }}
        >
          Guest Book
        </h2>
      </div>

      <GuestbookForm weddingId={weddingId} theme={theme} />

      <div className="mt-12 flex flex-col gap-6">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="rounded-3xl p-6"
            style={{
              backgroundColor: `${theme.colors.primary}10`,
              border: `1px solid ${theme.colors.primary}30`,
              boxShadow: `0 4px 20px ${theme.colors.primary}15`,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-base italic leading-relaxed" style={{ color: theme.colors.accent }}>
              &ldquo;{entry.message}&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span style={{ color: theme.colors.primary }}>✿</span>
              <p className="text-sm font-medium" style={{ color: theme.colors.primary }}>
                {entry.guest_name}
              </p>
            </div>
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
