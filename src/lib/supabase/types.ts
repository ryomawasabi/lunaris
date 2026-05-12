export type Database = {
  public: {
    Tables: {
      products: {
        Row: DbProduct
        Insert: DbProductInsert
        Update: Partial<DbProductInsert>
      }
      collections: {
        Row: DbCollection
        Insert: DbCollectionInsert
        Update: Partial<DbCollectionInsert>
      }
      categories: {
        Row: DbCategory
        Insert: DbCategoryInsert
        Update: Partial<DbCategoryInsert>
      }
      reviews: {
        Row: DbReview
        Insert: DbReviewInsert
        Update: Partial<DbReviewInsert>
      }
      profiles: {
        Row: DbProfile
        Insert: DbProfileInsert
        Update: Partial<DbProfileInsert>
      }
      blog_posts: {
        Row: DbBlogPost
        Insert: DbBlogPostInsert
        Update: Partial<DbBlogPostInsert>
      }
    }
  }
}

export type DbProfile = {
  id: string
  email: string | null
  full_name: string | null
  role: 'customer' | 'admin'
  created_at: string
  updated_at: string
}

export type DbProfileInsert = {
  id: string
  email?: string | null
  full_name?: string | null
  role?: 'customer' | 'admin'
  created_at?: string
  updated_at?: string
}

export type DbProduct = {
  id: string
  slug: string
  name: string
  price: number
  compare_at_price: number | null
  category: string
  collection: string[]
  gemstone: string
  crystal_type: string
  crystal_effects: string[]
  symbolic_meaning: string
  short_description: string
  long_description: string
  materials: string[]
  images: string[]
  badges: string[]
  rating: number
  review_count: number
  is_best_seller: boolean
  is_new: boolean
  is_giftable: boolean
  is_active: boolean
  is_sold_out: boolean
  created_at: string
  updated_at: string
}

export type DbStone = {
  id: string
  name: string
  is_sold_out: boolean
  created_at: string
  updated_at: string
}

export type DbProductInsert = {
  id?: string
  slug: string
  name: string
  price: number
  compare_at_price?: number | null
  category: string
  collection?: string[]
  gemstone: string
  crystal_type?: string
  crystal_effects?: string[]
  symbolic_meaning: string
  short_description: string
  long_description: string
  materials?: string[]
  images?: string[]
  badges?: string[]
  rating?: number
  review_count?: number
  is_best_seller?: boolean
  is_new?: boolean
  is_giftable?: boolean
  is_active?: boolean
  is_sold_out?: boolean
  created_at?: string
  updated_at?: string
}

export type DbCollection = {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  long_description: string | null
  image: string | null
  symbolism: string | null
  product_count: number
  created_at: string
  updated_at: string
}

export type DbCollectionInsert = {
  id?: string
  slug: string
  name: string
  tagline?: string | null
  description?: string | null
  long_description?: string | null
  image?: string | null
  symbolism?: string | null
  product_count?: number
  created_at?: string
  updated_at?: string
}

export type DbCategory = {
  id: string
  slug: string
  name: string
  image: string | null
  product_count: number
  created_at: string
}

export type DbCategoryInsert = {
  id?: string
  slug: string
  name: string
  image?: string | null
  product_count?: number
  created_at?: string
}

export type DbReview = {
  id: string
  product_id: string | null
  author: string
  rating: number
  text: string | null
  verified: boolean
  created_at: string
}

export type DbReviewInsert = {
  id?: string
  product_id?: string | null
  author: string
  rating: number
  text?: string | null
  verified?: boolean
  created_at?: string
}

export type DbBlogPost = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image: string | null
  category: string | null
  tags: string[]
  author: string
  is_published: boolean
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
  related_products: string[]
  language: string
  created_at: string
  updated_at: string
}

export type DbBlogPostInsert = {
  id?: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  cover_image?: string | null
  category?: string | null
  tags?: string[]
  author?: string
  is_published?: boolean
  published_at?: string | null
  meta_title?: string | null
  meta_description?: string | null
  related_products?: string[]
  language?: string
  created_at?: string
  updated_at?: string
}
