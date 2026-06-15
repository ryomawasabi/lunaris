'use client';

import PlaceholderImage from '@/components/layout/PlaceholderImage';
import { Button } from '@/components/ui/Button';
import { Sparkles, Shield, Gem, Moon, Star, Flame } from 'lucide-react';
import { FeaturedTeaser } from '@/components/home/FeaturedTeaser';
import { AnimatedHero } from '@/components/animations/AnimatedHero';
import LotusChakraMap from '@/components/home/LotusChakraMap';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { FloatingParticles } from '@/components/animations/FloatingParticles';
import { LotusPond } from '@/components/animations/LotusPond';
import { SectionDivider } from '@/components/animations/SectionDivider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { BaziHomeHero } from '@/components/bazi/BaziHomeHero';

export default function Home() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-cream">

      {/* Cinematic Hero */}
      <AnimatedHero />

      {/* Bazi quiz entry — prominent interactive hero CTA */}
      <BaziHomeHero />

      {/* Opening Statement */}
      <section className="py-20 md:py-32 px-4 bg-dark relative overflow-hidden">
        <FloatingParticles count={20} color="#5A8EAE" />
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full border border-gold/5" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full border border-gold/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold/[0.03]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <Moon className="w-8 h-8 text-gold mx-auto mb-8 opacity-60" />
            <h2 className="font-serif text-3xl md:text-5xl text-cream font-light leading-relaxed mb-8">
              {t('home.opening.quote')}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8" />
            <p className="font-sans text-base md:text-lg text-cream/60 leading-relaxed max-w-2xl mx-auto">
              {t('home.opening.description')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider variant="yinyang" />

      {/* Featured Products Teaser — No Prices */}
      <FeaturedTeaser />

      <SectionDivider variant="lotus" />

      {/* Brand Pillars */}
      <section className="py-20 md:py-28 px-4 bg-stone-light/50 texture-noise-light">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold mb-4">{t('home.wayOfBalance.label')}</p>
              <h2 className="font-serif text-3xl md:text-5xl text-dark font-light">{t('home.wayOfBalance.title')}</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Sparkles,
                title: t('home.yinEnergy.title'),
                subtitle: t('home.yinEnergy.subtitle'),
                description: t('home.yinEnergy.description'),
              },
              {
                icon: Shield,
                title: t('home.yangEnergy.title'),
                subtitle: t('home.yangEnergy.subtitle'),
                description: t('home.yangEnergy.description'),
              },
              {
                icon: Flame,
                title: t('home.chakraHarmony.title'),
                subtitle: t('home.chakraHarmony.subtitle'),
                description: t('home.chakraHarmony.description'),
              },
            ].map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <ScrollReveal key={index} delay={index * 0.15} direction={index === 0 ? 'left' : index === 2 ? 'right' : 'up'}>
                  <div
                    className="group relative bg-white border border-stone-light rounded-2xl p-8 md:p-10 hover:border-gold/40 hover:shadow-xl hover:shadow-gold/5 transition-all duration-500 h-full"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/10 to-mystic-aura/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-gold mb-2">{pillar.subtitle}</p>
                    <h3 className="font-serif text-2xl text-dark mb-4">{pillar.title}</h3>
                    <p className="font-sans text-sm text-warm leading-relaxed">{pillar.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider variant="dots" />

      {/* Soul Stone Discovery CTA */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Dark celestial background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060e1a] via-[#0f1f3a] to-[#060e1a]" />

        {/* Animated background stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: i % 5 === 0 ? 2 : 1,
                height: i % 5 === 0 ? 2 : 1,
                left: `${(i * 17 + 7) % 100}%`,
                top: `${(i * 31 + 13) % 100}%`,
                opacity: 0.15 + (i % 8) * 0.05,
                animation: `twinkle ${3 + (i % 4)}s ease-in-out ${(i % 7) * 0.5}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Zodiac orbit — centered wrapper keeps everything aligned */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Outer static ring */}
          <div className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full border border-[#5A8EAE]/10 opacity-40" />

          {/* Inner static ring */}
          <div className="absolute w-[260px] h-[260px] md:w-[380px] md:h-[380px] rounded-full border border-[#5A8EAE]/8 opacity-30" />

          {/* Rotating zodiac symbols on SVG circle path */}
          <svg className="absolute w-[380px] h-[380px] md:w-[550px] md:h-[550px]" viewBox="0 0 550 550" style={{ animation: 'spin 90s linear infinite' }}>
            {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((symbol, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const cx = 275;
              const cy = 275;
              const r = 245;
              const x = cx + r * Math.cos(angle);
              const y = cy + r * Math.sin(angle);
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={`rgba(139,184,214,${0.3 + (i % 3) * 0.1})`}
                  fontSize="22"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(90,142,174,0.3))' }}
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${x} ${y}`}
                    to={`-360 ${x} ${y}`}
                    dur="90s"
                    repeatCount="indefinite"
                  />
                  {symbol}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <ScrollReveal>
            <h2 className="font-serif text-4xl md:text-6xl text-white font-light leading-tight mb-6" style={{ textShadow: '0 2px 20px rgba(90,142,174,0.3)' }}>
              {t('home.soulStone.title')}
            </h2>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#5A8EAE] to-transparent mx-auto mb-6" />
            <p className="font-sans text-base md:text-lg text-[#8BB8D6]/70 leading-relaxed max-w-xl mx-auto mb-10">
              {t('home.soulStone.description')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <a
              href="/crystal-quiz"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-full border border-[#5A8EAE]/40 bg-[#5A8EAE]/10 text-white font-sans text-sm tracking-wider hover:bg-[#5A8EAE]/20 hover:border-[#5A8EAE]/60 transition-all duration-500 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-[#8BB8D6] group-hover:scale-110 transition-transform" />
              {t('home.soulStone.cta')}
              <span className="text-[#8BB8D6]/60 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </a>
            <p className="font-sans text-xs text-[#5A8EAE]/40 mt-6 tracking-wider">
              {t('home.soulStone.free')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Chakra Map — Lotus Mandala */}
      <LotusChakraMap />

      {/* Split Image + Story */}
      <section className="py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          <div className="relative h-80 lg:h-auto overflow-hidden">
            <PlaceholderImage
              width="w-full"
              height="h-full"
              text="Artisan Crafting"
              className="absolute inset-0"
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900&h=1000&fit=crop&q=80"
              alt="Artisan crafting sacred jewelry"
            />
          </div>
          <div className="bg-dark relative flex items-center px-8 md:px-16 lg:px-20 py-16 lg:py-0 overflow-hidden">
            <FloatingParticles count={12} color="#5A8EAE" />
            <div className="max-w-lg relative z-10">
              <ScrollReveal direction="right">
                <div className="flex items-center gap-3 mb-6">
                  <Gem className="w-5 h-5 text-mystic-star" />
                  <p className="font-sans text-xs uppercase tracking-[0.25em] text-mystic-star">{t('home.alchemy.label')}</p>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-cream font-light leading-snug mb-6">
                  {t('home.alchemy.title')}
                </h2>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={0.2}>
                <div className="space-y-5 text-cream/60 font-sans text-sm leading-relaxed">
                  <p>
                    {t('home.alchemy.desc1')}
                  </p>
                  <p>
                    {t('home.alchemy.desc2')}
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={0.35}>
                <div className="mt-8 flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-serif text-3xl text-gold">100+</p>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-cream/40 mt-1">{t('home.alchemy.crystalVarieties')}</p>
                  </div>
                  <div className="w-px h-10 bg-cream/10" />
                  <div className="text-center">
                    <p className="font-serif text-3xl text-gold">48h</p>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-cream/40 mt-1">{t('home.alchemy.balancingTime')}</p>
                  </div>
                  <div className="w-px h-10 bg-cream/10" />
                  <div className="text-center">
                    <p className="font-serif text-3xl text-gold">7</p>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-cream/40 mt-1">{t('home.alchemy.chakraPoints')}</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Quote — Lotus Pond */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden bg-[#0a1e30]">
        <LotusPond />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <div className="flex items-center justify-center gap-2 mb-8">
              <Star className="w-3 h-3 text-mystic-star" />
              <Star className="w-4 h-4 text-mystic-star" />
              <Star className="w-3 h-3 text-mystic-star" />
            </div>
            <blockquote className="font-serif text-2xl md:text-4xl lg:text-5xl text-cream font-light leading-relaxed italic">
              &ldquo;{t('home.wisdom.quote')}&rdquo;
            </blockquote>
            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="h-px w-8 bg-gold/40" />
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold">
                {t('home.wisdom.label')}
              </p>
              <div className="h-px w-8 bg-gold/40" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-cream to-stone-light texture-rich">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center">
            <Sparkles className="w-6 h-6 text-gold mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl text-dark font-light mb-6">
              {t('home.findBalance.title')}
            </h2>
            <p className="font-sans text-base text-warm leading-relaxed mb-10">
              {t('home.findBalance.description')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/products" variant="primary" size="lg">
                {t('home.findBalance.exploreCollections')}
              </Button>
              <Button href="/gifts" variant="secondary" size="lg">
                {t('home.findBalance.giftBalance')}
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </main>
  );
}
