"use client";

/**
 * Rustic guestbook — parchment-styled cards with dashed borders
 * and hand-crafted typographic feel.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

export default function RusticGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <div className="mb-12 text-center">
        <div className="mb-3 flex items-center justify-center gap-4">
          <div className="h-px w-12" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
          <span style={{ color: theme.colors.accent }}>✦</span>
          <div className="h-px w-12" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
        </div>
        <h2
          className="text-4xl"
          style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
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
              backgroundColor: `${theme.colors.accent}08`,
              border: `1px dashed ${theme.colors.accent}50`,
              borderRadius: "2px",
            }}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
          >
            <p className="text-sm italic leading-loose" style={{ color: theme.colors.accent }}>
              &ldquo;{entry.message}&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span style={{ color: theme.colors.accent, fontSize: "10px" }}>✦</span>
              <p className="text-xs uppercase tracking-widest font-medium" style={{ color: theme.colors.primary }}>
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
