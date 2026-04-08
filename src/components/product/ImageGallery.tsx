'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import PlaceholderImage from '@/components/layout/PlaceholderImage';

interface ImageGalleryProps {
  images?: string[];
  productName: string;
  imageCount?: number;
  className?: string;
}

export function ImageGallery({
  images = [],
  productName,
  imageCount = 4,
  className,
}: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Use provided images or create array of indices for thumbnail cycling
  const displayImages = images.length > 0 ? images : Array.from({ length: Math.min(4, imageCount) }, (_, i) => `image-${i}`);
  const thumbnailIndices = Array.from({ length: Math.min(4, displayImages.length) }, (_, i) => i);

  const selectedImage = displayImages[selectedImageIndex];

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Main Image */}
      <div className="relative bg-stone-light rounded-lg overflow-hidden aspect-square">
        <PlaceholderImage
          width="w-full"
          height="h-full"
          text={`${productName} - View ${selectedImageIndex + 1}`}
          className="w-full h-full"
          src={typeof selectedImage === 'string' && (selectedImage.startsWith('http') || selectedImage.startsWith('data:') || selectedImage.startsWith('/')) ? selectedImage : undefined}
          alt={`${productName} image ${selectedImageIndex + 1}`}
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3">
        {thumbnailIndices.map((index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={cn(
              'relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
              selectedImageIndex === index
                ? 'border-dark'
                : 'border-stone-light hover:border-stone'
            )}
            aria-label={`View image ${index + 1}`}
          >
            <PlaceholderImage
              width="w-full"
              height="h-full"
              text={`${index + 1}`}
              className="w-full h-full"
              src={typeof displayImages[index] === 'string' && (displayImages[index].startsWith('http') || displayImages[index].startsWith('data:') || displayImages[index].startsWith('/')) ? displayImages[index] : undefined}
              alt={`${productName} thumbnail ${index + 1}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
