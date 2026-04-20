'use client'

import { useState, useEffect, useCallback } from 'react'
import { Layers, Plus, Pencil, Trash2, X, RefreshCw, Save, Upload } from 'lucide-react'

interface Collection {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  long_description: string | null
  image: string | null
  symbolism: string | null
  product_count: number
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formTagline, setFormTagline] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formLongDescription, setFormLongDescription] = useState('')
  const [formImage, setFormImage] = useState('')
  const [formSymbolism, setFormSymbolism] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const loadCollections = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/collections')
      const data = await res.json()
      if (data.collections) setCollections(data.collections)
    } catch {
      setError('Failed to load collections')
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadCollections() }, [loadCollections])

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormName('')
    setFormSlug('')
    setFormTagline('')
    setFormDescription('')
    setFormLongDescription('')
    setFormImage('')
    setFormSymbolism('')
    setError(null)
  }

  const openCreate = () => {
    resetForm()
    setShowForm(true)
  }

  const openEdit = (col: Collection) => {
    setEditingId(col.id)
    setFormName(col.name)
    setFormSlug(col.slug)
    setFormTagline(col.tagline || '')
    setFormDescription(col.description || '')
    setFormLongDescription(col.long_description || '')
    setFormImage(col.image || '')
    setFormSymbolism(col.symbolism || '')
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
      const body = {
        ...(editingId ? { id: editingId } : {}),
        name: formName,
        slug: formSlug,
        tagline: formTagline || null,
        description: formDescription || null,
        long_description: formLongDescription || null,
        image: formImage || null,
        symbolism: formSymbolism || null,
      }

      const res = await fetch('/api/admin/collections', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        resetForm()
        loadCollections()
      }
    } catch {
      setError('Failed to save collection')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/admin/collections', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setDeleteConfirm(null)
        loadCollections()
      }
    } catch {
      setError('Failed to delete collection')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-20 justify-center">
        <RefreshCw className="animate-spin text-warm" size={20} />
        <span className="text-warm font-sans">Loading collections...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-dark mb-2">Collections</h1>
          <p className="text-warm font-sans">Manage your product collections ({collections.length} total)</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-dark text-cream font-sans text-sm font-medium uppercase tracking-wider hover:bg-charcoal transition-colors"
        >
          <Plus size={16} />
          Add Collection
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
              {editingId ? 'Edit Collection' : 'New Collection'}
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
                placeholder="e.g. Soul Stone Discovery"
                className="w-full px-4 py-2.5 border border-stone-light rounded-lg font-sans text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-sans font-medium text-dark mb-1">Slug *</label>
              <input
                type="text"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="soul-stone-discovery"
                className="w-full px-4 py-2.5 border border-stone-light rounded-lg font-sans text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-sans font-medium text-dark mb-1">Tagline</label>
              <input
                type="text"
                value={formTagline}
                onChange={(e) => setFormTagline(e.target.value)}
                placeholder="A short tagline for the collection"
                className="w-full px-4 py-2.5 border border-stone-light rounded-lg font-sans text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-sans font-medium text-dark mb-1">Description</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Short description of the collection"
                rows={2}
                className="w-full px-4 py-2.5 border border-stone-light rounded-lg font-sans text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-sans font-medium text-dark mb-1">Long Description</label>
              <textarea
                value={formLongDescription}
                onChange={(e) => setFormLongDescription(e.target.value)}
                placeholder="Detailed description shown on collection page"
                rows={4}
                className="w-full px-4 py-2.5 border border-stone-light rounded-lg font-sans text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-sans font-medium text-dark mb-1">Symbolism</label>
              <input
                type="text"
                value={formSymbolism}
                onChange={(e) => setFormSymbolism(e.target.value)}
                placeholder="e.g. Balance & Harmony"
                className="w-full px-4 py-2.5 border border-stone-light rounded-lg font-sans text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-sans font-medium text-dark mb-1">Image</label>
              <div className="flex items-center gap-3">
                {formImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formImage} alt="" className="w-12 h-12 object-cover rounded-lg border border-stone-light" />
                )}
                <label className="inline-flex items-center gap-2 px-4 py-2 border border-stone-light rounded-lg cursor-pointer hover:bg-stone-light/30 transition-colors font-sans text-sm text-warm">
                  {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploading ? 'Uploading...' : 'Upload'}
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

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div key={col.id} className="bg-white border border-stone-light rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {col.image && (
              <div className="h-40 overflow-hidden bg-stone-light">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={col.image} alt={col.name} className="w-full h-full object-cover" />
              </div>
            )}
            {!col.image && (
              <div className="h-40 bg-stone-light flex items-center justify-center">
                <Layers size={32} className="text-warm-light" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-gold" />
                  <h3 className="font-serif text-lg text-dark">{col.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(col)}
                    className="p-1.5 text-warm hover:text-dark hover:bg-stone-light/50 rounded transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  {deleteConfirm === col.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(col.id)}
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
                      onClick={() => setDeleteConfirm(col.id)}
                      className="p-1.5 text-warm hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-warm font-sans">{col.tagline || 'No tagline'}</p>
              <p className="text-xs text-warm-light font-sans mt-1">{col.product_count} products</p>
            </div>
          </div>
        ))}
      </div>

      {collections.length === 0 && !showForm && (
        <div className="text-center py-16">
          <Layers size={40} className="text-warm-light mx-auto mb-4" />
          <p className="text-warm font-sans mb-4">No collections yet</p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-dark text-cream font-sans text-sm font-medium uppercase tracking-wider hover:bg-charcoal transition-colors"
          >
            <Plus size={16} />
            Create First Collection
          </button>
        </div>
      )}
    </div>
  )
}
