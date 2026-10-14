"use client";

/**
 * Public gallery of card templates with category filtering.
 * Renders hero, filter tabs, template grid, and footer.
 */

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Cake,
  CalendarDays,
  Heart,
  Snowflake,
  LayoutGrid,
  Eye,
  ArrowRight,
} from "lucide-react";
import type { CardTemplateRow } from "@/types/database";
import { getCardCategoryImage } from "@/lib/placeholder-images";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SPRING = { type: "spring", damping: 25, stiffness: 120 } as const;

type CategoryFilter = "all" | CardTemplateRow["category"];

const CATEGORY_TABS: { key: CategoryFilter; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All", icon: LayoutGrid },
  { key: "postcard", label: "Postcards", icon: Mail },
  { key: "birthday", label: "Birthday", icon: Cake },
  { key: "event", label: "Events", icon: CalendarDays },
  { key: "thank-you", label: "Thank You", icon: Heart },
  { key: "holiday", label: "Holiday", icon: Snowflake },
];

const CATEGORY_BADGE_STYLES: Record<CardTemplateRow["category"], string> = {
  postcard: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  birthday: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  event: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "thank-you": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  holiday: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Renders a mini color-scheme mockup using template brand colors.
 */
function TemplateColorMockup({
  colors,
  category,
  index,
}: {
  colors: { primary: string; secondary: string; accent: string };
  category: string;
  index: number;
}) {
  const bgImage = getCardCategoryImage(category, index);

  return (
    <div
      className="relative h-48 w-full overflow-hidden rounded-xl"
      style={{ background: colors.secondary }}
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}60 0%, ${colors.secondary}90 100%)`,
        }}
      />

      {/* Card mockup overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-32 h-40 rounded-lg shadow-lg flex flex-col items-center justify-center gap-2 p-4 text-center border"
          style={{
            background: colors.secondary,
            borderColor: `${colors.primary}30`,
          }}
        >
          <div className="w-8 h-px" style={{ background: colors.primary }} />
          <div
            className="text-xs font-semibold leading-tight"
            style={{ color: colors.primary, fontFamily: "serif" }}
          >
            Hello!
          </div>
          <div
            className="text-[9px] leading-tight"
            style={{ color: colors.accent }}
          >
            Thinking of you
          </div>
          <div className="w-8 h-px mt-1" style={{ background: colors.accent }} />
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: colors.primary }}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CardGalleryProps {
  templates: CardTemplateRow[];
}

export default function CardGallery({ templates }: CardGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const filtered =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-dearly-cream">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-dearly-cream/80 backdrop-blur-md border-b border-dearly-border/50"
      >
        <Link
          href="/"
          className="font-display text-2xl font-bold text-dearly-accent"
        >
          Dearly
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-dearly-text-secondary transition hover:text-dearly-text"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 shadow-soft"
          >
            Get started
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
        >
          <p className="text-xs tracking-[0.3em] text-dearly-text-muted uppercase mb-3">
            Cards &amp; Invitations
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-dearly-text mb-4">
            Send Beautiful Cards for{" "}
            <span className="text-dearly-accent">Every Occasion</span>
          </h1>
          <p className="text-lg text-dearly-text-secondary max-w-xl mx-auto leading-relaxed">
            Postcards, birthday invitations, event cards, thank-you notes, and
            holiday greetings. Choose a template, customize, and share instantly.
          </p>
        </motion.div>
      </section>

      {/* Category Filter Tabs */}
      <section className="sticky top-[65px] z-40 bg-dearly-cream/80 backdrop-blur-md border-b border-dearly-border/50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORY_TABS.map(({ key, label, icon: Icon }) => {
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                  isActive
                    ? "bg-dearly-accent text-white shadow-soft"
                    : "bg-dearly-card border border-dearly-border text-dearly-text-secondary hover:border-dearly-accent/40 hover:text-dearly-text"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Template Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((template, i) => {
              const colors = template.default_config?.colors ?? {
                primary: "#333",
                secondary: "#fafafa",
                accent: "#999",
              };

              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING, delay: Math.min(i * 0.06, 0.4) }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="group rounded-2xl border border-dearly-border bg-dearly-card shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
                >
                  {/* Color mockup */}
                  <TemplateColorMockup
                    colors={colors}
                    category={template.category}
                    index={i}
                  />

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-base font-semibold text-dearly-text">
                        {template.name}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                          CATEGORY_BADGE_STYLES[template.category]
                        }`}
                      >
                        {template.category}
                      </span>
                    </div>
                    <p className="text-xs text-dearly-text-secondary leading-relaxed line-clamp-2">
                      {template.description}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-full bg-dearly-accent-soft px-3 py-1.5 text-xs font-semibold text-dearly-accent transition hover:bg-dearly-accent hover:text-white"
                      >
                        <Eye size={12} />
                        Preview
                      </button>
                      <Link
                        href="/signup"
                        className="flex items-center gap-1 rounded-full bg-dearly-accent px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                      >
                        Use This Template
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-dearly-text-secondary">
              No templates found in this category.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-dearly-border bg-dearly-card/40 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-xl font-bold text-dearly-accent">
            Dearly
          </span>
          <div className="flex items-center gap-6 text-sm text-dearly-text-muted">
            <Link
              href="/privacy"
              className="hover:text-dearly-text-secondary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-dearly-text-secondary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="hover:text-dearly-text-secondary transition-colors"
            >
              Contact
            </Link>
          </div>
          <p className="text-sm text-dearly-text-muted">
            &copy; {new Date().getFullYear()} Dearly. Made with love.
          </p>
        </div>
      </footer>
    </div>
  );
}
