'use client'

import { useState, useEffect } from 'react'
import { Grid3x3, RefreshCw } from 'lucide-react'
import { getAdminCategories } from '@/lib/supabase/admin-actions'

interface Category {
  id: string
  slug: string
  name: string
  image: string | null
  product_count: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const result = await getAdminCategories()
      if (result.success) setCategories(result.data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-20 justify-center">
        <RefreshCw className="animate-spin text-warm" size={20} />
        <span className="text-warm font-sans">Loading categories...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-dark mb-2">Categories</h1>
          <p className="text-warm font-sans">Manage your product categories ({categories.length} total)</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm font-sans">
          Categories can be managed directly in the Supabase dashboard. Changes are reflected immediately on the live site.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-stone-light rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {cat.image && (
              <div className="h-40 overflow-hidden bg-stone-light">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Grid3x3 size={16} className="text-gold" />
                <h3 className="font-serif text-lg text-dark">{cat.name}</h3>
              </div>
              <p className="text-xs text-warm-light font-sans mt-2">{cat.product_count} products</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
