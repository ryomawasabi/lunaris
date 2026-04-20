'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Locale, getTranslation } from '@/lib/i18n'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

const STORAGE_KEY = 'yyg-locale'

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Safe hook for components that may be outside provider
export function useLanguageSafe() {
  return useContext(LanguageContext)
}

function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en'
  const lang = navigator.language.toLowerCase()
  if (lang.startsWith('ja')) return 'ja'
  if (lang.startsWith('ko')) return 'ko'
  if (lang.startsWith('zh')) return 'zh'
  return 'en'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)

  // Load saved locale or detect from browser on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
      if (saved && ['en', 'ja', 'ko', 'zh'].includes(saved)) {
        setLocaleState(saved)
      } else {
        const detected = detectBrowserLocale()
        setLocaleState(detected)
      }
    } catch {
      // localStorage not available
    }
    setMounted(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem(STORAGE_KEY, newLocale)
    } catch {
      // localStorage not available
    }
  }, [])

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      return getTranslation(locale, key, vars)
    },
    [locale]
  )

  // Prevent hydration mismatch by rendering English on server
  const contextValue = {
    locale: mounted ? locale : 'en' as Locale,
    setLocale,
    t: mounted ? t : (key: string, vars?: Record<string, string | number>) => getTranslation('en', key, vars),
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}
