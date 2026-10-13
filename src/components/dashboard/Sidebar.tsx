"use client";

/**
 * Dashboard sidebar — navigation between dashboard sections.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette, Image, MessageSquare, Clock, Settings, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard/editor", label: "Editor", icon: Palette },
  { href: "/dashboard/gallery", label: "Gallery", icon: Image },
  { href: "/dashboard/guestbook", label: "Guest Book", icon: MessageSquare },
  { href: "/dashboard/timeline", label: "Timeline", icon: Clock },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/account", label: "Account", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-dearly-border bg-dearly-card">
      <div className="p-6">
        <Link href="/dashboard" className="font-display text-xl font-bold text-dearly-accent">
          Dearly
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-dearly-accent-soft text-dearly-accent"
                  : "text-dearly-text-secondary hover:bg-dearly-accent-soft/50 hover:text-dearly-text"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
