"use client";

/**
 * Public template gallery — browseable by anyone without authentication.
 * Each card shows a miniature of the template's real hero layout in its own
 * colours. "Live preview" opens the full animated demo (/templates/[slug])
 * where visitors can also try colour schemes; "Use this template" carries the
 * choice through signup.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Eye, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getTemplateImage } from "@/lib/placeholder-images";
import LayoutThumbnail, { LAYOUT_LABEL } from "@/components/invitation/LayoutThumbnail";
import { getInvitationStyle } from "@/components/invitation/styles";
import TemplateSearchInput from "@/components/invitation/TemplateSearchInput";
import { searchTemplates } from "@/lib/template-search";
import type { TemplateRow } from "@/types/database";

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTERS = ["All", ...Object.values(LAYOUT_LABEL)] as const;
type DesignFilter = (typeof FILTERS)[number];

const SPRING = { type: "spring", damping: 25, stiffness: 120 } as const;
const DEFAULT_COLORS = { primary: "#B8860B", secondary: "#FFFFF0", accent: "#D4A574" };
const DEFAULT_FONTS = { display: "Playfair Display", body: "Lato" };

/** Label for a template's design family (Floral, Classic, Modern…). */
function designLabel(slug: string): string {
  return LAYOUT_LABEL[getInvitationStyle(slug).hero];
}

