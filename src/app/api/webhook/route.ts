import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { sendOrderConfirmation } from '@/lib/email/order-confirmation'

export const dynamic = 'force-dynamic'

// Use Supabase with service role key (webhook doesn't have user session, needs to bypass RLS)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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
      // Use type assertion to access shipping_details which may vary by API version
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sessionAny = session as any
      const shippingDetails = sessionAny.shipping_details || session.customer_details
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

      // Save order to Supabase (with duplicate check for webhook retries)
      const supabase = getSupabase()

      // Check if order already exists (webhook retry protection)
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('stripe_session_id', session.id)
        .maybeSingle()

      if (existingOrder) {
        console.log('Order already exists for session:', session.id, '- skipping duplicate')
      } else {
        const customerEmail = session.customer_details?.email || session.customer_email || null

        const { error: insertError } = await supabase.from('orders').insert({
          stripe_session_id: session.id,
          stripe_payment_intent: typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id || null,
          customer_email: customerEmail,
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
          console.error('Failed to save order:', insertError, { sessionId: session.id, email: customerEmail })
          // Don't return error to Stripe - the payment already succeeded
        } else {
          console.log('Order saved successfully for session:', session.id)

          // Send order confirmation email only after successful insert
          if (customerEmail) {
            sendOrderConfirmation({
              customerEmail,
              customerName: session.customer_details?.name || '',
              items: items.map(i => ({ name: i.name || 'Item', quantity: i.quantity || 1, price: i.price })),
              subtotal,
              shippingCost,
              total,
              currency: session.currency || 'usd',
              shippingAddress: shippingAddress,
            }).catch((err) => {
              console.error('Email send error (non-blocking):', err)
            })
          }
        }
      }
    } catch (err) {
      console.error('Error processing checkout session:', err)
    }
  }

  // Always return 200 to acknowledge receipt
  return NextResponse.json({ received: true })
}
