'use server'

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
 * Get all products for admin (including inactive)
 */
export async function getAdminProducts() {
  try {
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return { success: false, error: 'Unauthorized', data: [] }
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admin products:', error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error in getAdminProducts:', error)
    return { success: false, error: 'An unexpected error occurred', data: [] }
  }
}

/**
 * Get a single product by ID for admin (including inactive)
 */
export async function getAdminProductById(id: string) {
  try {
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return { success: false, error: 'Unauthorized', data: null }
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in getAdminProductById:', error)
    return { success: false, error: 'An unexpected error occurred', data: null }
  }
}

/**
 * Get all collections for admin
 */
export async function getAdminCollections() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error in getAdminCollections:', error)
    return { success: false, error: 'An unexpected error occurred', data: [] }
  }
}

/**
 * Get all categories for admin
 */
export async function getAdminCategories() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error in getAdminCategories:', error)
    return { success: false, error: 'An unexpected error occurred', data: [] }
  }
}

/**
 * Create a new product (admin only)
 */
export async function createProduct(formData: FormData): Promise<ActionResult> {
  try {
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    const supabase = createServerSupabaseClient()

    const slug = formData.get('slug') as string
    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const compareAtPrice = formData.get('compareAtPrice')
      ? parseFloat(formData.get('compareAtPrice') as string)
      : null
    const category = formData.get('category') as string
    const collectionStr = formData.get('collection') as string
    const collection = collectionStr ? collectionStr.split(',').map((s) => s.trim()).filter(Boolean) : []
    const gemstone = formData.get('gemstone') as string
    const crystalType = (formData.get('crystalType') as string) || gemstone
    const crystalEffectsStr = formData.get('crystalEffects') as string
    const crystalEffects = crystalEffectsStr ? crystalEffectsStr.split(',').map((s) => s.trim()).filter(Boolean) : []
    const symbolicMeaning = formData.get('symbolicMeaning') as string
    const shortDescription = formData.get('shortDescription') as string
    const longDescription = formData.get('longDescription') as string
    const materialsStr = formData.get('materials') as string
    const materials = materialsStr ? materialsStr.split(',').map((s) => s.trim()).filter(Boolean) : []
    const imagesStr = formData.get('images') as string
    const images = imagesStr ? imagesStr.split(',').map((s) => s.trim()).filter(Boolean) : []
    const badgesStr = formData.get('badges') as string
    const badges = badgesStr ? badgesStr.split(',').map((s) => s.trim()).filter(Boolean) : []
    const rating = parseFloat(formData.get('rating') as string) || 0
    const reviewCount = parseInt(formData.get('reviewCount') as string) || 0
    const isBestSeller = formData.get('isBestSeller') === 'true'
    const isNew = formData.get('isNew') === 'true'
    const isGiftable = formData.get('isGiftable') === 'true'

    const { data, error } = await supabase.from('products').insert({
      slug,
      name,
      price,
      compare_at_price: compareAtPrice,
      category,
      collection,
      gemstone,
      crystal_type: crystalType,
      crystal_effects: crystalEffects,
      symbolic_meaning: symbolicMeaning,
      short_description: shortDescription,
      long_description: longDescription,
      materials,
      images,
      badges,
      rating,
      review_count: reviewCount,
      is_best_seller: isBestSeller,
      is_new: isNew,
      is_giftable: isGiftable,
      is_active: true,
    }).select().single()

    if (error) {
      console.error('Database error:', error)
      return { success: false, error: `Failed to create product: ${error.message}` }
    }

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath(`/products/${slug}`)
    revalidatePath('/admin/products')

    return { success: true, data }
  } catch (error) {
    console.error('Error in createProduct:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Update an existing product (admin only)
 */
export async function updateProduct(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    const supabase = createServerSupabaseClient()

    const slug = formData.get('slug') as string
    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const compareAtPrice = formData.get('compareAtPrice')
      ? parseFloat(formData.get('compareAtPrice') as string)
      : null
    const category = formData.get('category') as string
    const collectionStr = formData.get('collection') as string
    const collection = collectionStr ? collectionStr.split(',').map((s) => s.trim()).filter(Boolean) : []
    const gemstone = formData.get('gemstone') as string
    const crystalType = (formData.get('crystalType') as string) || gemstone
    const crystalEffectsStr = formData.get('crystalEffects') as string
    const crystalEffects = crystalEffectsStr ? crystalEffectsStr.split(',').map((s) => s.trim()).filter(Boolean) : []
    const symbolicMeaning = formData.get('symbolicMeaning') as string
    const shortDescription = formData.get('shortDescription') as string
    const longDescription = formData.get('longDescription') as string
    const materialsStr = formData.get('materials') as string
    const materials = materialsStr ? materialsStr.split(',').map((s) => s.trim()).filter(Boolean) : []
    const imagesStr = formData.get('images') as string
    const images = imagesStr ? imagesStr.split(',').map((s) => s.trim()).filter(Boolean) : []
    const badgesStr = formData.get('badges') as string
    const badges = badgesStr ? badgesStr.split(',').map((s) => s.trim()).filter(Boolean) : []
    const rating = parseFloat(formData.get('rating') as string) || 0
    const reviewCount = parseInt(formData.get('reviewCount') as string) || 0
    const isBestSeller = formData.get('isBestSeller') === 'true'
    const isNew = formData.get('isNew') === 'true'
    const isGiftable = formData.get('isGiftable') === 'true'

    const { data, error } = await supabase
      .from('products')
      .update({
        slug,
        name,
        price,
        compare_at_price: compareAtPrice,
        category,
        collection,
        gemstone,
        crystal_type: crystalType,
        crystal_effects: crystalEffects,
        symbolic_meaning: symbolicMeaning,
        short_description: shortDescription,
        long_description: longDescription,
        materials,
        images,
        badges,
        rating,
        review_count: reviewCount,
        is_best_seller: isBestSeller,
        is_new: isNew,
        is_giftable: isGiftable,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return { success: false, error: `Failed to update product: ${error.message}` }
    }

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath(`/products/${slug}`)
    revalidatePath('/admin/products')

    return { success: true, data }
  } catch (error) {
    console.error('Error in updateProduct:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Delete a product (admin only)
 */
export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    const supabase = createServerSupabaseClient()

    const { data: product } = await supabase
      .from('products')
      .select('slug')
      .eq('id', id)
      .single()

    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return { success: false, error: `Failed to delete product: ${error.message}` }
    }

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/products')
    if (product?.slug) {
      revalidatePath(`/products/${product.slug}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error in deleteProduct:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Toggle product active status (admin only)
 */
export async function toggleProductActive(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    const supabase = createServerSupabaseClient()

    const { data: product } = await supabase
      .from('products')
      .select('slug')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('products')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return {
        success: false,
        error: `Failed to toggle product status: ${error.message}`,
      }
    }

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/products')
    if (product?.slug) {
      revalidatePath(`/products/${product.slug}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in toggleProductActive:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Toggle product sold-out status (admin only)
 */
export async function toggleProductSoldOut(id: string, isSoldOut: boolean): Promise<ActionResult> {
  try {
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    const supabase = createServerSupabaseClient()

    const { data: product } = await supabase
      .from('products')
      .select('slug')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('products')
      .update({
        is_sold_out: isSoldOut,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return {
        success: false,
        error: `Failed to toggle sold-out status: ${error.message}`,
      }
    }

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/products')
    revalidatePath('/gift-box')
    if (product?.slug) {
      revalidatePath(`/products/${product.slug}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in toggleProductSoldOut:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Get all stones (admin)
 */
export async function getAdminStones() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('stones')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error in getAdminStones:', error)
    return { success: false, error: 'An unexpected error occurred', data: [] }
  }
}

/**
 * Toggle stone sold-out status (admin only)
 */
export async function toggleStoneSoldOut(id: string, isSoldOut: boolean): Promise<ActionResult> {
  try {
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('stones')
      .update({
        is_sold_out: isSoldOut,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return {
        success: false,
        error: `Failed to toggle stone sold-out status: ${error.message}`,
      }
    }

    revalidatePath('/gift-box')
    revalidatePath('/admin/stones')

    return { success: true, data }
  } catch (error) {
    console.error('Error in toggleStoneSoldOut:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
