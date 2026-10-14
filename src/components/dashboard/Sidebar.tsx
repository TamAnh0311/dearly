"use client";

/**
 * Dashboard sidebar — navigation between dashboard sections.
 * On mobile, renders as a slide-over drawer toggled by a hamburger button.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Palette, Image, MessageSquare, Clock, Settings, User, Send, Heart, MailCheck, X } from "lucide-react";
import { createContext, useContext, useState, useCallback } from "react";

const NAV_ITEMS = [
  { href: "/dashboard/editor", label: "Editor", icon: Palette },
  { href: "/dashboard/rsvps", label: "RSVPs", icon: MailCheck },
  { href: "/dashboard/gallery", label: "Memories & Photos", icon: Image },
  { href: "/dashboard/guestbook", label: "Guest Book", icon: MessageSquare },
  { href: "/dashboard/timeline", label: "Timeline", icon: Clock },
  { href: "/dashboard/cards", label: "Cards", icon: Send },
  { href: "/dashboard/questions", label: "Questions", icon: Heart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/account", label: "Account", icon: User },
];

/** Context so TopBar can toggle the mobile drawer without prop-drilling. */
const SidebarCtx = createContext<{ open: boolean; toggle: () => void }>({ open: false, toggle: () => {} });
export function useSidebarDrawer() {
  return useContext(SidebarCtx);
}

/** Renders the nav link list (shared between desktop sidebar and mobile drawer). */
function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
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
    </>
  );
}

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <SidebarCtx.Provider value={{ open, toggle }}>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-dearly-border bg-dearly-card md:flex">
        <div className="p-6">
          <Link href="/dashboard" className="font-display text-xl font-bold text-dearly-accent">
            Dearly
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          <NavLinks />
        </nav>
      </aside>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-dearly-card shadow-2xl md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between p-5">
                <Link href="/dashboard" onClick={close} className="font-display text-xl font-bold text-dearly-accent">
                  Dearly
                </Link>
                <button type="button" onClick={close} className="rounded-lg p-2" aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-6">
                <NavLinks onNavigate={close} />
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {children}
    </SidebarCtx.Provider>
  );
}
