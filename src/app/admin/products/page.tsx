'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Eye, EyeOff, Trash2, Pencil, RefreshCw, AlertCircle, Ban, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAdminProducts } from '@/lib/supabase/admin-actions'

interface DbProduct {
  id: string
  slug: string
  name: string
  price: number
  compare_at_price: number | null
  category: string
  collection: string[]
  gemstone: string
  images: string[]
  is_active: boolean
  is_sold_out: boolean
  is_best_seller: boolean
  is_new: boolean
  rating: number
  review_count: number
  created_at: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'hidden'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = await getAdminProducts()
    if (result.success) {
      setProducts(result.data)
    } else {
      setError(result.error || 'Failed to load products')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Get unique categories
  const categories = Array.from(new Set(products.map((p) => p.category))).sort()

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = filterCategory === 'all' || product.category === filterCategory

    if (filterStatus === 'hidden') return matchesSearch && matchesCategory && !product.is_active
    if (filterStatus === 'active') return matchesSearch && matchesCategory && product.is_active
    return matchesSearch && matchesCategory
  })

  const activeCount = products.filter((p) => p.is_active).length
  const hiddenCount = products.filter((p) => !p.is_active).length

  const handleToggleActive = async (productId: string, currentActive: boolean) => {
    setActionLoading(productId)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentActive }),
      })
      const result = await res.json()
      if (result.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, is_active: !currentActive } : p
          )
        )
      } else {
        alert(result.error || 'Failed to toggle product status')
      }
    } catch (err) {
      alert('Network error: ' + (err instanceof Error ? err.message : 'Unknown'))
    }
    setActionLoading(null)
  }

  const handleToggleSoldOut = async (productId: string, currentSoldOut: boolean) => {
    setActionLoading(productId)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_sold_out: !currentSoldOut }),
      })
      const result = await res.json()
      if (result.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, is_sold_out: !currentSoldOut } : p
          )
        )
      } else {
        alert(result.error || 'Failed to toggle sold-out status')
      }
    } catch (err) {
      alert('Network error: ' + (err instanceof Error ? err.message : 'Unknown'))
    }
    setActionLoading(null)
  }

  const handleDelete = async (productId: string) => {
    setActionLoading(productId)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })
      const result = await res.json()
      if (result.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId))
      } else {
        alert(result.error || 'Failed to delete product')
      }
    } catch (err) {
      alert('Network error: ' + (err instanceof Error ? err.message : 'Unknown'))
    }
    setDeleteConfirm(null)
    setActionLoading(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="animate-spin text-warm" size={24} />
        <span className="ml-3 text-warm font-sans">Loading products...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <p className="text-red-900 text-sm font-sans font-medium">Failed to load products</p>
          <p className="text-red-700 text-sm font-sans mt-1">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-sans font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-dark mb-2">Products</h1>
          <p className="text-warm font-sans">
            Manage your product inventory ({products.length} total)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 px-4 py-2 bg-stone-light text-dark font-sans font-medium rounded-lg hover:bg-stone transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-dark text-cream font-sans font-medium rounded-lg hover:bg-charcoal transition-colors"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors',
              filterStatus === 'all'
                ? 'bg-dark text-cream'
                : 'bg-stone-light text-warm hover:bg-stone'
            )}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors',
              filterStatus === 'active'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-light text-warm hover:bg-stone'
            )}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilterStatus('hidden')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors',
              filterStatus === 'hidden'
                ? 'bg-gray-600 text-white'
                : 'bg-stone-light text-warm hover:bg-stone'
            )}
          >
            Hidden ({hiddenCount})
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterCategory('all')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors border',
              filterCategory === 'all'
                ? 'bg-gold/10 border-gold/40 text-gold-dark'
                : 'bg-white border-stone-light text-warm hover:border-stone'
            )}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors border',
                filterCategory === cat
                  ? 'bg-gold/10 border-gold/40 text-gold-dark'
                  : 'bg-white border-stone-light text-warm hover:border-stone'
              )}
            >
              {cat} ({products.filter((p) => p.category === cat).length})
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-warm-light" size={18} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-stone-light rounded-lg font-sans text-dark placeholder-warm-light focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
        />
      </div>

      <div className="bg-white border border-stone-light rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-light bg-stone-light">
                <th className="px-6 py-4 text-left text-xs font-sans font-semibold text-dark uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-sans font-semibold text-dark uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-sans font-semibold text-dark uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-sans font-semibold text-dark uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-sans font-semibold text-dark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const isConfirmingDelete = deleteConfirm === product.id
                const isLoading = actionLoading === product.id
                return (
                  <tr
                    key={product.id}
                    className={cn(
                      'border-b border-stone-light transition-colors',
                      !product.is_active
                        ? 'bg-gray-50 opacity-60'
                        : isConfirmingDelete
                          ? 'bg-red-50'
                          : 'hover:bg-cream'
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images && product.images[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className={cn(
                              'w-10 h-10 rounded object-cover',
                              !product.is_active && 'grayscale'
                            )}
                          />
                        )}
                        <div>
                          <p className="font-sans font-medium text-dark">
                            {product.name}
                          </p>
                          <p className="text-xs text-warm-light font-sans">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-sans font-medium text-dark">
                          ${product.price}
                        </p>
                        {product.compare_at_price && (
                          <p className="text-xs text-warm-light font-sans line-through">
                            ${product.compare_at_price}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-sans text-warm">
                        {product.category}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {!product.is_active ? (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-medium bg-gray-200 text-gray-600">
                            Hidden
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-medium bg-emerald-100 text-emerald-700">
                            Active
                          </span>
                        )}
                        {product.is_sold_out && (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-medium bg-red-100 text-red-700">
                            Sold Out
                          </span>
                        )}
                        {product.is_best_seller && (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-medium bg-amber-100 text-amber-700">
                            Bestseller
                          </span>
                        )}
                        {product.is_new && (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-medium bg-blue-100 text-blue-700">
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isConfirmingDelete ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={isLoading}
                            className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {isLoading ? 'Deleting...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-stone-light text-warm hover:bg-stone transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 rounded-lg bg-stone-light text-warm hover:bg-blue-100 hover:text-blue-600 transition-colors"
                            title="Edit product"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => handleToggleSoldOut(product.id, product.is_sold_out)}
                            disabled={isLoading}
                            className={cn(
                              'p-2 rounded-lg transition-colors disabled:opacity-50',
                              product.is_sold_out
                                ? 'bg-red-100 text-red-600 hover:bg-emerald-100 hover:text-emerald-600'
                                : 'bg-stone-light text-warm hover:bg-red-100 hover:text-red-600'
                            )}
                            title={product.is_sold_out ? 'Mark as in stock' : 'Mark as sold out'}
                          >
                            {product.is_sold_out ? <Ban size={16} /> : <ShoppingBag size={16} />}
                          </button>
                          <button
                            onClick={() => handleToggleActive(product.id, product.is_active)}
                            disabled={isLoading}
                            className={cn(
                              'p-2 rounded-lg transition-colors disabled:opacity-50',
                              !product.is_active
                                ? 'bg-gray-200 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600'
                                : 'bg-stone-light text-warm hover:bg-gray-200 hover:text-gray-600'
                            )}
                            title={product.is_active ? 'Hide product' : 'Show product'}
                          >
                            {product.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-2 rounded-lg bg-stone-light text-warm hover:bg-red-100 hover:text-red-600 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-warm font-sans">No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}
