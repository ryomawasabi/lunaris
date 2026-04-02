import { createServerSupabaseClient } from './server'
import type { Product, Collection, Category, Review } from '../types'

/**
 * Convert snake_case database fields to camelCase frontend format
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbProductToProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    price: Number(dbProduct.price),
    compareAtPrice: dbProduct.compare_at_price ? Number(dbProduct.compare_at_price) : undefined,
    category: dbProduct.category,
    collection: dbProduct.collection || [],
    gemstone: dbProduct.gemstone,
    symbolicMeaning: dbProduct.symbolic_meaning,
    shortDescription: dbProduct.short_description,
    longDescription: dbProduct.long_description,
    materials: dbProduct.materials || [],
    images: dbProduct.images || [],
    badges: dbProduct.badges || [],
    rating: Number(dbProduct.rating),
    reviewCount: dbProduct.review_count,
    isBestSeller: dbProduct.is_best_seller,
    isNew: dbProduct.is_new,
    isGiftable: dbProduct.is_giftable,
    crystalType: dbProduct.crystal_type || dbProduct.gemstone || '',
    crystalEffects: dbProduct.crystal_effects || [],
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbCollectionToCollection(dbCollection: any): Collection {
  return {
    id: dbCollection.id,
    slug: dbCollection.slug,
    name: dbCollection.name,
    tagline: dbCollection.tagline || '',
    description: dbCollection.description || '',
    longDescription: dbCollection.long_description || '',
    image: dbCollection.image || '',
    symbolism: dbCollection.symbolism || '',
    productCount: dbCollection.product_count,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbCategoryToCategory(dbCategory: any): Category {
  return {
    id: dbCategory.id,
    slug: dbCategory.slug,
    name: dbCategory.name,
    image: dbCategory.image || '',
    productCount: dbCategory.product_count,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbReviewToReview(dbReview: any): Review {
  return {
    id: dbReview.id,
    author: dbReview.author,
    rating: dbReview.rating,
    text: dbReview.text || '',
    date: new Date(dbReview.created_at).toISOString().split('T')[0],
    verified: dbReview.verified,
  }
}

/**
 * Get all products with optional filtering
 */
export async function getProducts(options?: {
  category?: string
  collection?: string
  sortBy?: string
  limit?: number
}): Promise<Product[]> {
  try {
    const supabase = createServerSupabaseClient()
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    if (options?.category) {
      query = query.eq('category', options.category)
    }

    if (options?.collection) {
      query = query.contains('collection', [options.collection])
    }

    if (options?.sortBy === 'price-asc') {
      query = query.order('price', { ascending: true })
    } else if (options?.sortBy === 'price-desc') {
      query = query.order('price', { ascending: false })
    } else if (options?.sortBy === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else if (options?.sortBy === 'rating') {
      query = query.order('rating', { ascending: false })
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return (data || []).map(mapDbProductToProduct)
  } catch (error) {
    console.error('Error in getProducts:', error)
    return []
  }
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    return data ? mapDbProductToProduct(data) : null
  } catch (error) {
    console.error('Error in getProductBySlug:', error)
    return null
  }
}

/**
 * Get best sellers
 */
export async function getBestSellers(limit: number = 8): Promise<Product[]> {
  return getProducts({
    sortBy: 'rating',
    limit,
  }).then((products) => products.filter((p) => p.isBestSeller))
}

/**
 * Get new arrivals
 */
export async function getNewArrivals(limit: number = 8): Promise<Product[]> {
  return getProducts({
    sortBy: 'newest',
    limit,
  }).then((products) => products.filter((p) => p.isNew))
}

/**
 * Get all collections
 */
export async function getCollections(): Promise<Collection[]> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching collections:', error)
      return []
    }

    return (data || []).map(mapDbCollectionToCollection)
  } catch (error) {
    console.error('Error in getCollections:', error)
    return []
  }
}

/**
 * Get collection by slug
 */
export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching collection:', error)
      return null
    }

    return data ? mapDbCollectionToCollection(data) : null
  } catch (error) {
    console.error('Error in getCollectionBySlug:', error)
    return null
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return (data || []).map(mapDbCategoryToCategory)
  } catch (error) {
    console.error('Error in getCategories:', error)
    return []
  }
}

/**
 * Get reviews for a product
 */
export async function getReviewsByProductId(productId: string): Promise<Review[]> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      return []
    }

    return (data || []).map(mapDbReviewToReview)
  } catch (error) {
    console.error('Error in getReviewsByProductId:', error)
    return []
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user) {
      return null
    }

    return data.user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    // Check user_metadata first (no RLS needed)
    if (user.user_metadata?.role === 'admin') {
      return true
    }

    // Fallback: check profiles table
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error || !data) {
      return false
    }

    return data.role === 'admin'
  } catch (error) {
    console.error('Error in isAdmin:', error)
    return false
  }
}
