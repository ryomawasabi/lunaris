'use client';

import Link from "next/link";
import PlaceholderImage from "@/components/layout/PlaceholderImage";
import { Collection } from "@/lib/types";
import { useLanguage } from '@/components/providers/LanguageProvider';

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const { t } = useLanguage();
  return (
    <Link href={`/collections/${collection.slug}`}>
      <div className="group relative overflow-hidden aspect-square md:aspect-auto md:h-96">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-300">
          <PlaceholderImage width="w-full" height="h-full" src={collection.image} alt={collection.name} />
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/40 to-transparent" />

        {/* Text Content - Bottom aligned */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <h3 className="font-serif text-2xl md:text-3xl text-cream mb-2">
            {collection.name}
          </h3>
          <p className="font-sans text-cream/80 text-sm mb-4 line-clamp-2">
            {collection.tagline}
          </p>
          <button className="text-cream text-sm font-sans font-medium uppercase tracking-wider hover:text-gold transition-colors inline-flex items-center gap-2 w-fit">
            {t('collectionCard.explore')}
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
