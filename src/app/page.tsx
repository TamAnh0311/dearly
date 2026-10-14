"use client";

/**
 * Marketing landing page — animated hero, template showcase, feature tabs,
 * how-it-works steps, testimonials, and CTA sections.
 *
 * Uses Framer Motion throughout for scroll reveals, stagger animations,
 * and interactive UI elements.
 */

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Heart,
  Images,
  Clock,
  BookOpen,
  Music,
  Mail,
  Palette,
  Sliders,
  Share2,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPRING = { type: "spring", damping: 25, stiffness: 120 } as const;

const TEMPLATES = [
  {
    name: "Eternal",
    slug: "eternal",
    description: "Classic elegant — serif fonts, gold accents, ivory tones",
    primary: "#B8860B",
    secondary: "#FFFFF0",
    accent: "#D4A574",
    bg: "from-amber-50 to-yellow-100",
  },
  {
    name: "Bloom",
    slug: "bloom",
    description: "Romantic floral — watercolor flowers, soft pinks, greens",
    primary: "#D4A0A0",
    secondary: "#FFF5F5",
    accent: "#7BA07B",
    bg: "from-pink-50 to-rose-100",
  },
  {
    name: "Minimal",
    slug: "minimal",
    description: "Modern clean — sans-serif, whitespace, monochrome",
    primary: "#1A1A1A",
    secondary: "#FFFFFF",
    accent: "#666666",
    bg: "from-gray-50 to-slate-100",
  },
  {
    name: "Rustic",
    slug: "rustic",
    description: "Botanical earthy — kraft textures, hand-drawn illustrations",
    primary: "#5C4033",
    secondary: "#F5F0E8",
    accent: "#8B7355",
    bg: "from-orange-50 to-amber-100",
  },
  {
    name: "Deco",
    slug: "deco",
    description: "Art Deco — geometric patterns, gold/black, gatsby vibes",
    primary: "#C5A55A",
    secondary: "#1A1A2E",
    accent: "#E8D5A3",
    bg: "from-yellow-900 to-indigo-950",
  },
  {
    name: "Sunset",
    slug: "sunset",
    description: "Warm tropical — coral, terracotta, palm motifs",
    primary: "#E07A5F",
    secondary: "#FFF8F0",
    accent: "#F2CC8F",
    bg: "from-orange-100 to-red-100",
  },
  {
    name: "Noir",
    slug: "noir",
    description: "Dark moody — dramatic typography, dark backgrounds",
    primary: "#E0D6C8",
    secondary: "#0D0D0D",
    accent: "#8B7D6B",
    bg: "from-gray-900 to-stone-900",
  },
  {
    name: "Garden",
    slug: "garden",
    description: "English garden — muted pastels, delicate borders",
    primary: "#7BA07B",
    secondary: "#F8FAF5",
    accent: "#C4A882",
    bg: "from-green-50 to-emerald-100",
  },
  {
    name: "Polaroid",
    slug: "polaroid",
    description: "Retro playful — polaroid frames, handwritten fonts",
    primary: "#2C3E50",
    secondary: "#FDFCF8",
    accent: "#E74C3C",
    bg: "from-blue-50 to-sky-100",
  },
  {
    name: "Glass",
    slug: "glass",
    description: "Glassmorphism — frosted panels, gradients, depth layers",
    primary: "#667EEA",
    secondary: "#F0F4FF",
    accent: "#764BA2",
    bg: "from-violet-100 to-purple-100",
  },
];

