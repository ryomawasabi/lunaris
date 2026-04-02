'use client';

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import PlaceholderImage from "@/components/layout/PlaceholderImage";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";
import { useProductStatusSafe } from "@/components/providers/ProductStatusProvider";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const productStatus = useProductStatusSafe();
  const status = productStatus?.getStatus(product.id);
  const isSoldOut = status?.isSoldOut || product.isSoldOut;
  const isHidden = status?.isHidden || product.isHidden;

  // Don't render hidden products
  if (isHidden) return null;

  const hasComparePrice = product.compareAtPrice && product.compareAtPrice > product.price;

  // Determine which badges to show
  const badgesToShow: Array<{ variant: 'bestseller' | 'new' | 'giftable' | 'sale'; label: string }> = [];
  if (product.isBestSeller) badgesToShow.push({ variant: "bestseller", label: "Best Seller" });
  if (product.isNew) badgesToShow.push({ variant: "new", label: "New" });
  if (product.isGiftable) badgesToShow.push({ variant: "giftable", label: "Giftable" });
  if (hasComparePrice) badgesToShow.push({ variant: "sale", label: "Sale" });

  return (
    <Link href={`/products/${product.slug}`}>
      <div className={cn("group relative flex flex-col h-full rounded-lg transition-all duration-500", isSoldOut && "opacity-70")}>
        {/* Aurora Gradient Border - visible on hover */}
        <div className="absolute -inset-[1px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0 aurora-border" />
        {/* Aurora Glow Effect */}
        <div className="absolute -inset-[2px] rounded-lg opacity-0 group-hover:opacity-60 blur-md transition-opacity duration-700 z-0 aurora-border" />
        {/* Card background to sit above glow */}
        <div className="relative z-10 flex flex-col h-full rounded-lg bg-white overflow-hidden">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-stone-light mb-4 aspect-square">
          <div className={cn("w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out", isSoldOut && "grayscale-[30%]")}>
            <PlaceholderImage width="w-full" height="h-full" text={product.name} className="w-full h-full" src={product.images[0]} alt={product.name} />
          </div>

          {/* Sold Out Overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark/20 z-20">
              <span className="bg-dark/80 text-cream px-4 py-2 font-sans text-sm font-semibold uppercase tracking-wider rounded">
                Sold Out
              </span>
            </div>
          )}

          {/* Badges - Top Left */}
          {badgesToShow.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {badgesToShow.map((badge) => (
                <Badge key={badge.label} variant={badge.variant}>
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}

          {/* Wishlist Heart - Top Right */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorited(!isFavorited);
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
            aria-label="Add to favorites"
          >
            <Heart
              className={cn("w-5 h-5 transition-colors", isFavorited ? "fill-red-500 text-red-500" : "text-dark")}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-3 pb-4">
          {/* Product Name */}
          <h3 className="font-serif text-sm md:text-base text-dark mb-2 group-hover:underline transition-all">
            {product.name}
          </h3>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="mb-3">
              <StarRating rating={product.rating} count={product.reviewCount} size="sm" showCount />
            </div>
          )}

          {/* Gemstone Tag */}
          <p className="text-xs text-warm uppercase tracking-wider mb-2">
            {product.gemstone}
          </p>

          {/* Symbolic Meaning */}
          <p className="text-xs text-stone mb-4 flex-1 line-clamp-2">
            {product.symbolicMeaning}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg text-dark">
              {formatPrice(product.price)}
            </span>
            {hasComparePrice && product.compareAtPrice && (
              <span className="text-xs text-stone line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
        </div>{/* close card background */}
      </div>
    </Link>
  );
}
