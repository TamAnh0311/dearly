/**
 * Rustic template barrel export.
 * The guest invitation page itself is the shared CinematicInvitation
 * (src/components/invitation); this bundle supplies the gallery and
 * guestbook sub-pages styled for the template.
 */

import type { TemplateComponents } from "../types";
import GalleryLayout from "./GalleryLayout";
import GuestbookSection from "./GuestbookSection";

const components: TemplateComponents = {
  GalleryLayout,
  GuestbookSection,
};

export default components;