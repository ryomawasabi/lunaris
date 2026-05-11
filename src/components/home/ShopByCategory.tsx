'use client'

import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import PlaceholderImage from "@/components/layout/PlaceholderImage";
import { useProductStatus } from "@/components/providers/ProductStatusProvider";
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { cn } from "@/lib/utils";

export function ShopByCategory() {
  const { categories } = useProductStatus();
  const { t } = useLanguage();
  const { translateCategory } = useProductTranslation();

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          subtitle={t('home.shopByCategory.browse')}
          title={t('home.shopByCategory.title')}
          align="center"
        />

        <div className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        )}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
            >
              <div className="group relative overflow-hidden aspect-square">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-300">
                  <PlaceholderImage
                    width="w-full"
                    height="h-full"
                    text={translateCategory(category.name)}
                    className="w-full h-full"
                    src={category.image}
                    alt={translateCategory(category.name)}
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/50 transition-colors duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h3 className="font-serif text-2xl md:text-3xl text-cream mb-2 text-center">
                    {translateCategory(category.name)}
                  </h3>
                  <p className="font-sans text-cream/80 text-sm">
                    {category.productCount} {t('home.shopByCategory.subtitle')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
