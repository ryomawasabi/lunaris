'use server'

import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from './server'
import { isAdmin } from './queries'
import { revalidatePath } from 'next/cache'

type ActionResult = {
  success: boolean
  error?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

/**
 * Create a Supabase client with service role key for admin write operations.
 * This bypasses RLS policies which block anon key writes.
 */
function createAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * Get all blog posts for admin (including unpublished)
 */
export async function getAdminBlogPosts() {
  try {
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return { success: false, error: 'Unauthorized', data: [] }
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admin blog posts:', error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error in getAdminBlogPosts:', error)
    return { success: false, error: 'An unexpected error occurred', data: [] }
  }
}

/**
 * Get a single blog post by ID for admin (including unpublished)
 */
export async function getAdminBlogPostById(id: string) {
  try {
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return { success: false, error: 'Unauthorized', data: null }
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching blog post:', error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in getAdminBlogPostById:', error)
    return { success: false, error: 'An unexpected error occurred', data: null }
  }
}

/**
 * Create a new blog post (admin only)
 */
export async function createBlogPost(formData: FormData): Promise<ActionResult> {
  try {
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    const supabase = createAdminSupabaseClient()

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const coverImage = formData.get('coverImage') as string
    const category = formData.get('category') as string
    const tagsStr = formData.get('tags') as string
    const tags = tagsStr ? tagsStr.split(',').map((s) => s.trim()).filter(Boolean) : []
    const author = formData.get('author') as string
    const isPublished = formData.get('isPublished') === 'true'
    const metaTitle = formData.get('metaTitle') as string
    const metaDescription = formData.get('metaDescription') as string
    const relatedProductsStr = formData.get('relatedProducts') as string
    const relatedProducts = relatedProductsStr
      ? relatedProductsStr.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    // If publishing and no published_at, set it to now
    const publishedAt = isPublished ? new Date().toISOString() : null

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        content,
        excerpt,
        cover_image: coverImage,
        category,
        tags,
        author,
        is_published: isPublished,
        published_at: publishedAt,
        meta_title: metaTitle,
        meta_description: metaDescription,
        related_products: relatedProducts,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return { success: false, error: `Failed to create blog post: ${error.message}` }
    }

    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    revalidatePath(`/blog/${slug}`)

    return { success: true, data }
  } catch (error) {
    console.error('Error in createBlogPost:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Update an existing blog post (admin only)
 */
export async function updateBlogPost(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    const supabase = createAdminSupabaseClient()

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const coverImage = formData.get('coverImage') as string
    const category = formData.get('category') as string
    const tagsStr = formData.get('tags') as string
    const tags = tagsStr ? tagsStr.split(',').map((s) => s.trim()).filter(Boolean) : []
    const author = formData.get('author') as string
    const isPublished = formData.get('isPublished') === 'true'
    const metaTitle = formData.get('metaTitle') as string
    const metaDescription = formData.get('metaDescription') as string
    const relatedProductsStr = formData.get('relatedProducts') as string
    const relatedProducts = relatedProductsStr
      ? relatedProductsStr.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    // Get current post to check if we need to set published_at
    const { data: currentPost } = await supabase
      .from('blog_posts')
      .select('is_published, published_at')
      .eq('id', id)
      .single()

    // If publishing for the first time, set published_at
    let publishedAt = currentPost?.published_at
    if (isPublished && !currentPost?.published_at) {
      publishedAt = new Date().toISOString()
    } else if (!isPublished) {
      publishedAt = null
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title,
        slug,
        content,
        excerpt,
        cover_image: coverImage,
        category,
        tags,
        author,
        is_published: isPublished,
        published_at: publishedAt,
        meta_title: metaTitle,
        meta_description: metaDescription,
        related_products: relatedProducts,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return { success: false, error: `Failed to update blog post: ${error.message}` }
    }

    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    revalidatePath(`/blog/${slug}`)

    return { success: true, data }
  } catch (error) {
    console.error('Error in updateBlogPost:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Delete a blog post (admin only)
 */
export async function deleteBlogPost(id: string): Promise<ActionResult> {
  try {
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    const supabase = createAdminSupabaseClient()

    const { data: post } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('id', id)
      .single()

    const { error } = await supabase.from('blog_posts').delete().eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return { success: false, error: `Failed to delete blog post: ${error.message}` }
    }

    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    if (post?.slug) {
      revalidatePath(`/blog/${post.slug}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error in deleteBlogPost:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Toggle blog post published status (admin only)
 */
export async function toggleBlogPostPublished(
  id: string,
  isPublished: boolean
): Promise<ActionResult> {
  try {
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    const supabase = createAdminSupabaseClient()

    const { data: post } = await supabase
      .from('blog_posts')
      .select('slug, published_at')
      .eq('id', id)
      .single()

    // If publishing and no published_at, set it to now
    const publishedAt = isPublished && !post?.published_at ? new Date().toISOString() : post?.published_at

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        is_published: isPublished,
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return {
        success: false,
        error: `Failed to toggle blog post status: ${error.message}`,
      }
    }

    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    if (post?.slug) {
      revalidatePath(`/blog/${post.slug}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in toggleBlogPostPublished:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
