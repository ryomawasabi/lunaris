'use client';

/**
 * Bazi feature — diagnostic-flow header (scope: /bazi only).
 *
 * Deliberately NOT the global site header: ink-green background so the logo and
 * the result page read as one continuous sheet, no legacy brand nav
 * (Shop All / Soul Stone Discovery / Crystal Essence / Collections / About) to
 * avoid exit ramps mid-funnel. Logo (cream Cormorant) + cart only.
 *
 * The global Header/Footer are hidden on /bazi (see those components), so this
 * is the sole chrome for the diagnostic flow.
 */

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';

export function BaziHeader() {
  const { itemCount, setCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-bazi-border/60 bg-bazi-ink/95 backdrop-blur supports-[backdrop-filter]:bg-bazi-ink/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link
          href="/bazi"
          className="font-serif text-xl tracking-[0.22em] text-bazi-cream sm:text-2xl"
          aria-label="YINYANG GUARDIAN — Discover your guardian"
        >
          YINYANG GUARDIAN
        </Link>

        <button
          onClick={() => setCartOpen(true)}
          className="relative text-bazi-body transition hover:text-bazi-gold"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-bazi-gold px-1 text-[10px] font-medium text-bazi-ink">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
