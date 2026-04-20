'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight, Search, Loader2 } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'
import { useLanguage } from '@/components/providers/LanguageProvider'

function CheckoutSuccessContent() {
  const { clearCart } = useCart()
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [orderInfo, setOrderInfo] = useState<{ orderId: string; email: string } | null>(null)

  // Clear cart on successful checkout
  useEffect(() => {
    clearCart()
  }, [clearCart])

  // Fetch order info from the Stripe session (with retry for webhook delay)
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return

    let retries = 0
    const maxRetries = 5

    const fetchOrder = () => {
      fetch(`/api/orders/lookup?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.order_id) {
            setOrderInfo({ orderId: data.order_id, email: data.email || '' })
          } else if (retries < maxRetries) {
            // Webhook may not have processed yet, retry with backoff
            retries++
            setTimeout(fetchOrder, retries * 2000)
          }
        })
        .catch(() => {
          if (retries < maxRetries) {
            retries++
            setTimeout(fetchOrder, retries * 2000)
          }
        })
    }

    fetchOrder()
  }, [searchParams])

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center py-20">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-dark mb-4">
            {t('checkout.thankYou')}
          </h1>
          <p className="font-sans text-warm text-lg">
            {t('checkout.orderPlaced')}
          </p>
        </div>

        {/* Order ID */}
        {orderInfo && (
          <div className="bg-gold/5 border border-gold/20 rounded-lg p-4 mb-6">
            <p className="font-sans text-xs text-warm uppercase tracking-wider mb-1">{t('checkout.yourOrderID')}</p>
            <p className="font-serif text-2xl text-dark tracking-wider">
              #{orderInfo.orderId.slice(0, 8).toUpperCase()}
            </p>
            <p className="font-sans text-xs text-warm mt-1">{t('checkout.saveForTracking')}</p>
          </div>
        )}

        {/* Order Info */}
        <div className="bg-white border border-stone-light rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 justify-center mb-4">
            <Package size={20} className="text-warm" />
            <span className="font-sans text-sm text-warm">{t('checkout.whatHappensNext')}</span>
          </div>
          <p className="font-sans text-sm text-dark leading-relaxed">
            {t('checkout.nextSteps')}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4 flex flex-col items-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-dark text-cream font-sans text-sm font-medium uppercase tracking-wider hover:bg-charcoal transition-colors"
          >
            {t('checkout.continueShopping')}
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/orders/track"
            className="inline-flex items-center gap-2 text-sm font-sans text-warm hover:text-dark transition-colors"
          >
            <Search size={14} />
            {t('checkout.trackOrder')}
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-cream flex items-center justify-center">
          <Loader2 className="animate-spin text-warm" size={32} />
        </main>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}
