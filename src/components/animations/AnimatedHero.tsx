'use client'

import { motion } from 'framer-motion'
import YinYangNav from '@/components/layout/YinYangNav'
import { useLanguage } from '@/components/providers/LanguageProvider'

export function AnimatedHero() {
  const { t } = useLanguage()
  return (
    <section className="relative min-h-[70vh] md:min-h-[85vh] overflow-hidden bg-cream flex flex-col items-center justify-center px-4">
      {/* Subtle radial glow behind the yin-yang */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(90,142,174,0.06) 0%, transparent 70%)' }}
      />

      {/* Brand name */}
      <motion.p
        className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-gold mb-6 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        YINYANG GUARDIAN
      </motion.p>

      {/* Tagline */}
      <motion.p
        className="font-serif text-lg md:text-xl text-warm text-center mb-10 max-w-xl italic relative z-10"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {t('heroAnim.tagline')}
      </motion.p>

      {/* Yin-Yang Navigation */}
      <motion.div
        className="relative z-10 hidden md:flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
      >
        <YinYangNav />
      </motion.div>

      {/* Mobile: simple CTA instead of yin-yang */}
      <motion.div
        className="md:hidden flex items-center gap-3 mt-4 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="h-px w-8 bg-stone" />
        <span className="text-gold text-lg">&#10022;</span>
        <div className="h-px w-8 bg-stone" />
      </motion.div>

      {/* Hint text */}
      <motion.p
        className="hidden md:block font-sans text-xs text-warm/50 mt-8 tracking-widest uppercase relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        {t('heroAnim.hoverHint')}
      </motion.p>
    </section>
  )
}
