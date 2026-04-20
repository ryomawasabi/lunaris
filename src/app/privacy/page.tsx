import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | YINYANG GUARDIAN',
  description: 'Privacy policy for YINYANG GUARDIAN — how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="px-4 md:px-6 lg:px-8 py-6 border-b border-stone-light">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm">
          <Link href="/" className="text-stone hover:text-dark transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 text-stone" />
          <span className="text-dark font-medium">Privacy Policy</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="font-serif text-3xl md:text-4xl text-dark mb-4">Privacy Policy</h1>
        <p className="font-sans text-sm text-warm mb-10">Last updated: April 21, 2026</p>

        <div className="prose-custom space-y-8">
          <Section title="1. Information We Collect">
            <p>
              When you visit our website or make a purchase, we collect certain information to process your order and improve your experience. This includes your name, email address, shipping address, and payment information. Payment details are processed securely through Stripe and are never stored on our servers.
            </p>
            <p>
              We also automatically collect certain technical information such as your browser type, device information, and pages visited to help us understand how our website is used.
            </p>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>
              We use your personal information to process and fulfill your orders, communicate with you about your purchases, send order confirmation and shipping updates, and respond to your inquiries. With your consent, we may also send you promotional emails about new products and special offers. You can opt out of marketing communications at any time.
            </p>
          </Section>

          <Section title="3. Information Sharing">
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your information only with trusted service providers who assist us in operating our website and fulfilling orders, including payment processors (Stripe), email service providers, and shipping carriers. These third parties are bound by confidentiality agreements.
            </p>
          </Section>

          <Section title="4. Cookies">
            <p>
              Our website uses cookies and similar technologies to maintain your shopping cart, remember your preferences, and analyze site traffic. You can control cookie settings through your browser preferences. Essential cookies required for site functionality cannot be disabled.
            </p>
          </Section>

          <Section title="5. Data Security">
            <p>
              We implement industry-standard security measures to protect your personal information. All data transmission is encrypted using SSL/TLS technology. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>
              You have the right to access, correct, or delete your personal information. You may also request a copy of the data we hold about you. To exercise these rights, please contact us at info@yinyangguardian.com. We will respond to your request within 30 days.
            </p>
          </Section>

          <Section title="7. Children&apos;s Privacy">
            <p>
              Our website is not intended for children under the age of 16. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.
            </p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>
              We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </Section>

          <Section title="9. Contact Us">
            <p>
              If you have any questions about this privacy policy, please contact us at info@yinyangguardian.com.
            </p>
          </Section>
        </div>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-xl text-dark mb-3">{title}</h2>
      <div className="font-sans text-sm text-warm leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  )
}
