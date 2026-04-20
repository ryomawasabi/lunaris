import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop All | YINYANG GUARDIAN',
  description: 'Explore our full collection of meaningful luxury jewelry. Each piece features natural gemstones and spiritual symbolism for protection, love, and personal transformation.',
  openGraph: {
    title: 'Shop All | YINYANG GUARDIAN',
    description: 'Explore our full collection of meaningful luxury jewelry with natural gemstones.',
  },
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children
}
