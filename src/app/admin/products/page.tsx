'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Eye, EyeOff, Package, PackageX, Trash2 } from 'lucide-react'
import { useProductStatus } from '@/components/providers/ProductStatusProvider'
import { cn } from '@/lib/utils'

export default function AdminProductsPage() {
  const { products, getStatus, toggleHidden, toggleSoldOut, deleteProduct } = useProductStatus()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'hidden' | 'soldout'>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filteredProducts = products.filter((product) => {
    const status = getStatus(product.id)
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterStatus === 'hidden') return matchesSearch && status.isHidden
    if (filterStatus === 'soldout') return matchesSearch && status.isSoldOut
    if (filterStatus === 'active') return matchesSearch && !status.isHidden && !status.isSoldOut
    return matchesSearch
  })

  const hiddenCount = products.filter(p => getStatus(p.id).isHidden).length
  const soldOutCount = products.filter(p => getStatus(p.id).isSoldOut).length
  const activeCount = products.filter(p => !getStatus(p.id).isHidden && !getStatus(p.id).isSoldOut).length

  const handleDelete = (productId: string) => {
    deleteProduct(productId)
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-dark mb-2">Products</h1>
          <p className="text-warm font-sans">
            Manage your product inventory and details
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-dark text-cream font-sans font-medium rounded-lg hover:bg-charcoal transition-colors"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Filter Tabs */}
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
        <button
          onClick={() => setFilterStatus('soldout')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors',
            filterStatus === 'soldout'
              ? 'bg-amber-600 text-white'
              : 'bg-stone-light text-warm hover:bg-stone'
          )}
        >
          Sold Out ({soldOutCount})
        </button>
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
                const status = getStatus(product.id)
                const isConfirmingDelete = deleteConfirm === product.id
                return (
                  <tr
                    key={product.id}
                    className={cn(
                      'border-b border-stone-light transition-colors',
                      status.isHidden
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
                              status.isHidden && 'grayscale'
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
                      <p className="font-sans font-medium text-dark">
                        ${product.price}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-sans text-warm">
                        {product.category}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {status.isHidden ? (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-medium bg-gray-200 text-gray-600">
                            Hidden
                          </span>
                        ) : status.isSoldOut ? (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-medium bg-amber-100 text-amber-700">
                            Sold Out
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-medium bg-emerald-100 text-emerald-700">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isConfirmingDelete ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                          >
                            Delete
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
                          <button
                            onClick={() => toggleHidden(product.id)}
                            className={cn(
                              'p-2 rounded-lg transition-colors',
                              status.isHidden
                                ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                : 'bg-stone-light text-warm hover:bg-stone'
                            )}
                            title={status.isHidden ? 'Show product' : 'Hide product'}
                          >
                            {status.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            onClick={() => toggleSoldOut(product.id)}
                            className={cn(
                              'p-2 rounded-lg transition-colors',
                              status.isSoldOut
                                ? 'bg-amber-200 text-amber-700 hover:bg-amber-300'
                                : 'bg-stone-light text-warm hover:bg-stone'
                            )}
                            title={status.isSoldOut ? 'Mark as in stock' : 'Mark as sold out'}
                          >
                            {status.isSoldOut ? <PackageX size={16} /> : <Package size={16} />}
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
