"use client";

/**
 * EngagementPanel — displays blessing count, reaction breakdown by kind,
 * and the top 3 most active guests by blessing volume.
 */

import { Heart } from "lucide-react";

interface Blessing {
  id: string;
  guest_name: string;
  created_at: string;
}

interface Reaction {
  kind: string;
  count: number;
}

interface EngagementPanelProps {
  /** All guestbook / blessing entries for the wedding. */
  blessings: Blessing[];
  /** Reaction counts per kind. */
  reactions: Reaction[];
}

/** Maps reaction kind to a display emoji. */
const REACTION_EMOJI: Record<string, string> = {
  love: "❤️",
  bloom: "🌸",
  cheers: "🥂",
  sparkle: "✨",
  rings: "💍",
};

/**
 * Returns the top N guests ranked by number of blessings they have left.
 */
function topGuests(blessings: Blessing[], n = 3): { name: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const b of blessings) {
    counts[b.guest_name] = (counts[b.guest_name] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([name, count]) => ({ name, count }));
}

export default function EngagementPanel({ blessings, reactions }: EngagementPanelProps) {
  const top = topGuests(blessings);
  const totalReactions = reactions.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="rounded-2xl border border-dearly-border bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Heart size={18} className="text-dearly-accent" />
        <h2 className="text-base font-semibold text-dearly-text">Engagement</h2>
      </div>

      {/* Blessing count */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-dearly-text">{blessings.length}</p>
        <p className="text-xs text-dearly-text-secondary">Total blessings</p>
      </div>

      {/* Reactions */}
      {reactions.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-dearly-text-secondary">
            Reactions · {totalReactions}
          </p>
          <div className="flex flex-wrap gap-2">
            {reactions
              .filter((r) => r.count > 0)
              .sort((a, b) => b.count - a.count)
              .map((r) => (
                <span
                  key={r.kind}
                  className="inline-flex items-center gap-1 rounded-full bg-dearly-accent-soft px-3 py-1 text-sm text-dearly-text"
                >
                  <span>{REACTION_EMOJI[r.kind] ?? "•"}</span>
                  <span className="font-medium">{r.count}</span>
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Top guests */}
      {top.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-dearly-text-secondary">
            Most active guests
          </p>
          <ol className="space-y-1">
            {top.map(({ name, count }, i) => (
              <li key={name} className="flex items-center gap-2 text-sm text-dearly-text">
                <span className="text-dearly-text-secondary">{i + 1}.</span>
                <span className="flex-1 truncate">{name}</span>
                <span className="font-medium">{count}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {blessings.length === 0 && reactions.length === 0 && (
        <p className="text-sm text-dearly-text-secondary">No engagement data yet.</p>
      )}
    </div>
  );
}
