'use client'

import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getNewArrivals } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useProductStatus } from "@/components/providers/ProductStatusProvider";
import { useLanguage } from '@/components/providers/LanguageProvider';

export function NewArrivals() {
  const { products } = useProductStatus();
  const { t } = useLanguage();
  const newArrivals = getNewArrivals(products).slice(0, 4);

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-cream">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          subtitle={t('home.newArrivals.section')}
          title={t('home.newArrivals.title')}
          align="center"
        />

        <ProductGrid products={newArrivals} columns={4} className="mb-12" />

        <div className="flex justify-center">
          <Button
            href="/products?sort=newest"
            variant="secondary"
            size="md"
          >
            {t('home.newArrivals.viewAll')}
          </Button>
        </div>
      </div>
    </section>
  );
}
