"use client";

/**
 * Dashboard home — landing page after login.
 * Shows a template-picker onboarding flow if no wedding exists yet,
 * or a rich overview with stats and quick links if one does.
 */

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useMyWedding } from "@/hooks/useWedding";
import { createClient } from "@/lib/supabase/client";
import type { TemplateRow } from "@/types/database";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ANIMATION_BADGE: Record<TemplateRow["animation_style"], { label: string; className: string }> = {
  subtle: { label: "Subtle", className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
  cinematic: { label: "Cinematic", className: "bg-purple-50 text-purple-700 ring-1 ring-purple-200" },
  interactive: { label: "Interactive", className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
};

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

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Renders a mini color-scheme mockup for a template using its actual brand colors.
 */
function TemplateColorPreview({ colors }: { colors: { primary: string; secondary: string; accent: string } }) {
  return (
    <div
      className="relative h-28 w-full overflow-hidden rounded-xl"
      style={{ background: colors.primary }}
    >
      {/* Decorative background blob */}
      <div
        className="absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-40"
        style={{ background: colors.secondary }}
      />
      {/* Simulated header bar */}
      <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 px-3 py-2">
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: colors.accent }} />
        <div className="h-1 w-10 rounded-full opacity-60" style={{ background: colors.accent }} />
      </div>
      {/* Simulated hero text lines */}
      <div className="absolute inset-x-0 top-8 flex flex-col items-center gap-1.5 px-4">
        <div className="h-2 w-24 rounded-full opacity-80" style={{ background: colors.accent }} />
        <div className="h-1.5 w-16 rounded-full opacity-50" style={{ background: colors.accent }} />
      </div>
      {/* Simulated accent button */}
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 h-4 w-14 rounded-full"
        style={{ background: colors.accent }}
      />
      {/* Secondary color swatch strip at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-1.5 opacity-70"
        style={{ background: colors.secondary }}
      />
    </div>
  );
}

/**
 * Skeleton loader for template cards during the Supabase fetch.
 */
function TemplateCardSkeleton() {
  return (
    <div className="rounded-2xl border border-dearly-border bg-dearly-card p-4 space-y-3 animate-pulse">
      <div className="h-28 w-full rounded-xl bg-dearly-border" />
      <div className="h-3 w-2/3 rounded-full bg-dearly-border" />
      <div className="h-2.5 w-full rounded-full bg-dearly-border" />
      <div className="h-2.5 w-4/5 rounded-full bg-dearly-border" />
      <div className="h-5 w-16 rounded-full bg-dearly-border" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const { wedding, loading: weddingLoading, createWedding, saveWedding } = useMyWedding();
  const router = useRouter();

  // Template picker state
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

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
      if (!error && data) setTemplates(data as TemplateRow[]);
      setTemplatesLoading(false);
    }
    fetchTemplates();
  }, []);

  /** Auto-generates a URL slug from partner names. */
  useEffect(() => {
    if (slugEdited) return;
    if (!partner1 && !partner2) { setSlug(""); return; }
    const p1 = partner1.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const p2 = partner2.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (p1 && p2) setSlug(`${p1}-and-${p2}`);
    else setSlug(p1 || p2);
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
    if (!partner2.trim()) { setSubmitError("Partner 2 name is required."); return; }
    if (!slug.trim()) { setSubmitError("A URL slug is required."); return; }

    setSubmitting(true);
    try {
      await createWedding(selectedTemplateId, slug.trim());
      await saveWedding({
        partner1_name: partner1.trim(),
        partner2_name: partner2.trim(),
        wedding_date: weddingDate || null,
      });
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
          className="grid grid-cols-3 gap-4"
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
          Choose Your Template
        </h1>
        <p className="mt-2 text-dearly-text-secondary">
          Pick a design that matches your style — you can customise everything later.
        </p>
      </motion.div>

      {/* Template Grid */}
      {templatesLoading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => <TemplateCardSkeleton key={i} />)}
        </div>
      ) : templates.length === 0 ? (
        <p className="text-center text-sm text-dearly-text-secondary">
          No templates found. Please contact support.
        </p>
      ) : (
        <motion.div
          className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {templates.map((template) => {
            const isSelected = template.id === selectedTemplateId;
            const colors = template.default_config?.colors ?? {
              primary: "#f5f0eb",
              secondary: "#e8d8c4",
              accent: "#b08060",
            };
            const badge = ANIMATION_BADGE[template.animation_style];

            return (
              <motion.button
                key={template.id}
                onClick={() => setSelectedTemplateId(template.id)}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                }}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className={`relative flex flex-col overflow-hidden rounded-2xl border-2 bg-dearly-card p-4 text-left shadow-card transition focus:outline-none ${
                  isSelected
                    ? "border-dearly-accent shadow-card-hover"
                    : "border-dearly-border hover:border-dearly-accent/40 hover:shadow-card-hover"
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
                      className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-dearly-accent"
                    >
                      <CheckCircle2 size={14} className="text-white" strokeWidth={2.5} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Color preview mockup */}
                <TemplateColorPreview colors={colors} />

                {/* Template info */}
                <div className="mt-3 flex flex-col gap-1">
                  <p className="text-sm font-bold text-dearly-text leading-tight">{template.name}</p>
                  {template.description && (
                    <p className="line-clamp-2 text-xs text-dearly-text-secondary leading-relaxed">
                      {template.description}
                    </p>
                  )}
                  <span className={`mt-1 self-start rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
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
                    {selectedTemplate.name} selected
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
                  Just a few details to set up your wedding site.
                </p>
              </div>

              {/* Partner names */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dearly-text" htmlFor="partner1">
                    Partner 1 Name <span className="text-dearly-rose">*</span>
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
                    Partner 2 Name <span className="text-dearly-rose">*</span>
                  </label>
                  <input
                    id="partner2"
                    type="text"
                    required
                    value={partner2}
                    onChange={(e) => setPartner2(e.target.value)}
                    placeholder="e.g. James"
                    className="rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-muted outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition"
                  />
                </div>
              </div>

              {/* Wedding date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-dearly-text" htmlFor="wedding-date">
                  Wedding Date <span className="text-dearly-text-muted font-normal">(optional)</span>
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
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
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
                {submitting ? "Creating your site…" : "Create Wedding Site"}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
