import { Metadata } from 'next';
import { Mail, Phone } from 'lucide-react';
import PlaceholderImage from '@/components/layout/PlaceholderImage';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'FAQ | LUNARIS',
  description: 'Frequently asked questions about LUNARIS jewelry, shipping, returns, and care.',
};

export default function FAQPage() {
  const faqSections = [
    {
      category: 'Ordering & Shipping',
      questions: [
        {
          question: 'How long does shipping take?',
          answer:
            'We typically process and ship orders within 3-5 business days. Domestic shipping takes 5-7 business days, while international shipping generally takes 10-14 business days. Expedited shipping options are available at checkout.',
        },
        {
          question: 'Do you offer free shipping?',
          answer:
            'Yes! We offer complimentary shipping on all domestic orders over $150. For orders under $150, standard shipping is calculated at checkout. International orders are eligible for free shipping on orders over $250.',
        },
        {
          question: 'Can I track my order?',
          answer:
            "Absolutely. Once your order ships, you'll receive an email with tracking information. You can use this to monitor your package from our fulfillment center to your door.",
        },
        {
          question: 'Do you ship internationally?',
          answer:
            'Yes, we ship to over 40 countries worldwide. International shipping times and costs vary by destination. Visit our shipping policy page for complete details about your region.',
        },
      ],
    },
    {
      category: 'Returns & Exchanges',
      questions: [
        {
          question: 'What is your return policy?',
          answer:
            'We offer a 30-day return policy on all unworn items in original condition with original packaging. Returns are processed for refund or store credit. Please contact our customer service team to initiate a return.',
        },
        {
          question: 'How do I initiate a return?',
          answer:
            "To start a return, email our customer service team with your order number and reason for return. You can also use our online return portal on the account page. We'll provide a prepaid shipping label so returning your item is easy.",
        },
        {
          question: 'Can I exchange for a different size?',
          answer:
            "Yes! We offer free exchanges for different sizes within 30 days of purchase. Simply contact our customer service team with your order number and the size you need, and we'll arrange the exchange at no additional cost.",
        },
      ],
    },
    {
      category: 'Product & Care',
      questions: [
        {
          question: 'Are your gemstones natural?',
          answer:
            'Yes, all our gemstones are natural. We do not use synthetic or lab-created stones (except where specifically noted, such as lab-created diamonds). Each stone is selected for its quality and natural beauty.',
        },
        {
          question: 'How should I care for my jewelry?',
          answer:
            'To keep your LUNARIS jewelry beautiful, avoid exposing it to water, perfume, or harsh chemicals. Store your pieces in the soft pouch provided. For deeper cleaning, use a soft cloth. We recommend removing your jewelry during exercise, bathing, and swimming.',
        },
        {
          question: 'Do the crystals have real spiritual properties?',
          answer:
            'We draw on ancient wisdom traditions, metaphysical practices, and centuries of crystal healing knowledge. Each stone is selected for its unique energetic vibration. While we honor these spiritual traditions deeply, the meaning of each crystal is ultimately what resonates with your soul. We create these pieces as sacred tools for spiritual practice and energy alignment.',
        },
        {
          question: 'Are your materials hypoallergenic?',
          answer:
            'We use 925 sterling silver and 14K gold vermeil in our pieces, which are hypoallergenic and suitable for sensitive skin. Surgical steel posts are used in our earrings. If you have specific metal sensitivities, please contact us to discuss options.',
        },
      ],
    },
    {
      category: 'Gifting',
      questions: [
        {
          question: 'Do you offer gift wrapping?',
          answer:
            'Yes! Complimentary gift wrapping is available on all orders. Our signature packaging includes special care details perfect for presentation. Simply select the gift option at checkout.',
        },
        {
          question: 'Can I include a personal message?',
          answer:
            "Absolutely. You can include a personal message that we'll include with your gift. Add your message in the special instructions section at checkout, and we'll include it in the packaging.",
        },
        {
          question: 'Can I send directly to the recipient?',
          answer:
            "Yes! Choose the gift option at checkout and enter the recipient's shipping address. Your gift will be sent directly to them with complimentary gift wrapping. You can include a personal message that arrives with the package.",
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <PlaceholderImage
          width="w-full"
          height="h-full"
          text="Questions & Answers"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-dark/40 flex flex-col items-center justify-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl text-cream text-center font-light">
            Frequently Asked Questions
          </h1>
          <p className="text-cream/90 text-center text-lg max-w-2xl px-4">
            Everything you need to know about LUNARIS and our sacred jewelry.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="font-serif text-2xl md:text-3xl text-dark mb-8 pb-4 border-b-2 border-gold">
                {section.category}
              </h2>
              <Accordion items={section.questions as AccordionItem[]} />
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-20 px-4 bg-dark text-cream">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-serif text-3xl md:text-4xl font-light">Still have questions?</h2>
          <p className="text-cream/90 text-lg leading-relaxed">
            Our customer service team is here to help. Reach out with any questions about our
            products, shipping, or your LUNARIS experience.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-gold" />
              <a href="mailto:hello@lunaris.com" className="hover:text-gold transition-colors">
                hello@lunaris.com
              </a>
            </div>
            <div className="hidden md:block w-0.5 h-6 bg-gold/30"></div>
            <div className="flex items-center space-x-3">
              <Phone size={20} className="text-gold" />
              <a href="tel:+18005551234" className="hover:text-gold transition-colors">
                +1 (800) 555-1234
              </a>
            </div>
          </div>
          <Button href="/contact" variant="gold" size="lg">
            Send Us a Message
          </Button>
        </div>
      </section>
    </main>
  );
}
