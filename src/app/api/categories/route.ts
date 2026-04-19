import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ categories: [] }, { status: 500 })
    }

    const categories = (data || []).map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      image: c.image || '',
      productCount: c.product_count,
    }))

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error in categories API:', error)
    return NextResponse.json({ categories: [] }, { status: 500 })
  }
}
