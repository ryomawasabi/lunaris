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
