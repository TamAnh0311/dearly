"use client";

/**
 * TemplatePicker — displays a grid of available templates.
 * Fetches from Supabase `templates` table. Highlights the active template.
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TemplateRow } from "@/types/database";

interface TemplatePickerProps {
  /** The currently selected template ID. */
  activeTemplateId: string | null;
  /** Called with the selected template ID when a card is clicked. */
  onSelect: (templateId: string) => void;
}

/** Badge colour per animation style. */
const BADGE_COLOURS: Record<TemplateRow["animation_style"], string> = {
  subtle: "bg-blue-100 text-blue-700",
  cinematic: "bg-purple-100 text-purple-700",
  interactive: "bg-amber-100 text-amber-700",
};

/**
 * Grid of template cards fetched from Supabase.
 */
export default function TemplatePicker({ activeTemplateId, onSelect }: TemplatePickerProps) {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(true);

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
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg bg-dearly-border"
          />
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <p className="text-sm text-dearly-text-secondary">No templates available.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {templates.map((template) => {
        const isActive = template.id === activeTemplateId;
        return (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`rounded-lg border-2 p-3 text-left transition ${
              isActive
                ? "border-dearly-accent bg-dearly-accent-soft"
                : "border-dearly-border bg-dearly-card hover:border-dearly-accent/50"
            }`}
          >
            <p className="text-sm font-semibold text-dearly-text">{template.name}</p>
            {template.description && (
              <p className="mt-0.5 line-clamp-2 text-xs text-dearly-text-secondary">
                {template.description}
              </p>
            )}
            <span
              className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                BADGE_COLOURS[template.animation_style]
              }`}
            >
              {template.animation_style}
            </span>
          </button>
        );
      })}
    </div>
  );
}
