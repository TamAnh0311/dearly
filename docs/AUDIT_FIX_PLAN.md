# Template visual fix plan — 43 invitations

**Created:** 2026-11-09  
**Status:** Phase 0 done; Phases 1–3 pending  
**Source audit:** `.shots/audit2/` (172 screenshots, 15 contact sheets)  
**Goal:** close the visible defects and systemic polish gaps found in the all-template visual audit without changing guest-facing features.

---

## 1. Context

The audit covered every slug in `src/components/templates/registry.ts` (43 active
templates) on a 390×844 phone and a 1440×900 desktop, using
`/templates/<slug>?embed=1&bare=1`.

Capture rules that stay in force:

- Run screenshots **sequentially** (or ≤2 processes) with `SHOT_WAIT_MS>=8000`.
  Six parallel Chrome instances starved RAF and produced false "clipped name" artifacts.
- If the dev server dies with `Cannot find module './vendor-chunks/@opentelemetry.js'`,
  kill port 3000, `rm -rf .next`, restart `nohup npm run dev`.
- Storybook templates intentionally hide blessings/reactions/story/gallery/gift/families
  (`src/app/templates/[slug]/page.tsx:269-271`); do not "fix" those absences.

---

## 2. Phase 0 — completed (baseline)

| Fix | File | Evidence |
| --- | --- | --- |
| Blessing pill no longer collides with opening covers / scroll cue; moved to bottom-right, `z-20`, compact `♥ N` label on mobile | `src/components/invitation/effects/BlessingShower.tsx` | `.shots/audit2/fixcheck/` |
| Arch hero flower clusters anchored to the arch base instead of viewport corners | `src/components/invitation/sections/Hero.tsx` (`ArchHero`) | `.shots/audit2/fixcheck/p2-d-terracotta.png` |
| Cleared corrupted `.next` (`@opentelemetry` vendor crash) | — | dev server healthy |

`npx tsc --noEmit -p .` → 0 errors.

---

## 3. Priority model

- **P0** — visibly broken or unreadable; fix before any new design work.
- **P1** — systemic quality gap that makes many templates feel unfinished.
- **P2** — polish, dev-only warnings, and optional differentiation.

---

## 4. Phase 1 — P0 visible defects

### 1. `sunset` — "Save the date" is white on bright grass

- **Where:** `SplitHero` in `src/components/invitation/sections/Hero.tsx:545-553`.
- **Cause:** fixed `color: "#ffffff"` with only a 55% background gradient at the
  photo's bottom edge; bright photos (sunset) lose contrast.
- **Fix:** put the label on a scrim (rounded translucent plate or a stronger
  bottom-up gradient) and derive the scrim from `palette.background`/`ink`;
  keep it non-interactive.
- **Acceptance:** ≥4.5:1 text contrast on the demo photo and on a light scheme;
  no plate visible over dark photos (blend with gradient).
- **Files:** `sections/Hero.tsx`; screenshot `sunset` phone + one light scheme.

### 2. `hanbok` — bojagi card/flap clipped at the bottom on short phones

- **Where:** `BojagiHero` in `src/components/invitation/sections/HeroAsian.tsx:524-585`.
- **Cause:** square card `w-[min(84vw,60vh,500px)]` + `pt-10` + venue line + the
  bottom flap does not reserve safe space at 360×740; the bottom flap can be cut
  by the section edge during the unfold.
- **Fix:** cap the card by available height (subtract header/venue/foot height),
  or reduce `60vh` and add bottom padding; verify the final flap state is inside
  the section.
- **Acceptance:** at 360×740 and 390×844 the card, both names, date and venue are
  fully visible; bottom flap settles fully on-screen; skip control reachable.
- **Files:** `sections/HeroAsian.tsx`.

### 3. `rosewindow` — bokeh blobs sit over the date/venue

- **Where:** ambient bokeh (`src/components/invitation/effects/Particles.tsx`,
  bokeh branch ~line 423) rendered by the `stained` hero.
- **Cause:** bokeh spawns across the full hero, including the text block; large
  soft circles reduce legibility on the dark stained glass.
- **Fix:** for `stained` (or where the hero exposes a content rect), keep bokeh
  out of the central text band (edge-weighted spawn) or drop its opacity behind
  text; do not remove the effect globally.
- **Acceptance:** date, venue and names remain crisp at 390×844; bokeh still
  visible at the edges; unaffected templates keep current look.
