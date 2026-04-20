import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

/**
 * GET /api/orders/lookup?session_id=...
 * Look up an order by Stripe session ID (used on success page)
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')

  if (!sessionId || !sessionId.startsWith('cs_')) {
    return NextResponse.json({ error: 'Valid session_id required' }, { status: 400 })
  }

  // Use service role key to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('orders')
    .select('id, customer_email')
    .eq('stripe_session_id', sessionId)
    .maybeSingle()

  if (error || !data) {
    // Order might not have been created yet (webhook delay)
    return NextResponse.json({ order_id: null })
  }

  return NextResponse.json({
    order_id: data.id,
    email: data.customer_email,
  })
}
