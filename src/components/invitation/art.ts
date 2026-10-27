/**
 * Art kit manifest — curated, licence-cleared artwork that templates can
 * borrow instead of drawing flat vector decoration.
 *
 * Each collection is a set of fixed files under /public/art. Only the palette
 * changes between colour schemes; the artwork is tinted and feathered at
 * render time so it never fights the couple's colours. Credits live here so
 * every consumer shows (or links) the same attribution.
 */

export type ArtCollectionId = "watercolour-garden";

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

/** Every art collection keyed by id (currently the pilot kit). */
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
};

/** Resolves an art collection by id, or null when the template has no art. */
export function getArtCollection(id?: string | null): ArtCollection | null {
  if (!id) return null;
  return ART_COLLECTIONS[id as ArtCollectionId] ?? null;
}
