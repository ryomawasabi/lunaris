export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  collection: string[];
  gemstone: string;
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
