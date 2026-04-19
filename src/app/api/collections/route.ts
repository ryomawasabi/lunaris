import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching collections:', error)
      return NextResponse.json({ collections: [] }, { status: 500 })
    }

    const collections = (data || []).map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      tagline: c.tagline || '',
      description: c.description || '',
      longDescription: c.long_description || '',
      image: c.image || '',
      symbolism: c.symbolism || '',
      productCount: c.product_count,
    }))

    return NextResponse.json({ collections })
  } catch (error) {
    console.error('Error in collections API:', error)
    return NextResponse.json({ collections: [] }, { status: 500 })
  }
}
