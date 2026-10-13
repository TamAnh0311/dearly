/**
 * Boho template barrel export.
 * Exports all components conforming to the TemplateComponents interface.
 */

import type { TemplateComponents } from "../types";
import InvitationPage from "./InvitationPage";
import GalleryLayout from "./GalleryLayout";
import TimelineSection from "./TimelineSection";
import GuestbookSection from "./GuestbookSection";

const components: TemplateComponents = {
  InvitationPage,
  GalleryLayout,
  TimelineSection,
  GuestbookSection,
};

export default components;
