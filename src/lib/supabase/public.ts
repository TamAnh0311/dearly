/**
 * Cookie-less Supabase client with the public anon key, for statically
 * generated / cached public pages (sitemap, SEO landing pages). RLS applies.
 */

import { createClient } from "@supabase/supabase-js";

/** Returns an anonymous Supabase client, or null if env vars are missing (e.g. in CI builds). */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
