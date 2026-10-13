"use client";

/**
 * Glass guestbook — frosted glass entry cards on gradient background,
 * blur-in float animation on scroll reveal.
 */

import { motion } from "framer-motion";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import type { GuestbookSectionProps } from "../types";

export default function GlassGuestbookSection({ weddingId, entries, theme }: GuestbookSectionProps) {
  return (
    <section
      className="px-6 py-20"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`,
        fontFamily: `'${theme.fonts.body}', sans-serif`,
      }}
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h2
            className="text-3xl font-bold text-white"
            style={{ fontFamily: `'${theme.fonts.display}', sans-serif` }}
          >
            Guest Book
          </h2>
          <div className="mx-auto mt-3 h-px w-24 bg-white/30" />
        </div>

        <GuestbookForm weddingId={weddingId} theme={theme} />

        <div className="mt-12 flex flex-col gap-6">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              className="rounded-2xl p-6"
              style={{
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-sm leading-loose text-white/85">
                &ldquo;{entry.message}&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-white/20" />
                <p className="text-xs font-semibold text-white/70">{entry.guest_name}</p>
              </div>
              <p className="mt-1 text-right text-xs text-white/40">
                {new Date(entry.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
