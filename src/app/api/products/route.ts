import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch active non-stone products (stones are not shop products)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .neq('category', 'Stones')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ products: [] }, { status: 500 })
    }

    // Map snake_case DB fields to camelCase frontend format
    const products = (data || []).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: Number(p.price),
      compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
      category: p.category,
      collection: p.collection || [],
      gemstone: p.gemstone,
      crystalType: p.crystal_type || p.gemstone || '',
      crystalEffects: p.crystal_effects || [],
      symbolicMeaning: p.symbolic_meaning,
      shortDescription: p.short_description,
      longDescription: p.long_description,
      materials: p.materials || [],
      images: p.images || [],
      badges: p.badges || [],
      rating: Number(p.rating),
      reviewCount: p.review_count,
      isBestSeller: p.is_best_seller,
      isNew: p.is_new,
      isGiftable: p.is_giftable,
      isHidden: !p.is_active,
      isSoldOut: p.is_sold_out || false,
    }))

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error in products API:', error)
    return NextResponse.json({ products: [] }, { status: 500 })
  }
}
