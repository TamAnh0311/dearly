"use client";

/**
 * Sunset guestbook — warm gradient cards with coral border,
 * wave-rise reveal animation.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

export default function SunsetGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ backgroundColor: theme.colors.secondary, fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 h-1 w-16 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
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
              background: `linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.accent}15)`,
              border: `1px solid ${theme.colors.primary}25`,
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <p className="text-base leading-relaxed" style={{ color: theme.colors.primary, opacity: 0.85 }}>
              &ldquo;{entry.message}&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div
                className="h-0.5 w-6 rounded-full"
                style={{ background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.accent})` }}
              />
              <p className="text-sm font-semibold" style={{ color: theme.colors.primary }}>
                {entry.guest_name}
              </p>
            </div>
            <p className="mt-1 text-xs" style={{ color: theme.colors.primary, opacity: 0.45 }}>
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
