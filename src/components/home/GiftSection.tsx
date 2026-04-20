'use client'

import PlaceholderImage from "@/components/layout/PlaceholderImage";
import { Button } from "@/components/ui/Button";
import { useLanguage } from '@/components/providers/LanguageProvider';

export function GiftSection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-stone-light">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Image */}
          <div className="order-2 md:order-1">
            <PlaceholderImage
              width="w-full"
              height="h-96"
              text="Gift Packaging"
              className="w-full"
              src="https://images.unsplash.com/photo-1549465220-1a8b9238f1b0?w=1200&h=600&fit=crop&q=80"
              alt="Gift Packaging"
            />
          </div>

          {/* Right: Content */}
          <div className="order-1 md:order-2">
            <h2 className="font-serif text-3xl md:text-4xl text-dark mb-6">
              {t('home.gift.title')}
            </h2>

            <p className="font-sans text-warm mb-6 leading-relaxed">
              {t('home.gift.description')}
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                <p className="font-sans text-warm text-sm">
                  <span className="font-medium">{t('home.gift.wrapping.title')}</span> - {t('home.gift.wrapping.description')}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                <p className="font-sans text-warm text-sm">
                  <span className="font-medium">{t('home.gift.blessing.title')}</span> - {t('home.gift.blessing.description')}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                <p className="font-sans text-warm text-sm">
                  <span className="font-medium">{t('home.gift.card.title')}</span> - {t('home.gift.card.description')}
                </p>
              </div>
            </div>

            <Button
              href="/gifts"
              variant="primary"
              size="md"
            >
              {t('home.gift.cta')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
