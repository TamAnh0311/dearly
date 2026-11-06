"use client";

/**
 * Reset password page — user arrives here from the email link.
 * Supabase sets the session via the URL hash; we update the password.
 */

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase injects the session via the URL hash on redirect.
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setSessionReady(true);
    });
    // Also check if we already have a session (in case the event already fired).
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true);
    });
  }, []);

  /** Updates the password. */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { error: updateErr } = await createClient().auth.updateUser({ password });
      if (updateErr) throw new Error(updateErr.message);
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-dearly-cream px-4">
      <div className="w-full max-w-sm rounded-2xl bg-dearly-card p-8 shadow-card">
        <h1 className="mb-2 font-display text-2xl font-bold text-dearly-text">Set new password</h1>

        {done ? (
          <div className="space-y-3">
            <p className="text-sm text-green-700">Password updated. Redirecting to your dashboard…</p>
          </div>
        ) : !sessionReady ? (
          <div className="space-y-3">
            <p className="text-sm text-dearly-text-secondary">Verifying your reset link…</p>
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-dearly-accent border-t-transparent" />
            <p className="text-xs text-dearly-text-muted">
              If this takes too long, the link may have expired.{" "}
              <Link href="/forgot-password" className="text-dearly-accent hover:underline">
                Request a new one.
              </Link>
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-dearly-text-secondary">Choose a new password for your account.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-dearly-text-secondary">New password</label>
                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium text-dearly-text-secondary">Confirm password</label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
