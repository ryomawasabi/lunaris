'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getZodiacFromDate, getElementColor, getElementBorder, getMatchingCrystalTypes } from '@/lib/zodiac';
import type { ZodiacSign } from '@/lib/zodiac';
import { useProductStatus } from '@/components/providers/ProductStatusProvider';
import type { Product } from '@/lib/types';
import { Sparkles, ArrowRight, RotateCcw, Calendar, ShoppingBag } from 'lucide-react';

type Step = 'intro' | 'input' | 'revealing' | 'result';

interface MatchedProduct {
  product: Product;
  matchedCrystal: string;
}

export function CrystalQuiz() {
  const [step, setStep] = useState<Step>('intro');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState<ZodiacSign | null>(null);
  const [error, setError] = useState('');
  const { products } = useProductStatus();

  // Find products that match the recommended crystals
  const matchedProducts = useMemo(() => {
    if (!result) return [];

    const matches: MatchedProduct[] = [];
    const seen = new Set<string>();

    for (const crystal of result.crystals) {
      const crystalTypes = getMatchingCrystalTypes(crystal.name);

      for (const product of products) {
        if (seen.has(product.id)) continue;
        if (product.isHidden || product.isSoldOut) continue;

        if (crystalTypes.includes(product.crystalType)) {
          matches.push({ product, matchedCrystal: crystal.name });
          seen.add(product.id);
        }
      }
    }

    return matches;
  }, [result, products]);

  const handleSubmit = () => {
    const m = parseInt(month);
    const d = parseInt(day);

    if (!month || !day || m < 1 || m > 12 || d < 1 || d > 31) {
      setError('Please enter a valid date of birth.');
      return;
    }

    setError('');
    setStep('revealing');

    const zodiac = getZodiacFromDate(m, d);
    setResult(zodiac);

    setTimeout(() => setStep('result'), 2000);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Intro Screen */}
      {step === 'intro' && (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in-up">
          <div className="mb-8 text-6xl opacity-80">✦</div>
          <h1 className="font-serif text-4xl md:text-6xl text-dark mb-6 leading-tight">
            Soul Stone<br />Discovery
          </h1>
          <p className="font-sans text-warm max-w-lg text-base md:text-lg mb-12 leading-relaxed">
            The stars have aligned to guide you. Enter your date of birth and
            uncover the crystals that resonate with your unique celestial energy.
          </p>
          <button
            onClick={() => setStep('input')}
            className="group flex items-center gap-3 px-8 py-4 bg-dark text-cream font-sans text-sm tracking-wider rounded-full hover:bg-charcoal transition-all duration-300"
          >
            Begin Your Journey
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Date Input Screen */}
      {step === 'input' && (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in-up">
          <Calendar size={32} className="text-gold mb-6" />
          <h2 className="font-serif text-3xl md:text-5xl text-dark mb-3">
            When were you born?
          </h2>
          <p className="font-sans text-warm mb-10 text-sm md:text-base">
            Your birth date reveals your zodiac energy and crystal alignment.
          </p>

          <div className="flex items-center gap-3 md:gap-4 mb-6">
            {/* Month */}
            <div className="flex flex-col items-center">
              <label className="text-xs font-sans text-warm-light mb-2 tracking-wider uppercase">
                Month
              </label>
              <input
                type="number"
                min="1"
                max="12"
                placeholder="MM"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-20 md:w-24 h-16 text-center text-2xl font-serif bg-white/60 border border-stone rounded-xl text-dark placeholder:text-warm-light/50 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              />
            </div>

            <span className="text-2xl text-warm-light mt-6">/</span>

            {/* Day */}
            <div className="flex flex-col items-center">
              <label className="text-xs font-sans text-warm-light mb-2 tracking-wider uppercase">
                Day
              </label>
              <input
                type="number"
                min="1"
                max="31"
                placeholder="DD"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-20 md:w-24 h-16 text-center text-2xl font-serif bg-white/60 border border-stone rounded-xl text-dark placeholder:text-warm-light/50 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              />
            </div>

            <span className="text-2xl text-warm-light mt-6">/</span>

            {/* Year (optional) */}
            <div className="flex flex-col items-center">
              <label className="text-xs font-sans text-warm-light mb-2 tracking-wider uppercase">
                Year
              </label>
              <input
                type="number"
                min="1900"
                max="2026"
                placeholder="YYYY"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-24 md:w-28 h-16 text-center text-2xl font-serif bg-white/60 border border-stone rounded-xl text-dark placeholder:text-warm-light/50 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              />
            </div>
          </div>

          <p className="text-xs font-sans text-warm-light mb-8">Year is optional</p>

          {error && (
            <p className="text-red-400 text-sm font-sans mb-4">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            className="group flex items-center gap-3 px-8 py-4 bg-dark text-cream font-sans text-sm tracking-wider rounded-full hover:bg-charcoal transition-all duration-300"
          >
            <Sparkles size={16} />
            Reveal My Crystals
          </button>

          <button
            onClick={() => setStep('intro')}
            className="mt-6 text-xs font-sans text-warm-light hover:text-warm transition-colors"
          >
            ← Go back
          </button>
        </div>
      )}

      {/* Revealing Animation */}
      {step === 'revealing' && result && (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
          <div className="text-7xl mb-8 animate-pulse">{result.symbol}</div>
          <p className="font-serif text-2xl md:text-3xl text-dark animate-fade-in-up">
            Reading the stars...
          </p>
          <div className="mt-8 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '200ms' }} />
            <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '400ms' }} />
          </div>
        </div>
      )}

      {/* Result Screen */}
      {step === 'result' && result && (
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 animate-fade-in-up">
          {/* Zodiac Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">{result.symbol}</div>
            <h2 className="font-serif text-4xl md:text-5xl text-dark mb-2">
              {result.name}
            </h2>
            <p className="font-sans text-sm text-warm-light tracking-wider uppercase mb-1">
              {result.dateRange} · {result.element} Element
            </p>
            <p className="font-serif text-xl md:text-2xl text-gold mt-4 italic">
              &ldquo;{result.energy}&rdquo;
            </p>
          </div>

          {/* Energy Description */}
          <div className={`rounded-2xl p-8 mb-12 bg-gradient-to-br ${getElementColor(result.element)} border ${getElementBorder(result.element)}`}>
            <p className="font-sans text-dark/80 leading-relaxed text-center text-sm md:text-base">
              {result.energyDescription}
            </p>
          </div>

          {/* Crystal Recommendations */}
          <div className="mb-16">
            <h3 className="font-serif text-2xl md:text-3xl text-dark text-center mb-8">
              Your Crystal Alignment
            </h3>
            <div className="space-y-6">
              {result.crystals.map((crystal, i) => {
                // Find products that match this specific crystal
                const crystalProducts = matchedProducts.filter(
                  (mp) => mp.matchedCrystal === crystal.name
                );

                return (
                  <div
                    key={crystal.name}
                    className="animate-fadeInUp bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-stone-light/60 hover:border-gold/30 transition-all duration-300"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    {/* Crystal Info */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg text-gold">◆</span>
                        <h4 className="font-serif text-xl md:text-2xl text-dark">
                          {crystal.name}
                        </h4>
                      </div>
                      <p className="font-sans text-warm text-sm leading-relaxed">
                        {crystal.reason}
                      </p>
                    </div>

                    {/* Matched Products for this crystal */}
                    {crystalProducts.length > 0 && (
                      <div className="mt-5 pt-5 border-t border-stone-light/60">
                        <p className="text-xs font-sans text-warm-light uppercase tracking-wider mb-4">
                          Recommended {crystal.name} pieces for you
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {crystalProducts.map(({ product }) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              className="group rounded-2xl overflow-hidden bg-white/70 border border-stone-light/40 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300"
                            >
                              {/* Product Image */}
                              <div className="relative aspect-[4/3] overflow-hidden bg-stone-light">
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                              {/* Product Info */}
                              <div className="p-4">
                                <h5 className="font-serif text-base md:text-lg text-dark leading-tight mb-1 group-hover:text-gold transition-colors">
                                  {product.name}
                                </h5>
                                <p className="text-xs font-sans text-warm-light mb-3">
                                  {product.crystalType} · {product.category}
                                </p>
                                {/* Crystal Effects Tags */}
                                <div className="flex flex-wrap gap-1.5">
                                  {product.crystalEffects.map((effect) => (
                                    <span
                                      key={effect}
                                      className="inline-block text-xs font-sans px-2.5 py-1 rounded-full bg-gold/10 text-gold-dark"
                                    >
                                      {effect}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Matched Products Summary */}
          {matchedProducts.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-8">
                <ShoppingBag size={24} className="mx-auto text-gold mb-3" />
                <h3 className="font-serif text-2xl md:text-3xl text-dark mb-2">
                  Your Celestial Collection
                </h3>
                <p className="font-sans text-warm text-sm">
                  All YINYANG GUARDIAN pieces aligned with your {result.name} energy
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {matchedProducts.map(({ product }, i) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group animate-fadeInUp rounded-xl overflow-hidden bg-white/50 border border-stone-light/60 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-stone-light">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Crystal Type Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="inline-block text-[10px] font-sans px-2 py-1 rounded-full bg-dark/70 text-cream backdrop-blur-sm">
                          {product.crystalType}
                        </span>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-3 md:p-4">
                      <h5 className="font-serif text-sm md:text-base text-dark leading-tight mb-2 group-hover:text-gold transition-colors">
                        {product.name}
                      </h5>
                      {/* Effects */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {product.crystalEffects.map((effect) => (
                          <span
                            key={effect}
                            className="inline-block text-[10px] font-sans px-2 py-0.5 rounded-full bg-gold/10 text-gold-dark"
                          >
                            {effect}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm font-sans text-dark">
                        ¥{product.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="text-center space-y-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-8 py-4 bg-dark text-cream font-sans text-sm tracking-wider rounded-full hover:bg-charcoal transition-all duration-300"
            >
              Explore All Crystals
              <ArrowRight size={16} />
            </Link>
            <div>
              <button
                onClick={() => {
                  setStep('intro');
                  setMonth('');
                  setDay('');
                  setYear('');
                  setResult(null);
                }}
                className="inline-flex items-center gap-2 mt-4 text-sm font-sans text-warm-light hover:text-warm transition-colors"
              >
                <RotateCcw size={14} />
                Try another date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
