'use client'

import { Gem, Shield, Gift, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function BrandValues() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Gem,
      titleKey: 'home.brandValues.blessed.title',
      descriptionKey: 'home.brandValues.blessed.description',
    },
    {
      icon: Shield,
      titleKey: 'home.brandValues.sacred.title',
      descriptionKey: 'home.brandValues.sacred.description',
    },
    {
      icon: Gift,
      titleKey: 'home.brandValues.karmic.title',
      descriptionKey: 'home.brandValues.karmic.description',
    },
    {
      icon: RotateCcw,
      titleKey: 'home.brandValues.energy.title',
      descriptionKey: 'home.brandValues.energy.description',
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {values.map((value) => {
            const IconComponent = value.icon;
            return (
              <div key={value.titleKey} className="flex flex-col items-center text-center">
                <div className="mb-6">
                  <IconComponent className="w-12 h-12 text-gold" />
                </div>
                <h3 className="font-serif text-lg text-dark mb-3">
                  {t(value.titleKey)}
                </h3>
                <p className="font-sans text-sm text-warm leading-relaxed">
                  {t(value.descriptionKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
