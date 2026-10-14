"use client";

/**
 * Public template gallery — browseable by anyone without authentication.
 * Fetches all templates from Supabase, shows a filterable grid with
 * color-scheme mockups and Unsplash wedding imagery.
 * "Use This Template" redirects unauthenticated visitors to /signup.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye, X, MapPin, Calendar, Image as ImageIcon, MessageSquare, Music } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getTemplateImage } from "@/lib/placeholder-images";
import type { TemplateRow } from "@/types/database";

// ─── Constants ────────────────────────────────────────────────────────────────

const ANIMATION_STYLES = ["All", "Subtle", "Cinematic", "Interactive"] as const;
type AnimationFilter = (typeof ANIMATION_STYLES)[number];

const ANIMATION_BADGE: Record<
  TemplateRow["animation_style"],
  { label: string; className: string }
> = {
  subtle: {
    label: "Subtle",
    className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  },
  cinematic: {
    label: "Cinematic",
    className: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  },
  interactive: {
    label: "Interactive",
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
};

const SPRING = { type: "spring", damping: 25, stiffness: 120 } as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Renders a richer mini color-scheme mockup using template brand colors.
 */
function TemplateColorMockup({
  colors,
  fonts,
}: {
  colors: { primary: string; secondary: string; accent: string };
  fonts: { display: string; body: string };
}) {
  return (
    <div
      className="relative flex flex-col items-center justify-center p-6 gap-1.5"
      style={{ background: colors.secondary, minHeight: "140px" }}
    >
      {/* Top decorative line */}
      <div className="w-12 h-px mb-1" style={{ background: colors.primary }} />
      {/* Couple names */}
      <p
        className="text-sm font-semibold tracking-wide text-center leading-tight"
        style={{ color: colors.primary, fontFamily: fonts.display }}
      >
        Emma &amp; James
      </p>
      {/* Heart */}
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center my-0.5"
        style={{ background: `${colors.primary}18` }}
      >
        <Heart size={9} style={{ color: colors.primary, fill: colors.primary }} />
      </div>
      {/* Date */}
      <p
        className="text-[10px] tracking-wider uppercase"
        style={{ color: colors.accent }}
      >
        June 15, 2027
      </p>
      {/* Accent button mockup */}
      <div
        className="mt-2 h-4 w-16 rounded-full"
        style={{ background: colors.primary, opacity: 0.85 }}
      />
      {/* Bottom line */}
      <div className="w-8 h-px mt-1" style={{ background: colors.accent }} />
    </div>
  );
}

/**
 * Skeleton loader shown while templates are being fetched.
 */
function TemplateCardSkeleton() {
  return (
    <div className="rounded-2xl border border-dearly-border bg-dearly-card overflow-hidden animate-pulse">
      <div className="h-56 bg-dearly-border" />
      <div className="p-4 space-y-2.5">
        <div className="h-3.5 w-1/2 rounded-full bg-dearly-border" />
        <div className="h-2.5 w-full rounded-full bg-dearly-border" />
        <div className="h-2.5 w-4/5 rounded-full bg-dearly-border" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-16 rounded-full bg-dearly-border" />
          <div className="h-5 w-14 rounded-full bg-dearly-border" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-8 flex-1 rounded-lg bg-dearly-border" />
          <div className="h-8 flex-1 rounded-lg bg-dearly-border" />
        </div>
      </div>
    </div>
  );
}

// ─── Preview Modal ────────────────────────────────────────────────────────────

/**
 * Full-screen modal with a detailed mockup of the template invitation page.
 */
