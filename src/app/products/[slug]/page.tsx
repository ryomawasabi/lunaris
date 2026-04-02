import { Metadata } from 'next';
import { getProductBySlug } from '@/lib/utils';
import ProductDetailContent from './ProductDetailContent';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | YINYANG GUARDIAN',
    };
  }

  return {
    title: `${product.name} | YINYANG GUARDIAN`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      type: 'website',
    },
  };
}

export default function ProductDetailPage() {
  return <ProductDetailContent />;
}
