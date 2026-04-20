'use client'

import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, AlertCircle, Package, ChevronDown, ChevronUp, Mail, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Order {
  id: string
  stripe_session_id: string
  stripe_payment_intent: string | null
  customer_email: string | null
  customer_name: string | null
  shipping_address: {
    name: string
    line1: string
    line2: string
    city: string
    state: string
    postal_code: string
    country: string
  } | null
  items: Array<{
    name: string
    quantity: number
    price: number
    currency: string
  }>
  subtotal: number
  shipping_cost: number
  total: number
  currency: string
  status: string
  created_at: string
  updated_at: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  paid: { label: 'Paid', color: 'text-blue-700', bg: 'bg-blue-100' },
  shipped: { label: 'Shipped', color: 'text-purple-700', bg: 'bg-purple-100' },
  delivered: { label: 'Delivered', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  cancelled: { label: 'Cancelled', color: 'text-gray-700', bg: 'bg-gray-200' },
  refunded: { label: 'Refunded', color: 'text-red-700', bg: 'bg-red-100' },
}

const STATUS_FLOW = ['paid', 'shipped', 'delivered']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [statusLoading, setStatusLoading] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      if (data.orders) {
        setOrders(data.orders)
      } else {
        setError(data.error || 'Failed to load orders')
      }
    } catch {
      setError('Failed to fetch orders')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setStatusLoading(orderId)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })
      const result = await res.json()
      if (result.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        )
      } else {
        alert(result.error || 'Failed to update status')
      }
    } catch {
      alert('Network error')
    }
    setStatusLoading(null)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (amount: number) => `$${amount.toFixed(2)}`

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((o) => o.status === filterStatus)

  // Count by status
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="animate-spin text-warm" size={24} />
        <span className="ml-3 text-warm font-sans">Loading orders...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <p className="text-red-900 text-sm font-sans font-medium">Failed to load orders</p>
          <p className="text-red-700 text-sm font-sans mt-1">{error}</p>
          <button onClick={fetchOrders} className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-sans font-medium rounded-lg hover:bg-red-700 transition-colors">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-dark mb-2">Orders</h1>
          <p className="text-warm font-sans">
            {orders.length} total order{orders.length !== 1 ? 's' : ''}
            {orders.length > 0 && ` · ${formatPrice(orders.reduce((sum, o) => sum + Number(o.total), 0))} revenue`}
          </p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 bg-stone-light text-dark font-sans font-medium rounded-lg hover:bg-stone transition-colors">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus('all')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors',
            filterStatus === 'all' ? 'bg-dark text-cream' : 'bg-stone-light text-warm hover:bg-stone'
          )}
        >
          All ({orders.length})
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const count = statusCounts[key] || 0
          if (count === 0 && key !== 'paid' && key !== 'shipped') return null
          return (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors',
                filterStatus === key ? `${config.bg} ${config.color}` : 'bg-stone-light text-warm hover:bg-stone'
              )}
            >
              {config.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-light rounded-lg">
          <Package size={48} className="text-stone mx-auto mb-4" />
          <p className="text-warm font-sans text-lg mb-2">No orders yet</p>
          <p className="text-warm font-sans text-sm">Orders will appear here after customers complete checkout.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order.id
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending

            return (
              <div key={order.id} className="bg-white border border-stone-light rounded-lg overflow-hidden">
                {/* Order Header */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-cream transition-colors"
                >
                  <div className="flex items-center gap-6 text-left">
                    <div>
                      <p className="font-sans font-medium text-dark text-sm">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-warm font-sans">{formatDate(order.created_at)}</p>
                    </div>
                    <div>
                      <p className="font-sans text-sm text-dark">{order.customer_name || 'No name'}</p>
                      <p className="text-xs text-warm font-sans">{order.customer_email || 'No email'}</p>
                    </div>
                    <div>
                      <p className="font-sans font-medium text-dark">{formatPrice(Number(order.total))}</p>
                      <p className="text-xs text-warm font-sans">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    </div>
                    <span className={cn('px-3 py-1 rounded-full text-xs font-sans font-medium', config.bg, config.color)}>
                      {config.label}
                    </span>
                  </div>
                  {isExpanded ? <ChevronUp size={20} className="text-warm" /> : <ChevronDown size={20} className="text-warm" />}
                </button>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="border-t border-stone-light px-6 py-5 space-y-5">
                    {/* Status Actions */}
                    <div>
                      <p className="text-xs font-sans font-medium text-dark uppercase tracking-wider mb-2">Update Status</p>
                      <div className="flex gap-2 flex-wrap">
                        {STATUS_FLOW.map((s) => {
                          const sConfig = STATUS_CONFIG[s]
                          return (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(order.id, s)}
                              disabled={order.status === s || statusLoading === order.id}
                              className={cn(
                                'px-4 py-2 rounded-lg text-xs font-sans font-medium transition-colors disabled:opacity-40',
                                order.status === s ? `${sConfig.bg} ${sConfig.color}` : 'bg-stone-light text-warm hover:bg-stone'
                              )}
                            >
                              {statusLoading === order.id ? '...' : sConfig.label}
                            </button>
                          )
                        })}
                        <button
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                          disabled={order.status === 'cancelled' || statusLoading === order.id}
                          className="px-4 py-2 rounded-lg text-xs font-sans font-medium bg-stone-light text-warm hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-40"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, 'refunded')}
                          disabled={order.status === 'refunded' || statusLoading === order.id}
                          className="px-4 py-2 rounded-lg text-xs font-sans font-medium bg-stone-light text-warm hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-40"
                        >
                          Refund
                        </button>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-xs font-sans font-medium text-dark uppercase tracking-wider mb-2">Items</p>
                      <div className="bg-cream rounded-lg p-4 space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between font-sans text-sm">
                            <span className="text-dark">{item.name} × {item.quantity}</span>
                            <span className="text-dark font-medium">{formatPrice(item.price)}</span>
                          </div>
                        ))}
                        <div className="border-t border-stone-light pt-2 mt-2 space-y-1">
                          <div className="flex justify-between font-sans text-sm">
                            <span className="text-warm">Subtotal</span>
                            <span className="text-dark">{formatPrice(Number(order.subtotal))}</span>
                          </div>
                          <div className="flex justify-between font-sans text-sm">
                            <span className="text-warm">Shipping</span>
                            <span className="text-dark">{Number(order.shipping_cost) > 0 ? formatPrice(Number(order.shipping_cost)) : 'Free'}</span>
                          </div>
                          <div className="flex justify-between font-sans text-sm font-medium">
                            <span className="text-dark">Total</span>
                            <span className="text-dark">{formatPrice(Number(order.total))}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer & Shipping */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-sans font-medium text-dark uppercase tracking-wider mb-2 flex items-center gap-1">
                          <Mail size={12} /> Customer
                        </p>
                        <div className="bg-cream rounded-lg p-4 font-sans text-sm space-y-1">
                          <p className="text-dark">{order.customer_name || '—'}</p>
                          <p className="text-warm">{order.customer_email || '—'}</p>
                        </div>
                      </div>
                      {order.shipping_address && (
                        <div>
                          <p className="text-xs font-sans font-medium text-dark uppercase tracking-wider mb-2 flex items-center gap-1">
                            <MapPin size={12} /> Shipping Address
                          </p>
                          <div className="bg-cream rounded-lg p-4 font-sans text-sm space-y-1">
                            <p className="text-dark">{order.shipping_address.name}</p>
                            <p className="text-warm">{order.shipping_address.line1}</p>
                            {order.shipping_address.line2 && <p className="text-warm">{order.shipping_address.line2}</p>}
                            <p className="text-warm">
                              {order.shipping_address.city}{order.shipping_address.state ? `, ${order.shipping_address.state}` : ''} {order.shipping_address.postal_code}
                            </p>
                            <p className="text-warm">{order.shipping_address.country}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Stripe IDs */}
                    <div className="text-xs font-sans text-warm space-y-1">
                      <p>Stripe Session: {order.stripe_session_id}</p>
                      {order.stripe_payment_intent && <p>Payment Intent: {order.stripe_payment_intent}</p>}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
