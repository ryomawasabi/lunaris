import { Gem, Shield, Gift, RotateCcw } from 'lucide-react';

const values = [
  {
    icon: Gem,
    title: "Blessed & Purified",
    description: "Every piece is cleansed with sage and charged under the full moon before reaching you, ensuring pure spiritual energy."
  },
  {
    icon: Shield,
    title: "Sacred Gemstones",
    description: "We use only authentic, ethically sourced gemstones renowned for their spiritual healing properties and protective energies."
  },
  {
    icon: Gift,
    title: "Karmic Gifting",
    description: "Each piece includes an intention card explaining its spiritual meaning, perfect for sharing positive energy with loved ones."
  },
  {
    icon: RotateCcw,
    title: "Energy Guarantee",
    description: "If a piece doesn't align with your energy, we offer free returns within 30 days. Your spiritual journey matters to us."
  }
];

export function BrandValues() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {values.map((value) => {
            const IconComponent = value.icon;
            return (
              <div key={value.title} className="flex flex-col items-center text-center">
                <div className="mb-6">
                  <IconComponent className="w-12 h-12 text-gold" />
                </div>
                <h3 className="font-serif text-lg text-dark mb-3">
                  {value.title}
                </h3>
                <p className="font-sans text-sm text-warm leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
