/**
 * Signup page — renders the SignupForm centered on screen.
 */

import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sign up",
  alternates: { canonical: absoluteUrl("/signup") },
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dearly-cream px-4">
      <SignupForm />
    </main>
  );
}
