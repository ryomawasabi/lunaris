import { Product, Collection } from "./types";
import { PRODUCTS as STATIC_PRODUCTS, COLLECTIONS as STATIC_COLLECTIONS } from "./data";

/**
 * Merge class names with proper precedence
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format a number as USD currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Get all products in a specific collection
 */
export function getProductsByCollection(slug: string, products: Product[] = STATIC_PRODUCTS, collections: Collection[] = STATIC_COLLECTIONS): Product[] {
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return [];

  return products.filter((product) =>
    product.collection.some((col) =>
      col === collection.name || col.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-') === slug
    )
  );
}

/**
 * Get all products in a specific category
 */
export function getProductsByCategory(slug: string, products: Product[] = STATIC_PRODUCTS): Product[] {
  return products.filter(
    (product) =>
      product.category.toLowerCase().replace(/\s+/g, "-") === slug ||
      product.category.toLowerCase() === slug.replace(/-/g, " ")
  );
}

/**
 * Get a single product by its slug
 */
export function getProductBySlug(slug: string, products: Product[] = STATIC_PRODUCTS): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/**
 * Get a single collection by its slug
 */
export function getCollectionBySlug(slug: string, collections: Collection[] = STATIC_COLLECTIONS): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

/**
 * Get all best-selling products
 */
export function getBestSellers(products: Product[] = STATIC_PRODUCTS): Product[] {
  return products.filter((product) => product.isBestSeller === true).sort(
    (a, b) => b.reviewCount - a.reviewCount
  );
}

/**
 * Get all new arrival products
 */
export function getNewArrivals(products: Product[] = STATIC_PRODUCTS): Product[] {
  return products.filter((product) => product.isNew === true);
}

/**
 * Get related products based on shared characteristics
 * Returns products with matching collection, category, or gemstone
 */
export function getRelatedProducts(
  productId: string,
  limit: number = 4,
  products: Product[] = STATIC_PRODUCTS
): Product[] {
  const product = products.find((p) => p.id === productId);
  if (!product) return [];

  const related = products.filter((p) => {
    if (p.id === productId) return false;

    // Check if they share a collection
    const sharedCollection = p.collection.some((col) =>
      product.collection.includes(col)
    );

    // Check if they share a category
    const sameCategory = p.category === product.category;

    // Check if they share a gemstone
    const sameGemstone = p.gemstone === product.gemstone;

    return sharedCollection || sameCategory || sameGemstone;
  });

  // Sort by relevance (shared collection > shared category > shared gemstone)
  related.sort((a, b) => {
    const aScore =
      (a.collection.some((col) => product.collection.includes(col)) ? 3 : 0) +
      (a.category === product.category ? 2 : 0) +
      (a.gemstone === product.gemstone ? 1 : 0);

    const bScore =
      (b.collection.some((col) => product.collection.includes(col)) ? 3 : 0) +
      (b.category === product.category ? 2 : 0) +
      (b.gemstone === product.gemstone ? 1 : 0);

    return bScore - aScore;
  });

  return related.slice(0, limit);
}

/**
 * Filter products based on various criteria
 */
export function filterProducts(options: {
  category?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price-asc" | "price-desc" | "rating" | "newest" | "bestsellers";
}, products: Product[] = STATIC_PRODUCTS, collections: Collection[] = STATIC_COLLECTIONS): Product[] {
  let filtered = [...products];

  // Filter by category
  if (options.category) {
    filtered = filtered.filter(
      (product) =>
        product.category.toLowerCase().replace(/\s+/g, "-") ===
        options.category?.toLowerCase()
    );
  }

  // Filter by collection
  if (options.collection) {
    filtered = filtered.filter((product) =>
      product.collection.some(
        (col) =>
          collections.find((c) => c.slug === col)?.slug ===
          options.collection?.toLowerCase()
      )
    );
  }

  // Filter by price range
  if (options.minPrice !== undefined) {
    filtered = filtered.filter((product) => product.price >= options.minPrice!);
  }

  if (options.maxPrice !== undefined) {
    filtered = filtered.filter((product) => product.price <= options.maxPrice!);
  }

  // Sort results
  if (options.sortBy) {
    switch (options.sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered = filtered.filter((p) => p.isNew).concat(filtered.filter((p) => !p.isNew));
        break;
      case "bestsellers":
        filtered = filtered.filter((p) => p.isBestSeller).concat(filtered.filter((p) => !p.isBestSeller));
        break;
    }
  }

  return filtered;
}
