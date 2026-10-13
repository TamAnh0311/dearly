"use client";

/**
 * TimelineEditor — list of wedding events with add, edit, and delete controls.
 * Supports a local add/edit form with all WeddingEventRow fields.
 */

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import type { WeddingEventRow } from "@/types/database";

interface TimelineEditorProps {
  /** Ordered list of timeline events. */
  events: WeddingEventRow[];
  /** The wedding ID used when adding new events. */
  weddingId: string;
  /** Adds a new event. */
  onAdd: (event: Omit<WeddingEventRow, "id" | "created_at">) => Promise<void>;
  /** Updates an existing event by ID. */
  onUpdate: (eventId: string, updates: Partial<WeddingEventRow>) => Promise<void>;
  /** Deletes an event by ID. */
  onDelete: (eventId: string) => Promise<void>;
}

/** Emoji options for the icon field. */
const ICON_OPTIONS = ["💍", "💒", "🥂", "🎶", "🌹", "🍰", "✈️", "📸", "💃", "🎉"];

/** Blank form state for adding a new event. */
function blankForm(weddingId: string): Omit<WeddingEventRow, "id" | "created_at"> {
  return {
    wedding_id: weddingId,
    title: "",
    description: null,
    location: null,
    start_time: "",
    end_time: null,
    icon: "💍",
    sort_order: 0,
  };
}

type FormState = Omit<WeddingEventRow, "id" | "created_at">;

/**
 * Renders events list and inline add/edit form.
 */
export default function TimelineEditor({
  events,
  weddingId,
  onAdd,
  onUpdate,
  onDelete,
}: TimelineEditorProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(blankForm(weddingId));
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /**
   * Opens the add form with a blank state.
   */
  function openAddForm() {
    setForm(blankForm(weddingId));
    setEditingId(null);
    setShowForm(true);
  }

  /**
   * Opens the edit form pre-populated with the given event.
   */
  function openEditForm(event: WeddingEventRow) {
    setForm({
      wedding_id: event.wedding_id,
      title: event.title,
      description: event.description,
      location: event.location,
      start_time: event.start_time,
      end_time: event.end_time,
      icon: event.icon,
      sort_order: event.sort_order,
    });
    setEditingId(event.id);
    setShowForm(true);
  }

  /**
   * Updates a single form field by key.
   */
  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /**
   * Submits the form — either adds or updates based on editingId.
   */
  async function handleSubmit() {
    if (!form.title.trim() || !form.start_time) return;
    setBusy(true);
    try {
      if (editingId) {
        await onUpdate(editingId, form);
      } else {
        await onAdd({ ...form, sort_order: events.length });
      }
      setShowForm(false);
      setEditingId(null);
    } finally {
      setBusy(false);
    }
  }

  /**
   * Deletes an event by ID.
   */
  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Event list */}
      {events.length === 0 && !showForm && (
        <p className="py-4 text-sm text-dearly-text-secondary">
          No events yet. Add your first timeline event below.
        </p>
      )}

      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-4 rounded-xl border border-dearly-border bg-dearly-card p-4"
          >
            <span className="text-2xl">{event.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-dearly-text">{event.title}</p>
              {event.description && (
                <p className="mt-0.5 text-sm text-dearly-text-secondary">{event.description}</p>
              )}
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-dearly-text-muted">
                <span>{event.start_time}</span>
                {event.end_time && <span>→ {event.end_time}</span>}
                {event.location && <span>📍 {event.location}</span>}
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                onClick={() => openEditForm(event)}
                className="rounded-lg p-1.5 text-dearly-text-secondary transition hover:bg-dearly-border hover:text-dearly-text"
                aria-label="Edit event"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                disabled={deletingId === event.id}
                className="rounded-lg p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                aria-label="Delete event"
              >
                {deletingId === event.id ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                ) : (
                  <Trash2 size={15} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / edit form */}
      {showForm ? (
        <div className="rounded-xl border border-dearly-accent/40 bg-dearly-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-dearly-text">
            {editingId ? "Edit Event" : "Add Event"}
          </h3>

          <div className="space-y-3">
            {/* Icon */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-dearly-text">Icon</label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setField("icon", icon)}
                    className={`rounded-lg p-1.5 text-lg transition ${
                      form.icon === icon
                        ? "bg-dearly-accent-soft ring-2 ring-dearly-accent"
                        : "hover:bg-dearly-border"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-dearly-text">Title *</label>
              <input
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Ceremony"
                className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm text-dearly-text focus:outline-none focus:ring-2 focus:ring-dearly-accent"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-dearly-text">Description</label>
              <textarea
                value={form.description ?? ""}
                onChange={(e) => setField("description", e.target.value || null)}
                rows={2}
                placeholder="Optional details…"
                className="w-full resize-none rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm text-dearly-text focus:outline-none focus:ring-2 focus:ring-dearly-accent"
              />
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-dearly-text">Location</label>
              <input
                value={form.location ?? ""}
                onChange={(e) => setField("location", e.target.value || null)}
                placeholder="Chapel at the Estate"
                className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm text-dearly-text focus:outline-none focus:ring-2 focus:ring-dearly-accent"
              />
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-dearly-text">Start Time *</label>
                <input
                  type="datetime-local"
                  value={form.start_time}
                  onChange={(e) => setField("start_time", e.target.value)}
                  className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm text-dearly-text focus:outline-none focus:ring-2 focus:ring-dearly-accent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-dearly-text">End Time</label>
                <input
                  type="datetime-local"
                  value={form.end_time ?? ""}
                  onChange={(e) => setField("end_time", e.target.value || null)}
                  className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm text-dearly-text focus:outline-none focus:ring-2 focus:ring-dearly-accent"
                />
              </div>
            </div>
          </div>

          {/* Form actions */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-dearly-text-secondary hover:bg-dearly-border"
            >
              <X size={15} /> Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={busy || !form.title.trim() || !form.start_time}
              className="flex items-center gap-1.5 rounded-lg bg-dearly-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-dearly-accent/90 disabled:opacity-50"
            >
              {busy ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Check size={15} />
              )}
              {editingId ? "Save Changes" : "Add Event"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={openAddForm}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-dearly-border py-3 text-sm text-dearly-text-secondary transition hover:border-dearly-accent/50 hover:text-dearly-accent"
        >
          <Plus size={16} />
          Add Timeline Event
        </button>
      )}
    </div>
  );
}
