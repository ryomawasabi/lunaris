import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gift Guide — Meaningful Crystal Jewelry Gifts',
  description: 'Find the perfect meaningful gift. Crystal jewelry handcrafted with intention — bracelets, essence oils, and crystal balls that carry spiritual significance and natural gemstone energy.',
  alternates: {
    canonical: 'https://yinyangguardian.com/gifts',
  },
  openGraph: {
    title: 'Gift Guide | YINYANG GUARDIAN',
    description: 'Meaningful crystal jewelry gifts handcrafted with intention and natural gemstones.',
  },
}

export default function GiftsLayout({ children }: { children: React.ReactNode }) {
  return children
}
