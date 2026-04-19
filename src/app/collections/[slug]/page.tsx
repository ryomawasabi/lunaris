'use client'

import { Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PlaceholderImage from '@/components/layout/PlaceholderImage'
import { ProductGrid } from '@/components/product/ProductGrid'
import { CollectionSort } from '@/components/collection/CollectionSort'
import { getCollectionBySlug, getProductsByCollection, filterProducts } from '@/lib/utils'
import { useProductStatus } from '@/components/providers/ProductStatusProvider'

function CollectionDetailContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { products: allProducts, collections } = useProductStatus()
  const slug = params.slug as string

  const collection = getCollectionBySlug(slug, collections)

  if (!collection) {
    notFound()
  }

  // Get products for this collection from context
  let products = getProductsByCollection(slug, allProducts, collections)

  // Apply sorting based on searchParams
  const sortBy = searchParams.get('sort') || 'featured'
  if (sortBy !== 'featured') {
    let sortOption: 'price-asc' | 'price-desc' | 'newest' | undefined

    if (sortBy === 'price-asc') sortOption = 'price-asc'
    else if (sortBy === 'price-desc') sortOption = 'price-desc'
    else if (sortBy === 'newest') sortOption = 'newest'

    if (sortOption) {
      products = filterProducts({ sortBy: sortOption }, allProducts, collections)
      // Filter by collection after sorting
      const col = collections.find((c) => c.slug === slug)
      products = products.filter((p) =>
        p.collection.some(
          (c) => c === col?.name || c.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-') === slug
        )
      )
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative w-full aspect-[21/8] overflow-hidden">
        <div className="absolute inset-0">
          <PlaceholderImage width="w-full" height="h-full" src={collection.image} alt={collection.name} />
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/40 via-dark/50 to-dark/60" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className="font-serif text-5xl md:text-6xl text-cream text-center mb-4">
            {collection.name}
          </h1>
          <p className="font-sans text-cream/80 text-center text-lg mb-6 max-w-2xl">
            {collection.tagline}
          </p>
          <div className="h-px w-12 bg-gold mx-auto" />
          <p className="font-sans text-cream/70 text-center text-sm uppercase tracking-wider mt-6">
            Symbolism: {collection.symbolism}
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
          <Link href="/collections" className="hover:text-dark transition-colors">
            Collections
          </Link>
          <span className="text-warm/50">/</span>
          <span className="text-dark">{collection.name}</span>
        </div>
      </nav>

      {/* Collection Description */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center">
          <p className="font-sans text-warm text-xs uppercase tracking-wider mb-6">
            About This Collection
          </p>
          <p className="font-serif text-base md:text-lg text-dark leading-relaxed mb-8">
            {collection.longDescription}
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px w-8 bg-gold" />
            <span className="text-gold text-xl">&#10022;</span>
            <div className="h-px w-8 bg-gold" />
          </div>
        </div>
      </section>

      {/* Sort and Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CollectionSort productCount={products.length} />
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length > 0 ? (
          <ProductGrid products={products} columns={3} />
        ) : (
          <div className="text-center py-16">
            <p className="font-serif text-xl text-dark mb-4">
              No products found in this collection
            </p>
            <p className="font-sans text-sm text-warm mb-8">
              Check back soon for new pieces from {collection.name}
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-wider text-dark hover:text-gold transition-colors"
            >
              &larr; Back to Collections
            </Link>
          </div>
        )}
      </section>

      {/* Spacer */}
      <div className="h-16" />
    </div>
  )
}

export default function CollectionDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <CollectionDetailContent />
    </Suspense>
  )
}
