import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Use Supabase with anon key (webhook doesn't have user session)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    console.error('No stripe-signature header')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const stripe = getStripe()

      // Retrieve line items for this session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

      const items = lineItems.data.map((item) => ({
        name: item.description,
        quantity: item.quantity,
        price: item.amount_total ? item.amount_total / 100 : 0,
        currency: item.currency,
      }))

      // Build shipping address from session
      const shippingDetails = session.shipping_details || session.customer_details
      const shippingAddress = shippingDetails?.address
        ? {
            name: shippingDetails.name || session.customer_details?.name || '',
            line1: shippingDetails.address.line1 || '',
            line2: shippingDetails.address.line2 || '',
            city: shippingDetails.address.city || '',
            state: shippingDetails.address.state || '',
            postal_code: shippingDetails.address.postal_code || '',
            country: shippingDetails.address.country || '',
          }
        : null

      const subtotal = (session.amount_subtotal || 0) / 100
      const total = (session.amount_total || 0) / 100
      const shippingCost = (session.total_details?.amount_shipping || 0) / 100

      // Save order to Supabase
      const supabase = getSupabase()
      const { error: insertError } = await supabase.from('orders').insert({
        stripe_session_id: session.id,
        stripe_payment_intent: typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id || null,
        customer_email: session.customer_details?.email || session.customer_email || null,
        customer_name: session.customer_details?.name || null,
        shipping_address: shippingAddress,
        items,
        subtotal,
        shipping_cost: shippingCost,
        total,
        currency: session.currency || 'usd',
        status: 'paid',
      })

      if (insertError) {
        console.error('Failed to save order:', insertError)
        // Don't return error to Stripe - the payment already succeeded
        // Log for manual review
      } else {
        console.log('Order saved successfully for session:', session.id)
      }
    } catch (err) {
      console.error('Error processing checkout session:', err)
    }
  }

  // Always return 200 to acknowledge receipt
  return NextResponse.json({ received: true })
}
