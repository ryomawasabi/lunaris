/**
 * Bazi feature — live pillar preview for the input form.
 * Returns ONLY the four pillars (no template, no product, no rarity) so the
 * tiles at the top of the form can fill in as the user types — "the reading has
 * already begun." Cheap and deterministic.
 *
 * City is optional here: before a city is chosen we treat the entered time as
 * local standard time (good enough for a live preview); the authoritative
 * /calculate run applies full DST resolution.
 */
import { NextRequest, NextResponse } from 'next/server';
import { resolveCity, toStandardTime } from '@/lib/bazi/timezone';
import { computeChart, pillarViews } from '@/lib/bazi';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ pillars: null });
  }

  const { date, time, cityId } = body ?? {};
  const y = Number(date?.year), mo = Number(date?.month), d = Number(date?.day);
  if (!Number.isInteger(y) || !Number.isInteger(mo) || !Number.isInteger(d) ||
      y < 1900 || y > 2100 || mo < 1 || mo > 12 || d < 1 || d > 31) {
    return NextResponse.json({ pillars: null });
  }

  const knownTime = time != null && time.hour != null && time.hour !== '';
  let chart;
  if (knownTime) {
    let hour = Number(time.hour);
    let minute = Number(time.minute ?? 0);
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) hour = 12;
    if (!Number.isInteger(minute) || minute < 0 || minute > 59) minute = 0;
    const city = cityId ? resolveCity(cityId) : null;
    if (city) {
      const std = toStandardTime(city.timezone, y, mo, d, hour, minute);
      chart = computeChart({ year: std.year, month: std.month, day: std.day, hour: std.hour, minute: std.minute, knownTime: true });
    } else {
      chart = computeChart({ year: y, month: mo, day: d, hour, minute, knownTime: true });
    }
  } else {
    chart = computeChart({ year: y, month: mo, day: d, hour: 12, minute: 0, knownTime: false });
  }

  return NextResponse.json({ pillars: pillarViews(chart, 'en') });
}
