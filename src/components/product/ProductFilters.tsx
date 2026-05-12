'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useProductStatus } from '@/components/providers/ProductStatusProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  className?: string;
}

export function ProductFilters({ className }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { categories, collections } = useProductStatus();
  const { t } = useLanguage();
  const { translateCategory, translateCollection } = useProductTranslation();

  const PRICE_RANGES = [
    { label: t('products.priceUnder75'), min: 0, max: 75 },
    { label: t('products.price75to150'), min: 75, max: 150 },
    { label: t('products.price150to250'), min: 150, max: 250 },
    { label: t('products.priceOver250'), min: 250, max: Infinity },
  ];

  const SORT_OPTIONS = [
    { value: '', label: t('products.sortFeatured') },
    { value: 'price-asc', label: t('products.sortPriceLow') },
    { value: 'price-desc', label: t('products.sortPriceHigh') },
    { value: 'newest', label: t('products.sortNewest') },
    { value: 'bestsellers', label: t('products.sortBestSelling') },
  ];

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
          {t('products.sortBy')}
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
        <h3 className="text-sm font-sans font-medium text-dark mb-4">{t('products.category')}</h3>
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
                {translateCategory(category.name)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-8 pb-8 border-b border-stone-light">
        <h3 className="text-sm font-sans font-medium text-dark mb-4">{t('products.priceRange')}</h3>
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
              {t('products.clearPriceFilter')}
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
          {t('products.clearAllFilters')}
        </button>
      )}
    </div>
  );
}
