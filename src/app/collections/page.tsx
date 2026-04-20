import type { Metadata } from 'next';
import { CollectionsContent } from './CollectionsContent';
import { getCollections } from '@/lib/supabase/queries';
import { COLLECTIONS as FALLBACK_COLLECTIONS } from '@/lib/data';

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Collections | YINYANG GUARDIAN',
  description: 'Explore our sacred collections of spiritual jewelry, each channeling unique cosmic energies to protect, heal, and empower your soul.',
  openGraph: {
    title: 'Collections | YINYANG GUARDIAN',
    description: 'Explore our sacred collections of spiritual jewelry channeling cosmic energy.',
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
