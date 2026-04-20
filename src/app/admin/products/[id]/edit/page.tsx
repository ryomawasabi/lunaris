'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { updateProduct, getAdminProductById, getAdminCollections, getAdminCategories } from '@/lib/supabase/admin-actions'
import { ArrowLeft, CheckCircle, Upload, X, ImageIcon, Loader2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageItem {
  id: string
  url: string
  preview: string
  file?: File
  uploading?: boolean
}

interface CollectionItem {
  id: string
  name: string
  slug: string
}

interface CategoryItem {
  id: string
  name: string
  slug: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [images, setImages] = useState<ImageItem[]>([])
  const [imageUrlInput, setImageUrlInput] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    compareAtPrice: '',
    category: '',
    gemstone: '',
    crystalType: '',
    crystalEffects: '',
    symbolicMeaning: '',
    shortDescription: '',
    longDescription: '',
    materials: '',
    collection: [] as string[],
    badges: [] as string[],
    isBestSeller: false,
    isNew: false,
    isGiftable: false,
  })

  useEffect(() => {
    async function loadData() {
      const [productResult, colResult, catResult] = await Promise.all([
        getAdminProductById(productId),
        getAdminCollections(),
        getAdminCategories(),
      ])

      if (colResult.success) setCollections(colResult.data)
      if (catResult.success) setCategories(catResult.data)

      if (productResult.success && productResult.data) {
        const p = productResult.data
        setFormData({
          name: p.name || '',
          slug: p.slug || '',
          price: String(p.price || ''),
          compareAtPrice: p.compare_at_price ? String(p.compare_at_price) : '',
          category: p.category || '',
          gemstone: p.gemstone || '',
          crystalType: p.crystal_type || '',
          crystalEffects: (p.crystal_effects || []).join(', '),
          symbolicMeaning: p.symbolic_meaning || '',
          shortDescription: p.short_description || '',
          longDescription: p.long_description || '',
          materials: (p.materials || []).join(', '),
          collection: p.collection || [],
          badges: p.badges || [],
          isBestSeller: p.is_best_seller || false,
          isNew: p.is_new || false,
          isGiftable: p.is_giftable || false,
        })
        // Load existing images
        setImages(
          (p.images || []).map((url: string, i: number) => ({
            id: `existing-${i}`,
            url,
            preview: url,
          }))
        )
      }
      setLoading(false)
    }
    loadData()
  }, [productId])

  const uploadImage = async (file: File): Promise<string | null> => {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: uploadFormData })
      if (!response.ok) return null
      const data = await response.json()
      return data.url
    } catch {
      return null
    }
  }

  const addImageFromFile = useCallback(async (files: FileList | null) => {
    if (!files) return
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      const tempId = Math.random().toString(36).substring(2, 9)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImages((prev) => [...prev, { id: tempId, url: '', preview: e.target?.result as string, file, uploading: true }])
      }
      reader.readAsDataURL(file)
      const url = await uploadImage(file)
      if (url) {
        setImages((prev) => prev.map((img) => img.id === tempId ? { ...img, url, uploading: false } : img))
      } else {
        setImages((prev) => prev.filter((img) => img.id !== tempId))
        alert(`Failed to upload ${file.name}`)
      }
    }
  }, [])

  const addImageFromUrl = useCallback(() => {
    const url = imageUrlInput.trim()
    if (!url) return
    setImages((prev) => [...prev, { id: Math.random().toString(36).substring(2, 9), url, preview: url }])
    setImageUrlInput('')
  }, [imageUrlInput])

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }, [])
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false) }, [])
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); addImageFromFile(e.dataTransfer.files) }, [addImageFromFile])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)

    const imageUrls = images.filter((img) => img.url && !img.uploading).map((img) => img.url)
    if (imageUrls.length === 0) { setSubmitError('Please add at least one product image'); return }
    if (images.some((img) => img.uploading)) { setSubmitError('Please wait for all images to finish uploading'); return }

    setSubmitting(true)

    console.log('[SUBMIT DEBUG] formData.isBestSeller:', formData.isBestSeller)
    console.log('[SUBMIT DEBUG] formData.isNew:', formData.isNew)
    console.log('[SUBMIT DEBUG] formData.isGiftable:', formData.isGiftable)

    const fd = new FormData()
    fd.set('slug', formData.slug)
    fd.set('name', formData.name)
    fd.set('price', formData.price)
    if (formData.compareAtPrice) fd.set('compareAtPrice', formData.compareAtPrice)
    fd.set('category', formData.category)
    fd.set('collection', formData.collection.join(','))
    fd.set('gemstone', formData.gemstone)
    fd.set('crystalType', formData.crystalType || formData.gemstone)
    fd.set('crystalEffects', formData.crystalEffects)
    fd.set('symbolicMeaning', formData.symbolicMeaning)
    fd.set('shortDescription', formData.shortDescription)
    fd.set('longDescription', formData.longDescription)
    fd.set('materials', formData.materials)
    fd.set('images', imageUrls.join(','))
    fd.set('badges', formData.badges.join(','))
    fd.set('isBestSeller', String(formData.isBestSeller))
    fd.set('isNew', String(formData.isNew))
    fd.set('isGiftable', String(formData.isGiftable))

    const result = await updateProduct(productId, fd)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => { router.push('/admin/products') }, 1500)
    } else {
      setSubmitError(result.error || 'Failed to update product')
    }
    setSubmitting(false)
  }

  const inputClass = "w-full px-4 py-2 border border-stone-light rounded-lg font-sans text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
  const labelClass = "block text-sm font-sans font-medium text-dark mb-2"

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="animate-spin text-warm" size={24} />
        <span className="ml-3 text-warm font-sans">Loading product...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-stone-light rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-dark" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-dark">Edit Product</h1>
          <p className="text-warm font-sans">Update product details</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="text-emerald-600 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <p className="text-emerald-900 text-sm font-sans font-medium">Product updated successfully!</p>
            <p className="text-emerald-700 text-sm font-sans">Redirecting to products...</p>
          </div>
        </div>
      )}

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-900 text-sm font-sans font-medium">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <h2 className="font-serif text-xl text-dark mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input type="text" value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Price *</label>
              <input type="number" step="0.01" min="0" value={formData.price} onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Compare At Price</label>
              <input type="number" step="0.01" min="0" value={formData.compareAtPrice} onChange={(e) => setFormData((prev) => ({ ...prev, compareAtPrice: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select value={formData.category} onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))} required className={inputClass}>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Gemstone</label>
              <input type="text" value={formData.gemstone} onChange={(e) => setFormData((prev) => ({ ...prev, gemstone: e.target.value }))} className={inputClass} placeholder="(optional)" />
            </div>
            <div>
              <label className={labelClass}>Crystal Type</label>
              <input type="text" value={formData.crystalType} onChange={(e) => setFormData((prev) => ({ ...prev, crystalType: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Crystal Effects (comma separated)</label>
              <input type="text" value={formData.crystalEffects} onChange={(e) => setFormData((prev) => ({ ...prev, crystalEffects: e.target.value }))} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <h2 className="font-serif text-xl text-dark mb-4">Product Images *</h2>
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              {images.map((img, index) => (
                <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-stone-light">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview} alt={`Product image ${index + 1}`} className="w-full h-full object-cover" />
                  {index === 0 && <span className="absolute top-2 left-2 px-2 py-0.5 bg-dark/80 text-cream text-[10px] font-sans font-medium rounded uppercase">Main</span>}
                  {img.uploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Loader2 className="animate-spin text-white" size={24} /></div>}
                  <button type="button" onClick={() => removeImage(img.id)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn('border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors', isDragging ? 'border-gold bg-gold/5' : 'border-stone hover:border-gold hover:bg-cream/50')}
          >
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => addImageFromFile(e.target.files)} className="hidden" />
            <Upload size={32} className="mx-auto text-warm mb-3" />
            <p className="font-sans text-sm text-dark font-medium mb-1">Drop images here or click to upload</p>
            <p className="font-sans text-xs text-warm">JPG, PNG, WebP supported. Max 5MB per image.</p>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-sans font-medium text-warm mb-2">Or add image by URL</label>
            <div className="flex gap-2">
              <input type="url" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} placeholder="https://..." className={cn(inputClass, 'flex-1')} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImageFromUrl() } }} />
              <button type="button" onClick={addImageFromUrl} disabled={!imageUrlInput.trim()} className="px-4 py-2 bg-stone-light text-dark font-sans font-medium rounded-lg hover:bg-stone transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
                <ImageIcon size={16} />Add
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <h2 className="font-serif text-xl text-dark mb-4">Description</h2>
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Symbolic Meaning *</label>
              <input type="text" value={formData.symbolicMeaning} onChange={(e) => setFormData((prev) => ({ ...prev, symbolicMeaning: e.target.value }))} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Short Description *</label>
              <textarea value={formData.shortDescription} onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))} required rows={2} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Long Description *</label>
              <textarea value={formData.longDescription} onChange={(e) => setFormData((prev) => ({ ...prev, longDescription: e.target.value }))} required rows={4} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Materials (comma separated) *</label>
              <input type="text" value={formData.materials} onChange={(e) => setFormData((prev) => ({ ...prev, materials: e.target.value }))} required className={inputClass} />
            </div>
          </div>
        </div>

        {/* Collections & Tags */}
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <h2 className="font-serif text-xl text-dark mb-4">Collections & Tags</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Collections</label>
              <div className="space-y-2">
                {collections.map((col) => (
                  <label key={col.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.collection.includes(col.name)}
                      onChange={(e) => {
                        if (e.target.checked) setFormData((prev) => ({ ...prev, collection: [...prev.collection, col.name] }))
                        else setFormData((prev) => ({ ...prev, collection: prev.collection.filter((c) => c !== col.name) }))
                      }}
                      className="w-4 h-4 rounded border-stone-light cursor-pointer accent-gold"
                    />
                    <span className="font-sans text-sm text-dark">{col.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Product Flags</label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isBestSeller} onChange={(e) => { console.log('[CHECKBOX] Best Seller clicked, e.target.checked:', e.target.checked); setFormData((prev) => ({ ...prev, isBestSeller: e.target.checked })) }} className="w-4 h-4 rounded border-stone-light cursor-pointer accent-gold" />
                  <span className="font-sans text-sm text-dark">Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isNew} onChange={(e) => setFormData((prev) => ({ ...prev, isNew: e.target.checked }))} className="w-4 h-4 rounded border-stone-light cursor-pointer accent-gold" />
                  <span className="font-sans text-sm text-dark">New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isGiftable} onChange={(e) => setFormData((prev) => ({ ...prev, isGiftable: e.target.checked }))} className="w-4 h-4 rounded border-stone-light cursor-pointer accent-gold" />
                  <span className="font-sans text-sm text-dark">Giftable</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button type="submit" disabled={success || submitting} className="px-6 py-3 bg-dark text-cream font-sans font-medium rounded-lg hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {submitting && <Loader2 className="animate-spin" size={16} />}
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/products" className="px-6 py-3 bg-stone-light text-dark font-sans font-medium rounded-lg hover:bg-stone transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
