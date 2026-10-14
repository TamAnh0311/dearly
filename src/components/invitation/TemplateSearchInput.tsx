"use client";

/**
 * TemplateSearchInput — compact search field for template pickers.
 * Pure UI: the parent filters with `searchTemplates` from @/lib/template-search.
 */

import { Search, X } from "lucide-react";

export default function TemplateSearchInput({
  value,
  onChange,
  placeholder = "Search: garden, curtain, stars…",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`relative flex items-center ${className}`}>
      <span className="sr-only">Search templates</span>
      <Search size={15} className="pointer-events-none absolute left-3 text-dearly-text-muted" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 80))}
        placeholder={placeholder}
        className="w-full rounded-full border border-dearly-border bg-dearly-card py-2 pl-9 pr-8 text-sm text-dearly-text placeholder:text-dearly-text-muted focus:border-dearly-accent focus:outline-none focus:ring-2 focus:ring-dearly-accent/20 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 rounded-full p-1 text-dearly-text-muted hover:bg-dearly-accent-soft hover:text-dearly-accent"
        >
          <X size={13} />
        </button>
      )}
    </label>
  );
}
