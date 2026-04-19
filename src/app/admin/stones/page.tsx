'use client'

import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, AlertCircle, Ban, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAdminStones, toggleStoneSoldOut } from '@/lib/supabase/admin-actions'

const STONE_IMAGES: Record<string, string> = {
  'Smoky Quartz': '/stones/smoky-quartz.png',
  'Aquamarine': '/stones/Aquamarine.png',
  'Amethyst': '/stones/Amethyst.png',
  'Black Obsidian': '/stones/Black Obsidian.png',
  'Green Fluorite': '/stones/Green Fluorite.png',
  'Citrine': '/stones/Citrine.png',
  'Rose Quartz': '/stones/Rose Quartz.png',
  'Carnelian': '/stones/Carnelian.png',
}

interface DbStone {
  id: string
  name: string
  is_sold_out: boolean
  created_at: string
  updated_at: string
}

export default function AdminStonesPage() {
  const [stones, setStones] = useState<DbStone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchStones = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = await getAdminStones()
    if (result.success) {
      setStones(result.data)
    } else {
      setError(result.error || 'Failed to load stones')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStones()
  }, [fetchStones])

  const handleToggleSoldOut = async (stoneId: string, currentSoldOut: boolean) => {
    setActionLoading(stoneId)
    const result = await toggleStoneSoldOut(stoneId, !currentSoldOut)
    if (result.success) {
      setStones((prev) =>
        prev.map((s) =>
          s.id === stoneId ? { ...s, is_sold_out: !currentSoldOut } : s
        )
      )
    } else {
      alert(result.error || 'Failed to toggle sold-out status')
    }
    setActionLoading(null)
  }

  const soldOutCount = stones.filter((s) => s.is_sold_out).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="animate-spin text-warm" size={24} />
        <span className="ml-3 text-warm font-sans">Loading stones...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <p className="text-red-900 text-sm font-sans font-medium">Failed to load stones</p>
          <p className="text-red-700 text-sm font-sans mt-1">{error}</p>
          <button
            onClick={fetchStones}
            className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-sans font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-dark mb-2">Stones</h1>
          <p className="text-warm font-sans">
            Manage crystal stone availability for the Gift Box page ({stones.length} stones, {soldOutCount} sold out)
          </p>
        </div>
        <button
          onClick={fetchStones}
          className="flex items-center gap-2 px-4 py-2 bg-stone-light text-dark font-sans font-medium rounded-lg hover:bg-stone transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stones.map((stone) => {
          const isLoading = actionLoading === stone.id
          return (
            <div
              key={stone.id}
              className={cn(
                'relative rounded-2xl overflow-hidden border-2 transition-all',
                stone.is_sold_out
                  ? 'border-red-300 bg-red-50/50'
                  : 'border-stone-light/60 bg-white'
              )}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={STONE_IMAGES[stone.name] || '/stones/default.png'}
                  alt={stone.name}
                  className={cn(
                    'w-full h-full object-cover',
                    stone.is_sold_out && 'grayscale opacity-50'
                  )}
                />
                {stone.is_sold_out && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-sans font-medium">
                      SOLD OUT
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-serif text-sm text-dark mb-3">{stone.name}</h3>
                <button
                  onClick={() => handleToggleSoldOut(stone.id, stone.is_sold_out)}
                  disabled={isLoading}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-sans font-medium transition-colors disabled:opacity-50',
                    stone.is_sold_out
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  )}
                >
                  {stone.is_sold_out ? (
                    <>
                      <ShoppingBag size={14} />
                      {isLoading ? 'Updating...' : 'Mark In Stock'}
                    </>
                  ) : (
                    <>
                      <Ban size={14} />
                      {isLoading ? 'Updating...' : 'Mark Sold Out'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
