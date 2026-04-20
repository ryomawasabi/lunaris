'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Package, CheckCircle, Truck, MapPin, Loader2, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrackedOrder {
  id: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  currency: string
  status: string
  shipping_address: {
    name: string
    line1: string
    city: string
    state: string
    postal_code: string
    country: string
  } | null
  created_at: string
  updated_at: string
}

const STATUS_STEPS = [
  { key: 'paid', label: 'Order Confirmed', icon: CheckCircle },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: MapPin },
]

export default function OrderTrackPage() {
  const [email, setEmail] = useState('')
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<TrackedOrder | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !orderId) return

    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      const res = await fetch(`/api/orders/track?email=${encodeURIComponent(email)}&order_id=${encodeURIComponent(orderId)}`)
      const data = await res.json()

      if (data.order) {
        setOrder(data.order)
      } else {
        setError(data.error || 'Order not found')
      }
    } catch {
      setError('Failed to look up order. Please try again.')
    }
    setLoading(false)
  }

  const getStepStatus = (stepKey: string) => {
    if (!order) return 'upcoming'
    const statusOrder = ['paid', 'shipped', 'delivered']
    const currentIndex = statusOrder.indexOf(order.status)
    const stepIndex = statusOrder.indexOf(stepKey)

    if (order.status === 'cancelled' || order.status === 'refunded') return 'upcoming'
    if (stepIndex <= currentIndex) return 'completed'
    if (stepIndex === currentIndex + 1) return 'current'
    return 'upcoming'
  }

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-sans text-warm hover:text-dark transition-colors mb-8">
          <ArrowLeft size={16} />
          Back to Store
        </Link>

        <div className="text-center mb-10">
          <Package size={40} className="text-gold mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-dark mb-2">Track Your Order</h1>
          <p className="font-sans text-warm">Enter your email and order ID to check the status of your order.</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="bg-white border border-stone-light rounded-lg p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-sans font-medium text-dark mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border border-stone-light rounded-lg font-sans text-dark placeholder-warm-light focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-sans font-medium text-dark mb-1">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. A1B2C3D4"
                required
                className="w-full px-4 py-3 border border-stone-light rounded-lg font-sans text-dark placeholder-warm-light focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
              <p className="text-xs text-warm font-sans mt-1">The 8-character code from your confirmation page.</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3.5 bg-dark text-cream font-sans text-sm font-medium uppercase tracking-wider hover:bg-charcoal transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
              {loading ? 'Looking up...' : 'Track Order'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700 font-sans text-sm">{error}</p>
          </div>
        )}

        {/* Order Result */}
        {order && (
          <div className="bg-white border border-stone-light rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-light">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans font-medium text-dark">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-warm font-sans">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <p className="font-serif text-lg text-dark">${Number(order.total).toFixed(2)}</p>
              </div>
            </div>

            {/* Status Tracker */}
            {order.status !== 'cancelled' && order.status !== 'refunded' ? (
              <div className="px-6 py-6">
                <div className="flex items-center justify-between relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-stone-light" />
                  <div
                    className="absolute top-5 left-0 h-0.5 bg-emerald-500 transition-all duration-500"
                    style={{
                      width: order.status === 'delivered' ? '100%'
                        : order.status === 'shipped' ? '50%'
                        : '0%',
                    }}
                  />

                  {STATUS_STEPS.map((step) => {
                    const stepStatus = getStepStatus(step.key)
                    const Icon = step.icon
                    return (
                      <div key={step.key} className="relative z-10 flex flex-col items-center">
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                          stepStatus === 'completed' ? 'bg-emerald-500 text-white'
                            : stepStatus === 'current' ? 'bg-gold text-white'
                            : 'bg-stone-light text-warm'
                        )}>
                          <Icon size={20} />
                        </div>
                        <p className={cn(
                          'text-xs font-sans mt-2 text-center',
                          stepStatus === 'completed' ? 'text-emerald-600 font-medium'
                            : stepStatus === 'current' ? 'text-gold-dark font-medium'
                            : 'text-warm'
                        )}>
                          {step.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="px-6 py-4">
                <p className={cn(
                  'font-sans text-sm font-medium',
                  order.status === 'cancelled' ? 'text-gray-600' : 'text-red-600'
                )}>
                  This order has been {order.status}.
                </p>
              </div>
            )}

            {/* Items */}
            <div className="px-6 py-4 border-t border-stone-light">
              <p className="text-xs font-sans font-medium text-dark uppercase tracking-wider mb-3">Items</p>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between font-sans text-sm py-1">
                  <span className="text-dark">{item.name} × {item.quantity}</span>
                  <span className="text-dark">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Shipping */}
            {order.shipping_address && (
              <div className="px-6 py-4 border-t border-stone-light">
                <p className="text-xs font-sans font-medium text-dark uppercase tracking-wider mb-2">Shipping To</p>
                <p className="font-sans text-sm text-warm">
                  {order.shipping_address.name}, {order.shipping_address.line1}, {order.shipping_address.city} {order.shipping_address.postal_code}, {order.shipping_address.country}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
