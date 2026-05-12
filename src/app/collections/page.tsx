import type { Metadata } from 'next';
import { CollectionsContent } from './CollectionsContent';
import { getCollections } from '@/lib/supabase/queries';
import { COLLECTIONS as FALLBACK_COLLECTIONS } from '@/lib/data';

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Collections — Crystal Bracelets, Essence Oils, Crystal Balls & More',
  description: 'Explore our curated collections of spiritual crystal jewelry — Protection, Love & Harmony, Grounding, Abundance, and more. Each collection channels unique gemstone energies.',
  alternates: {
    canonical: 'https://yinyangguardian.com/collections',
  },
  openGraph: {
    title: 'Crystal Jewelry Collections | YINYANG GUARDIAN',
    description: 'Curated crystal jewelry collections for protection, love, grounding, and abundance.',
  },
};

export default async function CollectionsPage() {
  let collections = await getCollections()
  if (collections.length === 0) {
    collections = FALLBACK_COLLECTIONS
  }

  return (
    <div className="min-h-screen bg-cream">
      <CollectionsContent collections={collections} />
    </div>
  );
}
