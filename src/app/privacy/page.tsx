/**
 * Privacy Policy — public legal page.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Dearly collects, uses, and protects your personal data.",
  alternates: { canonical: absoluteUrl("/privacy") },
  openGraph: {
    title: "Privacy Policy | Dearly",
    description: "How Dearly collects, uses, and protects your personal data.",
    url: absoluteUrl("/privacy"),
    type: "website",
  },
  twitter: { card: "summary", title: "Privacy Policy | Dearly", description: "How Dearly collects, uses, and protects your personal data." },
};

/** Returns the current year as a string. */
function year(): string {
  return new Date().getFullYear().toString();
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="font-display text-xl font-bold text-dearly-accent">
        Dearly
      </Link>

      <h1 className="mt-8 font-display text-3xl font-bold text-dearly-text">Privacy Policy</h1>
      <p className="mt-2 text-sm text-dearly-text-muted">Last updated: 6 November {year()}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-dearly-text-secondary">
        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">1. Who we are</h2>
          <p>
            Dearly (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an event invitation and management platform. This policy explains how we collect, use, store, and protect personal data when you use our website and services.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">2. Data we collect</h2>
          <p className="mb-2">We collect the following categories of personal data:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Account data:</strong> email address, display name, and hashed password when you sign up.</li>
            <li><strong>Event data:</strong> host names, event date, venue name and address, story text, and customisation preferences you enter in the editor.</li>
            <li><strong>Guest data:</strong> names, RSVP responses, party size, and optional messages submitted by guests through your invitation page.</li>
            <li><strong>Photos:</strong> images uploaded by you or your guests, along with the uploader&apos;s name if provided.</li>
            <li><strong>Technical data:</strong> IP address (for rate limiting only, not stored long-term), browser type, and session cookies required for authentication.</li>
            <li><strong>Aggregate usage data:</strong> anonymous page views and interaction counts (for example, &quot;an RSVP was submitted&quot;), used to understand which parts of Dearly are working. This data is not linked to you or your guests and never includes names, messages, emails or invitation tokens.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">3. How we use your data</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>To provide and operate the invitation platform (creating, editing, and publishing your event page).</li>
            <li>To display RSVPs, messages, and photos on your event page as directed by you.</li>
            <li>To authenticate your account and protect against abuse (rate limiting).</li>
            <li>To send transactional emails related to your account (e.g. password reset).</li>
          </ul>
          <p className="mt-2">We do <strong>not</strong> sell your data to third parties, serve targeted advertisements, or use advertising or cross-site tracking cookies. We use privacy-friendly, aggregate analytics as described in section 5.</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">4. Lawful basis for processing</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Contract:</strong> processing your account and event data is necessary to provide the service you signed up for.</li>
            <li><strong>Legitimate interest:</strong> rate limiting and abuse prevention.</li>
            <li><strong>Consent:</strong> guest data (RSVPs, messages, photos) is collected with the guest&apos;s knowledge; a privacy notice is shown on every submission form.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">5. Third-party services</h2>
          <p className="mb-2">We use the following services to operate Dearly:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Supabase</strong> (database and authentication) — your data is stored in Supabase-managed PostgreSQL databases. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Supabase Privacy Policy</a>.</li>
            <li><strong>Vercel</strong> (hosting and analytics) — serves the website and provides Vercel Web Analytics. It is cookie-free and reports only aggregate page views and the non-identifying interaction events we send (such as &quot;RSVP submitted&quot;). <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">Vercel Privacy Policy</a>.</li>
            <li><strong>Google Fonts</strong> (typography) — fonts are loaded from Google servers, which may receive your IP address. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Google Privacy Policy</a>.</li>
          </ul>
          <p className="mt-2">We do not use advertising networks, social media pixels, or cross-site tracking. Analytics URLs are stripped of query strings, so personal invitation links and guest names are never sent.</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">6. Data retention</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Account data is retained until you delete your account.</li>
            <li>Event data (invitations, RSVPs, photos, messages) is retained until the account owner deletes the event or their account.</li>
            <li>We recommend exporting your data and closing your account within 12 months after your event if you no longer need the page.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">7. Your rights</h2>
          <p className="mb-2">Depending on your jurisdiction (GDPR, CCPA, Australian Privacy Act, etc.), you may have the right to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
            <li><strong>Rectification</strong> — correct inaccurate data via the dashboard editor.</li>
            <li><strong>Erasure</strong> — delete your account and all associated data from <Link href="/dashboard/account" className="underline">Account Settings</Link>.</li>
            <li><strong>Portability</strong> — request your data in a machine-readable format.</li>
            <li><strong>Objection</strong> — object to processing based on legitimate interest.</li>
          </ul>
          <p className="mt-2">
            Guests who wish to have their RSVP or message removed can contact the event host directly, or email us at{" "}
            <a href="mailto:privacy@dearly.app" className="underline">privacy@dearly.app</a>.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">8. Cookies</h2>
          <p>
            We only use <strong>essential cookies</strong> for authentication (keeping you logged in). Vercel Web Analytics is cookie-free. We do not use advertising cookies or cross-site tracking cookies. No cookie consent banner is required under GDPR for strictly necessary cookies and cookie-free aggregate measurement.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">9. Data security</h2>
          <p>
            We protect your data with HTTPS encryption in transit, row-level security policies in our database, secure authentication tokens, and server-side rate limiting. Photos are stored in encrypted cloud storage with access controlled by policy.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">10. Children</h2>
          <p>
            Dearly is designed for adults planning events. We do not knowingly collect data from children under 16. If you believe a child has provided us with personal data, please contact us.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">11. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. Material changes will be noted by updating the &quot;Last updated&quot; date at the top. Continued use of Dearly after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-dearly-text">12. Contact</h2>
          <p>
            For privacy enquiries, data requests, or complaints, email{" "}
            <a href="mailto:privacy@dearly.app" className="underline">privacy@dearly.app</a>.
          </p>
        </section>
      </div>

      <footer className="mt-16 border-t border-dearly-border pt-6 text-sm text-dearly-text-muted">
        <div className="flex gap-6">
          <Link href="/terms" className="underline hover:text-dearly-text-secondary">Terms of Service</Link>
          <Link href="/help" className="underline hover:text-dearly-text-secondary">Help</Link>
          <Link href="/contact" className="underline hover:text-dearly-text-secondary">Contact</Link>
          <Link href="/" className="underline hover:text-dearly-text-secondary">Home</Link>
        </div>
      </footer>
    </main>
  );
}
