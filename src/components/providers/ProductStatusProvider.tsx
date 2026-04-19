'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Product, Category, Collection } from '@/lib/types'
import { PRODUCTS as FALLBACK_PRODUCTS, CATEGORIES as FALLBACK_CATEGORIES, COLLECTIONS as FALLBACK_COLLECTIONS } from '@/lib/data'

interface ProductStatus {
  isHidden: boolean
  isSoldOut: boolean
}

interface ProductStatusContextType {
  products: Product[]
  categories: Category[]
  collections: Collection[]
  loading: boolean
  getStatus: (productId: string) => ProductStatus
  toggleHidden: (productId: string) => void
  toggleSoldOut: (productId: string) => void
  deleteProduct: (productId: string) => void
  addProduct: (product: Product) => void
}

const ProductStatusContext = createContext<ProductStatusContextType | null>(null)

export function useProductStatus() {
  const context = useContext(ProductStatusContext)
  if (!context) {
    throw new Error('useProductStatus must be used within a ProductStatusProvider')
  }
  return context
}

// Safe hook that returns null if outside provider (for public pages that may not have provider)
export function useProductStatusSafe() {
  return useContext(ProductStatusContext)
}

export function ProductStatusProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS)
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES)
  const [collections, setCollections] = useState<Collection[]>(FALLBACK_COLLECTIONS)
  const [loading, setLoading] = useState(true)

  // Fetch products, categories, and collections from Supabase via API
  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((res) => res.json()),
      fetch('/api/categories').then((res) => res.json()),
      fetch('/api/collections').then((res) => res.json()),
    ])
      .then(([productsData, categoriesData, collectionsData]) => {
        if (productsData.products && productsData.products.length > 0) {
          setProducts(productsData.products)
        }
        if (categoriesData.categories && categoriesData.categories.length > 0) {
          setCategories(categoriesData.categories)
        }
        if (collectionsData.collections && collectionsData.collections.length > 0) {
          setCollections(collectionsData.collections)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch data from API:', err)
        // Keep fallback data on error
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const getStatus = useCallback((productId: string): ProductStatus => {
    const product = products.find((p) => p.id === productId)
    return {
      isHidden: product?.isHidden || false,
      isSoldOut: product?.isSoldOut || false,
    }
  }, [products])

  // These methods are kept for backward compatibility but now status comes from DB
  const toggleHidden = useCallback((productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isHidden: !p.isHidden } : p
      )
    )
  }, [])

  const toggleSoldOut = useCallback((productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isSoldOut: !p.isSoldOut } : p
      )
    )
  }, [])

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }, [])

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [product, ...prev])
  }, [])

  return (
    <ProductStatusContext.Provider value={{ products, categories, collections, loading, getStatus, toggleHidden, toggleSoldOut, deleteProduct, addProduct }}>
      {children}
    </ProductStatusContext.Provider>
  )
}
