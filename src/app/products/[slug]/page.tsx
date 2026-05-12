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
    title: `${product.name} — ${product.gemstone || 'Crystal'} Jewelry`,
    description: `${product.shortDescription} Shop ${product.name} from YINYANG GUARDIAN. ${product.gemstone ? `Features natural ${product.gemstone}.` : ''} Free shipping on orders over $100.`,
    alternates: {
      canonical: `https://yinyangguardian.com/products/${slug}`,
    },
    openGraph: {
      title: `${product.name} | YINYANG GUARDIAN`,
      description: product.shortDescription,
      type: 'website',
      url: `https://yinyangguardian.com/products/${slug}`,
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
        image: product.images?.map(img => img.startsWith('http') ? img : `https://yinyangguardian.com${img}`),
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
          seller: {
            '@type': 'Organization',
            name: 'YINYANG GUARDIAN',
          },
          ...(product.compareAtPrice && product.compareAtPrice > product.price
            ? { priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
            : {}),
        },
        ...(product.rating > 0
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.reviewCount || 1,
                bestRating: 5,
                worstRating: 1,
              },
            }
          : {}),
        material: product.materials?.join(', '),
        category: product.category,
        ...(product.gemstone ? { additionalProperty: { '@type': 'PropertyValue', name: 'Gemstone', value: product.gemstone } } : {}),
      }
    : null;

  const breadcrumbLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://yinyangguardian.com' },
          { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://yinyangguardian.com/products' },
          { '@type': 'ListItem', position: 3, name: product.name, item: `https://yinyangguardian.com/products/${product.slug}` },
        ],
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
      {breadcrumbLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      )}
      <ProductDetailContent />
    </>
  );
}
