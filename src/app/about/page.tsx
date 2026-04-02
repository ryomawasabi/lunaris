import { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Gem, Heart, Shield, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | YINYANG GUARDIAN',
  description: 'YINYANG GUARDIAN creates chakra-aligned crystal jewelry inspired by the ancient philosophy of yin and yang balance.',
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
          Crystal jewelry rooted in the ancient wisdom of yin and yang, designed to align your chakras and restore balance to body, mind, and spirit.
        </p>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-20 px-4 bg-dark texture-noise-dark">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-cream font-light mb-6">The Philosophy of Balance</h2>
          <p className="font-sans text-base text-cream/60 leading-relaxed">
            We believe that true beauty comes from harmony — the balance of yin and yang that flows through all living things. Our jewelry bridges the physical and energetic worlds, using chakra-aligned crystals to help you find equilibrium in an unbalanced world.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              { icon: Gem, title: 'Chakra-Aligned Crystals', text: 'Every stone is selected for its resonance with specific energy centers, from root to crown, ensuring balanced chi flow.' },
              { icon: Shield, title: 'Yin-Yang Sourcing', text: 'We honor both the giving and receiving cycle of nature. Stones are sourced with respect for the earth and the communities that gather them.' },
              { icon: Heart, title: 'Balanced Design', text: 'Each piece embodies the interplay of yin and yang — soft curves with bold structure, cooling stones with warming metals.' },
              { icon: Star, title: 'Energetic Activation', text: 'Every piece is charged under both sun (yang) and moon (yin), activating dual energies before it reaches your hands.' },
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
      <section className="py-16 md:py-20 px-4 bg-stone-light/50 texture-noise-light">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-serif text-4xl text-gold">100+</p>
              <p className="font-sans text-xs uppercase tracking-wider text-warm mt-2">Chakra Stones</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-gold">48h</p>
              <p className="font-sans text-xs uppercase tracking-wider text-warm mt-2">Balancing Hours</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-gold">7</p>
              <p className="font-sans text-xs uppercase tracking-wider text-warm mt-2">Energy Centers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 text-center">
        <h2 className="font-serif text-2xl md:text-3xl text-dark font-light mb-4">
          Discover Your Balance
        </h2>
        <p className="font-sans text-sm text-warm mb-8">
          Find the crystals that align with your chakras and restore your flow.
        </p>
        <Button href="/products" variant="primary" size="lg">
          Explore Collections
        </Button>
      </section>

    </main>
  );
}
