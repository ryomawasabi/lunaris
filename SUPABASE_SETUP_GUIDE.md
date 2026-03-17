# Supabase Integration Setup Guide for LUNARIS

## Overview

This guide walks you through integrating Supabase authentication and database into your LUNARIS Next.js e-commerce project. All required files have been created for you.

## Files Created

### 1. Configuration Files
- `.env.local` - Environment variables (root)
- `src/middleware.ts` - Next.js middleware for session management
- `src/lib/supabase/client.ts` - Browser client for client-side operations
- `src/lib/supabase/server.ts` - Server client for server-side operations
- `src/lib/supabase/middleware.ts` - Middleware helper for session updates

### 2. Database & Types
- `supabase-schema.sql` - Complete database schema with RLS policies
- `supabase-seed.sql` - Seed data with all 20 products, 7 collections, 6 categories, 10 reviews
- `src/lib/supabase/types.ts` - TypeScript types matching the database schema

### 3. Data Functions
- `src/lib/supabase/queries.ts` - Server-side data fetching functions
- `src/lib/supabase/admin-actions.ts` - Admin server actions for CRUD operations

## Setup Steps

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Name: "LUNARIS" (or your preference)
   - Database Password: Generate a secure password
   - Region: Choose closest to you
5. Click "Create new project" and wait for initialization (2-3 minutes)

### Step 2: Get Your Credentials

1. In Supabase dashboard, go to **Settings > API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon (public)** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Open `.env.local` in your project root and update:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### Step 3: Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open `supabase-schema.sql` from your project root
4. Copy ALL the SQL and paste it into the Supabase SQL Editor
5. Click **Run** and wait for completion
   - You'll see the confirmation "18 rows affected" or similar
   - Check the console for any errors

### Step 4: Seed the Database

1. In Supabase **SQL Editor**, click **New Query**
2. Open `supabase-seed.sql` from your project root
3. Copy ALL the SQL and paste it into the new query
4. Click **Run**
   - You should see confirmations for inserts (6 categories, 7 collections, 20 products, 10 reviews)
   - The reviews use UNION ALL with SELECT to link to actual product IDs

### Step 5: Enable Authentication

1. Go to **Authentication > Providers** in Supabase
2. Ensure "Email" provider is enabled (should be by default)
3. (Optional) Enable social providers (Google, GitHub, etc.)

### Step 6: Test the Setup

```bash
# Start your dev server
npm run dev

# Visit http://localhost:3000
# Try signing up with an email
```

First user will be created as "customer" role. To make yourself an admin, run this in Supabase SQL Editor:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Using the Supabase Integration in Your Code

### Server Components (Recommended)

```typescript
import { getProducts, getProductBySlug, getCollections } from '@/lib/supabase/queries'

export default async function ProductsPage() {
  const products = await getProducts({ category: 'Bracelets', limit: 12 })
  const collections = await getCollections()

  return (
    <div>
      {/* Use products and collections */}
    </div>
  )
}
```

### Available Query Functions

**Products:**
- `getProducts(options?)` - Get all active products with optional filtering
  - `category?: string` - Filter by category
  - `collection?: string` - Filter by collection
  - `sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'rating'`
  - `limit?: number`
- `getProductBySlug(slug: string)` - Get single product
- `getBestSellers(limit?: number)` - Get bestselling products
- `getNewArrivals(limit?: number)` - Get new products

**Collections & Categories:**
- `getCollections()` - Get all collections
- `getCollectionBySlug(slug: string)` - Get single collection
- `getCategories()` - Get all categories

**Reviews:**
- `getReviewsByProductId(productId: string)` - Get reviews for a product

**Authentication:**
- `getCurrentUser()` - Get logged-in user
- `isAdmin()` - Check if user is admin

### Admin Server Actions

```typescript
'use client'

import { createProduct, updateProduct, deleteProduct, toggleProductActive } from '@/lib/supabase/admin-actions'

export function AdminForm() {
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget)
    const result = await createProduct(formData)

    if (result.success) {
      console.log('Product created!')
    } else {
      console.error(result.error)
    }
  }

  return (
    <form onSubmit={handleCreate}>
      {/* form fields */}
    </form>
  )
}
```

