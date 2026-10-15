"use client";

/**
 * Dashboard page for creating and managing "Cute Questions".
 *
 * Provides a form to compose a new question with theme picker, colour
 * pickers, and quick presets. Lists previously created questions with
 * shareable links and answered status.
 */

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { CuteQuestionRow } from "@/types/database";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const QUESTION_PRESETS = [
  "Will you go on a date with me?",
  "Date night this Friday?",
  "Will you marry me?",
  "Will you be my girlfriend?",
  "Will you be my boyfriend?",
  "Will you be my valentine?",
  "Will you be my bridesmaid?",
  "Will you be my best man?",
  "Dinner and a movie?",
  "Prom?",
];

interface ThemeOption {
  value: CuteQuestionRow["theme"];
  label: string;
  emoji: string;
  preview: string;
}

const THEMES: ThemeOption[] = [
  { value: "hearts", label: "Hearts", emoji: "\uD83D\uDC96", preview: "bg-pink-100 border-pink-300" },
  { value: "roses", label: "Roses", emoji: "\uD83C\uDF39", preview: "bg-red-50 border-red-300" },
  { value: "stars", label: "Stars", emoji: "\u2728", preview: "bg-purple-50 border-purple-300" },
  { value: "kawaii", label: "Kawaii", emoji: "\uD83E\uDD70", preview: "bg-orange-50 border-orange-200" },
  { value: "classic", label: "Classic", emoji: "\u2661", preview: "bg-stone-50 border-stone-300" },
];

/**
 * Generates a URL-safe slug from a question string with a random suffix.
 */
