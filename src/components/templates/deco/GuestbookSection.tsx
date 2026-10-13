"use client";

/**
 * Deco guestbook — dark navy cards with gold border accents,
 * geometric diamond separators, Gatsby-era elegance.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

export default function DecoGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ backgroundColor: theme.colors.secondary, fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <div className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-6">
          <div className="h-px w-16" style={{ backgroundColor: theme.colors.primary, opacity: 0.5 }} />
          <div className="h-3 w-3 rotate-45" style={{ backgroundColor: theme.colors.primary }} />
          <div className="h-px w-16" style={{ backgroundColor: theme.colors.primary, opacity: 0.5 }} />
        </div>
        <h2
          className="text-4xl font-light uppercase tracking-[0.3em]"
          style={{ fontFamily: `'${theme.fonts.display}', sans-serif`, color: theme.colors.primary }}
        >
          Guest Book
        </h2>
      </div>

      <GuestbookForm weddingId={weddingId} theme={theme} />

      <div className="mt-12 flex flex-col gap-6">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="p-6"
            style={{
              border: `1px solid ${theme.colors.primary}40`,
              backgroundColor: `${theme.colors.primary}06`,
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
          >
            <p className="text-sm leading-loose" style={{ color: theme.colors.accent }}>
              &ldquo;{entry.message}&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-px flex-1" style={{ backgroundColor: theme.colors.primary, opacity: 0.3 }} />
              <p className="text-xs uppercase tracking-widest" style={{ color: theme.colors.primary }}>
                {entry.guest_name}
              </p>
            </div>
            <p className="mt-1 text-right text-xs" style={{ color: theme.colors.accent, opacity: 0.4 }}>
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
