import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

/** GET /api/admin/collections — list all collections */
export async function GET() {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ collections: data || [] })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/** POST /api/admin/collections — create a collection */
export async function POST(req: NextRequest) {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, slug, tagline, description, long_description, image, symbolism } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Check for duplicate name
    const { data: existing } = await supabase
      .from('collections')
      .select('id')
      .eq('name', name)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'A collection with this name already exists' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('collections')
      .insert({
        name,
        slug,
        tagline: tagline || null,
        description: description || null,
        long_description: long_description || null,
        image: image || null,
        symbolism: symbolism || null,
        product_count: 0,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ collection: data })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/** PATCH /api/admin/collections — update a collection */
export async function PATCH(req: NextRequest) {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get old name before updating (to update products referencing it)
    const { data: oldCol } = await supabase
      .from('collections')
      .select('name')
      .eq('id', id)
      .single()

    // Only allow known fields
    const allowed: Record<string, unknown> = {}
    const fields = ['name', 'slug', 'tagline', 'description', 'long_description', 'image', 'symbolism']
    for (const f of fields) {
      if (updates[f] !== undefined) allowed[f] = updates[f]
    }
    allowed.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('collections')
      .update(allowed)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If name changed, update all products referencing the old name in their collection array
    if (updates.name && oldCol && oldCol.name !== updates.name) {
      const { data: products } = await supabase
        .from('products')
        .select('id, collection')
        .contains('collection', [oldCol.name])

      if (products) {
        for (const p of products) {
          const updatedCollection = (p.collection || []).map(
            (c: string) => c === oldCol.name ? updates.name as string : c
          )
          await supabase
            .from('products')
            .update({ collection: updatedCollection, updated_at: new Date().toISOString() })
            .eq('id', p.id)
        }
      }
    }

    return NextResponse.json({ collection: data })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/** DELETE /api/admin/collections — delete a collection */
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
    const { error } = await supabase.from('collections').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
