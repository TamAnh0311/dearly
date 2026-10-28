"use client";

/**
 * Marketing landing page.
 *
 * Sections: nav → hero with a live, playable phone demo → signature openings
 * (one card per hero layout) → "everything guests need" bento → memories
 * (after the wedding) → comparison with hand-made studios → how it works →
 * testimonials → final CTA → footer.
 *
 * The phone demo embeds the real template preview (/templates/[slug]?embed=1)
 * so visitors experience the actual animation, not a mock.
 */

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Eye,
  Gem,
  Heart,
  LayoutList,
  MapPin,
  Music,
  Palette,
  PartyPopper,
  Search,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import LayoutThumbnail from "@/components/invitation/LayoutThumbnail";
import { COLOR_SCHEMES, LAYOUT_LABEL, getInvitationStyle } from "@/components/invitation/styles";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholder-images";

// ─── Data ─────────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

interface Showcase {
  slug: string;
  name: string;
  tagline: string;
  colors: { primary: string; secondary: string; accent: string };
  fonts: { display: string; body: string };
}

/** One template per opening style (colours/fonts mirror the templates table). */
const SHOWCASE: Showcase[] = [
  { slug: "velvet", name: "Velvet Curtain", tagline: "Curtains part under a golden spotlight", colors: { primary: "#D9B56C", secondary: "#1E0B10", accent: "#8C1C2C" }, fonts: { display: "Cinzel", body: "Cormorant Garamond" } },
  { slug: "secret-garden", name: "Secret Garden", tagline: "Ivy gates unlock onto a garden in bloom", colors: { primary: "#6B8F5E", secondary: "#F4F1E8", accent: "#C9A27E" }, fonts: { display: "Cormorant Garamond", body: "Nunito" } },
  { slug: "wax-seal", name: "Wax Seal", tagline: "The seal cracks, the letter rises", colors: { primary: "#8E2F3A", secondary: "#FBF7F0", accent: "#C8A97E" }, fonts: { display: "Playfair Display", body: "Lato" } },
  { slug: "dusk", name: "Dusk till Dawn", tagline: "Golden hour melts into a starry night", colors: { primary: "#F2B880", secondary: "#FFF7EE", accent: "#6C5B9E" }, fonts: { display: "Bodoni Moda", body: "Outfit" } },
  { slug: "rosewindow", name: "Rose Window", tagline: "Stained glass lights up in jewel tones", colors: { primary: "#2E5E8C", secondary: "#F7F4EE", accent: "#B4483C" }, fonts: { display: "EB Garamond", body: "Raleway" } },
  { slug: "bloom", name: "Bloom", tagline: "A hand-painted garden aisle in ivory and sage", colors: { primary: "#A98B5D", secondary: "#F7F2E8", accent: "#71806A" }, fonts: { display: "Cormorant Garamond", body: "Jost" } },
  { slug: "chateau", name: "Chateau", tagline: "Ornate gold arches over Sargent watercolours", colors: { primary: "#B8943E", secondary: "#FBF7EF", accent: "#4A6741" }, fonts: { display: "Playfair Display", body: "Jost" } },
  { slug: "eternal", name: "Eternal", tagline: "A golden arch draws itself around you", colors: { primary: "#B8860B", secondary: "#FFFFF0", accent: "#D4A574" }, fonts: { display: "Playfair Display", body: "Lato" } },
  { slug: "celestial", name: "Celestial", tagline: "Constellations and a crescent moon", colors: { primary: "#C9B06B", secondary: "#0F1729", accent: "#E8E0D0" }, fonts: { display: "Cormorant Garamond", body: "Raleway" } },
  { slug: "minimal", name: "Minimal", tagline: "Magazine-grade typography", colors: { primary: "#1A1A1A", secondary: "#FFFFFF", accent: "#666666" }, fonts: { display: "Inter", body: "Inter" } },
  { slug: "polaroid", name: "Polaroid", tagline: "Drag-able photos tumble onto the page", colors: { primary: "#2C3E50", secondary: "#FDFCF8", accent: "#E74C3C" }, fonts: { display: "Caveat", body: "Poppins" } },
];

const DEMO_SLUGS = ["velvet", "secret-garden", "wax-seal", "dusk"] as const;

