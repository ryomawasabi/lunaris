import { NextResponse, NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ products: [] })
    }

    // Sanitize input: limit length and remove special characters that could break Supabase filters
    const sanitized = query.trim().slice(0, 100).replace(/[%_"'\\{}()]/g, '')
    if (sanitized.length === 0) {
      return NextResponse.json({ products: [] })
    }

    const supabase = createServerSupabaseClient()
    const searchTerm = `%${sanitized}%`

    // Search across multiple fields using ilike (case-insensitive)
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, name, price, images, category, short_description, gemstone, crystal_type, materials')
      .eq('is_active', true)
      .neq('category', 'Stones')
      .or(
        `name.ilike.${searchTerm},short_description.ilike.${searchTerm},category.ilike.${searchTerm},gemstone.ilike.${searchTerm},crystal_type.ilike.${searchTerm}`
      )
      .limit(10)

    if (error) {
      console.error('Error searching products:', error)
      return NextResponse.json({ products: [] }, { status: 500 })
    }

    // Map results to frontend format
    const products = (data || []).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: Number(p.price),
      images: p.images || [],
      category: p.category,
    }))

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error in search API:', error)
    return NextResponse.json({ products: [] }, { status: 500 })
  }
}
