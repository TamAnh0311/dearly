/**
 * Login page — renders the LoginForm centered on screen.
 */

import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dearly-cream px-4">
      <LoginForm />
    </main>
  );
}
