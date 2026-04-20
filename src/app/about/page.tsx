'use client';

import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Gem, Heart, Shield, Star } from 'lucide-react';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-cream">

      {/* Hero */}
      <section className="py-20 md:py-28 px-4 text-center">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold mb-4">{t('about.aboutUs')}</p>
        <h1 className="font-serif text-4xl md:text-6xl text-dark font-light mb-6">YINYANG GUARDIAN</h1>
        <div className="h-px w-16 bg-gold mx-auto mb-6" />
        <p className="font-sans text-base md:text-lg text-warm max-w-2xl mx-auto leading-relaxed">
          Crystal jewelry rooted in the ancient wisdom of yin and yang, designed to align your chakras and restore balance to body, mind, and spirit.
        </p>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-20 px-4 bg-dark texture-noise-dark">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-cream font-light mb-6">{t('about.philosophyTitle')}</h2>
          <p className="font-sans text-base text-cream/60 leading-relaxed">
            {t('about.philosophyDescription')}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              { icon: Gem, titleKey: 'about.chakraTitle', textKey: 'about.chakraDescription' },
              { icon: Shield, titleKey: 'about.yinYangTitle', textKey: 'about.yinYangDescription' },
              { icon: Heart, titleKey: 'about.balancedTitle', textKey: 'about.balancedDescription' },
              { icon: Star, titleKey: 'about.activationTitle', textKey: 'about.activationDescription' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-dark mb-2">{t(item.titleKey)}</h3>
                    <p className="font-sans text-sm text-warm leading-relaxed">{t(item.textKey)}</p>
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
              <p className="font-sans text-xs uppercase tracking-wider text-warm mt-2">{t('about.chakraStonesLabel')}</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-gold">48h</p>
              <p className="font-sans text-xs uppercase tracking-wider text-warm mt-2">{t('about.balancingHoursLabel')}</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-gold">7</p>
              <p className="font-sans text-xs uppercase tracking-wider text-warm mt-2">{t('about.energyCentersLabel')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 text-center">
        <h2 className="font-serif text-2xl md:text-3xl text-dark font-light mb-4">
          {t('about.discoverBalance')}
        </h2>
        <p className="font-sans text-sm text-warm mb-8">
          {t('about.discoverBalanceDescription')}
        </p>
        <Button href="/products" variant="primary" size="lg">
          {t('about.exploreCollections')}
        </Button>
      </section>

    </main>
  );
}
