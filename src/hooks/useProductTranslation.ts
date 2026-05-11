'use client'

import { useCallback } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { productTranslations } from '@/lib/i18n/product-translations'
import { Product } from '@/lib/types'
import { Locale } from '@/lib/i18n'

/**
 * Hook that provides translation functions for product data.
 * Returns the original English value when locale is 'en' or translation is missing.
 */
export function useProductTranslation() {
  const { locale } = useLanguage()

  const getTransData = useCallback(() => {
    if (locale === 'en') return null
    return productTranslations[locale as Exclude<Locale, 'en'>] ?? null
  }, [locale])

  /** Translate a full product object — returns a new object with translated fields */
  const translateProduct = useCallback(
    (product: Product): Product => {
      const data = getTransData()
      if (!data) return product

      const t = data.products[product.slug]
      return {
        ...product,
        name: t?.name ?? product.name,
        shortDescription: t?.shortDescription ?? product.shortDescription,
        longDescription: t?.longDescription ?? product.longDescription,
        symbolicMeaning: t?.symbolicMeaning ?? product.symbolicMeaning,
        gemstone: data.gemstones[product.gemstone] ?? product.gemstone,
        crystalType: data.gemstones[product.crystalType] ?? product.crystalType,
        category: data.categories[product.category] ?? product.category,
        collection: product.collection.map(
          (c) => data.collections[c] ?? c
        ),
        crystalEffects: product.crystalEffects.map(
          (e) => data.crystalEffects[e] ?? e
        ),
        materials: product.materials.map(
          (m) => data.materials[m] ?? m
        ),
      }
    },
    [getTransData]
  )

  /** Translate a category name */
  const translateCategory = useCallback(
    (name: string): string => {
      const data = getTransData()
      if (!data) return name
      return data.categories[name] ?? name
    },
    [getTransData]
  )

  /** Translate a collection name */
  const translateCollection = useCallback(
    (name: string): string => {
      const data = getTransData()
      if (!data) return name
      return data.collections[name] ?? name
    },
    [getTransData]
  )

  /** Translate a gemstone name */
  const translateGemstone = useCallback(
    (name: string): string => {
      const data = getTransData()
      if (!data) return name
      return data.gemstones[name] ?? name
    },
    [getTransData]
  )

  return {
    translateProduct,
    translateCategory,
    translateCollection,
    translateGemstone,
    locale,
  }
}
