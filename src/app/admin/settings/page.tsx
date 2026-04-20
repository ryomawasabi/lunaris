'use client'

import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'

interface Settings {
  store_name: string
  store_email: string
  store_phone: string
  store_address: string
  instagram_url: string
  facebook_url: string
  twitter_url: string
  pinterest_url: string
  tiktok_url: string
  free_shipping_threshold: string
  announcement_messages: string
  currency: string
}

interface Toast {
  id: string
  message: string
  type: 'success' | 'error'
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [announcements, setAnnouncements] = useState<string[]>([])
  const [newAnnouncement, setNewAnnouncement] = useState('')

  const loadSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings')
      if (!res.ok) {
        showToast('Failed to load settings', 'error')
        setLoading(false)
        return
      }
      const data: Settings = await res.json()
      setSettings(data)

      // Parse announcement messages
      try {
        const parsed = JSON.parse(data.announcement_messages)
        setAnnouncements(Array.isArray(parsed) ? parsed : [])
      } catch {
        setAnnouncements([])
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      showToast('Failed to load settings', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  const handleSettingChange = (key: keyof Settings, value: string) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : null)
  }

  const addAnnouncement = () => {
    if (newAnnouncement.trim()) {
      const updated = [...announcements, newAnnouncement.trim()]
      setAnnouncements(updated)
      setNewAnnouncement('')
      if (settings) {
        setSettings(prev => prev ? {
          ...prev,
          announcement_messages: JSON.stringify(updated)
        } : null)
      }
    }
  }

  const removeAnnouncement = (index: number) => {
    const updated = announcements.filter((_, i) => i !== index)
    setAnnouncements(updated)
    if (settings) {
      setSettings(prev => prev ? {
        ...prev,
        announcement_messages: JSON.stringify(updated)
      } : null)
    }
  }

