'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Package,
  MapPin,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts'

/* ── Types ── */

interface OverviewStats {
  totalRevenue: number
  revenueGrowth: number
  orderCount: number
  orderGrowth: number
  avgOrderValue: number
  aovGrowth: number
  customerCount: number
  customerGrowth: number
  repeatRate: number
  allTimeOrders: number
}

interface TrendPoint {
  date: string
  revenue: number
  orders: number
}

interface TopProduct {
  name: string
  revenue: number
  quantity: number
}

interface TopCustomer {
  email: string
  name: string
  total: number
  orders: number
}

interface GeoEntry {
  country: string
  count: number
}

interface RecentOrder {
  id: string
  date: string
  customer: string
  total: number
  status: string
  itemCount: number
}

type TimeRange = '7d' | '30d' | '90d' | '1y'

/* ── Helpers ── */

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return '$' + (amount / 1_000_000).toFixed(1) + 'M'
  if (amount >= 1_000) return '$' + (amount / 1_000).toFixed(1) + 'K'
  return '$' + amount.toFixed(2)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

/* ── Status Colors ── */
const STATUS_COLORS: Record<string, string> = {
  paid: '#10b981',
  shipped: '#3b82f6',
  delivered: '#8b5cf6',
  pending: '#f59e0b',
  cancelled: '#ef4444',
  refunded: '#6b7280',
}

