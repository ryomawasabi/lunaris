'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { SectionTitle } from "@/components/ui/SectionTitle";
import PlaceholderImage from "@/components/layout/PlaceholderImage";
import { cn } from '@/lib/utils';

export function UGCSection() {
  const tiles = Array.from({ length: 6 }, (_, i) => i + 1);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Channeling Energy"
          subtitle="#YINYANGGUARDIAN"
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {tiles.map((id) => (
            <div
              key={id}
              className="relative aspect-square overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image */}
              <div className="absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-300">
                <PlaceholderImage
                  width="w-full"
                  height="h-full"
                  className="w-full h-full"
                />
              </div>

              {/* Hover Overlay */}
              <div
                className={cn(
                  "absolute inset-0 bg-dark/60 flex items-center justify-center transition-opacity duration-300",
                  hoveredId === id ? "opacity-100" : "opacity-0"
                )}
              >
                <Heart className="w-8 h-8 text-cream fill-cream" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
