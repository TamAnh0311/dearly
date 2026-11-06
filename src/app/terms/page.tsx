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
      <p className="mt-2 text-sm text-dearly-text-muted">Last updated: 6 November {year()}</p>

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
            Dearly provides a platform for creating and sharing digital invitations and event pages for weddings, birthdays, dinners, parties and other celebrations. You can customise designs, collect RSVPs, share photos, and receive guest messages through your personalised event page.
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
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">9. Disclaimers</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>No warranty:</strong> Dearly is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express, implied or statutory, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.</li>
            <li><strong>Event accuracy:</strong> Dearly displays information entered by hosts (names, dates, venues, directions, schedules). We do not verify this information and are not responsible for errors, outdated details, or changes made after an invitation is shared.</li>
            <li><strong>Availability:</strong> We do not guarantee uninterrupted or error-free access to the Service. Planned maintenance, infrastructure issues, or third-party outages may temporarily affect availability. We are not liable for any event disruption caused by service downtime.</li>
            <li><strong>Guest data:</strong> Hosts collect personal data from their guests (names, RSVP responses, messages, photos) through their event page. The host is the data controller for guest data and is responsible for handling it lawfully. Dearly acts as a data processor on behalf of the host.</li>
            <li><strong>Music and media:</strong> Dearly provides royalty-free generative background music. If you upload, link, or select copyrighted music, photos, or other media, you are solely responsible for securing the necessary rights and licences. Dearly is not liable for any intellectual property claims arising from user-supplied content.</li>
            <li><strong>Third-party services:</strong> The Service relies on third-party providers (Supabase, Vercel, Google Fonts). We are not responsible for the availability, performance, or privacy practices of these providers.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">10. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Dearly and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of or inability to use the Service, including but not limited to loss of data, loss of revenue, loss of goodwill, event disruption, or personal embarrassment, even if we have been advised of the possibility of such damages. Our total aggregate liability for any claim arising from the Service shall not exceed the amount you have paid us in the twelve (12) months preceding the claim, or fifty Australian dollars (AUD 50), whichever is greater.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">11. Intellectual property</h2>
          <p>
            The Dearly platform, including its designs, templates, artwork, and code, is owned by Dearly. Template artwork is credited to its respective artists and used under open-source licences (CC BY 4.0, CC0). You may not resell, redistribute, or claim ownership of Dearly&apos;s templates or artwork.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">12. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be communicated by updating the &quot;Last updated&quot; date. Continued use after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">13. Contact</h2>
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
