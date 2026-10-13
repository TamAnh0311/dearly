/**
 * Signup page — renders the SignupForm centered on screen.
 */

import SignupForm from "@/components/auth/SignupForm";

export const metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dearly-cream px-4">
      <SignupForm />
    </main>
  );
}
