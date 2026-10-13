"use client";

/**
 * Garden guestbook — garden-green bordered cards with leaf accents,
 * gentle float-in reveal.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

export default function GardenGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ backgroundColor: theme.colors.secondary, fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <div className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-4">
          <div className="h-px w-12" style={{ backgroundColor: theme.colors.primary, opacity: 0.4 }} />
          <span>🌿</span>
          <div className="h-px w-12" style={{ backgroundColor: theme.colors.primary, opacity: 0.4 }} />
        </div>
        <h2
          className="text-3xl"
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
            className="rounded-2xl p-6"
            style={{
              backgroundColor: `${theme.colors.primary}10`,
              border: `1px solid ${theme.colors.primary}25`,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-base leading-relaxed" style={{ color: theme.colors.accent }}>
              &ldquo;{entry.message}&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm">🌿</span>
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
