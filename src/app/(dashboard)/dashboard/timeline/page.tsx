"use client";

/**
 * Timeline management page — add, edit, and delete wedding events.
 * Uses useTimeline for event data and useMyWedding for the wedding ID.
 */

import { useMyWedding } from "@/hooks/useWedding";
import { useTimeline } from "@/hooks/useTimeline";
import TimelineEditor from "@/components/dashboard/timeline/TimelineEditor";

/**
 * Dashboard timeline page.
 */
export default function TimelinePage() {
  const { wedding, loading: weddingLoading } = useMyWedding();
  const { events, loading: eventsLoading, addEvent, updateEvent, deleteEvent } =
    useTimeline(wedding?.id);

  if (weddingLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-sm text-dearly-text-secondary">Loading…</p>
      </div>
    );
  }

  if (!wedding) {
    return (
      <p className="text-sm text-dearly-text-secondary">
        No wedding found. Set one up in the Editor first.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dearly-text">Timeline</h1>
        <p className="mt-1 text-sm text-dearly-text-secondary">
          Manage the schedule of events for your wedding day.
        </p>
      </div>

      {eventsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-dearly-border" />
          ))}
        </div>
      ) : (
        <TimelineEditor
          events={events}
          weddingId={wedding.id}
          onAdd={addEvent}
          onUpdate={updateEvent}
          onDelete={deleteEvent}
        />
      )}
    </div>
  );
}
