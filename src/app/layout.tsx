/**
 * Root layout — applied to every route.
 * Loads display + body fonts, imports Tailwind, wraps in AuthProvider.
 */

import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: { default: "Dearly — Beautiful Wedding Invitations & Photo Galleries", template: "%s | Dearly" },
  description: "Create stunning animated wedding invitations, photo galleries, and guest books. 25 cinematic templates, full customization, share with your guests in minutes.",
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
