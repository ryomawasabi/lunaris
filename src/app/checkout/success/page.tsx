'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()

  // Clear cart on successful checkout
  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center py-20">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-dark mb-4">
            Thank You!
          </h1>
          <p className="font-sans text-warm text-lg">
            Your order has been placed successfully.
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-white border border-stone-light rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 justify-center mb-4">
            <Package size={20} className="text-warm" />
            <span className="font-sans text-sm text-warm">What happens next?</span>
          </div>
          <p className="font-sans text-sm text-dark leading-relaxed">
            You&apos;ll receive an email confirmation shortly with your order details.
            We&apos;ll notify you when your order ships.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-dark text-cream font-sans text-sm font-medium uppercase tracking-wider hover:bg-charcoal transition-colors"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  )
}
