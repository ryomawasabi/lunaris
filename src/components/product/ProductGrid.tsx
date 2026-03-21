'use client'

import { motion } from 'framer-motion'
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
} as const

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
    <motion.div
      className={cn(
        "grid grid-cols-1",
        colsMap[columns],
        "gap-6 md:gap-8",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
