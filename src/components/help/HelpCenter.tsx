"use client";

/**
 * Help Center hub — searchable, category-filtered index of every guide.
 * Pure client filtering over the static data in `@/lib/guides`.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Search, X } from "lucide-react";
import { GUIDES, GUIDE_CATEGORIES, searchGuides, type GuideCategoryId } from "@/lib/guides";

type CategoryFilter = "all" | GuideCategoryId;

const CATEGORY_LABEL = Object.fromEntries(GUIDE_CATEGORIES.map((c) => [c.id, c.label])) as Record<GuideCategoryId, string>;

/** Small label showing which part of Dearly a guide belongs to. */
function CategoryBadge({ category }: { category: GuideCategoryId }) {
  return (
    <span className="rounded-full bg-dearly-accent-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-dearly-accent">
      {CATEGORY_LABEL[category]}
    </span>
  );
}

export default function HelpCenter() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const results = useMemo(() => {
    const pool = category === "all" ? GUIDES : GUIDES.filter((g) => g.category === category);
    return searchGuides(pool, query);
  }, [query, category]);

  const counts = useMemo(() => {
    const map = Object.fromEntries(GUIDE_CATEGORIES.map((c) => [c.id, 0])) as Record<GuideCategoryId, number>;
    GUIDES.forEach((g) => { map[g.category] += 1; });
    return map;
  }, []);

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <label className="relative flex items-center">
          <span className="sr-only">Search help guides</span>
          <Search size={18} className="pointer-events-none absolute left-4 text-dearly-text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value.slice(0, 80))}
            placeholder="Search: guest list, photos, publish, music…"
            className="w-full rounded-full border border-dearly-border bg-dearly-card py-3.5 pl-11 pr-11 text-sm text-dearly-text shadow-soft placeholder:text-dearly-text-muted focus:border-dearly-accent focus:outline-none focus:ring-2 focus:ring-dearly-accent/20 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 rounded-full p-1.5 text-dearly-text-muted hover:bg-dearly-accent-soft hover:text-dearly-accent"
            >
              <X size={15} />
            </button>
          )}
        </label>

        <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Guide category">
          <button
            type="button"
            role="radio"
            aria-checked={category === "all"}
            onClick={() => setCategory("all")}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              category === "all"
                ? "bg-dearly-accent text-white shadow-soft"
                : "border border-dearly-border bg-dearly-card text-dearly-text-secondary hover:border-dearly-accent/40 hover:text-dearly-accent"
            }`}
          >
            All guides ({GUIDES.length})
          </button>
          {GUIDE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={category === c.id}
              onClick={() => setCategory(c.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                category === c.id
                  ? "bg-dearly-accent text-white shadow-soft"
                  : "border border-dearly-border bg-dearly-card text-dearly-text-secondary hover:border-dearly-accent/40 hover:text-dearly-accent"
              }`}
            >
              {c.label} ({counts[c.id]})
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-dearly-text-muted" aria-live="polite">
        {results.length} guide{results.length === 1 ? "" : "s"}
        {query ? <> for &ldquo;{query}&rdquo;</> : null}
      </p>

      {results.length === 0 ? (
        <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-dearly-border bg-dearly-card/60 px-6 py-12 text-center">
          <p className="text-sm text-dearly-text-secondary">No guides match that search.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-3 text-sm font-semibold text-dearly-accent underline hover:no-underline"
          >
            Show all guides
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((guide) => (
            <Link
              key={guide.slug}
              href={`/help/${guide.slug}`}
              className="group flex flex-col rounded-2xl border border-dearly-border bg-dearly-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-dearly-accent/40 hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between gap-2">
                <CategoryBadge category={guide.category} />
                <span className="flex items-center gap-1 text-[11px] text-dearly-text-muted">
                  <Clock size={12} aria-hidden />
                  {guide.minutes} min
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold leading-snug text-dearly-text group-hover:text-dearly-accent">
                {guide.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-dearly-text-secondary">{guide.summary}</p>
              <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-dearly-accent">
                Read the guide
                <ArrowRight size={13} className="transition group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
