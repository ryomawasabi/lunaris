# Supabase Quick Reference

## Environment Setup
```bash
# 1. Update .env.local in project root
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Database Setup
```sql
-- 1. Run supabase-schema.sql in Supabase SQL Editor
-- 2. Run supabase-seed.sql in Supabase SQL Editor
-- 3. Make yourself admin:
UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Using in Server Components

### Get Products
```typescript
import { getProducts, getProductBySlug, getBestSellers } from '@/lib/supabase/queries'

// Get all active products
const products = await getProducts()

// Get with filtering
const bracelets = await getProducts({ category: 'Bracelets' })
const protectionItems = await getProducts({ collection: 'Protection' })

// Get with sorting
const cheapest = await getProducts({ sortBy: 'price-asc' })
const newest = await getProducts({ sortBy: 'newest' })
const topRated = await getProducts({ sortBy: 'rating' })

// Limit results
const featured = await getProducts({ limit: 6 })

// Single product
const product = await getProductBySlug('moonlit-guardian-bracelet')

// Best sellers and new
const bestsellers = await getBestSellers(8)
const newProducts = await getNewArrivals(8)
```

### Get Collections & Categories
```typescript
import { getCollections, getCollectionBySlug, getCategories } from '@/lib/supabase/queries'

const collections = await getCollections()
const category = await getCollectionBySlug('protection')
const categories = await getCategories()
```

### Get Reviews
```typescript
import { getReviewsByProductId } from '@/lib/supabase/queries'

const reviews = await getReviewsByProductId(productId)
```

## Admin Operations (Server Actions)

```typescript
'use client'

import { createProduct, updateProduct, deleteProduct, toggleProductActive } from '@/lib/supabase/admin-actions'

// Create
const formData = new FormData()
formData.append('slug', 'new-product')
formData.append('name', 'New Product')
formData.append('price', '99.99')
formData.append('category', 'Bracelets')
formData.append('collection', 'Protection,Love & Harmony')
// ... more fields ...

const result = await createProduct(formData)
if (result.success) {
  console.log('Created!')
} else {
  console.error(result.error)
}

// Update
const updateResult = await updateProduct(productId, formData)

// Delete
const deleteResult = await deleteProduct(productId)

// Toggle visibility
const toggleResult = await toggleProductActive(productId, false)
```

## Client-Side Auth (Client Components)

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return user ? (
    <>
      <p>Hello {user.email}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </>
  ) : (
    <p>Not logged in</p>
  )
}
```

## Server-Side Auth Checks

```typescript
import { getCurrentUser, isAdmin } from '@/lib/supabase/queries'

// Get current user
const user = await getCurrentUser()
if (!user) {
  // Not authenticated
}

// Check if admin
const adminStatus = await isAdmin()
if (!adminStatus) {
  // Not admin
}
```

## File Locations

| File | Location | Purpose |
|------|----------|---------|
| Client | `src/lib/supabase/client.ts` | Browser client |
| Server | `src/lib/supabase/server.ts` | Server client |
| Middleware | `src/lib/supabase/middleware.ts` | Session helper |
| Middleware Config | `src/middleware.ts` | Next.js middleware |
| Types | `src/lib/supabase/types.ts` | Database types |
| Queries | `src/lib/supabase/queries.ts` | Data fetching |
| Admin | `src/lib/supabase/admin-actions.ts` | CRUD operations |
| Schema | `supabase-schema.sql` | Database schema |
| Seed | `supabase-seed.sql` | Sample data |
| Config | `.env.local` | Environment variables |

## Database Tables

```
profiles (user profiles)
├── id (UUID, PK, FK to auth.users)
├── email (TEXT)
├── full_name (TEXT)
├── role ('customer' or 'admin')
└── timestamps

products (e-commerce products)
├── id (UUID, PK)
├── slug (TEXT, UNIQUE)
├── name, price, compare_at_price
├── category, collection (array)
├── gemstone, symbolic_meaning
├── descriptions, materials, images, badges (arrays)
├── rating, review_count
├── is_best_seller, is_new, is_giftable, is_active (booleans)
└── timestamps

collections (product collections)
├── id (UUID, PK)
├── slug (TEXT, UNIQUE)
├── name, tagline, description, long_description
├── image, symbolism
├── product_count
└── timestamps

categories (product categories)
├── id (UUID, PK)
├── slug (TEXT, UNIQUE)
├── name, image
├── product_count
└── created_at

reviews (product reviews)
├── id (UUID, PK)
├── product_id (UUID, FK)
├── author, rating (1-5), text
├── verified (boolean)
└── created_at
```

## Common Queries

### Get products in a category
```typescript
const products = await getProducts({ category: 'Bracelets' })
```

### Get products in a collection
```typescript
const products = await getProducts({ collection: 'Protection' })
```

### Get sorted products
```typescript
const sorted = await getProducts({ sortBy: 'rating', limit: 10 })
```

### Get single product with reviews
```typescript
const product = await getProductBySlug('moonlit-guardian-bracelet')
const reviews = product ? await getReviewsByProductId(product.id) : []
```

### Get admin status in server component
```typescript
import { isAdmin } from '@/lib/supabase/queries'

const admin = await isAdmin()
if (admin) {
  // Show admin panel
}
```

## Error Handling

All query functions return sensible defaults on error:
- `getProducts()` returns `[]`
- `getProductBySlug()` returns `null`
- `getCollections()` returns `[]`
- `isAdmin()` returns `false`
- Admin actions return `{ success: false, error: '...' }`

All functions log errors to console, so check console for debugging.

## Performance Tips

1. Use server components (default in Next.js 14) for data fetching
2. Only fetch what you need (use limit parameter)
3. Filter at database level (category, collection) not in app
4. Cache queries with Next.js ISR (path revalidation happens automatically)
5. Use getBestSellers() and getNewArrivals() instead of filtering manually

## Security Notes

- Admin checks are enforced server-side in admin actions
- Row Level Security (RLS) enforced at database level
- Session tokens stored in httpOnly cookies
- Never expose service_role key in frontend
- Email address is safe to show (it's public)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid API key" | Check .env.local has correct URL and key from Supabase |
| Products not showing | Check `is_active = true` in database |
| Auth not working | Verify middleware.ts exists at src/middleware.ts |
| Admin actions failing | Make yourself admin with UPDATE query |
| Type errors | Check you're using snake_case in DB, camelCase in code |

## Next Steps

1. Update .env.local
2. Run schema.sql
3. Run seed.sql
4. Make yourself admin
5. Start using queries in server components
6. Add authentication UI
7. Create admin pages with server actions
