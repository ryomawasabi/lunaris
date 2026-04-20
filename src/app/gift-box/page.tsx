'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { POWER_STONE_EFFECTS } from '@/lib/zodiac';
import { Check, Package, Sparkles, RotateCcw, ShoppingBag, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassVessel from '@/components/gift-box/GlassVessel';
import { useCart } from '@/components/providers/CartProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';

const SHOWCASE_IMAGES = [
  '/Crystal Essence/crystal-essence-product 1.png',
  '/Crystal Essence/crystal-essence-product 2.png',
  '/Crystal Essence/crystal-essence-product 3.png',
  '/Crystal Essence/crystal-essence-product 4.png',
  '/Crystal Essence/crystal-essence-product 5.png',
  '/Crystal Essence/crystal-essence-product 6.png',
];

const STONE_IMAGES: Record<string, string> = {
  'Smoky Quartz': '/stones/smoky-quartz.png',
  'Aquamarine': '/stones/Aquamarine.png',
  'Amethyst': '/stones/Amethyst.png',
  'Black Obsidian': '/stones/Black Obsidian.png',
  'Green Fluorite': '/stones/Green Fluorite.png',
  'Citrine': '/stones/Citrine.png',
  'Rose Quartz': '/stones/Rose Quartz.png',
  'Carnelian': '/stones/Carnelian.png',
};

// Color accents for each stone
const STONE_COLORS: Record<string, string> = {
  'Smoky Quartz': 'bg-stone-400/20 border-stone-400/40',
  'Aquamarine': 'bg-sky-100/60 border-sky-300/40',
  'Amethyst': 'bg-purple-100/60 border-purple-300/40',
  'Black Obsidian': 'bg-gray-200/60 border-gray-400/40',
  'Green Fluorite': 'bg-emerald-100/60 border-emerald-300/40',
  'Citrine': 'bg-amber-100/60 border-amber-300/40',
  'Rose Quartz': 'bg-pink-100/60 border-pink-300/40',
  'Carnelian': 'bg-orange-100/60 border-orange-300/40',
};

const STONE_SELECTED_COLORS: Record<string, string> = {
  'Smoky Quartz': 'border-stone-500 ring-stone-400/30',
  'Aquamarine': 'border-sky-400 ring-sky-300/30',
  'Amethyst': 'border-purple-400 ring-purple-300/30',
  'Black Obsidian': 'border-gray-600 ring-gray-400/30',
  'Green Fluorite': 'border-emerald-400 ring-emerald-300/30',
  'Citrine': 'border-amber-400 ring-amber-300/30',
  'Rose Quartz': 'border-pink-400 ring-pink-300/30',
  'Carnelian': 'border-orange-400 ring-orange-300/30',
};

const ESSENCE_OILS = [
  {
    name: 'Rose Berry',
    image: '/Essence oil/Rose Berry.png',
    crystal: 'Rose Quartz',
    note: 'Floral & fruity',
    color: 'bg-pink-100/60 border-pink-300/40',
    selectedColor: 'border-pink-400 ring-pink-300/30',
  },
  {
    name: 'Chocolate Gourmet',
    image: '/Essence oil/Chocolate Gourmet.png',
    crystal: 'Smoky Quartz',
    note: 'Rich & warm',
    color: 'bg-amber-100/60 border-amber-400/40',
    selectedColor: 'border-amber-500 ring-amber-300/30',
  },
  {
    name: 'Citrus Mint',
    image: '/Essence oil/Citrus mint.png',
    crystal: 'Citrine',
    note: 'Fresh & uplifting',
    color: 'bg-yellow-100/60 border-yellow-300/40',
    selectedColor: 'border-yellow-400 ring-yellow-300/30',
  },
  {
    name: 'Ocean Vetiver',
    image: '/Essence oil/Ocean Vetiver.png',
    crystal: 'Aquamarine',
    note: 'Calm & oceanic',
    color: 'bg-sky-100/60 border-sky-300/40',
    selectedColor: 'border-sky-400 ring-sky-300/30',
  },
  {
    name: 'Oud Wood',
    image: '/Essence oil/Oud Wood.png',
    crystal: 'Amethyst',
    note: 'Deep & mystical',
    color: 'bg-purple-100/60 border-purple-300/40',
    selectedColor: 'border-purple-400 ring-purple-300/30',
  },
  {
    name: 'White Musk',
    image: '/Essence oil/White Musk.png',
    crystal: 'Clear Quartz',
    note: 'Pure & clean',
    color: 'bg-gray-100/60 border-gray-300/40',
    selectedColor: 'border-gray-400 ring-gray-300/30',
  },
];

const MIN_STONES = 2;
const MAX_STONES = 3;

export default function GiftBoxPage() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [selectedStones, setSelectedStones] = useState<string[]>([]);
  const [selectedOil, setSelectedOil] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [soldOutStones, setSoldOutStones] = useState<string[]>([]);
  const [soldOutOils, setSoldOutOils] = useState<string[]>([]);

  // Fetch sold-out status from API
  useEffect(() => {
    fetch('/api/sold-out')
      .then((res) => res.json())
      .then((data) => {
        setSoldOutStones(data.soldOutStones || []);
        // Map product names to oil names (remove " Essence Oil" suffix)
        const oilNames = (data.soldOutProducts || []).map((name: string) =>
          name.replace(' Essence Oil', '')
        );
        setSoldOutOils(oilNames);
      })
      .catch(() => {
        // Silently fail - items will show as available
      });
  }, []);

  const stones = Object.entries(POWER_STONE_EFFECTS);

  const toggleStone = (name: string) => {
    if (soldOutStones.includes(name)) return;
    setSelectedStones((prev) => {
      if (prev.includes(name)) {
        return prev.filter((s) => s !== name);
      }
      if (prev.length >= MAX_STONES) {
        return prev;
      }
      return [...prev, name];
    });
  };

  const canAddToCart = selectedStones.length >= MIN_STONES && selectedOil !== null;

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    const stonesLabel = selectedStones.join(', ');
    const oilLabel = selectedOil || '';
    addItem({
      id: `crystal-essence-${stonesLabel}-${oilLabel}`.replace(/\s+/g, '-').toLowerCase(),
      slug: 'gift-box',
      name: `Crystal Essence Set (${stonesLabel} + ${oilLabel})`,
      price: 150,
      image: '/Crystal Essence/crystal-essence-product 1.png',
    });
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const handleReset = () => {
    setSelectedStones([]);
    setSelectedOil(null);
  };

  // Combined effects of selected stones
  const combinedEffects = Array.from(
    new Set(selectedStones.flatMap((name) => POWER_STONE_EFFECTS[name]?.effects || []))
  );

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img
          src="/gift-box-hero.jpg"
          alt="Crystal Essence Set with power stones and essential oils"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/55" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <Package size={36} className="text-white/90 mb-4 drop-shadow-lg" />
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 drop-shadow-lg">
            {t('giftBox.heroTitle')}
          </h1>
          <p className="font-sans text-white/80 text-sm md:text-base max-w-lg drop-shadow-md">
            {t('giftBox.heroDescription', { min: MIN_STONES, max: MAX_STONES })}
          </p>
        </div>
      </section>

      {/* Product Showcase Section */}
      <ProductShowcase />

      <div id="create-set" className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">

          {/* Left: Stone Selection */}
          <div className="lg:col-span-2">
            {/* Selection Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl text-dark mb-1">
                  {t('giftBox.selectStones')}
                </h2>
                <p className="font-sans text-warm text-sm">
                  {t('giftBox.chooseStones', { min: MIN_STONES, max: MAX_STONES })} ·{' '}
                  <span className={cn(
                    'font-medium',
                    selectedStones.length >= MIN_STONES ? 'text-gold-dark' : 'text-warm'
                  )}>
                    {t('giftBox.selected', { count: selectedStones.length })}
                  </span>
                </p>
              </div>
              {selectedStones.length > 0 && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs font-sans text-warm hover:text-dark transition-colors"
                >
                  <RotateCcw size={12} />
                  {t('giftBox.reset')}
                </button>
              )}
            </div>

            {/* Stone Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stones.map(([name, stone]) => {
                const isSelected = selectedStones.includes(name);
                const isSoldOut = soldOutStones.includes(name);
                const isMaxReached = selectedStones.length >= MAX_STONES && !isSelected;
                const isDisabled = isMaxReached || isSoldOut;

                return (
                  <button
                    key={name}
                    onClick={() => toggleStone(name)}
                    disabled={isDisabled}
                    className={cn(
                      'group relative rounded-2xl overflow-hidden border-2 transition-all duration-300 text-left',
                      isSelected
                        ? `${STONE_SELECTED_COLORS[name]} ring-4 shadow-lg`
                        : isSoldOut
                          ? 'border-gray-200 opacity-70 cursor-not-allowed'
                          : `border-stone-light/60 hover:border-stone/40 hover:shadow-md`,
                      isMaxReached && !isSoldOut && 'opacity-40 cursor-not-allowed'
                    )}
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={STONE_IMAGES[name]}
                        alt={name}
                        className={cn(
                          'w-full h-full object-cover transition-transform duration-500',
                          isSelected ? 'scale-105' : 'group-hover:scale-105',
                          isSoldOut && 'grayscale opacity-60'
                        )}
                      />
                      {/* Sold out overlay */}
                      {isSoldOut && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <span className="px-3 py-1.5 rounded-full bg-dark/80 text-cream text-[10px] font-sans font-medium tracking-wider backdrop-blur-sm">
                            {t('giftBox.soldOut')}
                          </span>
                        </div>
                      )}
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-dark/90 flex items-center justify-center">
                          <Check size={14} className="text-cream" />
                        </div>
                      )}
                      {/* Color overlay on hover */}
                      {!isSoldOut && (
                        <div className={cn(
                          'absolute inset-0 transition-opacity duration-300',
                          isSelected ? 'opacity-10' : 'opacity-0 group-hover:opacity-10',
                          STONE_COLORS[name]
                        )} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 md:p-4">
                      <h3 className={cn(
                        'font-serif text-sm md:text-base leading-tight mb-0.5',
                        isSoldOut ? 'text-gray-400' : 'text-dark'
                      )}>
                        {name}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {stone.effects.map((effect) => (
                          <span
                            key={effect}
                            className={cn(
                              'inline-block text-[9px] md:text-[10px] font-sans px-2 py-0.5 rounded-full transition-colors duration-300',
                              isSoldOut
                                ? 'bg-gray-100 text-gray-400'
                                : isSelected
                                  ? 'bg-gold/15 text-gold-dark'
                                  : 'bg-stone-light text-warm-light'
                            )}
                          >
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Essence Oil Selection */}
            <div className="mt-14">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl text-dark mb-1">
                    {t('giftBox.chooseOil')}
                  </h2>
                  <p className="font-sans text-warm text-sm">
                    {t('giftBox.selectFragrance')} ·{' '}
                    <span className={cn(
                      'font-medium',
                      selectedOil ? 'text-gold-dark' : 'text-warm'
                    )}>
                      {selectedOil ? selectedOil : t('giftBox.noneSelected')}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ESSENCE_OILS.map((oil) => {
                  const isSelected = selectedOil === oil.name;
                  const isSoldOut = soldOutOils.includes(oil.name);

                  return (
                    <button
                      key={oil.name}
                      onClick={() => {
                        if (isSoldOut) return;
                        setSelectedOil(isSelected ? null : oil.name);
                      }}
                      disabled={isSoldOut}
                      className={cn(
                        'group relative rounded-2xl overflow-hidden border-2 transition-all duration-300 text-left',
                        isSelected
                          ? `${oil.selectedColor} ring-4 shadow-lg`
                          : isSoldOut
                            ? 'border-gray-200 opacity-70 cursor-not-allowed'
                            : 'border-stone-light/60 hover:border-stone/40 hover:shadow-md'
                      )}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={oil.image}
                          alt={oil.name}
                          className={cn(
                            'w-full h-full object-cover transition-transform duration-500',
                            isSelected ? 'scale-105' : 'group-hover:scale-105',
                            isSoldOut && 'grayscale opacity-60'
                          )}
                        />
                        {isSoldOut && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <span className="px-3 py-1.5 rounded-full bg-dark/80 text-cream text-[10px] font-sans font-medium tracking-wider backdrop-blur-sm">
                              {t('giftBox.soldOut')}
                            </span>
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-dark/90 flex items-center justify-center">
                            <Check size={14} className="text-cream" />
                          </div>
                        )}
                      </div>

                      <div className="p-3 md:p-4">
                        <h3 className={cn(
                          'font-serif text-sm md:text-base leading-tight mb-0.5',
                          isSoldOut ? 'text-gray-400' : 'text-dark'
                        )}>
                          {oil.name}
                        </h3>
                        <p className={cn(
                          'text-[10px] font-sans',
                          isSoldOut ? 'text-gray-400' : 'text-warm-light'
                        )}>{oil.note}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Crystal Essence Set Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Box Preview */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-stone-light/60 overflow-hidden">
                {/* Glass Vessel Animation */}
                <div className="relative aspect-[4/3] bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f1a] overflow-hidden">
                  <GlassVessel selectedStones={selectedStones} selectedOil={selectedOil} />
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="inline-block text-[10px] font-sans px-2.5 py-1 rounded-full bg-dark/70 text-cream backdrop-blur-sm">
                      {selectedStones.length === 0
                        ? t('giftBox.selectStonesBelow')
                        : t('giftBox.stonesInVessel', { count: selectedStones.length })}
                    </span>
                  </div>
                </div>

                <div className="p-5 md:p-6">
                  <h3 className="font-serif text-xl text-dark mb-1">
                    {t('giftBox.yourSet')}
                  </h3>
                  <p className="text-xs font-sans text-warm-light mb-5">
                    {t('giftBox.setContents')}
                  </p>

                  {/* Selected Stones */}
                  <div className="mb-5">
                    <p className="text-[10px] font-sans text-warm-light uppercase tracking-wider mb-3">
                      {t('giftBox.selectedStones', { count: selectedStones.length, max: MAX_STONES })}
                    </p>
                    {selectedStones.length === 0 ? (
                      <div className="py-6 text-center">
                        <Sparkles size={20} className="mx-auto text-stone mb-2" />
                        <p className="text-xs font-sans text-warm-light">
                          {t('giftBox.chooseToBuild', { min: MIN_STONES, max: MAX_STONES })}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedStones.map((name) => (
                          <div
                            key={name}
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-cream/80 border border-stone-light/40"
                          >
                            <img
                              src={STONE_IMAGES[name]}
                              alt={name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-serif text-dark truncate">{name}</p>
                            </div>
                            <button
                              onClick={() => toggleStone(name)}
                              className="text-warm-light hover:text-dark transition-colors text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Oil */}
                  <div className="mb-5 pt-4 border-t border-stone-light/40">
                    <p className="text-[10px] font-sans text-warm-light uppercase tracking-wider mb-3">
                      {t('giftBox.essenceOil')}
                    </p>
                    {selectedOil ? (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-cream/80 border border-stone-light/40">
                        <img
                          src={ESSENCE_OILS.find((o) => o.name === selectedOil)?.image}
                          alt={selectedOil}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-serif text-dark truncate">{selectedOil}</p>
                          <p className="text-[10px] font-sans text-warm-light">
                            {ESSENCE_OILS.find((o) => o.name === selectedOil)?.note}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedOil(null)}
                          className="text-warm-light hover:text-dark transition-colors text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs font-sans text-warm-light text-center py-3">
                        {t('giftBox.chooseOilBelow')}
                      </p>
                    )}
                  </div>

                  {/* Combined Effects */}
                  {combinedEffects.length > 0 && (
                    <div className="mb-5 pt-4 border-t border-stone-light/40">
                      <p className="text-[10px] font-sans text-warm-light uppercase tracking-wider mb-2">
                        {t('giftBox.combinedEnergy')}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {combinedEffects.map((effect) => (
                          <span
                            key={effect}
                            className="inline-block text-[10px] font-sans px-2.5 py-1 rounded-full bg-gold/10 text-gold-dark"
                          >
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Includes */}
                  <div className="mb-6 pt-4 border-t border-stone-light/40">
                    <p className="text-[10px] font-sans text-warm-light uppercase tracking-wider mb-3">
                      {t('giftBox.setIncludes')}
                    </p>
                    <div className="space-y-2 text-xs font-sans text-warm">
                      <div className="flex items-center gap-2">
                        <span className="text-gold">✦</span>
                        <span>{t('giftBox.powerStones', { min: MIN_STONES, max: MAX_STONES })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gold">✦</span>
                        <span>{t('giftBox.purifyingOil')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gold">✦</span>
                        <span>{t('giftBox.glassVessel')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gold">✦</span>
                        <span>{t('giftBox.luxuryBox')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gold">✦</span>
                        <span>{t('giftBox.energyGuide')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="font-serif text-2xl text-dark">$150</span>
                      <span className="text-xs font-sans text-warm-light">{t('giftBox.taxIncluded')}</span>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={!canAddToCart}
                      className={cn(
                        'w-full flex items-center justify-center gap-2 py-4 rounded-full font-sans text-sm tracking-wider transition-all duration-300',
                        canAddToCart
                          ? 'bg-dark text-cream hover:bg-charcoal'
                          : 'bg-stone-light text-warm-light cursor-not-allowed'
                      )}
                    >
                      {showConfirmation ? (
                        <>
                          <Check size={16} />
                          {t('giftBox.addedToCart')}
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          {canAddToCart
                            ? t('giftBox.addToCart')
                            : selectedStones.length < MIN_STONES
                              ? t('giftBox.selectMoreStones', { count: MIN_STONES - selectedStones.length })
                              : t('giftBox.selectOil')
                          }
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Link to Soul Stone Discovery */}
              <Link
                href="/crystal-quiz"
                className="block p-4 rounded-xl bg-gradient-to-r from-dark/5 to-gold/5 border border-stone-light/40 hover:border-gold/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="text-gold flex-shrink-0" />
                  <div>
                    <p className="text-sm font-serif text-dark group-hover:text-gold transition-colors">
                      {t('giftBox.notSureStones')}
                    </p>
                    <p className="text-[11px] font-sans text-warm-light">
                      {t('giftBox.takeQuiz')}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function ProductShowcase() {
  const { t } = useLanguage();
  const [currentImage, setCurrentImage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % SHOWCASE_IMAGES.length);
  }, []);

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + SHOWCASE_IMAGES.length) % SHOWCASE_IMAGES.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextImage, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextImage]);

  const scrollToCreate = () => {
    document.getElementById('create-set')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: Image Carousel */}
          <div
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream shadow-lg">
              {SHOWCASE_IMAGES.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`Crystal Essence Set variation ${i + 1}`}
                  className={cn(
                    'absolute inset-0 w-full h-full object-cover transition-opacity duration-700',
                    i === currentImage ? 'opacity-100' : 'opacity-0'
                  )}
                />
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-md"
              >
                <ChevronLeft size={20} className="text-dark" />
              </button>
              <button
                onClick={() => { nextImage(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-md"
              >
                <ChevronRight size={20} className="text-dark" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {SHOWCASE_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    i === currentImage
                      ? 'bg-dark w-6'
                      : 'bg-stone-light hover:bg-stone'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            <p className="text-[11px] font-sans text-gold-dark uppercase tracking-[0.2em] mb-3">
              {t('giftBox.signatureCollection')}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-dark mb-4 leading-tight">
              {t('giftBox.crystalEssenceSet')}
            </h2>
            <p className="font-sans text-warm text-sm md:text-base leading-relaxed mb-8">
              {t('giftBox.productDescription')}
            </p>

            {/* What's Included */}
            <div className="space-y-3 mb-8">
              <p className="text-[10px] font-sans text-warm-light uppercase tracking-[0.15em]">
                {t('giftBox.eachSetIncludes')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: '◇', label: t('giftBox.stonesLabel'), desc: t('giftBox.stonesDesc') },
                  { icon: '◈', label: t('giftBox.oilLabel'), desc: t('giftBox.oilDesc') },
                  { icon: '○', label: t('giftBox.vesselLabel'), desc: t('giftBox.vesselDesc') },
                  { icon: '□', label: t('giftBox.boxLabel'), desc: t('giftBox.boxDesc') },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 p-3 rounded-xl bg-cream/60 border border-stone-light/30"
                  >
                    <span className="text-gold text-lg mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-sm font-serif text-dark">{item.label}</p>
                      <p className="text-[11px] font-sans text-warm-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center gap-6">
              <div>
                <span className="font-serif text-3xl text-dark">$150</span>
                <span className="text-xs font-sans text-warm-light ml-2">{t('giftBox.taxIncluded')}</span>
              </div>
              <button
                onClick={scrollToCreate}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-dark text-cream font-sans text-sm tracking-wider hover:bg-charcoal transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Sparkles size={16} />
                {t('giftBox.createYourSet')}
                <ChevronDown size={14} className="ml-1" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
