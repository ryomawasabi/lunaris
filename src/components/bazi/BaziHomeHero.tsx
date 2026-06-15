'use client';

/**
 * Bazi feature — homepage hero CTA (the prominent entry point).
 *
 * A high-contrast ink-green band dropped into the otherwise light homepage so
 * the feature is impossible to miss. Picking a birth date fills the four pillar
 * tiles live (via /api/bazi/preview), and the CTA carries the date into /bazi
 * so the visitor never re-enters it. The full flow (time + city) lives on /bazi.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { PillarView } from '@/lib/bazi/types';
import { FloatingParticles } from '@/components/animations/FloatingParticles';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1900 + 1 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function daysInMonth(year: number, month: number): number {
  if (!year || !month) return 31;
  return new Date(year, month, 0).getDate();
}

const selectClass =
  'w-full rounded-md border border-bazi-border bg-bazi-raised px-3 py-2.5 text-bazi-cream focus:border-bazi-gold focus:outline-none';

export function BaziHomeHero() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [preview, setPreview] = useState<PillarView[] | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const maxDay = useMemo(() => daysInMonth(Number(year), Number(month)), [year, month]);
  const days = useMemo(() => Array.from({ length: maxDay }, (_, i) => i + 1), [maxDay]);

  useEffect(() => {
    if (day && Number(day) > maxDay) setDay(String(maxDay));
  }, [maxDay, day]);

  useEffect(() => {
    if (!year || !month || !day) { setPreview(null); return; }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      try {
        const r = await fetch('/api/bazi/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: { year: Number(year), month: Number(month), day: Number(day) }, time: null, cityId: null }),
        });
        const data = await r.json();
        setPreview(data.pillars ?? null);
      } catch { /* best-effort */ }
    }, 220);
    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [year, month, day]);

  const dateComplete = Boolean(year && month && day);
  const ctaHref = dateComplete ? `/bazi?y=${year}&m=${month}&d=${day}` : '/bazi';
  const positions: PillarView['position'][] = ['HOUR', 'DAY', 'MONTH', 'YEAR'];
  const previewKey = preview ? preview.map((p) => p.ganzhi).join('') : 'empty';

  return (
    <section className="relative overflow-hidden bg-bazi-ink texture-noise-dark px-5 py-16 md:py-20">
      {/* Ambient motion: gold motes + slow-rotating faint rings */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <FloatingParticles count={16} color="#C9A86A" />
        <div
          className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-bazi-gold/[0.06]"
          style={{ animation: 'spin 90s linear infinite' }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-element-water/[0.06]"
          style={{ animation: 'spin 120s linear infinite reverse' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-bazi-gold">New · Bazi Reading</p>
        <h2 className="mt-3 font-serif text-4xl leading-tight text-bazi-cream sm:text-5xl">
          Discover Your Guardian
        </h2>
        <p className="mx-auto mt-3 max-w-md text-bazi-body">
          Your zodiac tells you which of twelve groups you fall in. Your Bazi — your real birth chart — tells you who
          <em> you</em> are.
        </p>

        {/* Live four pillars */}
        <div key={previewKey} className="mt-8 grid grid-cols-4 gap-2 sm:gap-3">
          {positions.map((pos, i) => {
            const p = preview?.[i];
            const isDay = pos === 'DAY';
            const ganzhi = p?.known ? p.ganzhi : '';
            return (
              <div
                key={pos}
                className={`flex h-24 flex-col items-center justify-center rounded-xl border bg-bazi-raised/70 ${
                  isDay ? 'border-bazi-gold' : 'border-bazi-border'
                } ${ganzhi ? 'animate-fadeInUp' : ''}`}
                style={ganzhi ? { animationDelay: `${i * 110}ms` } : undefined}
              >
                <span className={`text-[9px] uppercase tracking-[0.18em] ${isDay ? 'text-bazi-gold' : 'text-bazi-muted'}`}>
                  {isDay ? 'You' : pos.charAt(0) + pos.slice(1).toLowerCase()}
                </span>
                <span className={`mt-1 font-serif-jp text-3xl ${ganzhi ? 'text-bazi-cream' : 'text-bazi-muted/30'}`}>
                  {ganzhi || '－'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Birth date */}
        <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-2">
          <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClass} aria-label="Birth year">
            <option value="">Year</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className={selectClass} aria-label="Birth month">
            <option value="">Month</option>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select value={day} onChange={(e) => setDay(e.target.value)} className={selectClass} aria-label="Birth day">
            <option value="">Day</option>
            {days.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <p className="mt-2 text-xs text-bazi-muted">Pick your birth date and your chart appears, live.</p>

        <Link
          href={ctaHref}
          className="mt-6 inline-block rounded-md bg-bazi-gold px-8 py-3 font-medium text-bazi-ink transition hover:opacity-90"
        >
          {dateComplete ? 'Reveal your chart →' : 'Start your reading →'}
        </Link>
      </div>
    </section>
  );
}
