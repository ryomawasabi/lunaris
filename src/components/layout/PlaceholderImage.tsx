'use client';

import { useState } from 'react';
import { Gem } from 'lucide-react';

interface PlaceholderImageProps {
  width?: string;
  height?: string;
  text?: string;
  className?: string;
  src?: string;
  alt?: string;
}

export default function PlaceholderImage({
  width = 'w-full',
  height = 'h-64',
  text,
  className = '',
  src,
  alt = 'Image',
}: PlaceholderImageProps) {
  const [imageError, setImageError] = useState(false);

  // If src is provided and hasn't failed to load, render the image
  if (src && !imageError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover ${className}`}
        onError={() => setImageError(true)}
      />
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