const FEATURES = [
  { icon: PartyPopper, title: "RSVP inside the invitation", body: "Two big buttons — “I'll be there” or “Can't make it” — then name, party size and a blessing. Replies land in your dashboard instantly." },
  { icon: Heart, title: "Blessings that float in", body: "Every wish appears on a blessing wall and floats up the screen as flowers, butterflies or stars when guests open your page." },
  { icon: Sparkles, title: "Tap-to-react", body: "Guests shower you with hearts, blooms and cheers. Live counts, no account needed." },
  { icon: Wand2, title: "Scratch to reveal", body: "Hide your date under gold foil. Guests scratch it off with a finger — confetti follows." },
  { icon: Palette, title: "Any colour, instantly", body: "Ten curated schemes per design, or your own colours and fonts. See it change live." },
  { icon: LayoutList, title: "Show only what you want", body: "Toggle countdown, story, schedule, venue, RSVP, blessings — even the floating wishes." },
  { icon: MapPin, title: "Venue, map & calendar", body: "One tap for directions and add-to-calendar. A live countdown to the big day." },
  { icon: Music, title: "Background music", body: "A soft score matched to your design starts with the guest's first tap — or use your own song." },
];

const COMPARISON: { label: string; dearly: string | boolean; studio: string | boolean }[] = [
  { label: "See your invitation", dearly: "Instantly, free", studio: "After a 7–14 day design round" },
  { label: "Edit names, date, story", dearly: "Any time, live", studio: "Request a revision" },
  { label: "Try every colour scheme yourself", dearly: true, studio: "Usually one proof" },
  { label: "RSVP inside the invitation", dearly: true, studio: true },
  { label: "Live blessing wall + floating wishes", dearly: true, studio: "Rarely" },
  { label: "Guest reactions", dearly: true, studio: "Rarely" },
  { label: "Scratch-to-reveal & signature openings", dearly: true, studio: true },
  { label: "Choose which sections show", dearly: true, studio: "Via your designer" },
  { label: "Photo album guests add to after the wedding", dearly: true, studio: "Rarely" },
];

const TESTIMONIALS = [
  { quote: "Our guests watched the curtain open three times before they even scrolled. Then they RSVP'd in seconds.", couple: "Sophie & James" },
  { quote: "The blessings floating up as butterflies made my grandma cry. Everyone wanted to know who designed it.", couple: "Mia & Carlos" },
  { quote: "I tried every colour scheme in five minutes and turned off the sections we didn't need. Zero stress.", couple: "Priya & Liam" },
];

/** Google Fonts stylesheet for the showcase thumbnails. */
const FONTS_HREF = `https://fonts.googleapis.com/css2?${Array.from(new Set(["Great Vibes", ...SHOWCASE.map((s) => s.fonts.display)]))
  .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}`)
  .join("&")}&display=swap`;

// ─── Pieces ───────────────────────────────────────────────────────────────────

/** Fades/lifts content in on scroll. */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** A phone frame playing the real template preview in an iframe. */
function LivePhone() {
  const [slug, setSlug] = useState<(typeof DEMO_SLUGS)[number]>("velvet");
  const [nonce, setNonce] = useState(0);
  const current = SHOWCASE.find((s) => s.slug === slug)!;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div aria-hidden className="absolute -inset-10 rounded-[4rem] bg-gradient-to-br from-dearly-rose/30 via-dearly-gold/20 to-dearly-accent/30 blur-3xl" />
        <div className="relative h-[620px] w-[min(300px,88vw)] overflow-hidden rounded-[3rem] border-[10px] border-[#1b1714] bg-[#1b1714] shadow-2xl md:h-[680px] md:w-[330px]">
          <div aria-hidden className="absolute left-1/2 top-2 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-[#1b1714]" />
          <iframe
            key={`${slug}-${nonce}`}
            src={`/templates/${slug}?embed=1&bare=1`}
            title={`${current.name} live demo`}
            className="h-full w-full rounded-[2.3rem] border-0 bg-white"
            loading="lazy"
          />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2" role="group" aria-label="Choose a demo">
        {DEMO_SLUGS.map((s) => {
          const t = SHOWCASE.find((x) => x.slug === s)!;
          const active = s === slug;
          return (
            <button
              key={s}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setSlug(s);
                setNonce((n) => n + 1);
              }}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                active ? "border-dearly-accent bg-dearly-accent text-white" : "border-dearly-border bg-dearly-card text-dearly-text-secondary hover:border-dearly-accent/50"
              }`}
            >
              {t.name}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setNonce((n) => n + 1)}
          className="rounded-full border border-dearly-border bg-dearly-card px-3.5 py-1.5 text-xs font-semibold text-dearly-text-secondary hover:border-dearly-accent/50"
        >
          ↻ Replay
        </button>
      </div>
    </div>
  );
}

