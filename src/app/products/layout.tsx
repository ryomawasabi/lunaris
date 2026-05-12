import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop Crystal Jewelry — Bracelets, Essence Oils & Crystal Balls',
  description: 'Browse our handcrafted crystal jewelry collection. Crystal bracelets, essence oils, and divination spheres made with natural gemstones like Rose Quartz, Amethyst, and Citrine. Free shipping over $100.',
  alternates: {
    canonical: 'https://yinyangguardian.com/products',
  },
  openGraph: {
    title: 'Shop All Crystal Jewelry | YINYANG GUARDIAN',
    description: 'Handcrafted crystal jewelry with natural gemstones. Bracelets, essence oils, and crystal balls for chakra alignment.',
  },
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children
}
