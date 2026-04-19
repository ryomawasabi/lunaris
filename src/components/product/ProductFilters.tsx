'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useProductStatus } from '@/components/providers/ProductStatusProvider';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  className?: string;
}

const PRICE_RANGES = [
  { label: 'Under $75', min: 0, max: 75 },
  { label: '$75 - $150', min: 75, max: 150 },
  { label: '$150 - $250', min: 150, max: 250 },
  { label: 'Over $250', min: 250, max: Infinity },
];

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'bestsellers', label: 'Best Selling' },
];

export function ProductFilters({ className }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { categories, collections } = useProductStatus();

  const currentCategory = searchParams.get('category');
  const currentCollection = searchParams.get('collection');
  const currentPriceRange = searchParams.get('priceRange');
  const currentSort = searchParams.get('sort') || '';

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearAll = () => {
    router.push(pathname);
  };

  const hasActiveFilters = currentCategory || currentCollection || currentPriceRange || currentSort;

  return (
    <div className={cn('w-full', className)}>
      {/* Sort Dropdown */}
      <div className="mb-8 pb-8 border-b border-stone-light">
        <label className="block text-sm font-sans font-medium text-dark mb-3">
          Sort By
        </label>
        <select
          value={currentSort}
          onChange={(e) => handleFilterChange('sort', e.target.value || null)}
          className="w-full px-4 py-2 border border-stone rounded bg-white text-sm font-sans focus:outline-none focus:border-dark transition-colors"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-8 pb-8 border-b border-stone-light">
        <h3 className="text-sm font-sans font-medium text-dark mb-4">Category</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={currentCategory === category.slug}
                onChange={(e) =>
                  handleFilterChange('category', e.target.checked ? category.slug : null)
                }
                className="w-4 h-4 rounded border-stone accent-gold cursor-pointer"
              />
              <span className="ml-3 text-sm text-warm group-hover:text-dark transition-colors">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Collection Filter */}
      <div className="mb-8 pb-8 border-b border-stone-light">
        <h3 className="text-sm font-sans font-medium text-dark mb-4">Collection</h3>
        <div className="space-y-3">
          {collections.map((collection) => (
            <label key={collection.id} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={currentCollection === collection.slug}
                onChange={(e) =>
                  handleFilterChange('collection', e.target.checked ? collection.slug : null)
                }
                className="w-4 h-4 rounded border-stone accent-gold cursor-pointer"
              />
              <span className="ml-3 text-sm text-warm group-hover:text-dark transition-colors">
                {collection.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-8 pb-8 border-b border-stone-light">
        <h3 className="text-sm font-sans font-medium text-dark mb-4">Price Range</h3>
        <div className="space-y-3">
          {PRICE_RANGES.map((range) => (
            <label
              key={range.label}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="radio"
                name="priceRange"
                checked={currentPriceRange === `${range.min}-${range.max}`}
                onChange={() =>
                  handleFilterChange(
                    'priceRange',
                    `${range.min}-${range.max}`
                  )
                }
                className="w-4 h-4 rounded-full border-stone accent-gold cursor-pointer"
              />
              <span className="ml-3 text-sm text-warm group-hover:text-dark transition-colors">
                {range.label}
              </span>
            </label>
          ))}
          {currentPriceRange && (
            <button
              onClick={() => handleFilterChange('priceRange', null)}
              className="text-xs text-warm hover:text-dark transition-colors font-medium"
            >
              Clear Price Filter
            </button>
          )}
        </div>
      </div>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <button
          onClick={handleClearAll}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-stone rounded text-sm font-sans font-medium text-dark hover:bg-stone/5 transition-colors"
        >
          <X className="w-4 h-4" />
          Clear All Filters
        </button>
      )}
    </div>
  );
}
