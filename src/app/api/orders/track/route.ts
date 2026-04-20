import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

/**
 * GET /api/orders/track?email=...&order_id=...
 * Public endpoint - customers can track their order by email + order ID prefix
 */
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  const orderId = req.nextUrl.searchParams.get('order_id')

  if (!email || !orderId) {
    return NextResponse.json({ error: 'Email and order ID are required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Search by email and order ID prefix (first 8 chars)
  const { data, error } = await supabase
    .from('orders')
    .select('id, items, total, currency, status, shipping_address, created_at, updated_at')
    .eq('customer_email', email.toLowerCase())
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Order track error:', error)
    return NextResponse.json({ error: 'Failed to look up order' }, { status: 500 })
  }

  // Find matching order by ID prefix
  const normalizedInput = orderId.toUpperCase().replace('#', '')
  const matchedOrder = (data || []).find((o) =>
    o.id.slice(0, 8).toUpperCase() === normalizedInput ||
    o.id === orderId
  )

  if (!matchedOrder) {
    return NextResponse.json({ error: 'Order not found. Please check your email and order ID.' }, { status: 404 })
  }

  return NextResponse.json({ order: matchedOrder })
}
