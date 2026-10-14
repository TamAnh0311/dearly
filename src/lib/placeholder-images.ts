/**
 * Curated Unsplash placeholder images for template previews.
 * All Unsplash images are free for commercial use, no attribution required.
 */

export const PLACEHOLDER_IMAGES = {
  wedding: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80",
    "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&q=80",
    "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800&q=80",
    "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&q=80",
  ],
  couple: [
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80",
    "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=800&q=80",
    "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&q=80",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",
  ],
  flowers: [
    "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80",
    "https://images.unsplash.com/photo-1471696035578-3d8c78d99571?w=800&q=80",
    "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80",
  ],
  venue: [
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80",
  ],
  celebration: [
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    "https://images.unsplash.com/photo-1496843916299-590492c751f4?w=800&q=80",
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
  ],
  birthday: [
    "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80",
    "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&q=80",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80",
  ],
  travel: [
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80",
  ],
  holiday: [
    "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=800&q=80",
    "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80",
    "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&q=80",
    "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=800&q=80",
  ],
  thankyou: [
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80",
    "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80",
    "https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=800&q=80",
  ],
};

/** Returns a deterministic placeholder image for a template by index. */
export function getTemplateImage(index: number): string {
  return PLACEHOLDER_IMAGES.wedding[index % PLACEHOLDER_IMAGES.wedding.length];
}

/** Returns a placeholder image for a card category. */
export function getCardCategoryImage(category: string, index: number): string {
  const categoryMap: Record<string, string[]> = {
    postcard: PLACEHOLDER_IMAGES.travel,
    birthday: PLACEHOLDER_IMAGES.birthday,
    event: PLACEHOLDER_IMAGES.celebration,
    "thank-you": PLACEHOLDER_IMAGES.thankyou,
    holiday: PLACEHOLDER_IMAGES.holiday,
  };
  const images = categoryMap[category] ?? PLACEHOLDER_IMAGES.celebration;
  return images[index % images.length];
}
