"use client";

/**
 * Dashboard top bar — shows couple names, preview link, and publish toggle.
 */

import { useRouter } from "next/navigation";
import { ExternalLink, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMyWedding } from "@/hooks/useWedding";
import { useSidebarDrawer } from "./Sidebar";

export default function TopBar() {
  const { signOut } = useAuth();
  const { wedding, saveWedding } = useMyWedding();
  const router = useRouter();
  const { toggle } = useSidebarDrawer();

  /** Toggles the published state of the wedding. */
  async function togglePublish() {
    if (!wedding) return;
    await saveWedding({ is_published: !wedding.is_published });
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-dearly-border bg-dearly-card px-4 md:px-6">
      <div className="flex items-center gap-3 text-sm text-dearly-text-secondary">
        <button type="button" onClick={toggle} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-dearly-accent-soft md:hidden" aria-label="Open menu">
          <Menu size={20} />
        </button>
        {wedding ? (
          <span>
            {wedding.partner1_name || "Partner 1"} &amp; {wedding.partner2_name || "Partner 2"}
          </span>
        ) : (
          <span>Loading...</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {wedding?.slug && (
          <a
            href={`/${wedding.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-dearly-border px-3 py-1.5 text-xs font-medium text-dearly-text-secondary transition hover:bg-dearly-accent-soft"
          >
            <ExternalLink size={14} />
            Preview
          </a>
        )}

        {wedding && (
          <button
            onClick={togglePublish}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              wedding.is_published
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-dearly-accent-soft text-dearly-accent hover:bg-dearly-accent hover:text-white"
            }`}
          >
            {wedding.is_published ? "Published" : "Publish"}
          </button>
        )}

        <button
          onClick={async () => {
            await signOut();
            router.push("/login");
          }}
          className="rounded-lg p-1.5 text-dearly-text-muted transition hover:bg-dearly-accent-soft hover:text-dearly-text"
          aria-label="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
