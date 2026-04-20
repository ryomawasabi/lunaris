import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/login', '/signup', '/checkout/', '/orders/', '/wishlist'],
      },
    ],
    sitemap: 'https://yinyangguardian.com/sitemap.xml',
  }
}