**Available Admin Actions:**
- `createProduct(formData)` - Create new product
- `updateProduct(id, formData)` - Update product
- `deleteProduct(id)` - Delete product
- `toggleProductActive(id, isActive)` - Toggle product visibility

All admin actions:
1. Check if user is admin (returns error if not)
2. Validate data
3. Update database
4. Revalidate relevant pages for fresh data
5. Return `{ success: boolean; error?: string; data?: any }`

### Client Components with Authentication

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function UserProfile() {
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  return user ? <p>Hello {user.email}</p> : <p>Not logged in</p>
}
```

## Database Schema Overview

### Tables

**profiles** - User profiles (extends auth.users)
- `id` (UUID) - User ID from auth
- `email` (TEXT) - User email
- `full_name` (TEXT) - User's full name
- `role` (TEXT) - 'customer' or 'admin'
- `created_at`, `updated_at` (TIMESTAMPTZ)

**products** - Product catalog
- All fields including snake_case versions (price, compare_at_price, etc.)
- Arrays for collection, materials, images, badges
- Boolean flags: is_best_seller, is_new, is_giftable, is_active

**collections** - Product collections (Protection, Love & Harmony, etc.)
- `slug` (UNIQUE) - URL-friendly identifier
- `long_description`, `symbolism` - Rich content

**categories** - Product categories (Bracelets, Necklaces, etc.)
- `slug` (UNIQUE)
- `product_count` - Denormalized count

**reviews** - Product reviews
- Links to products via `product_id`
- Author, rating (1-5), text, verified flag

### Row Level Security (RLS)

The schema includes comprehensive RLS policies:

- **Products**: Anyone can view active products, only admins can modify
- **Collections/Categories**: Anyone can view, only admins can modify
- **Reviews**: Anyone can read, authenticated users can create, admins can manage
- **Profiles**: Users can view/edit their own, admins can view all

## Important Notes

### Data Type Mapping

The database uses snake_case (SQL convention), frontend uses camelCase (JavaScript convention). The `queries.ts` file handles mapping automatically.

Example mappings:
- `compare_at_price` → `compareAtPrice`
- `short_description` → `shortDescription`
- `is_best_seller` → `isBestSeller`
- `review_count` → `reviewCount`

### Performance

- All queries are optimized with appropriate indexes
- Use server components (default in Next.js 14) for data fetching
- The middleware automatically refreshes auth session on every request
- Consider using `revalidateTag()` for more granular cache control

### Security

- Environment variables are public (NEXT_PUBLIC_*) but safe for Supabase anonymous key
- Session tokens are stored in httpOnly cookies via middleware
- Sensitive operations (admin actions) verify user role server-side
- RLS policies enforce database-level security

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` values in Supabase dashboard
- Ensure you're using the `anon` (public) key, not `service_role`

### Products not showing
- Verify `is_active` is `true` in database
- Check that you ran `supabase-seed.sql` successfully

### Authentication not persisting
- Ensure middleware.ts is in src/ (not app/)
- Check browser cookies are enabled
- Verify .env.local values are correct

### Admin actions returning "Unauthorized"
- Ensure your user profile has `role = 'admin'` in database
- Run: `UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';`

### RLS Policy Errors
- When testing, check your user is authenticated (`auth.uid()` must be set)
- Verify the specific RLS policy allows the operation

## Next Steps

1. ✅ Update `.env.local` with your Supabase credentials
2. ✅ Run `supabase-schema.sql` in Supabase SQL Editor
3. ✅ Run `supabase-seed.sql` in Supabase SQL Editor
4. ✅ Make yourself an admin with the UPDATE query
5. Start using `getProducts()`, `getCollections()`, etc. in your pages
6. Create admin pages using the admin server actions
7. Set up authentication UI (login, signup, logout)

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Realtime Features](https://supabase.com/docs/guides/realtime) (for live updates)
