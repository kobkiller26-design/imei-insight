import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | IMEI Insight',
  description: 'Read the Privacy Policy for IMEI Insight.',
}

const LAST_UPDATED = 'January 1, 2025'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-text-primary font-bold text-xl mb-3">{title}</h2>
      <div className="text-text-secondary leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="section-title mb-2">Privacy Policy</h1>
          <p className="text-text-secondary text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="card mb-6 bg-primary/5 border-primary/20">
          <p className="text-text-secondary text-sm">
            Your privacy matters to us. This policy explains what data we collect, how we use it,
            and how we keep it safe.
          </p>
        </div>

        <Section title="1. Information We Collect">
          <p>We collect the following categories of information when you use IMEI Insight:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <span className="text-text-primary font-medium">Account information:</span> Email
              address and password (hashed) when you register.
            </li>
            <li>
              <span className="text-text-primary font-medium">IMEI data:</span> IMEI numbers you
              submit for checking. These are stored alongside order records.
            </li>
            <li>
              <span className="text-text-primary font-medium">Order details:</span> Service
              selected, price paid, timestamps, and results returned.
            </li>
            <li>
              <span className="text-text-primary font-medium">Usage data:</span> Pages visited,
              features used, and error logs for diagnostic purposes.
            </li>
            <li>
              <span className="text-text-primary font-medium">Device information:</span> Browser
              type, operating system, and IP address for security and fraud prevention.
            </li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Provide, operate, and improve the IMEI checking service</li>
            <li>Process payments and deliver results</li>
            <li>Authenticate users and maintain account security</li>
            <li>Communicate with you about orders, updates, and support requests</li>
            <li>Detect and prevent fraud or abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>
            We do not sell, rent, or trade your personal information to third parties for marketing
            purposes.
          </p>
        </Section>

        <Section title="3. Data Storage — Supabase">
          <p>
            We store user accounts, orders, and service data in{' '}
            <span className="text-text-primary font-medium">Supabase</span>, a managed PostgreSQL
            database service. Supabase implements industry-standard security measures including
            data encryption at rest and in transit.
          </p>
          <p>
            Supabase&apos;s data may be stored in regions subject to their infrastructure
            provider&apos;s (AWS) data residency policies. For more information, visit the{' '}
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Supabase Privacy Policy
            </a>
            .
          </p>
        </Section>

        <Section title="4. Third-Party Services — IMEI24 API">
          <p>
            IMEI lookup results are retrieved from{' '}
            <span className="text-text-primary font-medium">IMEI24 API</span>. When you submit an
            IMEI for checking, we transmit the IMEI number and selected service to IMEI24 in order
            to return results. IMEI24 may log API requests per their own data retention policies.
          </p>
          <p>
            We are not responsible for IMEI24&apos;s data practices. By using our service, you
            acknowledge that IMEI data will be shared with this third-party provider.
          </p>
        </Section>

        <Section title="5. Cookies">
          <p>
            We use cookies and similar technologies to maintain user sessions, remember preferences,
            and gather analytics. Specifically:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <span className="text-text-primary font-medium">Session cookies:</span> Used by
              Supabase Auth to maintain your logged-in state.
            </li>
            <li>
              <span className="text-text-primary font-medium">Preference cookies:</span> Store UI
              preferences such as theme and filter settings.
            </li>
            <li>
              <span className="text-text-primary font-medium">Analytics cookies:</span> Help us
              understand how users interact with the site (aggregated, non-identifying data).
            </li>
          </ul>
          <p>You can disable cookies in your browser settings, though this may affect functionality.</p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain your account data for as long as your account is active. Order records,
            including IMEI numbers and results, are retained for up to 2 years for support and
            dispute resolution purposes, after which they are deleted or anonymized.
          </p>
          <p>
            You may request earlier deletion by contacting us (see Section 8).
          </p>
        </Section>

        <Section title="7. Your Rights">
          <p>Depending on your jurisdiction, you may have the following rights:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <span className="text-text-primary font-medium">Access:</span> Request a copy of the
              personal data we hold about you.
            </li>
            <li>
              <span className="text-text-primary font-medium">Correction:</span> Ask us to correct
              inaccurate or incomplete data.
            </li>
            <li>
              <span className="text-text-primary font-medium">Deletion:</span> Request that we
              delete your personal data (&quot;right to be forgotten&quot;).
            </li>
            <li>
              <span className="text-text-primary font-medium">Portability:</span> Receive your data
              in a structured, machine-readable format.
            </li>
            <li>
              <span className="text-text-primary font-medium">Objection:</span> Object to processing
              of your data for certain purposes.
            </li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:privacy@imeiinsight.com" className="text-accent hover:underline">
              privacy@imeiinsight.com
            </a>
            .
          </p>
        </Section>

        <Section title="8. Security">
          <p>
            We implement appropriate technical and organisational measures to protect your data
            against unauthorised access, alteration, disclosure, or destruction. These measures
            include TLS encryption, hashed passwords via Supabase Auth, and row-level security
            policies on our database.
          </p>
          <p>
            However, no method of transmission over the internet is 100% secure. If you believe
            your account has been compromised, contact us immediately.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            Our Service is not directed to children under 13. We do not knowingly collect personal
            information from children. If you believe a child has provided us with their data,
            please contact us and we will delete it promptly.
          </p>
        </Section>

        <Section title="10. Contact">
          <p>
            If you have questions about this Privacy Policy or wish to exercise your rights, contact
            us at{' '}
            <a href="mailto:privacy@imeiinsight.com" className="text-accent hover:underline">
              privacy@imeiinsight.com
            </a>{' '}
            or through our{' '}
            <Link href="/contact" className="text-accent hover:underline">
              contact page
            </Link>
            .
          </p>
        </Section>
      </div>
    </main>
  )
}
