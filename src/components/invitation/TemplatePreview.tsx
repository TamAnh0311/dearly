"use client";

/**
 * TemplatePreview — public template demo with a live colour-scheme picker.
 * The banner lets visitors swap between the template's original palette and
 * curated schemes; the invitation re-themes instantly (layout stays the same,
 * since layout is the template's design language).
 *
 * `embedded` mode (used inside the dashboard onboarding modal) hides the
 * navigation links and reports scheme changes to the parent window via
 * `{ type: "scheme-change", id }` and `{ type: "sections-change", sections }`.
 *
 * The "Sections" button opens switches to show/hide parts of the invitation.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, LayoutList, Palette, X } from "lucide-react";
import type { ResolvedTheme } from "@/components/templates/types";
import type { GuestbookEntryRow, WeddingEventRow, WeddingRow } from "@/types/database";
import CinematicInvitation from "./CinematicInvitation";
import type { ReactionCounts } from "./sections/Blessings";
import { COLOR_SCHEMES, type ColorScheme } from "./styles";
import SectionToggles from "./SectionToggles";
import { resolveBlessingStyle, type BlessingStyle } from "./sections-config";
import type { WeddingCustomization } from "@/types/database";

interface TemplatePreviewProps {
  templateName: string;
  templateSlug: string;
  baseTheme: ResolvedTheme;
  wedding: WeddingRow;
  events: WeddingEventRow[];
  blessings: GuestbookEntryRow[];
  reactions: Partial<ReactionCounts>;
  photos: string[];
  /** Scheme id to start with (falls back to "original" if unknown). */
  initialScheme?: string;
  /** Rendered inside an iframe — hide links, notify parent of scheme changes. */
  embedded?: boolean;
  /** No banner at all (e.g. the landing-page phone demo). */
  bare?: boolean;
}

const BANNER_HEIGHT = 64;

/** Round swatch showing a scheme's background with its primary + accent. */
function Swatch({ scheme, active, onClick }: { scheme: ColorScheme; active: boolean; onClick: () => void }) {
  const { primary, secondary, accent } = scheme.colors;
  return (
    <button
      type="button"
      onClick={onClick}
      title={scheme.name}
      aria-label={`${scheme.name} colour scheme`}
      aria-pressed={active}
      className="relative h-8 w-8 shrink-0 rounded-full border-2 transition-transform hover:scale-110"
      style={{
        borderColor: active ? "#ffffff" : "rgba(255,255,255,0.35)",
        background: `conic-gradient(${primary} 0 50%, ${accent} 50% 75%, ${secondary} 75% 100%)`,
        boxShadow: active ? "0 0 0 2px rgba(0,0,0,0.35)" : undefined,
      }}
    >
      {active && (
        <motion.span layoutId="swatch-check" className="absolute inset-0 flex items-center justify-center">
          <Check size={14} color="#ffffff" strokeWidth={3} style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))" }} />
        </motion.span>
      )}
    </button>
  );
}

