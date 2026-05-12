'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Gem } from 'lucide-react';

interface PlaceholderImageProps {
  width?: string;
  height?: string;
  text?: string;
  className?: string;
  src?: string;
  alt?: string;
  priority?: boolean;
  sizes?: string;
}

export default function PlaceholderImage({
  width = 'w-full',
  height = 'h-64',
  text,
  className = '',
  src,
  alt = 'Image',
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: PlaceholderImageProps) {
  const [imageError, setImageError] = useState(false);

  // If src is provided and hasn't failed to load, render the optimized image
  if (src && !imageError) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Fallback to gradient placeholder
  return (
    <div
      className={`placeholder-image ${width} ${height} rounded ${className}`}
    >
      <div className="flex flex-col items-center justify-center gap-3 text-warm">
        <Gem size={32} className="opacity-70" />
        {text && (
          <p className="text-sm font-sans text-warm/70">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
