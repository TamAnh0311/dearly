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
  "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAACQAwCdASoUAA8APu1iqU2ppaOiMAgBMB2JYgCdAA24OuIz5OmAAP6XIeYLt607mH6uqcKOsAsnlArEI+qRH5GFgYfTJ9LHXJ9u+7dYZbJrfKCNIYONz4mX+WWtC6LAccYekrqP58WlL6AA";
const BLUR_PORTRAIT =
  "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAABQBACdASoQABQAPu1iqU2ppaOiMAgBMB2JZgCdMoADgqe7CR19zk1Qpr+gAPzV7qXZ/DLDOPmz5166EIBKq4KTqqDasjSTOSCWVmgAILCdspEXnMvuCNsrLkSB6CJEUxZNMeOpWfPrEOVSwHg/4xOAAAA=";
const BLUR_VENUE =
  "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAACwAwCdASoUAA0APu1iqk2ppaQiMAgBMB2JQBWAAyXFUOpEO82eAADN3PfvK4jypbd8mf/g226z7mcCcHbDhhVew2TTigjVjB7UN/StCXPCFVykAV91O17jb8R/5txbD4AAAA==";

const BASE = "/art/watercolour-garden";

/** Every art collection keyed by id (currently the pilot kit). */
export const ART_COLLECTIONS: Record<ArtCollectionId, ArtCollection> = {
  "watercolour-garden": {
    id: "watercolour-garden",
    name: "Watercolour Garden",
    hero: { src: `${BASE}/hero-garden.webp`, width: 1800, height: 1341, blurDataURL: BLUR_HERO },
    heroPortrait: { src: `${BASE}/hero-garden-portrait.webp`, width: 1200, height: 1500, blurDataURL: BLUR_PORTRAIT },
    venue: { src: `${BASE}/venue-garden.webp`, width: 1600, height: 1068, blurDataURL: BLUR_VENUE },
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
        title: "The Artist's Garden at Saint-Clair",
        artist: "Henri-Edmond Cross",
        source: "The Metropolitan Museum of Art (Open Access)",
        license: "CC0 1.0",
      },
      {
        title: "Flower Garden and Bungalow, Bermuda",
        artist: "Winslow Homer",
        source: "The Metropolitan Museum of Art (Open Access)",
        license: "CC0 1.0",
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
