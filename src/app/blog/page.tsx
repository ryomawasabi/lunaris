import { Metadata } from 'next'
import { getBlogPosts, getBlogCategories } from '@/lib/supabase/queries'
import { BlogListClient } from '@/components/blog/BlogListClient'

export const metadata: Metadata = {
  title: 'Journal | YINYANG GUARDIAN',
  description: 'Explore crystal healing guides, wellness tips, and the stories behind our handcrafted jewelry.',
  openGraph: {
    title: 'Journal | YINYANG GUARDIAN',
    description: 'Explore crystal healing guides, wellness tips, and the stories behind our handcrafted jewelry.',
  },
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
  ])

  return <BlogListClient posts={posts} categories={categories} />
}
