import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    // Use getUser() for server-side verification (not getSession which trusts the JWT)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 })
    }

    // Check 1: user_metadata (set during signup or by admin)
    if (user.user_metadata?.role === 'admin') {
      return NextResponse.json({ isAdmin: true })
    }

    // Check 2: profiles table fallback
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ isAdmin: false }, { status: 403 })
    }

    return NextResponse.json({ isAdmin: data.role === 'admin' })
  } catch {
    return NextResponse.json({ isAdmin: false }, { status: 500 })
  }
}
