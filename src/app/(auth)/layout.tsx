/**
 * Auth shell — only login and signup need the Supabase auth provider.
 * Keeping it out of the root layout keeps marketing and guest pages lighter.
 */

import { AuthProvider } from "@/context/AuthContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