const FEATURES = [
  {
    id: "invitations",
    label: "Animated Invitations",
    icon: Mail,
    description:
      "Your guests open an envelope that peels back to reveal your stunning invitation — fully animated and unforgettable.",
    mockupBg: "from-dearly-accent-soft to-dearly-rose-soft",
    mockupAccent: "bg-dearly-accent",
  },
  {
    id: "gallery",
    label: "Photo Gallery",
    icon: Images,
    description:
      "Three gorgeous layout styles — masonry, albums, and timeline. Guests can upload their own photos too.",
    mockupBg: "from-dearly-rose-soft to-dearly-gold-soft",
    mockupAccent: "bg-dearly-rose",
  },
  {
    id: "timeline",
    label: "Event Timeline",
    icon: Clock,
    description:
      "Share your wedding day schedule in a beautifully designed, animated timeline that matches your theme.",
    mockupBg: "from-dearly-gold-soft to-dearly-accent-soft",
    mockupAccent: "bg-dearly-gold",
  },
  {
    id: "guestbook",
    label: "Guest Book",
    icon: BookOpen,
    description:
      "Collect heartfelt messages from all your guests in a beautifully styled digital guest book you'll treasure forever.",
    mockupBg: "from-dearly-accent-soft to-dearly-cream",
    mockupAccent: "bg-dearly-accent",
  },
  {
    id: "music",
    label: "Music Player",
    icon: Music,
    description:
      "Set the mood with a built-in music player. Your song, your vibe — playing softly as guests browse your site.",
    mockupBg: "from-dearly-rose-soft to-dearly-accent-soft",
    mockupAccent: "bg-dearly-rose",
  },
  {
    id: "envelope",
    label: "Envelope Animation",
    icon: Mail,
    description:
      "Make a grand entrance. The iconic envelope opening animation sets the tone before guests even see a word.",
    mockupBg: "from-dearly-gold-soft to-dearly-rose-soft",
    mockupAccent: "bg-dearly-gold",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We showed our wedding site to family and they genuinely thought we had hired a professional designer. Dearly made us look incredible.",
    couple: "Sophie & James",
    rotation: "-2deg",
  },
  {
    quote:
      "The envelope animation had our guests screaming with delight. Everyone wanted to know how we did it. Absolute perfection.",
    couple: "Mia & Carlos",
    rotation: "0deg",
  },
  {
    quote:
      "I changed our template three times and it was seamless every time. The customization is just so good — hours of fun, not stress.",
    couple: "Priya & Liam",
    rotation: "2deg",
  },
];

const STATS = [
  { value: 10, label: "Stunning Templates", suffix: "" },
  { value: 3, label: "Gallery Layouts", suffix: "" },
  { value: 100, label: "Customization", suffix: "%" },
];

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 30, stiffness: 60 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionValue.set(target);
  }, [inView, motionValue, target]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => setDisplay(Math.round(v)));
    return unsubscribe;
  }, [spring]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

// ─── Feature Mockup ───────────────────────────────────────────────────────────

