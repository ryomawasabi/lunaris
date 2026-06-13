import type { Metadata } from 'next';
import { BaziQuiz } from '@/components/bazi/BaziQuiz';
import { BaziHeader } from '@/components/bazi/BaziHeader';

export const metadata: Metadata = {
  title: 'Discover Your Guardian — Real Birth-Chart Reading | YINYANG GUARDIAN',
  description:
    'Your zodiac tells you which of twelve groups you fall in. Your Bazi — your real birth chart, computed from the solar terms — tells you who you are. Find your guardian and your stone.',
  alternates: { canonical: 'https://yinyangguardian.com/bazi' },
  openGraph: {
    title: 'Discover Your Guardian — Real Birth-Chart Reading',
    description:
      'A real computed Bazi chart, not an intent quiz. Find your four pillars, your missing element, your guardian, and your stone.',
    type: 'website',
  },
};

export default function BaziPage() {
  return (
    <div className="min-h-screen bg-bazi-ink texture-noise-dark">
      <BaziHeader />
      <main>
        <BaziQuiz />
      </main>
    </div>
  );
}
