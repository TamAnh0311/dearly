/**
 * Browser-side Supabase client using @supabase/ssr createBrowserClient.
 * Must only be imported in Client Components.
 */

import { createBrowserClient } from "@supabase/ssr";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Returns a singleton Supabase client for use in the browser.
 */
export function createClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!key) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");

  browserClient = createBrowserClient(url, key);
  return browserClient;
}
