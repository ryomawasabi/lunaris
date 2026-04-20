'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Locale, locales, localeNames, localeFlags } from '@/lib/i18n'

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark'
}

export default function LanguageSwitcher({ variant = 'light' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isDark = variant === 'dark'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 transition-colors ${
          isDark
            ? 'text-cream/70 hover:text-cream'
            : 'text-dark/70 hover:text-dark'
        }`}
        aria-label="Language"
      >
        <Globe size={18} />
        <span className="text-xs font-sans uppercase tracking-wider">{localeFlags[locale]}</span>
      </button>

      {open && (
        <div className={`absolute right-0 top-full mt-2 backdrop-blur-sm border rounded-lg shadow-xl py-1 min-w-[140px] z-50 ${
          isDark
            ? 'bg-dark/95 border-cream/10'
            : 'bg-cream/95 border-stone-light'
        }`}>
          {locales.map((l: Locale) => (
            <button
              key={l}
              onClick={() => { setLocale(l); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm font-sans flex items-center justify-between transition-colors ${
                isDark
                  ? (l === locale ? 'text-gold bg-cream/5' : 'text-cream/70 hover:text-cream hover:bg-cream/5')
                  : (l === locale ? 'text-gold bg-dark/5' : 'text-dark/70 hover:text-dark hover:bg-dark/5')
              }`}
            >
              <span>{localeNames[l]}</span>
              <span className="text-xs opacity-50">{localeFlags[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