function FeatureMockup({ feature }: { feature: (typeof FEATURES)[number] }) {
  const Icon = feature.icon;

  const mockups: Record<string, React.ReactNode> = {
    invitations: (
      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ rotateX: -30, y: 20, opacity: 0 }}
          animate={{ rotateX: 0, y: 0, opacity: 1 }}
          transition={{ ...SPRING, delay: 0.1 }}
          className="relative w-48 h-64 bg-dearly-card rounded-xl shadow-card-hover border border-dearly-border flex flex-col items-center justify-center gap-3 p-6"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="w-8 h-px bg-dearly-gold mb-1" />
          <div className="font-display text-base text-dearly-text text-center leading-snug">
            Sophie &amp; James
          </div>
          <div className="text-xs text-dearly-text-muted text-center">
            invite you to celebrate
          </div>
          <div className="w-12 h-px bg-dearly-border my-1" />
          <div className="text-xs text-dearly-text-secondary text-center">
            June 14, 2026
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-dearly-accent flex items-center justify-center">
            <Heart size={12} className="text-white fill-white" />
          </div>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0.6, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.6 }}
          transition={{ ...SPRING, delay: 0.3 }}
          className="w-48 h-8 bg-dearly-border rounded-b-xl -mt-2"
          style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }}
        />
      </div>
    ),
    gallery: (
      <div className="grid grid-cols-3 gap-2 w-56">
        {[
          "h-24",
          "h-16",
          "h-20",
          "h-16",
          "h-24",
          "h-16",
          "h-20",
          "h-16",
          "h-24",
        ].map((h, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...SPRING, delay: i * 0.05 }}
            className={`${h} rounded-lg bg-gradient-to-br`}
            style={{
              background: `hsl(${(i * 37 + 10) % 360}, 60%, ${
                70 + (i % 3) * 5
              }%)`,
            }}
          />
        ))}
      </div>
    ),
    timeline: (
      <div className="flex flex-col gap-0 w-52">
        {[
          { time: "2:00 PM", event: "Ceremony", color: "bg-dearly-accent" },
          { time: "3:30 PM", event: "Cocktails", color: "bg-dearly-gold" },
          { time: "6:00 PM", event: "Reception", color: "bg-dearly-rose" },
          { time: "11:00 PM", event: "Send-off", color: "bg-dearly-accent" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ...SPRING, delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              {i < 3 && <div className="w-px h-8 bg-dearly-border" />}
            </div>
            <div className="pb-4">
              <div className="text-xs text-dearly-text-muted">{item.time}</div>
              <div className="text-sm font-medium text-dearly-text">
                {item.event}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    ),
    guestbook: (
      <div className="flex flex-col gap-3 w-56">
        {[
          { name: "Emma & Tom", msg: "Wishing you a lifetime of love!" },
          { name: "Aunt Sarah", msg: "So beautiful, brought tears to my eyes" },
        ].map((entry, i) => (
          <motion.div
            key={i}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...SPRING, delay: i * 0.15 }}
            className="bg-dearly-card rounded-xl p-3 border border-dearly-border shadow-soft"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-dearly-accent-soft flex items-center justify-center">
                <Heart size={8} className="text-dearly-accent fill-dearly-accent" />
              </div>
              <span className="text-xs font-semibold text-dearly-text">
                {entry.name}
              </span>
            </div>
            <p className="text-xs text-dearly-text-secondary leading-relaxed">
              {entry.msg}
            </p>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="h-8 rounded-lg border border-dashed border-dearly-border flex items-center px-3"
        >
          <span className="text-xs text-dearly-text-muted">
            Leave a message…
          </span>
        </motion.div>
      </div>
    ),
    music: (
      <div className="w-52 bg-dearly-card rounded-2xl p-4 border border-dearly-border shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full bg-dearly-accent flex items-center justify-center flex-shrink-0"
          >
            <Music size={14} className="text-white" />
          </motion.div>
          <div>
            <div className="text-sm font-medium text-dearly-text">
              Can&apos;t Help Falling
            </div>
            <div className="text-xs text-dearly-text-muted">Elvis Presley</div>
          </div>
        </div>
        <div className="h-1 bg-dearly-border rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "62%" }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="h-full bg-dearly-accent rounded-full"
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-dearly-text-muted">1:24</span>
          <span className="text-xs text-dearly-text-muted">2:17</span>
        </div>
      </div>
    ),
    envelope: (
      <div className="relative w-52 h-36">
        <motion.div
          className="absolute inset-0 bg-dearly-gold-soft border border-dearly-border rounded-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING}
        />
        <motion.div
          className="absolute inset-x-0 top-0 h-16 bg-dearly-accent/20 border-b border-dearly-border rounded-t-xl"
          style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: -90 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, ...SPRING }}
        >
          <div className="text-center">
            <Heart
              size={24}
              className="text-dearly-accent fill-dearly-accent mx-auto mb-1"
            />
            <div className="font-display text-sm text-dearly-text">
              You&apos;re Invited
            </div>
          </div>
        </motion.div>
      </div>
    ),
  };

  return (
    <div className="flex items-center justify-center min-h-[280px]">
      {mockups[feature.id] ?? (
        <Icon size={48} className="text-dearly-accent opacity-30" />
      )}
    </div>
  );
}

// ─── Floating Decoration ──────────────────────────────────────────────────────

