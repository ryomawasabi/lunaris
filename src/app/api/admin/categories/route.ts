import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

/** GET /api/admin/categories — list all categories */
export async function GET() {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ categories: data || [] })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/** POST /api/admin/categories — create a category */
export async function POST(req: NextRequest) {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, slug, image } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Check for duplicate name
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('name', name)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'A category with this name already exists' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({ name, slug, image: image || null, product_count: 0 })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ category: data })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/** PATCH /api/admin/categories — update a category */
export async function PATCH(req: NextRequest) {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, name, slug, image } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get old name before updating (to update products referencing it)
    const { data: oldCat } = await supabase
      .from('categories')
      .select('name')
      .eq('id', id)
      .single()

    const updates: Record<string, unknown> = {}
    if (name !== undefined) updates.name = name
    if (slug !== undefined) updates.slug = slug
    if (image !== undefined) updates.image = image

    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If name changed, update all products referencing the old name
    if (name && oldCat && oldCat.name !== name) {
      await supabase
        .from('products')
        .update({ category: name, updated_at: new Date().toISOString() })
        .eq('category', oldCat.name)
    }

    return NextResponse.json({ category: data })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/** DELETE /api/admin/categories — delete a category */
export async function DELETE(req: NextRequest) {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
