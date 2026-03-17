'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Product } from '@/lib/types'
import { PRODUCTS as INITIAL_PRODUCTS } from '@/lib/data'

interface ProductStatus {
  isHidden: boolean
  isSoldOut: boolean
}

interface ProductStatusContextType {
  products: Product[]
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
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [statuses, setStatuses] = useState<Record<string, ProductStatus>>({})

  const getStatus = useCallback((productId: string): ProductStatus => {
    return statuses[productId] || { isHidden: false, isSoldOut: false }
  }, [statuses])

  const toggleHidden = useCallback((productId: string) => {
    setStatuses(prev => {
      const current = prev[productId] || { isHidden: false, isSoldOut: false }
      return {
        ...prev,
        [productId]: { ...current, isHidden: !current.isHidden }
      }
    })
  }, [])

  const toggleSoldOut = useCallback((productId: string) => {
    setStatuses(prev => {
      const current = prev[productId] || { isHidden: false, isSoldOut: false }
      return {
        ...prev,
        [productId]: { ...current, isSoldOut: !current.isSoldOut }
      }
    })
  }, [])

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
    setStatuses(prev => {
      const next = { ...prev }
      delete next[productId]
      return next
    })
  }, [])

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [product, ...prev])
  }, [])

  return (
    <ProductStatusContext.Provider value={{ products, getStatus, toggleHidden, toggleSoldOut, deleteProduct, addProduct }}>
      {children}
    </ProductStatusContext.Provider>
  )
}
