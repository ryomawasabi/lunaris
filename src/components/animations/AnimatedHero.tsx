'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star } from 'lucide-react'
import PlaceholderImage from '@/components/layout/PlaceholderImage'

gsap.registerPlugin(ScrollTrigger)

const title = 'Our Story'

const charVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.6 + i * 0.07,
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  }),
}

export function AnimatedHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  // GSAP parallax on the background image
  useGSAP(() => {
    if (!imageRef.current || !sectionRef.current) return

    gsap.to(imageRef.current, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      {/* Parallax background image */}
      <div ref={imageRef} className="absolute inset-0 will-change-transform" style={{ top: '-10%', height: '120%' }}>
        <PlaceholderImage
          width="w-full"
          height="h-full"
          text="YINYANG GUARDIAN"
          className="absolute inset-0"
          src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=1800&h=1000&fit=crop&q=80"
          alt="Sacred Jewelry Craftsmanship"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark/80" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        {/* Decorative line */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="h-px w-12 bg-mystic-star" />
          <Star className="w-4 h-4 text-mystic-star" />
          <div className="h-px w-12 bg-mystic-star" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-mystic-star mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Est. 2024 &mdash; Sacred Adornment
        </motion.p>

        {/* Title — character-by-character reveal */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream text-center font-light leading-tight">
          {title.split('').map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={charVariants}
              initial="hidden"
              animate="visible"
              className="inline-block"
              style={char === ' ' ? { width: '0.3em' } : undefined}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>

        {/* Tagline */}
        <motion.p
          className="font-serif text-lg md:text-xl text-cream/70 text-center mt-6 max-w-xl italic"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          Where ancient wisdom meets modern mysticism
        </motion.p>

        {/* Decorative star */}
        <motion.div
          className="flex items-center gap-3 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <div className="h-px w-8 bg-cream/30" />
          <span className="text-mystic-star text-lg">&#10022;</span>
          <div className="h-px w-8 bg-cream/30" />
        </motion.div>
      </div>
    </section>
  )
}
