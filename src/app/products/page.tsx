'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { ChevronRight } from 'lucide-react'
import { filterProducts } from '@/lib/utils'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductFilters } from '@/components/product/ProductFilters'
import { useProductStatus } from '@/components/providers/ProductStatusProvider'

function ProductsContent() {
  const { products, categories, collections } = useProductStatus()
  const searchParams = useSearchParams()

  const category = searchParams.get('category') || undefined
  const collection = searchParams.get('collection') || undefined
  const priceRange = searchParams.get('priceRange') || undefined
  const sort = searchParams.get('sort') || undefined

  // Parse price range
  let minPrice: number | undefined
  let maxPrice: number | undefined
  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number)
    minPrice = min
    maxPrice = max === Infinity ? undefined : max
  }

  // Filter products
  const sortValue = sort as 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'bestsellers' | undefined
  const filteredProducts = filterProducts({
    category,
    collection,
    minPrice,
    maxPrice,
    sortBy: sortValue,
  }, products, collections)

  // Get active collection/category for title
  const activeCollection = collections.find((c) => c.slug === collection)
  const activeCategory = categories.find((c) => c.slug === category)

  const pageTitle = activeCollection
    ? activeCollection.name
    : activeCategory
      ? activeCategory.name
      : 'All Jewelry'

  const pageSubtitle = activeCollection
    ? 'Collection'
    : activeCategory
      ? 'Category'
      : undefined

  return (
    <main className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="px-4 md:px-6 lg:px-8 py-6 border-b border-stone-light">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link href="/" className="text-stone hover:text-dark transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-stone" />
          <span className="text-dark font-medium">Products</span>
          {(activeCollection || activeCategory) && (
            <>
              <ChevronRight className="w-4 h-4 text-stone" />
              <span className="text-dark font-medium">{pageTitle}</span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="mb-12">
            <SectionTitle
              subtitle={pageSubtitle}
              title={pageTitle}
              align="left"
            />
          </div>

          {/* Filters and Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters - Desktop Only */}
            <aside className="hidden lg:block">
              <div className="sticky top-6">
                <ProductFilters />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {filteredProducts.length > 0 ? (
                <>
                  {/* Results Count */}
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-warm">
                      Showing {filteredProducts.length} of {products.length} products
                    </p>
                    {/* Mobile Filters */}
                    <div className="lg:hidden text-xs text-warm">
                      {(category || collection || priceRange || sort) && (
                        <Link
                          href="/products"
                          className="text-warm hover:text-dark transition-colors font-medium"
                        >
                          Clear Filters
                        </Link>
                      )}
                    </div>
                  </div>

                  <ProductGrid products={filteredProducts} columns={3} />
                </>
              ) : (
                <div className="text-center py-16">
                  <h3 className="font-serif text-xl text-dark mb-2">
                    No products found
                  </h3>
                  <p className="text-warm mb-6">
                    Try adjusting your filters or browse all products
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center px-6 py-3 bg-dark text-cream hover:bg-charcoal transition-colors text-sm font-sans font-medium uppercase tracking-wider"
                  >
                    View All Products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <ProductsContent />
    </Suspense>
  )
}
