'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, Layers, Grid3x3, ArrowRight, RefreshCw } from 'lucide-react'
import { getAdminProducts, getAdminCollections, getAdminCategories } from '@/lib/supabase/admin-actions'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, collections: 0, categories: 0, activeProducts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const [prodResult, colResult, catResult] = await Promise.all([
        getAdminProducts(),
        getAdminCollections(),
        getAdminCategories(),
      ])
      setStats({
        products: prodResult.data?.length || 0,
        collections: colResult.data?.length || 0,
        categories: catResult.data?.length || 0,
        activeProducts: (prodResult.data || []).filter((p: { is_active: boolean }) => p.is_active).length,
      })
      setLoading(false)
    }
    loadStats()
  }, [])

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'bg-gold-light', href: '/admin/products' },
    { label: 'Active Products', value: stats.activeProducts, icon: Package, color: 'bg-emerald-50', href: '/admin/products' },
    { label: 'Collections', value: stats.collections, icon: Layers, color: 'bg-stone-light', href: '/admin/collections' },
    { label: 'Categories', value: stats.categories, icon: Grid3x3, color: 'bg-blue-50', href: '/admin/categories' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-dark mb-2">Admin Dashboard</h1>
        <p className="text-warm font-sans">
          Manage your YINYANG GUARDIAN inventory and content
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 py-8">
          <RefreshCw className="animate-spin text-warm" size={20} />
          <span className="text-warm font-sans">Loading stats...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.label}
                href={card.href}
                className="group p-6 bg-white border border-stone-light rounded-lg hover:border-gold hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <Icon size={24} className="text-dark" />
                  </div>
                  <ArrowRight size={20} className="text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm font-sans text-warm-light mb-1">{card.label}</p>
                <p className="font-serif text-3xl text-dark">{card.value}</p>
              </Link>
            )
          })}
        </div>
      )}

      <div className="bg-white border border-stone-light rounded-lg p-6">
        <h2 className="font-serif text-xl text-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center justify-between p-4 bg-cream hover:bg-stone-light rounded-lg transition-colors border border-stone-light"
          >
            <div className="flex items-center gap-3">
              <Package size={20} className="text-gold" />
              <span className="font-sans font-medium text-dark">Add New Product</span>
            </div>
            <ArrowRight size={16} className="text-warm-light" />
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center justify-between p-4 bg-cream hover:bg-stone-light rounded-lg transition-colors border border-stone-light"
          >
            <div className="flex items-center gap-3">
              <Package size={20} className="text-gold" />
              <span className="font-sans font-medium text-dark">Manage Products</span>
            </div>
            <ArrowRight size={16} className="text-warm-light" />
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-cream to-stone-light border border-stone-light rounded-lg p-8">
        <h2 className="font-serif text-2xl text-dark mb-2">Database Connected</h2>
        <p className="font-sans text-warm mb-4">
          Your admin panel is now connected to Supabase. All changes you make here are saved directly to the database and reflected on the live site in real-time.
        </p>
        <Link
          href="/admin/products"
          className="inline-block px-6 py-2 bg-dark text-cream font-sans font-medium rounded-lg hover:bg-charcoal transition-colors"
        >
          View All Products
        </Link>
      </div>
    </div>
  )
}
