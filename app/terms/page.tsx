import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | IMEI Insight',
  description: 'Read the Terms of Service for IMEI Insight.',
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

export default function TermsPage() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="section-title mb-2">Terms of Service</h1>
          <p className="text-text-secondary text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="card mb-6 bg-primary/5 border-primary/20">
          <p className="text-text-secondary text-sm">
            Please read these Terms of Service carefully before using IMEI Insight. By accessing or
            using our service, you agree to be bound by these terms.
          </p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using IMEI Insight (&quot;Service&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you agree to
            be bound by these Terms of Service and all applicable laws and regulations. If you do
            not agree with any of these terms, you are prohibited from using this service.
          </p>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the Service
            after changes constitutes acceptance of the new terms.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            IMEI Insight provides IMEI number lookup and device verification services including but
            not limited to blacklist status checks, carrier lock information, warranty verification,
            and device identification. Results are provided by third-party data providers and are
            subject to their availability and accuracy.
          </p>
        </Section>

        <Section title="3. Acceptable Use">
          <p>You agree to use this Service only for lawful purposes. You must not:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Submit false or misleading IMEI numbers</li>
            <li>Attempt to circumvent security measures or rate limits</li>
            <li>Use the Service to facilitate theft, fraud, or illegal activity</li>
            <li>Resell or redistribute results without prior written consent</li>
            <li>Automate requests in a manner that disrupts service availability</li>
            <li>Access or query IMEIs of devices you do not own or have explicit permission to check</li>
          </ul>
        </Section>

        <Section title="4. Payment and Billing">
          <p>
            Certain features of the Service require payment. By providing payment information, you
            authorize us to charge the applicable fees. All fees are non-refundable unless
            otherwise stated or required by applicable law.
          </p>
          <p>
            Prices are subject to change with reasonable notice. Continued use of paid features
            after a price change constitutes acceptance of the new pricing.
          </p>
          <p>
            In the event a service cannot be fulfilled due to third-party data provider issues, we
            will issue a credit or refund at our discretion.
          </p>
        </Section>

        <Section title="5. Intellectual Property">
          <p>
            All content, features, and functionality of the Service — including but not limited to
            software, text, graphics, logos, and data — are owned by IMEI Insight and protected by
            applicable intellectual property laws.
          </p>
        </Section>

        <Section title="6. Restrictions">
          <p>You may not:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Copy, modify, or distribute any part of the Service without permission</li>
            <li>Reverse engineer, decompile, or disassemble any portion of the Service</li>
            <li>Use the Service to build a competing product</li>
            <li>Remove or alter any proprietary notices or labels</li>
          </ul>
        </Section>

        <Section title="7. Privacy">
          <p>
            Your use of the Service is also governed by our{' '}
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
            , which is incorporated into these Terms by reference.
          </p>
        </Section>

        <Section title="8. Disclaimers">
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
            EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
          <p>
            We do not warrant that the Service will be uninterrupted, error-free, or that results
            obtained from IMEI checks are accurate, complete, or current. IMEI data is sourced from
            third-party providers and we cannot guarantee its accuracy.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL IMEI INSIGHT BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
            INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE,
            EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p>
            Our total liability for any claim related to the Service shall not exceed the amount
            paid by you for the specific service giving rise to the claim in the twelve (12) months
            preceding the claim.
          </p>
        </Section>

        <Section title="10. Termination">
          <p>
            We reserve the right to suspend or terminate your account and access to the Service at
            our sole discretion, without notice, for conduct that we believe violates these Terms or
            is harmful to other users, us, third parties, or the integrity of the Service.
          </p>
        </Section>

        <Section title="11. Governing Law">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the
            jurisdiction in which IMEI Insight operates, without regard to its conflict of law
            provisions. Any disputes arising under these Terms shall be subject to the exclusive
            jurisdiction of the courts in that jurisdiction.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>
            If you have any questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:legal@imeiinsight.com" className="text-accent hover:underline">
              legal@imeiinsight.com
            </a>{' '}
            or visit our{' '}
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
