/**
 * Bazi feature — calculate endpoint (§1.1–§1.5).
 *
 * Server-side: resolves the birth city to a timezone, normalises historical DST
 * to local standard time, runs the deterministic engine, composes the result,
 * and enriches the CTA with a real product link for the recommended stone
 * (§3 item 1 → "推奨ストーンの商品ページ"). NO LLM at runtime (§1.2).
 */
import { NextRequest, NextResponse } from 'next/server';
import { resolveCity, toStandardTime } from '@/lib/bazi/timezone';
import { computeChart, composeResult } from '@/lib/bazi';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Locale } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function fmtTime(h: number, m: number): string {
  const ampm = h < 12 ? 'AM' : 'PM';
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`;
}

async function resolveProductHref(crystalTypes: string[]): Promise<string> {
  try {
    const supabase = createServerSupabaseClient();
    // Match the recommended stone against crystal_type, gemstone, OR product
    // name so a product auto-connects as long as ANY of those carries the stone
    // name (see BAZI_STONE_PRODUCT_GUIDE.md for the tagging map).
    const orFilter = crystalTypes
      .flatMap((ct) => [
        `crystal_type.ilike.%${ct}%`,
        `gemstone.ilike.%${ct}%`,
        `name.ilike.%${ct}%`,
      ])
      .join(',');
    const { data } = await supabase
      .from('products')
      .select('slug')
      .eq('is_active', true)
      .neq('category', 'Stones')
      .or(orFilter)
      .limit(1);
    if (data && data[0]?.slug) return `/products/${data[0].slug}`;
  } catch {
    // Supabase unavailable / unconfigured — fall back gracefully.
  }
  return '/products';
}

export async function POST(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { date, time, cityId } = body ?? {};
  const locale: Locale = (['en', 'ja', 'ko', 'zh'].includes(body?.locale) ? body.locale : 'en');

  // Validate date
  const y = Number(date?.year), mo = Number(date?.month), d = Number(date?.day);
  if (!Number.isInteger(y) || !Number.isInteger(mo) || !Number.isInteger(d) ||
      y < 1900 || y > 2100 || mo < 1 || mo > 12 || d < 1 || d > 31) {
    return NextResponse.json({ error: 'Invalid birth date' }, { status: 400 });
  }

  // City
  if (!cityId || typeof cityId !== 'string') {
    return NextResponse.json({ error: 'Birth city is required' }, { status: 400 });
  }
  const city = resolveCity(cityId);
  if (!city) return NextResponse.json({ error: 'Unknown city' }, { status: 400 });

  // Time (optional)
  const knownTime = time != null && time.hour != null;
  let hour = 12, minute = 0, dstApplied = false;
  let chart;
  if (knownTime) {
    hour = Number(time.hour); minute = Number(time.minute ?? 0);
    if (!Number.isInteger(hour) || !Number.isInteger(minute) ||
        hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return NextResponse.json({ error: 'Invalid birth time' }, { status: 400 });
    }
    const std = toStandardTime(city.timezone, y, mo, d, hour, minute);
    dstApplied = std.dstApplied;
    chart = computeChart({
      year: std.year, month: std.month, day: std.day,
      hour: std.hour, minute: std.minute, knownTime: true,
    });
  } else {
    chart = computeChart({ year: y, month: mo, day: d, hour: 12, minute: 0, knownTime: false });
  }

  // Birth line
  const dateStr = `${d} ${MONTHS[mo - 1]} ${y}`;
  const timeStr = knownTime ? fmtTime(hour, minute) : 'time unknown';
  const birthLine = `${dateStr} · ${timeStr} · ${city.label}`;

  // Late-Zi footnote (§1.2, for connoisseurs)
  const lateZiFootnote = chart.lateZi
    ? 'Born in the late Zi hour (after 11 PM): your day pillar stays with your birth date, while the hour stem is taken from the next day — the classical 子時 convention.'
    : null;

  // Build with a placeholder share url first, then patch params.
  const result = composeResult(chart, { birthLine, shareImageUrl: '', lateZiFootnote }, locale);

  // OG / chart-card share image (§1.9)
  const ogParams = new URLSearchParams({
    t: result.archetypeTitle,
    s: result.dayMasterSubtitle,
    p: result.pillars.map((p) => (p.known ? p.ganzhi : '??')).join('-'),
    e: result.favorable,
    r: result.rarity?.label ?? '',
  });
  result.shareImageUrl = `/bazi/og?${ogParams.toString()}`;

  // Real product link for the recommended stone.
  result.stone.productHref = await resolveProductHref(result.stone.crystalTypes);

  return NextResponse.json({ result, meta: { dstApplied } });
}
