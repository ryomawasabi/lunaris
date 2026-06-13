/**
 * Bazi feature — birth-city autocomplete (§1.1).
 * Server-side so the ~7k-city dataset never ships to the client.
 */
import { NextRequest, NextResponse } from 'next/server';
import { searchCities } from '@/lib/bazi/timezone';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  if (q.trim().length < 2) return NextResponse.json({ cities: [] });
  const cities = searchCities(q, 8).map((c) => ({
    id: c.id,
    label: c.label,
    timezone: c.timezone,
  }));
  return NextResponse.json({ cities });
}
