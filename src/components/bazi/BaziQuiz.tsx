'use client';

/**
 * Bazi feature — quiz input flow (§1.1).
 * Three inputs only: birth date, birth time (+ "I don't know" option),
 * birth city (autocomplete → server-side timezone/DST resolution).
 *
 * Input UI = "Plan A": native <select>s for Year/Month/Day and Hour/Minute.
 * Year is first and descending (Bazi leads with the year), the day list adjusts
 * to the selected month/year (leap Feb included), and the four pillar tiles fill
 * in live as the inputs resolve — the reading begins while you type.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguageSafe } from '@/components/providers/LanguageProvider';
import type { BaziResult, PillarView } from '@/lib/bazi/types';
import { BaziResultView } from './BaziResultView';

type Step = 'input' | 'revealing' | 'result';
interface CityOption { id: string; label: string; timezone: string }

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1900 + 1 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

function daysInMonth(year: number, month: number): number {
  if (!year || !month) return 31;
  return new Date(year, month, 0).getDate(); // month is 1-based; day 0 = last day
}

const selectClass =
  'w-full rounded-md border border-bazi-border bg-bazi-raised px-3 py-3 text-bazi-cream focus:border-bazi-gold focus:outline-none';

function PreviewTiles({ pillars }: { pillars: PillarView[] | null }) {
  const positions: PillarView['position'][] = ['HOUR', 'DAY', 'MONTH', 'YEAR'];
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {positions.map((pos, i) => {
        const p = pillars?.[i];
        const isDay = pos === 'DAY';
        const ganzhi = p?.known ? p.ganzhi : '';
        return (
          <div
            key={pos}
            className={`flex h-24 flex-col items-center justify-center rounded-xl border bg-bazi-raised/70 transition ${
              isDay ? 'border-bazi-gold' : 'border-bazi-border'
            }`}
          >
            <span className={`text-[9px] uppercase tracking-[0.18em] ${isDay ? 'text-bazi-gold' : 'text-bazi-muted'}`}>
              {isDay ? 'YOU' : pos}
            </span>
            <span className={`mt-1 font-serif-jp text-3xl ${ganzhi ? 'text-bazi-cream' : 'text-bazi-muted/30'}`}>
              {ganzhi || '－'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function BaziQuiz() {
  const lang = useLanguageSafe();
  const locale = lang?.locale ?? 'en';

  const [step, setStep] = useState<Step>('input');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
  const [city, setCity] = useState<CityOption | null>(null);
  const [options, setOptions] = useState<CityOption[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<BaziResult | null>(null);
  const [preview, setPreview] = useState<PillarView[] | null>(null);
  const cityDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const maxDay = useMemo(() => daysInMonth(Number(year), Number(month)), [year, month]);
  const days = useMemo(() => Array.from({ length: maxDay }, (_, i) => i + 1), [maxDay]);

  // Clamp day when the month/year shrinks the available range.
  useEffect(() => {
    if (day && Number(day) > maxDay) setDay(String(maxDay));
  }, [maxDay, day]);

  // Pre-fill birth date from the homepage hero hand-off (/bazi?y=&m=&d=).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const y = sp.get('y'), m = sp.get('m'), d = sp.get('d');
    if (y) setYear(y);
    if (m) setMonth(m);
    if (d) setDay(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced city autocomplete
  useEffect(() => {
    if (city && cityQuery === city.label) return;
    if (cityQuery.trim().length < 2) { setOptions([]); return; }
    if (cityDebounce.current) clearTimeout(cityDebounce.current);
    cityDebounce.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/bazi/cities?q=${encodeURIComponent(cityQuery)}`);
        const data = await r.json();
        setOptions(data.cities ?? []);
        setShowOptions(true);
      } catch { setOptions([]); }
    }, 220);
    return () => { if (cityDebounce.current) clearTimeout(cityDebounce.current); };
  }, [cityQuery, city]);

  // Live pillar preview — fires once the full date is chosen, refines with time/city.
  useEffect(() => {
    if (!year || !month || !day) { setPreview(null); return; }
    if (previewDebounce.current) clearTimeout(previewDebounce.current);
    previewDebounce.current = setTimeout(async () => {
      try {
        const timePayload = !unknownTime && hour !== '' ? { hour: Number(hour), minute: Number(minute || 0) } : null;
        const r = await fetch('/api/bazi/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: { year: Number(year), month: Number(month), day: Number(day) }, time: timePayload, cityId: city?.id ?? null }),
        });
        const data = await r.json();
        setPreview(data.pillars ?? null);
      } catch { /* preview is best-effort */ }
    }, 250);
    return () => { if (previewDebounce.current) clearTimeout(previewDebounce.current); };
  }, [year, month, day, hour, minute, unknownTime, city]);

  async function submit() {
    setError('');
    if (!year || !month || !day) return setError('Please choose your full birth date.');
    if (!unknownTime && hour === '') return setError('Choose your birth time, or check “I don’t know”.');
    if (!city) return setError('Please choose your birth city.');

    const timePayload = !unknownTime ? { hour: Number(hour), minute: Number(minute || 0) } : null;

    setStep('revealing');
    try {
      const r = await fetch('/api/bazi/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: { year: Number(year), month: Number(month), day: Number(day) }, time: timePayload, cityId: city.id, locale }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || 'Could not calculate your chart.');
      setTimeout(() => { setResult(data.result); setStep('result'); }, 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not calculate your chart.');
      setStep('input');
    }
  }

  if (step === 'result' && result) {
    return <BaziResultView result={result} onRestart={() => { setResult(null); setStep('input'); }} />;
  }

  if (step === 'revealing') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-bazi-border border-t-bazi-gold" />
        <p className="mt-6 font-serif text-2xl text-bazi-cream">Reading your chart…</p>
        <p className="mt-1 text-sm text-bazi-muted">Calculating your four pillars from the solar terms.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-12">
      {locale !== 'en' && (
        <div className="mb-6 rounded-lg border border-bazi-border bg-bazi-raised/60 p-4 text-center text-sm text-bazi-body">
          This reading is currently available in English. You can continue in English below — other languages are coming soon.
        </div>
      )}

      <h1 className="text-center font-serif text-4xl text-bazi-cream sm:text-5xl">Discover your guardian</h1>
      <p className="mx-auto mt-3 max-w-md text-center text-bazi-body">
        Your zodiac tells you which of twelve groups you fall in. Your Bazi — your real birth chart — tells you who
        <em> you</em> are.
      </p>

      {/* Live preview — the reading begins as you type */}
      <div className="mt-8">
        <PreviewTiles pillars={preview} />
      </div>

      <div className="mt-8 space-y-6">
        {/* Birth date — Year / Month / Day */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-bazi-muted">Birth date</label>
          <div className="grid grid-cols-3 gap-2">
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
        </div>

        {/* Birth time — Hour / Minute (24h) */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-bazi-muted">Birth time</label>
          <div className="grid grid-cols-2 gap-2">
            <select value={hour} onChange={(e) => setHour(e.target.value)} disabled={unknownTime} className={`${selectClass} disabled:opacity-40`} aria-label="Birth hour (24-hour)">
              <option value="">Hour</option>
              {HOURS.map((h) => <option key={h} value={h}>{String(h).padStart(2, '0')}</option>)}
            </select>
            <select value={minute} onChange={(e) => setMinute(e.target.value)} disabled={unknownTime} className={`${selectClass} disabled:opacity-40`} aria-label="Birth minute">
              <option value="">Minute</option>
              {MINUTES.map((m) => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
            </select>
          </div>
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-bazi-muted">
            <input type="checkbox" checked={unknownTime} onChange={(e) => setUnknownTime(e.target.checked)} className="accent-bazi-gold" />
            I don&apos;t know my birth time
          </label>
        </div>

        {/* Birth city autocomplete */}
        <div className="relative">
          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-bazi-muted">Birth city</label>
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => { setCityQuery(e.target.value); setCity(null); }}
            onFocus={() => options.length && setShowOptions(true)}
            placeholder="Start typing a city…"
            autoComplete="off"
            className="w-full rounded-md border border-bazi-border bg-bazi-raised px-4 py-3 text-bazi-cream placeholder:text-bazi-muted focus:border-bazi-gold focus:outline-none"
          />
          {showOptions && options.length > 0 && !city && (
            <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-bazi-border bg-bazi-raised shadow-xl">
              {options.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => { setCity(o); setCityQuery(o.label); setShowOptions(false); }}
                    className="block w-full px-4 py-2 text-left text-sm text-bazi-body hover:bg-bazi-ink hover:text-bazi-cream"
                  >
                    {o.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-1 text-xs text-bazi-muted">We use this only to find your exact local time — never to ask about timezones.</p>
        </div>

        {error && <p className="text-sm text-element-fire">{error}</p>}

        <button onClick={submit} className="w-full rounded-md bg-bazi-gold px-6 py-3.5 font-medium text-bazi-ink transition hover:opacity-90">
          Reveal my chart
        </button>
      </div>
    </div>
  );
}
