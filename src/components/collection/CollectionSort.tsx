'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface CollectionSortProps {
  productCount: number;
}

export function CollectionSort({ productCount }: CollectionSortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'featured';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (sort === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', sort);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-8 border-b border-stone">
      <p className="font-sans text-sm text-warm uppercase tracking-wider">
        {productCount} piece{productCount !== 1 ? 's' : ''} in this collection
      </p>

      <div className="flex items-center gap-3">
        <label htmlFor="sort" className="font-sans text-sm text-warm uppercase tracking-wider">
          Sort by
        </label>
        <select
          id="sort"
          value={currentSort}
          onChange={handleSortChange}
          className={cn(
            "font-sans text-sm px-4 py-2 border border-warm/30 rounded",
            "bg-cream text-dark",
            "hover:border-warm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent",
            "cursor-pointer"
          )}
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  );
}
