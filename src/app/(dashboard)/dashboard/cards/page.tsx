"use client";

/**
 * Dashboard card creator page.
 * Allows users to browse card templates, create cards with a form,
 * preview them live, publish, and manage previously created cards.
 */

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Cake,
  CalendarDays,
  Heart,
  Snowflake,
  Eye,
  ExternalLink,
  Trash2,
  Copy,
  Check,
  Plus,
  ChevronLeft,
  Globe,
  MapPin,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { CardTemplateRow, CardRow } from "@/types/database";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SPRING = { type: "spring", damping: 25, stiffness: 120 } as const;

type Category = CardTemplateRow["category"];

const CATEGORY_TABS: { key: Category; label: string; icon: React.ElementType }[] = [
  { key: "postcard", label: "Postcard", icon: Mail },
  { key: "birthday", label: "Birthday", icon: Cake },
  { key: "event", label: "Event", icon: CalendarDays },
  { key: "thank-you", label: "Thank You", icon: Heart },
  { key: "holiday", label: "Holiday", icon: Snowflake },
];

const CATEGORY_BADGE: Record<Category, string> = {
  postcard: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  birthday: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  event: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "thank-you": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  holiday: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generates a URL-safe slug from a title string.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Mini color-scheme mockup for a card template.
 */
function TemplateMiniPreview({
  colors,
}: {
  colors: { primary: string; secondary: string; accent: string };
}) {
  return (
    <div
      className="relative h-20 w-full overflow-hidden rounded-xl"
      style={{ background: colors.primary }}
    >
      <div
        className="absolute -right-3 -top-3 h-14 w-14 rounded-full opacity-40"
        style={{ background: colors.secondary }}
      />
      <div className="absolute inset-x-0 top-0 flex items-center gap-1 px-2 py-1.5">
        <div className="h-1 w-1 rounded-full" style={{ background: colors.accent }} />
        <div className="h-0.5 w-6 rounded-full opacity-60" style={{ background: colors.accent }} />
      </div>
      <div className="absolute inset-x-0 top-6 flex flex-col items-center gap-1 px-3">
        <div className="h-1.5 w-16 rounded-full opacity-80" style={{ background: colors.accent }} />
        <div className="h-1 w-10 rounded-full opacity-50" style={{ background: colors.accent }} />
      </div>
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 h-3 w-10 rounded-full"
        style={{ background: colors.accent }}
      />
    </div>
  );
}

/**
 * Live preview panel that shows the card as it would appear when published.
 */
function LivePreview({
  template,
  title,
  message,
  senderName,
  recipientName,
  eventDate,
  eventLocation,
}: {
  template: CardTemplateRow;
  title: string;
  message: string;
  senderName: string;
  recipientName: string;
  eventDate: string;
  eventLocation: string;
}) {
  const colors = template.default_config?.colors ?? {
    primary: "#333",
    secondary: "#fafafa",
    accent: "#999",
  };
  const fonts = template.default_config?.fonts ?? {
    display: "Georgia",
    body: "sans-serif",
  };

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-card border"
      style={{
        backgroundColor: colors.secondary,
        borderColor: `${colors.primary}20`,
      }}
    >
      <div className="px-6 py-10 text-center space-y-4">
        {title && (
          <h2
            className="text-2xl font-bold leading-tight"
            style={{ color: colors.primary, fontFamily: fonts.display }}
          >
            {title}
          </h2>
        )}
        <div className="w-12 h-px mx-auto" style={{ backgroundColor: colors.accent }} />
        {message && (
          <p
            className="text-sm leading-relaxed whitespace-pre-line"
            style={{ color: colors.primary, fontFamily: fonts.body }}
          >
            {message}
          </p>
        )}
        {(formattedDate || eventLocation) && (
          <div className="space-y-1.5 pt-2">
            {formattedDate && (
              <div
                className="flex items-center justify-center gap-1.5 text-xs"
                style={{ color: colors.accent }}
              >
                <CalendarDays size={12} />
                <span>{formattedDate}</span>
              </div>
            )}
            {eventLocation && (
              <div
                className="flex items-center justify-center gap-1.5 text-xs"
                style={{ color: colors.accent }}
              >
                <MapPin size={12} />
                <span>{eventLocation}</span>
              </div>
            )}
          </div>
        )}
        {recipientName && (
          <p
            className="text-xs italic"
            style={{ color: colors.accent, fontFamily: fonts.body }}
          >
            For {recipientName}
          </p>
        )}
        {senderName && (
          <div>
            <div className="w-8 h-px mx-auto mb-2" style={{ backgroundColor: colors.accent }} />
            <p
              className="text-xs font-medium"
              style={{ color: colors.primary, fontFamily: fonts.display }}
            >
              With love, {senderName}
            </p>
          </div>
        )}
        {!title && !message && (
          <p className="text-sm text-dearly-text-muted py-8">
            Start typing to see your card preview
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function DashboardCardsPage() {
  const { user } = useAuth();

  // Template state
  const [templates, setTemplates] = useState<CardTemplateRow[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("postcard");
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplateRow | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Existing cards
  const [myCards, setMyCards] = useState<(CardRow & { template: CardTemplateRow })[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  /** Fetches all card templates from Supabase. */
  useEffect(() => {
    async function fetchTemplates() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("card_templates")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) setTemplates(data as CardTemplateRow[]);
      setTemplatesLoading(false);
    }
    fetchTemplates();
  }, []);

  /** Fetches the current user's cards. */
  const fetchMyCards = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("cards")
      .select("*, template:card_templates(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setMyCards(data as (CardRow & { template: CardTemplateRow })[]);
    setCardsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchMyCards();
  }, [fetchMyCards]);

  // Auto-generate slug from title
  useEffect(() => {
    if (slugEdited || !title) return;
    const generated = slugify(title);
    if (generated.length >= 3) setSlug(generated);
  }, [title, slugEdited]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  /**
   * Creates, publishes the card, and shows the shareable link.
   */
  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedTemplate) {
      setSubmitError("Please select a template first.");
      return;
    }
    if (!title.trim()) {
      setSubmitError("Title is required.");
      return;
    }
    if (!slug.trim() || slug.trim().length < 3) {
      setSubmitError("Slug must be at least 3 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("cards")
        .insert({
          user_id: user?.id ?? null,
          template_id: selectedTemplate.id,
          slug: slug.trim(),
          title: title.trim(),
          message: message.trim(),
          sender_name: senderName.trim(),
          recipient_name: recipientName.trim() || null,
          event_date: eventDate || null,
          event_location: eventLocation.trim() || null,
          is_published: true,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      setPublishedSlug((data as CardRow).slug);
      fetchMyCards();
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to publish card.");
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Deletes a card by ID after confirmation.
   */
  async function handleDelete(cardId: string) {
    const supabase = createClient();
    await supabase.from("cards").delete().eq("id", cardId);
    fetchMyCards();
  }

  /**
   * Copies a card link to clipboard.
   */
  function handleCopy(cardSlug: string) {
    const url = `${window.location.origin}/c/${cardSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  /**
   * Resets the form to create another card.
   */
  function resetForm() {
    setSelectedTemplate(null);
    setTitle("");
    setMessage("");
    setSenderName("");
    setRecipientName("");
    setEventDate("");
    setEventLocation("");
    setSlug("");
    setSlugEdited(false);
    setPublishedSlug(null);
    setSubmitError(null);
  }

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  const filteredTemplates = templates.filter((t) => t.category === activeCategory);

  // ---------------------------------------------------------------------------
  // Render: Published success state
  // ---------------------------------------------------------------------------

  if (publishedSlug) {
    const cardUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/c/${publishedSlug}`;

    return (
      <div className="mx-auto max-w-lg py-20 text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={SPRING}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
        >
          <Check size={28} className="text-emerald-600" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold text-dearly-text">
          Card Published!
        </h2>
        <p className="text-sm text-dearly-text-secondary">
          Your card is live and ready to share.
        </p>

        <div className="flex items-center gap-2 mx-auto max-w-sm">
          <input
            readOnly
            value={cardUrl}
            className="flex-1 rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text outline-none"
          />
          <button
            onClick={() => handleCopy(publishedSlug)}
            className="rounded-xl bg-dearly-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="flex items-center justify-center gap-3">
          <a
            href={`/c/${publishedSlug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-dearly-border bg-dearly-card px-4 py-2 text-sm font-medium text-dearly-text transition hover:shadow-soft"
          >
            <Eye size={14} />
            View Card
            <ExternalLink size={12} />
          </a>
          <button
            onClick={resetForm}
            className="inline-flex items-center gap-1.5 rounded-xl bg-dearly-accent-soft px-4 py-2 text-sm font-medium text-dearly-accent transition hover:bg-dearly-accent hover:text-white"
          >
            <Plus size={14} />
            Create Another
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Creator form
  // ---------------------------------------------------------------------------

  return (
    <div className="mx-auto max-w-6xl pb-12 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-3xl font-bold text-dearly-text">
          Create a Card
        </h1>
        <p className="mt-1 text-dearly-text-secondary">
          Pick a template, write your message, and share it instantly.
        </p>
      </motion.div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {CATEGORY_TABS.map(({ key, label, icon: Icon }) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveCategory(key);
                setSelectedTemplate(null);
              }}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                isActive
                  ? "bg-dearly-accent text-white shadow-soft"
                  : "bg-dearly-card border border-dearly-border text-dearly-text-secondary hover:border-dearly-accent/40 hover:text-dearly-text"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Template picker */}
      {!selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {templatesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-dearly-border bg-dearly-card p-4 space-y-3 animate-pulse">
                  <div className="h-20 w-full rounded-xl bg-dearly-border" />
                  <div className="h-3 w-2/3 rounded-full bg-dearly-border" />
                  <div className="h-2.5 w-full rounded-full bg-dearly-border" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTemplates.map((template) => {
                const colors = template.default_config?.colors ?? {
                  primary: "#333",
                  secondary: "#fafafa",
                  accent: "#999",
                };

                return (
                  <motion.button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={SPRING}
                    className="flex flex-col overflow-hidden rounded-2xl border-2 border-dearly-border bg-dearly-card p-3 text-left shadow-card transition hover:border-dearly-accent/40 hover:shadow-card-hover focus:outline-none"
                  >
                    <TemplateMiniPreview colors={colors} />
                    <div className="mt-2 space-y-1">
                      <p className="text-sm font-bold text-dearly-text">{template.name}</p>
                      <p className="text-xs text-dearly-text-secondary line-clamp-2 leading-relaxed">
                        {template.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* Form + Live Preview */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            key="card-form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={SPRING}
          >
            {/* Back to templates */}
            <button
              onClick={() => setSelectedTemplate(null)}
              className="flex items-center gap-1.5 text-sm text-dearly-text-secondary hover:text-dearly-accent transition mb-4"
            >
              <ChevronLeft size={16} />
              Back to templates
            </button>

            <div className="flex items-center gap-2 mb-6">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: selectedTemplate.default_config?.colors?.accent ?? "#b08060" }}
              />
              <span className="text-sm font-medium text-dearly-text">
                {selectedTemplate.name}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${CATEGORY_BADGE[selectedTemplate.category]}`}>
                {selectedTemplate.category}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <form onSubmit={handlePublish} className="space-y-5">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dearly-text" htmlFor="card-title">
                    Title <span className="text-dearly-rose">*</span>
                  </label>
                  <input
                    id="card-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Happy Birthday Sarah!"
                    className="rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-muted outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dearly-text" htmlFor="card-message">
                    Message
                  </label>
                  <textarea
                    id="card-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your heartfelt message here..."
                    className="rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-muted outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition resize-none"
                  />
                </div>

                {/* Sender + Recipient */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-dearly-text" htmlFor="card-sender">
                      Your Name
                    </label>
                    <input
                      id="card-sender"
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-muted outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-dearly-text" htmlFor="card-recipient">
                      Recipient Name
                    </label>
                    <input
                      id="card-recipient"
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Sarah"
                      className="rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-muted outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition"
                    />
                  </div>
                </div>

                {/* Event Date + Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-dearly-text" htmlFor="card-date">
                      Event Date <span className="text-dearly-text-muted font-normal">(optional)</span>
                    </label>
                    <input
                      id="card-date"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-dearly-text" htmlFor="card-location">
                      Location <span className="text-dearly-text-muted font-normal">(optional)</span>
                    </label>
                    <input
                      id="card-location"
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="e.g. Central Park, NYC"
                      className="rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-muted outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition"
                    />
                  </div>
                </div>

                {/* URL Slug */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dearly-text" htmlFor="card-slug">
                    Card URL <span className="text-dearly-rose">*</span>
                  </label>
                  <div className="flex items-center overflow-hidden rounded-xl border border-dearly-border bg-dearly-cream focus-within:border-dearly-accent focus-within:ring-2 focus-within:ring-dearly-accent/20 transition">
                    <span className="shrink-0 border-r border-dearly-border bg-dearly-cream px-3 py-2.5 text-xs text-dearly-text-muted select-none">
                      dearly.app/c/
                    </span>
                    <input
                      id="card-slug"
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => {
                        setSlugEdited(true);
                        setSlug(e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9-]/g, ""));
                      }}
                      placeholder="my-card"
                      className="flex-1 bg-transparent px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-muted outline-none"
                    />
                  </div>
                  <p className="text-xs text-dearly-text-muted">
                    Auto-generated from your title. Must be at least 3 characters.
                  </p>
                </div>

                {/* Error */}
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

                {/* Publish */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.01 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-dearly-accent py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Globe size={16} />
                  {submitting ? "Publishing..." : "Publish & Get Link"}
                </motion.button>
              </form>

              {/* Live Preview */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-dearly-text-secondary uppercase tracking-wider">
                  Live Preview
                </p>
                <LivePreview
                  template={selectedTemplate}
                  title={title}
                  message={message}
                  senderName={senderName}
                  recipientName={recipientName}
                  eventDate={eventDate}
                  eventLocation={eventLocation}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* My Cards list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-12"
      >
        <h2 className="font-display text-xl font-bold text-dearly-text mb-4">
          Your Cards
        </h2>

        {cardsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-dearly-border bg-dearly-card p-4 animate-pulse">
                <div className="h-4 w-1/3 rounded bg-dearly-border" />
                <div className="h-3 w-1/2 rounded bg-dearly-border mt-2" />
              </div>
            ))}
          </div>
        ) : myCards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-dearly-border bg-dearly-card/50 px-6 py-10 text-center">
            <Mail size={24} className="mx-auto text-dearly-text-muted mb-2" />
            <p className="text-sm text-dearly-text-secondary">
              You haven&apos;t created any cards yet. Pick a template above to get
              started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myCards.map((card) => (
              <motion.div
                key={card.id}
                layout
                className="flex items-center justify-between rounded-2xl border border-dearly-border bg-dearly-card px-5 py-4 shadow-card"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-dearly-text">
                      {card.title || "Untitled Card"}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${CATEGORY_BADGE[card.template.category]}`}>
                      {card.template.category}
                    </span>
                    {card.is_published && (
                      <span className="rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2 py-0.5 text-[10px] font-semibold">
                        Published
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-dearly-text-muted">
                    {card.template.name} &middot; /c/{card.slug}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(card.slug)}
                    className="rounded-lg p-2 text-dearly-text-secondary hover:bg-dearly-accent-soft hover:text-dearly-accent transition"
                    title="Copy link"
                  >
                    <Copy size={14} />
                  </button>
                  <a
                    href={`/c/${card.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg p-2 text-dearly-text-secondary hover:bg-dearly-accent-soft hover:text-dearly-accent transition"
                    title="View card"
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="rounded-lg p-2 text-dearly-text-secondary hover:bg-red-50 hover:text-red-600 transition"
                    title="Delete card"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
