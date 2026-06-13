/**
 * Bazi feature — birth city → timezone + historical DST resolution (§1.1).
 *
 * SERVER ONLY. Pulls in the full city-timezones dataset (~7k cities) and
 * luxon's IANA tz handling; never import this from a client component.
 *
 * Bazi is computed in LOCAL STANDARD TIME. If the birth instant fell inside a
 * historical DST window for that city, we roll the wall clock back by the DST
 * saving so the engine sees standard time. The user is NEVER asked about
 * timezones (§1.1).
 */

import 'server-only';
import { DateTime } from 'luxon';
import { cityMapping, type CityData } from 'city-timezones';

export interface CityMatch {
  id: string;
  label: string; // "Sydney, New South Wales, Australia"
  city: string;
  province: string;
  country: string;
  timezone: string;
  lat: number;
  lng: number;
}

function toMatch(c: CityData): CityMatch {
  const parts = [c.city, c.province, c.country].filter(Boolean);
  return {
    id: `${c.city}|${c.province}|${c.iso2}`,
    label: parts.join(', '),
    city: c.city,
    province: c.province,
    country: c.country,
    timezone: c.timezone,
    lat: c.lat,
    lng: c.lng,
  };
}

/** Autocomplete search over the city dataset, ranked by population. */
export function searchCities(query: string, limit = 8): CityMatch[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const starts: CityData[] = [];
  const contains: CityData[] = [];
  for (const c of cityMapping) {
    if (!c.timezone) continue;
    const name = c.city_ascii.toLowerCase();
    if (name.startsWith(q)) starts.push(c);
    else if (name.includes(q)) contains.push(c);
    if (starts.length > limit * 4) break;
  }
  const byPop = (a: CityData, b: CityData) => (b.pop || 0) - (a.pop || 0);
  return [...starts.sort(byPop), ...contains.sort(byPop)]
    .slice(0, limit)
    .map(toMatch);
}

/** Resolve a city id back to its timezone (used by the calculate endpoint). */
export function resolveCity(id: string): CityMatch | null {
  const [city, province, iso2] = id.split('|');
  const found = cityMapping.find(
    (c) => c.city === city && c.province === province && c.iso2 === iso2 && c.timezone,
  );
  return found ? toMatch(found) : null;
}

export interface StandardTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  /** True if a historical DST offset was removed. */
  dstApplied: boolean;
  /** Resolved IANA zone. */
  timezone: string;
}

/**
 * Convert a civil wall-clock birth time in `timezone` to LOCAL STANDARD TIME,
 * removing any historical DST saving in effect at that instant.
 */
export function toStandardTime(
  timezone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): StandardTime {
  // Seasonal offsets bracket the standard vs. DST offset for the year.
  const janOff = DateTime.fromObject({ year, month: 1, day: 15 }, { zone: timezone }).offset;
  const julOff = DateTime.fromObject({ year, month: 7, day: 15 }, { zone: timezone }).offset;
  const standardOffset = Math.min(janOff, julOff);
  const dstSaving = Math.max(janOff, julOff) - standardOffset; // 0 when no DST

  const dt = DateTime.fromObject({ year, month, day, hour, minute }, { zone: timezone });

  if (dt.isValid && dt.isInDST && dstSaving > 0) {
    const std = dt.minus({ minutes: dstSaving });
    return {
      year: std.year,
      month: std.month,
      day: std.day,
      hour: std.hour,
      minute: std.minute,
      dstApplied: true,
      timezone,
    };
  }

  return { year, month, day, hour, minute, dstApplied: false, timezone };
}
