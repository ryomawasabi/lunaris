'use client'

import { useState, useEffect, useCallback } from 'react'
import { Grid3x3, Plus, Pencil, Trash2, X, RefreshCw, Save, Upload } from 'lucide-react'

interface Category {
  id: string
  slug: string
  name: string
  image: string | null
  product_count: number
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formImage, setFormImage] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const loadCategories = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/categories')
      const data = await res.json()
      if (data.categories) setCategories(data.categories)
    } catch {
      setError('Failed to load categories')
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadCategories() }, [loadCategories])

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormName('')
    setFormSlug('')
    setFormImage('')
    setError(null)
  }

  const openCreate = () => {
    resetForm()
    setShowForm(true)
  }

  const openEdit = (cat: Category) => {
    setEditingId(cat.id)
    setFormName(cat.name)
    setFormSlug(cat.slug)
    setFormImage(cat.image || '')
    setShowForm(true)
    setError(null)
  }

  const handleNameChange = (val: string) => {
    setFormName(val)
    if (!editingId) {
      setFormSlug(slugify(val))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setFormImage(data.url)
      else setError('Upload failed')
    } catch {
      setError('Upload failed')
    }
    setUploading(false)
  }

  const handleSave = async () => {
    if (!formName.trim() || !formSlug.trim()) {
      setError('Name and slug are required')
      return
    }
    setSaving(true)
    setError(null)

    try {
      const method = editingId ? 'PATCH' : 'POST'
      const body = editingId
        ? { id: editingId, name: formName, slug: formSlug, image: formImage || null }
        : { name: formName, slug: formSlug, image: formImage || null }

      const res = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        resetForm()
        loadCategories()
      }
    } catch {
      setError('Failed to save category')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setDeleteConfirm(null)
        loadCategories()
      }
    } catch {
      setError('Failed to delete category')
    }
  }

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
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-dark text-cream font-sans text-sm font-medium uppercase tracking-wider hover:bg-charcoal transition-colors"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 font-sans text-sm">{error}</p>
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-dark">
              {editingId ? 'Edit Category' : 'New Category'}
            </h2>
            <button onClick={resetForm} className="text-warm hover:text-dark">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-sans font-medium text-dark mb-1">Name *</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Crystal Essence"
                className="w-full px-4 py-2.5 border border-stone-light rounded-lg font-sans text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-sans font-medium text-dark mb-1">Slug *</label>
              <input
                type="text"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="crystal-essence"
                className="w-full px-4 py-2.5 border border-stone-light rounded-lg font-sans text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-sans font-medium text-dark mb-1">Image</label>
              <div className="flex items-center gap-3">
                {formImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formImage} alt="" className="w-16 h-16 object-cover rounded-lg border border-stone-light" />
                )}
                <label className="inline-flex items-center gap-2 px-4 py-2 border border-stone-light rounded-lg cursor-pointer hover:bg-stone-light/30 transition-colors font-sans text-sm text-warm">
                  {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {formImage && (
                  <button onClick={() => setFormImage('')} className="text-warm hover:text-red-600 text-sm font-sans">
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={resetForm} className="px-5 py-2.5 border border-stone-light rounded-lg font-sans text-sm text-warm hover:bg-stone-light/30 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-dark text-cream font-sans text-sm font-medium uppercase tracking-wider hover:bg-charcoal transition-colors disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-stone-light rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {cat.image && (
              <div className="h-40 overflow-hidden bg-stone-light">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
            )}
            {!cat.image && (
              <div className="h-40 bg-stone-light flex items-center justify-center">
                <Grid3x3 size={32} className="text-warm-light" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Grid3x3 size={16} className="text-gold" />
                  <h3 className="font-serif text-lg text-dark">{cat.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 text-warm hover:text-dark hover:bg-stone-light/50 rounded transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  {deleteConfirm === cat.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded font-sans"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-2 py-1 bg-stone-light text-dark text-xs rounded font-sans"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(cat.id)}
                      className="p-1.5 text-warm hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-warm font-sans">slug: {cat.slug}</p>
              <p className="text-xs text-warm-light font-sans mt-1">{cat.product_count} products</p>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && !showForm && (
        <div className="text-center py-16">
          <Grid3x3 size={40} className="text-warm-light mx-auto mb-4" />
          <p className="text-warm font-sans mb-4">No categories yet</p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-dark text-cream font-sans text-sm font-medium uppercase tracking-wider hover:bg-charcoal transition-colors"
          >
            <Plus size={16} />
            Create First Category
          </button>
        </div>
      )}
    </div>
  )
}
