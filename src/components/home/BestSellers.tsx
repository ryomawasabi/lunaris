'use client'

import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getBestSellers } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useProductStatus } from "@/components/providers/ProductStatusProvider";

export function BestSellers() {
  const { products } = useProductStatus();
  const bestSellers = getBestSellers(products).slice(0, 4);

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          subtitle="Most Powerful Pieces"
          title="Best Sellers"
          align="center"
        />

        <ProductGrid products={bestSellers} columns={4} className="mb-12" />

        <div className="flex justify-center">
          <Button
            href="/products?sort=bestsellers"
            variant="secondary"
            size="md"
          >
            View All Best Sellers
          </Button>
        </div>
      </div>
    </section>
  );
}
