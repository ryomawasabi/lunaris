'use client'

import { CATEGORIES } from '@/lib/data'
import { Plus } from 'lucide-react'

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-dark mb-2">Categories</h1>
          <p className="text-warm font-sans">Manage your product categories</p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 bg-stone-light text-warm-light font-sans font-medium rounded-lg cursor-not-allowed"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((category) => (
          <div
            key={category.id}
            className="bg-white border border-stone-light rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {category.image && (
              <div className="h-40 overflow-hidden bg-stone-light">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-serif text-lg text-dark mb-1">{category.name}</h3>
              <p className="text-xs text-warm-light font-sans">
                {category.productCount} products
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-cream border border-gold rounded-lg p-6 text-center">
        <p className="text-warm font-sans mb-2">
          Category management features coming soon
        </p>
        <p className="text-sm text-warm-light font-sans">
          For now, manage categories through the Supabase dashboard
        </p>
      </div>
    </div>
  )
}
