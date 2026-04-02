import { Metadata } from 'next';
import { CrystalQuiz } from '@/components/quiz/CrystalQuiz';

export const metadata: Metadata = {
  title: 'Discover Your Crystal Energy | YINYANG GUARDIAN',
  description: 'Enter your date of birth and discover the crystals that resonate with your unique zodiac energy. Find your perfect spiritual companion.',
};

export default function CrystalQuizPage() {
  return <CrystalQuiz />;
}
