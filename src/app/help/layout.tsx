/**
 * Help Center shell — the same marketing chrome as the rest of the public
 * site, without the dashboard sidebar. Article metadata is set per page.
 */

import Link from "next/link";

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-dearly-cream text-dearly-text">
      <header className="sticky top-0 z-40 border-b border-dearly-border/50 bg-dearly-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link href="/" className="font-display text-2xl font-bold text-dearly-accent">
            Dearly
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-dearly-text-secondary md:gap-6" aria-label="Main">
            <Link href="/templates" className="hidden hover:text-dearly-text sm:inline">
              Templates
            </Link>
            <Link href="/help" className="text-dearly-accent" aria-current="page">
              Help &amp; guides
            </Link>
            <Link href="/login" className="hidden hover:text-dearly-text sm:inline">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-dearly-accent px-3.5 py-2 text-xs font-semibold text-white shadow-soft transition hover:opacity-90 md:px-4 md:text-sm"
            >
              Start free
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-dearly-border bg-dearly-card/40 px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-dearly-text-muted md:flex-row">
          <span className="font-display text-xl font-bold text-dearly-accent">Dearly</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/help" className="hover:text-dearly-text-secondary">Help &amp; guides</Link>
            <Link href="/templates" className="hover:text-dearly-text-secondary">Templates</Link>
            <Link href="/invitations/wedding" className="hover:text-dearly-text-secondary">Wedding invitations</Link>
            <Link href="/invitations/birthday" className="hover:text-dearly-text-secondary">Birthday invitations</Link>
            <Link href="/invitations/dinner" className="hover:text-dearly-text-secondary">Dinner invitations</Link>
            <Link href="/privacy" className="hover:text-dearly-text-secondary">Privacy</Link>
            <Link href="/terms" className="hover:text-dearly-text-secondary">Terms</Link>
            <Link href="/contact" className="hover:text-dearly-text-secondary">Contact</Link>
            <Link href="/login" className="hover:text-dearly-text-secondary">Sign in</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Dearly. Made with love.</p>
        </div>
      </footer>
    </div>
  );
}
