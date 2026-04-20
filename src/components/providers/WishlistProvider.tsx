'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'

interface WishlistContextType {
  wishlist: string[]
  toggleWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  wishlistCount: number
  isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

const WISHLIST_STORAGE_KEY = 'yyg_wishlist'

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const { user } = useAuth()

  // Load wishlist on mount and when user changes
  useEffect(() => {
    const initializeWishlist = async () => {
      setIsLoading(true)

      if (user) {
        // User is logged in: fetch from server
        try {
          const response = await fetch('/api/wishlist')
          if (response.ok) {
            const { wishlist: serverWishlist } = await response.json()

            // Check if there's a localStorage wishlist to merge
            const localWishlist = getLocalWishlist()

            if (localWishlist.length > 0) {
              // Merge: add items from localStorage that aren't in server wishlist
              const merged = new Set([...serverWishlist, ...localWishlist])
              const itemsToAdd = Array.from(merged).filter((id) => !serverWishlist.includes(id))

              // Add merged items to server
              for (const productId of itemsToAdd) {
                try {
                  await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product_id: productId }),
                  })
                } catch (error) {
                  console.error(`Failed to add ${productId} to server wishlist:`, error)
                }
              }

              // Clear localStorage after merge
              clearLocalWishlist()

              // Use merged wishlist
              setWishlist(Array.from(merged))
            } else {
              // No localStorage items, use server wishlist
              setWishlist(serverWishlist)
            }
          }
        } catch (error) {
          console.error('Failed to fetch wishlist:', error)
          // Fall back to localStorage
          setWishlist(getLocalWishlist())
        }
      } else {
        // User is not logged in: use localStorage
        setWishlist(getLocalWishlist())
      }

      setHasInitialized(true)
      setIsLoading(false)
    }

    if (!hasInitialized) {
      initializeWishlist()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, hasInitialized])

  // Persist to localStorage when user is not logged in
  useEffect(() => {
    if (hasInitialized && !user) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist))
      } catch (e) {
        console.error('Failed to save wishlist to localStorage:', e)
      }
    }
  }, [wishlist, hasInitialized, user])

  const getLocalWishlist = useCallback((): string[] => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      console.error('Failed to load wishlist from localStorage:', e)
      return []
    }
  }, [])

  const clearLocalWishlist = useCallback(() => {
    try {
      localStorage.removeItem(WISHLIST_STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear wishlist from localStorage:', e)
    }
  }, [])

  const toggleWishlist = useCallback(
    async (productId: string) => {
      const isCurrentlyInWishlist = wishlist.includes(productId)

      if (user) {
        // User is logged in: use API
        try {
          if (isCurrentlyInWishlist) {
            // Remove from wishlist
            const response = await fetch('/api/wishlist', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ product_id: productId }),
            })

            if (response.ok) {
              setWishlist((prev) => prev.filter((id) => id !== productId))
            }
          } else {
            // Add to wishlist
            const response = await fetch('/api/wishlist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ product_id: productId }),
            })

            if (response.ok) {
              setWishlist((prev) => [...prev, productId])
            }
          }
        } catch (error) {
          console.error('Failed to toggle wishlist:', error)
        }
      } else {
        // User is not logged in: use localStorage
        if (isCurrentlyInWishlist) {
          setWishlist((prev) => prev.filter((id) => id !== productId))
        } else {
          setWishlist((prev) => [...prev, productId])
        }
      }
    },
    [wishlist, user]
  )

  const isInWishlist = useCallback(
    (productId: string): boolean => {
      return wishlist.includes(productId)
    },
    [wishlist]
  )

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