/** Animated row of colour scheme swatches for the hero. */
function SchemeStrip() {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      {COLOR_SCHEMES.slice(0, 7).map((s, i) => (
        <motion.span
          key={s.id}
          className="h-6 w-6 rounded-full ring-2 ring-white shadow"
          style={{ background: `conic-gradient(${s.colors.primary} 0 50%, ${s.colors.accent} 50% 75%, ${s.colors.secondary} 75%)` }}
          initial={{ scale: 0, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.9 + i * 0.07, type: "spring", stiffness: 260, damping: 16 }}
        />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-dearly-cream text-dearly-text">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={FONTS_HREF} />

      {/* ── Nav ── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-dearly-border/50 bg-dearly-cream/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-2xl font-bold text-dearly-accent">
            Dearly
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-dearly-text-secondary md:flex">
            <a href="#openings" className="hover:text-dearly-text">Openings</a>
            <a href="#features" className="hover:text-dearly-text">Features</a>
            <a href="#memories" className="hover:text-dearly-text">Memories</a>
            <a href="#compare" className="hover:text-dearly-text">Why Dearly</a>
            <Link href="/templates" className="hover:text-dearly-text">Templates</Link>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="text-sm font-medium text-dearly-text-secondary hover:text-dearly-text">Sign in</Link>
            <Link href="/signup" className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-90">
              Start free
            </Link>
          </div>
          <button type="button" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg md:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <X size={20} /> : <LayoutList size={20} />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-dearly-border md:hidden">
              <div className="flex flex-col gap-1 px-6 py-3 text-sm font-medium">
                {[["#openings", "Openings"], ["#features", "Features"], ["#memories", "Memories"], ["#compare", "Why Dearly"], ["/templates", "Templates"], ["/login", "Sign in"], ["/signup", "Start free"]].map(([href, label]) => (
                  <a key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-3 hover:bg-dearly-accent-soft">
                    {label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero ── */}
      <section className="relative px-6 pb-24 pt-32 md:pt-40">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_20%,rgb(var(--dearly-rose-soft))_0%,transparent_70%),radial-gradient(ellipse_50%_50%_at_90%_10%,rgb(var(--dearly-gold-soft))_0%,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <motion.p
              className="inline-flex items-center gap-2 rounded-full bg-dearly-accent-soft px-3 py-1 text-xs font-semibold text-dearly-accent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles size={13} /> Invitations · RSVPs · Blessings · Wedding memories
            </motion.p>
            <motion.h1
              className="mt-6 font-display text-5xl font-bold leading-[1.05] md:text-7xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: EASE }}
            >
              Wedding invitations that{" "}
              <span className="relative inline-block text-dearly-accent">
                open like a film
                <motion.svg viewBox="0 0 300 20" preserveAspectRatio="none" className="absolute -bottom-3 left-0 h-3 w-full md:h-4" aria-hidden>
                  <motion.path d="M4 14 C 80 2, 200 2, 296 12" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 1.2 }} />
                </motion.svg>
              </span>
              .
            </motion.h1>
            <motion.p
              className="mt-8 max-w-xl text-lg leading-relaxed text-dearly-text-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Curtains part, wax seals crack, flowers bloom. Send one link — guests RSVP inside the invitation, leave blessings and
              reactions, and after the big day share their photos into your memory album. Designed in minutes, not weeks.
            </motion.p>
            <motion.div className="mt-10 flex flex-wrap items-center gap-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <Link href="/signup" className="rounded-xl bg-dearly-accent px-7 py-4 text-base font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
                Create your invitation — free
              </Link>
              <Link href="/templates" className="flex items-center gap-2 rounded-xl border border-dearly-border bg-dearly-card/70 px-6 py-4 text-base font-semibold transition hover:-translate-y-0.5">
                <Search size={16} /> Browse 25 designs
              </Link>
            </motion.div>
            <div className="mt-10 flex items-center gap-4 text-sm text-dearly-text-secondary">
              <SchemeStrip />
              <span>Every design × any colour scheme</span>
            </div>
          </div>
          <LivePhone />
        </div>
      </section>

      {/* ── Signature openings ── */}
      <section id="openings" className="bg-dearly-card/50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">Signature openings</p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">The first three seconds, choreographed</h2>
            <p className="mt-4 text-dearly-text-secondary">Each design has its own entrance, ornaments and motion — not just a different colour.</p>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {SHOWCASE.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 5) * 0.06}>
                <Link href={`/templates/${s.slug}`} className="group block overflow-hidden rounded-2xl border border-dearly-border bg-dearly-card shadow-card transition hover:-translate-y-1 hover:shadow-card-hover">
                  <div className="relative h-44 overflow-hidden">
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                      <LayoutThumbnail slug={s.slug} colors={s.colors} fonts={s.fonts} photo={PLACEHOLDER_IMAGES.couple[i % PLACEHOLDER_IMAGES.couple.length]} />
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/25 group-hover:opacity-100">
                      <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-dearly-text shadow">
                        <Eye size={13} /> Watch it open
                      </span>
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold">{s.name}</p>
                      <span className="shrink-0 rounded-full bg-dearly-accent-soft px-2 py-0.5 text-[10px] font-semibold text-dearly-accent">
                        {LAYOUT_LABEL[getInvitationStyle(s.slug).hero]}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-dearly-text-secondary">{s.tagline}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/templates" className="text-sm font-semibold text-dearly-accent hover:underline">
              See all 25 designs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features bento ── */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">Inside every invitation</p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Everything guests need. Nothing they don&apos;t.</h2>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 4) * 0.06} className={i === 0 || i === 1 ? "lg:col-span-2" : ""}>
                <div className="h-full rounded-2xl border border-dearly-border bg-dearly-card p-6 shadow-card">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-dearly-accent-soft text-dearly-accent">
                    <f.icon size={20} />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dearly-text-secondary">{f.body}</p>
                  {i === 1 && (
                    <div className="relative mt-6 h-24 overflow-hidden rounded-xl bg-dearly-rose-soft/60" aria-hidden>
                      {["Grandma Rose", "Sophie & Liam", "Daniel"].map((n, k) => (
                        <motion.span
                          key={n}
                          className="absolute flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs shadow"
                          style={{ left: `${10 + k * 30}%`, fontFamily: "'Great Vibes', cursive", fontSize: 16, color: "rgb(var(--dearly-accent))" }}
                          animate={{ y: [90, -40] , opacity: [0, 1, 1, 0] }}
                          transition={{ duration: 5, delay: k * 1.4, repeat: Infinity, ease: "linear" }}
                        >
                          <Heart size={11} fill="currentColor" /> {n}
                        </motion.span>
                      ))}
                    </div>
                  )}
                  {i === 0 && (
                    <div className="mt-6 grid grid-cols-2 gap-3" aria-hidden>
                      <span className="rounded-xl bg-dearly-accent px-3 py-3 text-center text-sm font-semibold text-white">I&apos;ll be there</span>
                      <span className="rounded-xl border border-dearly-border px-3 py-3 text-center text-sm font-semibold">Can&apos;t make it</span>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Memories ── */}
      <section id="memories" className="relative overflow-hidden px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">After &ldquo;I do&rdquo;</p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Your invitation becomes your memory book</h2>
            <p className="mt-5 leading-relaxed text-dearly-text-secondary">
              The same link keeps working after the wedding. Guests add their photos straight from their phones, every blessing and
              RSVP is kept, and your album fills itself — pre-wedding, ceremony and reception, all in one place.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Guests upload photos from the invitation — no app, no account",
                "You approve each photo before it appears",
                "Albums for pre-wedding, ceremony and reception",
                "Every blessing saved on your wall and in your guest book",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="relative h-[420px] overflow-hidden">
            {PLACEHOLDER_IMAGES.wedding.slice(0, 5).map((src, i) => (
              <motion.div
                key={src}
                className="absolute w-44 rounded-lg bg-white p-2 pb-8 shadow-xl md:w-52"
                style={{ left: `${[4, 38, 62, 14, 48][i]}%`, top: `${[6, 0, 18, 46, 52][i]}%`, rotate: [-8, 4, 9, -3, -10][i] }}
                whileHover={{ scale: 1.06, rotate: 0, zIndex: 10 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 90, damping: 14 }}
              >
                <div className="relative aspect-square overflow-hidden rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <span className="absolute bottom-1.5 left-0 right-0 text-center text-lg text-dearly-text-secondary" style={{ fontFamily: "'Great Vibes', cursive" }}>
                  {["the proposal", "first dance", "golden hour", "the toast", "forever"][i]}
                </span>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Also for other occasions (secondary to weddings) ── */}
      <section id="occasions" className="border-y border-dearly-border/60 px-6 py-12">
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-text-muted">Not a wedding?</p>
            <p className="mt-1 font-display text-xl font-bold">The same invitations work for every celebration.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {[
              ["/invitations/birthday", "Birthdays"],
              ["/invitations/party", "Parties"],
              ["/invitations/social-event", "Dinners & galas"],
              ["/invitations/date-night", "Date night & proposals"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-dearly-border bg-dearly-card px-4 py-2 text-dearly-text-secondary transition hover:border-dearly-accent/50 hover:text-dearly-accent">
                {label}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Comparison ── */}
      <section id="compare" className="bg-dearly-card/50 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dearly-accent">Why Dearly</p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Studio-quality, without the wait</h2>
            <p className="mx-auto mt-4 max-w-xl text-dearly-text-secondary">
              Hand-made invitation studios are beautiful — and slow. Dearly gives you the same cinematic feel with live editing and features they don&apos;t offer.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-12 overflow-hidden rounded-2xl border border-dearly-border bg-dearly-card shadow-card">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-dearly-border bg-dearly-cream/60">
                  <th className="px-5 py-4 font-semibold text-dearly-text-secondary" scope="col">&nbsp;</th>
                  <th className="px-5 py-4 font-bold text-dearly-accent" scope="col">Dearly</th>
                  <th className="px-5 py-4 font-semibold text-dearly-text-secondary" scope="col">Typical design studio</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.label} className="border-b border-dearly-border/60 last:border-0">
                    <th scope="row" className="px-5 py-4 font-medium">{row.label}</th>
                    {[row.dearly, row.studio].map((v, i) => (
                      <td key={i} className={`px-5 py-4 ${i === 0 ? "font-semibold" : "text-dearly-text-secondary"}`}>
                        {v === true ? (
                          <Check size={18} className="text-emerald-600" aria-label="Yes" />
                        ) : v === false ? (
                          <X size={18} className="text-dearly-text-muted" aria-label="No" />
                        ) : (
                          v
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <h2 className="font-display text-4xl font-bold md:text-5xl">Ready before your coffee cools</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: Search, title: "Pick a design", body: "Search 25 designs by mood — garden, gold, stars, curtain — and preview each opening live." },
              { icon: Palette, title: "Make it yours", body: "Names, date, story and venue. Choose colours, fonts and which sections to show." },
              { icon: Gem, title: "Share one link", body: "Send by WhatsApp or email. RSVPs and blessings arrive in your dashboard in real time." },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="relative h-full rounded-2xl border border-dearly-border bg-dearly-card p-7 shadow-card">
                  <span className="absolute right-6 top-5 font-display text-5xl font-bold text-dearly-accent/15">0{i + 1}</span>
                  <s.icon size={22} className="text-dearly-accent" />
                  <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dearly-text-secondary">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-dearly-card/50 px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.couple} delay={i * 0.1}>
              <figure className="h-full rounded-2xl border border-dearly-border bg-dearly-card p-7 shadow-card">
                <div className="flex gap-0.5 text-dearly-gold" aria-label="5 stars">
                  {Array.from({ length: 5 }, (_, k) => (
                    <Heart key={k} size={14} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="mt-4 leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 text-2xl text-dearly-accent" style={{ fontFamily: "'Great Vibes', cursive" }}>
                  {t.couple}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden px-6 py-32 text-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgb(var(--dearly-rose-soft))_0%,transparent_70%)]" />
        <Reveal className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-bold md:text-6xl">Your love story deserves an entrance.</h2>
          <p className="mt-5 text-lg text-dearly-text-secondary">Free to create. Preview every design. Share when it feels perfect.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="rounded-xl bg-dearly-accent px-8 py-4 text-base font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
              Start my invitation
            </Link>
            <Link href="/templates/velvet" className="rounded-xl border border-dearly-border bg-dearly-card/70 px-8 py-4 text-base font-semibold transition hover:-translate-y-0.5">
              Watch a demo
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-dearly-border bg-dearly-card/40 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <span className="font-display text-xl font-bold text-dearly-accent">Dearly</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-dearly-text-muted">
            <Link href="/invitations/wedding" className="hover:text-dearly-text-secondary">Wedding invitations</Link>
            <Link href="/invitations/birthday" className="hover:text-dearly-text-secondary">Birthday invitations</Link>
            <Link href="/invitations/party" className="hover:text-dearly-text-secondary">Party invitations</Link>
            <Link href="/invitations/social-event" className="hover:text-dearly-text-secondary">Event invitations</Link>
            <Link href="/invitations/date-night" className="hover:text-dearly-text-secondary">Date night & proposals</Link>
            <Link href="/templates" className="hover:text-dearly-text-secondary">Templates</Link>
            <Link href="/login" className="hover:text-dearly-text-secondary">Sign in</Link>
          </div>
          <p className="text-sm text-dearly-text-muted">&copy; {new Date().getFullYear()} Dearly. Made with love.</p>
        </div>
      </footer>
    </div>
  );
}
