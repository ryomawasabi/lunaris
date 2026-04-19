import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch sold-out products (essence oils)
    const { data: products } = await supabase
      .from('products')
      .select('name, slug, is_sold_out')
      .eq('is_sold_out', true)

    // Fetch sold-out stones
    const { data: stones } = await supabase
      .from('stones')
      .select('name, is_sold_out')
      .eq('is_sold_out', true)

    return NextResponse.json({
      soldOutProducts: (products || []).map((p) => p.name),
      soldOutSlugs: (products || []).map((p) => p.slug),
      soldOutStones: (stones || []).map((s) => s.name),
    })
  } catch (error) {
    console.error('Error fetching sold-out status:', error)
    return NextResponse.json(
      { soldOutProducts: [], soldOutSlugs: [], soldOutStones: [] },
      { status: 500 }
    )
  }
}
