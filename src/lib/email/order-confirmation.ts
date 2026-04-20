import { Resend } from 'resend'

interface OrderItem {
  name: string
  quantity: number
  price: number
  currency?: string
}

interface ShippingAddress {
  name?: string
  line1?: string
  line2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
}

interface OrderConfirmationData {
  customerEmail: string
  customerName: string
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  total: number
  currency: string
  shippingAddress: ShippingAddress | null
  orderId?: string
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}

function buildOrderEmailHtml(data: OrderConfirmationData): string {
  const itemRows = data.items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #F0F4F8; font-family: Inter, sans-serif; font-size: 14px; color: #1C2A38;">
        ${item.name}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #F0F4F8; font-family: Inter, sans-serif; font-size: 14px; color: #7A8EA0; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #F0F4F8; font-family: Inter, sans-serif; font-size: 14px; color: #1C2A38; text-align: right;">
        ${formatCurrency(item.price, data.currency)}
      </td>
    </tr>
  `).join('')

  const address = data.shippingAddress
  const addressBlock = address ? `
    <div style="margin-top: 24px; padding: 16px; background: #F0F4F8; border-radius: 8px;">
      <p style="margin: 0 0 8px; font-family: 'Cormorant Garamond', serif; font-size: 16px; color: #1C2A38; font-weight: 600;">Shipping To</p>
      <p style="margin: 0; font-family: Inter, sans-serif; font-size: 13px; color: #7A8EA0; line-height: 1.6;">
        ${address.name || data.customerName}<br/>
        ${address.line1 || ''}${address.line2 ? '<br/>' + address.line2 : ''}<br/>
        ${address.city || ''}${address.state ? ', ' + address.state : ''} ${address.postal_code || ''}<br/>
        ${address.country || ''}
      </p>
    </div>
  ` : ''

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #FAFCFE; font-family: Inter, -apple-system, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="text-align: center; padding: 32px 0; border-bottom: 1px solid #F0F4F8;">
      <h1 style="margin: 0; font-family: 'Cormorant Garamond', serif; font-size: 28px; letter-spacing: 0.15em; color: #1C2A38;">
        YINYANG GUARDIAN
      </h1>
    </div>

    <!-- Main Content -->
    <div style="padding: 32px 0;">
      <h2 style="margin: 0 0 8px; font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #1C2A38;">
        Thank you for your order!
      </h2>
      <p style="margin: 0 0 24px; font-family: Inter, sans-serif; font-size: 14px; color: #7A8EA0; line-height: 1.6;">
        Hi ${data.customerName || 'there'}, we've received your order and it's being prepared with care.
        You'll receive a shipping notification once your crystals are on their way.
      </p>

      <!-- Order Items -->
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding: 8px 0; border-bottom: 2px solid #1C2A38; font-family: Inter, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #7A8EA0; text-align: left;">Item</th>
            <th style="padding: 8px 0; border-bottom: 2px solid #1C2A38; font-family: Inter, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #7A8EA0; text-align: center;">Qty</th>
            <th style="padding: 8px 0; border-bottom: 2px solid #1C2A38; font-family: Inter, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #7A8EA0; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="margin-top: 16px; padding-top: 16px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0; font-family: Inter, sans-serif; font-size: 13px; color: #7A8EA0;">Subtotal</td>
            <td style="padding: 4px 0; font-family: Inter, sans-serif; font-size: 13px; color: #1C2A38; text-align: right;">
              ${formatCurrency(data.subtotal, data.currency)}
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-family: Inter, sans-serif; font-size: 13px; color: #7A8EA0;">Shipping</td>
            <td style="padding: 4px 0; font-family: Inter, sans-serif; font-size: 13px; color: #1C2A38; text-align: right;">
              ${data.shippingCost === 0 ? 'Free' : formatCurrency(data.shippingCost, data.currency)}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0 0; font-family: 'Cormorant Garamond', serif; font-size: 18px; color: #1C2A38; font-weight: 600; border-top: 2px solid #1C2A38;">Total</td>
            <td style="padding: 12px 0 0; font-family: 'Cormorant Garamond', serif; font-size: 18px; color: #1C2A38; font-weight: 600; text-align: right; border-top: 2px solid #1C2A38;">
              ${formatCurrency(data.total, data.currency)}
            </td>
          </tr>
        </table>
      </div>

      ${addressBlock}

      <!-- Track Order Button -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="https://yinyangguardian.com/orders/track"
           style="display: inline-block; padding: 12px 32px; background-color: #1C2A38; color: #FAFCFE; font-family: Inter, sans-serif; font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 8px;">
          Track Your Order
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid #F0F4F8; padding: 24px 0; text-align: center;">
      <p style="margin: 0 0 8px; font-family: Inter, sans-serif; font-size: 12px; color: #9AACBB;">
        Questions? Reply to this email or visit our FAQ.
      </p>
      <p style="margin: 0; font-family: Inter, sans-serif; font-size: 11px; color: #9AACBB;">
        &copy; ${new Date().getFullYear()} YINYANG GUARDIAN. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`
}

export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log('RESEND_API_KEY not set — skipping order confirmation email')
    return false
  }

  try {
    const resend = new Resend(apiKey)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@yinyangguardian.com'

    await resend.emails.send({
      from: `YINYANG GUARDIAN <${fromEmail}>`,
      to: data.customerEmail,
      subject: `Order Confirmed — Thank you for your purchase!`,
      html: buildOrderEmailHtml(data),
    })

    console.log('Order confirmation email sent to:', data.customerEmail)
    return true
  } catch (err) {
    console.error('Failed to send order confirmation email:', err)
    return false
  }
}
