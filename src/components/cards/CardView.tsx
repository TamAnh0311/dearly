"use client";

/**
 * Full-viewport card display component.
 * Renders a published card with template-driven styling,
 * decorative elements based on category, and entrance animations.
 */

import { motion } from "framer-motion";
import { Share2, MapPin, CalendarDays } from "lucide-react";
import type { CardRow, CardTemplateRow } from "@/types/database";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SPRING = { type: "spring", damping: 25, stiffness: 120 } as const;

// ---------------------------------------------------------------------------
// Category-specific decorative SVGs
// ---------------------------------------------------------------------------

/** Stamp decoration for postcards. */
function PostcardDecorations({ accent }: { accent: string }) {
  return (
    <>
      {/* Stamp */}
      <div className="absolute top-6 right-6">
        <svg width="60" height="72" viewBox="0 0 60 72" fill="none">
          <rect
            x="2"
            y="2"
            width="56"
            height="68"
            rx="2"
            stroke={accent}
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          <circle cx="30" cy="36" r="16" stroke={accent} strokeWidth="1.5" opacity="0.5" />
          <path d="M22 36l5 5 11-11" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {/* Postmark circle */}
      <div className="absolute top-8 right-20 opacity-20">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke={accent} strokeWidth="1.5" />
          <circle cx="24" cy="24" r="16" stroke={accent} strokeWidth="1" />
          <line x1="4" y1="24" x2="44" y2="24" stroke={accent} strokeWidth="1" />
        </svg>
      </div>
      {/* Dotted border */}
      <div
        className="absolute inset-4 rounded-2xl border-2 border-dashed pointer-events-none"
        style={{ borderColor: `${accent}30` }}
      />
    </>
  );
}

