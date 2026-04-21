'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { ProductCard } from '@/components/product/ProductCard'
import type { BlogPost, Product } from '@/lib/types'

interface BlogArticleClientProps {
  post: BlogPost
  relatedProducts: Product[]
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

function calculateReadingTime(content: string): number {
  // Strip HTML tags
  const plainText = content.replace(/<[^>]*>/g, '')
  // Count words
  const wordCount = plainText.split(/\s+/).filter((word) => word.length > 0).length
  // Assume 200 words per minute
  return Math.ceil(wordCount / 200)
}

function getCoverImageUrl(coverImage: string | null | undefined): string {
  if (!coverImage) return ''
  if (coverImage.startsWith('/')) {
    return coverImage
  }
  if (coverImage.includes('supabase')) {
    return coverImage
  }
  return `/${coverImage}`
}

export function BlogArticleClient({ post, relatedProducts }: BlogArticleClientProps) {
  const { t } = useLanguage()
  const readingTime = calculateReadingTime(post.content)
  const coverImageUrl = getCoverImageUrl(post.coverImage)

  return (
    <main className="min-h-screen bg-cream">
      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-stone-light"
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-warm hover:text-dark transition-colors font-sans text-sm uppercase tracking-wider group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t('blog.backToJournal') || 'Back to Journal'}
          </Link>
        </div>
      </motion.div>

      {/* Article Container */}
      <article className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        {/* Cover Image */}
        {coverImageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative w-full h-96 md:h-[500px] mb-12 rounded-sm overflow-hidden"
          >
            <Image
              src={coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 pb-8 border-b border-stone-light"
        >
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 text-xs uppercase tracking-wider font-sans bg-stone-light text-warm rounded-full">
              {post.category || 'Wellness'}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-dark mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8 text-sm font-sans text-warm">
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {post.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishedAt || ''}>
                  {formatDate(post.publishedAt)}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="prose prose-custom max-w-none mb-12"
        >
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="py-8 border-t border-b border-stone-light mb-12"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Tag className="w-5 h-5 text-warm" />
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs uppercase tracking-wider font-sans bg-stone-light text-warm rounded-full hover:bg-stone transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="font-serif text-3xl text-dark mb-8">
              {t('blog.relatedProducts') || 'Related Products'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Back to Journal Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pt-8 border-t border-stone-light text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 bg-dark text-cream hover:bg-charcoal transition-colors font-sans text-sm font-medium uppercase tracking-wider"
          >
            {t('blog.backToJournal') || 'Back to Journal'}
          </Link>
        </motion.div>
      </article>

      {/* CSS for Prose Styling */}
      <style jsx>{`
        :global(.prose-content h1),
        :global(.prose-content h2),
        :global(.prose-content h3) {
          font-family: 'Serif', serif;
          color: #2c2c2c;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          line-height: 1.3;
        }

        :global(.prose-content h1) {
          font-size: 2.25em;
        }

        :global(.prose-content h2) {
          font-size: 1.875em;
          border-bottom: 1px solid #d4cdc4;
          padding-bottom: 0.5em;
        }

        :global(.prose-content h3) {
          font-size: 1.5em;
        }

        :global(.prose-content p) {
          font-size: 1.125em;
          line-height: 1.75;
          color: #2c2c2c;
          margin-bottom: 1em;
        }

        :global(.prose-content a) {
          color: #b8860b;
          text-decoration: none;
          transition: color 0.2s;
        }

        :global(.prose-content a:hover) {
          color: #8b7d6b;
          text-decoration: underline;
        }

        :global(.prose-content strong) {
          color: #2c2c2c;
          font-weight: 600;
        }

        :global(.prose-content em) {
          font-style: italic;
          color: #5a5a5a;
        }

        :global(.prose-content blockquote) {
          border-left: 4px solid #b8860b;
          padding-left: 1.5em;
          margin-left: 0;
          margin-right: 0;
          margin-top: 1.5em;
          margin-bottom: 1.5em;
          color: #8b7d6b;
          font-style: italic;
          background: rgba(184, 134, 11, 0.05);
          padding: 1em 1.5em;
        }

        :global(.prose-content ul),
        :global(.prose-content ol) {
          margin: 1.5em 0;
          padding-left: 2em;
          color: #2c2c2c;
        }

        :global(.prose-content li) {
          margin-bottom: 0.5em;
          line-height: 1.75;
        }

        :global(.prose-content ul li) {
          list-style-type: disc;
        }

        :global(.prose-content ol li) {
          list-style-type: decimal;
        }

        :global(.prose-content code) {
          background: #f5f5f0;
          color: #2c2c2c;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.9em;
        }

        :global(.prose-content pre) {
          background: #2c2c2c;
          color: #faf8f5;
          padding: 1.5em;
          border-radius: 4px;
          overflow-x: auto;
          margin: 1.5em 0;
        }

        :global(.prose-content pre code) {
          background: none;
          color: inherit;
          padding: 0;
        }

        :global(.prose-content img) {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 2em 0;
        }

        :global(.prose-content table) {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
        }

        :global(.prose-content th),
        :global(.prose-content td) {
          border: 1px solid #d4cdc4;
          padding: 0.75em;
          text-align: left;
        }

        :global(.prose-content th) {
          background: #f5f5f0;
          color: #2c2c2c;
          font-weight: 600;
        }

        :global(.prose-content hr) {
          border: none;
          border-top: 2px solid #d4cdc4;
          margin: 2em 0;
        }
      `}</style>
    </main>
  )
}
