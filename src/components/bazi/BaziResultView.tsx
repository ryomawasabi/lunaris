'use client';

/**
 * Bazi feature — result page composition (§1.4, order LOCKED).
 * Presentational: receives a fully locale-resolved BaziResult from the engine.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { BaziResult } from '@/lib/bazi/types';
import type { Product } from '@/lib/types';
import { useProductStatusSafe } from '@/components/providers/ProductStatusProvider';
import { ProductCard } from '@/components/product/ProductCard';

function EmailCapture({ shareImageUrl }: { shareImageUrl: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    try {
      const r = await fetch('/api/bazi/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, shareImageUrl }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || 'Something went wrong.');
      setState('done');
    } catch (err) {
      setState('error');
      setMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (state === 'done') {
    return (
      <div className="rounded-xl border border-bazi-border bg-bazi-raised/60 p-6 text-center">
        <p className="font-serif text-2xl text-bazi-cream">Your full reading is on its way.</p>
        <p className="mt-2 text-sm text-bazi-muted">Check your inbox — your chart card is attached.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-bazi-border bg-bazi-raised/60 p-6">
      <p className="font-serif text-2xl text-bazi-cream">Get your full reading by email</p>
      <p className="mt-1 text-sm text-bazi-muted">
        We&apos;ll send the complete reading and a chart card you can keep.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="flex-1 rounded-md border border-bazi-border bg-bazi-ink px-4 py-3 text-bazi-cream placeholder:text-bazi-muted focus:border-bazi-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="rounded-md bg-bazi-gold px-6 py-3 font-medium text-bazi-ink transition hover:opacity-90 disabled:opacity-60"
        >
          {state === 'loading' ? 'Sending…' : 'Send my reading'}
        </button>
      </div>
      {state === 'error' && <p className="mt-2 text-sm text-element-fire">{msg}</p>}
    </form>
  );
}

export function BaziResultView({ result, onRestart }: { result: BaziResult; onRestart?: () => void }) {
  const [copied, setCopied] = useState(false);
  const productStatus = useProductStatusSafe();

  // In-stock products whose stone matches the recommended stone (same approach
  // as Soul Stone Discovery): matches on crystal_type or product name. Empty
  // when nothing in stock for this stone — the CTA then points at the shop.
  const matchedProducts = useMemo(() => {
    const products = productStatus?.products ?? [];
    const types = result.stone.crystalTypes.map((t) => t.toLowerCase());
    const out: Product[] = [];
    const seen = new Set<string>();
    for (const p of products) {
      if (p.isHidden || p.isSoldOut) continue;
      const ct = (p.crystalType || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      if (types.some((t) => ct === t || ct.includes(t) || name.includes(t)) && !seen.has(p.id)) {
        out.push(p);
        seen.add(p.id);
      }
      if (out.length >= 3) break;
    }
    return out;
  }, [productStatus?.products, result.stone.crystalTypes]);

  async function share() {
    const url = typeof window !== 'undefined' ? window.location.origin + result.shareImageUrl : result.shareImageUrl;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: result.archetypeTitle, text: result.personality, url });
        return;
      } catch { /* fall through to copy */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 text-bazi-body">
      {/* 1 — Eyebrow */}
      <p className="text-center text-xs uppercase tracking-[0.25em] text-bazi-muted">
        Yinyang Guardian · {result.birthLine}
      </p>

      {/* 2 — Archetype + Day Master */}
      <h1 className="mt-4 text-center font-serif text-5xl leading-tight text-bazi-cream sm:text-6xl">
        {result.archetypeTitle}
      </h1>
      <p className="mt-2 text-center font-serif-jp text-lg text-bazi-gold">{result.dayMasterSubtitle}</p>

      {/* 3 — Rarity badge */}
      {result.rarity && (
        <div className="mt-4 flex justify-center">
          <span className="rounded-full border border-bazi-border px-4 py-1 text-sm text-bazi-gold">
            {result.rarity.mark} {result.rarity.label}
          </span>
        </div>
      )}

      {/* 4 — Four Pillars tiles (signature visual) */}
      <div className="mt-10 grid grid-cols-4 gap-3">
        {result.pillars.map((p) => (
          <div
            key={p.position}
            className={`flex flex-col items-center rounded-xl border bg-bazi-raised px-2 py-4 text-center ${
              p.position === 'DAY' ? 'border-bazi-gold' : 'border-bazi-border'
            }`}
          >
            <span className={`text-[10px] uppercase tracking-[0.2em] ${p.position === 'DAY' ? 'text-bazi-gold' : 'text-bazi-muted'}`}>
              {p.tag ?? p.position}
            </span>
            {p.known ? (
              <>
                <span className="my-2 font-serif-jp text-4xl text-bazi-cream sm:text-5xl">{p.ganzhi}</span>
                <span className="text-[10px] leading-tight text-bazi-muted">{p.stemLabel}</span>
                <span className="text-[10px] leading-tight text-bazi-muted">{p.branchLabel}</span>
              </>
            ) : (
              <>
                <span className="my-2 font-serif-jp text-4xl text-bazi-muted/50 sm:text-5xl">？</span>
                <span className="px-1 text-[10px] leading-tight text-bazi-muted">{p.stemLabel}</span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 5 — Personality sentence */}
      <p className="mt-10 text-center font-serif text-2xl italic leading-relaxed text-bazi-cream">
        “{result.personality}”
      </p>

      {/* 6 — Five Energies bars */}
      <div className="mt-12">
        <h2 className="mb-4 text-xs uppercase tracking-[0.25em] text-bazi-muted">Your five energies</h2>
        <div className="space-y-3">
          {result.energies.map((en) => (
            <div key={en.element} className="flex items-center gap-3">
              <span className="w-6 font-serif-jp text-lg" style={{ color: en.color }}>{en.kanji}</span>
              <span className="w-24 text-sm text-bazi-body">{en.label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-bazi-ink">
                <div className="h-full rounded-full" style={{ width: `${en.percent}%`, background: en.color }} />
              </div>
              <span className="w-24 text-right text-xs text-bazi-muted">{en.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7 — Missing-element callout */}
      <div className="mt-10 rounded-xl border border-bazi-border bg-bazi-raised/60 p-6">
        <p className="font-serif text-2xl text-bazi-cream">{result.callout.title}</p>
        <p className="mt-2 text-bazi-body">{result.callout.body}</p>
      </div>

      {/* 8 — Guardian line (Option B: icon + name + one sentence) */}
      <div className="mt-6 flex items-center gap-4 rounded-xl border border-bazi-border bg-bazi-raised/40 p-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-bazi-gold font-serif-jp text-xl text-bazi-gold">
          {result.guardian.crest}
        </span>
        <p className="text-bazi-cream">{result.guardian.line}</p>
      </div>

      {/* 9 — Your stone */}
      <div className="mt-6 rounded-xl border border-bazi-border bg-bazi-raised/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-bazi-muted">{result.stone.roleLabel}</p>
        <p className="mt-1 font-serif text-2xl text-bazi-cream">{result.stone.category}</p>
        <p className="mt-2 text-bazi-body">{result.stone.description}</p>
        {result.nextStep && (
          <p className="mt-3 text-sm text-bazi-muted">
            Next step: {result.nextStep.stoneCategory} ({result.nextStep.elementLabel}).
          </p>
        )}
      </div>

      {/* 9b — In-stock pieces in your stone (images) */}
      {matchedProducts.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-center text-xs uppercase tracking-[0.25em] text-bazi-muted">
            Wear your guardian&apos;s stone
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {matchedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* 10 — CTA + share/save */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <Link
          href={result.stone.productHref}
          className="rounded-md bg-bazi-gold px-8 py-3 font-medium text-bazi-ink transition hover:opacity-90"
        >
          {matchedProducts.length > 0 ? `Shop all ${result.stone.category}` : `See ${result.stone.category}`}
        </Link>
        <div className="flex items-center gap-5 text-sm text-bazi-muted">
          <button onClick={share} className="hover:text-bazi-gold">
            {copied ? 'Link copied' : 'Share your chart'}
          </button>
          <span aria-hidden>·</span>
          <a href={result.shareImageUrl} target="_blank" rel="noopener noreferrer" download className="hover:text-bazi-gold">
            Save as image
          </a>
        </div>
      </div>

      {/* Email capture — AFTER the result, never gating it (§1.8) */}
      <div className="mt-10">
        <EmailCapture shareImageUrl={result.shareImageUrl} />
      </div>

      {/* Late-Zi footnote (§1.2) */}
      {result.lateZiFootnote && (
        <p className="mt-8 text-center text-xs leading-relaxed text-bazi-muted/80">{result.lateZiFootnote}</p>
      )}

      {onRestart && (
        <div className="mt-8 text-center">
          <button onClick={onRestart} className="text-sm text-bazi-muted underline-offset-4 hover:text-bazi-gold hover:underline">
            Read another chart
          </button>
        </div>
      )}
    </div>
  );
}
