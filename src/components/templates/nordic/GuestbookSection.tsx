"use client";

/**
 * Nordic guestbook — crisp message cards with geometric borders,
 * clean typography, and minimalist Scandinavian styling.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

export default function NordicGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <h2
        className="mb-12 text-center text-3xl font-medium tracking-wide"
        style={{ fontFamily: `'${theme.fonts.display}', sans-serif`, color: theme.colors.primary }}
      >
        Guest Book
      </h2>

      <GuestbookForm weddingId={weddingId} theme={theme} />

      <div className="mt-12 flex flex-col gap-6">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="border p-6"
            style={{
              borderColor: `${theme.colors.accent}30`,
              backgroundColor: "#FFFFFF",
            }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <p className="text-base leading-relaxed" style={{ color: theme.colors.primary }}>
              &ldquo;{entry.message}&rdquo;
            </p>
            <div
              className="mt-4 flex items-center gap-2 border-t pt-3"
              style={{ borderTopColor: `${theme.colors.accent}20` }}
            >
              <div
                className="h-1.5 w-1.5"
                style={{ backgroundColor: theme.colors.accent }}
              />
              <p className="text-sm font-medium" style={{ color: theme.colors.primary }}>
                {entry.guest_name}
              </p>
              <span className="text-xs" style={{ color: theme.colors.accent, opacity: 0.5 }}>
                &middot;
              </span>
              <p className="text-xs" style={{ color: theme.colors.accent, opacity: 0.5 }}>
                {new Date(entry.created_at).toLocaleDateString("en-US", {
                  month: "long",
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
