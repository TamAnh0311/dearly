"use client";

/**
 * Forgot password page — sends a password reset email via Supabase Auth.
 */

import { useState, FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /** Sends the reset email. */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: resetErr } = await createClient().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetErr) throw new Error(resetErr.message);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-dearly-cream px-4">
      <div className="w-full max-w-sm rounded-2xl bg-dearly-card p-8 shadow-card">
        <h1 className="mb-2 font-display text-2xl font-bold text-dearly-text">Reset your password</h1>

        {sent ? (
          <div className="space-y-4">
            <p className="text-sm text-dearly-text-secondary">
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a reset link. Check your inbox and spam folder.
            </p>
            <Link href="/login" className="inline-block text-sm font-medium text-dearly-accent hover:underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-dearly-text-secondary">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="reset-email" className="mb-1 block text-sm font-medium text-dearly-text-secondary">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
                  placeholder="you@example.com"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-dearly-text-muted">
              <Link href="/login" className="text-dearly-accent hover:underline">
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
