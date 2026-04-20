import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface OrderItem {
  name: string
  quantity: number
  price: number
  currency?: string
}

interface OrderRow {
  id: string
  created_at: string
  customer_email: string
  customer_name: string
  items: OrderItem[]
  subtotal: number
  shipping_cost: number
  total: number
  currency: string
  status: string
  shipping_address: {
    city?: string
    state?: string
    country?: string
    postal_code?: string
  } | null
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') || '30d'

  // Calculate date range
  const now = new Date()
  let daysBack = 30
  if (range === '7d') daysBack = 7
  else if (range === '90d') daysBack = 90
  else if (range === '1y') daysBack = 365
  else if (range === 'all') daysBack = 3650

  const sinceDate = new Date(now)
  sinceDate.setDate(sinceDate.getDate() - daysBack)

  // Previous period for comparison
  const prevStart = new Date(sinceDate)
  prevStart.setDate(prevStart.getDate() - daysBack)

  const supabase = createServerSupabaseClient()

  try {
    // Fetch orders for current period
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', sinceDate.toISOString())
      .order('created_at', { ascending: true })

    if (ordersError) throw ordersError

    // Fetch orders for previous period (for comparison)
    const { data: prevOrders } = await supabase
      .from('orders')
      .select('total, status, created_at')
      .gte('created_at', prevStart.toISOString())
      .lt('created_at', sinceDate.toISOString())

    // Fetch all orders (for all-time stats)
    const { count: totalOrderCount } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })

    const allOrders = (orders || []) as OrderRow[]
    const previousOrders = (prevOrders || []) as { total: number; status: string; created_at: string }[]

    // --- Overview Stats ---
    const paidOrders = allOrders.filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
    const prevPaidOrders = previousOrders.filter(o => o.status !== 'cancelled' && o.status !== 'refunded')

    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    const prevRevenue = prevPaidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0

    const orderCount = paidOrders.length
    const prevOrderCount = prevPaidOrders.length
    const orderGrowth = prevOrderCount > 0 ? ((orderCount - prevOrderCount) / prevOrderCount) * 100 : 0

    const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0
    const prevAvg = prevPaidOrders.length > 0 ? prevRevenue / prevPaidOrders.length : 0
    const aovGrowth = prevAvg > 0 ? ((avgOrderValue - prevAvg) / prevAvg) * 100 : 0

    // Unique customers
    const uniqueEmails = new Set(paidOrders.map(o => o.customer_email?.toLowerCase()).filter(Boolean))
    const prevUniqueEmails = new Set(prevPaidOrders.map(o => (o as unknown as OrderRow).customer_email?.toLowerCase()).filter(Boolean))
    const customerCount = uniqueEmails.size
    const customerGrowth = prevUniqueEmails.size > 0 ? ((customerCount - prevUniqueEmails.size) / prevUniqueEmails.size) * 100 : 0

    // --- Revenue by Day ---
    const revenueByDay: Record<string, number> = {}
    const ordersByDay: Record<string, number> = {}
    for (const o of paidOrders) {
      const day = o.created_at.split('T')[0]
      revenueByDay[day] = (revenueByDay[day] || 0) + (o.total || 0)
      ordersByDay[day] = (ordersByDay[day] || 0) + 1
    }

    // Fill in missing days
    const revenueTrend: { date: string; revenue: number; orders: number }[] = []
    const d = new Date(sinceDate)
    while (d <= now) {
      const key = d.toISOString().split('T')[0]
      revenueTrend.push({
        date: key,
        revenue: Math.round((revenueByDay[key] || 0) * 100) / 100,
        orders: ordersByDay[key] || 0,
      })
      d.setDate(d.getDate() + 1)
    }

    // --- Order Status Distribution ---
    const statusCounts: Record<string, number> = {}
    for (const o of allOrders) {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1
    }

    // --- Top Products ---
    const productSales: Record<string, { name: string; revenue: number; quantity: number }> = {}
    for (const o of paidOrders) {
      if (o.items && Array.isArray(o.items)) {
        for (const item of o.items) {
          const key = item.name || 'Unknown'
          if (!productSales[key]) {
            productSales[key] = { name: key, revenue: 0, quantity: 0 }
          }
          productSales[key].revenue += (item.price || 0) * (item.quantity || 1)
          productSales[key].quantity += item.quantity || 1
        }
      }
    }
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // --- Top Customers ---
    const customerSpend: Record<string, { email: string; name: string; total: number; orders: number }> = {}
    for (const o of paidOrders) {
      const email = o.customer_email?.toLowerCase() || 'unknown'
      if (!customerSpend[email]) {
        customerSpend[email] = { email, name: o.customer_name || '', total: 0, orders: 0 }
      }
      customerSpend[email].total += o.total || 0
      customerSpend[email].orders += 1
    }
    const topCustomers = Object.values(customerSpend)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)

    // Repeat customer rate
    const repeatCustomers = Object.values(customerSpend).filter(c => c.orders > 1).length
    const repeatRate = customerCount > 0 ? (repeatCustomers / customerCount) * 100 : 0

    // --- Geographic Distribution ---
    const countryCounts: Record<string, number> = {}
    for (const o of paidOrders) {
      const country = o.shipping_address?.country || 'Unknown'
      countryCounts[country] = (countryCounts[country] || 0) + 1
    }
    const geoDistribution = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // --- Recent Orders ---
    const recentOrders = allOrders.slice(-5).reverse().map(o => ({
      id: o.id,
      date: o.created_at,
      customer: o.customer_name || o.customer_email || 'Unknown',
      total: o.total,
      status: o.status,
      itemCount: o.items?.length || 0,
    }))

    return NextResponse.json({
      overview: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        orderCount,
        orderGrowth: Math.round(orderGrowth * 10) / 10,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        aovGrowth: Math.round(aovGrowth * 10) / 10,
        customerCount,
        customerGrowth: Math.round(customerGrowth * 10) / 10,
        repeatRate: Math.round(repeatRate * 10) / 10,
        allTimeOrders: totalOrderCount || 0,
      },
      revenueTrend,
      statusDistribution: statusCounts,
      topProducts,
      topCustomers,
      geoDistribution,
      recentOrders,
    })
  } catch (err) {
    console.error('Analytics error:', err)
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 })
  }
}
