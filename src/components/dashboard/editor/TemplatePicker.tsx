"use client";

/**
 * TemplatePicker — compact design switcher for the editor sidebar.
 * Shows the current design by default; "Change" reveals a searchable list so
 * the picker does not occupy most of the panel.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, ExternalLink, Palette } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { TemplateRow } from "@/types/database";
import TemplateSearchInput from "@/components/invitation/TemplateSearchInput";
import { searchTemplates } from "@/lib/template-search";

interface TemplatePickerProps {
  /** The currently selected template ID. */
  activeTemplateId: string | null;
  /** Called with the selected template when a card is clicked. */
  onSelect: (template: TemplateRow) => void;
}

/**
 * Collapsed design summary that expands into a searchable template list.
 */
export default function TemplatePicker({ activeTemplateId, onSelect }: TemplatePickerProps) {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchTemplates() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        setTemplates(data as TemplateRow[]);
      }
      setLoading(false);
    }
    fetchTemplates();
  }, []);

  if (loading) {
    return <div className="h-16 animate-pulse rounded-xl bg-dearly-border" />;
  }

  if (templates.length === 0) {
    return <p className="text-sm text-dearly-text-secondary">No templates available.</p>;
  }

  const active = templates.find((template) => template.id === activeTemplateId) ?? null;
  const shown = searchTemplates(templates, query);

  return (
    <div className="overflow-hidden rounded-xl border border-dearly-border bg-dearly-card">
      <div className="flex items-center gap-2.5 p-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-dearly-accent-soft text-dearly-accent">
          <Palette size={16} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-dearly-text-muted">Current design</p>
          <p className="truncate text-sm font-semibold text-dearly-text">{active?.name ?? "Choose a design"}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-dearly-border px-2.5 py-1.5 text-xs font-semibold text-dearly-text-secondary transition hover:border-dearly-accent/50 hover:text-dearly-accent"
        >
          {open ? "Done" : "Change"}
          {!open && <ChevronDown size={13} aria-hidden />}
        </button>
      </div>

      {open && (
        <div className="space-y-2 border-t border-dearly-border p-2.5">
          <TemplateSearchInput value={query} onChange={setQuery} placeholder="Search designs" />

          {shown.length === 0 ? (
            <p className="py-2 text-center text-xs text-dearly-text-secondary">No templates match &ldquo;{query}&rdquo;.</p>
          ) : (
            <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
              {shown.map((template) => {
                const isActive = template.id === activeTemplateId;
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => {
                      onSelect(template);
                      setOpen(false);
                    }}
                    aria-pressed={isActive}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-left transition ${
                      isActive
                        ? "border-dearly-accent bg-dearly-accent-soft"
                        : "border-transparent hover:border-dearly-border hover:bg-dearly-cream"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-dearly-text">{template.name}</span>
                      <span className="block text-[10px] capitalize text-dearly-text-muted">{template.animation_style}</span>
                    </span>
                    {isActive && <Check size={14} className="shrink-0 text-dearly-accent" aria-hidden />}
                  </button>
                );
              })}
            </div>
          )}

          <Link
            href="/templates"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-dearly-accent hover:underline"
          >
            Browse full gallery <ExternalLink size={11} aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}