- **Files:** `effects/Particles.tsx`, optionally `sections/HeroSignature.tsx`.

### 4. Ambient particles spawned half-off the edge

- **Where:** `src/components/invitation/effects/Particles.tsx:140`
  (`left: seeded(i) * 100`) and bokeh `:181`, `:429`.
- **Cause:** spawn x = 0–100% with a visible radius, so leaves/petals start
  clipped at the left/right edge (seen as a lone half-leaf top-left).
- **Fix:** map spawn x into a safe band (e.g. 4–96%) or fade opacity at the
  edges; keep seeded determinism (no `Math.random()` in render).
- **Acceptance:** no partially clipped particle at rest in a 10s capture; motion
  and counts unchanged; reduced-motion still static.
- **Files:** `effects/Particles.tsx`; test in `Particles` if a helper is added.

---

## 5. Phase 2 — systemic polish (P1)

### 5. Low-contrast micro-copy on light schemes

- **Symptom:** uppercase tracking labels (`inkMuted` at small sizes) fade on
  cream/ivory backgrounds across many templates.
- **Approach:** audit `inkMuted` generation in `utils.ts` (`buildPalette`);
  raise the floor for light backgrounds or add a `microInk` token; replace
  one-off low-alpha `primary` labels with the token.
- **Acceptance:** every section label ≥4.5:1 on light and dark demo schemes;
  no visual regression on dark templates.
- **Files:** `utils.ts`, section headers/eyebrows.

### 6. Desktop composition is mobile-tuned

- **Symptom:** at 1440px, content sits in a ~400–700px column with large empty
  margins; heroes and sections read as a phone layout centred on desktop.
- **Approach:** add `lg:` composition per hero family (two-column for `split`,
  wider media for `arch`/`garden`, larger type scale) before touching sections;
  keep mobile unchanged. Compare against `.shots/audit2/desktop2/`.
- **Acceptance:** desktop screenshots show intentional use of width (no dead
  half-screen unless the design calls for it); phone screenshots unchanged.
- **Files:** hero components; `sections/*` spacing only where needed.

### 7. Dev-only React warnings

- **Hydration mismatch** on SVG float coordinates (`eternal`, `deco`, `luxe`,
  `soiree`, `chateau`): round seeded coordinates to 3 decimals before render.
- **`inert` non-boolean warning** (`garden`, `cherry`, `whimsical`, `confetti-pop`,
  `balloon-bash`): pass `inert=""`/ref-based inert instead of a boolean.
- **Acceptance:** no console errors/warnings on those slugs in dev.
- **Files:** whichever hero/effect renders the SVG/inert; keep changes local.

---

## 6. Phase 3 — optional (P2)

### 8. Blessings/reactions look identical across templates

- Shared functionality is a product rule, so only **styling** should diverge:
  card radius (`palette.radius`), ornament accent, entrance motion, heading
  treatment per `palette.style`.
- Acceptance: two visually adjacent templates (e.g. `eternal` vs `deco`) read
  differently in the blessing wall without any behavioural change.

### 9. Storybook parity check

- Confirm the intentional hidden sections still look deliberate (no orphaned
  headings or empty gaps) after Phase 1/2 changes.

---

## 7. Verification per change

```bash
npm test
npx tsc --noEmit -p .
npm run lint
npm run build
```

Visual QA (server running, sequential):

```bash
node scripts/screenshot.mjs .shots/fixcheck/phase1 \
  "http://localhost:3000/templates/sunset|sunset|#hero" \
  "http://localhost:3000/templates/hanbok|hanbok" \
  "http://localhost:3000/templates/rosewindow|rosewindow"
```

Also capture 360×740 (`SHOT_SIZE=360x740`) for `hanbok` and one light scheme +
one dark scheme for any contrast change.

---

## 8. Rollback

- Each phase is independently revertible; keep commits scoped per item.
- Reverting the Phase 0 edits is safe: `git checkout -- src/components/invitation/effects/BlessingShower.tsx src/components/invitation/sections/Hero.tsx`.
- Screenshots in `.shots/audit2/fixcheck/` are the before/after record; do not
  commit `.shots/` unless requested.

---

## 9. Open questions

1. Confirm which element the user meant by "some element is broke UI" if it is
   not one of the P0 items above.
2. Is the desktop composition overhaul (Phase 2, item 6) in scope now, or only
   the P0 defects?
3. Should the dev-only hydration/`inert` warnings be fixed in this pass?
