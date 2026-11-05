/**
 * Editor preview shell — never indexable. The page itself is a client-only
 * iframe target driven by postMessage.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
