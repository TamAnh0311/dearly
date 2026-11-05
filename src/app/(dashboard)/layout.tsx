"use client";

/**
 * Dashboard layout — sidebar + topbar shell wrapping all dashboard pages.
 * WeddingProvider shares the active wedding across all dashboard components.
 * Sidebar wraps everything so its drawer context is available to TopBar.
 */

import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { AuthProvider } from "@/context/AuthContext";
import { WeddingProvider } from "@/context/WeddingContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WeddingProvider>
        <Sidebar>
          <div className="flex h-screen flex-1 flex-col overflow-hidden bg-dearly-cream">
            <TopBar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
          </div>
        </Sidebar>
      </WeddingProvider>
    </AuthProvider>
  );
}
