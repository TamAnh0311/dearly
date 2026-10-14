"use client";

/**
 * FloatingNav — a sticky frosted-glass pill navigation bar for guest-facing pages.
 * Fixed at the bottom of the screen, appears after scrolling 200px, slides up on mount.
 * Highlights the active link using the wedding's primary theme color.
 */

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heart, Image as ImageIcon, MessageSquare } from "lucide-react";

interface NavTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface NavSections {
  timeline: boolean;
  gallery: boolean;
  guestbook: boolean;
}

interface FloatingNavProps {
  weddingSlug: string;
  theme: NavTheme;
  sections: NavSections;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

/**
 * Returns true when the user has scrolled past the hero area (200px threshold).
 */
function useScrolledPast(threshold: number): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return past;
}

export default function FloatingNav({ weddingSlug, theme, sections }: FloatingNavProps) {
  const pathname = usePathname();
  const visible = useScrolledPast(200);

  const navItems: NavItem[] = [
    {
      label: "Invitation",
      href: `/${weddingSlug}`,
      icon: <Heart size={16} aria-hidden />,
    },
    ...(sections.gallery
      ? [
          {
            label: "Gallery",
            href: `/${weddingSlug}/gallery`,
            icon: <ImageIcon size={16} aria-hidden />,
          },
        ]
      : []),
    ...(sections.guestbook
      ? [
          {
            label: "Guest Book",
            href: `/${weddingSlug}/guestbook`,
            icon: <MessageSquare size={16} aria-hidden />,
          },
        ]
      : []),
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          role="navigation"
          aria-label="Wedding sections"
          className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div
            className="pointer-events-auto flex items-center gap-1 rounded-full px-3 py-2 shadow-2xl"
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              backgroundColor: "rgba(255, 255, 255, 0.82)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            {navItems.map((item) => {
              const isActive =
                item.href === `/${weddingSlug}`
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                  style={{
                    color: isActive ? theme.colors.primary : "#6b7280",
                    backgroundColor: isActive
                      ? `${theme.colors.primary}18`
                      : "transparent",
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Active dot indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: `${theme.colors.primary}18` }}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}

                  <span className="relative flex items-center gap-1.5">
                    <span
                      style={{ color: isActive ? theme.colors.primary : "#9ca3af" }}
                    >
                      {item.icon}
                    </span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