/** Confetti and balloon decorations for birthday cards. */
function BirthdayDecorations({ accent, primary }: { accent: string; primary: string }) {
  return (
    <>
      {/* Confetti particles */}
      {[
        { x: "10%", y: "8%", rotate: 45, color: accent },
        { x: "85%", y: "12%", rotate: -30, color: primary },
        { x: "15%", y: "75%", rotate: 60, color: accent },
        { x: "90%", y: "70%", rotate: -45, color: primary },
        { x: "50%", y: "5%", rotate: 15, color: accent },
        { x: "70%", y: "85%", rotate: -60, color: primary },
      ].map((conf, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-4 rounded-sm pointer-events-none"
          style={{
            left: conf.x,
            top: conf.y,
            background: conf.color,
            rotate: `${conf.rotate}deg`,
            opacity: 0.5,
          }}
          animate={{ y: [-6, 6, -6], rotate: [conf.rotate - 10, conf.rotate + 10, conf.rotate - 10] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* Balloon SVGs */}
      {[
        { x: "8%", y: "15%", color: accent },
        { x: "88%", y: "20%", color: primary },
      ].map((b, i) => (
        <motion.div
          key={`balloon-${i}`}
          className="absolute pointer-events-none"
          style={{ left: b.x, top: b.y }}
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="32" height="48" viewBox="0 0 32 48" fill="none">
            <ellipse cx="16" cy="16" rx="14" ry="16" fill={b.color} opacity="0.4" />
            <path d="M16 32 L16 46" stroke={b.color} strokeWidth="1" opacity="0.4" />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

/** Elegant border decorations for events. */
function EventDecorations({ accent }: { accent: string }) {
  return (
    <>
      {/* Corner flourishes */}
      {["top-4 left-4", "top-4 right-4 scale-x-[-1]", "bottom-4 left-4 scale-y-[-1]", "bottom-4 right-4 scale-[-1]"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} pointer-events-none`}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M2 38 C2 18, 18 2, 38 2"
              stroke={accent}
              strokeWidth="1.5"
              opacity="0.4"
            />
            <path
              d="M2 30 C2 14, 14 2, 30 2"
              stroke={accent}
              strokeWidth="1"
              opacity="0.25"
            />
          </svg>
        </div>
      ))}
      {/* Subtle center divider */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-24 h-px pointer-events-none"
        style={{ background: `${accent}30` }}
      />
    </>
  );
}

/** Heart decorations for thank-you cards. */
function ThankYouDecorations({ accent }: { accent: string }) {
  return (
    <>
      {[
        { x: "6%", y: "10%", size: 18 },
        { x: "90%", y: "8%", size: 14 },
        { x: "8%", y: "85%", size: 16 },
        { x: "88%", y: "82%", size: 20 },
      ].map((h, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: h.x, top: h.y }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill={accent} opacity="0.4">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
      {/* Floral corner accents */}
      {["top-3 left-3", "bottom-3 right-3 rotate-180"].map((pos, i) => (
        <div key={`floral-${i}`} className={`absolute ${pos} pointer-events-none`}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" opacity="0.3">
            <path d="M4 32 Q4 18 18 4" stroke={accent} strokeWidth="1.5" />
            <circle cx="18" cy="4" r="3" fill={accent} opacity="0.5" />
            <circle cx="4" cy="32" r="2" fill={accent} opacity="0.5" />
          </svg>
        </div>
      ))}
    </>
  );
}

/** Snowflakes or sparkles for holiday cards. */
function HolidayDecorations({ accent }: { accent: string }) {
  return (
    <>
      {[
        { x: "10%", y: "10%" },
        { x: "85%", y: "15%" },
        { x: "20%", y: "80%" },
        { x: "75%", y: "75%" },
        { x: "50%", y: "6%" },
        { x: "40%", y: "90%" },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: pos.x, top: pos.y }}
          animate={{
            rotate: [0, 360],
            opacity: [0.15, 0.35, 0.15],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill={accent} opacity="0.4">
            <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z" />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Category decoration resolver
// ---------------------------------------------------------------------------

/**
 * Returns the correct decorative overlay component for a given category.
 */
function CategoryDecorations({
  category,
  colors,
}: {
  category: CardTemplateRow["category"];
  colors: { primary: string; secondary: string; accent: string };
}) {
  switch (category) {
    case "postcard":
      return <PostcardDecorations accent={colors.accent} />;
    case "birthday":
      return <BirthdayDecorations accent={colors.accent} primary={colors.primary} />;
    case "event":
      return <EventDecorations accent={colors.accent} />;
    case "thank-you":
      return <ThankYouDecorations accent={colors.accent} />;
    case "holiday":
      return <HolidayDecorations accent={colors.accent} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface CardViewProps {
  card: CardRow;
  template: CardTemplateRow;
}

export default function CardView({ card, template }: CardViewProps) {
  const colors = template.default_config?.colors ?? {
    primary: "#333",
    secondary: "#fafafa",
    accent: "#999",
  };
  const fonts = template.default_config?.fonts ?? {
    display: "Georgia",
    body: "sans-serif",
  };

  const formattedDate = card.event_date
    ? new Date(card.event_date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  /**
   * Copies the current page URL to the clipboard.
   */
  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: card.title || "A card from Dearly",
        url: window.location.href,
      });
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: colors.secondary }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.1 }}
        className="relative w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: colors.secondary,
          border: `1px solid ${colors.primary}20`,
        }}
      >
        {/* Decorations */}
        <CategoryDecorations category={template.category} colors={colors} />

        {/* Card image */}
        {card.image_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full h-48 md:h-56 bg-cover bg-center"
            style={{ backgroundImage: `url(${card.image_url})` }}
          />
        )}

        {/* Card content */}
        <div className="relative px-8 py-12 md:px-12 md:py-16 text-center space-y-6">
          {/* Title */}
          {card.title && (
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold leading-tight"
              style={{ color: colors.primary, fontFamily: fonts.display }}
            >
              {card.title}
            </motion.h1>
          )}

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="w-16 h-px mx-auto"
            style={{ backgroundColor: colors.accent }}
          />

          {/* Message */}
          {card.message && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.4 }}
              className="text-base md:text-lg leading-relaxed whitespace-pre-line"
              style={{ color: colors.primary, fontFamily: fonts.body }}
            >
              {card.message}
            </motion.p>
          )}

          {/* Event details */}
          {(formattedDate || card.event_location) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.5 }}
              className="space-y-2"
            >
              {formattedDate && (
                <div
                  className="flex items-center justify-center gap-2 text-sm"
                  style={{ color: colors.accent }}
                >
                  <CalendarDays size={16} />
                  <span style={{ fontFamily: fonts.body }}>{formattedDate}</span>
                </div>
              )}
              {card.event_location && (
                <div
                  className="flex items-center justify-center gap-2 text-sm"
                  style={{ color: colors.accent }}
                >
                  <MapPin size={16} />
                  <span style={{ fontFamily: fonts.body }}>{card.event_location}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Recipient */}
          {card.recipient_name && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-sm italic"
              style={{ color: colors.accent, fontFamily: fonts.body }}
            >
              For {card.recipient_name}
            </motion.p>
          )}

          {/* Sender */}
          {card.sender_name && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.6 }}
            >
              <div className="w-12 h-px mx-auto mb-3" style={{ backgroundColor: colors.accent }} />
              <p
                className="text-sm font-medium"
                style={{ color: colors.primary, fontFamily: fonts.display }}
              >
                With love, {card.sender_name}
              </p>
            </motion.div>
          )}
        </div>

        {/* Share button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute top-4 left-4"
        >
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition hover:opacity-80"
            style={{
              backgroundColor: `${colors.primary}15`,
              color: colors.primary,
            }}
          >
            <Share2 size={12} />
            Share
          </button>
        </motion.div>

        {/* Dearly branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pb-4 text-center"
        >
          <a
            href="/"
            className="text-[10px] tracking-wider uppercase"
            style={{ color: `${colors.primary}40` }}
          >
            Made with Dearly
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
