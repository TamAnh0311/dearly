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
import SectionToggles from "@/components/invitation/SectionToggles";
import ColorPicker from "./ColorPicker";
import FontPicker from "./FontPicker";
import type { GiftAccount, WeddingCustomization } from "@/types/database";

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

const GALLERY_LAYOUTS: WeddingCustomization["galleryLayout"][] = [
  "masonry",
  "albums",
  "timeline",
];

/**
 * Left-panel editor form.
 */
export default function EditorForm() {
  const { wedding, updateField, updateCustomization, setTemplate } = useEditorStore();
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

        {/* ── Families & gifts (popular on Chinese / Japanese / Korean / Vietnamese invitations) ── */}
        <section>
          <SectionHeading>Families &amp; Gifts</SectionHeading>
          <div className="space-y-3">
            <Field
              label={`${wedding.partner1_name || "Partner 1"}'s family (parents)`}
              value={customization.families?.side1 ?? ""}
              onChange={(v) => updateCustomization({ families: { ...customization.families, side1: v.slice(0, 120) } })}
              placeholder="Mr. & Mrs. Nguyen"
            />
            {wedding.partner2_name?.trim() && (
              <Field
                label={`${wedding.partner2_name}'s family (parents)`}
                value={customization.families?.side2 ?? ""}
                onChange={(v) => updateCustomization({ families: { ...customization.families, side2: v.slice(0, 120) } })}
                placeholder="Mr. & Mrs. Kim"
              />
            )}
            <p className="pt-2 text-xs text-dearly-text-secondary">
              Gift details (optional): a bank account and/or a payment QR image link for guests who want to send a gift.
            </p>
            {[0, 1].map((i) => {
              const accounts = customization.gift?.accounts ?? [];
              const a = accounts[i] ?? { label: "" };
              /** Updates one field of gift account i, keeping the other account intact. */
              const set = (key: keyof GiftAccount, v: string) => {
                const next = [accounts[0] ?? { label: "" }, accounts[1] ?? { label: "" }];
                next[i] = { ...next[i], [key]: v.slice(0, key === "qrUrl" ? 500 : 80) };
                updateCustomization({ gift: { ...customization.gift, accounts: next } });
              };
              return (
                <div key={i} className="space-y-2 rounded-lg border border-dearly-border p-3">
                  <Field label={`Account ${i + 1}: whose gift box`} value={a.label} onChange={(v) => set("label", v)} placeholder={i === 0 ? "Groom's family" : "Bride's family"} />
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Bank" value={a.bank ?? ""} onChange={(v) => set("bank", v)} placeholder="Vietcombank" />
                    <Field label="Account holder" value={a.holder ?? ""} onChange={(v) => set("holder", v)} />
                  </div>
                  <Field label="Account number" value={a.number ?? ""} onChange={(v) => set("number", v)} />
                  <Field label="QR image link (https)" value={a.qrUrl ?? ""} onChange={(v) => set("qrUrl", v)} placeholder="https://…/qr.png" />
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Template ── */}
        <section>
          <SectionHeading>Template</SectionHeading>
          <TemplatePicker
            activeTemplateId={wedding.template_id}
            onSelect={setTemplate}
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

        {/* Sections — choose what guests see */}
        <section>
          <SectionHeading>Sections</SectionHeading>
          <p className="mb-2 text-xs text-dearly-text-secondary">Choose which parts of your invitation guests see.</p>
          <SectionToggles
            sections={customization.sections}
            onChange={(sections) => updateCustomization({ sections })}
            blessingStyle={customization.blessingStyle}
            onBlessingStyle={(blessingStyle) => updateCustomization({ blessingStyle })}
          />
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
