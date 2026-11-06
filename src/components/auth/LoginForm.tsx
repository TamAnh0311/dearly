"use client";

/**
 * Login form — email + password sign-in.
 * On success, redirects to /dashboard.
 */

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import SocialLoginButtons from "./SocialLoginButtons";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

export default function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(0);
  const attempts = useRef(0);

  /** Handles form submission — signs in and redirects on success. */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (Date.now() < lockedUntil) {
      setError(`Too many attempts. Please wait ${Math.ceil((lockedUntil - Date.now()) / 1000)} seconds.`);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      attempts.current = 0;
      if (!rememberMe) {
        sessionStorage.setItem("dearly-session-only", "true");
      } else {
        sessionStorage.removeItem("dearly-session-only");
      }
      router.push("/dashboard");
    } catch (err) {
      attempts.current += 1;
      if (attempts.current >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS);
        setError("Too many failed attempts. Please wait 1 minute before trying again.");
        attempts.current = 0;
      } else {
        setError(err instanceof Error ? err.message : "Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-dearly-card p-8 shadow-card">
      <h1 className="mb-6 font-display text-2xl font-bold text-dearly-text">Sign in</h1>

      <SocialLoginButtons />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-dearly-border" />
        <span className="text-xs text-dearly-text-muted">or</span>
        <div className="h-px flex-1 bg-dearly-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-dearly-text-secondary">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-dearly-text-secondary">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2 text-sm focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-dearly-border text-dearly-accent focus:ring-dearly-accent"
          />
          <label htmlFor="rememberMe" className="text-sm text-dearly-text-secondary">
            Remember me
          </label>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-dearly-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 text-sm text-dearly-text-muted">
        <Link href="/forgot-password" className="text-dearly-accent hover:underline">
          Forgot your password?
        </Link>
        <p>
          No account?{" "}
          <Link href="/signup" className="font-medium text-dearly-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
