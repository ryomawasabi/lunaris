import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | YINYANG GUARDIAN',
  description: 'Terms and conditions for using the YINYANG GUARDIAN website and purchasing our products.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="px-4 md:px-6 lg:px-8 py-6 border-b border-stone-light">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm">
          <Link href="/" className="text-stone hover:text-dark transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 text-stone" />
          <span className="text-dark font-medium">Terms of Service</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="font-serif text-3xl md:text-4xl text-dark mb-4">Terms of Service</h1>
        <p className="font-sans text-sm text-warm mb-10">Last updated: April 21, 2026</p>

        <div className="prose-custom space-y-8">
          <Section title="1. General">
            <p>
              By accessing and using the YINYANG GUARDIAN website (www.yinyangguardian.com), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.
            </p>
          </Section>

          <Section title="2. Products and Pricing">
            <p>
              All product descriptions, images, and prices are provided as accurately as possible. However, we do not warrant that product descriptions or pricing are error-free. We reserve the right to correct any errors and to update information at any time without prior notice. All prices are displayed in USD and include applicable taxes unless otherwise stated.
            </p>
          </Section>

          <Section title="3. Orders and Payment">
            <p>
              By placing an order, you are making an offer to purchase the selected products. We reserve the right to refuse or cancel any order for any reason, including product availability, errors in pricing or product information, or suspected fraudulent activity. Payment is processed securely through Stripe at the time of purchase.
            </p>
          </Section>

          <Section title="4. Shipping and Delivery">
            <p>
              We ship to most countries worldwide. Estimated delivery times are provided as guidelines and are not guaranteed. We are not responsible for delays caused by customs, weather, or other circumstances beyond our control. Risk of loss transfers to you upon delivery to the shipping carrier.
            </p>
          </Section>

          <Section title="5. Returns and Refunds">
            <p>
              We accept returns of unused, unopened products within 14 days of delivery. To initiate a return, please contact us at info@yinyangguardian.com. Return shipping costs for customer-initiated returns are the responsibility of the customer. Defective or incorrectly shipped items will be replaced or refunded at our expense. Refunds are processed to the original payment method within 5-10 business days of receiving the returned item.
            </p>
          </Section>

          <Section title="6. Intellectual Property">
            <p>
              All content on this website, including text, images, logos, and designs, is the property of YINYANG GUARDIAN and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or use any content without our prior written consent.
            </p>
          </Section>

          <Section title="7. Disclaimer">
            <p>
              Our products are designed for spiritual and wellness purposes. The crystal properties and healing attributes described on our website are based on traditional beliefs and are not intended to diagnose, treat, cure, or prevent any disease. Our products are not substitutes for professional medical advice, diagnosis, or treatment.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, YINYANG GUARDIAN shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid by you for the product in question.
            </p>
          </Section>

          <Section title="9. Governing Law">
            <p>
              These terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms or your use of our website shall be resolved through good-faith negotiation before pursuing formal legal action.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              For questions regarding these Terms of Service, please contact us at info@yinyangguardian.com.
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
