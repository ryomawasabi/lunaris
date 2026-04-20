import { createServerSupabaseClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/supabase/queries'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const DEFAULT_SETTINGS = {
  store_name: 'YINYANG GUARDIAN',
  store_email: '',
  store_phone: '',
  store_address: '',
  instagram_url: 'https://instagram.com',
  facebook_url: 'https://facebook.com',
  twitter_url: 'https://twitter.com',
  pinterest_url: 'https://pinterest.com',
  tiktok_url: '',
  free_shipping_threshold: '150',
  announcement_messages: '["Free Shipping on Orders Over $150"]',
  currency: 'USD',
}

export async function GET() {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()

    // Try to fetch settings from the table
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')

    // If table doesn't exist or no data, return defaults
    if (error) {
      console.log('Settings table not found or error:', error.message)
      return NextResponse.json(DEFAULT_SETTINGS)
    }

    // Merge fetched settings with defaults
    const settings: Record<string, string> = { ...DEFAULT_SETTINGS }

    if (data) {
      data.forEach((item: { key: string; value: string }) => {
        settings[item.key] = item.value
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()
    const updates = await request.json()

    // Validate that updates is an object
    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Check if table exists by attempting to fetch
    const { error: tableCheckError } = await supabase
      .from('site_settings')
      .select('key')
      .limit(1)

    if (tableCheckError && tableCheckError.code === 'PGRST116') {
      // Table doesn't exist, return error
      return NextResponse.json(
        { error: 'Settings table does not exist' },
        { status: 500 }
      )
    }

    // Update each setting
    for (const [key, value] of Object.entries(updates)) {
      if (!Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS, key)) {
        return NextResponse.json(
          { error: `Unknown setting key: ${key}` },
          { status: 400 }
        )
      }

      const { error: upsertError } = await supabase
        .from('site_settings')
        .upsert(
          { key, value: String(value) },
          { onConflict: 'key' }
        )

      if (upsertError) {
        console.error(`Error upserting setting ${key}:`, upsertError)
        return NextResponse.json(
          { error: `Failed to update setting: ${key}` },
          { status: 500 }
        )
      }
    }

    // Fetch and return all settings after update
    const { data, error: fetchError } = await supabase
      .from('site_settings')
      .select('key, value')

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch updated settings' },
        { status: 500 }
      )
    }

    const settings: Record<string, string> = { ...DEFAULT_SETTINGS }
    if (data) {
      data.forEach((item: { key: string; value: string }) => {
        settings[item.key] = item.value
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
