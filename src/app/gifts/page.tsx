'use client'

import { Gift, PenLine, BookOpen, Heart, Trophy, Calendar, Zap } from 'lucide-react';
import PlaceholderImage from '@/components/layout/PlaceholderImage';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useProductStatus } from '@/components/providers/ProductStatusProvider';

export default function GiftsPage() {
  const { products } = useProductStatus();

  const giftFeatures = [
    {
      icon: Gift,
      title: 'Sacred Gift Wrapping',
      description: 'Every order arrives in blessed packaging designed to preserve the spiritual energy within.',
    },
    {
      icon: PenLine,
      title: 'Karmic Blessing Note',
      description: 'Include a personal blessing or intention with your gift to amplify its spiritual power.',
    },
    {
      icon: BookOpen,
      title: 'Crystal Energy Guide',
      description:
        'Each piece comes with a guide explaining its spiritual properties and how to activate its protective energy.',
    },
  ];

  const occasions = [
    { icon: Heart, label: 'Birthday', value: 'birthday' },
    { icon: Calendar, label: 'Anniversary', value: 'anniversary' },
    { icon: Trophy, label: 'Graduation', value: 'graduation' },
    { icon: Zap, label: "Mother's Day", value: 'mothers-day' },
    { icon: Gift, label: 'Just Because', value: 'just-because' },
    { icon: BookOpen, label: 'Thank You', value: 'thank-you' },
  ];

  const priceRanges = [
    { label: 'Under $75', min: 0, max: 75 },
    { label: '$75 - $150', min: 75, max: 150 },
    { label: '$150 - $250', min: 150, max: 250 },
    { label: 'Premium ($250+)', min: 250, max: Infinity },
  ];

  // Get giftable products from context
  const giftableProducts = products.filter((p) => p.isGiftable).slice(0, 8);

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[28rem] overflow-hidden">
        <PlaceholderImage
          width="w-full"
          height="h-full"
          text="Meaningful Gifting"
          className="absolute inset-0"
          src="https://images.unsplash.com/photo-1549465220-1a8b9238f1b0?w=1200&h=600&fit=crop&q=80"
          alt="Meaningful Gifting"
        />
        <div className="absolute inset-0 bg-dark/40 flex flex-col items-center justify-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl text-cream text-center font-light">
            Share Positive Karma
          </h1>
          <p className="text-cream/90 text-center text-lg max-w-2xl px-4">
            Gift more than jewelry—share spiritual protection, cosmic energy, and sacred blessings.
          </p>
        </div>
      </section>

      {/* Gift Features */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Why Gift Sacred Energy" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {giftFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="flex justify-center">
                    <Icon size={48} className="text-gold" />
                  </div>
                  <h3 className="font-serif text-2xl text-dark">{feature.title}</h3>
                  <p className="text-warm text-base leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gift by Occasion */}
      <section className="py-16 md:py-20 px-4 bg-stone-light">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Gift by Occasion" align="center" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {occasions.map((occasion, index) => {
              const Icon = occasion.icon;
              return (
                <Button
                  key={index}
                  href={`/products?occasion=${occasion.value}`}
                  variant="secondary"
                  className="flex flex-col items-center justify-center h-32 space-y-2 border-2 border-dark hover:bg-dark hover:text-cream"
                >
                  <Icon size={24} />
                  <span className="text-xs font-semibold text-center">{occasion.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gift by Price */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Gift by Price" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {priceRanges.map((range, index) => (
              <Button
                key={index}
                href={`/products?minPrice=${range.min}&maxPrice=${range.max === Infinity ? '' : range.max}`}
                variant="secondary"
                className="h-24 border-2 border-dark text-dark hover:bg-dark hover:text-cream flex items-center justify-center text-center"
              >
                <span className="font-serif text-lg font-semibold">{range.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Most Giftable Products */}
      <section className="py-16 md:py-20 px-4 bg-stone-light">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Most Blessed Gift Pieces" align="center" />
          <p className="text-center text-warm mb-12 max-w-2xl mx-auto">
            Sacred selections perfect for sharing positive energy. Each piece carries spiritual power and comes with
            a crystal energy guide.
          </p>
          <ProductGrid products={giftableProducts} columns={4} />
        </div>
      </section>

      {/* Gift Wrapping Experience */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <PlaceholderImage
                width="w-full"
                height="h-80"
                text="Unboxing Experience"
                src="https://images.unsplash.com/photo-1549465220-1a8b9238f1b0?w=1200&h=600&fit=crop&q=80"
                alt="Unboxing Experience"
              />
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl text-dark">The Sacred Unboxing</h2>
              <p className="text-warm text-base leading-relaxed">
                We believe that the moment of receiving sacred energy is itself a spiritual experience. Each LUNARIS
                piece arrives in blessed packaging—designed to protect the spiritual vibration within.
              </p>
              <p className="text-warm text-base leading-relaxed">
                Every box is designed to create a moment of cosmic connection when the recipient opens it.
                We include a crystal energy guide explaining the spiritual properties of their piece, transforming
                a gift into a sacred practice. The energy keeps flowing every time they wear it.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start space-x-3">
                  <Gift size={20} className="text-gold flex-shrink-0 mt-1" />
                  <p className="text-warm text-sm">Premium packaging with symbolic details</p>
                </div>
                <div className="flex items-start space-x-3">
                  <PenLine size={20} className="text-gold flex-shrink-0 mt-1" />
                  <p className="text-warm text-sm">Personalized message included</p>
                </div>
                <div className="flex items-start space-x-3">
                  <BookOpen size={20} className="text-gold flex-shrink-0 mt-1" />
                  <p className="text-warm text-sm">Meaning card with symbolic explanation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 px-4 bg-dark text-cream">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-serif text-3xl md:text-4xl font-light">Ready to Share Sacred Energy?</h2>
          <p className="text-cream/90 text-lg leading-relaxed">
            Find the perfect talisman and gift someone the power of spiritual protection and cosmic alignment.
          </p>
          <Button href="/products" variant="gold" size="lg">
            Shop Gift Collection
          </Button>
        </div>
      </section>
    </main>
  );
}
