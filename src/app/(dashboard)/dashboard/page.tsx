"use client";

/**
 * Dashboard home — landing page after login.
 * Shows a template-picker onboarding flow if no wedding exists yet,
 * or a rich overview with stats and quick links if one does.
 *
 * Onboarding: each template card shows a miniature of its real hero layout;
 * "Preview" opens the full animated demo (with colour-scheme picker) in a
 * modal; the chosen template + scheme are saved in one insert.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Palette,
  Image,
  MessageSquare,
  Clock,
  ExternalLink,
  Globe,
  Heart,
  CalendarDays,
  Link as LinkIcon,
  ChevronRight,
  Sparkles,
  Eye,
  X,
} from "lucide-react";
import { useMyWedding } from "@/hooks/useWedding";
import { createClient } from "@/lib/supabase/client";
import { getTemplateImage } from "@/lib/placeholder-images";
import { clearPendingDesign, readPendingDesign, schemeColors } from "@/lib/pending-design";
import LayoutThumbnail, { LAYOUT_LABEL } from "@/components/invitation/LayoutThumbnail";
import { COLOR_SCHEMES, getInvitationStyle } from "@/components/invitation/styles";
import { resolveBlessingStyle, sanitizeSections, type BlessingStyle } from "@/components/invitation/sections-config";
import TemplateSearchInput from "@/components/invitation/TemplateSearchInput";
import { searchTemplates } from "@/lib/template-search";
import { EVENT_COPY, EVENT_TYPE_ORDER } from "@/lib/event-types";
import { isReservedSlug } from "@/lib/reserved-slugs";
import { PLANS_ENABLED } from "@/lib/plans";
import type { EventType, TemplateRow, WeddingCustomization } from "@/types/database";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const QUICK_LINKS = [
  {
    href: "/dashboard/editor",
    label: "Editor",
    description: "Customise your wedding site design",
    Icon: Palette,
    colour: "from-rose-50 to-pink-50 text-rose-600 border-rose-100",
    iconBg: "bg-rose-100",
  },
  {
    href: "/dashboard/gallery",
    label: "Gallery",
    description: "Manage photos and guest uploads",
    Icon: Image,
    colour: "from-purple-50 to-violet-50 text-purple-600 border-purple-100",
    iconBg: "bg-purple-100",
  },
  {
    href: "/dashboard/guestbook",
    label: "Guest Book",
    description: "Read and manage guest messages",
    Icon: MessageSquare,
    colour: "from-emerald-50 to-teal-50 text-emerald-600 border-emerald-100",
    iconBg: "bg-emerald-100",
  },
  {
    href: "/dashboard/timeline",
    label: "Timeline",
    description: "Plan your wedding day schedule",
    Icon: Clock,
    colour: "from-amber-50 to-yellow-50 text-amber-600 border-amber-100",
    iconBg: "bg-amber-100",
  },
];

const DEFAULT_COLORS = { primary: "#B8860B", secondary: "#FFFFF0", accent: "#D4A574" };
const DEFAULT_FONTS = { display: "Playfair Display", body: "Lato" };

/** Display name for a scheme id ("original" → template name). */
function schemeName(id: string, templateName: string): string {
  return id === "original" ? `${templateName} Original` : COLOR_SCHEMES.find((s) => s.id === id)?.name ?? id;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Skeleton loader for template cards during the Supabase fetch.
 */
function TemplateCardSkeleton() {
  return (
    <div className="rounded-2xl border border-dearly-border bg-dearly-card p-3 space-y-3 animate-pulse">
      <div className="h-36 w-full rounded-xl bg-dearly-border" />
      <div className="h-3 w-2/3 rounded-full bg-dearly-border" />
      <div className="h-2.5 w-full rounded-full bg-dearly-border" />
      <div className="flex gap-2">
        <div className="h-8 flex-1 rounded-lg bg-dearly-border" />
        <div className="h-8 flex-1 rounded-lg bg-dearly-border" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Template Preview Modal
// ---------------------------------------------------------------------------

/**
 * Full-screen modal embedding the real animated template demo
 * (/templates/[slug]?embed=1). The embedded page reports colour-scheme
 * changes via postMessage so "Use this design" can keep the choice.
 */
function TemplatePreviewModal({
  template,
  initialScheme,
  onClose,
  onSelect,
}: {
  template: TemplateRow;
  initialScheme: string;
  onClose: () => void;
  onSelect: (schemeId: string, sections: WeddingCustomization["sections"] | null, blessingStyle: BlessingStyle | null) => void;
}) {
  const [schemeId, setSchemeId] = useState(initialScheme);
  const [sections, setSections] = useState<WeddingCustomization["sections"] | null>(null);
  const [blessingStyle, setBlessingStyle] = useState<BlessingStyle | null>(null);
  const [loaded, setLoaded] = useState(false);
  const src = useRef(`/templates/${encodeURIComponent(template.slug)}?embed=1&scheme=${encodeURIComponent(initialScheme)}`);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    /** Picks up scheme changes from the embedded preview (same origin only). */
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "scheme-change" && typeof e.data.id === "string") setSchemeId(e.data.id);
      if (e.data?.type === "sections-change") {
        const clean = sanitizeSections(e.data.sections);
        if (clean) setSections(clean);
        if (e.data.blessingStyle) setBlessingStyle(resolveBlessingStyle(e.data.blessingStyle));
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("message", onMessage);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("message", onMessage);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${template.name} preview`}
    >
      <motion.div
        className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        initial={{ scale: 0.94, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex-1 bg-dearly-cream">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-dearly-accent border-t-transparent" />
            </div>
          )}
          <iframe
            src={src.current}
            title={`${template.name} live preview`}
            className="h-full w-full border-0"
            onLoad={() => setLoaded(true)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-white px-5 py-3">
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-dearly-text">{template.name}</p>
            <p className="text-xs text-dearly-text-secondary">
              Colours: <span className="font-semibold">{schemeName(schemeId, template.name)}</span> · change colours and sections in the bar above
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-dearly-border px-4 py-2 text-sm font-semibold text-dearly-text-secondary transition hover:bg-dearly-cream"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onSelect(schemeId, sections, blessingStyle)}
              className="rounded-lg bg-dearly-accent px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Use this design
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1.5 text-gray-600 shadow backdrop-blur-sm transition hover:bg-white hover:text-gray-900"
        >
          <X size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const { wedding, loading: weddingLoading, createWedding } = useMyWedding();
  const router = useRouter();

  // Template picker state
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templateQuery, setTemplateQuery] = useState("");
  const [eventType, setEventType] = useState<EventType>("wedding");
  const [eventTitle, setEventTitle] = useState("");
  const copy = EVENT_COPY[eventType];
  /** Couples need both names; birthdays/parties/social events can have a single host. */
  const twoHostsRequired = eventType === "wedding" || eventType === "engagement" || eventType === "anniversary";
  const [selectedScheme, setSelectedScheme] = useState("original");
  const [selectedSections, setSelectedSections] = useState<WeddingCustomization["sections"] | null>(null);
  const [selectedBlessingStyle, setSelectedBlessingStyle] = useState<BlessingStyle | null>(null);

  const [previewTemplate, setPreviewTemplate] = useState<TemplateRow | null>(null);
  const closePreview = useCallback(() => setPreviewTemplate(null), []);

  // Onboarding form state
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Dashboard stats state
  const [stats, setStats] = useState({ photos: 0, guestbookEntries: 0, timelineEvents: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  /** Fetches all templates from Supabase on mount. */
  useEffect(() => {
    async function fetchTemplates() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .order("name", { ascending: true });
      if (!error && data) {
        const list = data as TemplateRow[];
        setTemplates(list);
        // Pre-select a design chosen on the public gallery before signup.
        const pending = readPendingDesign();
        if (pending?.event && pending.event in EVENT_COPY) setEventType(pending.event as EventType);
        const match = pending && list.find((t) => t.slug === pending.template);
        if (match) {
          setSelectedTemplateId(match.id);
          setSelectedScheme(pending.scheme ?? "original");
        }
      }
      setTemplatesLoading(false);
    }
    fetchTemplates();
  }, []);

  /** Auto-generates a URL slug from partner names. */
  useEffect(() => {
    if (slugEdited) return;
    if (!partner1 && !partner2) { setSlug(""); return; }
    const p1 = partner1.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const p2 = partner2.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (p1 && p2) setSlug(`${p1}-and-${p2}`);
    else if (p1 || p2) setSlug(p1 || p2);
    else setSlug(`wedding-${Math.random().toString(36).slice(2, 8)}`);
  }, [partner1, partner2, slugEdited]);

  /** Fetches photo, guestbook, and timeline counts when a wedding exists. */
  useEffect(() => {
    if (!wedding) return;
    async function fetchStats() {
      const supabase = createClient();
      const [photosRes, guestbookRes, eventsRes] = await Promise.all([
        supabase
          .from("gallery_photos")
          .select("id", { count: "exact", head: true })
          .eq("wedding_id", wedding!.id)
          .eq("status", "approved"),
        supabase
          .from("guestbook_entries")
          .select("id", { count: "exact", head: true })
          .eq("wedding_id", wedding!.id),
        supabase
          .from("wedding_events")
          .select("id", { count: "exact", head: true })
          .eq("wedding_id", wedding!.id),
      ]);
      setStats({
        photos: photosRes.count ?? 0,
        guestbookEntries: guestbookRes.count ?? 0,
        timelineEvents: eventsRes.count ?? 0,
      });
      setStatsLoading(false);
    }
    fetchStats();
  }, [wedding]);

  /**
   * Handles the "Create Wedding Site" form submission.
   * Validates required fields, creates the wedding record, then saves partner names and date.
   */
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedTemplateId) { setSubmitError("Please select a template first."); return; }
    if (!partner1.trim()) { setSubmitError("Partner 1 name is required."); return; }
    if (copy.hostLabel[1] && twoHostsRequired && !partner2.trim()) { setSubmitError(`${copy.hostLabel[1]} is required.`); return; }
    if (!slug.trim()) { setSubmitError("A URL slug is required."); return; }
    if (slug.trim().length < 3) { setSubmitError("URL slug must be at least 3 characters."); return; }
    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug.trim())) { setSubmitError("Slug must start and end with a letter or number."); return; }
    if (isReservedSlug(slug)) { setSubmitError(`"${slug.trim()}" is used by a Dearly page — try adding your names or a date.`); return; }

    setSubmitting(true);
    try {
      const colors = schemeColors(selectedScheme);
      const customization: WeddingCustomization | undefined =
        colors || selectedSections || selectedBlessingStyle
          ? {
              colors: colors ?? {},
              fonts: {},
              sections: selectedSections ?? { timeline: true, gallery: true, guestbook: true },
              galleryLayout: "masonry",
              ...(selectedBlessingStyle ? { blessingStyle: selectedBlessingStyle } : {}),
            }
          : undefined;
      await createWedding(selectedTemplateId, slug.trim(), {
        partner1_name: partner1.trim(),
        partner2_name: partner2.trim(),
        wedding_date: weddingDate || null,
        event_type: eventType,
        event_title: eventTitle.trim() || null,
        ...(customization ? { customization } : {}),
      });
      clearPendingDesign();
      router.push("/dashboard/editor");
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Render: Loading
  // ---------------------------------------------------------------------------

  if (weddingLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="h-8 w-8 rounded-full border-2 border-dearly-accent border-t-transparent"
          />
          <p className="text-sm text-dearly-text-secondary">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Dashboard Overview (wedding exists)
  // ---------------------------------------------------------------------------

  if (wedding) {
    const formattedDate = wedding.wedding_date
      ? new Date(wedding.wedding_date).toLocaleDateString("en-AU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

    return (
      <div className="mx-auto max-w-4xl space-y-8 pb-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display text-3xl font-bold text-dearly-text">
            Welcome back
          </h1>
          <p className="mt-1 text-dearly-text-secondary">
            Here&apos;s an overview of your wedding site.
          </p>
        </motion.div>

        {/* Couple Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="relative overflow-hidden rounded-2.5xl border border-dearly-border bg-dearly-card shadow-card px-6 py-5"
        >
          {/* Decorative gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-dearly-rose-soft/30 via-transparent to-dearly-gold-soft/20" />

          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-dearly-rose fill-dearly-rose" />
                <p className="font-display text-xl font-bold text-dearly-text">
                  {wedding.partner1_name} &amp; {wedding.partner2_name}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-dearly-text-secondary">
                {formattedDate && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    {formattedDate}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Palette size={14} />
                  {wedding.template?.name ?? "Custom"}
                </span>
                <span className="flex items-center gap-1.5">
                  <LinkIcon size={14} />
                  <span className="font-mono text-xs">{wedding.slug}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  wedding.is_published
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-amber-50 text-amber-700 ring-amber-200"
                }`}
              >
                {wedding.is_published ? "Published" : "Draft"}
              </span>

              <a
                href={`/${wedding.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-dearly-accent px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
              >
                <Globe size={14} />
                View Site
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            { label: "Photos", value: statsLoading ? "—" : stats.photos, Icon: Image },
            { label: "Messages", value: statsLoading ? "—" : stats.guestbookEntries, Icon: MessageSquare },
            { label: "Events", value: statsLoading ? "—" : stats.timelineEvents, Icon: Clock },
          ].map(({ label, value, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-dearly-border bg-dearly-card px-5 py-4 shadow-card"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dearly-accent-soft">
                <Icon size={18} className="text-dearly-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-dearly-text">{value}</p>
                <p className="text-xs text-dearly-text-secondary">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick Links Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
        >
          <h2 className="mb-3 text-sm font-semibold text-dearly-text">Quick Links</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {QUICK_LINKS.map(({ href, label, description, Icon, colour, iconBg }) => (
              <motion.a
                key={href}
                href={href}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`flex flex-col gap-3 rounded-2xl border bg-gradient-to-br p-4 shadow-card transition ${colour}`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="mt-0.5 text-xs opacity-70">{description}</p>
                </div>
                <ChevronRight size={14} className="self-end opacity-50" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Big preview CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.32 }}
        >
          <a
            href={`/${wedding.slug}`}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-center gap-3 rounded-2xl border border-dearly-border bg-dearly-card px-6 py-4 shadow-card transition hover:shadow-card-hover"
          >
            <Globe size={18} className="text-dearly-accent" />
            <span className="font-medium text-dearly-text group-hover:text-dearly-accent transition">
              View Your Wedding Site
            </span>
            <ExternalLink size={14} className="text-dearly-text-muted group-hover:text-dearly-accent transition" />
          </a>
        </motion.div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Onboarding (no wedding yet)
  // ---------------------------------------------------------------------------

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) ?? null;
  const forType = templates.filter((t) => (t.event_types ?? ["wedding", "engagement", "anniversary"]).includes(eventType));
  const shownTemplates = searchTemplates(forType.length > 0 ? forType : templates, templateQuery);

  return (
    <div className="mx-auto max-w-5xl pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-8 text-center"
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-dearly-accent-soft px-3 py-1 text-xs font-medium text-dearly-accent">
          <Sparkles size={12} />
          Let&apos;s get started
        </div>
        <h1 className="font-display text-4xl font-bold text-dearly-text">
          {eventType === "wedding" ? "Let\u2019s create your wedding invitation" : `Let\u2019s create your ${copy.label.toLowerCase()} invitation`}
        </h1>
        <p className="mt-2 text-dearly-text-secondary">
          Pick a design — you can customise everything later.
        </p>
        {/* Weddings are the flagship; other occasions are a quieter secondary row. */}
        <div className="mx-auto mt-6 flex max-w-3xl flex-col items-center gap-3" role="radiogroup" aria-label="Event type">
          <button
            type="button"
            role="radio"
            aria-checked={eventType === "wedding"}
            onClick={() => {
              setEventType("wedding");
              setSelectedTemplateId(null);
            }}
            className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-semibold transition ${
              eventType === "wedding" ? "bg-dearly-accent text-white shadow-soft" : "border-2 border-dearly-accent/40 bg-dearly-card text-dearly-accent hover:border-dearly-accent"
            }`}
          >
            <Heart size={16} /> Wedding
          </button>
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="mr-1 text-dearly-text-muted">Planning something else?</span>
            {EVENT_TYPE_ORDER.filter((t) => t !== "wedding").map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={eventType === t}
                onClick={() => {
                  setEventType(t);
                  setSelectedTemplateId(null);
                }}
                className={`rounded-full px-3 py-1 font-medium transition ${
                  eventType === t ? "bg-dearly-text text-white" : "text-dearly-text-secondary hover:bg-dearly-accent-soft hover:text-dearly-accent"
                }`}
              >
                {EVENT_COPY[t].label}
              </button>
            ))}
            <a href="/dashboard/questions" className="rounded-full px-3 py-1 font-medium text-dearly-rose hover:bg-dearly-rose-soft">
              Ask card →
            </a>
          </div>
        </div>
        <TemplateSearchInput value={templateQuery} onChange={setTemplateQuery} className="mx-auto mt-6 max-w-md" />
      </motion.div>

      {/* Template Grid */}
      {templatesLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 10 }).map((_, i) => <TemplateCardSkeleton key={i} />)}
        </div>
      ) : templates.length === 0 ? (
        <p className="text-center text-sm text-dearly-text-secondary">
          No templates found. Please contact support.
        </p>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {shownTemplates.map((template, index) => {
            const isSelected = template.id === selectedTemplateId;
            const colors = template.default_config?.colors ?? DEFAULT_COLORS;
            const fonts = template.default_config?.fonts ?? DEFAULT_FONTS;
            const label = LAYOUT_LABEL[getInvitationStyle(template.slug).hero];

            return (
              <motion.div
                key={template.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                }}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className={`relative flex flex-col overflow-hidden rounded-2xl border-2 bg-dearly-card shadow-card transition ${
                  isSelected ? "border-dearly-accent shadow-card-hover" : "border-dearly-border hover:border-dearly-accent/40 hover:shadow-card-hover"
                }`}
              >
                {/* Selected checkmark badge */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="pointer-events-none absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-dearly-accent"
                    >
                      <CheckCircle2 size={14} className="text-white" strokeWidth={2.5} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Thumbnail — click to select */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTemplateId(template.id);
                    setSelectedScheme("original");
                  }}
                  aria-pressed={isSelected}
                  aria-label={`Select ${template.name}`}
                  className="block h-36 w-full overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dearly-accent"
                >
                  <LayoutThumbnail slug={template.slug} colors={colors} fonts={fonts} photo={getTemplateImage(index)} />
                </button>

                <div className="flex flex-1 flex-col gap-1 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold leading-tight text-dearly-text">{template.name}</p>
                    <span className="flex shrink-0 items-center gap-1">
                      {PLANS_ENABLED && template.is_premium && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800" title="Premium design">Premium</span>
                      )}
                      <span className="rounded-full bg-dearly-accent-soft px-2 py-0.5 text-[10px] font-semibold text-dearly-accent">{label}</span>
                    </span>
                  </div>
                  {template.description && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-dearly-text-secondary">{template.description}</p>
                  )}

                  {/* Actions — siblings, not nested buttons */}
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(template)}
                      className="flex h-8 items-center justify-center gap-1 rounded-lg border border-dearly-border text-xs font-semibold text-dearly-text-secondary transition hover:border-dearly-accent/50 hover:text-dearly-accent"
                    >
                      <Eye size={12} />
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTemplateId(template.id);
                        setSelectedScheme("original");
                      }}
                      className={`flex h-8 items-center justify-center rounded-lg text-xs font-semibold transition ${
                        isSelected ? "bg-dearly-accent text-white" : "bg-dearly-accent-soft text-dearly-accent hover:bg-dearly-accent hover:text-white"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}        </motion.div>
      )}

      {!templatesLoading && templates.length > 0 && shownTemplates.length === 0 && (
        <p className="mt-6 text-center text-sm text-dearly-text-secondary">
          No templates match &ldquo;{templateQuery}&rdquo;. Try &ldquo;garden&rdquo;, &ldquo;gold&rdquo; or &ldquo;stars&rdquo;.
        </p>
      )}

      {/* Step 2: Basic Info Form — slides in when a template is selected */}
      <AnimatePresence>
        {selectedTemplateId && (
          <motion.div
            key="basic-info-form"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="mt-10"
          >
            {/* Divider with label */}
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-dearly-border" />
              <div className="flex items-center gap-2 rounded-full border border-dearly-border bg-dearly-card px-3 py-1 text-xs text-dearly-text-secondary">
                {selectedTemplate && (
                  <>
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: selectedTemplate.default_config?.colors?.accent ?? "#b08060" }}
                    />
                    {selectedTemplate.name} · {schemeName(selectedScheme, selectedTemplate.name)}
                  </>
                )}
              </div>
              <div className="h-px flex-1 bg-dearly-border" />
            </div>

            <form
              onSubmit={handleCreate}
              className="mx-auto max-w-xl rounded-2.5xl border border-dearly-border bg-dearly-card p-6 shadow-card space-y-5"
            >
              <div>
                <h2 className="font-display text-xl font-bold text-dearly-text">Tell us about you</h2>
                <p className="mt-1 text-sm text-dearly-text-secondary">
                  Just a few details to set up your {copy.label.toLowerCase()} page.
                </p>
              </div>

              {/* Partner names */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dearly-text" htmlFor="partner1">
                    {copy.hostLabel[0]} <span className="text-dearly-rose">*</span>
                  </label>
                  <input
                    id="partner1"
                    type="text"
                    required
                    value={partner1}
                    onChange={(e) => setPartner1(e.target.value)}
                    placeholder="e.g. Emma"
                    className="rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-muted outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dearly-text" htmlFor="partner2">
                    {copy.hostLabel[1] ?? "Second name (optional)"} {twoHostsRequired && <span className="text-dearly-rose">*</span>}
                  </label>
                  <input
                    id="partner2"
                    type="text"
                    required={twoHostsRequired}
                    value={partner2}
                    onChange={(e) => setPartner2(e.target.value)}
                    placeholder="e.g. James"
                    className="rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-muted outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition"
                  />
                </div>
              </div>

              {/* Event title (non-wedding events) */}
              {eventType !== "wedding" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dearly-text" htmlFor="event-title">
                    Event title <span className="font-normal text-dearly-text-muted">(optional)</span>
                  </label>
                  <input
                    id="event-title"
                    type="text"
                    maxLength={120}
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder={eventType === "birthday" ? "e.g. Emma's 30th Birthday" : "e.g. Summer Rooftop Party"}
                    className="rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-muted outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition"
                  />
                </div>
              )}

              {/* Wedding date */}              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-dearly-text" htmlFor="wedding-date">
                  {copy.label} date <span className="text-dearly-text-muted font-normal">(optional)</span>
                </label>
                <input
                  id="wedding-date"
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition"
                />
              </div>

              {/* URL Slug */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-dearly-text" htmlFor="slug">
                  Your Site URL <span className="text-dearly-rose">*</span>
                </label>
                <div className="flex items-center overflow-hidden rounded-xl border border-dearly-border bg-dearly-cream focus-within:border-dearly-accent focus-within:ring-2 focus-within:ring-dearly-accent/20 transition">
                  <span className="shrink-0 border-r border-dearly-border bg-dearly-cream px-3 py-2.5 text-xs text-dearly-text-muted select-none">
                    dearly.app/
                  </span>
                  <input
                    id="slug"
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => {
                      setSlugEdited(true);
                      setSlug(e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9-]/g, ""));
                    }}
                    placeholder="emma-and-james"
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-muted outline-none"
                  />
                </div>
                <p className="text-xs text-dearly-text-muted">Auto-generated from your names — feel free to edit.</p>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {submitError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600 ring-1 ring-red-200"
                  >
                    {submitError}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.01 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="w-full rounded-xl bg-dearly-accent py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating your page…" : `Create ${copy.label} Page`}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <TemplatePreviewModal
            template={previewTemplate}
            initialScheme={previewTemplate.id === selectedTemplateId ? selectedScheme : "original"}
            onClose={closePreview}
            onSelect={(schemeId, sections, blessingStyle) => {
              setSelectedBlessingStyle(blessingStyle);
              setSelectedTemplateId(previewTemplate.id);
              setSelectedScheme(schemeId);
              setSelectedSections(sections);
              setPreviewTemplate(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}