function generateSlug(question: string): string {
  const base = question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 30)
    .replace(/-+$/, "");
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base || "question"}-${suffix}`;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function QuestionsPage() {
  // Form state
  const [questionText, setQuestionText] = useState("Will you be my girlfriend?");
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [theme, setTheme] = useState<CuteQuestionRow["theme"]>("hearts");
  const [yesMessage, setYesMessage] = useState("I knew you would say yes! \uD83D\uDC95");
  const [bgColor, setBgColor] = useState("#FFF0F5");
  const [accentColor, setAccentColor] = useState("#FF69B4");

  // UI state
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Existing questions
  const [questions, setQuestions] = useState<CuteQuestionRow[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches the current user's cute questions from Supabase.
   */
  const fetchQuestions = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cute_questions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setQuestions(data as CuteQuestionRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  /**
   * Handles form submission — creates a new cute question in Supabase.
   */
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreatedLink(null);

    if (!senderName.trim()) {
      setCreateError("Please enter your name.");
      return;
    }

    setCreating(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCreateError("You must be signed in to create a question.");
        setCreating(false);
        return;
      }

      const slug = generateSlug(questionText);

      const { data, error } = await supabase
        .from("cute_questions")
        .insert({
          user_id: user.id,
          slug,
          question: questionText.trim(),
          sender_name: senderName.trim(),
          recipient_name: recipientName.trim() || null,
          theme,
          yes_message: yesMessage.trim(),
          background_color: bgColor,
          accent_color: accentColor,
        })
        .select()
        .single();

      if (error) {
        setCreateError(error.message);
        setCreating(false);
        return;
      }

      const link = `${window.location.origin}/q/${(data as CuteQuestionRow).slug}`;
      setCreatedLink(link);
      setQuestions((prev) => [data as CuteQuestionRow, ...prev]);

      // Reset form
      setQuestionText("Will you be my girlfriend?");
      setSenderName("");
      setRecipientName("");
      setTheme("hearts");
      setYesMessage("I knew you would say yes! \uD83D\uDC95");
      setBgColor("#FFF0F5");
      setAccentColor("#FF69B4");
    } catch (err: unknown) {
      setCreateError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setCreating(false);
    }
  }

  /**
   * Copies a question's shareable link to the clipboard.
   */
  async function copyLink(slug: string, id: string) {
    const link = `${window.location.origin}/q/${slug}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback: ignore clipboard errors silently
    }
  }

  /**
   * Deletes a cute question by ID.
   */
  async function deleteQuestion(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("cute_questions").delete().eq("id", id);
    if (!error) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-dearly-text">
              Cute Questions
            </h1>
            <p className="mt-1 text-dearly-text-secondary">
              Create fun questions with a runaway &quot;No&quot; button.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowForm(!showForm);
              setCreatedLink(null);
              setCreateError(null);
            }}
            className="flex items-center gap-2 rounded-xl bg-dearly-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <Plus size={16} />
            New Question
          </motion.button>
        </div>
      </motion.div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            key="create-form"
            onSubmit={handleCreate}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-2xl border border-dearly-border bg-dearly-card shadow-card"
          >
            <div className="space-y-5 p-6">
              <div className="flex items-center gap-2 text-dearly-accent">
                <Sparkles size={18} />
                <h2 className="font-display text-lg font-bold">
                  Create a Cute Question
                </h2>
              </div>

              {/* Question text */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-dearly-text">
                  Your Question
                </label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={2}
                  maxLength={200}
                  className="rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-muted outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition resize-none"
                />
                {/* Quick presets */}
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {QUESTION_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setQuestionText(preset)}
                      className={`rounded-full border px-3 py-1 text-xs transition ${
                        questionText === preset
                          ? "border-dearly-accent bg-dearly-accent-soft text-dearly-accent font-semibold"
                          : "border-dearly-border text-dearly-text-secondary hover:border-dearly-accent/40"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Names row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dearly-text">
                    Your Name <span className="text-dearly-rose">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Alex"
                    maxLength={50}
                    className="rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-muted outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dearly-text">
                    Recipient Name{" "}
                    <span className="text-dearly-text-muted font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Jordan"
                    maxLength={50}
                    className="rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-muted outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition"
                  />
                </div>
              </div>

              {/* Theme picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-dearly-text">
                  Theme
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTheme(t.value)}
                      className={`flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 text-center transition ${
                        theme === t.value
                          ? `${t.preview} border-dearly-accent shadow-sm`
                          : `${t.preview} border-transparent hover:border-dearly-accent/30`
                      }`}
                    >
                      <span className="text-2xl">{t.emoji}</span>
                      <span className="text-xs font-medium text-dearly-text">
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Yes message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-dearly-text">
                  Message After &quot;Yes&quot;
                </label>
                <input
                  type="text"
                  value={yesMessage}
                  onChange={(e) => setYesMessage(e.target.value)}
                  maxLength={150}
                  className="rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm text-dearly-text placeholder:text-dearly-text-muted outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition"
                />
              </div>

              {/* Colors row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dearly-text">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded-lg border border-dearly-border"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm font-mono text-dearly-text outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dearly-text">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded-lg border border-dearly-border"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 rounded-xl border border-dearly-border bg-dearly-cream px-3 py-2.5 text-sm font-mono text-dearly-text outline-none focus:border-dearly-accent focus:ring-2 focus:ring-dearly-accent/20 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Live preview swatch */}
              <div
                className="flex items-center justify-center rounded-xl py-6 text-center"
                style={{ backgroundColor: bgColor }}
              >
                <p className="text-lg font-bold" style={{ color: accentColor }}>
                  {questionText || "Your question here"}
                </p>
              </div>

              {/* Error */}
              <AnimatePresence>
                {createError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600 ring-1 ring-red-200"
                  >
                    {createError}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Created link */}
              <AnimatePresence>
                {createdLink && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200"
                  >
                    <Check size={16} className="text-emerald-600 shrink-0" />
                    <span className="flex-1 text-sm text-emerald-800 font-mono break-all">
                      {createdLink}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(createdLink)
                      }
                      className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Copy
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={creating}
                whileHover={{ scale: creating ? 1 : 1.01 }}
                whileTap={{ scale: creating ? 1 : 0.98 }}
                className="w-full rounded-xl bg-dearly-accent py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "Create Question"}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Existing questions list */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-dearly-text">
          Your Questions
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-dearly-border bg-dearly-card p-4"
              >
                <div className="h-4 w-2/3 rounded-full bg-dearly-border" />
                <div className="mt-2 h-3 w-1/3 rounded-full bg-dearly-border" />
              </div>
            ))}
          </div>
        ) : questions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-dearly-border bg-dearly-card/50 py-12 text-center"
          >
            <Heart size={32} className="text-dearly-text-muted" />
            <p className="text-sm text-dearly-text-secondary">
              No questions yet. Create your first one!
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {questions.map((q) => (
              <motion.div
                key={q.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="group flex items-center gap-4 rounded-2xl border border-dearly-border bg-dearly-card p-4 shadow-card transition hover:shadow-card-hover"
              >
                {/* Theme indicator */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                  style={{ backgroundColor: q.background_color }}
                >
                  {THEMES.find((t) => t.value === q.theme)?.emoji || "\uD83D\uDC96"}
                </div>

                {/* Question info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-dearly-text truncate">
                    {q.question}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-dearly-text-secondary">
                    {q.recipient_name && (
                      <span>To: {q.recipient_name}</span>
                    )}
                    <span className="font-mono text-dearly-text-muted">
                      /q/{q.slug}
                    </span>
                  </div>
                </div>

                {/* Status badge */}
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                    q.answered
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-amber-50 text-amber-700 ring-amber-200"
                  }`}
                >
                  {q.answered ? "Answered" : "Pending"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => copyLink(q.slug, q.id)}
                    className="rounded-lg p-2 text-dearly-text-muted transition hover:bg-dearly-accent-soft hover:text-dearly-accent"
                    title="Copy link"
                  >
                    {copiedId === q.id ? (
                      <Check size={16} className="text-emerald-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                  <a
                    href={`/q/${q.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg p-2 text-dearly-text-muted transition hover:bg-dearly-accent-soft hover:text-dearly-accent"
                    title="Open"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(q.id)}
                    className="rounded-lg p-2 text-dearly-text-muted transition hover:bg-red-50 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
