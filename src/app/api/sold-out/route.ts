import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch sold-out essence oils
    const { data: oils } = await supabase
      .from('products')
      .select('name, slug')
      .eq('category', 'Essence Oils')
      .eq('is_sold_out', true)

    // Fetch sold-out stones (now in products table with category 'Stones')
    const { data: stones } = await supabase
      .from('products')
      .select('name, slug')
      .eq('category', 'Stones')
      .eq('is_sold_out', true)

    return NextResponse.json({
      soldOutProducts: (oils || []).map((p) => p.name),
      soldOutSlugs: (oils || []).map((p) => p.slug),
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
