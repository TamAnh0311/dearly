/**
 * Wedding domain types — combines database rows with joined/computed fields.
 */

import type { WeddingRow, WeddingEventRow, GalleryPhotoRow, GuestbookEntryRow, TemplateRow } from "./database";

export interface WeddingWithTemplate extends WeddingRow {
  template: TemplateRow;
}

export interface WeddingSiteData {
  wedding: WeddingWithTemplate;
  events: WeddingEventRow[];
  photos: GalleryPhotoRow[];
  guestbookEntries: GuestbookEntryRow[];
}
