/**
 * Art kit manifest — curated, licence-cleared artwork that templates can
 * borrow instead of drawing flat vector decoration.
 *
 * Each collection is a set of fixed files under /public/art. Only the palette
 * changes between colour schemes; the artwork is tinted and feathered at
 * render time so it never fights the couple's colours. Credits live here so
 * every consumer shows (or links) the same attribution.
 */

export type ArtCollectionId = "watercolour-garden" | "chateau";

/** One picture in the kit, with intrinsic size and an optional inline LQIP. */
export interface ArtAsset {
  src: string;
  width: number;
  height: number;
  /** Base64 WebP placeholder for next/image `placeholder="blur"`. */
  blurDataURL?: string;
}

/** A named group of assets a template can opt into via `style.art`. */
export interface ArtCollection {
  id: ArtCollectionId;
  name: string;
  /** Wide hero painting (desktop / landscape). */
  hero: ArtAsset;
  /** Tall hero crop (mobile). */
  heroPortrait: ArtAsset;
  /** Venue-section painting. */
  venue: ArtAsset;
  /** Transparent botanical sprays used as foreground layers. */
  sprays: {
    peony: ArtAsset;
    peonyTall: ArtAsset;
    eucalyptus: ArtAsset;
    roses: ArtAsset;
    magnolia: ArtAsset;
    cherry: ArtAsset;
    wreath: ArtAsset;
  };
  credits: {
    title: string;
    artist: string;
    source: string;
    license: string;
  }[];
}

const BLUR_HERO =
  "data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAADQAwCdASoYAA4APsFOoEqnpCMhsAgA8BgJQBWABDvUad5qd028ygAA/uI2lVJBKNj0n+4l9WGfSx+FftmRZWTl1684ndxsrqvHZWN99pNtSu7QPELKQaVL5i6f58moua/H4sVqby1a1ztvMA/D2OosVUOiYMb6fmO/KjikQ3+TXRIqNjkdP44OuUo6p4rCBtVp4oAA";
const BLUR_PORTRAIT =
  "data:image/webp;base64,UklGRrAAAABXRUJQVlA4IKQAAABwBQCdASoTABgAPr1QoUqnJSMhsBgMAOAXiWUAyJgQ7+2ABzZmU/4QqSLLTT8KwYE7wo8wAP7x2Up9FNDPn7bkBzlX72Bww0kbDX0+ylHNxTei/KWx6aaD2y5/H6r8/9MvbW3C1e9WA7fgMOFBfxQ6BpG6iVKv/V0WqRQo7YywaDAv+DYtjIM56cZ2XpxLAe1nB/56f1kxnCAYD80Qw8GMggQAAA==";
const BLUR_VENUE =
  "data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAAAQBACdASoYAA4APsFOoEqnpCMhsAgA8BgJQBhQtQAuVe4sLNIMHzjUAAD92yv6rWgyJtnvOUfEGYxfBwtFyNGgcwIvHaQXdYUt+nvutO8hkJkVARMAvRW6hLPB2U1FceQLc5XCmdFrWAIwaJKjbaw0XVXcLBw+TKb4V6H7TUdC/ghmcIaT1yBC64UGLFWJk/UU+wAA";

const BASE = "/art/watercolour-garden";

/* ─── Chateau blur placeholders + paths ──────────────────────────────────── */
const CHATEAU_BLUR_HERO =
  "data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAADwAwCdASoYAA8APzmEuVOvKKWisAgB4CcJQBWABA4vdnW4MHDz47oAAPylOjIQvKjuWYUKBzByBa2CswRGTBM5LvJq0OiAhmNhx72qfr/y5GuZ8ag8+X0Nh14b7f49HMamZG2z58CobQIqAGdNR8AA";
const CHATEAU_BLUR_PORTRAIT =
  "data:image/webp;base64,UklGRpgAAABXRUJQVlA4IIwAAADQBACdASoTABsAPzmIuVOvKSWisAgB4CcJZAAAQyuxrK8zMtZSbqdKEZRGRiLgAAD+Uj50wixrlQ1CCzC0G8h4oDyntG7zg2g4iSuU89yrz4k3D4j7bnK0KzIJAOOWeE9Qcc8Ic1tFrYHIwjDOEZnUFkqrgzfFGwaVO+VY4VIVviJoBMLeqhxG8QAAAA==";
const CHATEAU_BLUR_VENUE =
  "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAADQAwCdASoYABIAPzmMuVavKSUjqA1R4CcJY2bvRgAJfIhczP4LzUAA/ulLj/vQl+AtGp0iFIjDW5E3YaAeqATKnpoD5czilyncjgCfcFe5S3/CO2qfo8nih4gA1gAA";
const CHATEAU_BASE = "/art/chateau";
const WG_BASE = "/art/watercolour-garden";

