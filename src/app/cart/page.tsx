'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'
import { formatPrice } from '@/lib/utils'
import PlaceholderImage from '@/components/layout/PlaceholderImage'

export default function CartPage() {
  const { items, itemCount, total, removeItem, updateQuantity } = useCart()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const shippingThreshold = 150
  const freeShipping = total >= shippingThreshold

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-cream">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <ShoppingBag size={64} className="text-stone mx-auto mb-6" />
          <h1 className="font-serif text-3xl text-dark mb-4">Your cart is empty</h1>
          <p className="font-sans text-warm mb-8">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-dark text-cream font-sans text-sm font-medium uppercase tracking-wider hover:bg-charcoal transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-sans text-warm hover:text-dark transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl text-dark">
            Shopping Cart ({itemCount})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Free Shipping Progress */}
            {!freeShipping && (
              <div className="mb-8 p-4 bg-gold/5 border border-gold/20 rounded-lg">
                <p className="font-sans text-sm text-dark mb-2">
                  You&apos;re {formatPrice(shippingThreshold - total)} away from free shipping!
                </p>
                <div className="w-full bg-stone-light rounded-full h-2">
                  <div
                    className="bg-gold rounded-full h-2 transition-all duration-500"
                    style={{ width: `${Math.min(100, (total / shippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {freeShipping && (
              <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="font-sans text-sm text-emerald-800 font-medium">
                  You qualify for free shipping!
                </p>
              </div>
            )}

            {/* Items List */}
            <div className="space-y-0">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 py-6 border-b border-stone-light">
                  {/* Image */}
                  <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-stone-light">
                      <PlaceholderImage
                        width="w-32"
                        height="h-32"
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="font-serif text-base md:text-lg text-dark hover:underline mb-1">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="font-sans text-sm font-medium text-dark">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-3 border border-stone-light rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-stone-light transition-colors rounded-l-lg"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-sans text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                          className="p-2 hover:bg-stone-light transition-colors rounded-r-lg disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Line Total */}
                        <span className="font-serif text-base text-dark font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-warm hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-stone-light rounded-lg p-6 sticky top-24">
              <h2 className="font-serif text-xl text-dark mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-sans text-sm">
                  <span className="text-warm">Subtotal</span>
                  <span className="text-dark">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between font-sans text-sm">
                  <span className="text-warm">Shipping</span>
                  <span className="text-dark">
                    {freeShipping ? 'Free' : 'Calculated at checkout'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between py-4 border-t border-stone-light mb-6">
                <span className="font-serif text-lg text-dark">Total</span>
                <span className="font-serif text-lg text-dark">{formatPrice(total)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full px-6 py-3.5 bg-dark text-cream font-sans text-sm font-medium uppercase tracking-wider hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                {loading ? 'Redirecting...' : 'Proceed to Checkout'}
              </button>

              <p className="font-sans text-xs text-warm text-center mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
