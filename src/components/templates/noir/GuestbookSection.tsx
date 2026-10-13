"use client";

/**
 * Noir guestbook — dark cards with glowing ivory border,
 * cinematic fade-up reveal on each entry.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

export default function NoirGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ backgroundColor: theme.colors.secondary, fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex items-center justify-center gap-4">
          <div className="h-px w-12" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
          <div className="h-1 w-1 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
          <div className="h-px w-12" style={{ backgroundColor: theme.colors.accent, opacity: 0.4 }} />
        </div>
        <h2
          className="text-3xl font-light uppercase tracking-widest"
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
            className="p-6"
            style={{
              backgroundColor: `${theme.colors.primary}06`,
              border: `1px solid ${theme.colors.primary}20`,
              boxShadow: `0 0 20px ${theme.colors.primary}08`,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.07 }}
          >
            <p className="text-sm italic leading-loose" style={{ color: theme.colors.primary, opacity: 0.8 }}>
              &ldquo;{entry.message}&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-px flex-1" style={{ backgroundColor: theme.colors.accent, opacity: 0.2 }} />
              <p className="text-xs uppercase tracking-widest" style={{ color: theme.colors.accent }}>
                {entry.guest_name}
              </p>
            </div>
            <p className="mt-1 text-right text-xs" style={{ color: theme.colors.accent, opacity: 0.35 }}>
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
