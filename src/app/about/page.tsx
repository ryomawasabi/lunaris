import { Metadata } from 'next';
import PlaceholderImage from '@/components/layout/PlaceholderImage';
import { Button } from '@/components/ui/Button';
import { Sparkles, Shield, Gem, Eye, Moon, Star, Flame, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About LUNARIS | Our Spiritual Journey',
  description:
    'Discover the LUNARIS story: sacred spiritual jewelry channeling cosmic energy, ancient wisdom, and karmic protection for your soul.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream">

      {/* Cinematic Hero */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <PlaceholderImage
          width="w-full"
          height="h-full"
          text="LUNARIS"
          className="absolute inset-0"
          src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=1800&h=1000&fit=crop&q=80"
          alt="Sacred Jewelry Craftsmanship"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-mystic-star" />
            <Star className="w-4 h-4 text-mystic-star" />
            <div className="h-px w-12 bg-mystic-star" />
          </div>
          <p className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-mystic-star mb-4">
            Est. 2024 &mdash; Sacred Adornment
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream text-center font-light leading-tight">
            Our Story
          </h1>
          <p className="font-serif text-lg md:text-xl text-cream/70 text-center mt-6 max-w-xl italic">
            Where ancient wisdom meets modern mysticism
          </p>
          <div className="flex items-center gap-3 mt-8">
            <div className="h-px w-8 bg-cream/30" />
            <span className="text-mystic-star text-lg">&#10022;</span>
            <div className="h-px w-8 bg-cream/30" />
          </div>
        </div>
      </section>

      {/* Opening Statement — Full Width Dramatic */}
      <section className="py-20 md:py-32 px-4 bg-dark relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full border border-gold/5" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full border border-gold/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold/[0.03]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Moon className="w-8 h-8 text-gold mx-auto mb-8 opacity-60" />
          <h2 className="font-serif text-3xl md:text-5xl text-cream font-light leading-relaxed mb-8">
            We believe jewelry should do more than adorn
            <span className="text-gold">&mdash;</span>
            <br className="hidden md:block" />
            it should <em className="text-gold">transform</em>.
          </h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8" />
          <p className="font-sans text-base md:text-lg text-cream/60 leading-relaxed max-w-2xl mx-auto">
            LUNARIS was born from a calling to bridge the seen and unseen worlds. Each piece is a portal
            to ancient protective energies, channeled through sacred gemstones and intentional design.
          </p>
        </div>
      </section>

      {/* Brand Pillars — Luxe Cards */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold mb-4">Our Philosophy</p>
            <h2 className="font-serif text-3xl md:text-5xl text-dark font-light">Three Sacred Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Sacred Energy',
                subtitle: 'Channeled Power',
                description: 'Each piece is designed to channel cosmic energy through sacred geometry and healing gemstones, creating wearable talismans that resonate with your soul.',
              },
              {
                icon: Shield,
                title: 'Karmic Integrity',
                subtitle: 'Pure Intention',
                description: 'Every gemstone is ethically sourced with positive karma. The energy that reaches you is pure, unbroken, and aligned with the highest spiritual vibration.',
              },
              {
                icon: Flame,
                title: 'Ritual Craft',
                subtitle: 'Meditative Creation',
                description: 'Our artisans work in meditative states, infusing each detail with spiritual purpose. Every piece emerges as a unique vessel of protective energy.',
              },
            ].map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white border border-stone-light rounded-2xl p-8 md:p-10 hover:border-gold/40 hover:shadow-xl hover:shadow-gold/5 transition-all duration-500"
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/10 to-mystic-aura/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-gold mb-2">{pillar.subtitle}</p>
                  <h3 className="font-serif text-2xl text-dark mb-4">{pillar.title}</h3>
                  <p className="font-sans text-sm text-warm leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Split Image + Story */}
      <section className="py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Image Side */}
          <div className="relative h-80 lg:h-auto overflow-hidden">
            <PlaceholderImage
              width="w-full"
              height="h-full"
              text="Artisan Crafting"
              className="absolute inset-0"
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900&h=1000&fit=crop&q=80"
              alt="Artisan crafting sacred jewelry"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark/20 lg:bg-none" />
          </div>

          {/* Content Side */}
          <div className="bg-dark flex items-center px-8 md:px-16 lg:px-20 py-16 lg:py-0">
            <div className="max-w-lg">
              <div className="flex items-center gap-3 mb-6">
                <Gem className="w-5 h-5 text-mystic-star" />
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-mystic-star">The Craft</p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-cream font-light leading-snug mb-6">
                Every gemstone tells a story millions of years in the making
              </h2>
              <div className="space-y-5 text-cream/60 font-sans text-sm leading-relaxed">
                <p>
                  We hand-select each crystal for its metaphysical properties, clarity, and energetic resonance.
                  From deep purple amethyst for spiritual awakening to rose quartz for unconditional love,
                  every stone is chosen with sacred intention.
                </p>
                <p>
                  Our master artisans work with sterling silver and gold vermeil, shaping each setting
                  to amplify the stone&apos;s natural frequency. The result is jewelry that doesn&apos;t just look
                  beautiful&mdash;it <em>feels</em> alive.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-6">
                <div className="text-center">
                  <p className="font-serif text-3xl text-gold">100+</p>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-cream/40 mt-1">Crystal Varieties</p>
                </div>
                <div className="w-px h-10 bg-cream/10" />
                <div className="text-center">
                  <p className="font-serif text-3xl text-gold">48h</p>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-cream/40 mt-1">Avg. Craft Time</p>
                </div>
                <div className="w-px h-10 bg-cream/10" />
                <div className="text-center">
                  <p className="font-serif text-3xl text-gold">7</p>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-cream/40 mt-1">Blessing Steps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process — Elegant Timeline */}
      <section className="py-20 md:py-28 px-4 bg-cream relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold mb-4">From Vision to Vessel</p>
            <h2 className="font-serif text-3xl md:text-5xl text-dark font-light">The Sacred Process</h2>
          </div>

          <div className="space-y-0">
            {[
              {
                number: '01',
                title: 'Channeling',
                description: 'We begin in deep meditation, connecting with celestial alignments and the metaphysical realm to receive the vision for each new piece.',
                icon: Eye,
              },
              {
                number: '02',
                title: 'Sacred Design',
                description: 'Spiritual visions are translated into sacred geometry, considering energy flow, chakra alignment, and how the piece will resonate with its future wearer.',
                icon: Moon,
              },
              {
                number: '03',
                title: 'Crystal Selection',
                description: 'Each gemstone is hand-selected for its spiritual properties, energetic vibration, and alignment with the piece\'s protective or healing purpose.',
                icon: Gem,
              },
              {
                number: '04',
                title: 'Blessing & Activation',
                description: 'Every finished piece undergoes ritual cleansing under moonlight and is blessed with positive energy before beginning its journey to you.',
                icon: Star,
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative flex gap-8 md:gap-12 pb-12 last:pb-0">
                  {/* Vertical Line */}
                  {index < 3 && (
                    <div className="absolute left-6 md:left-8 top-16 bottom-0 w-px bg-gradient-to-b from-gold/30 to-stone" />
                  )}

                  {/* Number Circle */}
                  <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-dark flex items-center justify-center relative z-10">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                  </div>

                  {/* Content */}
                  <div className="pt-1 md:pt-3">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="font-sans text-xs text-gold/60 tracking-wider">{step.number}</span>
                      <h3 className="font-serif text-xl md:text-2xl text-dark">{step.title}</h3>
                    </div>
                    <p className="font-sans text-sm text-warm leading-relaxed max-w-lg">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonial / Quote — Full Bleed */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <PlaceholderImage
          width="w-full"
          height="h-full"
          text="Sacred Space"
          className="absolute inset-0"
          src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1800&h=800&fit=crop&q=80"
          alt="Mystical cosmic background"
        />
        <div className="absolute inset-0 bg-dark/80" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Star className="w-3 h-3 text-mystic-star" />
            <Star className="w-4 h-4 text-mystic-star" />
            <Star className="w-3 h-3 text-mystic-star" />
          </div>
          <blockquote className="font-serif text-2xl md:text-4xl lg:text-5xl text-cream font-light leading-relaxed italic">
            &ldquo;When you wear sacred energy close to your heart, the universe conspires to protect your path.&rdquo;
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-gold/40" />
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold">
              The LUNARIS Spirit Circle
            </p>
            <div className="h-px w-8 bg-gold/40" />
          </div>
        </div>
      </section>

      {/* Promise Strip */}
      <section className="py-16 md:py-20 px-4 bg-white border-y border-stone-light">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { icon: Gem, label: 'Genuine Gemstones', sub: 'Certified & Authentic' },
              { icon: Shield, label: 'Lifetime Energy', sub: 'Blessed & Protected' },
              { icon: Heart, label: 'Ethically Sourced', sub: 'Positive Karma Only' },
              { icon: Star, label: 'Sacred Craft', sub: 'Handmade with Intention' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="text-center">
                  <Icon className="w-6 h-6 text-gold mx-auto mb-3" />
                  <p className="font-serif text-sm md:text-base text-dark mb-1">{item.label}</p>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-warm">{item.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA — Premium */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-cream to-stone-light">
        <div className="max-w-2xl mx-auto text-center">
          <Sparkles className="w-6 h-6 text-gold mx-auto mb-6" />
          <h2 className="font-serif text-3xl md:text-4xl text-dark font-light mb-6">
            Begin Your Sacred Journey
          </h2>
          <p className="font-sans text-base text-warm leading-relaxed mb-10">
            Explore our collections and discover the talismans that resonate with your soul&apos;s deepest purpose.
            Every piece is waiting for its rightful guardian.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/products" variant="primary" size="lg">
              Explore Collections
            </Button>
            <Button href="/gifts" variant="secondary" size="lg">
              Sacred Gifting
            </Button>
          </div>
        </div>
      </section>

    </main>
  );
}
