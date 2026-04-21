export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  collection: string[];
  gemstone: string;
  crystalType: string;       // Normalized crystal name for matching (e.g. "Rose Quartz")
  crystalEffects: string[];  // Effects/benefits (e.g. ["Love", "Healing", "Compassion"])
  symbolicMeaning: string;
  shortDescription: string;
  longDescription: string;
  materials: string[];
  images: string[];
  badges: string[];
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  isGiftable?: boolean;
  isHidden?: boolean;
  isSoldOut?: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  image: string;
  symbolism: string;
  productCount: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  image: string;
  productCount: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  isPublished: boolean;
  publishedAt: string | null;
  metaTitle: string;
  metaDescription: string;
  relatedProducts: string[];
  createdAt: string;
  updatedAt: string;
}
