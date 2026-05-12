import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — Our Story & Philosophy',
  description: 'Learn about YINYANG GUARDIAN — handcrafted crystal jewelry rooted in ancient yin-yang wisdom, designed to align chakras and restore balance to body, mind, and spirit.',
  alternates: {
    canonical: 'https://yinyangguardian.com/about',
  },
  openGraph: {
    title: 'About YINYANG GUARDIAN',
    description: 'Crystal jewelry rooted in ancient yin-yang wisdom, designed to align chakras and restore balance.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
