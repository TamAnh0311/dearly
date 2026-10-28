# Chateau Template — Design Spec

**Date:** 2026-10-27
**Reference:** Glow Website (Video 1) — Vietnamese premium wedding invitation

## Overview

A new premium wedding invitation template inspired by Glow's watercolour atelier style. The "Chateau" template delivers a hand-painted French countryside estate aesthetic with dense botanical layering, golden ornate arch frames, ambient doves/swans, and rich floral decoration on every section.

## Design Identity

**Mood:** Hand-painted invitation from a French garden estate — every section feels like a page from an illustrated wedding book.

**Key differentiators from existing Bloom template:**
- Brand new hero layout ("chateau") with ornate golden arch frame + botanical SVG decorations growing around the frame
- New "chateau" art collection with distinct paintings (estate gardens, swan lake pavilion)
- Dense botanical SVG overlays on EVERY section (corners, borders, dividers) — not just the hero
- Richer, more layered animations (parallax painting, growing vines, drifting doves/swans)
- Golden ornate section dividers between all sections
- Arched frames on calendar card and key content areas

## Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#B8943E` | Gold accents, ornate frames, CTA |
| Secondary | `#FBF7EF` | Cream paper background |
| Accent | `#4A6741` | Forest green botanicals |
| Ink | derived | Dark olive text |
| Leaf | `#6B8A5E` | Botanical overlay tint |

## Typography

| Role | Font | Fallback |
|------|------|----------|
| Display | Playfair Display | serif |
| Body | Jost | sans-serif |
| Script | (palette default) | cursive |

## Art Collection: "chateau"

New art collection at `/public/art/chateau/`. Requires CC-licensed watercolour-style paintings:

| Asset | Subject | Dimensions |
|-------|---------|------------|
| `hero` | Grand estate / garden ceremony with arch/gazebo (landscape) | ~1800×1013 |
| `heroPortrait` | Same scene, portrait crop for mobile | ~1200×1500 |
| `venue` | Swan lake / garden pavilion watercolour | ~1800×1013 |
| `sprays` | Reuse watercolour-garden botanicals (peonies, eucalyptus, roses, etc.) | existing |

**Sourcing:** Search BudgetPixel, Unsplash, Wikimedia Commons, or public-domain museum art for CC/CC-BY licensed watercolour paintings. Generate blur placeholders for each.

## Hero Layout: "chateau"

New component `HeroChateau.tsx`:

1. **Full-viewport watercolour painting** as background with parallax scroll
2. **Golden ornate arch frame** centered — double-rule arch border with botanical SVG decorations (leaves, small flowers, vine tendrils) growing along the arch edges
3. **Names** in Playfair Display, centered in arch
4. **Script conjunction** ("and" / "và") between names
5. **Date and location** below names
6. **Animated doves** — 2-3 dove SVGs drifting slowly across the sky
7. **Botanical corner clusters** — SVG flower/leaf compositions in top-left and top-right corners that grow in on load
8. **Painting fade** — bottom of hero painting fades into the paper background color via gradient mask
9. **Scroll parallax** — painting moves slower than text content

## Section Enhancements (chateau-aware)

Every section gets botanical decoration when `palette.style.hero === "chateau"`:

### Botanical Corner Overlays
- Shared `ChateauCorners` component — SVG flower/leaf clusters positioned at section corners
- Used on: Countdown, Schedule, VenueMoments, Story, RSVP, Footer

### Golden Ornate Dividers
- SVG ornamental divider between sections (scrollwork + leaf motif)
- Replaces simple line dividers

### CalendarCard
- Arched double-rule card (similar to atelier but with botanical SVG ornaments on the arch)
- Gold circled date

### Schedule
- Timeline with botanical illustration alongside (small leaf/flower SVG at each time entry)

### Footer
- Monogram in ornate circular botanical wreath
- Dense flower border at bottom edge
- Art credits (CC BY attribution)

## Style Config

```typescript
chateau: {
  music: "orchestral",
  hero: "chateau",
  art: "chateau",
  bodyFont: "Jost",
  ambient: ["petals", "gold-dust", "bokeh"],
  ornament: "floral",
  corners: "arch",
  texture: "paper",
  eyebrow: "caps",
  headingCase: "normal",
  flowers: false,
  calendar: true,
}
```

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/invitation/sections/HeroChateau.tsx` | New hero layout |
| `src/components/invitation/sections/ChateauDecor.tsx` | Shared botanical corners, dividers, wreath SVGs |
| `src/components/templates/chateau/theme.ts` | Theme colors/fonts |
| `src/components/templates/chateau/index.ts` | Barrel export |
| `src/components/templates/chateau/GalleryLayout.tsx` | Gallery view |
| `src/components/templates/chateau/GuestbookSection.tsx` | Guestbook view |
| `public/art/chateau/` | Art assets |
| `supabase/migrations/00022_add_chateau_template.sql` | DB migration |

## Files to Modify

| File | Change |
|------|--------|
| `src/components/invitation/art.ts` | Add "chateau" art collection |
| `src/components/invitation/styles.ts` | Add "chateau" style + add to SHOWCASE_ORDER if exists |
| `src/components/invitation/sections/Hero.tsx` | Import + map "chateau" layout |
| `src/components/templates/registry.ts` | Register template |
| `src/app/page.tsx` | Add to SHOWCASE array |
| `supabase/seed.sql` | Add seed row |
| `src/components/invitation/sections/CalendarCard.tsx` | Chateau-aware arched card with botanical ornament |
| `src/components/invitation/sections/Countdown.tsx` | Chateau botanical corners |
| `src/components/invitation/sections/Schedule.tsx` | Botanical timeline decorations |
| `src/components/invitation/sections/Chrome.tsx` | Chateau footer with wreath + flower border |
| `src/components/invitation/sections/VenueMoments.tsx` | Botanical corners |
| `src/components/invitation/sections/Story.tsx` | Botanical corners |

## Animation Details

| Element | Animation |
|---------|-----------|
| Painting BG | Parallax (0.6× scroll speed), scale 1.06→1 on load |
| Arch frame | Fade in + subtle scale from 0.97 over 1.5s |
| Botanical corners | SVG path draw-in over 2s, staggered by corner |
| Names | Letter-by-letter rise (existing RisingText) |
| Doves | Slow drift across viewport, 11s loop, staggered delays |
| Section botanicals | Fade in + slight rotation when scrolled into view |
| Ornate dividers | SVG path draw-in when visible |
| Calendar arch | Scale up from 0.95, 0.8s ease-out |
