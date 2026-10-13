"use client";

/**
 * EditorForm — left panel of the hybrid editor.
 * Provides sections for couple info, date/venue, story, template,
 * colours, fonts, section toggles, and gallery layout.
 * State is managed via useEditorStore with a 500 ms debounced save.
 */

import { useEffect, useRef } from "react";
import { useEditorStore } from "@/store/editorStore";
import { useMyWedding } from "@/hooks/useWedding";
import TemplatePicker from "./TemplatePicker";
import ColorPicker from "./ColorPicker";
import FontPicker from "./FontPicker";
import type { WeddingCustomization } from "@/types/database";

/** Section header used throughout the form. */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-dearly-text-secondary">
      {children}
    </h3>
  );
}

/** Labelled text input. */
function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-dearly-text">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-dearly-border bg-dearly-card px-3 py-2 text-sm text-dearly-text placeholder:text-dearly-text-muted focus:outline-none focus:ring-2 focus:ring-dearly-accent"
      />
    </div>
  );
}

const SECTION_KEYS: (keyof WeddingCustomization["sections"])[] = [
  "timeline",
  "gallery",
  "guestbook",
];

const GALLERY_LAYOUTS: WeddingCustomization["galleryLayout"][] = [
  "masonry",
  "albums",
  "timeline",
];

/**
 * Left-panel editor form.
 */
export default function EditorForm() {
  const { wedding, updateField, updateCustomization } = useEditorStore();
  const { saveWedding } = useMyWedding();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Schedules a debounced save (500 ms) whenever wedding data changes. */
  useEffect(() => {
    if (!wedding) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveWedding({
        partner1_name: wedding.partner1_name,
        partner2_name: wedding.partner2_name,
        wedding_date: wedding.wedding_date,
        venue_name: wedding.venue_name,
        venue_address: wedding.venue_address,
        story_text: wedding.story_text,
        template_id: wedding.template_id,
        customization: wedding.customization,
      }).catch(() => {
        // Non-fatal — next save attempt will retry.
      });
    }, 500);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wedding]);

  if (!wedding) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-dearly-text-secondary">Loading editor…</p>
      </div>
    );
  }

  const customization = wedding.customization ?? {
    colors: {},
    fonts: {},
    sections: { timeline: true, gallery: true, guestbook: true },
    galleryLayout: "masonry",
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="space-y-6 p-5">
        {/* ── Couple Info ── */}
        <section>
          <SectionHeading>Couple Info</SectionHeading>
          <div className="space-y-3">
            <Field
              label="Partner 1 Name"
              value={wedding.partner1_name ?? ""}
              onChange={(v) => updateField("partner1_name", v)}
              placeholder="Alex"
            />
            <Field
              label="Partner 2 Name"
              value={wedding.partner2_name ?? ""}
              onChange={(v) => updateField("partner2_name", v)}
              placeholder="Jordan"
            />
          </div>
        </section>

        {/* ── Date & Venue ── */}
        <section>
          <SectionHeading>Date &amp; Venue</SectionHeading>
          <div className="space-y-3">
            <Field
              label="Wedding Date"
              type="date"
              value={wedding.wedding_date ?? ""}
              onChange={(v) => updateField("wedding_date", v || null)}
            />
            <Field
              label="Venue Name"
              value={wedding.venue_name ?? ""}
              onChange={(v) => updateField("venue_name", v || null)}
              placeholder="The Grand Estate"
            />
            <Field
              label="Venue Address"
              value={wedding.venue_address ?? ""}
              onChange={(v) => updateField("venue_address", v || null)}
              placeholder="123 Garden Lane, Napa, CA"
            />
          </div>
        </section>

        {/* ── Story ── */}
        <section>
          <SectionHeading>Our Story</SectionHeading>
          <div className="space-y-1">
            <label className="text-xs font-medium text-dearly-text">Story Text</label>
            <textarea
              value={wedding.story_text ?? ""}
              onChange={(e) => updateField("story_text", e.target.value || null)}
              rows={4}
              placeholder="Tell your story…"
              className="w-full resize-none rounded-lg border border-dearly-border bg-dearly-card px-3 py-2 text-sm text-dearly-text placeholder:text-dearly-text-muted focus:outline-none focus:ring-2 focus:ring-dearly-accent"
            />
          </div>
        </section>

        {/* ── Template ── */}
        <section>
          <SectionHeading>Template</SectionHeading>
          <TemplatePicker
            activeTemplateId={wedding.template_id}
            onSelect={(id) => updateField("template_id", id)}
          />
        </section>

        {/* ── Colours ── */}
        <section>
          <SectionHeading>Colours</SectionHeading>
          <ColorPicker
            colors={customization.colors}
            onChange={(colors) => updateCustomization({ colors })}
          />
        </section>

        {/* ── Fonts ── */}
        <section>
          <SectionHeading>Fonts</SectionHeading>
          <FontPicker
            fonts={customization.fonts}
            onChange={(fonts) => updateCustomization({ fonts })}
          />
        </section>

        {/* ── Sections ── */}
        <section>
          <SectionHeading>Sections</SectionHeading>
          <div className="space-y-2">
            {SECTION_KEYS.map((key) => (
              <label key={key} className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={customization.sections[key] ?? true}
                  onChange={(e) =>
                    updateCustomization({
                      sections: { ...customization.sections, [key]: e.target.checked },
                    })
                  }
                  className="h-4 w-4 accent-dearly-accent"
                />
                <span className="text-sm capitalize text-dearly-text">{key}</span>
              </label>
            ))}
          </div>
        </section>

        {/* ── Gallery Layout ── */}
        <section>
          <SectionHeading>Gallery Layout</SectionHeading>
          <div className="space-y-2">
            {GALLERY_LAYOUTS.map((layout) => (
              <label key={layout} className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="galleryLayout"
                  value={layout}
                  checked={customization.galleryLayout === layout}
                  onChange={() => updateCustomization({ galleryLayout: layout })}
                  className="accent-dearly-accent"
                />
                <span className="text-sm capitalize text-dearly-text">{layout}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
