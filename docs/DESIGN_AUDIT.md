# Design audit — all 37 wedding templates

**Date:** 2026-10-26  
**Scope:** every row in `public.templates` (37 slugs), hero + RSVP on mobile and a
desktop pass.  
**Goal:** move Dearly from "template gallery" quality to hand-made studio
quality, using the Glow watercolour suite and Easy Wedding cover/editorial
references as the benchmark.

## 1. Method

- Captured 74 screenshots at 390×844 with
  `?embed=1&bare=1` (hero and `#rsvp` per template) plus desktop spot checks.
- Built seven contact sheets (`.shots/audit/sheet-1..7.jpg`) and reviewed all 37
  side by side.
- Scored six dimensions on a 1–5 scale, then collapsed them into tiers to avoid
  false precision:

  | Dimension | What "5" means |
  | --- | --- |
  | Identity | Recognisable without the logo; not interchangeable with a neighbour |
  | Art direction | Bespoke illustration/photography, intentional props and framing |
  | Typography | Display/body pairing carries the story; no default rounded sans |
  | Motion | One choreographed signature moment; calm below the hero |
  | Cohesion | Hero language continues into story/venue/RSVP/blessings |
  | Mobile craft | 360–390px safe, readable, no fixed-UI collisions |

Evidence: `.shots/audit/*-hero.png`, `.shots/audit/*-rsvp.png`,
`.shots/audit/sheet-1..7.jpg`.

## 2. Results by tier

### A — strongest identities (8)

| Template | Why it already works |
| --- | --- |
| `enso` | One brush circle, paper, hanko; type and motion are one idea |
| `noir` | Editorial type and restraint; nothing decorative competes |
| `minimal` | Same discipline, opposite palette; strong hierarchy |
| `nordic` | Cold light, snow, clean spacing; unmistakably itself |
| `double-happiness` | Lacquer doors + 囍 medallion; culture is the layout |
| `hanbok` | Bojagi cloth unfolds; colour and shape are the interaction |
| `velvet` | Theatre curtains, swags, footlights; cinematic entrance |
| `wax-seal` | Envelope, seal, scratch reveal; a complete story in 3 seconds |

These need preservation, not redesign. Improve shared sections and mobile
spacing only.

### B — solid concept, generic execution (17)

`celestial`, `crimson-keepsake`, `deco`, `dusk`, `eternal`, `glass`,
`lantern-night`, `luxe`, `neon-night`, `rosewindow`, `sakura`, `secret-garden`,
`seigaiha`, `seoul-studio`, `soiree`, `terracotta`, `vintage`.

Typical issues: a good hero idea followed by default centred-card sections;
ornaments that do not change with the template; thumbnails that hide the best
part of the layout. Fix by extending the hero's material (paper, engraving,
neon, night sky) into 2–3 lower sections, not by replacing the hero.

### C — weakest, highest priority (12)

| Template | Main problem |
| --- | --- |
| `bloom` | Flat daisy clusters, playful body font, generic centred hero — **now replaced by the `atelier` pilot** |
| `balloon-bash` | Garden layout with party props bolted on; balloons don't carry the type |
| `confetti-pop` | Polaroid + confetti reads as a birthday flyer, not an invitation |
| `cherry` | Sakura palette but generic garden hero and toy-like flowers |
| `garden` | The "default" template: centred names + flat daisies |
| `whimsical` | Playful stack of ideas, no single signature |
| `vineyard` | Split photo + leaves; could be any destination template |
| `sunset` | Gradient sky + split photo; lacks a designed object |
| `boho` | Arch + paper texture, but ornaments are default vectors |
| `rustic` | Same arch language as boho with different colours |
| `seaside` | Photo split + blue; no bespoke coastal art |
| `polaroid` | Photo stack is charming but the type and props feel toy-like |

## 3. Systemic findings

1. **Sameness is structural, not chromatic.** Eleven templates share the same
   centred-name-over-flower-clusters composition; swapping palettes does not
   change the silhouette. 16 hero layouts for 37 templates means most
   differentiation has to come from art, type and section treatment.
2. **Flat vector daisies undercut every luxury palette.** The five-ellipse
   `FlowerCluster` reads as clip-art at any size. Real brush texture or nothing.
3. **Playful body fonts break formal occasions.** Quicksand/Nunito on
   `bloom`, `secret-garden`, `garden`, `cherry` and `terracotta` fights the
   serif display face. Use a geometric/grotesque neutral (`Jost`, `Lato`,
   `Inter`) or a second serif.
4. **Heroes are designed; sections are not.** RSVP and blessings revert to the
   same white rounded cards on every template. The design language needs to
   reach at least Story, Venue and RSVP.
5. **Fixed UI eats the mobile hero.** The blessings pill and music button sit
   over the bottom 70px; several heroes put their date or scroll cue there.
6. **Thumbnails hide the signature.** Gallery cards crop the most distinctive
   part (doors, arch, curtain) so browsing feels flatter than opening a
   template.
7. **Contrast needs a pass.** Muted rose/gold text on ivory frequently lands
   near 3:1 in section subtitles. Dark schemes are generally safer.

## 4. Pilot: `bloom` → `atelier`

The first fix targets the biggest offender and creates a reusable art system.

| Before | After |
| --- | --- |
| `garden` hero, flat daisies, Quicksand body | `atelier` hero: arched museum watercolour, crisp peony/eucalyptus/cherry sprays, Cormorant + Jost |
| No art below the hero | Story gets a pressed-flower wreath medallion; Venue gets a painted postcard header; RSVP gets a peony stem |
| Default floral divider | Thin rule ornament, caps eyebrow, normal-case headings, paper texture |
| Flowers drawn in hero/venue | Flat flowers disabled for this template |

Code: `sections/HeroAtelier.tsx`, `art.ts`, `sections/ArtSpray.tsx`,
`Story.tsx`, `VenueMoments.tsx`, `RsvpSection.tsx`, `styles.ts`.
Evidence: `.shots/atelier/v5-*` (light/dark, mobile/desktop, hero/story/venue).

Why art direction beats another palette: the hero's identity now comes from a
specific painting, an arch frame and a flower that overlaps the paper — not
from a background colour.

## 5. Recommended sequence

1. **Finish the painted family (2–3 more templates).** Reuse the kit's sprays on
   `garden`, `secret-garden` and `whimsical`, each with a different painting or
   composition, so the family shares craft without sharing a layout.
2. **Build an editorial family for `boho`/`rustic`/`vineyard`/`sunset`.**
   Photography-led covers with a magazine grid and real location typography.
3. **Night-sky family for `celestial`/`dusk`/`lantern-night`.** Public-domain
   astronomical engravings/paintings; one skyline, one moon, no star confetti.
4. **Party family for `balloon-bash`/`confetti-pop`.** Treat as a different
   product: poster typography, one oversized object, not wedding flowers.
5. **Preserve A-tier heroes.** Only shared-section and mobile-safe-area work.
6. **Screenshot gate.** Every change ships with 390×844 and 1440×900 shots in a
   light and a dark scheme, hero + `#story` + `#venue` + `#rsvp`.

## 6. Definition of done for a redesign

- Hero has one named signature moment and an art source with a licence file.
- At least two lower sections visibly share the hero's material.
- Body font is not a playful rounded sans.
- Light and dark schemes both pass a contrast spot check.
- No fixed UI overlaps names, date, venue or primary CTA at 390×844.
- Thumbnail shows the signature, not a generic centre crop.
- Tests, typecheck, lint and production build pass.
