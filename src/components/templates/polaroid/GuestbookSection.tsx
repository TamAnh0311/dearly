"use client";

/**
 * Polaroid guestbook — entries displayed as tilted polaroid-frame note cards
 * with handwritten-style typography and tape accents.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

const tilts = [1.5, -2, 1, -1.5, 2, -1];

export default function PolaroidGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{ backgroundColor: theme.colors.secondary, fontFamily: `'${theme.fonts.body}', sans-serif` }}
    >
      <div className="mb-12 text-center">
        <div className="mx-auto mb-2 h-4 w-20 opacity-70" style={{ backgroundColor: theme.colors.accent }} />
        <h2
          className="text-4xl"
          style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
        >
          Guest Book
        </h2>
      </div>

      <GuestbookForm weddingId={weddingId} theme={theme} />

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {entries.map((entry, i) => {
          const tilt = tilts[i % tilts.length];
          return (
            <motion.div
              key={entry.id}
              style={{
                backgroundColor: "#fff",
                boxShadow: "3px 3px 12px rgba(0,0,0,0.1)",
                padding: "16px 16px 40px",
                rotate: tilt,
              }}
              initial={{ opacity: 0, y: 30, rotate: tilt + 6 }}
              whileInView={{ opacity: 1, y: 0, rotate: tilt }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 80, damping: 14, delay: i * 0.07 }}
              whileHover={{ rotate: 0, scale: 1.02, zIndex: 10, transition: { duration: 0.2 } }}
            >
              {/* Tape accent */}
              <div
                className="mx-auto mb-3 h-4 w-14 opacity-60"
                style={{ backgroundColor: theme.colors.accent }}
              />
              <p
                className="text-base leading-relaxed"
                style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.primary }}
              >
                &ldquo;{entry.message}&rdquo;
              </p>
              <p
                className="mt-4 text-sm font-medium"
                style={{ fontFamily: `'${theme.fonts.display}', cursive`, color: theme.colors.accent }}
              >
                — {entry.guest_name}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