function FloatingHeart({
  x,
  y,
  size,
  delay,
  duration,
}: {
  x: string;
  y: string;
  size: number;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      animate={{
        y: [-12, 12, -12],
        x: [-4, 4, -4],
        rotate: [-8, 8, -8],
        opacity: [0.15, 0.3, 0.15],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Heart
        size={size}
        className="text-dearly-rose fill-dearly-rose"
        style={{ opacity: 0.4 }}
      />
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Auto-cycle features
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const heroWords = ["Your", "Love", "Story,", "Beautifully", "Told"];

  return (
    <div className="min-h-screen bg-dearly-cream overflow-x-hidden">
      {/* ── Navigation ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-dearly-cream/80 backdrop-blur-md border-b border-dearly-border/50"
      >
        <span className="font-display text-2xl font-bold text-dearly-accent">
          Dearly
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-dearly-text-secondary transition hover:text-dearly-text"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 shadow-soft"
          >
            Get started
          </Link>
        </div>
      </motion.nav>

      {/* ── 1. Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
        style={{
          background:
            "linear-gradient(135deg, rgb(252 250 247) 0%, rgb(252 240 242) 40%, rgb(253 248 235) 70%, rgb(252 250 247) 100%)",
        }}
      >
        {/* Parallax background blob */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgb(var(--dearly-rose)) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, rgb(var(--dearly-gold)) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          <div
            className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, rgb(var(--dearly-accent)) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </motion.div>

        {/* Floating hearts */}
        <FloatingHeart x="8%" y="20%" size={18} delay={0} duration={6} />
        <FloatingHeart x="88%" y="15%" size={14} delay={1.2} duration={7} />
        <FloatingHeart x="5%" y="65%" size={22} delay={0.5} duration={8} />
        <FloatingHeart x="92%" y="55%" size={16} delay={2} duration={5.5} />
        <FloatingHeart x="15%" y="80%" size={12} delay={1.8} duration={6.5} />
        <FloatingHeart x="80%" y="75%" size={20} delay={0.8} duration={7.5} />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Word-by-word reveal */}
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight text-dearly-text mb-6">
            {heroWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.2 + i * 0.12 }}
                className={`inline-block mr-[0.25em] ${
                  i >= 3 ? "text-dearly-accent" : ""
                }`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.9 }}
            className="text-lg md:text-xl text-dearly-text-secondary max-w-xl mx-auto leading-relaxed"
          >
            Create stunning animated wedding invitations, photo galleries, and
            guest books. Ten beautiful templates. Full customization. Share with
            your guests in minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 1.1 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="group relative rounded-xl bg-dearly-accent px-8 py-4 text-base font-semibold text-white shadow-card transition-all hover:opacity-95 hover:shadow-card-hover hover:-translate-y-0.5"
            >
              <span className="relative z-10">Create Your Wedding Site</span>
            </Link>
            <a
              href="#templates"
              className="rounded-xl border border-dearly-border bg-dearly-card/60 backdrop-blur-sm px-8 py-4 text-base font-semibold text-dearly-text transition-all hover:bg-dearly-card hover:shadow-soft hover:-translate-y-0.5"
            >
              See Templates
            </a>
          </motion.div>
        </div>

        {/* Floating invitation mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateY: -15, rotateX: 5 }}
          animate={{ opacity: 1, y: 0, rotateY: -5, rotateX: 3 }}
          transition={{ ...SPRING, delay: 1.3 }}
          style={{ perspective: "1000px" }}
          className="relative z-10 mt-16"
        >
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-72 md:w-80 bg-dearly-card rounded-2xl shadow-card-hover border border-dearly-border p-8 text-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex justify-center mb-3">
              <div className="w-16 h-px bg-dearly-gold" />
            </div>
            <p className="text-xs tracking-[0.3em] text-dearly-text-muted uppercase mb-3">
              Together with their families
            </p>
            <h2 className="font-display text-2xl text-dearly-text mb-1">
              Sophie &amp; James
            </h2>
            <p className="text-xs text-dearly-text-secondary mb-4">
              invite you to celebrate their wedding
            </p>
            <div className="flex justify-center mb-3">
              <div className="w-8 h-px bg-dearly-border" />
              <Heart
                size={10}
                className="text-dearly-accent fill-dearly-accent mx-2"
              />
              <div className="w-8 h-px bg-dearly-border" />
            </div>
            <p className="text-sm font-medium text-dearly-text">
              June 14, 2026
            </p>
            <p className="text-xs text-dearly-text-muted mt-1">
              The Grand Pavilion, Florence
            </p>
            <div className="flex justify-center mt-4">
              <div className="w-16 h-px bg-dearly-gold" />
            </div>
          </motion.div>

          {/* Card shadow blur */}
          <div className="absolute inset-x-6 -bottom-4 h-8 bg-dearly-text/10 rounded-full blur-xl" />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-dearly-border flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-dearly-accent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. Stats Bar ── */}
      <section className="relative border-y border-dearly-border bg-dearly-card/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: i * 0.15 }}
            >
              <div className="font-display text-4xl md:text-5xl font-bold text-dearly-accent">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-2 text-sm text-dearly-text-secondary font-medium tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 3. Template Showcase ── */}
      <section id="templates" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] text-dearly-text-muted uppercase mb-3">
              Templates
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-dearly-text">
              Templates That Take Your{" "}
              <span className="text-dearly-accent">Breath Away</span>
            </h2>
            <p className="mt-4 text-dearly-text-secondary max-w-lg mx-auto">
              Ten distinct aesthetics — from timeless elegance to modern
              glassmorphism. Every template fully animated and customizable.
            </p>
          </motion.div>

          {/* Horizontal scroll carousel */}
          <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
            {TEMPLATES.map((template, i) => (
              <motion.div
                key={template.slug}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ ...SPRING, delay: Math.min(i * 0.08, 0.5) }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="flex-shrink-0 w-56 snap-start group cursor-pointer"
              >
                <div
                  className={`h-72 rounded-2xl bg-gradient-to-br ${template.bg} border border-dearly-border shadow-card group-hover:shadow-card-hover transition-shadow duration-300 overflow-hidden relative flex flex-col items-center justify-center p-6`}
                >
                  {/* Mini invitation mockup using template colors */}
                  <div
                    className="w-32 h-44 rounded-xl border shadow-sm flex flex-col items-center justify-center gap-2 p-4 text-center"
                    style={{
                      background: template.secondary,
                      borderColor: template.primary + "40",
                    }}
                  >
                    <div
                      className="w-10 h-px"
                      style={{ background: template.primary }}
                    />
                    <div
                      className="text-xs font-semibold leading-tight"
                      style={{ color: template.primary, fontFamily: "serif" }}
                    >
                      S &amp; J
                    </div>
                    <div
                      className="text-[9px] leading-tight"
                      style={{ color: template.accent }}
                    >
                      June 2026
                    </div>
                    <div
                      className="w-10 h-px mt-1"
                      style={{ background: template.accent }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: template.primary }}
                    />
                  </div>
                </div>
                <div className="mt-3 px-1">
                  <h3 className="font-display text-base font-semibold text-dearly-text">
                    {template.name}
                  </h3>
                  <p className="text-xs text-dearly-text-muted mt-0.5 leading-snug">
                    {template.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Browse all link */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.2 }}
            className="mt-10 text-center"
          >
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-xl border border-dearly-border bg-dearly-card/60 backdrop-blur-sm px-7 py-3 text-sm font-semibold text-dearly-text transition-all hover:bg-dearly-card hover:shadow-soft hover:-translate-y-0.5"
            >
              Browse All 20 Templates
              <span className="text-dearly-accent">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 4. Feature Showcase ── */}
      <section className="py-24 bg-dearly-card/40">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] text-dearly-text-muted uppercase mb-3">
              Features
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-dearly-text">
              Everything Your Guests{" "}
              <span className="text-dearly-accent">Will Love</span>
            </h2>
          </motion.div>

          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Feature tabs */}
            <div className="flex flex-col gap-2">
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                const isActive = i === activeFeature;
                return (
                  <motion.button
                    key={feature.id}
                    onClick={() => setActiveFeature(i)}
                    whileHover={{ x: 4 }}
                    transition={SPRING}
                    className={`flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? "bg-dearly-accent-soft border border-dearly-accent/30 shadow-soft"
                        : "hover:bg-dearly-cream border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive
                          ? "bg-dearly-accent text-white"
                          : "bg-dearly-cream text-dearly-text-muted"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div
                        className={`text-sm font-semibold transition-colors ${
                          isActive
                            ? "text-dearly-accent"
                            : "text-dearly-text-secondary"
                        }`}
                      >
                        {feature.label}
                      </div>
                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-xs text-dearly-text-muted mt-1 leading-relaxed overflow-hidden"
                          >
                            {feature.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Animated mockup panel */}
            <div className="relative bg-dearly-cream rounded-3xl border border-dearly-border shadow-card min-h-[340px] flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full p-8"
                >
                  <FeatureMockup feature={FEATURES[activeFeature]} />
                </motion.div>
              </AnimatePresence>
              {/* Progress bar */}
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-dearly-border">
                {!isPaused && (
                  <motion.div
                    key={activeFeature}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="h-full bg-dearly-accent"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. How It Works ── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
            className="text-center mb-20"
          >
            <p className="text-xs tracking-[0.3em] text-dearly-text-muted uppercase mb-3">
              How it works
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-dearly-text">
              Up &amp; Running in{" "}
              <span className="text-dearly-accent">Minutes</span>
            </h2>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* SVG connecting line (desktop only) */}
            <svg
              className="hidden md:block absolute top-10 left-0 right-0 w-full h-4 pointer-events-none"
              style={{ top: "2.5rem" }}
              viewBox="0 0 800 16"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M 133 8 H 666"
                stroke="rgb(var(--dearly-border))"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
              />
            </svg>

            {[
              {
                step: "01",
                icon: Palette,
                title: "Pick a Template",
                desc: "Browse 10 stunning themes and choose the one that captures your love story's aesthetic.",
              },
              {
                step: "02",
                icon: Sliders,
                title: "Customize Everything",
                desc: "Upload your photos, change colors, add your story, and personalize every detail.",
              },
              {
                step: "03",
                icon: Share2,
                title: "Share with Guests",
                desc: "Send your unique link — guests open a beautiful animated experience instantly.",
              },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: 0.2 + i * 0.2 }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="w-20 h-20 rounded-2xl bg-dearly-card border border-dearly-border shadow-card flex items-center justify-center mb-5 relative z-10">
                  <Icon size={28} className="text-dearly-accent" />
                </div>
                <div className="text-xs font-bold tracking-widest text-dearly-text-muted mb-2">
                  STEP {step}
                </div>
                <h3 className="font-display text-xl font-semibold text-dearly-text mb-3">
                  {title}
                </h3>
                <p className="text-sm text-dearly-text-secondary leading-relaxed max-w-xs">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Testimonials ── */}
      <section className="py-24 bg-dearly-card/40">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] text-dearly-text-muted uppercase mb-3">
              Testimonials
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-dearly-text">
              Loved by <span className="text-dearly-rose">Couples</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.couple}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: i * 0.15 }}
                style={{ rotate: t.rotation }}
                className="bg-dearly-card border border-dearly-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Heart
                      key={j}
                      size={12}
                      className="text-dearly-rose fill-dearly-rose"
                    />
                  ))}
                </div>
                <p className="text-sm text-dearly-text-secondary leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-dearly-accent-soft flex items-center justify-center">
                    <Heart
                      size={12}
                      className="text-dearly-accent fill-dearly-accent"
                    />
                  </div>
                  <span className="text-sm font-semibold text-dearly-text">
                    {t.couple}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Final CTA ── */}
      <section className="py-32 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgb(var(--dearly-accent) / 0.12) 0%, rgb(var(--dearly-rose) / 0.12) 50%, rgb(var(--dearly-gold) / 0.08) 100%)",
          }}
        />
        {/* Decorative rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-dearly-accent/10 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border border-dearly-rose/10 pointer-events-none"
        />

        <FloatingHeart x="10%" y="20%" size={20} delay={0} duration={6} />
        <FloatingHeart x="85%" y="30%" size={16} delay={1.5} duration={7} />
        <FloatingHeart x="20%" y="70%" size={14} delay={0.8} duration={5.5} />
        <FloatingHeart x="75%" y="65%" size={22} delay={2.2} duration={8} />

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-dearly-accent-soft border border-dearly-accent/30 flex items-center justify-center">
                <Heart
                  size={28}
                  className="text-dearly-accent fill-dearly-accent"
                />
              </div>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-dearly-text mb-4">
              Ready to Begin Your{" "}
              <span className="text-dearly-accent">Forever?</span>
            </h2>
            <p className="text-lg text-dearly-text-secondary mb-10 leading-relaxed">
              Create your free wedding site in minutes. No design skills needed.
              Just pure, beautiful love.
            </p>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-2xl bg-dearly-accent px-10 py-5 text-lg font-semibold text-white shadow-card transition-all hover:opacity-95 hover:shadow-[0_0_40px_rgb(var(--dearly-accent)/0.4)] hover:-translate-y-1"
            >
              Create Your Wedding Site — Free
              <Heart
                size={18}
                className="fill-white text-white group-hover:scale-125 transition-transform"
              />
            </Link>
            <p className="mt-4 text-sm text-dearly-text-muted">
              No credit card required. Free forever for the basics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 8. Footer ── */}
      <footer className="border-t border-dearly-border bg-dearly-card/40 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-xl font-bold text-dearly-accent">
            Dearly
          </span>
          <div className="flex items-center gap-6 text-sm text-dearly-text-muted">
            <Link
              href="/privacy"
              className="hover:text-dearly-text-secondary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-dearly-text-secondary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="hover:text-dearly-text-secondary transition-colors"
            >
              Contact
            </Link>
          </div>
          <p className="text-sm text-dearly-text-muted">
            &copy; {new Date().getFullYear()} Dearly. Made with love.
          </p>
        </div>
      </footer>
    </div>
  );
}
