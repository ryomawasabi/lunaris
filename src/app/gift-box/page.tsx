'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { POWER_STONE_EFFECTS } from '@/lib/zodiac';
import { Check, Package, Sparkles, RotateCcw, ShoppingBag, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassVessel from '@/components/gift-box/GlassVessel';

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
  const [selectedStones, setSelectedStones] = useState<string[]>([]);
  const [selectedOil, setSelectedOil] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const stones = Object.entries(POWER_STONE_EFFECTS);

  const toggleStone = (name: string) => {
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
            Create Your Crystal Essence Set
          </h1>
          <p className="font-sans text-white/80 text-sm md:text-base max-w-lg drop-shadow-md">
            Choose {MIN_STONES}–{MAX_STONES} power stones to create your personalized Crystal Essence Set with essential oil and glass vessel.
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
                  Select Your Stones
                </h2>
                <p className="font-sans text-warm text-sm">
                  Choose {MIN_STONES}–{MAX_STONES} stones for your set ·{' '}
                  <span className={cn(
                    'font-medium',
                    selectedStones.length >= MIN_STONES ? 'text-gold-dark' : 'text-warm'
                  )}>
                    {selectedStones.length} selected
                  </span>
                </p>
              </div>
              {selectedStones.length > 0 && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs font-sans text-warm hover:text-dark transition-colors"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              )}
            </div>

            {/* Stone Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stones.map(([name, stone]) => {
                const isSelected = selectedStones.includes(name);
                const isMaxReached = selectedStones.length >= MAX_STONES && !isSelected;

                return (
                  <button
                    key={name}
                    onClick={() => toggleStone(name)}
                    disabled={isMaxReached}
                    className={cn(
                      'group relative rounded-2xl overflow-hidden border-2 transition-all duration-300 text-left',
                      isSelected
                        ? `${STONE_SELECTED_COLORS[name]} ring-4 shadow-lg`
                        : `border-stone-light/60 hover:border-stone/40 hover:shadow-md`,
                      isMaxReached && 'opacity-40 cursor-not-allowed'
                    )}
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={STONE_IMAGES[name]}
                        alt={name}
                        className={cn(
                          'w-full h-full object-cover transition-transform duration-500',
                          isSelected ? 'scale-105' : 'group-hover:scale-105'
                        )}
                      />
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-dark/90 flex items-center justify-center">
                          <Check size={14} className="text-cream" />
                        </div>
                      )}
                      {/* Color overlay on hover */}
                      <div className={cn(
                        'absolute inset-0 transition-opacity duration-300',
                        isSelected ? 'opacity-10' : 'opacity-0 group-hover:opacity-10',
                        STONE_COLORS[name]
                      )} />
                    </div>

                    {/* Info */}
                    <div className="p-3 md:p-4">
                      <h3 className="font-serif text-sm md:text-base text-dark leading-tight mb-0.5">
                        {name}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {stone.effects.map((effect) => (
                          <span
                            key={effect}
                            className={cn(
                              'inline-block text-[9px] md:text-[10px] font-sans px-2 py-0.5 rounded-full transition-colors duration-300',
                              isSelected
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
                    Choose Your Essence Oil
                  </h2>
                  <p className="font-sans text-warm text-sm">
                    Select 1 fragrance for your set ·{' '}
                    <span className={cn(
                      'font-medium',
                      selectedOil ? 'text-gold-dark' : 'text-warm'
                    )}>
                      {selectedOil ? selectedOil : 'None selected'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ESSENCE_OILS.map((oil) => {
                  const isSelected = selectedOil === oil.name;

                  return (
                    <button
                      key={oil.name}
                      onClick={() => setSelectedOil(isSelected ? null : oil.name)}
                      className={cn(
                        'group relative rounded-2xl overflow-hidden border-2 transition-all duration-300 text-left',
                        isSelected
                          ? `${oil.selectedColor} ring-4 shadow-lg`
                          : 'border-stone-light/60 hover:border-stone/40 hover:shadow-md'
                      )}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={oil.image}
                          alt={oil.name}
                          className={cn(
                            'w-full h-full object-cover transition-transform duration-500',
                            isSelected ? 'scale-105' : 'group-hover:scale-105'
                          )}
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-dark/90 flex items-center justify-center">
                            <Check size={14} className="text-cream" />
                          </div>
                        )}
                      </div>

                      <div className="p-3 md:p-4">
                        <h3 className="font-serif text-sm md:text-base text-dark leading-tight mb-0.5">
                          {oil.name}
                        </h3>
                        <p className="text-[10px] font-sans text-warm-light mb-1.5">{oil.note}</p>
                        <span
                          className={cn(
                            'inline-block text-[9px] md:text-[10px] font-sans px-2 py-0.5 rounded-full transition-colors duration-300',
                            isSelected
                              ? 'bg-gold/15 text-gold-dark'
                              : 'bg-stone-light text-warm-light'
                          )}
                        >
                          {oil.crystal}
                        </span>
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
                  <GlassVessel selectedStones={selectedStones} />
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="inline-block text-[10px] font-sans px-2.5 py-1 rounded-full bg-dark/70 text-cream backdrop-blur-sm">
                      {selectedStones.length === 0
                        ? 'Select stones below'
                        : `${selectedStones.length} stone${selectedStones.length > 1 ? 's' : ''} in vessel`}
                    </span>
                  </div>
                </div>

                <div className="p-5 md:p-6">
                  <h3 className="font-serif text-xl text-dark mb-1">
                    Your Crystal Essence Set
                  </h3>
                  <p className="text-xs font-sans text-warm-light mb-5">
                    Power stones + Essential oil + Glass vessel
                  </p>

                  {/* Selected Stones */}
                  <div className="mb-5">
                    <p className="text-[10px] font-sans text-warm-light uppercase tracking-wider mb-3">
                      Selected Stones ({selectedStones.length}/{MAX_STONES})
                    </p>
                    {selectedStones.length === 0 ? (
                      <div className="py-6 text-center">
                        <Sparkles size={20} className="mx-auto text-stone mb-2" />
                        <p className="text-xs font-sans text-warm-light">
                          Choose {MIN_STONES}–{MAX_STONES} stones to<br />build your set
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
                      Essence Oil
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
                        Choose an essence oil below
                      </p>
                    )}
                  </div>

                  {/* Combined Effects */}
                  {combinedEffects.length > 0 && (
                    <div className="mb-5 pt-4 border-t border-stone-light/40">
                      <p className="text-[10px] font-sans text-warm-light uppercase tracking-wider mb-2">
                        Combined Energy
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
                      Set Includes
                    </p>
                    <div className="space-y-2 text-xs font-sans text-warm">
                      <div className="flex items-center gap-2">
                        <span className="text-gold">✦</span>
                        <span>{MIN_STONES}–{MAX_STONES} selected power stones</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gold">✦</span>
                        <span>Purifying essential oil</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gold">✦</span>
                        <span>Glass display vessel</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gold">✦</span>
                        <span>Luxury box with sponge cushion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gold">✦</span>
                        <span>Crystal energy guide card</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="font-serif text-2xl text-dark">¥4,980</span>
                      <span className="text-xs font-sans text-warm-light">Tax included</span>
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
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          {canAddToCart
                            ? 'Add to Cart'
                            : selectedStones.length < MIN_STONES
                              ? `Select ${MIN_STONES - selectedStones.length} more stone${MIN_STONES - selectedStones.length > 1 ? 's' : ''}`
                              : 'Select an essence oil'
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
                      Not sure which stones?
                    </p>
                    <p className="text-[11px] font-sans text-warm-light">
                      Take the Soul Stone Discovery quiz →
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
              Signature Collection
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-dark mb-4 leading-tight">
              Crystal Essence Set
            </h2>
            <p className="font-sans text-warm text-sm md:text-base leading-relaxed mb-8">
              A luxurious set featuring hand-selected power stones, a crystal-charged
              essential oil, and a glass display vessel — all presented in a premium
              gift box with a protective sponge cushion. Choose your own combination
              of stones to create a set that resonates with your unique energy.
            </p>

            {/* What's Included */}
            <div className="space-y-3 mb-8">
              <p className="text-[10px] font-sans text-warm-light uppercase tracking-[0.15em]">
                Each Set Includes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: '◇', label: '2–3 Power Stones', desc: 'Hand-selected natural crystals' },
                  { icon: '◈', label: 'Essence Oil', desc: 'Crystal-charged aromatherapy blend' },
                  { icon: '○', label: 'Glass Vessel', desc: 'Display vessel for your stones' },
                  { icon: '□', label: 'Premium Gift Box', desc: 'Luxury box with sponge cushion' },
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
                <span className="font-serif text-3xl text-dark">¥4,980</span>
                <span className="text-xs font-sans text-warm-light ml-2">Tax included</span>
              </div>
              <button
                onClick={scrollToCreate}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-dark text-cream font-sans text-sm tracking-wider hover:bg-charcoal transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Sparkles size={16} />
                Create Your Set
                <ChevronDown size={14} className="ml-1" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
