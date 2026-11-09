"use client";

/**
 * BulkModeration — toolbar for bulk approve/reject of pending photos.
 * Renders a horizontal bar with select-all toggle and action buttons.
 */

import { CheckSquare, Square, CheckCheck, XCircle } from "lucide-react";

interface BulkModerationProps {
  /** Total number of pending photos available for selection. */
  totalPending: number;
  /** Set of currently selected photo IDs. */
  selectedIds: Set<string>;
  /** Toggles between select-all and deselect-all. */
  onToggleAll: () => void;
  /** Approves the given photo IDs. */
  onApprove: (ids: string[]) => void;
  /** Rejects the given photo IDs. */
  onReject: (ids: string[]) => void;
}

/**
 * Horizontal bulk-action toolbar for the pending photos moderation queue.
 */
export default function BulkModeration({
  totalPending,
  selectedIds,
  onToggleAll,
  onApprove,
  onReject,
}: BulkModerationProps) {
  const selectedCount = selectedIds.size;
  const allSelected = selectedCount === totalPending && totalPending > 0;
  const selectedArray = Array.from(selectedIds);

  return (
    <div className="flex items-center justify-between rounded-xl border border-dearly-border bg-dearly-cream px-4 py-3">
      {/* Left: toggle-all button */}
      <button
        type="button"
        onClick={onToggleAll}
        className="flex items-center gap-2 text-sm font-medium text-dearly-text transition hover:text-dearly-accent"
      >
        {allSelected ? (
          <CheckSquare size={16} className="text-dearly-accent" />
        ) : (
          <Square size={16} className="text-dearly-text-secondary" />
        )}
        {allSelected ? "Deselect all" : "Select all"}
      </button>

      {/* Right: selection count + action buttons (only when items are selected) */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-dearly-text-secondary">
            {selectedCount} selected
          </span>

          <button
            type="button"
            onClick={() => onApprove(selectedArray)}
            className="flex items-center gap-1.5 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-200"
          >
            <CheckCheck size={14} />
            Approve
          </button>

          <button
            type="button"
            onClick={() => onReject(selectedArray)}
            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
          >
            <XCircle size={14} />
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
