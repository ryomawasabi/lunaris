import type { Metadata } from 'next';
import Link from 'next/link';
import PlaceholderImage from '@/components/layout/PlaceholderImage';
import { CollectionCard } from '@/components/collection/CollectionCard';
import { COLLECTIONS } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Collections | LUNARIS',
  description: 'Explore our sacred collections of spiritual jewelry, each channeling unique cosmic energies to protect, heal, and empower your soul.',
  openGraph: {
    title: 'Collections | LUNARIS',
    description: 'Explore our sacred collections of spiritual jewelry channeling cosmic energy.',
  },
};

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative w-full aspect-[21/7] overflow-hidden">
        <div className="absolute inset-0">
          <PlaceholderImage width="w-full" height="h-full" src="https://images.unsplash.com/photo-1515562141589-67f0d569b2d5?w=1600&h=900&fit=crop&q=80" alt="Collections" />
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-dark/40 to-dark/20" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className="font-serif text-5xl md:text-6xl text-cream text-center mb-4">
            Our Collections
          </h1>
          <p className="font-sans text-cream/80 text-center max-w-2xl">
            Each collection channels a unique spiritual energy—find the one that speaks to your soul.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-sm text-warm">
          <Link href="/" className="hover:text-dark transition-colors">
            Home
          </Link>
          <span className="text-warm/50">/</span>
          <span className="text-dark">Collections</span>
        </div>
      </nav>

      {/* Collections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COLLECTIONS.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {/* Spacer */}
      <div className="h-16" />
    </div>
  );
}
