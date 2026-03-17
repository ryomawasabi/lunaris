'use client';

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // 0-5 with half stars supported
  count?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showCount?: boolean;
}

export function StarRating({
  rating,
  count,
  size = "md",
  className,
  showCount = false,
}: StarRatingProps) {
  const sizeMap = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const stars = Array.from({ length: 5 }, (_, i) => {
    const starValue = i + 1;
    const isFilled = rating >= starValue;
    const isHalf = rating > i && rating < starValue;

    return (
      <div key={i} className="relative inline-block">
        {/* Empty star background */}
        <Star
          className={cn(sizeMap[size], "text-stone fill-stone")}
        />
        {/* Filled star overlay */}
        {(isFilled || isHalf) && (
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: isFilled ? "100%" : "50%" }}
          >
            <Star
              className={cn(sizeMap[size], "text-gold fill-gold")}
            />
          </div>
        )}
      </div>
    );
  });

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-0.5">{stars}</div>
      {showCount && count !== undefined && (
        <span className="text-xs text-stone ml-1">({count})</span>
      )}
    </div>
  );
}
