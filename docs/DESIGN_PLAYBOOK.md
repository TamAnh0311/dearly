# Dearly Design Playbook

How to design a template opening ("hero") that feels hand-made and cinematic, not generic. This playbook expands [AGENTS.md section 4](../AGENTS.md#4-design-guideline) with the *process*, the *techniques* and the *traps* behind the signature heroes (curtain, wax seal, lacquer doors, ensō, shoji, bojagi…).

## Contents

1. [Purpose](#1-purpose)
2. [The process (do these in order)](#2-the-process-do-these-in-order)
3. [Anatomy of a great hero](#3-anatomy-of-a-great-hero)
4. [Technique cookbook](#4-technique-cookbook)
5. [Traps we hit (and the fix)](#5-traps-we-hit-and-the-fix)
6. [Visual QA loop](#6-visual-qa-loop)
7. [Self-critique checklist](#7-self-critique-checklist)
8. [Worked example: Double Happiness](#8-worked-example-double-happiness)
9. [New hero skeleton](#9-new-hero-skeleton)

---

## 1. Purpose

**Who it is for:** any agent or contributor adding a template, hero layout, ambient effect or invitation section.

**What "good" means here:** a guest opens the link on a phone and, within 3 seconds, sees one *physical* object do one *memorable* thing (doors swing, a brush paints, a cloth unfolds), then reads the names. It must still look right in every colour scheme, at 360 px wide, and with reduced motion.

**What makes most attempts mediocre:**
- designing from imagination instead of real references;
- stacking effects instead of committing to one signature moment;
- hard-coding colours;
- never looking at the result.

Every step below exists to prevent one of those.

## 2. The process (do these in order)

| Step | What you do | Output |
| --- | --- | --- |
| 1. Research | Look at 2–3 real products in the target style (e.g. Vietnamese invitation shops, Korean mobile invitations, The Digital Yes). Screenshot them on a phone viewport. Note **recurring features** (what every one of them has) separately from **visual motifs**. | A short list: "they all have parents' names, a gift QR, a heart-marked calendar…" plus motifs: "囍, red lacquer, lanterns". |
| 2. Pick the culture's *object* | Find a physical object guests already associate with the occasion: gate doors, a wrapping cloth, an envelope, sliding screens, a brush and seal. | One object per hero. |
| 3. Write the storyboard | 3–5 beats with timings (see section 3). One beat is the signature moment. | e.g. "0.3s medallion glows → 1.1s doors swing (1.9s) → 2.3s names rise → 2.4s lanterns drop". |
| 4. Derive colours | Every colour is `palette.*` or a `mix()` of a palette colour with a hue anchor. Decide what happens on a light *and* a dark scheme before writing code. | A few `const lacquer = …` lines at the top of the component. |
| 5. Build in layers | Background light → watermark/ornaments → ambient → content → the "mechanism" (doors/screens/flaps) on top, which leaves the frame. | A component in `sections/HeroAsian.tsx` (or a new file). |
| 6. Reduced-motion end state | Multiply every duration and delay by `t = reduce ? 0 : 1`. The end state must be the *opened* state. | It renders correctly with no animation. |
| 7. Wire it up | Add it to the `HeroLayout` union, the `Hero.tsx` dispatcher, `LAYOUT_LABEL`, `LayoutThumbnail`, the `utils.test.ts` assertion, `registry.ts` and a migration ([AGENTS.md section 5](../AGENTS.md#5-adding-a-template-checklist)). | |
| 8. Look at it | Screenshot loop (section 6): desktop, phone, original scheme, contrasting scheme. **Fix, then re-shoot.** | Screenshots you have actually opened. |

Features you found in step 1 that every product has belong in **shared sections**, not in one hero. Examples are the calendar, families, gift and live-chat blessings. Every template then gains them (see `CalendarCard.tsx`, `Extras.tsx`).

## 3. Anatomy of a great hero

```
z-30  Mechanism (doors / screens / flaps / curtain)   ← animates OUT of frame, pointer-events-none
z-10  Content: eyebrow → names (RisingText) → date → venue, wrapped in motion.div with contentY/contentOpacity
z-6   #hero-blessings layer (provided by Hero.tsx; don't cover it with opaque backgrounds)
z-5   Decor that belongs to the scene (hanging lanterns, sun disc, sakura branch)
      AmbientLayer (lanterns / petals / gold dust from style.ambient)
      Watermark (huge glyph or motif at 6–10% alpha)
z-0   Background light (radial-gradient from palette.primary/accent)
```

**Timeline budget** (matches AGENTS.md section 4.1):

| Beat | When | Duration | Example |
| --- | --- | --- | --- |
| Anticipation | 0–0.8s | 0.6–1.4s | Medallion glows, knot loosens, brush touches paper |
| Signature moment | 0.8–3s | ≤ 2s | Doors swing, screens slide, flaps unfold |
| Names | 1.8–3s | 1.1s per name (RisingText) | Rise from below |
| Details + scene decor | 2.4–3.5s | 1s | Date line, lanterns drop in, hanko stamps |
| Rest | after 3.5s | loops 6–30s | Lantern sway, ambient particles only |

Rules of thumb:
- **Anticipation sells the moment.** A glow or wiggle 0.5s *before* the doors open makes the opening feel intentional.
- **Stagger, don't sync.** Four flaps at 1.2 / 1.45 / 1.7 / 1.95s read as a cloth; four at once read as a CSS transition.
- **Springs for objects, ease-out for type.** A hanko seal uses `type: "spring", stiffness: 380, damping: 18`; text uses `EASE_OUT`.

## 4. Technique cookbook

All snippets are taken from working code in `src/components/invitation/sections/HeroAsian.tsx`.

### 4.1 3D doors / gates (rotateY with perspective)

```tsx
<div className="pointer-events-none absolute inset-0 z-30" style={{ perspective: 1800 }}>
  <motion.div
    className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"
    style={{ originX: 0 }}                       // hinge on the outer edge
    initial={{ rotateY: 0 }}
    animate={{ rotateY: -108 }}                  // > 90° so the door leaves the view
    transition={{ duration: 1.9 * t, delay: 1.1 * t, ease: [0.65, 0, 0.35, 1] }}
  />
</div>
```

**Split emblem across a seam:** put the same medallion in each door, centred on the seam (`left: 0` / `right: 0` + `translateX(±50%)`), and let each door's `overflow-hidden` crop its half. When the doors swing, the emblem splits.

### 4.2 Sliding panels (shoji, sliding doors)

```tsx
animate={{ x: left ? "-101%" : "101%" }}         // 101% so no 1px seam is left on screen
transition={{ duration: 1.7 * t, delay: 1 * t, ease: [0.7, 0, 0.3, 1] }}
```

Texture without images: a lattice made from two repeating gradients over the paper colour.

```tsx
const kumiko = `repeating-linear-gradient(0deg, transparent 0 62px, ${wood} 62px 66px),
                repeating-linear-gradient(90deg, transparent 0 46px, ${wood} 46px 50px)`;
style={{ background: `${kumiko}, ${paper}`, boxShadow: `inset 0 0 0 10px ${wood}` }}
```

### 4.3 Shutter / aperture reveal (clipPath)

```tsx
initial={{ clipPath: "inset(50% 0% 50% 0%)" }}   // a closed horizontal slit
animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
transition={{ duration: 1.8 * t, ease: [0.77, 0, 0.18, 1] }}
```

Pair it with a slow Ken Burns on the image underneath (`scale 1.18 → 1.02` over 9s).

### 4.4 Hand-drawn strokes (pathLength + brush filter)

```tsx
<filter id="brush"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
  <feDisplacementMap in="SourceGraphic" scale="5" /></filter>
<motion.path d={enso} stroke={sumi} strokeWidth={16} strokeLinecap="round" filter="url(#brush)"
  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2 * t, ease: [0.45, 0, 0.2, 1] }} />
```

- A second, thin, dashed copy offset by a few px reads as dry-brush texture.
- Leave a gap in the path. A real ensō is not closed.
- The filter is static, so only `pathLength` animates.

### 4.5 Unfolding flaps (bojagi, envelope)

Clip a full-size square into a triangle and rotate it around its outer edge:

```tsx
style={{ clipPath: "polygon(0 0, 100% 0, 50% 50%)", transformOrigin: "50% 0%", backfaceVisibility: "visible" }}
animate={{ rotateX: 178 }}                       // top flap; bottom = rotateX -178, left/right = rotateY ∓178
```

Patchwork from gradients (no images): offset seams plus a conic split, with palette colours washed toward the background.

```tsx
const wash = (c: string) => mix(c, palette.background, 0.28);
`conic-gradient(from 0deg at 38% 62%, ${a} 0 25%, ${b} 0 50%, ${c} 0 75%, ${d} 0)`
```

### 4.6 Watermark glyphs and CJK text

- Load **only the characters you draw** using Google Fonts' `text=` parameter (a few KB):
  ``https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&text=${encodeURIComponent("囍壽福寿")}&display=swap``
- Choose the glyph by occasion. `auspiciousGlyph()` returns 囍 for weddings, 壽 for birthdays and 福 otherwise. Never put 囍 on a birthday.
- Watermarks sit at 6–10% alpha, so they are felt rather than read.

### 4.7 Ambient effects

- Model new particles on `Lanterns` / `Balloons` in `effects/Particles.tsx`.
- Use `seeded(i + offset)` for every random value (SSR-safe), with a unique offset range per effect.
- Return `null` when `useReducedMotion()`.
- Keep ≤ 14 large objects and ≤ 30 small ones.
- Register the effect in the `Ambient` union (`styles.ts`) and in the `AmbientLayer` switch (`effects/Ambient.tsx`).

### 4.8 Colour derivation recipes

| Need | Recipe | Why |
| --- | --- | --- |
| Culture hue that still follows the scheme | `mix(palette.accent, "#9b1b1f", 0.7)` | Anchors "lacquer red" while light schemes stay rosy and dark schemes go deep. |
| Element that must pop on a same-hue background | `mix(lacquer, "#ff5a3c", 0.45)` | Red lanterns on a red page vanished; a brighter mix fixed it. |
| Gold that is never muddy | `luminance(palette.primary) > 0.3 ? palette.primary : mix(palette.primary, "#d4a445", 0.6)` | Some schemes use a dark primary. |
| Paper on light vs dark | `palette.isDark ? mix(bg, "#f4ede0", 0.82) : mix(bg, "#ffffff", 0.75)` | Paper should look like paper in both. |
| Text on any fill | `luminance(fill) > 0.45 ? "#2a1a14" : "#fff8ec"` (`inkOn()`) | Hanko seals, calendar header. |
| Text on photos | Fixed white plus a gradient scrim `rgba(0,0,0,.45) → transparent → rgba(0,0,0,.7)` | Photos ignore the palette. |

## 5. Traps we hit (and the fix)

| Symptom | Cause | Fix |
| --- | --- | --- |
| Watermark or knot sits off-centre | Tailwind `-translate-x-1/2` plus Framer `animate={{ scale }}`: Framer overwrites the CSS `transform`. | Put the offset in Framer: `style={{ x: "-50%", y: "-50%" }}`. Never mix Tailwind translate/rotate/scale classes with animated transforms. |
| SVG blossoms all render at the top-left corner | `<motion.g transform="translate(…)" animate={{ scale }}>`: Framer replaces the `transform` attribute. | Wrap it: an outer `<g transform="translate(x y)">` and an inner `<motion.g animate={{ scale }}>`. |
| Decor invisible | Same hue as the background (red on red). | Mix toward a brighter or darker anchor and add a glow `drop-shadow`. Check in the original scheme *and* a contrasting one. |
| Names, date and venue hidden on phones | Fixed UI (blessings toggle, music button) overlaps the hero bottom. | Keep ≥ `pb-24` of clear space at the bottom of mobile heroes. |
| Photo hero blank for couples without photos | No fallback. | In the `Hero.tsx` dispatcher: `if (layout === "poster" && photos.length < 1) layout = "enso";` |
| Demo shows the wrong photo | `PLACEHOLDER_IMAGES.couple[0]` is empty chairs. | Choose demo photos per hero (`templates/[slug]/page.tsx`). |
| Mobile looks "wrong" but desktop is fine | Sizes in fixed `rem`. | Use `w-[min(88vw,66vh,560px)]` and `text-[clamp(2.4rem,8.5vw,5rem)]`. |
| Migration rejected | `animation_style` has a CHECK constraint (`subtle`, `cinematic`, `interactive`). | Read earlier migrations before inventing values. Always dry-run first. |
| Screenshot shows a closed door or blank names | Captured before the dev server compiled or hydrated. | Warm the URL first with a request, then use `SHOT_WAIT_MS=8000`. |
| `Cannot find module ./vendor-chunks/...` in dev | Corrupted `.next` (a build ran while dev was running). | Stop dev, delete `.next`, restart. |
| PowerShell edit "succeeds" but nothing changed, or a ParserError | Apostrophes/backticks inside quoted script strings. | Use the Edit tool for code containing `'`, `` ` `` or `$`. Verify with grep afterwards. |

## 6. Visual QA loop

Start the dev server (`npm run dev`), warm the pages, then shoot. Open **every** image you capture.

```powershell
# Warm (first compile can take minutes on Windows)
Invoke-WebRequest http://localhost:3000/templates/hanbok -UseBasicParsing -TimeoutSec 300 | Out-Null

# Desktop, after the opening finished
$env:SHOT_WAIT_MS="8000"
node scripts/screenshot.mjs .shots "http://localhost:3000/templates/hanbok|hanbok" "http://localhost:3000/templates/hanbok?scheme=emerald|hanbok-dark"

# Sections
node scripts/screenshot.mjs .shots "http://localhost:3000/templates/crimson-keepsake|ck-cal|#celebrate" "http://localhost:3000/templates/seoul-studio|ss-gift|#gift"

# Phone (360–390 px wide); bare mode hides the preview banner
$env:SHOT_SIZE="390x844"
node scripts/screenshot.mjs .shots "http://localhost:3000/templates/hanbok?embed=1&bare=1|m-hanbok"
Remove-Item Env:SHOT_SIZE

# Mid-animation frame (check the signature moment itself)
$env:SHOT_WAIT_MS="1800"
node scripts/screenshot.mjs .shots "http://localhost:3000/templates/double-happiness|dh-opening"
```

**Parameters:**
- `SHOT_SIZE`: `WIDTHxHEIGHT` (default `1440x900`).
- `SHOT_WAIT_MS`: wait after load (default `5500`).
- `|name`: output file name.
- `|#id`: scroll to that section first.
- `?scheme=<id>`: start on that colour scheme (ids in `COLOR_SCHEMES`).

Minimum set per new hero:
- desktop, original scheme;
- desktop, contrasting scheme (light ↔ dark);
- phone, original scheme;
- one mid-animation frame;
- `#celebrate`, `#rsvp`, `#blessings`;
- any new section.

Re-shoot after every fix. A fix you didn't look at is not a fix.

## 7. Self-critique checklist

Run through this while looking at your screenshots. Be your harshest reviewer.

- [ ] **One signature moment.** Can you describe the opening in one sentence ("the doors swing open")? If it takes two sentences, cut something.
- [ ] **Physical object.** Does the mechanism look like a *thing* (frame, studs, hinge side, shadow, texture), or a flat rectangle?
- [ ] **Anticipation beat** before the main move?
- [ ] **Names readable by ~2.5s**, with nothing important hidden behind the mechanism or the fixed buttons?
- [ ] **Culturally correct.** Right glyph for the occasion, no mixing of traditions within one template (囍 is shared by Chinese, Vietnamese and Korean weddings; 寿 is a Japanese celebration seal).
- [ ] **Scheme-proof.** Original plus a contrasting scheme both look intentional, with no element vanishing into the background.
- [ ] **Phone-proof** at 390 px: nothing clipped, no horizontal scroll, bottom clear of floating UI.
- [ ] **Reduced motion** shows the opened end state.
- [ ] **Calm after the opening.** Only slow loops (lantern sway, particles) remain.
- [ ] **Thumbnail** in `LayoutThumbnail.tsx` actually resembles the hero.
- [ ] **Demo data fits.** Culture-matched names, and photos that show a couple, not chairs.

## 8. Worked example: Double Happiness

1. **Research.** Vietnamese and Chinese invitation shops: red and gold everywhere, 囍 on everything, lanterns, the families of both sides named, a gift QR code.
2. **Object.** Traditional courtyard gate doors: lacquer, gold studs, ring knockers.
3. **Storyboard.**
   - 0.3s: 囍 medallion glow (anticipation).
   - 1.1s: doors swing out in 3D (1.9s).
   - 2.0s: watermark 囍 fades in.
   - 2.3s: names rise.
   - 2.4–2.6s: lanterns drop on strings and keep swaying.
4. **Colours.**
   - `lacquer = mix(accent, "#9b1b1f", 0.7)` (dark schemes: `mix(background, "#a3161c", 0.45)`);
   - `gold` guarded by `luminance`;
   - `lantern = mix(lacquer, "#ff5a3c", 0.45)`, added after the first screenshot showed invisible lanterns.
5. **Layers.** Background glow → watermark → `AmbientLayer` (sky lanterns + gold dust) → hanging lanterns → names → doors (z-30).
6. **Shared features discovered in research.** `CalendarCard`, `Families`, `GiftSection` and the live-chat blessing style went in as shared sections for *all* templates. `calendar: true` is a style token.
7. **QA findings fixed.**
   - The watermark was off-centre (trap: Tailwind translate plus Framer scale).
   - The lanterns were invisible.
   - Both were verified by re-shooting.

## 9. New hero skeleton

Copy this, rename, and fill in the storyboard. It already follows every rule above.

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import AmbientLayer from "../effects/Ambient";
import { EASE_OUT, alpha, mix } from "../utils";
import { CenterNames, useEyebrow } from "./HeroParts";
import type { LayoutProps } from "./Hero";

/** <Name>Hero: <one sentence describing the signature moment>. */
export function MyHero({ wedding, palette, contentY, contentOpacity }: LayoutProps) {
  const reduce = useReducedMotion();
  const t = reduce ? 0 : 1; // multiply every duration/delay; reduced motion = opened end state
  const eyebrow = useEyebrow("Wedding-only kicker"); // other events get their own copy
  const material = palette.isDark ? mix(palette.background, "#ffffff", 0.1) : mix(palette.accent, "#000000", 0.2);

  return (
    <>
      {/* z-0 background light */}
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 55% at 50% 45%, ${alpha(palette.primary, 0.2)} 0%, transparent 70%)` }} />
      <AmbientLayer palette={palette} intensity={0.7} />

      {/* z-10 content (parallax + fade on scroll) */}
      <motion.div className="relative z-10 px-6" style={{ y: contentY, opacity: contentOpacity }}>
        <CenterNames palette={palette} wedding={wedding} delay={2.2 * t} eyebrow={eyebrow} />
      </motion.div>

      {/* z-30 mechanism: leaves the frame during the signature moment */}
      <div className="pointer-events-none absolute inset-0 z-30" style={{ perspective: 1600 }} aria-hidden>
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2"
          style={{ originX: 0, background: material }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: -105 }}
          transition={{ duration: 1.8 * t, delay: 1 * t, ease: [0.65, 0, 0.35, 1] }}
        />
      </div>
    </>
  );
}
```

Then follow [AGENTS.md section 5](../AGENTS.md#5-adding-a-template-checklist) to register it, and the QA loop in [section 6](#6-visual-qa-loop) before calling it done.
