'use client'

import Link from 'next/link'
import { Heart, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useWishlist } from '@/components/providers/WishlistProvider'
import { Product } from '@/lib/types'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ProductGrid } from '@/components/product/ProductGrid'

export default function WishlistPage() {
  const { wishlist, isLoading } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([])
        return
      }

      setLoadingProducts(true)
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const { products: allProducts } = await response.json()
          // Filter to only show products in wishlist
          const wishlistProducts = allProducts.filter((p: Product) => wishlist.includes(p.id))
          setProducts(wishlistProducts)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchWishlistProducts()
  }, [wishlist])

  return (
    <main className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="px-4 md:px-6 lg:px-8 py-6 border-b border-stone-light">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link href="/" className="text-stone hover:text-dark transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-stone" />
          <span className="text-dark font-medium">Wishlist</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="mb-12">
            <SectionTitle title="My Wishlist" align="left" />
          </div>

          {/* Content */}
          {isLoading || loadingProducts ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-pulse">
                <div className="h-8 w-48 bg-stone-light rounded mb-4"></div>
              </div>
            </div>
          ) : products.length > 0 ? (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-sm text-warm">
                  {products.length} {products.length === 1 ? 'item' : 'items'} in your wishlist
                </p>
              </div>

              {/* Products Grid */}
              <ProductGrid products={products} columns={3} />
            </>
          ) : (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <Heart className="w-16 h-16 text-stone-light" />
              </div>
              <h3 className="font-serif text-2xl text-dark mb-3">
                Your wishlist is empty
              </h3>
              <p className="text-warm mb-8 max-w-md mx-auto">
                Save your favorite pieces to your wishlist and we&apos;ll help you remember them
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-dark text-cream hover:bg-charcoal transition-colors text-sm font-sans font-medium uppercase tracking-wider rounded-lg"
              >
                Start Exploring
                <span>→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