  const moveAnnouncement = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === announcements.length - 1)
    ) {
      return
    }

    const updated = [...announcements]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]

    setAnnouncements(updated)
    if (settings) {
      setSettings(prev => prev ? {
        ...prev,
        announcement_messages: JSON.stringify(updated)
      } : null)
    }
  }

  const saveSettings = async () => {
    if (!settings) return

    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!res.ok) {
        const error = await res.json()
        showToast(error.error || 'Failed to save settings', 'error')
        setSaving(false)
        return
      }

      const updated: Settings = await res.json()
      setSettings(updated)
      showToast('Settings saved successfully', 'success')
    } catch (error) {
      console.error('Error saving settings:', error)
      showToast('Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-light p-8 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-gold animate-spin" />
          <p className="font-sans text-warm">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-stone-light p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl text-dark mb-6">Site Settings</h1>
          <div className="bg-white border border-stone-light rounded-lg p-6">
            <p className="text-warm">Failed to load settings. Please try again.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-light p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-dark mb-2">Site Settings</h1>
          <p className="font-sans text-sm text-warm">
            Manage your store information, social media links, and site-wide announcements
          </p>
        </div>

        {/* Toast Notifications */}
        {toasts.length > 0 && (
          <div className="fixed top-6 right-6 z-50 space-y-2">
            {toasts.map(toast => (
              <div
                key={toast.id}
                className={`px-4 py-3 rounded-lg font-sans text-sm font-medium shadow-lg ${
                  toast.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {toast.message}
              </div>
            ))}
          </div>
        )}

        {/* Store Information Section */}
        <div className="bg-white border border-stone-light rounded-lg p-6 mb-6">
          <h2 className="font-serif text-xl text-dark mb-6">Store Information</h2>
          <div className="space-y-4">
            <div>
              <label className="font-sans text-sm font-medium text-dark block mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={settings.store_name}
                onChange={e => handleSettingChange('store_name', e.target.value)}
                className="w-full px-4 py-2 border border-stone-light rounded-lg font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="font-sans text-sm font-medium text-dark block mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.store_email}
                onChange={e => handleSettingChange('store_email', e.target.value)}
                className="w-full px-4 py-2 border border-stone-light rounded-lg font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="font-sans text-sm font-medium text-dark block mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={settings.store_phone}
                onChange={e => handleSettingChange('store_phone', e.target.value)}
                className="w-full px-4 py-2 border border-stone-light rounded-lg font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="font-sans text-sm font-medium text-dark block mb-2">
                Address
              </label>
              <textarea
                value={settings.store_address}
                onChange={e => handleSettingChange('store_address', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-stone-light rounded-lg font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-white border border-stone-light rounded-lg p-6 mb-6">
          <h2 className="font-serif text-xl text-dark mb-6">Social Media Links</h2>
          <div className="space-y-4">
            <div>
              <label className="font-sans text-sm font-medium text-dark block mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagram_url}
                onChange={e => handleSettingChange('instagram_url', e.target.value)}
                className="w-full px-4 py-2 border border-stone-light rounded-lg font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="font-sans text-sm font-medium text-dark block mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebook_url}
                onChange={e => handleSettingChange('facebook_url', e.target.value)}
                className="w-full px-4 py-2 border border-stone-light rounded-lg font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="font-sans text-sm font-medium text-dark block mb-2">
                Twitter URL
              </label>
              <input
                type="url"
                value={settings.twitter_url}
                onChange={e => handleSettingChange('twitter_url', e.target.value)}
                className="w-full px-4 py-2 border border-stone-light rounded-lg font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="font-sans text-sm font-medium text-dark block mb-2">
                Pinterest URL
              </label>
              <input
                type="url"
                value={settings.pinterest_url}
                onChange={e => handleSettingChange('pinterest_url', e.target.value)}
                className="w-full px-4 py-2 border border-stone-light rounded-lg font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="font-sans text-sm font-medium text-dark block mb-2">
                TikTok URL
              </label>
              <input
                type="url"
                value={settings.tiktok_url}
                onChange={e => handleSettingChange('tiktok_url', e.target.value)}
                className="w-full px-4 py-2 border border-stone-light rounded-lg font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Currency Section */}
        <div className="bg-white border border-stone-light rounded-lg p-6 mb-6">
          <h2 className="font-serif text-xl text-dark mb-6">Shipping & Currency</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-sm font-medium text-dark block mb-2">
                Free Shipping Threshold ($)
              </label>
              <input
                type="number"
                value={settings.free_shipping_threshold}
                onChange={e => handleSettingChange('free_shipping_threshold', e.target.value)}
                className="w-full px-4 py-2 border border-stone-light rounded-lg font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="font-sans text-sm font-medium text-dark block mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={e => handleSettingChange('currency', e.target.value)}
                className="w-full px-4 py-2 border border-stone-light rounded-lg font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Announcement Bar Section */}
        <div className="bg-white border border-stone-light rounded-lg p-6 mb-8">
          <h2 className="font-serif text-xl text-dark mb-6">Announcement Bar Messages</h2>
          <p className="font-sans text-sm text-warm mb-4">
            Add rotating messages to display in the announcement bar. Messages will cycle through in order.
          </p>

          {/* Add new announcement */}
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              value={newAnnouncement}
              onChange={e => setNewAnnouncement(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  addAnnouncement()
                }
              }}
              placeholder="Enter announcement message..."
              className="flex-1 px-4 py-2 border border-stone-light rounded-lg font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
            <button
              onClick={addAnnouncement}
              className="px-6 py-2 bg-dark text-cream font-sans font-medium rounded-lg hover:bg-charcoal transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* List of announcements */}
          {announcements.length > 0 ? (
            <div className="space-y-2">
              {announcements.map((announcement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-3 bg-stone-light rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-sans text-sm text-dark">{announcement}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveAnnouncement(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-warm hover:text-dark disabled:text-stone-light disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveAnnouncement(index, 'down')}
                      disabled={index === announcements.length - 1}
                      className="p-1 text-warm hover:text-dark disabled:text-stone-light disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeAnnouncement(index)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-stone-light rounded-lg text-center">
              <p className="font-sans text-sm text-warm">No announcements yet. Add one to get started.</p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button
            onClick={loadSettings}
            disabled={saving}
            className="px-6 py-2 border border-stone-light text-dark font-sans font-medium rounded-lg hover:bg-stone-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-6 py-2 bg-gold text-cream font-sans font-medium rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