/** Every art collection keyed by id. */
export const ART_COLLECTIONS: Record<ArtCollectionId, ArtCollection> = {
  "watercolour-garden": {
    id: "watercolour-garden",
    name: "Watercolour Garden",
    hero: { src: `${BASE}/ceremony-aisle.webp`, width: 1800, height: 1013, blurDataURL: BLUR_HERO },
    heroPortrait: { src: `${BASE}/ceremony-aisle-portrait.webp`, width: 1200, height: 1500, blurDataURL: BLUR_PORTRAIT },
    venue: { src: `${BASE}/ceremony-venue.webp`, width: 1800, height: 1013, blurDataURL: BLUR_VENUE },
    sprays: {
      peony: { src: `${BASE}/peonies-01.webp`, width: 1400, height: 780 },
      peonyTall: { src: `${BASE}/peonies-02.webp`, width: 547, height: 1400 },
      eucalyptus: { src: `${BASE}/eucalyptus-02.webp`, width: 645, height: 1400 },
      roses: { src: `${BASE}/garden-roses-01.webp`, width: 857, height: 1400 },
      magnolia: { src: `${BASE}/magnolia-01.webp`, width: 1400, height: 598 },
      cherry: { src: `${BASE}/cherry-blossom-01.webp`, width: 1400, height: 838 },
      wreath: { src: `${BASE}/greenery-wreath-01.webp`, width: 1376, height: 1400 },
    },
    credits: [
      {
        title: "Olive Grove Wedding Ceremony",
        artist: "BudgetPixel AI",
        source: "https://budgetpixel.com/images/olive-grove-wedding-ceremony-79ed9c86",
        license: "CC BY 4.0",
      },
      {
        title: "Garden Wedding Chuppah",
        artist: "BudgetPixel AI",
        source: "https://budgetpixel.com/images/garden-wedding-chuppah-illustration-ff02efc1",
        license: "CC BY 4.0",
      },
      {
        title: "Botanical cut-outs (peonies, eucalyptus, roses)",
        artist: "UsefulPix",
        source: "https://www.usefulpix.com",
        license: "Free for commercial use, no attribution required",
      },
    ],
  },

  /* ─── Chateau collection (Met Open Access / CC0) ─────────────────────────── */

  chateau: {
    id: "chateau",
    name: "Chateau",
    hero: { src: `${CHATEAU_BASE}/hero-garden.webp`, width: 1800, height: 1145, blurDataURL: CHATEAU_BLUR_HERO },
    heroPortrait: { src: `${CHATEAU_BASE}/hero-portrait.webp`, width: 1200, height: 1678, blurDataURL: CHATEAU_BLUR_PORTRAIT },
    venue: { src: `${CHATEAU_BASE}/venue-villa.webp`, width: 1800, height: 1386, blurDataURL: CHATEAU_BLUR_VENUE },
    sprays: {
      peony: { src: `${WG_BASE}/peonies-01.webp`, width: 1400, height: 780 },
      peonyTall: { src: `${WG_BASE}/peonies-02.webp`, width: 547, height: 1400 },
      eucalyptus: { src: `${WG_BASE}/eucalyptus-02.webp`, width: 645, height: 1400 },
      roses: { src: `${WG_BASE}/garden-roses-01.webp`, width: 857, height: 1400 },
      magnolia: { src: `${WG_BASE}/magnolia-01.webp`, width: 1400, height: 598 },
      cherry: { src: `${WG_BASE}/cherry-blossom-01.webp`, width: 1400, height: 838 },
      wreath: { src: `${WG_BASE}/greenery-wreath-01.webp`, width: 1376, height: 1400 },
    },
    credits: [
      {
        title: "Boboli Garden, Florence",
        artist: "John Singer Sargent",
        source: "https://www.metmuseum.org/art/collection/search/12119",
        license: "CC0 1.0 (Public Domain)",
      },
      {
        title: "Garden near Lucca",
        artist: "John Singer Sargent",
        source: "https://www.metmuseum.org/art/collection/search/12098",
        license: "CC0 1.0 (Public Domain)",
      },
      {
        title: "Imaginary View of a Roman Villa",
        artist: "Jean Honoré Fragonard",
        source: "https://www.metmuseum.org/art/collection/search/459372",
        license: "CC0 1.0 (Public Domain)",
      },
      {
        title: "Botanical cut-outs (peonies, eucalyptus, roses)",
        artist: "UsefulPix",
        source: "https://www.usefulpix.com",
        license: "Free for commercial use, no attribution required",
      },
    ],
  },
};

/** Resolves an art collection by id, or null when the template has no art. */
export function getArtCollection(id?: string | null): ArtCollection | null {
  if (!id) return null;
  return ART_COLLECTIONS[id as ArtCollectionId] ?? null;
}
