'use client'

import { SectionTitle } from "@/components/ui/SectionTitle";
import { CollectionCard } from "@/components/collection/CollectionCard";
import { useProductStatus } from "@/components/providers/ProductStatusProvider";
import { useLanguage } from '@/components/providers/LanguageProvider';

export function CollectionShowcase() {
  const { collections } = useProductStatus();
  const { t } = useLanguage();

  // Show first 4 featured collections
  const featuredCollections = collections.slice(0, 4);

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-cream">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          subtitle={t('home.collectionShowcase.title')}
          title={t('home.collectionShowcase.subtitle')}
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {featuredCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
