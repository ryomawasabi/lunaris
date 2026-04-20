'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { X, Search as SearchIcon, Loader } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/components/providers/LanguageProvider'

interface Product {
  id: string
  slug: string
  name: string
  price: number
  images: string[]
  category: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout>()

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length === 0) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data.products || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleQueryChange = (value: string) => {
    setQuery(value)

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      performSearch(value)
    }, 300)
  }

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-dark/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with input */}
        <div className="bg-white pt-8 px-6">
          <div className="flex items-center gap-4 mb-6">
            {/* Close button */}
            <button
              onClick={onClose}
              className="text-dark hover:text-warm transition-colors"
              aria-label="Close search"
            >
              <X size={24} />
            </button>

            {/* Search input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder={t('search.placeholder')}
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="w-full px-6 py-4 border-b border-stone-light font-sans text-lg text-dark bg-white focus:outline-none focus:border-gold transition-colors"
              />
              {loading && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <Loader size={20} className="text-gold animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Results divider */}
          {(results.length > 0 || (query && !loading)) && (
            <div className="h-px bg-stone-light mb-4"></div>
          )}
        </div>

        {/* Results section */}
        <div className="bg-white px-6 pb-8 max-h-[70vh] overflow-y-auto">
          {query && results.length === 0 && !loading && (
            <div className="py-12 text-center">
              <p className="font-sans text-sm text-warm">{t('search.noResults', { query })}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                >
                  <div className="group cursor-pointer hover:shadow-lg transition-shadow rounded-lg overflow-hidden bg-white border border-stone-light">
                    {/* Product image */}
                    <div className="relative w-full aspect-square bg-stone-light overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <SearchIcon size={32} className="text-stone" />
                        </div>
                      )}
                    </div>

                    {/* Product info */}
                    <div className="p-4">
                      <h3 className="font-sans text-sm font-medium text-dark line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-sm text-warm font-medium">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="font-sans text-xs text-stone">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!query && (
            <div className="py-12 text-center">
              <p className="font-sans text-sm text-warm">{t('search.startTyping')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
