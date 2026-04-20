'use client'

import { useState, useEffect, useCallback } from 'react'
import { Globe, CheckCircle, AlertTriangle, ExternalLink, RefreshCw, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductSEO {
  id: string
  slug: string
  name: string
  short_description: string
  images: string[]
  is_active: boolean
}

interface SEOCheck {
  label: string
  status: 'good' | 'warning' | 'error'
  detail: string
}

export default function AdminSEOPage() {
  const [products, setProducts] = useState<ProductSEO[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data.products || [])
    } catch {
      console.error('Failed to load products')
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])

  const checkProductSEO = (p: ProductSEO): SEOCheck[] => {
    const checks: SEOCheck[] = []

    // Title length
    const title = `${p.name} | YINYANG GUARDIAN`
    if (title.length > 60) {
      checks.push({ label: 'Title', status: 'warning', detail: `${title.length} chars (recommended: under 60)` })
    } else {
      checks.push({ label: 'Title', status: 'good', detail: `${title.length} chars` })
    }

    // Description
    if (!p.short_description) {
      checks.push({ label: 'Description', status: 'error', detail: 'Missing' })
    } else if (p.short_description.length > 160) {
      checks.push({ label: 'Description', status: 'warning', detail: `${p.short_description.length} chars (recommended: under 160)` })
    } else if (p.short_description.length < 50) {
      checks.push({ label: 'Description', status: 'warning', detail: `${p.short_description.length} chars (recommended: 50-160)` })
    } else {
      checks.push({ label: 'Description', status: 'good', detail: `${p.short_description.length} chars` })
    }

    // Images
    if (!p.images || p.images.length === 0) {
      checks.push({ label: 'OG Image', status: 'error', detail: 'No images' })
    } else {
      checks.push({ label: 'OG Image', status: 'good', detail: 'Has product image' })
    }

    // Slug
    if (p.slug.includes(' ') || p.slug !== p.slug.toLowerCase()) {
      checks.push({ label: 'URL Slug', status: 'warning', detail: 'Contains spaces or uppercase' })
    } else {
      checks.push({ label: 'URL Slug', status: 'good', detail: `/products/${p.slug}` })
    }

    return checks
  }

  const getOverallScore = (checks: SEOCheck[]): { score: number; color: string } => {
    const total = checks.length
    const good = checks.filter((c) => c.status === 'good').length
    const score = Math.round((good / total) * 100)
    const color = score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600'
    return { score, color }
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Overall site SEO stats
  const allChecks = products.flatMap(checkProductSEO)
  const goodCount = allChecks.filter((c) => c.status === 'good').length
  const warningCount = allChecks.filter((c) => c.status === 'warning').length
  const errorCount = allChecks.filter((c) => c.status === 'error').length

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-20 justify-center">
        <RefreshCw className="animate-spin text-warm" size={20} />
        <span className="text-warm font-sans">Analyzing SEO...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-dark mb-2">SEO Overview</h1>
        <p className="text-warm font-sans">Monitor and improve your search engine optimization</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-light rounded-lg p-4">
          <p className="text-xs font-sans text-warm uppercase tracking-wider mb-1">Products Indexed</p>
          <p className="font-serif text-2xl text-dark">{products.filter((p) => p.is_active).length}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-xs font-sans text-emerald-700 uppercase tracking-wider mb-1">Good</p>
          <p className="font-serif text-2xl text-emerald-700">{goodCount}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-xs font-sans text-amber-700 uppercase tracking-wider mb-1">Warnings</p>
          <p className="font-serif text-2xl text-amber-700">{warningCount}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-xs font-sans text-red-700 uppercase tracking-wider mb-1">Errors</p>
          <p className="font-serif text-2xl text-red-700">{errorCount}</p>
        </div>
      </div>

      {/* Site-wide SEO Status */}
      <div className="bg-white border border-stone-light rounded-lg p-6">
        <h2 className="font-serif text-xl text-dark mb-4">Site-wide SEO</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle size={18} className="text-emerald-600" />
            <div>
              <p className="font-sans text-sm text-dark font-medium">robots.txt</p>
              <p className="font-sans text-xs text-warm">Configured — blocks /admin, /api</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle size={18} className="text-emerald-600" />
            <div>
              <p className="font-sans text-sm text-dark font-medium">Sitemap</p>
              <p className="font-sans text-xs text-warm">Dynamic — all products & collections</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle size={18} className="text-emerald-600" />
            <div>
              <p className="font-sans text-sm text-dark font-medium">JSON-LD Schema</p>
              <p className="font-sans text-xs text-warm">Product structured data on all product pages</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle size={18} className="text-emerald-600" />
            <div>
              <p className="font-sans text-sm text-dark font-medium">Open Graph</p>
              <p className="font-sans text-xs text-warm">OG title, description, image on all pages</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-stone-light">
          <a
            href="/sitemap.xml"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-sans text-warm hover:text-dark transition-colors"
          >
            <ExternalLink size={14} />
            View sitemap.xml
          </a>
        </div>
      </div>

      {/* Per-Product SEO Audit */}
      <div className="bg-white border border-stone-light rounded-lg overflow-hidden">
        <div className="p-4 border-b border-stone-light flex items-center justify-between">
          <h2 className="font-serif text-xl text-dark">Product SEO Audit</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-9 pr-4 py-2 border border-stone-light rounded-lg font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent w-64"
            />
          </div>
        </div>

        <div className="divide-y divide-stone-light">
          {filteredProducts.map((product) => {
            const checks = checkProductSEO(product)
            const { score, color } = getOverallScore(checks)
            return (
              <div key={product.id} className="p-4 hover:bg-cream/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {product.images?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt="" className="w-10 h-10 object-cover rounded" />
                    )}
                    <div>
                      <p className="font-sans text-sm font-medium text-dark">{product.name}</p>
                      <p className="font-sans text-xs text-warm">/products/{product.slug}</p>
                    </div>
                  </div>
                  <span className={cn('font-serif text-lg font-medium', color)}>
                    {score}%
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 ml-13">
                  {checks.map((check, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      {check.status === 'good' ? (
                        <CheckCircle size={12} className="text-emerald-500" />
                      ) : check.status === 'warning' ? (
                        <AlertTriangle size={12} className="text-amber-500" />
                      ) : (
                        <AlertTriangle size={12} className="text-red-500" />
                      )}
                      <span className="font-sans text-xs text-warm">
                        {check.label}: {check.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center">
            <Globe size={32} className="text-warm-light mx-auto mb-3" />
            <p className="text-warm font-sans text-sm">No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}
