'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useLanguage } from '@/components/providers/LanguageProvider'
import type { BlogPost } from '@/lib/types'

interface BlogListClientProps {
  posts: BlogPost[]
  categories: string[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getCoverImageUrl(coverImage: string | null | undefined): string {
  if (!coverImage) return ''
  // Handle relative URLs
  if (coverImage.startsWith('/')) {
    return coverImage
  }
  // Handle Supabase URLs
  if (coverImage.includes('supabase')) {
    return coverImage
  }
  // Assume it's a relative path in public
  return `/${coverImage}`
}

function GradientPlaceholder() {
  return (
    <div className="w-full h-64 bg-gradient-to-br from-warm-light via-stone-light to-stone flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-warm/20 mx-auto mb-4" />
        <p className="text-warm text-sm">Crystal Journal</p>
      </div>
    </div>
  )
}

export function BlogListClient({ posts, categories }: BlogListClientProps) {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts
    return posts.filter((post) => post.category === selectedCategory)
  }, [posts, selectedCategory])

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 border-b border-stone-light">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-dark mb-4">
              {t('blog.title') || 'Journal'}
            </h1>
            <p className="font-sans text-warm text-lg md:text-xl leading-relaxed">
              {t('blog.subtitle') || 'Explore crystal healing guides, wellness tips, and the stories behind our handcrafted jewelry.'}
            </p>
            <div className="mt-8 h-1 w-16 bg-gold mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b border-stone-light bg-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm uppercase tracking-wider text-warm font-sans">
              {t('blog.filterBy') || 'Filter:'}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 text-sm font-sans uppercase tracking-wider transition-all ${
                selectedCategory === null
                  ? 'bg-dark text-cream'
                  : 'bg-stone-light text-dark hover:bg-stone'
              }`}
            >
              {t('blog.allPosts') || 'All Posts'}
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-sans uppercase tracking-wider transition-all ${
                  selectedCategory === category
                    ? 'bg-dark text-cream'
                    : 'bg-stone-light text-dark hover:bg-stone'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <>
              {/* Results Count */}
              <div className="mb-8">
                <p className="text-sm text-warm font-sans">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                </p>
              </div>

              {/* Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredPosts.map((post) => {
                  const coverImageUrl = getCoverImageUrl(post.coverImage)

                  return (
                    <motion.article
                      key={post.id}
                      variants={cardVariants}
                      whileHover={{ y: -8 }}
                      className="group overflow-hidden"
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <div className="relative overflow-hidden bg-stone-light h-64 mb-6 rounded-sm">
                          {coverImageUrl ? (
                            <Image
                              src={coverImageUrl}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <GradientPlaceholder />
                          )}
                        </div>
                      </Link>

                      <div>
                        {/* Category Badge */}
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 text-xs uppercase tracking-wider font-sans bg-stone-light text-warm rounded-full">
                            {post.category || 'Wellness'}
                          </span>
                        </div>

                        {/* Title */}
                        <Link href={`/blog/${post.slug}`}>
                          <h3 className="font-serif text-xl md:text-2xl text-dark mb-3 group-hover:text-warm transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>

                        {/* Excerpt */}
                        <p className="text-warm font-sans text-base leading-relaxed mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-sm text-warm font-sans mb-4">
                          <time dateTime={post.publishedAt || ''}>
                            {formatDate(post.publishedAt)}
                          </time>
                          {post.author && (
                            <span>By {post.author}</span>
                          )}
                        </div>

                        {/* Read More Link */}
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 text-warm hover:text-gold transition-colors font-sans text-sm uppercase tracking-wider group"
                        >
                          {t('blog.readMore') || 'Read More'}
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                      </div>
                    </motion.article>
                  )
                })}
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <h3 className="font-serif text-2xl text-dark mb-4">
                {t('blog.noArticles') || 'No Articles Found'}
              </h3>
              <p className="text-warm mb-8">
                {selectedCategory
                  ? `${t('blog.noArticlesInCategory') || 'No articles found in this category.'}`
                  : `${t('blog.noArticlesYet') || 'Check back soon for spiritual wisdom and crystal insights.'}`}
              </p>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-dark text-cream hover:bg-charcoal transition-colors text-sm font-sans font-medium uppercase tracking-wider"
                >
                  {t('blog.viewAllPosts') || 'View All Posts'}
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
}
