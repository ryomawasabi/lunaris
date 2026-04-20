'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import { ChevronRight, Gem, Truck, RotateCcw, Award, Hammer, Sparkles } from 'lucide-react'
import { getProductBySlug, getRelatedProducts, formatPrice } from '@/lib/utils'
import { REVIEWS } from '@/lib/data'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ImageGallery } from '@/components/product/ImageGallery'
import { QuantitySelector } from '@/components/product/QuantitySelector'
import { useProductStatus } from '@/components/providers/ProductStatusProvider'
import { useCart } from '@/components/providers/CartProvider'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function ProductDetailContent() {
  const { t } = useLanguage()
  const params = useParams()
  const slug = params.slug as string
  const { products } = useProductStatus()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)

  const product = getProductBySlug(slug, products)

  if (!product) {
    notFound()
  }

  const relatedProducts = getRelatedProducts(product.id, 4, products)
  const productReviews = REVIEWS.slice(0, 3)

  const hasComparePrice = product.compareAtPrice && product.compareAtPrice > product.price
  const savingsAmount = hasComparePrice
    ? product.compareAtPrice! - product.price
    : 0

  return (
    <main className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="px-4 md:px-6 lg:px-8 py-6 border-b border-stone-light">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link href="/" className="text-warm hover:text-dark transition-colors">
            {t('common.home')}
          </Link>
          <ChevronRight className="w-4 h-4 text-warm" />
          <Link href="/products" className="text-warm hover:text-dark transition-colors">
            {t('productDetail.breadcrumb')}
          </Link>
          <ChevronRight className="w-4 h-4 text-warm" />
          <span className="text-dark font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Detail Section */}
      <div className="px-4 md:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Image Gallery */}
            <div>
              <ImageGallery productName={product.name} images={product.images} imageCount={product.images.length} />
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              {/* Badges */}
              {(product.isBestSeller || product.isNew) && (
                <div className="flex gap-2 mb-6">
                  {product.isBestSeller && <Badge variant="bestseller">{t('productDetail.badgeBestSeller')}</Badge>}
                  {product.isNew && <Badge variant="new">{t('productDetail.badgeNew')}</Badge>}
                </div>
              )}

              {/* Product Name */}
              <h1 className="font-serif text-4xl md:text-5xl text-dark mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.reviewCount > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <StarRating
                    rating={product.rating}
                    count={product.reviewCount}
                    size="md"
                  />
                  <span className="text-sm text-warm">
                    {t('productDetail.reviews', { rating: product.rating, count: product.reviewCount })}
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-stone-light">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl text-dark">
                    {formatPrice(product.price)}
                  </span>
                  {hasComparePrice && (
                    <>
                      <span className="text-lg text-warm line-through">
                        {formatPrice(product.compareAtPrice!)}
                      </span>
                      <span className="text-sm font-medium text-warm">
                        {t('productDetail.saveAmount', { amount: formatPrice(savingsAmount) })}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <p className="text-base text-warm mb-6 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Gemstone & Symbolic Meaning */}
              <div className="mb-6 pb-6 border-b border-stone-light">
                <div className="flex items-start gap-3">
                  <Gem className="w-5 h-5 text-warm flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-sans font-medium text-dark text-sm uppercase tracking-wider mb-2">
                      {product.gemstone}
                    </h3>
                    <p className="text-sm text-warm italic">
                      {product.symbolicMeaning}
                    </p>
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div className="mb-6 pb-6 border-b border-stone-light">
                <h3 className="font-sans font-medium text-dark text-sm uppercase tracking-wider mb-3">
                  Materials
                </h3>
                <ul className="space-y-2">
                  {product.materials.map((material, index) => (
                    <li key={index} className="text-sm text-warm">
                      &bull; {material}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <p className="text-sm font-sans font-medium text-dark mb-3">{t('productDetail.quantity')}</p>
                <QuantitySelector onQuantityChange={setQuantity} />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    addItem({
                      id: product.id,
                      slug: product.slug,
                      name: product.name,
                      price: product.price,
                      image: product.images[0] || '',
                    }, quantity)
                  }}
                  disabled={product.isSoldOut}
                >
                  {product.isSoldOut ? t('productDetail.soldOut') : t('productDetail.addToCart')}
                </Button>
                <Button variant="secondary" size="lg" className="w-full">
                  {t('productDetail.addToWishlist')}
                </Button>
              </div>

              {/* Shipping & Returns Notes */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-warm flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-warm">
                      {t('productDetail.freeShipping')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-warm flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-warm">
                      <span className="font-medium">{t('productDetail.easyReturns')}</span> — {t('productDetail.satisfactionGuaranteed')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why You'll Love It Section */}
          <section className="my-16 py-16 border-t border-b border-stone-light">
            <SectionTitle title={t('productDetail.whyYouLoveIt')} align="center" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-warm/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-warm" />
                  </div>
                </div>
                <h3 className="font-serif text-lg text-dark mb-2">{t('productDetail.gemstones.title')}</h3>
                <p className="text-sm text-warm">
                  {t('productDetail.gemstones.description')}
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-warm/10 flex items-center justify-center">
                    <Hammer className="w-6 h-6 text-warm" />
                  </div>
                </div>
                <h3 className="font-serif text-lg text-dark mb-2">{t('productDetail.handcrafted.title')}</h3>
                <p className="text-sm text-warm">
                  {t('productDetail.handcrafted.description')}
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-warm/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-warm" />
                  </div>
                </div>
                <h3 className="font-serif text-lg text-dark mb-2">{t('productDetail.meaningfulDesign.title')}</h3>
                <p className="text-sm text-warm">
                  {t('productDetail.meaningfulDesign.description')}
                </p>
              </div>
            </div>
          </section>

          {/* Symbolism & Meaning Section */}
          <section className="my-16">
            <SectionTitle title={t('productDetail.symbolismMeaning')} align="left" />
            <div className="max-w-3xl">
              <p className="text-base text-warm leading-relaxed">
                {product.longDescription}
              </p>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="my-16 py-16 border-t border-b border-stone-light">
            <SectionTitle
              title={t('productDetail.customerReviews')}
              subtitle={t('productDetail.reviewsSummary', { rating: product.rating, count: product.reviewCount })}
              align="left"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {productReviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-stone-light rounded-lg p-6"
                >
                  <div className="mb-3">
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <p className="text-sm text-warm mb-4 italic">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="text-xs text-warm">
                    <p className="font-medium">{review.author}</p>
                    <p>{review.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="secondary" size="md">
                {t('productDetail.viewAllReviews')}
              </Button>
            </div>
          </section>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <section className="my-16">
              <SectionTitle title={t('productDetail.youMayAlsoLike')} align="center" />
              <ProductGrid products={relatedProducts} columns={4} />
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
