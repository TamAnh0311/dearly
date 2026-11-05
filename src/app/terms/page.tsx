/**
 * Terms of Service — public legal page.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the Dearly invitation platform.",
  alternates: { canonical: absoluteUrl("/terms") },
  openGraph: {
    title: "Terms of Service | Dearly",
    description: "Terms and conditions for using the Dearly invitation platform.",
    url: absoluteUrl("/terms"),
    type: "website",
  },
  twitter: { card: "summary", title: "Terms of Service | Dearly", description: "Terms and conditions for using the Dearly invitation platform." },
};

/** Returns the current year as a string. */
function year(): string {
  return new Date().getFullYear().toString();
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="font-display text-xl font-bold text-dearly-accent">
        Dearly
      </Link>

      <h1 className="mt-8 font-display text-3xl font-bold text-dearly-text">Terms of Service</h1>
      <p className="mt-2 text-sm text-dearly-text-muted">Last updated: 3 November {year()}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-dearly-text-secondary">
        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">1. Acceptance</h2>
          <p>
            By creating an account or using Dearly (&quot;the Service&quot;), you agree to these Terms. If you do not agree, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">2. The Service</h2>
          <p>
            Dearly provides a platform for creating and sharing digital invitations for weddings and events. You can customise designs, collect RSVPs, share photos, and receive guest messages through your personalised event page.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">3. Your account</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>You must provide accurate information when creating an account.</li>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>You must be at least 16 years old to use the Service.</li>
            <li>One person may operate multiple event pages under a single account.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">4. Your content</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>You retain ownership of all content you upload (photos, text, names).</li>
            <li>By uploading content, you grant Dearly a limited licence to store, display, and serve that content for the purpose of operating your event page.</li>
            <li>You represent that you have the right to upload all content, including the consent of any individuals depicted in photos.</li>
            <li>You must not upload content that is illegal, defamatory, infringing, or harmful.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">5. Guest content</h2>
          <p>
            Guests who submit RSVPs, messages, or photos through your event page consent to their data being shared with you (the event host). As the host, you are responsible for handling your guests&apos; data appropriately. You may moderate and delete guest content from your dashboard.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">6. Music and media</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Dearly provides original generative background music that is free to use.</li>
            <li>If you upload or select copyrighted music, you are solely responsible for obtaining the necessary licences.</li>
            <li>Dearly is not liable for copyright claims arising from user-selected music.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">7. Prohibited conduct</h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Use the Service for spam, phishing, or distributing malware.</li>
            <li>Attempt to access other users&apos; data or accounts.</li>
            <li>Overload or disrupt the Service infrastructure.</li>
            <li>Scrape, copy, or redistribute the Service&apos;s designs or code.</li>
            <li>Use the Service for any unlawful purpose.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">8. Account termination</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>You may delete your account at any time from <Link href="/dashboard/account" className="underline">Account Settings</Link>. Deletion permanently removes all your data.</li>
            <li>We may suspend or terminate accounts that violate these Terms, with notice where practicable.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">9. Limitation of liability</h2>
          <p>
            Dearly is provided &quot;as is&quot; without warranties of any kind. To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the Service, including loss of data, loss of revenue, or interruption of service.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">10. Intellectual property</h2>
          <p>
            The Dearly platform, including its designs, templates, artwork, and code, is owned by Dearly. Template artwork is credited to its respective artists and used under open-source licences (CC BY 4.0, CC0). You may not resell, redistribute, or claim ownership of Dearly&apos;s templates or artwork.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">11. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be communicated by updating the &quot;Last updated&quot; date. Continued use after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">12. Contact</h2>
          <p>
            For questions about these Terms, email{" "}
            <a href="mailto:hello@dearly.app" className="underline">hello@dearly.app</a>.
          </p>
        </section>
      </div>

      <footer className="mt-16 border-t border-dearly-border pt-6 text-sm text-dearly-text-muted">
        <div className="flex gap-6">
          <Link href="/privacy" className="underline hover:text-dearly-text-secondary">Privacy Policy</Link>
          <Link href="/help" className="underline hover:text-dearly-text-secondary">Help</Link>
          <Link href="/contact" className="underline hover:text-dearly-text-secondary">Contact</Link>
          <Link href="/" className="underline hover:text-dearly-text-secondary">Home</Link>
        </div>
      </footer>
    </main>
  );
}
