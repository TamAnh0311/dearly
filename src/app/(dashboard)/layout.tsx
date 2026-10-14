"use client";

/**
 * Dashboard layout — sidebar + topbar shell wrapping all dashboard pages.
 * Sidebar wraps everything so its drawer context is available to TopBar.
 */

import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar>
      <div className="flex h-screen flex-1 flex-col overflow-hidden bg-dearly-cream">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </Sidebar>
  );
}
