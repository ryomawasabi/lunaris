'use client'

import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { CollectionCard } from '@/components/collection/CollectionCard';
import PlaceholderImage from '@/components/layout/PlaceholderImage';
import type { Collection } from '@/lib/types';

interface CollectionsContentProps {
  collections: Collection[];
}

export function CollectionsContent({ collections }: CollectionsContentProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full aspect-[21/7] overflow-hidden">
        <div className="absolute inset-0">
          <PlaceholderImage width="w-full" height="h-full" src="https://images.unsplash.com/photo-1515562141589-67f0d569b2d5?w=1600&h=900&fit=crop&q=80" alt="Collections" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-dark/40 to-dark/20" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className="font-serif text-5xl md:text-6xl text-cream text-center mb-4">
            {t('collections.title')}
          </h1>
          <p className="font-sans text-cream/80 text-center max-w-2xl">
            {t('collections.subtitle')}
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-sm text-warm">
          <Link href="/" className="hover:text-dark transition-colors">
            {t('common.home')}
          </Link>
          <span className="text-warm/50">/</span>
          <span className="text-dark">{t('collections.title')}</span>
        </div>
      </nav>

      {/* Collections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
