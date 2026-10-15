/**
 * Templates section layout — SEO metadata for the (client-rendered) gallery.
 */

import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Invitation Templates — Wedding, Birthday & Party Designs",
  description:
    "Browse 29 animated invitation designs: curtain reveals, wax seals, garden gates, stained glass, confetti and more. Live demos with RSVP and any colour scheme.",
  alternates: { canonical: absoluteUrl("/templates") },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}