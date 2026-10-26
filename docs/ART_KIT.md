# Art kit

How Dearly adds **painted, licence-cleared artwork** to invitations without
turning every template into a different product. The first collection,
*Watercolour Garden*, powers the `bloom` pilot (`atelier` hero).

## 1. Why a kit

Flat SVG flowers and floating cards made templates look alike. A kit gives each
design a small, consistent set of hand-made assets that can be composed into
different layouts while sharing the same content, palette and sections.

A kit is **not** a background image pack. Each collection ships:

- one wide painting and one portrait crop for the hero;
- one venue painting;
- a set of transparent botanical sprays;
- dimensions, blur placeholders and credits in code.

## 2. Manifest

`src/components/invitation/art.ts` is the single source of truth:

```ts
export type ArtCollectionId = "watercolour-garden";

export interface ArtAsset {
  src: string;
  width: number;
  height: number;
  /** Inline base64 WebP used by next/image placeholder="blur". */
  blurDataURL?: string;
}

export interface ArtCollection {
  id: ArtCollectionId;
  name: string;
  hero: ArtAsset;
  heroPortrait: ArtAsset;
  venue: ArtAsset;
  sprays: {
    peony: ArtAsset;
    peonyTall: ArtAsset;
    eucalyptus: ArtAsset;
    roses: ArtAsset;
    magnolia: ArtAsset;
    cherry: ArtAsset;
    wreath: ArtAsset;
  };
  credits: { title: string; artist: string; source: string; license: string }[];
}

export function getArtCollection(id?: string | null): ArtCollection | null;
```

A template opts in through its design language (`styles.ts`):

```ts
bloom: {
  hero: "atelier",
  art: "watercolour-garden",
  bodyFont: "Jost",
  ornament: "line",
  eyebrow: "caps",
  headingCase: "normal",
  texture: "paper",
  flowers: false,
  // …
}
```

`InvitationStyle.art` is an **id**, not an imported object, so styles stay
serialisable and a missing collection can fall back safely. `Hero.tsx` falls
back to `garden` when `atelier` has no art.

## 3. Files

```
public/art/watercolour-garden/
  hero-garden.webp            1800×1341  Cross, The Artist's Garden at Saint-Clair
  hero-garden-portrait.webp   1200×1500  portrait crop of the same painting
  venue-garden.webp           1600×1068  Homer, Flower Garden and Bungalow, Bermuda
  peonies-01/02.webp          transparent sprays
  garden-roses-01/02.webp
  eucalyptus-01/02.webp
  magnolia-01/02.webp
  hydrangea-01/02.webp
  lavender-01/02.webp
  cherry-blossom-01/02.webp
  greenery-wreath-01/02.webp
  CREDITS.md
```

Only the assets listed in the manifest are shipped by the UI. Extra sprays are
available for future sections without another download step.

### Why these assets

- Two museum watercolours give real brush texture and a grown-up palette.
- Transparent cut-outs add crisp foreground detail the paintings cannot provide
  at a 390px crop.
- The wreath + white peony make a reusable "pressed flower" medallion for
  editorial sections.

## 4. Composition rules

Use one painting and **one to three** sprays per section.

| Section | Recipe |
| --- | --- |
| Hero (`atelier`) | Arched painting on the right; portrait crop under the type on phones. Peony at the arch shoulder, eucalyptus at the lower corner, cherry branch entering from the paper edge. |
| Story | Text column + wreath medallion with a white peony. Keep the medal at ≤ 24rem and the quote in the paper margin. |
| Venue | Painting as a postcard header inside the venue card; peony overlapping the top-left. |
| RSVP | Peony stem entering from the right edge on wide screens only. No spray over form fields. |

Rules:

1. **Keep type off busy detail.** Feather the painting with a gradient of
   `palette.background` before placing text over it.
2. **Never repeat the same painting twice in adjacent sections.** Hero uses
   Cross; Venue uses Homer; Story uses cut-outs.
3. **One focal bloom.** A single large peony or wreath centre reads better than
   a bouquet of five equal stems.
4. **Bleed, don't box.** Sprays may leave the canvas; paintings sit inside an
   arch or organic frame.
5. **Mobile first.** Phone heroes get the portrait crop, one spray and no
   extra ornament. Desktop can afford three layers.
6. **Reduced motion.** Scale/drift entrances check `useReducedMotion()` and
   render the final frame.

## 5. Theming fixed artwork

The paintings cannot be recoloured per colour scheme. Keep them inside the
palette instead:

- Light schemes: `saturate(1.06) contrast(1.04)`, a 4–8% `palette.primary`
  multiply wash, and an inner vignette in `palette.background`.
- Dark schemes: `brightness(0.72–0.78) saturate(0.88–0.9)` plus a stronger
  background vignette so the art does not glow.
- Text and UI never sample colours from the artwork; they always use
  `palette` tokens.
- Test at least one light and one dark `COLOR_SCHEMES` entry.

## 6. Performance

- WebP, quality ≈ 82; hero ≤ 550 KB, sprays ≤ 270 KB.
- Hero images use `priority`; section art never does.
- Provide `sizes` that match the rendered column, not `100vw` everywhere.
- Store an inline LQIP (`blurDataURL`) for every painting; sprays are small
  enough to load normally.
- Decorative images use `alt=""` and their wrappers are `aria-hidden`.
- Only `transform` and `opacity` animate.

## 7. Licences

Read [CREDITS.md](../public/art/watercolour-garden/CREDITS.md) before shipping
a new asset. The rules:

- Met Open Access (CC0), Smithsonian Open Access, BHL/Rawpixel public domain,
  ClipSafari/PublicDomainVectors (CC0): preferred.
- UsefulPix: free commercial use, no attribution; **do not resell the files as
  stock**.
- Avoid PNGTree, CityPNG, HiClipart/ClipartMag, raw Freepik/Vecteezy files, and
  image-search results with no licence page.
- Add every source and licence to the collection's `CREDITS.md` **and** to the
  `credits` array in `art.ts`.

## 8. Adding a collection

1. Create `public/art/<collection-id>/` with painting(s) + sprays + CREDITS.md.
2. Convert to WebP, record intrinsic dimensions, generate an inline LQIP.
3. Add the id to `ArtCollectionId`, extend `ArtCollection`, and fill
   `ART_COLLECTIONS`.
4. Set `art: "<collection-id>"` on one template in `styles.ts`.
5. Compose the hero/sections with `getArtCollection` / `ArtSpray`.
6. Add the layout to `LayoutThumbnail.tsx` if it is a new hero.
7. Test: `npm test`, `npx tsc --noEmit -p .`, `npm run lint`, `npm run build`.
8. Screenshot 390×844 and 1440×900, light + dark, hero + `#story`, `#venue`
   and `#rsvp`:

   ```bash
   SHOT_SIZE=390x844 SHOT_WAIT_MS=7000 node scripts/screenshot.mjs .shots/art \
     "http://localhost:3000/templates/<slug>?embed=1&bare=1|<name>" \
     "http://localhost:3000/templates/<slug>?embed=1&bare=1|<name>-rsvp|#rsvp"
   ```

Keep the kit small. Two paintings, one medallion and seven sprays already cover
four sections with very different layouts.
