"use client";

/**
 * Signup form — creates a new couple account.
 * On success, shows a confirmation message or redirects.
 */

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import SocialLoginButtons from "./SocialLoginButtons";
import { capturePendingDesign } from "@/lib/pending-design";

export default function SignupForm() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Remember a template/scheme picked on the public gallery (?template=&scheme=)
  // so onboarding can pre-select it — survives email confirmation & OAuth.
  useEffect(() => {
    capturePendingDesign(window.location.search);
  }, []);

  /** Handles form submission — creates account and redirects on success. */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signUp(email, password, displayName || undefined);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-dearly-card p-8 shadow-card">
      <h1 className="mb-6 font-display text-2xl font-bold text-dearly-text">Create your wedding site</h1>

      <SocialLoginButtons />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-dearly-border" />
        <span className="text-xs text-dearly-text-muted">or</span>
        <div className="h-px flex-1 bg-dearly-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-dearly-text-secondary">
            Your name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2.5 text-base focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
            placeholder="e.g. Sarah"
          />
        </div>

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
            className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2.5 text-base focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
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
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-dearly-border bg-white px-3 py-2.5 text-base focus:border-dearly-accent focus:outline-none focus:ring-1 focus:ring-dearly-accent"
            placeholder="Min 8 characters"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-dearly-accent px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Get started"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-dearly-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-dearly-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
