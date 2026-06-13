/**
 * Bazi feature — email capture (§1.8).
 *
 * Fires AFTER the result is shown (the result is never gated). Offer is
 * "Get your full reading by email." Completion reward = the downloadable
 * chart-card image. NO discount voucher.
 */
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = String(body?.email ?? '').trim();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
  }

  const shareImageUrl = typeof body?.shareImageUrl === 'string' ? body.shareImageUrl : null;

  // Send the full reading via Resend if configured; otherwise no-op (so the
  // funnel still works in dev). Reward image is returned for client download.
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const { Resend } = await import('resend');
      const resend = new Resend(apiKey);
      const from = process.env.RESEND_FROM_EMAIL || 'readings@yinyangguardian.com';
      await resend.emails.send({
        from,
        to: email,
        subject: 'Your full birth-chart reading · YINYANG GUARDIAN',
        html: `<p>Your guardian is waiting. Your full reading and chart card are on their way.</p>${
          shareImageUrl ? `<p><img src="${shareImageUrl}" alt="Your chart card" width="600" /></p>` : ''
        }`,
      });
    } else {
      console.log(`[bazi] RESEND_API_KEY not set — captured email (no send): ${email}`);
    }
  } catch (err) {
    console.error('[bazi] subscribe send failed:', err);
    // Still treat capture as success — never block the reward on email infra.
  }

  return NextResponse.json({ ok: true, shareImageUrl });
}
