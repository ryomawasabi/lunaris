'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProduct, toggleProductActive } from '@/lib/supabase/admin-actions'
import { Trash2, Eye, EyeOff, Loader } from 'lucide-react'

interface ProductActionsProps {
  productId: string
  isActive: boolean
}

export function ProductActions({ productId, isActive }: ProductActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setShowDeleteConfirm(false)
      return
    }

    setIsDeleting(true)
    setError('')

    try {
      const result = await deleteProduct(productId)

      if (!result.success) {
        setError(result.error || 'Failed to delete product')
      } else {
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred while deleting')
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggle = async () => {
    setIsToggling(true)
    setError('')

    try {
      const result = await toggleProductActive(productId, !isActive)

      if (!result.success) {
        setError(result.error || 'Failed to toggle product status')
      } else {
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred while updating')
      console.error(err)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {error && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-sans whitespace-nowrap">
          {error}
        </div>
      )}

      {/* Toggle Active/Inactive */}
      <button
        onClick={handleToggle}
        disabled={isToggling}
        className="p-2 hover:bg-stone-light rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={isActive ? 'Deactivate product' : 'Activate product'}
      >
        {isToggling ? (
          <Loader size={16} className="text-warm animate-spin" />
        ) : isActive ? (
          <Eye size={16} className="text-gold" />
        ) : (
          <EyeOff size={16} className="text-warm-light" />
        )}
      </button>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={isDeleting || showDeleteConfirm}
        className="p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete product"
      >
        {isDeleting ? (
          <Loader size={16} className="text-red-600 animate-spin" />
        ) : (
          <Trash2 size={16} className="text-red-600" />
        )}
      </button>
    </div>
  )
}