export default function TemplatePreview({
  templateName,
  templateSlug,
  baseTheme,
  wedding,
  events,
  blessings,
  reactions,
  photos,
  initialScheme = "original",
  embedded = false,
  bare = false,
}: TemplatePreviewProps) {
  const schemes = useMemo<ColorScheme[]>(
    () => [{ id: "original", name: `${templateName} Original`, colors: baseTheme.colors }, ...COLOR_SCHEMES],
    [templateName, baseTheme.colors]
  );
  const [schemeId, setSchemeId] = useState(() =>
    initialScheme === "original" || COLOR_SCHEMES.some((s) => s.id === initialScheme) ? initialScheme : "original"
  );

  /** Changes scheme and, when embedded, tells the parent (same origin only). */
  function chooseScheme(id: string) {
    setSchemeId(id);
    if (embedded && window.parent !== window) {
      window.parent.postMessage({ type: "scheme-change", id }, window.location.origin);
    }
  }
  const [sections, setSections] = useState<WeddingCustomization["sections"]>(wedding.customization.sections);
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [blessingStyle, setBlessingStyle] = useState<BlessingStyle>(resolveBlessingStyle(wedding.customization.blessingStyle));

  /** Notifies the embedding dashboard of the current section choices. */
  function notifyParent(next: WeddingCustomization["sections"], style: BlessingStyle) {
    if (embedded && window.parent !== window) {
      window.parent.postMessage({ type: "sections-change", sections: next, blessingStyle: style }, window.location.origin);
    }
  }

  /** Updates visible sections and, when embedded, tells the parent. */
  function chooseSections(next: WeddingCustomization["sections"]) {
    setSections(next);
    notifyParent(next, blessingStyle);
  }

  /** Switches between running-text and floating blessings. */
  function chooseBlessingStyle(style: BlessingStyle) {
    setBlessingStyle(style);
    notifyParent(sections, style);
  }
  const previewWedding = useMemo(
    () => ({ ...wedding, customization: { ...wedding.customization, sections, blessingStyle } }),
    [wedding, sections, blessingStyle]
  );
  const hiddenCount = Object.values(sections).filter((v) => v === false).length;
  const scheme = schemes.find((s) => s.id === schemeId) ?? schemes[0];
  const theme = useMemo<ResolvedTheme>(() => ({ ...baseTheme, colors: scheme.colors }), [baseTheme, scheme]);

  const bannerHeight = bare ? 0 : BANNER_HEIGHT;

  return (
    <>
      {!bare && (
      <div
        className="fixed inset-x-0 top-0 z-50 flex items-center gap-3 px-3 text-sm shadow-lg md:gap-5 md:px-5"
        style={{ height: BANNER_HEIGHT, backgroundColor: "rgba(20,18,16,0.92)", backdropFilter: "blur(10px)" }}
      >
        <div className="hidden min-w-0 shrink-0 lg:block">
          <p className="truncate font-semibold text-white">{templateName}</p>
          <p className="text-[11px] text-white/60">Live preview · demo content</p>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Palette size={16} className="hidden shrink-0 text-white/70 sm:block" aria-hidden />
          <div className="flex min-w-0 items-center gap-2 overflow-x-auto py-2 [scrollbar-width:none]" role="group" aria-label="Colour schemes">
            {schemes.map((s) => (
              <Swatch key={s.id} scheme={s} active={s.id === scheme.id} onClick={() => chooseScheme(s.id)} />
            ))}
          </div>
          <span className="hidden shrink-0 text-xs text-white/80 xl:inline">{scheme.name}</span>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setSectionsOpen((v) => !v)}
            aria-expanded={sectionsOpen}
            className="flex items-center gap-1.5 rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10"
          >
            <LayoutList size={14} />
            <span className="hidden sm:inline">Sections</span>
            {hiddenCount > 0 && <span className="rounded-full bg-white/20 px-1.5 text-[10px]">{hiddenCount} off</span>}
          </button>
          {sectionsOpen && (
            <div className="absolute right-0 top-11 w-72 rounded-xl border border-white/10 bg-[#1d1a17] p-3 shadow-2xl">
              <div className="mb-1 flex items-center justify-between px-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Show on invitation</p>
                <button type="button" onClick={() => setSectionsOpen(false)} aria-label="Close sections" className="rounded p-1 text-white/60 hover:bg-white/10">
                  <X size={14} />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                <SectionToggles sections={sections} onChange={chooseSections} variant="dark" blessingStyle={blessingStyle} onBlessingStyle={chooseBlessingStyle} />
              </div>
            </div>
          )}
        </div>

        {!embedded && (
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/templates" className="hidden rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10 sm:inline-block">
            All templates
          </Link>
          <Link
            href={`/signup?template=${encodeURIComponent(templateSlug)}&scheme=${encodeURIComponent(scheme.id)}`}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:opacity-90"
            style={{ backgroundColor: scheme.colors.primary, color: scheme.colors.secondary }}
          >
            Use this design
          </Link>
        </div>
        )}
      </div>

      )}

      {!bare && <div style={{ height: BANNER_HEIGHT }} />}

      <CinematicInvitation
        key={templateSlug}
        wedding={previewWedding}
        events={events}
        theme={theme}
        templateSlug={templateSlug}
        blessings={blessings}
        reactions={reactions}
        photos={photos}
        topOffset={bannerHeight}
        guestUploads
        demo
      />
    </>
  );
}
