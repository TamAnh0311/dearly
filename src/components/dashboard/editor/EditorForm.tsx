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
import LanguagePicker from "@/components/invitation/LanguagePicker";
import HelpTip from "@/components/dashboard/HelpTip";
import type { DressSwatch, GiftAccount, WeddingCustomization } from "@/types/database";
import MusicPicker from "./MusicPicker";

/** Section header with an optional contextual tip and guide link. */
function SectionHeading({ children, tip, guide }: { children: React.ReactNode; tip?: string; guide?: string }) {
  return (
    <div className="mb-3 flex items-center gap-1.5">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-dearly-text-secondary">{children}</h3>
      {tip && (
        <HelpTip label={typeof children === "string" ? children : "This section"} guide={guide}>
          {tip}
        </HelpTip>
      )}
    </div>
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
        music_url: wedding.music_url,
        music_track_id: wedding.music_track_id,
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
          <SectionHeading tip="Use both names for a couple, or leave the second empty for a single-host event." guide="other-occasions">Couple Info</SectionHeading>
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
          <SectionHeading tip="This date drives the countdown and add-to-calendar. Set the event timezone in Settings." guide="content-story-venue-schedule">Date &amp; Venue</SectionHeading>
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
            <Field
              label="Place line (optional)"
              value={customization.locationLabel ?? ""}
              onChange={(v) => updateCustomization({ locationLabel: v.slice(0, 80) })}
              placeholder="Da Lat · Vietnam"
            />
            <Field
              label="Date note (optional)"
              value={customization.dateNote ?? ""}
              onChange={(v) => updateCustomization({ dateNote: v.slice(0, 220) })}
              placeholder="The garden opens at 14:30. Please arrive with time to find your seat."
            />
          </div>
        </section>

        {/* ── Story ── */}
        <section>
          <SectionHeading tip="This text appears in the Our Story section. Two or three short paragraphs read best." guide="content-story-venue-schedule">Our Story</SectionHeading>
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

        {/* ── Background Music ── */}
        <section>
          <SectionHeading tip="Music starts on the guest's first tap because browsers block autoplay. A guest who pauses is remembered." guide="background-music">Background Music</SectionHeading>
          <MusicPicker
            selectedTrackId={wedding.music_track_id}
            customUrl={wedding.music_url ?? ""}
            weddingId={wedding.id}
            onSelectTrack={(trackId) => {
              updateField("music_track_id", trackId);
              if (trackId) updateField("music_url", null);
            }}
            onCustomUrl={(url) => {
              updateField("music_url", url || null);
              if (url) updateField("music_track_id", null);
            }}
          />
        </section>

        {/* ── Dress code (Storybook collection and any template with a palette) ── */}
        <section>
          <SectionHeading tip="The note and up to five labelled colour swatches appear inside the invitation." guide="content-story-venue-schedule">Dress Code</SectionHeading>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-dearly-text">What should guests wear?</label>
              <textarea
                value={customization.dressCode?.text ?? ""}
                onChange={(e) =>
                  updateCustomization({
                    dressCode: {
                      text: e.target.value.slice(0, 240),
                      colors: customization.dressCode?.colors ?? [],
                    },
                  })
                }
                rows={3}
                maxLength={240}
                placeholder="Garden formal, in the colours of a summer bouquet…"
                className="w-full resize-none rounded-lg border border-dearly-border bg-dearly-card px-3 py-2 text-sm text-dearly-text placeholder:text-dearly-text-muted focus:outline-none focus:ring-2 focus:ring-dearly-accent"
              />
            </div>
            <p className="text-xs text-dearly-text-secondary">Optional colour swatches for the palette (up to five).</p>
            <div className="grid grid-cols-1 gap-2">
              {Array.from({ length: 5 }, (_, i) => {
                const swatch: DressSwatch = customization.dressCode?.colors?.[i] ?? { label: "", hex: "#E8DFC9" };
                /** Replaces one swatch without touching the other entries. */
                const setSwatch = (patch: Partial<DressSwatch>) => {
                  const colors = Array.from({ length: 5 }, (_, j) => customization.dressCode?.colors?.[j] ?? { label: "", hex: "#E8DFC9" });
                  colors[i] = { ...swatch, ...patch };
                  updateCustomization({
                    dressCode: {
                      text: customization.dressCode?.text ?? "",
                      colors: colors.filter((c) => c.label.trim()),
                    },
                  });
                };
                return (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={/^#[0-9a-fA-F]{6}$/.test(swatch.hex) ? swatch.hex : "#E8DFC9"}
                      onChange={(e) => setSwatch({ hex: e.target.value })}
                      aria-label={`Swatch ${i + 1} colour`}
                      className="h-8 w-9 cursor-pointer rounded border border-dearly-border bg-dearly-card p-0.5"
                    />
                    <input
                      value={swatch.label}
                      onChange={(e) => setSwatch({ label: e.target.value.slice(0, 30) })}
                      placeholder={["Ivory", "Olive", "Gold", "Rose", "Sage"][i]}
                      className="flex-1 rounded-lg border border-dearly-border bg-dearly-card px-3 py-2 text-sm text-dearly-text placeholder:text-dearly-text-muted focus:outline-none focus:ring-2 focus:ring-dearly-accent"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Families & gifts (popular on Chinese / Japanese / Korean / Vietnamese invitations) ── */}
        <section>
          <SectionHeading tip="Parents' names sit under the hero. Gift details are optional and QR links must start with https." guide="customise-your-design">Families &amp; Gifts</SectionHeading>
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
            <div className="pt-2">
              <label className="mb-1 block text-xs font-medium text-dearly-text-secondary">Invitation language</label>
              <LanguagePicker
                variant="light"
                value={customization.language ?? "en"}
                onChange={(language) => updateCustomization({ language })}
              />
            </div>
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
          <SectionHeading tip="Changing the design keeps your content, guests, RSVPs and photos." guide="choose-a-template">Template</SectionHeading>
          <TemplatePicker
            activeTemplateId={wedding.template_id}
            onSelect={setTemplate}
          />
        </section>

        {/* ── Colours ── */}
        <section>
          <SectionHeading tip="Text colour is derived from the background so it stays readable on light and dark palettes." guide="customise-your-design">Colours</SectionHeading>
          <ColorPicker
            colors={customization.colors}
            onChange={(colors) => updateCustomization({ colors })}
          />
        </section>

        {/* ── Fonts ── */}
        <section>
          <SectionHeading tip="Keep script fonts for names and short accents — use a body font for paragraphs." guide="customise-your-design">Fonts</SectionHeading>
          <FontPicker
            fonts={customization.fonts}
            onChange={(fonts) => updateCustomization({ fonts })}
          />
        </section>

        {/* Sections — choose what guests see */}
        <section>
          <SectionHeading tip="A section also hides itself when it has no content, so empty blocks never appear." guide="choose-sections">Sections</SectionHeading>
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
          <SectionHeading tip="This controls how approved photos are arranged in the album." guide="photos-and-memories">Gallery Layout</SectionHeading>
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
