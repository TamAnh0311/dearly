"use client";

/**
 * Luxe guestbook — elegant card display with thin gold borders,
 * serif headings, and a submission form styled to match the luxury aesthetic.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

export default function LuxeGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <div className="mb-12 text-center">
        <h2
          className="text-3xl font-light tracking-[0.15em]"
          style={{ fontFamily: `'${theme.fonts.display}', serif`, color: theme.colors.accent }}
        >
          Guest Book
        </h2>
        <div className="mx-auto mt-4 flex items-center justify-center gap-2" style={{ width: 180 }}>
          <div className="h-px flex-1" style={{ backgroundColor: theme.colors.primary, opacity: 0.4 }} />
          <div
            className="h-2 w-2 rotate-45"
            style={{ backgroundColor: theme.colors.primary }}
          />
          <div className="h-px flex-1" style={{ backgroundColor: theme.colors.primary, opacity: 0.4 }} />
        </div>
      </div>

      <GuestbookForm weddingId={weddingId} theme={theme} />

      <div className="mt-12 flex flex-col gap-6">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="border p-6"
            style={{ borderColor: `${theme.colors.primary}30`, backgroundColor: theme.colors.secondary }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <p className="text-base font-light leading-relaxed" style={{ color: theme.colors.accent }}>
              &ldquo;{entry.message}&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-px flex-1" style={{ backgroundColor: theme.colors.primary, opacity: 0.2 }} />
              <p
                className="text-sm font-medium tracking-wide"
                style={{ color: theme.colors.primary }}
              >
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
