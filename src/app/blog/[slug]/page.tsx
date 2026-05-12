import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getBlogPosts, getProducts } from '@/lib/supabase/queries'
import { BlogArticleClient } from '@/components/blog/BlogArticleClient'

interface BlogArticlePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata(
  { params }: BlogArticlePageProps,
): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Article Not Found | YINYANG GUARDIAN',
    }
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: {
      canonical: `https://yinyangguardian.com/blog/${params.slug}`,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      authors: post.author ? [post.author] : undefined,
      images: post.coverImage
        ? [
            {
              url: post.coverImage.startsWith('http')
                ? post.coverImage
                : `${post.coverImage}`,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
  }
}

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts()
    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch {
    return []
  }
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const [post, allProducts] = await Promise.all([
    getBlogPostBySlug(params.slug),
    getProducts(),
  ])

  if (!post) {
    notFound()
  }

  // Fetch related products if they exist
  let relatedProducts: typeof allProducts = []
  if (post.relatedProducts && post.relatedProducts.length > 0) {
    relatedProducts = allProducts.filter((p) =>
      post.relatedProducts.includes(p.id),
    )
  }

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    url: `https://yinyangguardian.com/blog/${params.slug}`,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    publisher: {
      '@type': 'Organization',
      name: 'YINYANG GUARDIAN',
      logo: { '@type': 'ImageObject', url: 'https://yinyangguardian.com/icon.svg' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://yinyangguardian.com/blog/${params.slug}`,
    },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://yinyangguardian.com' },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: 'https://yinyangguardian.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://yinyangguardian.com/blog/${params.slug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <BlogArticleClient post={post} relatedProducts={relatedProducts} />
    </>
  )
}
