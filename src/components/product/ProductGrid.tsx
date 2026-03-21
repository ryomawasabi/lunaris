import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ProductGrid({
  products,
  columns = 3,
  className,
}: ProductGridProps) {
  const colsMap = {
    2: "sm:grid-cols-2 lg:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1",
        colsMap[columns],
        "gap-6 md:gap-8",
        className
      )}
    >
      {products.map((product, i) => (
        <div
          key={product.id}
          className="animate-fadeInUp"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