const STATUS_LABELS: Record<string, string> = {
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  pending: 'Pending',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

const PRODUCT_COLORS = [
  '#b8860b', '#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b',
  '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#6366f1',
]

/* ── Custom Tooltip ── */

function RevenueTooltip({ active, payload, label }: {
  active?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[]
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="bg-white border border-stone-light rounded-lg shadow-lg p-3">
      <p className="font-sans text-xs font-medium text-dark mb-1">{label}</p>
      {payload.map((entry: { dataKey: string; value: number; color: string }) => (
        <p key={entry.dataKey} className="font-sans text-xs text-warm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          {entry.dataKey === 'revenue' ? formatCurrency(entry.value) : `${entry.value} orders`}
        </p>
      ))}
    </div>
  )
}

/* ── Stat Card ── */

function StatCard({ icon: Icon, label, value, change, color }: {
  icon: typeof DollarSign
  label: string
  value: string
  change?: number
  color: string
}) {
  return (
    <div className="bg-white border border-stone-light rounded-lg p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-sans text-warm uppercase tracking-wider mb-1">{label}</p>
          <p className="font-serif text-2xl text-dark">{value}</p>
          {change !== undefined && change !== 0 && (
            <div className={cn('flex items-center gap-1 mt-1 font-sans text-xs font-medium',
              change >= 0 ? 'text-emerald-600' : 'text-red-600'
            )}>
              {change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(change).toFixed(1)}% vs prev period
            </div>
          )}
        </div>
        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', color)}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  )
}

/* ── Page ── */

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [overview, setOverview] = useState<OverviewStats | null>(null)
  const [revenueTrend, setRevenueTrend] = useState<TrendPoint[]>([])
  const [statusDistribution, setStatusDistribution] = useState<Record<string, number>>({})
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([])
  const [geoDistribution, setGeoDistribution] = useState<GeoEntry[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])

  const loadAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/analytics?range=${timeRange}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setOverview(data.overview)
      setRevenueTrend(data.revenueTrend || [])
      setStatusDistribution(data.statusDistribution || {})
      setTopProducts(data.topProducts || [])
      setTopCustomers(data.topCustomers || [])
      setGeoDistribution(data.geoDistribution || [])
      setRecentOrders(data.recentOrders || [])
    } catch (err) {
      console.error('Failed to load analytics:', err)
    }
    setLoading(false)
  }, [timeRange])

  useEffect(() => { loadAnalytics() }, [loadAnalytics])

  // Chart data with formatted labels
  const chartData = revenueTrend.map(p => ({
    ...p,
    label: formatDate(p.date),
  }))

  // Status pie data
  const statusData = Object.entries(statusDistribution).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    color: STATUS_COLORS[status] || '#6b7280',
  }))

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-20 justify-center">
        <RefreshCw className="animate-spin text-warm" size={20} />
        <span className="text-warm font-sans">Loading analytics...</span>
      </div>
    )
  }

  const stats = overview || {
    totalRevenue: 0, revenueGrowth: 0, orderCount: 0, orderGrowth: 0,
    avgOrderValue: 0, aovGrowth: 0, customerCount: 0, customerGrowth: 0,
    repeatRate: 0, allTimeOrders: 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-dark">Analytics</h1>
          <p className="text-warm font-sans text-sm mt-1">Track your store performance and revenue</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Time Range Chips */}
          <div className="flex items-center gap-1 bg-stone-light/50 rounded-lg p-1">
            {(['7d', '30d', '90d', '1y'] as TimeRange[]).map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={cn(
                  'px-3 py-1.5 rounded-md font-sans text-xs font-medium transition-colors',
                  timeRange === r
                    ? 'bg-white text-dark shadow-sm'
                    : 'text-warm hover:text-dark'
                )}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
          <button
            onClick={loadAnalytics}
            className="p-2 border border-stone-light rounded-lg hover:bg-cream transition-colors"
          >
            <RefreshCw size={16} className="text-warm" />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value={formatCurrency(stats.totalRevenue)}
          change={stats.revenueGrowth}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={ShoppingCart}
          label="Orders"
          value={stats.orderCount.toString()}
          change={stats.orderGrowth}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Order Value"
          value={formatCurrency(stats.avgOrderValue)}
          change={stats.aovGrowth}
          color="bg-violet-50 text-violet-600"
        />
        <StatCard
          icon={Users}
          label="Customers"
          value={stats.customerCount.toString()}
          change={stats.customerGrowth}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white border border-stone-light rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl text-dark">Revenue Trend</h2>
            <p className="font-sans text-xs text-warm mt-0.5">Daily revenue and order count</p>
          </div>
          <div className="flex items-center gap-4 font-sans text-xs text-warm">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-[#b8860b]" /> Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-[#3b82f6]" /> Orders
            </span>
          </div>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b8860b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#b8860b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                yAxisId="revenue"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => '$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v.toString())}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<RevenueTooltip />} />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#b8860b"
                fill="url(#revenueGradient)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#b8860b', strokeWidth: 2, stroke: '#fff' }}
              />
              <Area
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                fill="transparent"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-warm font-sans text-sm">
            No revenue data for the selected period
          </div>
        )}
      </div>

      {/* Mid Row: Status Distribution + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status */}
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <h2 className="font-serif text-xl text-dark mb-4">Order Status</h2>
          {statusData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value} orders`, name]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {statusData.map(entry => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="font-sans text-sm text-warm flex-1">{entry.name}</span>
                    <span className="font-sans text-sm font-medium text-dark">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-warm font-sans text-sm">
              No orders yet
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <h2 className="font-serif text-xl text-dark mb-4">Top Products</h2>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProducts.slice(0, 5)} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickFormatter={(v: number) => formatCurrency(v)}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#374151' }}
                  tickLine={false}
                  axisLine={false}
                  width={120}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={24}>
                  {topProducts.slice(0, 5).map((_, i) => (
                    <Cell key={i} fill={PRODUCT_COLORS[i % PRODUCT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-warm font-sans text-sm">
              No product sales data yet
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Top Customers + Geography + Repeat Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Customers */}
        <div className="bg-white border border-stone-light rounded-lg p-6 lg:col-span-2">
          <h2 className="font-serif text-xl text-dark mb-4">Top Customers</h2>
          {topCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-light">
                    <th className="text-left text-xs font-sans text-warm uppercase tracking-wider pb-2 pr-4">#</th>
                    <th className="text-left text-xs font-sans text-warm uppercase tracking-wider pb-2 pr-4">Customer</th>
                    <th className="text-right text-xs font-sans text-warm uppercase tracking-wider pb-2 pr-4">Revenue</th>
                    <th className="text-right text-xs font-sans text-warm uppercase tracking-wider pb-2">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.slice(0, 5).map((c, i) => (
                    <tr key={i} className="border-b border-stone-light/50 hover:bg-cream/30 transition-colors">
                      <td className="py-2.5 pr-4 font-sans text-xs text-warm">{i + 1}</td>
                      <td className="py-2.5 pr-4">
                        <p className="font-sans text-sm text-dark font-medium">{c.name || 'Unknown'}</p>
                        <p className="font-sans text-xs text-warm">{c.email}</p>
                      </td>
                      <td className="py-2.5 pr-4 font-sans text-sm text-dark text-right font-medium">
                        {formatCurrency(c.total)}
                      </td>
                      <td className="py-2.5 font-sans text-sm text-warm text-right">{c.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-warm font-sans text-sm">
              No customer data yet
            </div>
          )}
        </div>

        {/* Right Column: Geo + Repeat Rate */}
        <div className="space-y-6">
          {/* Repeat Rate */}
          <div className="bg-white border border-stone-light rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-violet-50 text-violet-600">
                <Users size={18} />
              </div>
              <div>
                <p className="text-xs font-sans text-warm uppercase tracking-wider">Repeat Rate</p>
                <p className="font-serif text-2xl text-dark">{stats.repeatRate.toFixed(1)}%</p>
              </div>
            </div>
            <p className="font-sans text-xs text-warm">Customers who ordered more than once</p>
          </div>

          {/* Geographic */}
          <div className="bg-white border border-stone-light rounded-lg p-6">
            <h2 className="font-serif text-lg text-dark mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-warm" /> Top Regions
            </h2>
            {geoDistribution.length > 0 ? (
              <div className="space-y-2">
                {geoDistribution.slice(0, 5).map((g, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="font-sans text-sm text-dark">{g.country}</span>
                    <span className="font-sans text-sm text-warm">{g.count} orders</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-sans text-xs text-warm">No geographic data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-stone-light rounded-lg overflow-hidden">
        <div className="p-4 border-b border-stone-light flex items-center justify-between">
          <h2 className="font-serif text-xl text-dark flex items-center gap-2">
            <Clock size={18} className="text-warm" /> Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="font-sans text-xs text-warm hover:text-dark transition-colors"
          >
            View all →
          </Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="divide-y divide-stone-light">
            {recentOrders.map(order => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-cream/30 transition-colors">
                <div className="flex items-center gap-4">
                  <Package size={16} className="text-warm" />
                  <div>
                    <p className="font-sans text-sm text-dark font-medium">{order.customer}</p>
                    <p className="font-sans text-xs text-warm">{formatFullDate(order.date)} · {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-sans font-medium',
                    order.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                    order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                    order.status === 'delivered' ? 'bg-violet-50 text-violet-700' :
                    order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                    'bg-amber-50 text-amber-700'
                  )}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                  <span className="font-sans text-sm text-dark font-medium">{formatCurrency(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <ShoppingCart size={32} className="text-warm-light mx-auto mb-3" />
            <p className="text-warm font-sans text-sm">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