function PreviewModal({
  template,
  onClose,
}: {
  template: TemplateRow;
  onClose: () => void;
}) {
  const colors = template.default_config?.colors ?? {
    primary: "#B8860B",
    secondary: "#FFFFF0",
    accent: "#D4A574",
  };
  const fonts = template.default_config?.fonts ?? {
    display: "Georgia",
    body: "sans-serif",
  };
  const badge = ANIMATION_BADGE[template.animation_style];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1.5 text-gray-500 backdrop-blur-sm transition hover:bg-white hover:text-gray-800"
        >
          <X size={18} />
        </button>

        {/* Simulated invitation page */}
        <div className="min-h-[500px]" style={{ backgroundColor: colors.secondary }}>
          {/* Hero */}
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            <div className="mb-6 h-px w-16" style={{ backgroundColor: colors.primary }} />
            <p
              className="mb-3 text-xs uppercase tracking-[0.25em]"
              style={{ color: colors.primary, fontFamily: fonts.body }}
            >
              Together with their families
            </p>
            <h2
              className="mb-1 text-4xl font-light md:text-5xl"
              style={{ color: colors.primary, fontFamily: fonts.display }}
            >
              Emma
            </h2>
            <p
              className="mb-1 text-xl italic"
              style={{ color: colors.accent, fontFamily: fonts.display }}
            >
              &amp;
            </p>
            <h2
              className="mb-6 text-4xl font-light md:text-5xl"
              style={{ color: colors.primary, fontFamily: fonts.display }}
            >
              James
            </h2>
            <div className="mb-4 h-px w-16" style={{ backgroundColor: colors.primary }} />
            <p
              className="text-xs uppercase tracking-[0.2em]"
              style={{ color: colors.accent }}
            >
              Request the pleasure of your company
            </p>

            <div className="mt-8 flex items-center gap-2" style={{ color: colors.primary }}>
              <Calendar size={16} />
              <span style={{ fontFamily: fonts.display }}>Saturday, June 15, 2027</span>
            </div>

            <div className="mt-3 flex items-center gap-2" style={{ color: colors.accent }}>
              <MapPin size={16} />
              <span>The Grand Estate, 123 Garden Lane</span>
            </div>

            {/* Countdown mockup */}
            <div className="mt-10 flex gap-6">
              {[
                { label: "Days", value: "142" },
                { label: "Hours", value: "08" },
                { label: "Minutes", value: "24" },
                { label: "Seconds", value: "36" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center">
                  <span
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: colors.primary }}
                  >
                    {value}
                  </span>
                  <span
                    className="mt-1 text-[10px] uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Story */}
          <div className="mx-auto max-w-lg px-8 py-12 text-center">
            <h3
              className="mb-4 text-2xl"
              style={{ color: colors.primary, fontFamily: fonts.display }}
            >
              Our Story
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: colors.accent }}>
              We met on a rainy afternoon in a small coffee shop downtown. What started as a
              conversation over lattes became the greatest adventure of our lives. Three years
              later, surrounded by the people we love most, we&apos;re ready to begin our forever.
            </p>
          </div>

          {/* Schedule */}
          <div className="mx-auto max-w-md px-8 py-8">
            <h3
              className="mb-6 text-center text-2xl"
              style={{ color: colors.primary, fontFamily: fonts.display }}
            >
              Schedule
            </h3>
            <div className="relative space-y-6 pl-8">
              <div
                className="absolute left-3 top-0 h-full w-px"
                style={{ backgroundColor: colors.primary, opacity: 0.3 }}
              />
              {[
                { time: "3:00 PM", title: "Ceremony" },
                { time: "4:30 PM", title: "Cocktail Hour" },
                { time: "6:00 PM", title: "Reception & Dinner" },
              ].map(({ time, title }) => (
                <div key={title} className="flex items-start gap-4">
                  <div
                    className="relative -ml-5 mt-1 h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  />
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: colors.primary, fontFamily: fonts.display }}
                    >
                      {title}
                    </p>
                    <p className="text-xs" style={{ color: colors.accent }}>
                      {time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features row */}
          <div className="flex justify-center gap-6 px-8 py-8 text-center">
            {[
              { icon: ImageIcon, label: "Photo Gallery" },
              { icon: MessageSquare, label: "Guest Book" },
              { icon: Music, label: "Background Music" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Icon size={18} style={{ color: colors.primary }} />
                </div>
                <span className="text-[11px]" style={{ color: colors.accent }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer bar */}
        <div className="sticky bottom-0 flex items-center justify-between border-t bg-white px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-dearly-text">{template.name}</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.className}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-dearly-text-secondary">{template.description}</p>
          </div>
          <Link
            href="/signup"
            className="rounded-lg bg-dearly-accent px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Use This Template
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<AnimationFilter>("All");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateRow | null>(null);

  /** Fetches all templates from Supabase on mount. */
  useEffect(() => {
    async function fetchTemplates() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .order("name", { ascending: true });
      if (!error && data) setTemplates(data as TemplateRow[]);
      setLoading(false);
    }
    fetchTemplates();
  }, []);

  const filtered =
    activeFilter === "All"
      ? templates
      : templates.filter(
          (t) =>
            t.animation_style === activeFilter.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-dearly-cream overflow-x-hidden">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-dearly-cream/80 backdrop-blur-md border-b border-dearly-border/50">
        <Link
          href="/"
          className="font-display text-2xl font-bold text-dearly-accent"
        >
          Dearly
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-dearly-accent border-b-2 border-dearly-accent pb-0.5">
            Templates
          </span>
          <div className="flex items-center gap-3">
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
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="pt-32 pb-16 text-center px-6"
        style={{
          background:
            "linear-gradient(135deg, rgb(252 250 247) 0%, rgb(252 240 242) 40%, rgb(253 248 235) 70%, rgb(252 250 247) 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-dearly-accent-soft px-3 py-1 text-xs font-medium text-dearly-accent mb-6">
            <Heart size={12} className="fill-current" />
            20 Beautiful Templates
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-dearly-text mb-5">
            Beautiful Templates for{" "}
            <span className="text-dearly-accent">Every Style</span>
          </h1>
          <p className="text-lg text-dearly-text-secondary leading-relaxed">
            From timeless elegance to modern minimalism — browse our curated collection
            of 20 wedding templates and find the perfect one for your love story.
            No signup required to browse.
          </p>
        </motion.div>
      </section>

      {/* ── Filter Bar ── */}
      <section className="sticky top-16 z-40 bg-dearly-cream/90 backdrop-blur-md border-b border-dearly-border/40 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-semibold text-dearly-text-muted shrink-0 mr-1">
            Filter:
          </span>
          {ANIMATION_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => setActiveFilter(style)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeFilter === style
                  ? "bg-dearly-accent text-white shadow-soft"
                  : "bg-dearly-card border border-dearly-border text-dearly-text-secondary hover:border-dearly-accent/40 hover:text-dearly-accent"
              }`}
            >
              {style}
            </button>
          ))}
          {!loading && (
            <span className="ml-auto shrink-0 text-xs text-dearly-text-muted">
              {filtered.length} template{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </section>

      {/* ── Template Grid ── */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <TemplateCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-dearly-text-secondary">
                No templates match this filter.
              </p>
              <button
                onClick={() => setActiveFilter("All")}
                className="mt-3 text-sm text-dearly-accent underline hover:no-underline"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {filtered.map((template, index) => {
                const colors = template.default_config?.colors ?? {
                  primary: "#B8860B",
                  secondary: "#FFFFF0",
                  accent: "#D4A574",
                };
                const fonts = template.default_config?.fonts ?? {
                  display: "Georgia",
                  body: "sans-serif",
                };
                const badge = ANIMATION_BADGE[template.animation_style];
                const bgImage = getTemplateImage(index);

                return (
                  <motion.div
                    key={template.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.35 },
                      },
                    }}
                    whileHover={{ y: -4 }}
                    transition={SPRING}
                    className="group rounded-2xl border border-dearly-border bg-dearly-card overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                  >
                    {/* Card image area */}
                    <div className="relative overflow-hidden" style={{ height: "220px" }}>
                      {/* Unsplash background image */}
                      <Image
                        src={bgImage}
                        alt={`${template.name} template preview`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/30" />
                      {/* Floating color mockup */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="rounded-xl shadow-lg border overflow-hidden w-36"
                          style={{ borderColor: `${colors.primary}40` }}
                        >
                          <TemplateColorMockup colors={colors} fonts={fonts} />
                        </div>
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-base font-bold text-dearly-text leading-tight">
                          {template.name}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      {template.description && (
                        <p className="text-xs text-dearly-text-secondary leading-relaxed line-clamp-2">
                          {template.description}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dearly-border bg-dearly-cream px-3 py-2 text-xs font-semibold text-dearly-text-secondary transition hover:border-dearly-accent/50 hover:text-dearly-accent"
                        >
                          <Eye size={12} />
                          Preview
                        </button>
                        <Link
                          href="/signup"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-dearly-accent px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                        >
                          <Heart size={12} className="fill-white" />
                          Use This Template
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6 bg-dearly-card/40 border-t border-dearly-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={SPRING}
          className="max-w-2xl mx-auto text-center"
        >
          <Heart size={32} className="text-dearly-accent fill-dearly-accent mx-auto mb-4" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-dearly-text mb-3">
            Found your perfect template?
          </h2>
          <p className="text-dearly-text-secondary mb-8">
            Create your free account and start building your wedding site in minutes.
            No design skills needed — just your love story.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-dearly-accent px-8 py-4 text-base font-semibold text-white shadow-card transition-all hover:opacity-95 hover:shadow-card-hover hover:-translate-y-0.5"
            >
              Get Started — Free
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-dearly-border bg-dearly-card/60 px-8 py-4 text-base font-semibold text-dearly-text transition-all hover:bg-dearly-card hover:shadow-soft hover:-translate-y-0.5"
            >
              I already have an account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-dearly-border bg-dearly-card/40 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-xl font-bold text-dearly-accent">Dearly</span>
          <div className="flex items-center gap-6 text-sm text-dearly-text-muted">
            <Link href="/privacy" className="hover:text-dearly-text-secondary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-dearly-text-secondary transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-dearly-text-secondary transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-sm text-dearly-text-muted">
            &copy; {new Date().getFullYear()} Dearly. Made with love.
          </p>
        </div>
      </footer>

      {/* ── Preview Modal ── */}
      <AnimatePresence>
        {previewTemplate && (
          <PreviewModal
            template={previewTemplate}
            onClose={() => setPreviewTemplate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
