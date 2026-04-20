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

  const ogImage = product.images?.[0] || '/og-image.jpg'

  return {
    title: `${product.name} | YINYANG GUARDIAN`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | YINYANG GUARDIAN`,
      description: product.shortDescription,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription,
      images: [ogImage],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  // JSON-LD structured data for Google rich results
  const jsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.shortDescription,
        image: product.images?.[0],
        url: `https://yinyangguardian.com/products/${product.slug}`,
        brand: {
          '@type': 'Brand',
          name: 'YINYANG GUARDIAN',
        },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'USD',
          availability: product.isSoldOut
            ? 'https://schema.org/OutOfStock'
            : 'https://schema.org/InStock',
          url: `https://yinyangguardian.com/products/${product.slug}`,
        },
        ...(product.rating > 0
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.reviewCount || 1,
              },
            }
          : {}),
        material: product.materials?.join(', '),
        category: product.category,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailContent />
    </>
  );
}
