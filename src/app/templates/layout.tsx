/**
 * Templates section layout — SEO metadata for the (client-rendered) gallery.
 */

import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

const TITLE = "Invitation Templates — Wedding, Birthday & Party Designs";
const DESCRIPTION =
  "Browse animated invitation designs: curtain reveals, wax seals, garden gates, stained glass, confetti and more. Live demos with RSVP and any colour scheme.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/templates") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/templates"),
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}