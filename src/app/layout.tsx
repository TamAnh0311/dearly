/**
 * Root layout — applied to every route.
 * Loads display + body fonts, imports Tailwind, wraps in AuthProvider.
 */

import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Dearly — Wedding Invitations & Galleries", template: "%s | Dearly" },
  description: "Create beautiful, animated wedding invitations and photo galleries. Pick a template, customize everything, share with your guests.",
  metadataBase: new URL("https://dearly.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="font-body bg-dearly-cream text-dearly-text antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