/** One Google Fonts stylesheet covering every template's display font + the script accent. */
function galleryFontsUrl(templates: TemplateRow[]): string {
  const families = new Set<string>(["Great Vibes"]);
  templates.forEach((t) => t.default_config?.fonts?.display && families.add(t.default_config.fonts.display));
  const query = Array.from(families)
    .filter((f) => /^[\w\s-]{1,60}$/.test(f))
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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
          <div className="h-9 flex-1 rounded-lg bg-dearly-border" />
          <div className="h-9 flex-1 rounded-lg bg-dearly-border" />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<DesignFilter>("All");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  /** Fetches all templates from Supabase on mount. */
  useEffect(() => {
    async function fetchTemplates() {
      const supabase = createClient();
      const { data, error } = await supabase.from("templates").select("*").order("name", { ascending: true });
      if (error) setLoadError("We couldn't load templates right now. Please refresh the page.");
      else if (data) setTemplates(data as TemplateRow[]);
      setLoading(false);
    }
    fetchTemplates();
  }, []);

  const filtered = useMemo(
    () =>
      searchTemplates(
        activeFilter === "All" ? templates : templates.filter((t) => designLabel(t.slug) === activeFilter),
        query
      ),
    [templates, activeFilter, query]
  );
  const fontsHref = useMemo(() => (templates.length ? galleryFontsUrl(templates) : null), [templates]);
  return (
    <div className="min-h-screen bg-dearly-cream overflow-x-hidden">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-dearly-cream/80 backdrop-blur-md border-b border-dearly-border/50">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-dearly-accent"
          >
            Dearly
          </Link>
          <div className="hidden items-center gap-6 md:flex">
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
          <button type="button" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg md:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-dearly-border md:hidden">
              <div className="flex flex-col gap-1 px-6 py-3 text-sm font-medium">
                {[["/templates", "Templates"], ["/login", "Sign in"], ["/signup", "Get Started"]].map(([href, label]) => (
                  <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-3 hover:bg-dearly-accent-soft">
                    {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
            {templates.length || 25} Templates · {FILTERS.length - 1} Design Styles
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-dearly-text mb-5">
            Beautiful Templates for{" "}
            <span className="text-dearly-accent">Every Style</span>
          </h1>
          <p className="text-lg text-dearly-text-secondary leading-relaxed">
            From timeless elegance to modern minimalism — browse our curated collection
            of {templates.length || 25} wedding templates and find the perfect one for your love story.
            No signup required to browse.
          </p>
        </motion.div>
      </section>

      {/* ── Filter Bar ── */}
      <section className="sticky top-16 z-40 bg-dearly-cream/90 backdrop-blur-md border-b border-dearly-border/40 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col gap-3 md:flex-row md:items-center">
        <TemplateSearchInput value={query} onChange={setQuery} className="w-full md:w-80 md:shrink-0" />
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-semibold text-dearly-text-muted shrink-0 mr-1">
            Filter:
          </span>
          {FILTERS.map((style) => (
            <button
              key={style}
              onClick={() => setActiveFilter(style)}
              aria-pressed={activeFilter === style}
              className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold transition-all ${
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
        </div>
      </section>

      {/* ── Template Grid ── */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {loadError ? (
            <p className="py-24 text-center text-dearly-text-secondary">{loadError}</p>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <TemplateCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-dearly-text-secondary">
                No templates match{query ? <> &ldquo;{query}&rdquo;</> : " this filter"}.
              </p>
              <button
                onClick={() => {
                  setActiveFilter("All");
                  setQuery("");
                }}
                className="mt-3 text-sm text-dearly-accent underline hover:no-underline"
              >
                Clear search &amp; filters
              </button>
            </div>
          ) : (
            <motion.div
              key={`${activeFilter}-${query}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
            >
              {filtered.map((template, index) => {
                const colors = template.default_config?.colors ?? DEFAULT_COLORS;
                const fonts = template.default_config?.fonts ?? DEFAULT_FONTS;
                const previewHref = `/templates/${template.slug}`;

                return (
                  <motion.article
                    key={template.id}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
                    whileHover={{ y: -4 }}
                    transition={SPRING}
                    className="group flex flex-col rounded-2xl border border-dearly-border bg-dearly-card overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                  >
                    {/* Miniature of the real hero layout — click to open the live demo */}
                    <Link href={previewHref} className="relative block h-56 overflow-hidden" aria-label={`Live preview of ${template.name}`}>
                      <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
                        <LayoutThumbnail slug={template.slug} colors={colors} fonts={fonts} photo={getTemplateImage(index)} />
                      </div>
                      <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/25 group-hover:opacity-100">
                        <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-dearly-text shadow-lg">
                          <Eye size={14} /> Live preview
                        </span>
                      </span>
                    </Link>

                    {/* Card content */}
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-base font-bold leading-tight text-dearly-text">{template.name}</h3>
                        <span className="shrink-0 rounded-full bg-dearly-accent-soft px-2 py-0.5 text-[10px] font-semibold text-dearly-accent ring-1 ring-dearly-accent/20">
                          {designLabel(template.slug)}
                        </span>
                      </div>

                      {template.description && (
                        <p className="line-clamp-2 text-xs leading-relaxed text-dearly-text-secondary">{template.description}</p>
                      )}

                      {/* Colour dots */}
                      <div className="flex items-center gap-1.5" aria-hidden>
                        {[colors.primary, colors.accent, colors.secondary].map((c) => (
                          <span key={c} className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ background: c }} />
                        ))}
                        <span className="ml-1 text-[10px] text-dearly-text-muted">+ 9 schemes</span>
                      </div>

                      {/* Actions — equal width, pinned to the bottom so rows align */}
                      <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
                        <Link
                          href={previewHref}
                          className="flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-dearly-border bg-dearly-cream px-2 text-xs font-semibold text-dearly-text-secondary transition hover:border-dearly-accent/50 hover:text-dearly-accent"
                        >
                          <Eye size={13} />
                          Preview
                        </Link>
                        <Link
                          href={`/signup?template=${encodeURIComponent(template.slug)}`}
                          className="flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-dearly-accent px-2 text-xs font-semibold text-white transition hover:opacity-90"
                        >
                          <Heart size={13} className="fill-white" />
                          Use template
                        </Link>
                      </div>
                    </div>
                  </motion.article>
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

      {fontsHref && (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link rel="stylesheet" href={fontsHref} />
      )}
    </div>
  );
}