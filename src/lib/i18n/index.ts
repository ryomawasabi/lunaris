import en from './en.json'
import ja from './ja.json'
import ko from './ko.json'
import zh from './zh.json'

export type Locale = 'en' | 'ja' | 'ko' | 'zh'

export const locales: Locale[] = ['en', 'ja', 'ko', 'zh']

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
}

export const localeFlags: Record<Locale, string> = {
  en: 'EN',
  ja: 'JP',
  ko: 'KR',
  zh: 'CN',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translations: Record<Locale, any> = { en, ja, ko, zh }

/**
 * Get a nested translation value by dot-notation key.
 * e.g., getTranslation('ja', 'nav.shopAll') => '全商品'
 * Supports variable interpolation: {count}, {amount}, etc.
 */
export function getTranslation(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const keys = key.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = translations[locale]

  for (const k of keys) {
    if (value == null) break
    value = value[k]
  }

  // Fallback to English if key not found in target locale
  if (value == null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fallback: any = translations.en
    for (const k of keys) {
      if (fallback == null) break
      fallback = fallback[k]
    }
    value = fallback
  }

  if (typeof value !== 'string') return key

  // Interpolate variables
  if (vars) {
    for (const [varName, varValue] of Object.entries(vars)) {
      value = value.replace(new RegExp(`\\{${varName}\\}`, 'g'), String(varValue))
    }
  }

  return value
}

export default translations
