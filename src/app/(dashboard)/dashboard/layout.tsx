/**
 * Dashboard metadata guard — host-only screens are never indexable.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardPagesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
