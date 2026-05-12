import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Custom Gift Box — Build Your Crystal Gift Set',
  description: 'Create a personalized crystal gift box. Choose from zodiac-matched power stones and crystal essences to build a unique, meaningful gift set from YINYANG GUARDIAN.',
  alternates: {
    canonical: 'https://yinyangguardian.com/gift-box',
  },
  openGraph: {
    title: 'Custom Crystal Gift Box | YINYANG GUARDIAN',
    description: 'Build a personalized crystal gift set with zodiac-matched power stones.',
  },
}

export default function GiftBoxLayout({ children }: { children: React.ReactNode }) {
  return children
}
