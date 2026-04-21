'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBlogPost } from '@/lib/supabase/blog-actions'
import { ArrowLeft, CheckCircle, Upload, Loader2, ImageIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import BlogEditor from '@/components/admin/BlogEditor'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

interface ImageUpload {
  id: string
  url: string
  preview: string
  file?: File
  uploading?: boolean
}

export default function NewBlogPostPage() {
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [coverImage, setCoverImage] = useState<ImageUpload | null>(null)
  const [imageUrlInput, setImageUrlInput] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'Wellness',
    author: 'CRESERA',
    metaTitle: '',
    metaDescription: '',
    relatedProducts: '',
    tags: '',
    isPublished: false,
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug === '' || prev.slug === generateSlug(prev.title)
        ? generateSlug(title)
        : prev.slug,
    }))
  }

  // Upload image to Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!response.ok) {
        const err = await response.json()
        console.error('Upload error:', err)
        return null
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Upload error:', error)
      return null
    }
  }

  const addCoverImageFromFile = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const tempId = Math.random().toString(36).substring(2, 9)
    const reader = new FileReader()

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setCoverImage({
        id: tempId,
        url: '',
        preview: dataUrl,
        file,
        uploading: true,
      })
    }
    reader.readAsDataURL(file)

    // Upload in background
    const url = await uploadImage(file)
    if (url) {
      setCoverImage((prev) =>
        prev ? { ...prev, url, uploading: false } : null
      )
    } else {
      setCoverImage(null)
      alert(`Failed to upload ${file.name}`)
    }
  }, [])

  const addCoverImageFromUrl = useCallback(() => {
    const url = imageUrlInput.trim()
    if (!url) return
    setCoverImage({
      id: Math.random().toString(36).substring(2, 9),
      url,
      preview: url,
    })
    setImageUrlInput('')
  }, [imageUrlInput])

  const removeCoverImage = useCallback(() => {
    setCoverImage(null)
  }, [])

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
    addCoverImageFromFile(e.dataTransfer.files)
  }, [addCoverImageFromFile])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)

    if (!formData.title.trim()) {
      setSubmitError('Post title is required')
      return
    }

    if (!formData.slug.trim() || formData.slug.trim() === '-') {
      setSubmitError('Post title generates an invalid URL slug. Please use a title with letters or numbers.')
      return
    }

    if (!formData.content.trim()) {
      setSubmitError('Post content is required')
      return
    }

    if (coverImage?.uploading) {
      setSubmitError('Please wait for the cover image to finish uploading')
      return
    }

    setSubmitting(true)

    const fd = new FormData()
    fd.set('title', formData.title)
    fd.set('slug', formData.slug)
    fd.set('content', formData.content)
    fd.set('excerpt', formData.excerpt)
    fd.set('category', formData.category)
    fd.set('author', formData.author)
    fd.set('metaTitle', formData.metaTitle)
    fd.set('metaDescription', formData.metaDescription)
    fd.set('relatedProducts', formData.relatedProducts)
    fd.set('tags', formData.tags)
    fd.set('coverImage', coverImage?.url || '')
    fd.set('isPublished', String(formData.isPublished))

    const result = await createBlogPost(fd)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/blog')
      }, 1500)
    } else {
      setSubmitError(result.error || 'Failed to create blog post')
    }

    setSubmitting(false)
  }

  const inputClass = "w-full px-4 py-2 border border-stone-light rounded-lg font-sans text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
  const labelClass = "block text-sm font-sans font-medium text-dark mb-2"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="p-2 hover:bg-stone-light rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-dark" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-dark">Create Blog Post</h1>
          <p className="text-warm font-sans">Add a new blog post to your site</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="text-emerald-600 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <p className="text-emerald-900 text-sm font-sans font-medium">
              Blog post created successfully!
            </p>
            <p className="text-emerald-700 text-sm font-sans">Redirecting to blog posts...</p>
          </div>
        </div>
      )}

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-900 text-sm font-sans font-medium">{submitError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <h2 className="font-serif text-xl text-dark mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                required
                className={inputClass}
                placeholder="e.g. The Healing Power of Amethyst"
              />
              {formData.slug && (
                <p className="text-[11px] font-sans text-warm-light mt-1">
                  URL: /blog/<span className="text-warm">{formData.slug}</span>
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className={inputClass}
              >
                <option value="Crystal Guide">Crystal Guide</option>
                <option value="Wellness">Wellness</option>
                <option value="Style">Style</option>
                <option value="News">News</option>
                <option value="Behind the Scenes">Behind the Scenes</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                className={inputClass}
                placeholder="Author name"
              />
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <h2 className="font-serif text-xl text-dark mb-4">Cover Image</h2>

          {coverImage && (
            <div className="mb-6 relative inline-block">
              <div className="w-48 h-32 rounded-lg overflow-hidden border border-stone-light">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage.preview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>
              {coverImage.uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                  <Loader2 className="animate-spin text-white" size={24} />
                </div>
              )}
              <button
                type="button"
                onClick={removeCoverImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {!coverImage && (
            <>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-4',
                  isDragging
                    ? 'border-gold bg-gold/5'
                    : 'border-stone hover:border-gold hover:bg-cream/50'
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => addCoverImageFromFile(e.target.files)}
                  className="hidden"
                />
                <Upload size={32} className="mx-auto text-warm mb-3" />
                <p className="font-sans text-sm text-dark font-medium mb-1">
                  Drop cover image here or click to upload
                </p>
                <p className="font-sans text-xs text-warm">
                  JPG, PNG, WebP supported. Max 5MB.
                </p>
              </div>

              <div>
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
                        addCoverImageFromUrl()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCoverImageFromUrl}
                    disabled={!imageUrlInput.trim()}
                    className="px-4 py-2 bg-stone-light text-dark font-sans font-medium rounded-lg hover:bg-stone transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ImageIcon size={16} />
                    Add
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <h2 className="font-serif text-xl text-dark mb-4">Content *</h2>
          <BlogEditor
            content={formData.content}
            onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
            placeholder="Write your blog post content here..."
          />
        </div>

        {/* Excerpt */}
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <h2 className="font-serif text-xl text-dark mb-4">Excerpt</h2>
          <label className={labelClass}>Post Summary</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
            rows={2}
            className={inputClass}
            placeholder="Brief summary for blog card and SEO..."
          />
        </div>

        {/* SEO */}
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <h2 className="font-serif text-xl text-dark mb-4">SEO</h2>
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                className={inputClass}
                placeholder="SEO page title (50-60 characters)"
              />
            </div>
            <div>
              <label className={labelClass}>Meta Description</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                rows={2}
                className={inputClass}
                placeholder="SEO description (155-160 characters)"
              />
            </div>
          </div>
        </div>

        {/* Related Products & Tags */}
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <h2 className="font-serif text-xl text-dark mb-4">Related Content</h2>
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Related Products</label>
              <input
                type="text"
                value={formData.relatedProducts}
                onChange={(e) => setFormData((prev) => ({ ...prev, relatedProducts: e.target.value }))}
                className={inputClass}
                placeholder="Product slugs separated by commas (e.g. rose-quartz-bracelet, amethyst-cluster)"
              />
            </div>
            <div>
              <label className={labelClass}>Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                className={inputClass}
                placeholder="Tags separated by commas (e.g. healing, crystals, wellness)"
              />
            </div>
          </div>
        </div>

        {/* Publishing */}
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <h2 className="font-serif text-xl text-dark mb-4">Publishing</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
              className="w-4 h-4 rounded border-stone-light cursor-pointer accent-gold"
            />
            <span className="font-sans text-sm text-dark">Publish immediately</span>
          </label>
          <p className="text-xs text-warm-light font-sans mt-2">
            {formData.isPublished
              ? 'This post will be published when you click Create.'
              : 'This post will be saved as a draft and can be published later.'}
          </p>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={success || submitting}
            className="px-6 py-3 bg-dark text-cream font-sans font-medium rounded-lg hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting && <Loader2 className="animate-spin" size={16} />}
            {submitting ? 'Creating...' : 'Create Post'}
          </button>
          <Link
            href="/admin/blog"
            className="px-6 py-3 bg-stone-light text-dark font-sans font-medium rounded-lg hover:bg-stone transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
