'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Eye, EyeOff, Trash2, Pencil, RefreshCw, AlertCircle, FileText, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAdminBlogPosts, deleteBlogPost, toggleBlogPostPublished } from '@/lib/supabase/blog-actions'

interface BlogPost {
  id: string
  slug: string
  title: string
  category: string
  is_published: boolean
  created_at: string
  published_at: string | null
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = await getAdminBlogPosts()
    if (result.success) {
      setPosts(result.data)
    } else {
      setError(result.error || 'Failed to load blog posts')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterStatus === 'draft') return matchesSearch && !post.is_published
    if (filterStatus === 'published') return matchesSearch && post.is_published
    return matchesSearch
  })

  const publishedCount = posts.filter((p) => p.is_published).length
  const draftCount = posts.filter((p) => !p.is_published).length

  const handleTogglePublished = async (postId: string, currentPublished: boolean) => {
    setActionLoading(postId)
    try {
      const result = await toggleBlogPostPublished(postId, !currentPublished)
      if (result.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, is_published: !currentPublished } : p
          )
        )
      } else {
        alert(result.error || 'Failed to toggle post status')
      }
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'))
    }
    setActionLoading(null)
  }

  const handleDelete = async (postId: string) => {
    setActionLoading(postId)
    try {
      const result = await deleteBlogPost(postId)
      if (result.success) {
        setPosts((prev) => prev.filter((p) => p.id !== postId))
      } else {
        alert(result.error || 'Failed to delete blog post')
      }
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'))
    }
    setDeleteConfirm(null)
    setActionLoading(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="animate-spin text-warm" size={24} />
        <span className="ml-3 text-warm font-sans">Loading blog posts...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <p className="text-red-900 text-sm font-sans font-medium">Failed to load blog posts</p>
          <p className="text-red-700 text-sm font-sans mt-1">{error}</p>
          <button
            onClick={fetchPosts}
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
          <h1 className="font-serif text-3xl text-dark mb-2">Blog Posts</h1>
          <p className="text-warm font-sans">
            Manage your blog content ({posts.length} total)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchPosts}
            className="flex items-center gap-2 px-4 py-2 bg-stone-light text-dark font-sans font-medium rounded-lg hover:bg-stone transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-4 py-2 bg-dark text-cream font-sans font-medium rounded-lg hover:bg-charcoal transition-colors"
          >
            <Plus size={18} />
            New Post
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus('all')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors',
            filterStatus === 'all'
              ? 'bg-dark text-cream'
              : 'bg-stone-light text-warm hover:bg-stone'
          )}
        >
          All ({posts.length})
        </button>
        <button
          onClick={() => setFilterStatus('published')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors',
            filterStatus === 'published'
              ? 'bg-emerald-600 text-white'
              : 'bg-stone-light text-warm hover:bg-stone'
          )}
        >
          Published ({publishedCount})
        </button>
        <button
          onClick={() => setFilterStatus('draft')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors',
            filterStatus === 'draft'
              ? 'bg-gray-600 text-white'
              : 'bg-stone-light text-warm hover:bg-stone'
          )}
        >
          Draft ({draftCount})
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-warm-light" size={18} />
        <input
          type="text"
          placeholder="Search posts by title or slug..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-stone-light rounded-lg font-sans text-dark placeholder-warm-light focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-light rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-light bg-stone-light">
                <th className="px-6 py-4 text-left text-xs font-sans font-semibold text-dark uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-sans font-semibold text-dark uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-sans font-semibold text-dark uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-sans font-semibold text-dark uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-sans font-semibold text-dark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => {
                const isConfirmingDelete = deleteConfirm === post.id
                const isLoading = actionLoading === post.id
                return (
                  <tr
                    key={post.id}
                    className={cn(
                      'border-b border-stone-light transition-colors',
                      !post.is_published
                        ? 'bg-gray-50 opacity-60'
                        : isConfirmingDelete
                          ? 'bg-red-50'
                          : 'hover:bg-cream'
                    )}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-sans font-medium text-dark">
                          {post.title}
                        </p>
                        <p className="text-xs text-warm-light font-sans">
                          {post.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-sans text-warm">
                        {post.category}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {post.is_published ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-medium bg-emerald-100 text-emerald-700">
                          Published
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-medium bg-gray-200 text-gray-600">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-sans text-warm">
                        {formatDate(post.is_published && post.published_at ? post.published_at : post.created_at)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {isConfirmingDelete ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={isLoading}
                            className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {isLoading ? 'Deleting...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-stone-light text-warm hover:bg-stone transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/blog/${post.id}/edit`}
                            className="p-2 rounded-lg bg-stone-light text-warm hover:bg-blue-100 hover:text-blue-600 transition-colors"
                            title="Edit post"
                          >
                            <Pencil size={16} />
                          </Link>
                          {post.is_published && (
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-stone-light text-warm hover:bg-gold/20 hover:text-gold transition-colors"
                              title="View on site"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                          <button
                            onClick={() => handleTogglePublished(post.id, post.is_published)}
                            disabled={isLoading}
                            className={cn(
                              'p-2 rounded-lg transition-colors disabled:opacity-50',
                              post.is_published
                                ? 'bg-stone-light text-warm hover:bg-gray-200 hover:text-gray-600'
                                : 'bg-gray-200 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600'
                            )}
                            title={post.is_published ? 'Unpublish post' : 'Publish post'}
                          >
                            {post.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(post.id)}
                            className="p-2 rounded-lg bg-stone-light text-warm hover:bg-red-100 hover:text-red-600 transition-colors"
                            title="Delete post"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto text-warm-light mb-3" size={32} />
            <p className="text-warm font-sans">No blog posts found</p>
            {posts.length === 0 && (
              <p className="text-warm-light text-sm font-sans mt-1">
                Get started by <Link href="/admin/blog/new" className="underline hover:text-warm transition-colors">creating your first post</Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
