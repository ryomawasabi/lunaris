import { Metadata } from 'next';
import PlaceholderImage from '@/components/layout/PlaceholderImage';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Sparkles, Lock, Hammer } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About LUNARIS | Our Spiritual Journey',
  description:
    'Discover the LUNARIS story: sacred spiritual jewelry channeling cosmic energy, ancient wisdom, and karmic protection for your soul.',
};

export default function AboutPage() {
  const values = [
    {
      icon: Sparkles,
      title: 'Sacred Energy',
      description:
        'Each piece is designed to channel cosmic energy and spiritual vibrations. We harness the ancient power of sacred symbols and healing gemstones to create wearable talismans.',
    },
    {
      icon: Lock,
      title: 'Karmic Integrity',
      description:
        'We believe in the interconnectedness of all things. Every gemstone is ethically sourced with positive karma, ensuring the energy that reaches you is pure and untainted.',
    },
    {
      icon: Hammer,
      title: 'Ritual Craftsmanship',
      description:
        'Our artisans infuse each piece with intention through meditative creation. Every detail is crafted with spiritual purpose, making each piece a unique vessel of energy.',
    },
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Channeling',
      description:
        'We begin by connecting with ancient spiritual traditions—meditating on sacred symbols, celestial alignments, and the metaphysical properties of crystals.',
    },
    {
      number: '02',
      title: 'Sacred Design',
      description:
        'Our designers translate spiritual visions into sacred geometry, considering the flow of energy, chakra alignment, and how the piece will resonate with the wearer.',
    },
    {
      number: '03',
      title: 'Crystal Selection',
      description:
        "We hand-select every gemstone for its spiritual properties and energetic vibration, ensuring alignment with the piece's protective or healing purpose.",
    },
    {
      number: '04',
      title: 'Blessing',
      description:
        'Each finished piece undergoes a ritual cleansing and blessing, infusing it with positive energy before it begins its journey to you.',
    },
  ];

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[28rem] overflow-hidden">
        <PlaceholderImage
          width="w-full"
          height="h-full"
          text="Our Story"
          className="absolute inset-0"
          src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=1600&h=600&fit=crop&q=80"
          alt="Our Story"
        />
        <div className="absolute inset-0 bg-dark/40 flex items-center justify-center">
          <h1 className="font-serif text-4xl md:text-5xl text-cream text-center font-light">
            Our Story
          </h1>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert max-w-none space-y-6 text-warm">
            <p className="text-base md:text-lg leading-relaxed">
              LUNARIS was born from a deep calling to bridge the seen and unseen worlds through sacred adornment.
              We channel ancient wisdom, cosmic energy, and the healing power of crystals into jewelry
              that serves as a spiritual companion on your soul&apos;s journey. Every piece is a portal—connecting
              you to the divine energy that flows through all things.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              Inspired by sacred geometry, celestial cycles, and the mystical properties of gemstones,
              we create wearable talismans that protect, heal, and empower. Each piece is infused with
              intention during creation, designed to align your chakras, attract positive karma, and
              shield you from negative energies. This is jewelry as spiritual practice.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              When you choose LUNARIS, you&apos;re not just wearing jewelry—you&apos;re activating ancient
              protective energies. You&apos;re aligning with the cosmos. You&apos;re joining a community of
              spiritual seekers who believe in the transformative power of sacred adornment.
            </p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-16 md:py-20 px-4 bg-stone-light">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Our Values" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="flex justify-center">
                    <Icon size={48} className="text-gold" />
                  </div>
                  <h3 className="font-serif text-2xl text-dark">{value.title}</h3>
                  <p className="text-warm text-base leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Our Process" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="space-y-4">
                <div className="text-gold font-serif text-5xl font-light opacity-60">
                  {step.number}
                </div>
                <h3 className="font-serif text-xl text-dark">{step.title}</h3>
                <p className="text-warm text-sm leading-relaxed">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block h-0.5 bg-gold/20 mt-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="py-16 md:py-20 px-4 bg-dark text-cream">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <blockquote className="font-serif text-3xl md:text-4xl leading-relaxed font-light italic">
            &ldquo;When you wear sacred energy close to your heart, the universe conspires to protect your path.&rdquo;
          </blockquote>
          <p className="font-sans text-sm uppercase tracking-wider text-gold">
            — The LUNARIS Spirit Circle
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-warm text-lg leading-relaxed">
            Ready to awaken your spiritual energy? Explore our sacred collections and find the
            talismans that resonate with your soul&apos;s purpose.
          </p>
          <Button href="/products" variant="primary" size="lg">
            Explore Our Collections
          </Button>
        </div>
      </section>
    </main>
  );
}
