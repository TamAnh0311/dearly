/**
 * Login page — renders the LoginForm centered on screen.
 */

import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sign in",
  alternates: { canonical: absoluteUrl("/login") },
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dearly-cream px-4">
      <LoginForm />
    </main>
  );
}
