import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ wishlist: [] })
    }

    // Fetch user's wishlist
    const { data, error } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', user.id)

    // If table doesn't exist, return empty array
    if (error?.code === 'PGRST116' || error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
      return NextResponse.json({ wishlist: [] })
    }

    if (error) {
      console.error('Error fetching wishlist:', error)
      return NextResponse.json({ wishlist: [] })
    }

    const wishlist = (data || []).map((item) => item.product_id)
    return NextResponse.json({ wishlist })
  } catch (error) {
    console.error('Error in wishlist API GET:', error)
    return NextResponse.json({ wishlist: [] })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { product_id } = await request.json()

    if (!product_id || typeof product_id !== 'string') {
      return NextResponse.json({ error: 'product_id is required and must be a string' }, { status: 400 })
    }

    // Add to wishlist
    const { error } = await supabase.from('wishlists').insert({
      user_id: user.id,
      product_id,
      created_at: new Date().toISOString(),
    })

    // If table doesn't exist, still return success (graceful degradation)
    if (error?.code === 'PGRST116' || error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
      return NextResponse.json({ success: true })
    }

    if (error && error.code !== '23505') {
      // 23505 is unique constraint violation (item already in wishlist)
      console.error('Error adding to wishlist:', error)
      return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in wishlist API POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { product_id } = await request.json()

    if (!product_id || typeof product_id !== 'string') {
      return NextResponse.json({ error: 'product_id is required and must be a string' }, { status: 400 })
    }

    // Remove from wishlist
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', product_id)

    // If table doesn't exist, still return success (graceful degradation)
    if (error?.code === 'PGRST116' || error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
      return NextResponse.json({ success: true })
    }

    if (error) {
      console.error('Error removing from wishlist:', error)
      return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in wishlist API DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
