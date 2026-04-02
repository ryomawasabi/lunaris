'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CATEGORIES, COLLECTIONS } from '@/lib/data'
import { useProductStatus } from '@/components/providers/ProductStatusProvider'
import { ArrowLeft, CheckCircle, Upload, X, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function generateId(): string {
  return 'prod_' + Math.random().toString(36).substring(2, 9)
}

interface ImageItem {
  id: string
  url: string
  preview: string
  file?: File
}

export default function NewProductPage() {
  const router = useRouter()
  const { addProduct } = useProductStatus()
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const [images, setImages] = useState<ImageItem[]>([])
  const [imageUrlInput, setImageUrlInput] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    compareAtPrice: '',
    category: '',
    gemstone: '',
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug === '' || prev.slug === generateSlug(prev.name)
        ? generateSlug(name)
        : prev.slug,
    }))
  }

  // Image handling
  const addImageFromFile = useCallback((files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        setImages((prev) => [...prev, {
          id: Math.random().toString(36).substring(2, 9),
          url: dataUrl,
          preview: dataUrl,
          file,
        }])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const addImageFromUrl = useCallback(() => {
    const url = imageUrlInput.trim()
    if (!url) return
    setImages((prev) => [...prev, {
      id: Math.random().toString(36).substring(2, 9),
      url,
      preview: url,
    }])
    setImageUrlInput('')
  }, [imageUrlInput])

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }, [])

  // Drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    addImageFromFile(e.dataTransfer.files)
  }, [addImageFromFile])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const imageUrls = images.map((img) => img.url)
    if (imageUrls.length === 0) {
      alert('Please add at least one product image')
      return
    }

    const product = {
      id: generateId(),
      slug: formData.slug,
      name: formData.name,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
      category: formData.category,
      collection: formData.collection,
      gemstone: formData.gemstone,
      symbolicMeaning: formData.symbolicMeaning,
      shortDescription: formData.shortDescription,
      longDescription: formData.longDescription,
      materials: formData.materials.split(',').map((m) => m.trim()).filter(Boolean),
      images: imageUrls,
      badges: formData.badges,
      rating: 0,
      reviewCount: 0,
      isBestSeller: formData.isBestSeller,
      isNew: formData.isNew,
      isGiftable: formData.isGiftable,
      crystalType: formData.gemstone,
      crystalEffects: [],
    }

    addProduct(product)
    setSuccess(true)
    setTimeout(() => {
      router.push('/admin/products')
    }, 1500)
  }

  const inputClass = "w-full px-4 py-2 border border-stone-light rounded-lg font-sans text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
  const labelClass = "block text-sm font-sans font-medium text-dark mb-2"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-stone-light rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-dark" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-dark">Create Product</h1>
          <p className="text-warm font-sans">Add a new product to your catalog</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="text-emerald-600 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <p className="text-emerald-900 text-sm font-sans font-medium">
              Product created successfully!
            </p>
            <p className="text-emerald-700 text-sm font-sans">Redirecting to products...</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <h2 className="font-serif text-xl text-dark mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Name *</label>
              <input type="text" value={formData.name} onChange={handleNameChange} required className={inputClass} placeholder="e.g. Amethyst Protection Bracelet" />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input type="text" value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Price *</label>
              <input type="number" step="0.01" min="0" value={formData.price} onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))} required className={inputClass} placeholder="128" />
            </div>
            <div>
              <label className={labelClass}>Compare At Price</label>
              <input type="number" step="0.01" min="0" value={formData.compareAtPrice} onChange={(e) => setFormData((prev) => ({ ...prev, compareAtPrice: e.target.value }))} className={inputClass} placeholder="168" />
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select value={formData.category} onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))} required className={inputClass}>
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Gemstone *</label>
              <input type="text" value={formData.gemstone} onChange={(e) => setFormData((prev) => ({ ...prev, gemstone: e.target.value }))} required className={inputClass} placeholder="e.g. Amethyst" />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <h2 className="font-serif text-xl text-dark mb-4">Product Images *</h2>

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              {images.map((img, index) => (
                <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-stone-light">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview} alt={`Product image ${index + 1}`} className="w-full h-full object-cover" />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-dark/80 text-cream text-[10px] font-sans font-medium rounded uppercase">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragging
                ? 'border-gold bg-gold/5'
                : 'border-stone hover:border-gold hover:bg-cream/50'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => addImageFromFile(e.target.files)}
              className="hidden"
            />
            <Upload size={32} className="mx-auto text-warm mb-3" />
            <p className="font-sans text-sm text-dark font-medium mb-1">
              Drop images here or click to upload
            </p>
            <p className="font-sans text-xs text-warm">
              JPG, PNG, WebP supported
            </p>
          </div>

          {/* URL Input */}
          <div className="mt-4">
            <label className="block text-sm font-sans font-medium text-warm mb-2">
              Or add image by URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className={cn(inputClass, 'flex-1')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addImageFromUrl()
                  }
                }}
              />
              <button
                type="button"
                onClick={addImageFromUrl}
                disabled={!imageUrlInput.trim()}
                className="px-4 py-2 bg-stone-light text-dark font-sans font-medium rounded-lg hover:bg-stone transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ImageIcon size={16} />
                Add
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
              <input type="text" value={formData.symbolicMeaning} onChange={(e) => setFormData((prev) => ({ ...prev, symbolicMeaning: e.target.value }))} required className={inputClass} placeholder="Protection and grounding energy..." />
            </div>
            <div>
              <label className={labelClass}>Short Description *</label>
              <textarea value={formData.shortDescription} onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))} required rows={2} className={inputClass} placeholder="Brief product summary..." />
            </div>
            <div>
              <label className={labelClass}>Long Description *</label>
              <textarea value={formData.longDescription} onChange={(e) => setFormData((prev) => ({ ...prev, longDescription: e.target.value }))} required rows={4} className={inputClass} placeholder="Detailed product description..." />
            </div>
            <div>
              <label className={labelClass}>Materials (comma separated) *</label>
              <input type="text" value={formData.materials} onChange={(e) => setFormData((prev) => ({ ...prev, materials: e.target.value }))} placeholder="Sterling Silver, Rose Quartz, Gold" required className={inputClass} />
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
                {COLLECTIONS.map((col) => (
                  <label key={col.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.collection.includes(col.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData((prev) => ({ ...prev, collection: [...prev.collection, col.name] }))
                        } else {
                          setFormData((prev) => ({ ...prev, collection: prev.collection.filter((c) => c !== col.name) }))
                        }
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
                  <input type="checkbox" checked={formData.isBestSeller} onChange={(e) => setFormData((prev) => ({ ...prev, isBestSeller: e.target.checked }))} className="w-4 h-4 rounded border-stone-light cursor-pointer accent-gold" />
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
          <button
            type="submit"
            disabled={success}
            className="px-6 py-3 bg-dark text-cream font-sans font-medium rounded-lg hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Product
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-3 bg-stone-light text-dark font-sans font-medium rounded-lg hover:bg-stone transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
