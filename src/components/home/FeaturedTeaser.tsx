'use client'

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getBestSellers } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import PlaceholderImage from '@/components/layout/PlaceholderImage';
import { useProductStatus } from '@/components/providers/ProductStatusProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function FeaturedTeaser() {
  const { products, getStatus } = useProductStatus();
  const { t } = useLanguage();

  // Filter out hidden products, then get best sellers
  const visibleProducts = products.filter((p) => {
    const status = getStatus(p.id);
    return !status.isHidden && !p.isHidden;
  });
  const featuredProducts = getBestSellers(visibleProducts).slice(0, 4);

  if (featuredProducts.length === 0) return null;

  return (
    <section className="py-20 md:py-28 px-4 bg-dark relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-gold/[0.03]" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-mystic-star mb-4">{t('home.featured.badge')}</p>
          <h2 className="font-serif text-3xl md:text-5xl text-cream font-light">{t('home.featured.title')}</h2>
          <p className="font-sans text-sm text-cream/50 mt-4 max-w-lg mx-auto">
            {t('home.featured.description')}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group">
              <div className="relative overflow-hidden aspect-square mb-4 rounded-lg">
                <PlaceholderImage
                  width="w-full"
                  height="h-full"
                  text={product.name}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  src={product.images[0]}
                  alt={product.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-sans text-xs text-cream uppercase tracking-wider">{t('home.featured.viewDetails')}</span>
                  <ArrowRight className="w-4 h-4 text-cream" />
                </div>
              </div>
              <h3 className="font-serif text-sm md:text-base text-cream group-hover:text-gold transition-colors duration-300">
                {product.name}
              </h3>
              <p className="text-xs text-cream/40 uppercase tracking-wider mt-1">
                {product.gemstone}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button href="/products" variant="secondary" size="lg">
            {t('home.featured.exploreAll')}
          </Button>
        </div>
      </div>
    </section>
  );
}
