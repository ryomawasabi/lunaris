import { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Gem, Heart, Shield, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | YINYANG GUARDIAN',
  description: 'YINYANG GUARDIAN creates sacred spiritual jewelry with ethically sourced gemstones and intentional design.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream">

      {/* Hero */}
      <section className="py-20 md:py-28 px-4 text-center">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold mb-4">About Us</p>
        <h1 className="font-serif text-4xl md:text-6xl text-dark font-light mb-6">YINYANG GUARDIAN</h1>
        <div className="h-px w-16 bg-gold mx-auto mb-6" />
        <p className="font-sans text-base md:text-lg text-warm max-w-2xl mx-auto leading-relaxed">
          Sacred spiritual jewelry channeling cosmic energy, ancient wisdom,
          and karmic protection through ethically sourced gemstones and intentional design.
        </p>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-20 px-4 bg-dark">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-cream font-light mb-6">Our Mission</h2>
          <p className="font-sans text-base text-cream/60 leading-relaxed">
            We create jewelry that serves as a bridge between the physical and spiritual worlds.
            Every piece is designed to protect, heal, and empower&mdash;transforming sacred gemstones
            into wearable talismans that resonate with your soul&apos;s purpose.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              { icon: Gem, title: 'Authentic Gemstones', text: 'Every crystal is hand-selected for its metaphysical properties and energetic resonance.' },
              { icon: Shield, title: 'Ethical Sourcing', text: 'Gemstones sourced with positive karma, ensuring pure and unbroken spiritual energy.' },
              { icon: Heart, title: 'Intentional Design', text: 'Each piece is crafted in meditative states, infused with spiritual purpose and sacred geometry.' },
              { icon: Star, title: 'Ritual Blessing', text: 'Every finished piece undergoes cleansing and blessing before beginning its journey to you.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-dark mb-2">{item.title}</h3>
                    <p className="font-sans text-sm text-warm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-16 md:py-20 px-4 bg-stone-light/50">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-serif text-4xl text-gold">100+</p>
              <p className="font-sans text-xs uppercase tracking-wider text-warm mt-2">Crystal Varieties</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-gold">48h</p>
              <p className="font-sans text-xs uppercase tracking-wider text-warm mt-2">Avg. Craft Time</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-gold">7</p>
              <p className="font-sans text-xs uppercase tracking-wider text-warm mt-2">Blessing Steps</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 text-center">
        <h2 className="font-serif text-2xl md:text-3xl text-dark font-light mb-4">
          Explore Our Collections
        </h2>
        <p className="font-sans text-sm text-warm mb-8">
          Discover the talismans that resonate with your journey.
        </p>
        <Button href="/products" variant="primary" size="lg">
          Shop Now
        </Button>
      </section>

    </main>
  );
}
